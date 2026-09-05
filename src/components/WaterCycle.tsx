import { useEffect, useMemo, useRef, useState } from "react";
import { TAHAP_AIR } from "../data/content";
import { useOnScreen, usePrefersReducedMotion } from "../lib/hooks";
import Reveal from "./Reveal";

/* jalur tur setetes air (koordinat SVG 1200x560) */
const TOUR: { pts: [number, number][]; step: number }[] = [
  { step: 1, pts: [[368, 360], [392, 318], [432, 256], [478, 196], [516, 160]] },
  { step: 2, pts: [[516, 160], [548, 142], [578, 148]] },
  { step: 3, pts: [[578, 148], [596, 220], [622, 298], [640, 334]] },
  { step: 4, pts: [[640, 334], [600, 352], [548, 362], [486, 372], [436, 380], [398, 386], [366, 394]] },
];

const SEEP: [[number, number], [number, number]] = [[642, 342], [652, 468]];

interface Seg { ax: number; ay: number; bx: number; by: number; len: number; cum: number; step: number }

function buildSegs() {
  const segs: Seg[] = [];
  let cum = 0;
  for (const phase of TOUR) {
    for (let i = 0; i < phase.pts.length - 1; i++) {
      const [ax, ay] = phase.pts[i];
      const [bx, by] = phase.pts[i + 1];
      const len = Math.hypot(bx - ax, by - ay);
      cum += len;
      segs.push({ ax, ay, bx, by, len, cum, step: phase.step });
    }
  }
  return { segs, total: cum };
}

function pointAt(segs: Seg[], d: number) {
  for (const s of segs) {
    if (d <= s.cum) {
      const t = 1 - (s.cum - d) / s.len;
      return { x: s.ax + (s.bx - s.ax) * t, y: s.ay + (s.by - s.ay) * t, step: s.step };
    }
  }
  const last = segs[segs.length - 1];
  return { x: last.bx, y: last.by, step: last.step };
}

const MARKER_POS = [
  { left: "27%", top: "56%" },
  { left: "45%", top: "11%" },
  { left: "56%", top: "41%" },
  { left: "34%", top: "64%" },
];

export default function WaterCycle() {
  const reduced = usePrefersReducedMotion();
  const { ref: stageRef, on: onScreen } = useOnScreen<HTMLDivElement>();
  const [step, setStep] = useState(0);
  const [touring, setTouring] = useState(false);
  const [tourDone, setTourDone] = useState(false);

  const { segs, total } = useMemo(buildSegs, []);
  const dropRef = useRef<SVGCircleElement>(null);
  const seepRef = useRef<SVGCircleElement>(null);
  const touringRef = useRef(false);
  touringRef.current = touring;

  /* tur otomatis */
  useEffect(() => {
    if (!touring || !onScreen) return;
    if (reduced) {
      let s = 1;
      setStep(1);
      const id = window.setInterval(() => {
        s += 1;
        if (s > 4) {
          window.clearInterval(id);
          setTouring(false);
          setTourDone(true);
        } else setStep(s);
      }, 2100);
      return () => window.clearInterval(id);
    }
    let raf = 0;
    const DUR = 15000;
    const t0 = performance.now();
    dropRef.current?.setAttribute("opacity", "1");
    const loop = (t: number) => {
      if (!touringRef.current) return;
      const p = Math.min(1, (t - t0) / DUR);
      const eased = p * p * (3 - 2 * p);
      const d = eased * total;
      const pos = pointAt(segs, d);
      dropRef.current?.setAttribute("cx", String(pos.x));
      dropRef.current?.setAttribute("cy", String(pos.y));
      setStep((prev) => (prev === pos.step ? prev : pos.step));
      const runoffStart = total * 0.646;
      if (d >= runoffStart && seepRef.current) {
        const sp = Math.min(1, (d - runoffStart) / (total - runoffStart));
        seepRef.current.setAttribute("opacity", String(Math.max(0, 1 - sp * 1.1)));
        seepRef.current.setAttribute("cx", String(SEEP[0][0] + (SEEP[1][0] - SEEP[0][0]) * sp));
        seepRef.current.setAttribute("cy", String(SEEP[0][1] + (SEEP[1][1] - SEEP[0][1]) * sp));
      }
      if (p >= 1) {
        setTouring(false);
        setTourDone(true);
        dropRef.current?.setAttribute("opacity", "0");
        seepRef.current?.setAttribute("opacity", "0");
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      dropRef.current?.setAttribute("opacity", "0");
      seepRef.current?.setAttribute("opacity", "0");
    };
  }, [touring, onScreen, reduced, segs, total]);

  const pick = (id: number) => {
    setTouring(false);
    setTourDone(false);
    setStep((prev) => (prev === id ? 0 : id));
  };

  const reset = () => {
    setTouring(false);
    setTourDone(false);
    setStep(0);
    dropRef.current?.setAttribute("opacity", "0");
    seepRef.current?.setAttribute("opacity", "0");
  };

  const active = TAHAP_AIR.find((t) => t.id === step) ?? null;

  return (
    <section
      id="air"
      className="relative py-20 sm:py-24"
      style={{ background: "linear-gradient(#cfe8ff 0%, #e6f4ff 30%, #fff8e8 92%)" }}
      aria-label="Bab D: siklus air"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-xs font-semibold tracking-[0.22em] text-ocean-deep">BAB D · FISIKA + ILMU BUMI</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.02] font-black text-ink">
              Ikuti perjalanan <span className="text-ocean">setetes air.</span>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed font-medium text-ink/70">
              Dari laut ke langit, lalu kembali lagi. Jalankan turnya tahap demi tahap — atau ikuti
              satu tetes dari awal sampai akhir.
            </p>
          </div>
        </Reveal>

        {/* kendali */}
        <Reveal delay={80}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="relative flex items-center gap-2">
              <span className="absolute inset-x-5 top-1/2 h-[3px] -translate-y-1/2 rounded bg-ink/15" aria-hidden="true" />
              {TAHAP_AIR.map((t) => {
                const isActive = step === t.id;
                const lewat = step > t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => pick(t.id)}
                    aria-pressed={isActive}
                    aria-label={`Tahap ${t.id}: ${t.nama}`}
                    title={t.nama}
                    className={`btn-pop relative z-10 flex h-11 w-11 items-center justify-center rounded-full font-mono text-base font-bold transition-colors duration-200 ${
                      isActive ? "bg-ocean text-paper" : lewat ? "bg-leaf text-ink" : "bg-paper text-ink"
                    }`}
                  >
                    {t.id}
                  </button>
                );
              })}
            </div>
            <span className="font-mono hidden text-xs font-semibold text-ink/55 sm:inline">
              {active ? active.nama : "pilih tahap"}
            </span>
            <div className="ml-auto flex gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (touring) {
                    setTouring(false);
                  } else {
                    setTourDone(false);
                    setStep(1);
                    setTouring(true);
                  }
                }}
                className="btn-pop rounded-xl bg-coral px-4 py-2.5 text-sm font-extrabold text-ink"
              >
                {touring ? "Hentikan tur" : tourDone ? "Ulangi tur tetes" : "Ikuti satu tetes ●"}
              </button>
              <button type="button" onClick={reset} className="btn-pop rounded-xl bg-paper px-4 py-2.5 text-sm font-bold text-ink">
                Reset
              </button>
            </div>
          </div>
        </Reveal>

        {/* panggung lanskap */}
        <Reveal delay={140}>
          <div
            ref={stageRef}
            className="relative mt-6 overflow-hidden rounded-2xl border-[2.5px] border-ink bg-[#bfe0f7] shadow-pop-lg"
            style={{ aspectRatio: "1200 / 560" }}
          >
            <svg viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid slice" className={`wc-stage h-full w-full ${step ? `step-${step}` : ""}`} role="img" aria-label="Lanskap siklus air: laut, daratan, pegunungan, awan, dan sungai.">
              <defs>
                <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3d92e8" />
                  <stop offset="100%" stopColor="#0e4fa8" />
                </linearGradient>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bfe0f7" />
                  <stop offset="100%" stopColor="#eaf6ff" />
                </linearGradient>
                <marker id="wcArrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0 0 L10 5 L0 10 z" fill="#183630" />
                </marker>
                <marker id="wcArrowBlue" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0 0 L10 5 L0 10 z" fill="#176bdb" />
                </marker>
              </defs>

              <rect width="1200" height="560" fill="url(#skyGrad)" />

              {/* matahari + berkas ke laut */}
              <g data-anim style={{ transformOrigin: "105px 86px", animation: "spin-slow 40s linear infinite" }}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <line key={i} x1="105" y1="26" x2="105" y2="40" stroke="#f2b705" strokeWidth="4.5" strokeLinecap="round" transform={`rotate(${i * 40} 105 86)`} />
                ))}
              </g>
              <circle cx="105" cy="86" r="42" fill="#ffd447" stroke="#183630" strokeWidth="3" />
              <g className="wc-sunrays" stroke="#f2b705" strokeWidth="3.4" strokeLinecap="round" fill="none">
                <path d="M150 116 L 292 210" markerEnd="url(#wcArrow)" stroke="#183630" opacity="0.5" />
                <path d="M146 132 L 250 258" />
                <path d="M156 102 L 330 176" />
              </g>
              <text x="208" y="176" fontSize="12" fontFamily="IBM Plex Mono, monospace" fill="#c77f00" fontWeight="600">
                energi Matahari
              </text>

              {/* tanah / penampang */}
              <path
                d="M388 386 C 440 352 500 330 560 318 C 640 302 700 272 742 222 C 782 162 832 116 902 130 C 980 146 1042 222 1082 300 C 1122 322 1152 352 1200 382 L 1200 560 L 388 560 Z"
                fill="#a06b46"
              />
              <path d="M388 386 C 440 352 500 330 560 318 C 640 302 700 272 742 222 C 782 162 832 116 902 130 C 980 146 1042 222 1082 300 C 1122 322 1152 352 1200 382" fill="none" stroke="#57b876" strokeWidth="9" strokeLinecap="round" />
              {/* tekstur tanah */}
              {[[470, 440], [540, 480], [620, 452], [700, 500], [790, 460], [880, 510], [960, 452], [1050, 500], [760, 540], [500, 528]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={i % 2 ? 5 : 3.4} fill="#7c4f31" opacity="0.65" />
              ))}
              {/* zona basah infiltrasi */}
              <ellipse className="wc-soil-wet" cx="648" cy="440" rx="52" ry="70" fill="#5d3d28" opacity="0" />
              {/* muka air tanah */}
              <path d="M760 508 Q 840 494 920 506 T 1080 506 L 1080 545 L 760 545 Z" fill="#7fb3e8" opacity="0.85" />
              <path d="M760 508 Q 840 494 920 506 T 1080 506" fill="none" stroke="#4a90d9" strokeWidth="2.5" strokeDasharray="6 7" />
              <text x="912" y="534" textAnchor="middle" fontSize="12" fontFamily="IBM Plex Mono, monospace" fill="#10293f" fontWeight="600">
                air tanah
              </text>

              {/* puncak gunung */}
              <path d="M828 148 C 852 128 880 122 902 130 C 930 140 952 160 966 182 L 902 208 L 848 190 Z" fill="#b98a5e" />
              <path d="M866 140 C 880 130 898 128 912 134 L 902 158 L 876 152 Z" fill="#f3efe2" />

              {/* sungai */}
              <path d="M895 152 C 862 200 820 240 762 268 C 704 296 622 310 562 326 C 502 342 442 362 402 382" fill="none" stroke="#2f86e0" strokeWidth="11" strokeLinecap="round" />
              <path className="wc-river-dash" d="M895 152 C 862 200 820 240 762 268 C 704 296 622 310 562 326 C 502 342 442 362 402 382" fill="none" stroke="#cfe8ff" strokeWidth="4.5" strokeLinecap="round" />
              <text x="742" y="244" fontSize="12" fontFamily="IBM Plex Mono, monospace" fill="#0e4fa8" fontWeight="600">
                sungai
              </text>

              {/* pepohonan */}
              <g>
                <rect x="497" y="304" width="8" height="30" fill="#7c4f31" stroke="#183630" strokeWidth="1.6" />
                <circle cx="501" cy="288" r="24" fill="#4e9e63" stroke="#2e7d4f" strokeWidth="2.5" />
                <circle cx="516" cy="298" r="15" fill="#57b876" stroke="#2e7d4f" strokeWidth="2" />
              </g>
              <g>
                <rect x="582" y="288" width="7" height="26" fill="#7c4f31" stroke="#183630" strokeWidth="1.6" />
                <circle cx="585" cy="272" r="19" fill="#57b876" stroke="#2e7d4f" strokeWidth="2.5" />
              </g>

              {/* laut */}
              <path d="M0 384 Q 60 372 120 382 T 240 382 T 360 382 L 392 384 L 392 560 L 0 560 Z" fill="url(#seaGrad)" />
              <g data-anim style={{ animation: "bob 5s ease-in-out infinite" }}>
                <path d="M0 384 Q 60 372 120 382 T 240 382 T 360 382 L 392 384" fill="none" stroke="#cfe8ff" strokeWidth="3.5" />
              </g>
              <text x="150" y="470" fontSize="14" fontFamily="IBM Plex Mono, monospace" fill="#cfe4ff" fontWeight="600">
                laut
              </text>

              {/* penanda uap (ilustratif) */}
              <g className="wc-vapor" fill="none" stroke="#4a90d9" strokeWidth="2.6" strokeLinecap="round">
                <g style={{ animationDelay: "0s" }} transform="translate(332 356)">
                  <circle r="7" strokeDasharray="3 5" />
                  <path d="M-4 -12 L0 -17 L4 -12" />
                </g>
                <g style={{ animationDelay: "0.5s" }} transform="translate(356 362)">
                  <circle r="7" strokeDasharray="3 5" />
                  <path d="M-4 -12 L0 -17 L4 -12" />
                </g>
                <g style={{ animationDelay: "1s" }} transform="translate(380 356)">
                  <circle r="7" strokeDasharray="3 5" />
                  <path d="M-4 -12 L0 -17 L4 -12" />
                </g>
                <g style={{ animationDelay: "1.5s" }} transform="translate(306 362)">
                  <circle r="6" strokeDasharray="3 5" />
                  <path d="M-4 -11 L0 -16 L4 -11" />
                </g>
                <g style={{ animationDelay: "2s" }} transform="translate(404 360)">
                  <circle r="6" strokeDasharray="3 5" />
                  <path d="M-4 -11 L0 -16 L4 -11" />
                </g>
              </g>
              <text x="252" y="330" fontSize="11.5" fontFamily="IBM Plex Mono, monospace" fill="#0e4fa8" opacity="0.85">
                uap air*
              </text>

              {/* awan */}
              <g className="wc-cloud-body">
                <ellipse cx="540" cy="138" rx="66" ry="26" fill="#ffffff" stroke="#c3d3e0" strokeWidth="2.5" />
                <ellipse cx="496" cy="148" rx="38" ry="18" fill="#ffffff" stroke="#c3d3e0" strokeWidth="2.5" />
                <ellipse cx="586" cy="150" rx="42" ry="19" fill="#ffffff" stroke="#c3d3e0" strokeWidth="2.5" />
                <ellipse cx="540" cy="124" rx="40" ry="20" fill="#ffffff" />
                <path className="wc-cloud-shade" d="M486 152 Q 540 172 596 152 Q 570 166 540 166 Q 510 166 486 152 Z" fill="#9fb4c6" />
                <circle cx="522" cy="140" r="4" fill="#b9cfe2" />
                <circle cx="556" cy="134" r="4.6" fill="#b9cfe2" />
                <circle cx="540" cy="148" r="3.6" fill="#b9cfe2" />
              </g>

              {/* hujan */}
              <g className="wc-rain" stroke="#176bdb" strokeWidth="3.4" strokeLinecap="round">
                {[
                  [500, 180, 0],
                  [524, 186, 0.35],
                  [548, 182, 0.15],
                  [572, 188, 0.5],
                  [596, 184, 0.7],
                  [616, 190, 0.25],
                ].map(([x, y, dl], i) => (
                  <line key={i} x1={x} y1={y} x2={x - 5} y2={(y as number) + 17} style={{ animationDelay: `${dl}s` }} />
                ))}
              </g>

              {/* panah infiltrasi */}
              <g className="wc-seep" stroke="#176bdb" strokeWidth="3" strokeLinecap="round" fill="none">
                {[600, 640, 680].map((x, i) => (
                  <g key={x} style={{ animationDelay: `${i * 0.5}s` }}>
                    <line x1={x} y1="396" x2={x} y2="430" strokeDasharray="5 7" />
                    <path d={`M${x - 5} 424 L${x} 433 L${x + 5} 424`} markerEnd="url(#wcArrowBlue)" />
                  </g>
                ))}
              </g>


              {/* tetes tur */}
              <circle ref={dropRef} r="8" fill="#176bdb" stroke="#fff8e8" strokeWidth="2.5" opacity="0" />
              <circle ref={seepRef} r="6" fill="#4a90d9" stroke="#fff8e8" strokeWidth="2" opacity="0" />
            </svg>

            {/* penanda tahap di adegan */}
            {MARKER_POS.map((p, i) => {
              const id = i + 1;
              const isActive = step === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => pick(id)}
                  aria-label={`Tahap ${id}: ${TAHAP_AIR[i].nama}`}
                  aria-pressed={isActive}
                  className={`btn-pop absolute hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-mono text-sm font-bold md:flex ${
                    isActive ? "bg-coral text-ink" : "bg-paper text-ink"
                  }`}
                  style={{ left: p.left, top: p.top }}
                >
                  {id}
                </button>
              );
            })}

            {/* keterangan tahap (desktop) */}
            {TAHAP_AIR.map((t) => (
              <div
                key={t.id}
                className={`pointer-events-none absolute hidden max-w-[250px] transition-opacity duration-300 md:block ${
                  step === t.id ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  left: t.pos.left,
                  top: t.pos.top,
                  transform: `${t.pos.align === "right" ? "translateX(-100%) " : ""}translateY(${step === t.id ? 0 : 8}px)`,
                }}
                aria-hidden={step !== t.id}
              >
                <div className="paper-card px-4 py-3">
                  <p className="font-mono text-[10px] font-semibold tracking-widest text-coral-deep">TAHAP {t.id}</p>
                  <p className="mt-0.5 text-sm leading-snug font-bold text-ink">{t.nama}</p>
                  <p className="mt-1 text-[13px] leading-snug text-ink/75">{t.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* keterangan tahap (mobile) */}
        <div className="paper-card mt-4 px-4 py-3 md:hidden" role="status">
          {active ? (
            <>
              <p className="font-mono text-[10px] font-semibold tracking-widest text-coral-deep">
                TAHAP {active.id} · {active.nama.toUpperCase()}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink/80">{active.caption}</p>
            </>
          ) : (
            <p className="text-sm font-medium text-ink/65">
              {tourDone ? "Tur selesai! Tetes itu sudah kembali ke laut. Coba tahap manual, atau ulangi turnya." : "Pilih tahap 1–4 atau tekan “Ikuti satu tetes” untuk memulai."}
            </p>
          )}
        </div>

        <Reveal delay={100}>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <p className="font-mono text-[11px] text-ink/55">
              *Uap air sesungguhnya <strong className="text-ink">tidak terlihat</strong> — butiran putus-putus di atas hanya penanda ilustratif.
            </p>
            <p className="text-sm font-medium text-ink/70">
              Perjalanan ini <strong className="text-ink">salah satu jalur yang mungkin</strong> — di alam, siklus air tidak punya urutan tunggal yang selalu sama.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
