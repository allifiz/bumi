import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { LAPISAN } from "../data/content";
import type { LapisanBumi } from "../data/content";
import Reveal from "./Reveal";

const CX = 330;
const CY = 335;
const R_OUT = 250;
const R_CRUST_IN = 228;
const R_MANTLE_IN = 148;
const R_OC_IN = 70;

const pt = (angDeg: number, r: number): [number, number] => {
  const a = (angDeg * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};

const wedgePath = (r: number, a0: number, a1: number) => {
  const [x0, y0] = pt(a0, r);
  const [x1, y1] = pt(a1, r);
  return `M ${CX} ${CY} L ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} Z`;
};

const BAND: Record<LapisanBumi["id"], { mid: number; width: number; minOpen: number }> = {
  kerak: { mid: 239, width: 22, minOpen: 8 },
  mantel: { mid: 188, width: 80, minOpen: 24 },
  "inti-luar": { mid: 109, width: 78, minOpen: 40 },
  "inti-dalam": { mid: 35, width: 70, minOpen: 56 },
};

export default function CrossSection() {
  const [open, setOpen] = useState(46);
  const [selected, setSelected] = useState<LapisanBumi["id"]>("mantel");
  const [hovered, setHovered] = useState<LapisanBumi["id"] | null>(null);

  const a0 = -90;
  const a1 = -90 + open;

  const wedge = useMemo(() => wedgePath(R_OUT + 4, a0, a1), [a1]);
  const sliceShift = useMemo(() => {
    const midRad = ((a0 + open / 2) * Math.PI) / 180;
    const d = 8 + open * 0.42;
    return { tx: d * Math.cos(midRad), ty: d * Math.sin(midRad), rot: open * 0.5 };
  }, [open]);

  const hatches = useMemo(() => {
    const lines: string[] = [];
    for (let a = a0 + 3; a < a1 - 2; a += 7) {
      const [x0, y0] = pt(a, 58);
      const [x1, y1] = pt(a, R_OUT);
      lines.push(`M ${x0} ${y0} L ${x1} ${y1}`);
    }
    return lines.join(" ");
  }, [a1]);

  const info = LAPISAN.find((l) => l.id === selected)!;

  const selectLayer = (id: LapisanBumi["id"]) => {
    setSelected(id);
    const need = BAND[id].minOpen + 10;
    setOpen((o) => Math.max(o, need));
  };

  return (
    <section id="belah" className="relative bg-sun py-20 sm:py-24" aria-label="Bab B: penampang Bumi">
      {/* kontur kuning tua */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`M-40 ${90 + i * 150} C 260 ${40 + i * 150}, 500 ${150 + i * 150}, 780 ${80 + i * 150} S 1180 ${130 + i * 150}, 1260 ${70 + i * 150}`}
            fill="none"
            stroke="#c98f00"
            strokeWidth="1.6"
          />
        ))}
      </svg>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs font-semibold tracking-[0.22em] text-ink/60">BAB B · ILMU BUMI</p>
              <h2 className="font-display mt-2 text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.02] font-black text-ink">
                Coba belah Bumi.
              </h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed font-medium text-ink/75">
                Dari kerak yang tipis sampai inti yang panasnya menyaingi permukaan Matahari — geser
                tuasnya untuk mengupas planet ini, lalu ketuk lapisannya.
              </p>
            </div>
            <span className="shadow-pop-sm mb-2 hidden shrink-0 rotate-2 rounded-lg border-2 border-ink bg-paper px-3 py-2 font-mono text-[11px] font-semibold text-ink/70 md:block">
              diagram disederhanakan
              <br />
              ukuran tidak berskala
            </span>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_0.85fr] lg:gap-10">
          {/* ------- diagram ------- */}
          <Reveal direction="left">
            <figure className="relative">
              <svg viewBox="0 0 800 660" className="w-full" role="img" aria-label="Diagram penampang Bumi: kerak, mantel, inti luar cair, dan inti dalam padat.">
                <defs>
                  <clipPath id="wedgeClip">
                    <path d={wedge} />
                  </clipPath>
                  <radialGradient id="mantleGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="55%" stopColor="#f98f70" />
                    <stop offset="100%" stopColor="#e4573c" />
                  </radialGradient>
                </defs>

                {/* penggaris kedalaman */}
                <g className="font-mono" aria-hidden="true">
                  <line x1="52" y1="85" x2="52" y2="585" stroke="#183630" strokeWidth="2" opacity="0.55" />
                  {[
                    [85, "0 km"],
                    [312, "2.900 km"],
                    [489, "5.150 km"],
                    [585, "6.371 km"],
                  ].map(([y, lab]) => (
                    <g key={lab as string}>
                      <line x1="44" y1={y as number} x2="60" y2={y as number} stroke="#183630" strokeWidth="2" opacity="0.55" />
                      <text x="38" y={(y as number) + 4} textAnchor="end" fontSize="11" fill="#183630" opacity="0.75">
                        {lab}
                      </text>
                    </g>
                  ))}
                  <text x="52" y="618" textAnchor="middle" fontSize="11" fill="#183630" opacity="0.7">
                    kedalaman
                  </text>
                </g>

                {/* globe dasar (permukaan) */}
                <g>
                  <circle cx={CX} cy={CY} r={R_OUT} fill="#2f86e0" stroke="#183630" strokeWidth="3" />
                  <path d="M220 240 C210 200 250 170 300 178 C350 186 366 220 344 252 C360 282 330 310 288 304 C246 316 214 284 220 240 Z" fill="#57b876" stroke="#2e7d4f" strokeWidth="2.5" />
                  <path d="M400 380 C392 352 416 332 448 336 C480 340 494 362 486 386 C494 404 478 422 452 420 C424 426 406 406 400 380 Z" fill="#57b876" stroke="#2e7d4f" strokeWidth="2.5" />
                  <path d="M420 200 C416 178 434 162 458 166 C482 170 492 188 486 208 C490 224 478 238 456 236 C434 240 422 222 420 200 Z" fill="#6cc488" stroke="#2e7d4f" strokeWidth="2.5" />
                  <circle cx="330" cy="430" r="9" fill="#57b876" stroke="#2e7d4f" strokeWidth="2" />
                  <circle cx={CX} cy={CY} r={R_OUT} fill="none" stroke="#183630" strokeWidth="3" />
                </g>

                {/* MUKA POTONG (terlihat saat irisan terbuka) */}
                <g clipPath="url(#wedgeClip)">
                  <circle cx={CX} cy={CY} r={R_OUT} fill="#69c487" opacity={selected === "kerak" || hovered === "kerak" ? 1 : 0.92} style={{ transition: "opacity 250ms" }} />
                  <circle cx={CX} cy={CY} r={R_CRUST_IN} fill="url(#mantleGrad)" opacity={selected === "mantel" || hovered === "mantel" ? 1 : 0.9} style={{ transition: "opacity 250ms" }} />
                  <circle cx={CX} cy={CY} r={R_MANTLE_IN} fill="#ffb020" opacity={selected === "inti-luar" || hovered === "inti-luar" ? 1 : 0.9} style={{ transition: "opacity 250ms" }} />
                  <circle cx={CX} cy={CY} r={R_OC_IN} fill="#ffe58a" />

                  <path d={hatches} stroke="#183630" strokeWidth="1.4" opacity="0.08" fill="none" />

                  {/* inti luar cair: riak bergerak */}
                  <g stroke="#c77f00" strokeWidth="3" fill="none" opacity="0.55" data-anim style={{ strokeDasharray: "10 12", animation: "dash-flow 1.4s linear infinite" }}>
                    <path d="M 250 262 Q 300 240 352 258 T 420 268" />
                    <path d="M 262 408 Q 318 430 372 412 T 428 398" />
                    <path d="M 236 336 Q 268 322 300 334" />
                  </g>

                  {/* mantel: panah aliran sangat lambat */}
                  <g stroke="#b23c22" strokeWidth="3.4" fill="none" opacity="0.5" strokeLinecap="round" data-anim style={{ strokeDasharray: "2 14", animation: "dash-flow 3.2s linear infinite" }}>
                    <path d="M 200 250 A 150 150 0 0 1 330 182" />
                    <path d="M 462 420 A 150 150 0 0 1 330 486" />
                  </g>

                  {/* inti dalam: hatch padat */}
                  <circle cx={CX} cy={CY} r={R_OC_IN - 10} fill="none" stroke="#e0a800" strokeWidth="2" strokeDasharray="3 6" opacity="0.8" />
                  <circle cx={CX} cy={CY} r={R_OC_IN - 28} fill="none" stroke="#e0a800" strokeWidth="2" strokeDasharray="3 6" opacity="0.8" />

                  {/* batas antar lapisan */}
                  <circle cx={CX} cy={CY} r={R_CRUST_IN} fill="none" stroke="#183630" strokeWidth="2" opacity="0.75" />
                  <circle cx={CX} cy={CY} r={R_MANTLE_IN} fill="none" stroke="#183630" strokeWidth="2" opacity="0.75" />
                  <circle cx={CX} cy={CY} r={R_OC_IN} fill="none" stroke="#183630" strokeWidth="2" opacity="0.75" />

                  {/* sorotan lapisan terpilih */}
                  <circle
                    cx={CX}
                    cy={CY}
                    r={BAND[selected].mid}
                    fill="none"
                    stroke="#183630"
                    strokeWidth={BAND[selected].width}
                    strokeOpacity="0.18"
                  />
                  <circle cx={CX} cy={CY} r={BAND[selected].mid} fill="none" stroke="#183630" strokeWidth="2.6" strokeDasharray="7 6" />
                </g>

                {/* IRISAN PERMUKAAN terkelupas */}
                <g transform={`translate(${sliceShift.tx} ${sliceShift.ty}) rotate(${sliceShift.rot} ${CX} ${CY})`}>
                  <g clipPath="url(#wedgeClip)">
                    <circle cx={CX} cy={CY} r={R_OUT} fill="#2f86e0" />
                    <circle cx={CX} cy={CY} r={R_OUT - 10} fill="none" stroke="#57b876" strokeWidth="20" />
                    <path d="M280 130 C300 108 340 108 358 130 C370 148 352 166 326 162 C300 168 272 152 280 130 Z" fill="#57b876" stroke="#2e7d4f" strokeWidth="2.4" />
                    <path d="M390 190 C404 172 436 172 448 190 C458 206 444 222 422 218 C400 222 382 206 390 190 Z" fill="#6cc488" stroke="#2e7d4f" strokeWidth="2.4" />
                    <circle cx={CX} cy={CY} r={R_OUT} fill="none" stroke="#183630" strokeWidth="3" />
                    <circle cx={CX} cy={CY} r={R_CRUST_IN} fill="none" stroke="#183630" strokeWidth="2" opacity="0.6" />
                  </g>
                </g>

                {/* garis label */}
                <g>
                  {LAPISAN.map((l) => {
                    const visible = open >= BAND[l.id].minOpen;
                    const [ax, ay] = pt(a1, BAND[l.id].mid);
                    const bx = ax + 20;
                    const by = ay - 12;
                    return (
                      <g key={l.id} opacity={visible ? 1 : 0} style={{ transition: "opacity 320ms ease" }} aria-hidden={visible ? undefined : true}>
                        <path d={`M ${ax} ${ay} L ${bx} ${by} L ${bx + 52} ${by}`} fill="none" stroke="#183630" strokeWidth="2.2" />
                        <circle cx={ax} cy={ay} r="4.5" fill={l.warna} stroke="#183630" strokeWidth="2" />
                        <text x={bx + 58} y={by - 2} fontSize="17" fontWeight="800" fill="#183630" fontFamily="Plus Jakarta Sans, sans-serif">
                          {l.nama}
                        </text>
                        <text x={bx + 58} y={by + 14} fontSize="11.5" fill="#183630" opacity="0.72" fontFamily="IBM Plex Mono, monospace">
                          {l.rentang}
                        </text>
                      </g>
                    );
                  })}
                </g>

                {/* area klik per lapisan */}
                {LAPISAN.map((l) => (
                  <circle
                    key={`hit-${l.id}`}
                    cx={CX}
                    cy={CY}
                    r={BAND[l.id].mid}
                    fill="none"
                    stroke={hovered === l.id ? "rgba(24,54,48,0.14)" : "rgba(0,0,0,0)"}
                    strokeWidth={BAND[l.id].width}
                    style={{ cursor: "pointer", transition: "stroke 180ms" }}
                    pointerEvents="stroke"
                    onClick={() => selectLayer(l.id)}
                    onMouseEnter={() => setHovered(l.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <title>{`Pilih lapisan ${l.nama}`}</title>
                  </circle>
                ))}
              </svg>

              {/* tuas buka penampang */}
              <div className="paper-card mx-auto mt-2 max-w-lg px-5 py-4">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="buka-penampang" className="text-sm font-extrabold text-ink">
                    Buka penampang
                  </label>
                  <output htmlFor="buka-penampang" className="font-mono text-sm font-semibold text-coral-deep">
                    {open}°
                  </output>
                </div>
                <input
                  id="buka-penampang"
                  type="range"
                  min={0}
                  max={80}
                  step={1}
                  value={open}
                  onChange={(e) => setOpen(Number(e.target.value))}
                  className="dial mt-1"
                  style={{ "--acc": "#f4795b", "--fill": `${(open / 80) * 100}%` } as CSSProperties}
                />
                <p className="font-mono text-[11px] text-ink/60">geser untuk mengupas Bumi ↷</p>
              </div>
            </figure>
          </Reveal>

          {/* ------- panel lapisan ------- */}
          <Reveal direction="right" delay={120}>
            <div className="flex h-full flex-col gap-3">
              <div role="tablist" aria-label="Pilih lapisan Bumi" className="grid gap-2.5">
                {LAPISAN.map((l) => {
                  const active = selected === l.id;
                  return (
                    <button
                      key={l.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => selectLayer(l.id)}
                      className={`btn-pop flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left ${
                        active ? "bg-ink text-paper" : "bg-paper text-ink"
                      }`}
                    >
                      <span className="h-6 w-6 shrink-0 rounded-full border-[2.5px] border-ink" style={{ background: l.warna }} />
                      <span>
                        <span className="block text-base leading-tight font-extrabold">{l.nama}</span>
                        <span className={`font-mono text-[11px] ${active ? "text-sun" : "text-ink/55"}`}>{l.rentang}</span>
                      </span>
                      <svg className={`ml-auto transition-transform duration-200 ${active ? "translate-x-0" : "-translate-x-1 opacity-40"}`} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M5 3l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  );
                })}
              </div>

              <div className="paper-card flex-1 p-5" role="tabpanel" aria-label={`Penjelasan ${info.nama}`}>
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded-full border-2 border-ink" style={{ background: info.warna }} />
                  <h3 className="font-display text-2xl font-black text-ink">{info.nama}</h3>
                </div>
                <dl className="mt-3 space-y-3">
                  <div>
                    <dt className="font-mono text-[11px] font-semibold tracking-widest text-coral-deep">MATERIAL</dt>
                    <dd className="mt-1 text-[15px] leading-relaxed font-medium text-ink/85">{info.material}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[11px] font-semibold tracking-widest text-coral-deep">FAKTA CEPAT</dt>
                    <dd className="mt-1 text-[15px] leading-relaxed font-medium text-ink/85">{info.fakta}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-lg border-2 border-ink bg-sun px-2.5 py-1 font-mono text-[11px] font-semibold text-ink">
                    {info.rentang}
                  </span>
                  <span className="rounded-lg border-2 border-ink bg-paper px-2.5 py-1 font-mono text-[11px] font-semibold text-ink">
                    {info.suhu}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
