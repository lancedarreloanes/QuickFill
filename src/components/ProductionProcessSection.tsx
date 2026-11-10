import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Cpu,
  Cog,
  Terminal,
  Hammer,
  CheckCircle2,
  PackageCheck,
  Sparkles,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Layers
} from 'lucide-react';
import { NavigationPage } from '../types';

export interface ProductionStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  icon: React.ElementType;
  photos: {
    src: string;
    caption: string;
    aspect?: 'landscape' | 'portrait' | 'square';
  }[];
  highlights: string[];
}

export const PRODUCTION_STEPS: ProductionStep[] = [
  {
    stepNumber: 1,
    title: 'Cleaning and Preparation',
    subtitle: 'Component Inspection & Workspace Organization',
    badge: 'Stage 01 • Prep & QC',
    icon: Wrench,
    description:
      'All tools, materials, and machine components were prepared and organized before assembly. The working area and machine parts were cleaned to remove dust and debris, while electrical and mechanical components were inspected to ensure completeness and proper condition.',
    photos: [
      {
        src: '/images/production/step-photo-1.png',
        caption: 'Step 1: Complete Vending Machine Project Prep Checklist, tools, soldering kit, fasteners, food-grade tubing, and coin slot module.',
        aspect: 'landscape'
      }
    ],
    highlights: [
      'Full inventory verification against the Refilla engineering checklist',
      'Sanitization of food-grade dispensing hoses and fittings',
      'Pre-assembly inspection of fasteners, locks, and coin mechanisms'
    ]
  },
  {
    stepNumber: 2,
    title: 'Electrical Wirings and Assembly',
    subtitle: 'Control Board, Relay & 12V Pump Integration',
    badge: 'Stage 02 • Electronics',
    icon: Cpu,
    description:
      'The electrical system of the machine was assembled by installing the control board, relays, power supply, and wiring connections. Wires were arranged properly and secured to ensure safe and organized electrical connections.',
    photos: [
      {
        src: '/images/production/step-photo-2.png',
        caption: 'Step 2: Precision wiring of the ALLAN timer/relay control board with the diaphragm liquid pump and regulated power supply.',
        aspect: 'portrait'
      }
    ],
    highlights: [
      'Heavy-duty relay and control board assembly for reliable coin-trigger timing',
      'Color-coded, insulated harness routing for safe 220V AC to 12V DC operation',
      'Direct integration with high-precision diaphragm liquid dispensing pump'
    ]
  },
  {
    stepNumber: 3,
    title: 'Components Installation',
    subtitle: 'Sensors, Coin Slot & Lock Hardware Mounting',
    badge: 'Stage 03 • Hardware Fitment',
    icon: Cog,
    description:
      'Different machine components such as sensors, clamp locks, coin slots, and other functional parts were installed into their designated positions. Each component was securely mounted and connected to the electrical system for proper operation.',
    photos: [
      {
        src: '/images/production/step-photo-3.png',
        caption: 'Step 3: Internal cabinet mounting of the coin acceptor, clamp locks, optical sensors, and electrical sub-assemblies.',
        aspect: 'landscape'
      }
    ],
    highlights: [
      'Secure mounting of the multi-coin acceptor slot and anti-tamper clamp locks',
      'Vibration-resistant fastening of internal flow sensors and switches',
      'Clean cable management inside the upper electronics compartment'
    ]
  },
  {
    stepNumber: 4,
    title: 'Software Programming and Testing',
    subtitle: 'Microcontroller Calibration & Sensor Verification',
    badge: 'Stage 04 • Firmware & Calibration',
    icon: Terminal,
    description:
      'The machine was connected to a computer for programming and system configuration. The control program was uploaded to the microcontroller, and initial testing was performed to verify the functions of the sensors, relays, and other machine operations.',
    photos: [
      {
        src: '/images/production/step-photo-4.png',
        caption: 'Step 4: Direct PC connection for uploading the microcontroller firmware and calibrating exact ₱5, ₱8, ₱15, and ₱20 dispense timings.',
        aspect: 'landscape'
      }
    ],
    highlights: [
      'Custom microcontroller code upload for accurate peso coin recognition',
      'Millisecond pump relay calibration for 200 mL, 400 mL, 600 mL, and 1 Liter pours',
      'Live diagnostic bench testing of sensors, digital LED display, and relays'
    ]
  },
  {
    stepNumber: 5,
    title: 'Machine Body Preparation and Assembly',
    subtitle: 'Steel Frame Fabrication & Casing Integration',
    badge: 'Stage 05 • Body & Frame Fabrication',
    icon: Hammer,
    description:
      'The machine frame and external body were fabricated and assembled. Internal components were properly installed inside the casing, and the structure was secured to provide stability, protection, and proper arrangement of the system.',
    photos: [
      {
        src: '/images/production/step-photo-5.png',
        caption: 'Step 5A: Welded tubular steel frame structure engineered for commercial stability and raised floor clearance.',
        aspect: 'portrait'
      },
      {
        src: '/images/production/step-photo-6.png',
        caption: 'Step 5B: External body panel fitting and internal reservoir compartment layout during workshop assembly.',
        aspect: 'portrait'
      },
      {
        src: '/images/production/step-photo-7.png',
        caption: 'Step 5C: Multi-level internal shelving separating electronics on top from the high-capacity liquid reservoir below.',
        aspect: 'portrait'
      }
    ],
    highlights: [
      'Welded square-tube steel skeleton on raised legs with integrated bottle tray',
      'Dual-chamber internal architecture isolating electronics from liquid storage',
      'Durable weather-resistant Eco Green powder/enamel exterior finish'
    ]
  },
  {
    stepNumber: 6,
    title: 'Machine Testing and Final Inspection',
    subtitle: 'Full System Quality Assurance & Reservoir Check',
    badge: 'Stage 06 • Final QA Inspection',
    icon: CheckCircle2,
    description:
      'The completed machine underwent final testing and inspection to check the performance of all electrical, mechanical, and software systems. Necessary adjustments were made, followed by cleaning and documentation to ensure the machine was fully functional and ready for use.',
    photos: [
      {
        src: '/images/production/step-photo-8.png',
        caption: 'Step 6A: Completed Eco Green ReFilla QuickFill Kart undergoing full front-panel coin and dispense verification.',
        aspect: 'portrait'
      },
      {
        src: '/images/production/step-photo-9.png',
        caption: 'Step 6B: Open-door final inspection verifying the internal Brightwash reservoir tank, pump tubing, and electronics bay.',
        aspect: 'portrait'
      }
    ],
    highlights: [
      'End-to-end functional test of electrical, mechanical, and software systems',
      'Leak-free verification of internal Brightwash container and nozzle assembly',
      'Exterior detailing, instruction decal placement, and final QA sign-off'
    ]
  },
  {
    stepNumber: 7,
    title: 'Machine Packaging',
    subtitle: 'Protective Crating & Nationwide Dispatch Prep',
    badge: 'Stage 07 • Ready for Delivery',
    icon: PackageCheck,
    description:
      'The completed QuickFill Kart machine was carefully covered with protective materials to prevent scratches or damage during handling and transportation. It was then securely packed, labeled, and prepared for storage or delivery to the customer.',
    photos: [
      {
        src: '/images/production/step-photo-10.png',
        caption: 'Step 7: Completed QuickFill Kart wrapped in protective material and sealed inside its branded heavy-duty shipping box.',
        aspect: 'square'
      }
    ],
    highlights: [
      'Multi-layer scratch and impact protection around the steel cabinet and nozzle',
      'Heavy-duty corrugated QuickFill shipping box with reinforced strapping',
      'Labeled and staged for safe door-to-door delivery across Luzon, Visayas & Mindanao'
    ]
  }
];

interface ProductionProcessSectionProps {
  onNavigate?: (page: NavigationPage) => void;
  compact?: boolean;
}

export const ProductionProcessSection: React.FC<ProductionProcessSectionProps> = ({
  onNavigate,
  compact = false
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | number>('all');
  const [lightbox, setLightbox] = useState<{
    stepNumber: number;
    stepTitle: string;
    photoIndex: number;
    photos: { src: string; caption: string }[];
  } | null>(null);

  // Close lightbox on Escape or navigate with Left/Right arrows
  useEffect(() => {
    if (!lightbox) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightbox(null);
      } else if (e.key === 'ArrowRight') {
        setLightbox(prev =>
          prev
            ? {
                ...prev,
                photoIndex: (prev.photoIndex + 1) % prev.photos.length
              }
            : null
        );
      } else if (e.key === 'ArrowLeft') {
        setLightbox(prev =>
          prev
            ? {
                ...prev,
                photoIndex: (prev.photoIndex - 1 + prev.photos.length) % prev.photos.length
              }
            : null
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox]);

  const visibleSteps =
    activeFilter === 'all'
      ? PRODUCTION_STEPS
      : PRODUCTION_STEPS.filter(s => s.stepNumber === activeFilter);

  return (
    <section
      id="production-history"
      className={`relative ${
        compact ? 'py-12 sm:py-16' : 'py-16 sm:py-24'
      } bg-gradient-to-b from-[#071f12] via-[#0c2d1b] to-[#081d11] text-white overflow-hidden border-y border-emerald-500/25`}
    >
      {/* Ambient Emerald Workshop Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-green-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/35 text-emerald-300 text-xs font-extrabold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Behind the Scenes • Authentic Engineering History</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            How We Build the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-emerald-400">
              ReFilla QuickFill Kart
            </span>
          </h2>

          <p className="text-sm sm:text-base text-emerald-100/85 leading-relaxed">
            Every <strong className="text-white">QuickFill Kart</strong> is hand-built, wired, programmed, and tested from the ground up by our engineering team. Explore our complete <strong className="text-emerald-300">7-step production process</strong> from raw steel and microcontroller calibration to final packaging.
          </p>

          {/* Summary Stats Strip */}
          <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto pt-2">
            <div className="bg-white/5 backdrop-blur-sm border border-emerald-400/20 rounded-2xl py-3 px-4">
              <div className="text-xl sm:text-2xl font-black text-emerald-300">7 Stages</div>
              <div className="text-[11px] text-emerald-100/75 font-semibold">Documented Build Process</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-emerald-400/20 rounded-2xl py-3 px-4">
              <div className="text-xl sm:text-2xl font-black text-emerald-300">100% Tested</div>
              <div className="text-[11px] text-emerald-100/75 font-semibold">PC-Calibrated Sensors &amp; Pump</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-emerald-400/20 rounded-2xl py-3 px-4">
              <div className="text-xl sm:text-2xl font-black text-emerald-300">Steel Frame</div>
              <div className="text-[11px] text-emerald-100/75 font-semibold">Fabricated &amp; Sealed In-House</div>
            </div>
          </div>
        </div>

        {/* Interactive Step Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25'
                : 'bg-white/10 text-emerald-100 hover:bg-white/15 border border-emerald-400/20'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All 7 Build Steps (10 Photos)</span>
          </button>

          {PRODUCTION_STEPS.map(step => {
            const isSelected = activeFilter === step.stepNumber;
            return (
              <button
                key={step.stepNumber}
                type="button"
                onClick={() => setActiveFilter(step.stepNumber)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/25'
                    : 'bg-white/10 text-emerald-100/90 hover:bg-white/15 border border-emerald-400/20'
                }`}
              >
                Step {step.stepNumber}: {step.title.split(' ')[0]}
              </button>
            );
          })}
        </div>

        {/* 7-Step Production Timeline Cards */}
        <div className="space-y-8">
          {visibleSteps.map((step, idx) => {
            const Icon = step.icon;
            const isEven = idx % 2 === 1;
            const photoCount = step.photos.length;

            return (
              <div
                key={step.stepNumber}
                className="group relative rounded-3xl bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-emerald-950/40 backdrop-blur-md border border-emerald-400/25 hover:border-emerald-400/60 p-6 sm:p-8 lg:p-10 shadow-2xl transition-all duration-300"
              >
                {/* Step Number Watermark */}
                <div className="hidden lg:block absolute top-4 right-8 text-7xl font-black text-white/[0.04] select-none pointer-events-none">
                  0{step.stepNumber}
                </div>

                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Step Narrative Column (5 cols) */}
                  <div
                    className={`lg:col-span-5 space-y-5 ${
                      isEven ? 'lg:order-2' : 'lg:order-1'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 font-black text-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                        {step.stepNumber}
                      </div>
                      <div>
                        <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                          {step.badge}
                        </span>
                        <p className="text-xs text-emerald-200/80 font-medium mt-0.5">
                          {step.subtitle}
                        </p>
                      </div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug flex items-center gap-2.5">
                      <span>
                        Step {step.stepNumber}: {step.title}
                      </span>
                    </h3>

                    {/* Official PDF Description */}
                    <p className="text-sm sm:text-base text-emerald-50/90 leading-relaxed bg-black/20 p-4 rounded-2xl border border-emerald-400/15">
                      {step.description}
                    </p>

                    {/* Engineering Highlights */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300/90 block">
                        Key Engineering Checkpoints:
                      </span>
                      <ul className="space-y-2">
                        {step.highlights.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-100/85">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 flex items-center gap-3 text-xs text-emerald-300/90 font-semibold">
                      <Icon className="w-4 h-4 text-emerald-400" />
                      <span>
                        {photoCount === 1
                          ? '1 Workshop Documentation Photo • Click image to enlarge'
                          : `${photoCount} Workshop Documentation Photos • Click any photo to enlarge`}
                      </span>
                    </div>
                  </div>

                  {/* Step Photo Gallery Column (7 cols) */}
                  <div
                    className={`lg:col-span-7 ${
                      isEven ? 'lg:order-1' : 'lg:order-2'
                    }`}
                  >
                    {photoCount === 1 && (
                      <div
                        onClick={() =>
                          setLightbox({
                            stepNumber: step.stepNumber,
                            stepTitle: step.title,
                            photoIndex: 0,
                            photos: step.photos
                          })
                        }
                        className="group/photo relative rounded-2xl overflow-hidden bg-[#04120a] border-2 border-emerald-400/30 hover:border-emerald-300 shadow-xl cursor-pointer transition-all duration-300"
                      >
                        <div className="aspect-[16/11] sm:aspect-[16/10] w-full flex items-center justify-center p-2 sm:p-4 bg-gradient-to-b from-black/40 to-black/70">
                          <img
                            src={step.photos[0].src}
                            alt={`Step ${step.stepNumber}: ${step.title}`}
                            className="max-h-[380px] w-auto max-w-full object-contain rounded-xl transition-transform duration-500 group-hover/photo:scale-[1.03]"
                            loading="lazy"
                          />
                        </div>

                        {/* Top-left badge */}
                        <div className="absolute top-3 left-3 bg-[#092616]/90 backdrop-blur-md text-emerald-300 text-[11px] font-black px-3 py-1 rounded-full border border-emerald-400/40">
                          Step {step.stepNumber} Photo
                        </div>

                        {/* Top-right Zoom button */}
                        <div className="absolute top-3 right-3 bg-black/70 group-hover/photo:bg-emerald-400 group-hover/photo:text-slate-950 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 transition">
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span>Inspect Photo</span>
                        </div>

                        {/* Bottom Caption */}
                        <div className="px-4 py-3 bg-black/75 border-t border-white/10 text-xs text-emerald-100/90">
                          {step.photos[0].caption}
                        </div>
                      </div>
                    )}

                    {photoCount === 2 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {step.photos.map((photo, pIdx) => (
                          <div
                            key={pIdx}
                            onClick={() =>
                              setLightbox({
                                stepNumber: step.stepNumber,
                                stepTitle: step.title,
                                photoIndex: pIdx,
                                photos: step.photos
                              })
                            }
                            className="group/photo relative rounded-2xl overflow-hidden bg-[#04120a] border-2 border-emerald-400/30 hover:border-emerald-300 shadow-xl cursor-pointer flex flex-col justify-between transition-all duration-300"
                          >
                            <div className="aspect-[3/4] w-full flex items-center justify-center p-3 bg-gradient-to-b from-black/40 to-black/70">
                              <img
                                src={photo.src}
                                alt={`Step ${step.stepNumber} (${pIdx + 1})`}
                                className="w-full h-full object-contain rounded-xl transition-transform duration-500 group-hover/photo:scale-105"
                                loading="lazy"
                              />
                            </div>

                            <div className="absolute top-3 left-3 bg-[#092616]/90 backdrop-blur-md text-emerald-300 text-[11px] font-black px-2.5 py-1 rounded-full border border-emerald-400/40">
                              Step {step.stepNumber} • Photo {pIdx + 1} of {photoCount}
                            </div>

                            <div className="absolute top-3 right-3 bg-black/70 group-hover/photo:bg-emerald-400 group-hover/photo:text-slate-950 text-white p-2 rounded-full transition">
                              <ZoomIn className="w-3.5 h-3.5" />
                            </div>

                            <div className="p-3 bg-black/80 border-t border-white/10 text-[11px] text-emerald-100/90 leading-snug">
                              {photo.caption}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {photoCount === 3 && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        {step.photos.map((photo, pIdx) => (
                          <div
                            key={pIdx}
                            onClick={() =>
                              setLightbox({
                                stepNumber: step.stepNumber,
                                stepTitle: step.title,
                                photoIndex: pIdx,
                                photos: step.photos
                              })
                            }
                            className="group/photo relative rounded-2xl overflow-hidden bg-[#04120a] border-2 border-emerald-400/30 hover:border-emerald-300 shadow-xl cursor-pointer flex flex-col justify-between transition-all duration-300"
                          >
                            <div className="aspect-[3/4] w-full flex items-center justify-center p-2.5 bg-gradient-to-b from-black/40 to-black/70">
                              <img
                                src={photo.src}
                                alt={`Step ${step.stepNumber} (${pIdx + 1})`}
                                className="w-full h-full object-contain rounded-xl transition-transform duration-500 group-hover/photo:scale-105"
                                loading="lazy"
                              />
                            </div>

                            <div className="absolute top-2.5 left-2.5 bg-[#092616]/90 backdrop-blur-md text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                              Photo {pIdx + 1} of 3
                            </div>

                            <div className="absolute top-2.5 right-2.5 bg-black/70 group-hover/photo:bg-emerald-400 group-hover/photo:text-slate-950 text-white p-1.5 rounded-full transition">
                              <ZoomIn className="w-3.5 h-3.5" />
                            </div>

                            <div className="p-3 bg-black/80 border-t border-white/10 text-[11px] text-emerald-100/90 leading-snug">
                              {photo.caption}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        {onNavigate && (
          <div className="rounded-3xl bg-gradient-to-r from-emerald-500/20 via-emerald-400/15 to-emerald-500/20 border border-emerald-400/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300">
                Built With Pride by Refilla
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Ready to Own Your Hand-Built, Calibrated QuickFill Kart?
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/85">
                Every unit passes all 7 production stages and includes a FREE 15-Liter Brightwash Refill Pack.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('shop-machine')}
              className="btn-emerald-shimmer px-7 py-4 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-xl whitespace-nowrap cursor-pointer"
            >
              <span>Order QuickFill Kart (₱7,999)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal for Inspecting Production Photos */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 flex items-center justify-center animate-fadeIn"
          onClick={e => {
            if (e.target === e.currentTarget) setLightbox(null);
          }}
        >
          <div className="relative max-w-4xl w-full bg-[#071d10] border border-emerald-400/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-black/60 border-b border-emerald-500/20 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 block">
                  Step {lightbox.stepNumber} of 7 • Official Production Archive
                </span>
                <h4 className="text-base sm:text-lg font-black text-white">
                  {lightbox.stepTitle}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setLightbox(null)}
                aria-label="Close photo viewer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Body */}
            <div className="relative flex-1 bg-black/80 flex items-center justify-center p-4 sm:p-6 overflow-auto min-h-[300px]">
              <img
                src={lightbox.photos[lightbox.photoIndex].src}
                alt={lightbox.photos[lightbox.photoIndex].caption}
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />

              {lightbox.photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setLightbox({
                        ...lightbox,
                        photoIndex:
                          (lightbox.photoIndex - 1 + lightbox.photos.length) %
                          lightbox.photos.length
                      })
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-emerald-400 hover:text-slate-950 text-white flex items-center justify-center border border-white/20 transition cursor-pointer"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLightbox({
                        ...lightbox,
                        photoIndex: (lightbox.photoIndex + 1) % lightbox.photos.length
                      })
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-emerald-400 hover:text-slate-950 text-white flex items-center justify-center border border-white/20 transition cursor-pointer"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Footer Caption */}
            <div className="px-5 py-4 bg-black/75 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-emerald-100">
                {lightbox.photos[lightbox.photoIndex].caption}
              </p>
              {lightbox.photos.length > 1 && (
                <span className="text-xs font-bold text-emerald-300 whitespace-nowrap">
                  Photo {lightbox.photoIndex + 1} of {lightbox.photos.length}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

