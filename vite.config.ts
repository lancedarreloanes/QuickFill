import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

const CLOUD_DB_PATH = path.resolve(process.cwd(), 'cloud-db.json');

function readJsonBody(req: import('node:http').IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function refillaCloudSyncPlugin(): Plugin {
  return {
    name: 'refilla-cloud-sync-api',
    configureServer(server) {
      // 1. Real-Time Cloud Storage Sync Endpoint
      server.middlewares.use('/api/cloud', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method === 'GET') {
          try {
            if (fs.existsSync(CLOUD_DB_PATH)) {
              const raw = fs.readFileSync(CLOUD_DB_PATH, 'utf-8');
              res.statusCode = 200;
              res.end(raw);
              return;
            }
          } catch {
            // fallback empty
          }
          res.statusCode = 200;
          res.end(JSON.stringify({ empty: true }));
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              fs.writeFileSync(CLOUD_DB_PATH, JSON.stringify(parsed, null, 2), 'utf-8');
              res.statusCode = 200;
              res.end(JSON.stringify({ ok: true, updatedAt: parsed.updatedAt }));
            } catch (err) {
              res.statusCode = 400;
              res.end(JSON.stringify({ ok: false, error: String(err) }));
            }
          });
          return;
        }

        res.statusCode = 405;
        res.end(JSON.stringify({ error: 'Method not allowed' }));
      });

      // 2. Real-Life PayMongo GCash / QR Ph Live Payment Creation Endpoint
      server.middlewares.use('/api/paymongo/create', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        try {
          const payload = await readJsonBody(req);
          const secretKey = String(payload.secretKey || process.env.PAYMONGO_SECRET_KEY || '').trim();
          const amountPesos = Number(payload.amount || 0);
          const description = String(payload.description || 'Refilla QuickFill Kart Order');
          const customerName = String(payload.customerName || 'Refilla Customer');
          const customerEmail = String(payload.customerEmail || 'customer@quickfill.ph');
          const customerPhone = String(payload.customerPhone || '09171234567');

          if (!secretKey) {
            res.statusCode = 400;
            res.end(JSON.stringify({
              ok: false,
              error: 'No PayMongo Secret API Key configured yet. Add your sk_live_... key in Seller GCash Settings.'
            }));
            return;
          }

          const authHeader = 'Basic ' + Buffer.from(`${secretKey}:`).toString('base64');
          const amountCentavos = Math.max(10000, Math.round(amountPesos * 100));

          // Attempt Dynamic QR Ph Payment Intent first (generates real scannable InstaPay/GCash QR)
          const piRes = await fetch('https://api.paymongo.com/v1/payment_intents', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: authHeader
            },
            body: JSON.stringify({
              data: {
                attributes: {
                  amount: amountCentavos,
                  payment_method_allowed: ['qrph', 'gcash', 'paymaya'],
                  currency: 'PHP',
                  capture_type: 'automatic',
                  description
                }
              }
            })
          });

          const piData = (await piRes.json()) as Record<string, any>;
          if (piRes.ok && piData?.data?.id) {
            const intentId = piData.data.id;

            // Create QR Ph payment method and attach to get real-time scannable QR image
            const pmRes = await fetch('https://api.paymongo.com/v1/payment_methods', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: authHeader
              },
              body: JSON.stringify({
                data: {
                  attributes: {
                    type: 'qrph',
                    billing: {
                      name: customerName,
                      email: customerEmail,
                      phone: customerPhone
                    }
                  }
                }
              })
            });
            const pmData = (await pmRes.json()) as Record<string, any>;

            if (pmRes.ok && pmData?.data?.id) {
              const attachRes = await fetch(`https://api.paymongo.com/v1/payment_intents/${intentId}/attach`, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: authHeader
                },
                body: JSON.stringify({
                  data: {
                    attributes: {
                      payment_method: pmData.data.id
                    }
                  }
                })
              });
              const attachData = (await attachRes.json()) as Record<string, any>;
              const qrCodeUrl = attachData?.data?.attributes?.next_action?.code?.image_url;

              if (attachRes.ok && qrCodeUrl) {
                res.statusCode = 200;
                res.end(JSON.stringify({
                  ok: true,
                  mode: 'qrph',
                  intentId,
                  qrImageUrl: qrCodeUrl
                }));
                return;
              }
            }

            // Fallback: Create PayMongo Checkout Session (supports GCash / Maya direct redirect + webhook polling)
            const csRes = await fetch('https://api.paymongo.com/v1/checkout_sessions', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: authHeader
              },
              body: JSON.stringify({
                data: {
                  attributes: {
                    send_email_receipt: true,
                    show_description: true,
                    show_line_items: true,
                    description,
                    payment_method_types: ['gcash', 'paymaya', 'qrph'],
                    line_items: [
                      {
                        currency: 'PHP',
                        amount: amountCentavos,
                        description,
                        name: 'Refilla Order',
                        quantity: 1
                      }
                    ]
                  }
                }
              })
            });
            const csData = (await csRes.json()) as Record<string, any>;
            if (csRes.ok && csData?.data?.id) {
              res.statusCode = 200;
              res.end(JSON.stringify({
                ok: true,
                mode: 'checkout_session',
                sessionId: csData.data.id,
                checkoutUrl: csData.data.attributes?.checkout_url
              }));
              return;
            }
          }

          res.statusCode = 400;
          res.end(JSON.stringify({
            ok: false,
            error: piData?.errors?.[0]?.detail || 'Failed to initialize PayMongo GCash transaction.'
          }));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ ok: false, error: String(err) }));
        }
      });

      // 3. Real-Life PayMongo Live Transaction Status Polling Endpoint
      server.middlewares.use('/api/paymongo/status', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        try {
          const payload = await readJsonBody(req);
          const secretKey = String(payload.secretKey || process.env.PAYMONGO_SECRET_KEY || '').trim();
          const intentId = String(payload.intentId || '').trim();
          const sessionId = String(payload.sessionId || '').trim();

          if (!secretKey) {
            res.statusCode = 400;
            res.end(JSON.stringify({ ok: false, paid: false }));
            return;
          }

          const authHeader = 'Basic ' + Buffer.from(`${secretKey}:`).toString('base64');

          if (intentId) {
            const checkRes = await fetch(`https://api.paymongo.com/v1/payment_intents/${intentId}`, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                Authorization: authHeader
              }
            });
            const checkData = (await checkRes.json()) as Record<string, any>;
            const status = checkData?.data?.attributes?.status;
            const payments = checkData?.data?.attributes?.payments || [];
            if (status === 'succeeded' || payments.some((p: any) => p?.attributes?.status === 'paid')) {
              const paymentId = payments[0]?.id || intentId;
              res.statusCode = 200;
              res.end(JSON.stringify({
                ok: true,
                paid: true,
                referenceNumber: paymentId.toUpperCase()
              }));
              return;
            }
          }

          if (sessionId) {
            const checkRes = await fetch(`https://api.paymongo.com/v1/checkout_sessions/${sessionId}`, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                Authorization: authHeader
              }
            });
            const checkData = (await checkRes.json()) as Record<string, any>;
            const payments = checkData?.data?.attributes?.payments || [];
            const piStatus = checkData?.data?.attributes?.payment_intent?.attributes?.status;
            if (piStatus === 'succeeded' || payments.some((p: any) => p?.attributes?.status === 'paid')) {
              const paymentId = payments[0]?.id || sessionId;
              res.statusCode = 200;
              res.end(JSON.stringify({
                ok: true,
                paid: true,
                referenceNumber: paymentId.toUpperCase()
              }));
              return;
            }
          }

          res.statusCode = 200;
          res.end(JSON.stringify({ ok: true, paid: false }));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ ok: false, paid: false, error: String(err) }));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), refillaCloudSyncPlugin()],
  server: {
    port: 3000,
    host: true
  }
});
