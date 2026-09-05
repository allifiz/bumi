import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { HOTSPOTS } from "../data/content";
import type { HotspotFact } from "../data/content";
import { useOnScreen, usePrefersReducedMotion } from "../lib/hooks";

const W = 760; // lebar pola benua (px pola, digeser saat rotasi)

const CONNECTORS: Record<HotspotFact["id"], string> = {
  atmosfer: "M414 108 C472 190 420 320 300 380 C262 398 232 408 210 414",
  daratan: "M162 252 C128 300 138 362 186 410",
  samudra: "M352 366 C312 396 252 410 212 416",
};

function LandPattern() {
  return (
    <g>
      <path
        d="M118 236 C104 196 132 158 178 152 C224 146 252 172 248 204 C276 210 284 244 262 268 C270 300 244 322 210 318 C184 338 138 330 122 300 C100 288 104 258 118 236 Z"
        fill="#57b876"
        stroke="#2e7d4f"
        strokeWidth="2.5"
      />
      <path
        d="M150 250 C150 222 176 202 206 207"
        fill="none"
        stroke="#2e7d4f"
        strokeWidth="1.8"
        strokeDasharray="5 6"
        opacity="0.55"
      />
      <path
        d="M142 286 C164 302 202 306 234 292"
        fill="none"
        stroke="#2e7d4f"
        strokeWidth="1.8"
        strokeDasharray="5 6"
        opacity="0.55"
      />
      <path
        d="M330 300 C322 272 344 250 376 252 C408 254 424 276 418 300 C428 318 414 338 388 338 C360 346 336 326 330 300 Z"
        fill="#57b876"
        stroke="#2e7d4f"
        strokeWidth="2.5"
      />
      <path
        d="M520 210 C516 186 536 168 562 172 C588 176 600 196 592 218 C598 236 584 252 560 250 C536 254 522 234 520 210 Z"
        fill="#6cc488"
        stroke="#2e7d4f"
        strokeWidth="2.5"
      />
      <ellipse cx="452" cy="180" rx="27" ry="18" fill="#57b876" stroke="#2e7d4f" strokeWidth="2.2" />
      <circle cx="300" cy="382" r="8" fill="#57b876" stroke="#2e7d4f" strokeWidth="2" />
      <circle cx="662" cy="302" r="9" fill="#6cc488" stroke="#2e7d4f" strokeWidth="2" />
      <circle cx="212" cy="390" r="6" fill="#57b876" stroke="#2e7d4f" strokeWidth="2" />
      <circle cx="600" cy="376" r="6" fill="#57b876" stroke="#2e7d4f" strokeWidth="2" />
    </g>
  );
}

function Cloud({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="36" ry="13" fill="#ffffff" opacity="0.92" />
      <ellipse cx="-26" cy="6" rx="22" ry="10" fill="#ffffff" opacity="0.92" />
      <ellipse cx="27" cy="7" rx="24" ry="10" fill="#ffffff" opacity="0.92" />
    </g>
  );
}

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const { ref: stageRef, on: onScreen } = useOnScreen<HTMLDivElement>();
  const [selected, setSelected] = useState<HotspotFact["id"] | null>(null);
  const [tried, setTried] = useState(false);

  const rotRef = useRef(0);
  const cloudRef = useRef(180);
  const landEl = useRef<SVGGElement>(null);
  const cloudEl = useRef<SVGGElement>(null);
  const dragging = useRef(false);
  const lastX = useRef(0);

  const apply = useCallback(() => {
    const x = ((rotRef.current * 2.1) % W + W) % W;
    landEl.current?.setAttribute("transform", `translate(${-x} 0)`);
    const cx = ((cloudRef.current * 1.4) % W + W) % W;
    cloudEl.current?.setAttribute("transform", `translate(${-cx} 0)`);
  }, []);

  /* Rotasi otomatis + awan independen (berhenti di luar layar / reduced motion) */
  useEffect(() => {
    if (reduced || !onScreen) return;
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(64, t - last);
      last = t;
      if (!dragging.current) rotRef.current += dt * 0.0026;
      cloudRef.current += dt * 0.0045;
      apply();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced, onScreen, apply]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    lastX.current = e.clientX;
    e.currentTarget.setPointerCapture(e.pointerId);
    setTried(true);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    rotRef.current += dx * 0.45;
    apply();
  };
  const stopDrag = () => {
    dragging.current = false;
  };
  const nudge = (deg: number) => {
    rotRef.current += deg;
    apply();
    setTried(true);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      nudge(-24);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nudge(24);
    }
  };

  const fact = HOTSPOTS.find((h) => h.id === selected) ?? null;

  return (
    <section
      id="sampul"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32"
      aria-label="Sampul: Planet kecil, cerita luar biasa"
    >
      {/* kontur latar */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M-40 ${180 + i * 130} C 240 ${120 + i * 130}, 420 ${240 + i * 130}, 700 ${170 + i * 130} S 1140 ${210 + i * 130}, 1260 ${150 + i * 130}`}
            fill="none"
            stroke="#183630"
            strokeWidth="1.6"
          />
        ))}
        <line x1="0" y1="90" x2="1200" y2="90" stroke="#183630" strokeWidth="1" strokeDasharray="3 10" />
      </svg>

      {/* Matahari sudut */}
      <div className="pointer-events-none absolute -top-6 left-4 z-0 hidden md:block" aria-hidden="true">
        <svg width="190" height="190" viewBox="0 0 190 190">
          <g data-anim style={{ transformOrigin: "95px 95px", animation: "spin-slow 48s linear infinite" }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="95"
                y1="16"
                x2="95"
                y2="34"
                stroke="#f2b705"
                strokeWidth="5"
                strokeLinecap="round"
                transform={`rotate(${i * 30} 95 95)`}
              />
            ))}
          </g>
          <circle cx="95" cy="95" r="46" fill="#ffd447" stroke="#183630" strokeWidth="3" />
          <circle cx="95" cy="95" r="46" fill="none" stroke="#f2b705" strokeWidth="6" opacity="0.5" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.02fr_1fr] lg:gap-4">
        {/* ------- teks editorial ------- */}
        <div className="relative z-10">
          <div className="flex flex-wrap gap-2">
            {[
              ["FISIKA", "#ffd447"],
              ["BIOLOGI", "#57b876"],
              ["ILMU BUMI", "#176bdb"],
            ].map(([t, c]) => (
              <span
                key={t}
                className="shadow-pop-sm inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-paper px-3 py-1 font-mono text-[11px] font-semibold tracking-wider"
              >
                <span className="h-2 w-2 rounded-full border border-ink" style={{ background: c }} />
                {t}
              </span>
            ))}
          </div>

          <h1 className="font-display mt-6 text-[clamp(2.7rem,6.4vw,4.7rem)] leading-[0.98] font-black tracking-tight text-ink">
            Planet kecil.
            <br />
            Cerita{" "}
            <em className="relative inline-block text-coral-deep not-italic">
              luar biasa.
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 104 10"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M2 7 Q 12 1 22 7 T 42 7 T 62 7 T 82 7 T 102 7"
                  fill="none"
                  stroke="#f4795b"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                />
              </svg>
            </em>
          </h1>

          <p className="mt-7 max-w-md text-lg leading-relaxed font-medium text-ink/75">
            Selamat datang di <strong className="text-ink">laboratorium planet</strong> yang bisa
            disentuh. Belah Bumi, putar siang dan malam, ikutkan setetes air berkeliling dunia —
            dan temukan kenapa semuanya saling terhubung.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#belah"
              className="btn-pop inline-flex items-center gap-2.5 rounded-xl bg-coral px-6 py-3.5 text-lg font-extrabold text-ink"
            >
              Mulai menjelajah
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 3v11M5 9l5 5 5-5" fill="none" stroke="#183630" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <span className="font-mono text-xs font-medium text-ink/55">
              6 bab interaktif · ±10 menit
            </span>
          </div>
        </div>

        {/* ------- globe ------- */}
        <div className="relative lg:-ml-6">
          <div
            ref={stageRef}
            role="group"
            aria-label="Bumi yang dapat diputar. Seret secara mendatar, atau gunakan panah kiri dan kanan pada keyboard."
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={stopDrag}
            onPointerCancel={stopDrag}
            className="relative mx-auto w-full max-w-[540px] cursor-grab touch-pan-y select-none rounded-full active:cursor-grabbing"
          >
            <svg viewBox="0 0 560 560" className="w-full" aria-hidden="true">
              <defs>
                <radialGradient id="oceanGrad" cx="42%" cy="38%" r="72%">
                  <stop offset="0%" stopColor="#3d92e8" />
                  <stop offset="78%" stopColor="#176bdb" />
                  <stop offset="100%" stopColor="#0e4fa8" />
                </radialGradient>
                <radialGradient id="sphereShade" cx="50%" cy="50%" r="50%">
                  <stop offset="70%" stopColor="rgba(8,28,56,0)" />
                  <stop offset="100%" stopColor="rgba(8,28,56,0.34)" />
                </radialGradient>
                <clipPath id="globeClip">
                  <circle cx="280" cy="280" r="190" />
                </clipPath>
              </defs>

              {/* halo atmosfer */}
              <circle cx="280" cy="280" r="224" fill="none" stroke="#bbd9ff" strokeWidth="3" opacity="0.4" />
              <circle cx="280" cy="280" r="212" fill="none" stroke="#bbd9ff" strokeWidth="11" opacity="0.5" />
              <circle cx="280" cy="280" r="200" fill="none" stroke="#9cc4f5" strokeWidth="2" strokeDasharray="2 9" opacity="0.7" />

              <circle cx="280" cy="280" r="190" fill="url(#oceanGrad)" stroke="#183630" strokeWidth="3.5" />

              {/* benua berputar */}
              <g clipPath="url(#globeClip)">
                <g ref={landEl}>
                  <LandPattern />
                  <g transform={`translate(${W} 0)`}>
                    <LandPattern />
                  </g>
                </g>
                <ellipse cx="280" cy="96" rx="70" ry="20" fill="#f3efe2" opacity="0.9" />
                <ellipse cx="280" cy="466" rx="78" ry="22" fill="#f3efe2" opacity="0.9" />
                <path d="M96 214 Q 280 176 464 214" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.22" />
                <path d="M92 356 Q 280 396 468 356" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.22" />
              </g>

              {/* awan: bergerak sendiri */}
              <g clipPath="url(#globeClip)">
                <g ref={cloudEl}>
                  <Cloud x={150} y={192} s={1} />
                  <Cloud x={430} y={150} s={0.8} />
                  <Cloud x={610} y={326} s={1.1} />
                  <Cloud x={310} y={376} s={0.7} />
                  <g transform={`translate(${W} 0)`}>
                    <Cloud x={150} y={192} s={1} />
                    <Cloud x={430} y={150} s={0.8} />
                    <Cloud x={610} y={326} s={1.1} />
                    <Cloud x={310} y={376} s={0.7} />
                  </g>
                </g>
              </g>

              <circle cx="280" cy="280" r="190" fill="url(#sphereShade)" pointerEvents="none" />
              <circle cx="280" cy="280" r="190" fill="none" stroke="#183630" strokeWidth="3.5" pointerEvents="none" />

              {/* orbit + bulan */}
              <g transform="rotate(-14 280 280)">
                <path
                  id="orbitPath"
                  d="M26 280 A 254 84 0 1 0 534 280 A 254 84 0 1 0 26 280"
                  fill="none"
                  stroke="#183630"
                  strokeWidth="1.6"
                  strokeDasharray="3 9"
                  opacity="0.35"
                />
                {!reduced && (
                  <circle r="11" fill="#e8e3d5" stroke="#183630" strokeWidth="2.5">
                    <animateMotion dur="26s" repeatCount="indefinite">
                      <mpath href="#orbitPath" />
                    </animateMotion>
                  </circle>
                )}
                {reduced && <circle cx="534" cy="280" r="11" fill="#e8e3d5" stroke="#183630" strokeWidth="2.5" />}
              </g>
            </svg>

            {/* garis anotasi */}
            <svg
              className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
              viewBox="0 0 560 560"
              aria-hidden="true"
            >
              {fact && (
                <>
                  <path
                    key={fact.id}
                    d={CONNECTORS[fact.id]}
                    fill="none"
                    stroke="#183630"
                    strokeWidth="2.4"
                    pathLength={1}
                    strokeDasharray="1"
                    className="annotate-draw"
                    data-anim
                  />
                  <circle cx="208" cy="414" r="4.5" fill="#f4795b" stroke="#183630" strokeWidth="1.6" />
                </>
              )}
            </svg>

            {/* hotspot */}
            {HOTSPOTS.map((h) => {
              const isSel = selected === h.id;
              const labelLeft = h.id === "daratan";
              return (
                <button
                  key={h.id}
                  type="button"
                  aria-pressed={isSel}
                  aria-label={`Hotspot ${h.label}: tampilkan fakta`}
                  onClick={() => setSelected(isSel ? null : h.id)}
                  className={`btn-pop absolute z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[2.5px] border-ink font-mono text-[11px] font-bold ${
                    isSel ? "scale-110" : ""
                  }`}
                  style={{ left: h.pos.left, top: h.pos.top, background: h.warna, color: h.teksWarna, transition: "transform 180ms ease, box-shadow 150ms ease" }}
                >
                  {!isSel && (
                    <span
                      data-anim
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full border-2"
                      style={{ borderColor: h.id === "samudra" ? "#176bdb" : h.id === "daratan" ? "#2e7d4f" : "#0e4fa8", animation: "pulse-ring 2.4s ease-out infinite" }}
                    />
                  )}
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full border-2 border-current" />
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 rounded-md border-2 border-ink bg-paper px-1.5 py-0.5 font-mono text-[10px] font-semibold whitespace-nowrap text-ink shadow-pop-sm ${
                      labelLeft ? "left-full ml-2.5" : "right-full mr-2.5"
                    }`}
                  >
                    {h.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* kartu fakta */}
          <div
            className={`mt-4 lg:absolute lg:bottom-4 lg:-left-10 lg:z-30 lg:mt-0 lg:w-72 ${
              fact ? "block" : "hidden"
            }`}
          >
            {fact && (
              <div className="paper-card p-4" role="region" aria-live="polite" aria-label={`Fakta: ${fact.judul}`}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg leading-tight font-bold text-ink">{fact.judul}</h3>
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    aria-label="Tutup fakta"
                    className="btn-pop -mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sun font-bold text-ink"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                      <path d="M2 2l8 8M10 2l-8 8" stroke="#183630" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <p className="mt-1.5 text-sm font-bold text-coral-deep">{fact.fakta}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/75">{fact.detail}</p>
              </div>
            )}
          </div>

          {/* kontrol rotasi + petunjuk */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => nudge(-24)}
              aria-label="Putar Bumi ke kiri"
              className="btn-pop flex h-11 w-11 items-center justify-center rounded-full bg-paper"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M11 4 6 9l5 5" fill="none" stroke="#183630" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span
              className={`rounded-full border-2 border-ink bg-sun px-4 py-1.5 font-mono text-xs font-semibold transition-opacity duration-300 ${
                tried ? "opacity-0" : "opacity-100"
              }`}
              data-anim
              style={tried ? undefined : { animation: "bob 2.2s ease-in-out infinite" }}
            >
              ⟷ geser untuk memutar
            </span>
            <button
              type="button"
              onClick={() => nudge(24)}
              aria-label="Putar Bumi ke kanan"
              className="btn-pop flex h-11 w-11 items-center justify-center rounded-full bg-paper"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M7 4l5 5-5 5" fill="none" stroke="#183630" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
