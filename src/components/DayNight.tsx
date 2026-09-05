import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useOnScreen, usePrefersReducedMotion } from "../lib/hooks";
import Reveal from "./Reveal";

const EARTH_X = 640;
const EARTH_Y = 240;
const EARTH_R = 120;
const PATTERN_W = 480;

function statusFrom(deg: number): { kata: "Siang" | "Malam" | "Senja" | "Fajar"; face: number; rel: number } {
  const rel = (((deg - 180) % 360) + 360) % 360; // 0 = tengah hari
  const face = Math.cos((rel * Math.PI) / 180);
  if (face > 0.32) return { kata: "Siang", face, rel };
  if (face < -0.32) return { kata: "Malam", face, rel };
  return { kata: rel < 180 ? "Senja" : "Fajar", face, rel };
}

function LandMini() {
  return (
    <g>
      <path d="M70 210 C62 182 84 162 116 166 C148 170 160 192 152 214 C160 232 146 248 120 246 C94 250 76 234 70 210 Z" fill="#57b876" stroke="#2e7d4f" strokeWidth="2.2" />
      <path d="M250 268 C244 246 262 230 286 233 C310 236 320 253 314 270 C320 284 308 296 288 295 C266 298 254 286 250 268 Z" fill="#6cc488" stroke="#2e7d4f" strokeWidth="2.2" />
      <path d="M370 196 C366 178 380 165 399 168 C418 171 426 185 421 200 C425 212 415 222 399 221 C382 224 373 212 370 196 Z" fill="#57b876" stroke="#2e7d4f" strokeWidth="2.2" />
      <circle cx="190" cy="290" r="7" fill="#57b876" stroke="#2e7d4f" strokeWidth="2" />
      <circle cx="440" cy="268" r="6" fill="#6cc488" stroke="#2e7d4f" strokeWidth="2" />
      <circle cx="320" cy="170" r="6" fill="#57b876" stroke="#2e7d4f" strokeWidth="2" />
    </g>
  );
}

export default function DayNight() {
  const reduced = usePrefersReducedMotion();
  const { ref: stageRef, on: onScreen } = useOnScreen<HTMLDivElement>();
  const [playing, setPlaying] = useState(() => !reduced);
  const [degInt, setDegInt] = useState(180);
  const degRef = useRef(180);
  const landRef = useRef<SVGGElement>(null);
  const obsRef = useRef<SVGGElement>(null);

  const apply = useCallback(() => {
    const deg = degRef.current;
    const x = ((deg * 1.15) % PATTERN_W + PATTERN_W) % PATTERN_W;
    landRef.current?.setAttribute("transform", `translate(${-x} 0)`);
    const rad = (deg * Math.PI) / 180;
    const px = EARTH_X + EARTH_R * Math.cos(rad);
    const py = EARTH_Y + EARTH_R * Math.sin(rad);
    obsRef.current?.setAttribute("transform", `translate(${px} ${py}) rotate(${deg + 90})`);
  }, []);

  /* Catatan: saat reduced-motion, rotasi otomatis mati, tetapi tombol "putar"
     tetap dijalankan karena ini gerak yang diminta pengguna secara eksplisit. */
  useEffect(() => {
    if (!playing || !onScreen) return;
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(64, t - last);
      last = t;
      degRef.current = (degRef.current + dt * 0.02) % 360;
      apply();
      const rounded = Math.round(degRef.current) % 360;
      setDegInt((prev) => (Math.abs(prev - rounded) >= 2 ? rounded : prev));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, onScreen, apply]);

  const setAngle = (v: number) => {
    degRef.current = v;
    apply();
    setDegInt(v);
  };

  const st = statusFrom(degInt);
  const hours = (12 + st.rel / 15) % 24;
  const hh = String(Math.floor(hours)).padStart(2, "0");
  const mm = String(Math.floor((hours % 1) * 60)).padStart(2, "0");

  const deskripsi =
    st.kata === "Siang"
      ? "Pengamat sedang menghadap Matahari. Sisi ini menerima cahaya langsung — inilah siang."
      : st.kata === "Malam"
        ? "Pengamat membelakangi Matahari. Cahaya tak sampai ke sisi ini — Bumi sendiri yang menghalangi."
        : st.kata === "Senja"
          ? "Pengamat melintasi terminator menuju sisi gelap — Matahari tampak tenggelam."
          : "Pengamat melintasi terminator menuju sisi terang — Matahari segera terbit.";

  const chip =
    st.kata === "Siang"
      ? "bg-sun text-ink"
      : st.kata === "Malam"
        ? "bg-night-soft text-paper"
        : "bg-coral text-ink";

  return (
    <section id="rotasi" className="on-dark relative bg-night py-20 text-paper sm:py-24" aria-label="Bab C: siang dan malam">
      {/* bintang statis */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {[[80, 90], [200, 500], [330, 160], [520, 80], [760, 600], [900, 120], [1050, 300], [1120, 560], [640, 60], [150, 620], [430, 620], [980, 480]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.4 : 1.5} fill="#fff8e8" opacity={0.4} />
        ))}
        <path d="M0 460 C 200 420 420 500 640 460 S 1040 420 1200 470" fill="none" stroke="#fff8e8" strokeWidth="1" strokeDasharray="2 12" opacity="0.14" />
      </svg>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-xs font-semibold tracking-[0.22em] text-sun/80">BAB C · FISIKA</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.02] font-black text-paper">
              Kenapa ada siang <span className="text-sun">dan malam?</span>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed font-medium text-paper/70">
              Bumi berputar pada porosnya seperti gasing. Matahari tetap di tempatnya — sisi yang
              kebagian cahaya mengalami siang, sisi sebaliknya malam.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div ref={stageRef} className="mt-8 overflow-hidden rounded-2xl border-[2.5px] border-ink bg-night-soft shadow-[8px_8px_0_0_rgba(0,0,0,0.45)]">
            <svg viewBox="0 0 900 480" className="w-full" role="img" aria-label="Panggung simulasi: Matahari diam di kiri, Bumi berotasi di kanan dengan penanda pengamat.">
              <defs>
                <clipPath id="dnClip">
                  <circle cx={EARTH_X} cy={EARTH_Y} r={EARTH_R} />
                </clipPath>
                <radialGradient id="dnOcean" cx="42%" cy="38%" r="75%">
                  <stop offset="0%" stopColor="#3d92e8" />
                  <stop offset="80%" stopColor="#176bdb" />
                  <stop offset="100%" stopColor="#0e4fa8" />
                </radialGradient>
                <linearGradient id="nightGrad" gradientUnits="userSpaceOnUse" x1={EARTH_X - EARTH_R} y1="0" x2={EARTH_X + EARTH_R} y2="0">
                  <stop offset="0" stopColor="rgba(6,16,30,0)" />
                  <stop offset="0.44" stopColor="rgba(6,16,30,0)" />
                  <stop offset="0.56" stopColor="rgba(6,16,30,0.82)" />
                  <stop offset="1" stopColor="rgba(6,16,30,0.9)" />
                </linearGradient>
                <marker id="arrowSun" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 0 L10 5 L0 10 z" fill="#ffd447" />
                </marker>
                <marker id="arrowPaper" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0 0 L10 5 L0 10 z" fill="#fff8e8" />
                </marker>
              </defs>

              {/* Matahari (tetap) */}
              <g data-anim style={{ transformOrigin: "100px 240px", animation: "spin-slow 44s linear infinite" }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <line key={i} x1="100" y1="158" x2="100" y2="176" stroke="#f2b705" strokeWidth="5" strokeLinecap="round" transform={`rotate(${i * 36} 100 240)`} />
                ))}
              </g>
              <circle cx="100" cy="240" r="56" fill="#ffd447" stroke="#183630" strokeWidth="3" />
              <circle cx="100" cy="240" r="56" fill="none" stroke="#f2b705" strokeWidth="6" opacity="0.5" />
              <text x="100" y="330" textAnchor="middle" fontSize="12" fontFamily="IBM Plex Mono, monospace" fill="#ffd447" opacity="0.9">
                Matahari (diam)
              </text>

              {/* berkas cahaya */}
              <g data-anim stroke="#ffd447" strokeWidth="3" strokeLinecap="round" style={{ animation: "dash-flow 1.2s linear infinite", strokeDasharray: "12 12" }}>
                <line x1="172" y1="205" x2="500" y2="205" markerEnd="url(#arrowSun)" />
                <line x1="178" y1="240" x2="506" y2="240" markerEnd="url(#arrowSun)" />
                <line x1="172" y1="275" x2="500" y2="275" markerEnd="url(#arrowSun)" />
              </g>
              <text x="336" y="188" textAnchor="middle" fontSize="11.5" fontFamily="IBM Plex Mono, monospace" fill="#ffd447" opacity="0.85">
                arah cahaya
              </text>

              {/* panah rotasi */}
              <path d="M 528 148 A 138 138 0 0 1 752 148" fill="none" stroke="#fff8e8" strokeWidth="2.4" opacity="0.75" markerEnd="url(#arrowPaper)" />
              <text x="640" y="96" textAnchor="middle" fontSize="11.5" fontFamily="IBM Plex Mono, monospace" fill="#cfe4ff">
                arah rotasi · 1 putaran ≈ 24 jam
              </text>

              {/* Bumi */}
              <circle cx={EARTH_X} cy={EARTH_Y} r="132" fill="none" stroke="#bbd9ff" strokeWidth="2" strokeDasharray="2 8" opacity="0.4" />
              <circle cx={EARTH_X} cy={EARTH_Y} r={EARTH_R} fill="url(#dnOcean)" />
              <g clipPath="url(#dnClip)">
                <g ref={landRef} transform="translate(-207 0)">
                  <LandMini />
                  <g transform={`translate(${PATTERN_W} 0)`}>
                    <LandMini />
                  </g>
                </g>
              </g>
              <circle cx={EARTH_X} cy={EARTH_Y} r={EARTH_R} fill="url(#nightGrad)" />
              <circle cx={EARTH_X} cy={EARTH_Y} r={EARTH_R} fill="none" stroke="#0b1c2c" strokeWidth="3" />
              <circle cx={EARTH_X} cy={EARTH_Y} r={EARTH_R + 3} fill="none" stroke="#fff8e8" strokeWidth="1.4" opacity="0.35" />

              {/* terminator */}
              <line x1={EARTH_X} y1="100" x2={EARTH_X} y2="380" stroke="#fff8e8" strokeWidth="1.6" strokeDasharray="4 8" opacity="0.35" />
              <text x={EARTH_X + 10} y="372" fontSize="11" fontFamily="IBM Plex Mono, monospace" fill="#cfe4ff" opacity="0.8">
                terminator
              </text>
              <text x="470" y="430" fontSize="12" fontFamily="IBM Plex Mono, monospace" fill="#ffd447" opacity="0.9">sisi terang</text>
              <text x="742" y="430" fontSize="12" fontFamily="IBM Plex Mono, monospace" fill="#cfe4ff" opacity="0.8">sisi gelap</text>

              {/* pengamat */}
              <g ref={obsRef} transform={`translate(${EARTH_X - EARTH_R} ${EARTH_Y}) rotate(270)`}>
                <line x1="0" y1="0" x2="0" y2="-18" stroke="#fff8e8" strokeWidth="2.6" strokeLinecap="round" />
                <polygon points="0,-18 15,-12.5 0,-7" fill="#f4795b" stroke="#183630" strokeWidth="1.4" />
                <circle cx="0" cy="0" r="6.5" fill="#fff8e8" stroke="#183630" strokeWidth="2.2" />
              </g>
              <text x={EARTH_X} y="258" textAnchor="middle" fontSize="11" fontFamily="IBM Plex Mono, monospace" fill="#fff8e8" opacity="0" pointerEvents="none">
                pengamat
              </text>
              <text x="816" y="246" textAnchor="middle" fontSize="12" fontFamily="IBM Plex Mono, monospace" fill="#fff8e8" opacity="0.9">
                Bumi
              </text>
            </svg>
          </div>
        </Reveal>

        {/* panel instrumen */}
        <Reveal delay={160}>
          <div className="paper-card relative z-10 mx-auto -mt-6 max-w-3xl px-5 py-4 sm:px-7 sm:py-5">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-pressed={playing}
                aria-label={playing ? "Jeda rotasi" : "Putar rotasi"}
                className={`btn-pop flex h-14 w-14 items-center justify-center rounded-full ${playing ? "bg-sun" : "bg-leaf"}`}
              >
                {playing ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                    <rect x="4" y="3" width="4.5" height="14" rx="1.2" fill="#183630" />
                    <rect x="11.5" y="3" width="4.5" height="14" rx="1.2" fill="#183630" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M6 3.5v13l11-6.5z" fill="#183630" />
                  </svg>
                )}
              </button>

              <div className="min-w-[220px] flex-1">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="sudut-rotasi" className="text-sm font-extrabold text-ink">
                    Sudut rotasi
                  </label>
                  <output htmlFor="sudut-rotasi" className="font-mono text-sm font-semibold text-ocean">
                    {degInt}°
                  </output>
                </div>
                <input
                  id="sudut-rotasi"
                  type="range"
                  min={0}
                  max={359}
                  step={1}
                  value={degInt}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="dial"
                  style={{ "--acc": "#176bdb", "--fill": `${(degInt / 359) * 100}%` } as CSSProperties}
                />
              </div>

              <div className="text-right">
                <p className="font-mono text-3xl font-semibold text-ink" aria-hidden="true">
                  {hh}:{mm}
                </p>
                <span className={`mt-1 inline-block rounded-full border-2 border-ink px-3 py-0.5 text-xs font-extrabold ${chip}`} role="status">
                  Pengamat: {st.kata.toUpperCase()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPlaying(false);
                  setAngle(180);
                }}
                className="btn-pop rounded-xl bg-paper px-4 py-2.5 text-sm font-bold text-ink"
              >
                <span className="flex items-center gap-1.5">
                  <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true">
                    <path d="M7.5 2a5.5 5.5 0 1 1-5 3.2M2.5 1.5v4h4" fill="none" stroke="#183630" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Reset
                </span>
              </button>
            </div>

            <p className="mt-3 border-t-2 border-dashed border-ink/20 pt-3 text-sm leading-relaxed font-medium text-ink/75">
              {deskripsi}
            </p>
            <p className="font-mono mt-2 text-[11px] text-ink/55">
              Jam di atas adalah <strong>waktu simulasi</strong> pengamat — satu putaran animasi mewakili ±24 jam, bukan durasi sebenarnya.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
