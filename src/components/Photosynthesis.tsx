import { useState } from "react";
import type { CSSProperties } from "react";
import Reveal from "./Reveal";

export default function Photosynthesis() {
  const [light, setLight] = useState(70);
  const [water, setWater] = useState(70);

  /* Model sederhana dengan plateau: tiap faktor jenuh, laju = yang terkecil. */
  const L = light / 100;
  const Wt = water / 100;
  const lightResp = Math.min(1, (L / (L + 0.32)) * 1.32);
  const waterResp = Math.min(1, (Wt / (Wt + 0.22)) * 1.22);
  const rate = Math.max(0.02, Math.min(lightResp, waterResp) * (water < 4 ? 0.35 : 1));
  const limiting: "cahaya" | "air" | "seimbang" =
    Math.abs(lightResp - waterResp) < 0.07 ? "seimbang" : lightResp < waterResp ? "cahaya" : "air";

  const rayCount = Math.round((light / 100) * 7);
  const needleDeg = -90 + rate * 180;
  const gaugeColor = rate < 0.28 ? "#f4795b" : rate < 0.62 ? "#f2b705" : "#57b876";
  const waterDur = Math.max(0.9, 3 - (water / 100) * 2.2);

  const penjelasan =
    water < 12
      ? "Air hampir habis. Tumbuhan menutup stomata untuk menghemat air — akibatnya CO₂ sulit masuk dan fotosintesis melambat. Tenang, ia belum mati: prosesnya hanya melambat sambil menunggu air."
      : light < 12
        ? "Hampir gelap. Tanpa energi cahaya, reaksi fotosintesis kehilangan bahan bakarnya — laju turun drastis meski air dan CO₂ tersedia."
        : rate > 0.82
          ? "Cahaya, air, dan CO₂ sama-sama cukup — laju mendekati maksimum. Perhatikan: menambah cahaya lebih terang lagi hampir tidak menaikkan laju. Sesuatu yang lain kini membatasi."
          : limiting === "cahaya"
            ? "Cahaya menjadi faktor pembatas: naikkan tuas cahaya dan lihat lajunya ikut naik — sampai faktor lain mengambil alih."
            : limiting === "air"
              ? "Air menjadi faktor pembatas: kurang air berarti stomata cenderung menutup, CO₂ berkurang, dan laju fotosintesis tertahan."
              : "Cahaya dan air seimbang — fotosintesis berjalan stabil. Geser salah satu tuas dan amati mana yang menjadi pembatas.";

  const token = (text: string, color: string, isLimiting: boolean, key: string) => (
    <span
      key={key}
      className={`inline-block rounded-lg border-2 border-ink bg-paper px-2 py-0.5 text-[13px] font-bold whitespace-nowrap transition-all duration-200 sm:text-sm ${
        isLimiting ? "-rotate-1 bg-[#ffe3d9]" : ""
      }`}
      style={{ borderBottomWidth: 4, borderBottomColor: color }}
    >
      {text}
      {isLimiting && (
        <sup className="font-mono ml-1 text-[9px] font-semibold text-coral-deep">pembatas</sup>
      )}
    </span>
  );

  return (
    <section
      id="daun"
      className="relative py-20 sm:py-24"
      style={{
        backgroundColor: "#eef4e6",
        backgroundImage:
          "linear-gradient(#dbe8d0 1px, transparent 1px), linear-gradient(90deg, #dbe8d0 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }}
      aria-label="Bab E: fotosintesis"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-xs font-semibold tracking-[0.22em] text-leaf-deep">BAB E · BIOLOGI</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.02] font-black text-ink">
              Apa yang dibutuhkan <span className="text-leaf-deep">daun?</span>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed font-medium text-ink/70">
              Meja praktikum mini: atur cahaya dan air, lalu intip bagian dalam daun lewat kaca
              pembesar. Fotosintesis menjawab.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
          {/* ------- panel instrumen ------- */}
          <div className="order-2 flex flex-col gap-4 lg:order-1">
            <Reveal direction="left">
              <div className="paper-card p-5">
                <h3 className="font-display text-xl font-black text-ink">Meja kendali</h3>

                <div className="mt-4">
                  <div className="flex items-baseline justify-between">
                    <label htmlFor="ctl-cahaya" className="text-sm font-extrabold text-ink">
                      Intensitas cahaya
                    </label>
                    <output htmlFor="ctl-cahaya" className="font-mono text-sm font-semibold text-[#c77f00]">
                      {light}%
                    </output>
                  </div>
                  <input
                    id="ctl-cahaya"
                    type="range"
                    min={0}
                    max={100}
                    value={light}
                    onChange={(e) => setLight(Number(e.target.value))}
                    className="dial"
                    style={{ "--acc": "#f2b705", "--fill": `${light}%` } as CSSProperties}
                  />
                </div>

                <div className="mt-2">
                  <div className="flex items-baseline justify-between">
                    <label htmlFor="ctl-air" className="text-sm font-extrabold text-ink">
                      Ketersediaan air
                    </label>
                    <output htmlFor="ctl-air" className="font-mono text-sm font-semibold text-ocean">
                      {water}%
                    </output>
                  </div>
                  <input
                    id="ctl-air"
                    type="range"
                    min={0}
                    max={100}
                    value={water}
                    onChange={(e) => setWater(Number(e.target.value))}
                    className="dial"
                    style={{ "--acc": "#176bdb", "--fill": `${water}%` } as CSSProperties}
                  />
                </div>

                {/* dial laju */}
                <div className="mt-5 flex items-center gap-4">
                  <svg viewBox="0 0 200 118" className="w-40 shrink-0" aria-hidden="true">
                    <path d="M 16 104 A 84 84 0 0 1 184 104" fill="none" stroke="rgba(24,54,48,0.14)" strokeWidth="13" strokeLinecap="round" />
                    <path
                      d="M 16 104 A 84 84 0 0 1 184 104"
                      fill="none"
                      stroke={gaugeColor}
                      strokeWidth="13"
                      strokeLinecap="round"
                      strokeDasharray={`${rate * 264} 400`}
                      style={{ transition: "stroke-dasharray 380ms cubic-bezier(.2,.7,.2,1), stroke 380ms" }}
                    />
                    {[-90, 0, 90].map((a) => (
                      <line
                        key={a}
                        x1="100"
                        y1="28"
                        x2="100"
                        y2="38"
                        stroke="#183630"
                        strokeWidth="2.4"
                        transform={`rotate(${a} 100 104)`}
                        opacity="0.5"
                      />
                    ))}
                    <g style={{ transform: `rotate(${needleDeg}deg)`, transformOrigin: "100px 104px", transition: "transform 380ms cubic-bezier(.2,.7,.2,1)" }}>
                      <line x1="100" y1="104" x2="100" y2="32" stroke="#183630" strokeWidth="3.4" strokeLinecap="round" />
                    </g>
                    <circle cx="100" cy="104" r="7" fill="#183630" />
                    <text x="14" y="116" fontSize="10" fontFamily="IBM Plex Mono, monospace" fill="#183630" opacity="0.6">0</text>
                    <text x="176" y="116" fontSize="10" fontFamily="IBM Plex Mono, monospace" fill="#183630" opacity="0.6">maks</text>
                  </svg>
                  <div>
                    <p className="font-mono text-4xl font-semibold text-ink">{Math.round(rate * 100)}%</p>
                    <p className="text-xs font-bold tracking-wide text-ink/60">LAJU FOTOSINTESIS</p>
                    <p className="font-mono mt-2 text-[11px] text-ink/60">
                      O₂ ≈ {Math.max(0, Math.round(rate * 24 - 1))} gelembung/menit
                    </p>
                  </div>
                </div>

                {/* gula */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] font-bold text-ink/60">
                    <span>Gula tersimpan</span>
                    <span className="font-mono">{Math.round(rate * 100)}/100</span>
                  </div>
                  <div className="mt-1 h-3.5 overflow-hidden rounded-full border-2 border-ink bg-paper">
                    <div
                      className="h-full rounded-full bg-sun"
                      style={{ width: `${rate * 100}%`, transition: "width 380ms cubic-bezier(.2,.7,.2,1)" }}
                    />
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal direction="left" delay={100}>
              <div className="paper-card p-5" role="status">
                <p className="font-mono text-[11px] font-semibold tracking-widest text-leaf-deep">CATATAN PENGAMATAN</p>
                <p className="mt-1.5 text-[15px] leading-relaxed font-medium text-ink/85">{penjelasan}</p>
              </div>
            </Reveal>

            <Reveal direction="left" delay={160}>
              <div className="paper-card p-5">
                <p className="font-mono text-[11px] font-semibold tracking-widest text-leaf-deep">PERSAMAAN KATA</p>
                <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 text-ink">
                  {token("karbon dioksida", "#176bdb", false, "co2")}
                  <span className="font-display text-xl font-black">+</span>
                  {token("air", "#4a90d9", limiting === "air", "h2o")}
                  <span className="font-display text-xl font-black">+</span>
                  {token("energi cahaya", "#f2b705", limiting === "cahaya", "hv")}
                  <span className="font-display text-xl font-black" aria-hidden="true">→</span>
                  {token("gula", "#57b876", false, "gula")}
                  <span className="font-display text-xl font-black">+</span>
                  {token("oksigen", "#8ecae6", false, "o2")}
                </p>
                <p className="font-mono mt-3 text-[11px] text-ink/55">
                  Model konseptual — bukan perhitungan biologis.
                </p>
              </div>
            </Reveal>
          </div>

          {/* ------- adegan praktikum ------- */}
          <Reveal direction="right" delay={80} className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-2xl border-[2.5px] border-ink bg-[#f6fbef] shadow-pop-lg">
              <svg viewBox="0 0 640 560" className="w-full" role="img" aria-label="Tanaman dalam pot dengan lampu, kaca pembesar memperlihatkan stomata daun, gelembung oksigen, dan aliran air dari akar.">
                <defs>
                  <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7ecf95" />
                    <stop offset="100%" stopColor="#3f9c60" />
                  </linearGradient>
                  <clipPath id="soilClip">
                    <path d="M254 388 L386 388 L370 462 L270 462 Z" />
                  </clipPath>
                  <clipPath id="lensClip">
                    <circle cx="474" cy="296" r="88" />
                  </clipPath>
                </defs>

                {/* lampu */}
                <line x1="320" y1="0" x2="320" y2="50" stroke="#183630" strokeWidth="3" />
                <path d="M282 50 L358 50 L372 88 L268 88 Z" fill="#ffd447" stroke="#183630" strokeWidth="3" />
                <circle cx="320" cy="94" r="9" fill="#fff2c0" stroke="#f2b705" strokeWidth="3" />

                {/* berkas cahaya */}
                <g
                  data-anim
                  stroke="#f2b705"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  opacity={0.25 + 0.75 * (light / 100)}
                  style={{ strokeDasharray: "9 11", animation: light > 4 ? "dash-flow 1.1s linear infinite" : "none" }}
                >
                  {[
                    [252, 168],
                    [276, 148],
                    [300, 136],
                    [320, 130],
                    [342, 136],
                    [366, 148],
                    [390, 168],
                  ].slice(0, Math.max(rayCount, light > 4 ? 1 : 0)).map(([x, y], i) => (
                    <line key={i} x1="320" y1="102" x2={x} y2={y} />
                  ))}
                </g>

                {/* meja */}
                <rect x="36" y="468" width="568" height="24" rx="4" fill="#b98a5e" stroke="#183630" strokeWidth="3" />
                <rect x="66" y="492" width="18" height="52" fill="#a0764e" stroke="#183630" strokeWidth="2.4" />
                <rect x="556" y="492" width="18" height="52" fill="#a0764e" stroke="#183630" strokeWidth="2.4" />

                {/* pot potong-melintang */}
                <path d="M240 380 L400 380 L380 468 L260 468 Z" fill="#f4795b" stroke="#183630" strokeWidth="3" />
                <path d="M254 388 L386 388 L370 462 L270 462 Z" fill="#8a5a3b" />
                <g clipPath="url(#soilClip)">
                  <rect
                    x="250"
                    y={462 - (8 + (water / 100) * 66)}
                    width="140"
                    height={8 + (water / 100) * 66}
                    fill="#4a90d9"
                    opacity="0.5"
                    style={{ transition: "y 380ms ease, height 380ms ease" }}
                  />
                </g>
                <rect x="230" y="362" width="180" height="20" rx="4" fill="#e06a4c" stroke="#183630" strokeWidth="3" />
                {/* akar */}
                <g stroke="#e6d3ac" strokeWidth="3.4" fill="none" strokeLinecap="round">
                  <path d="M320 388 C 316 410 300 420 288 438" />
                  <path d="M320 388 C 324 414 342 424 352 442" />
                  <path d="M320 388 C 320 416 314 434 318 456" />
                </g>
                {/* air naik lewat batang */}
                {water > 5 && (
                  <g data-anim>
                    {[0, 1, 2].map((i) => (
                      <circle
                        key={i}
                        cx="320"
                        cy="352"
                        r="4"
                        fill="#4a90d9"
                        style={{ animation: `drop-up ${waterDur}s linear infinite`, animationDelay: `${i * (waterDur / 3)}s` }}
                      />
                    ))}
                  </g>
                )}

                {/* batang + daun */}
                <path d="M320 362 C 318 320 322 280 320 240" fill="none" stroke="#2e7d4f" strokeWidth="9" strokeLinecap="round" />
                <path d="M320 300 C 300 292 282 282 268 268" fill="none" stroke="#2e7d4f" strokeWidth="5" strokeLinecap="round" />
                <path d="M320 276 C 342 268 360 260 374 248" fill="none" stroke="#2e7d4f" strokeWidth="5" strokeLinecap="round" />
                <path d="M320 150 C 366 178 374 232 320 262 C 266 232 274 178 320 150 Z" fill="url(#leafGrad)" stroke="#2e7d4f" strokeWidth="3" />
                <path d="M320 158 L 320 254" stroke="#2e7d4f" strokeWidth="2.4" opacity="0.7" />
                <path d="M268 232 C 300 240 312 258 306 286 C 276 282 258 262 268 232 Z" fill="url(#leafGrad)" stroke="#2e7d4f" strokeWidth="2.6" />
                <path d="M374 214 C 344 224 334 242 340 268 C 368 262 384 242 374 214 Z" fill="url(#leafGrad)" stroke="#2e7d4f" strokeWidth="2.6" />

                {/* gelembung O2 */}
                <g opacity={Math.min(1, rate * 1.3)} data-anim>
                  {[
                    [398, 208, 4.4, 0],
                    [412, 226, 5.4, 0.8],
                    [390, 240, 3.6, 1.6],
                    [420, 200, 3.8, 2.3],
                  ].map(([x, y, r, dl], i) => (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r={r}
                      fill="#8ecae6"
                      stroke="#4a90d9"
                      strokeWidth="1.6"
                      style={{ animation: "bubble-rise 3s ease-out infinite", animationDelay: `${dl}s` }}
                    />
                  ))}
                </g>
                <text x="404" y="186" fontSize="12" fontFamily="IBM Plex Mono, monospace" fill="#2e7d4f" fontWeight="600">
                  O₂ keluar
                </text>

                {/* kaca pembesar: penampang daun */}
                <line x1="540" y1="362" x2="600" y2="444" stroke="#183630" strokeWidth="12" strokeLinecap="round" />
                <line x1="540" y1="362" x2="600" y2="444" stroke="#b98a5e" strokeWidth="7" strokeLinecap="round" />
                <circle cx="474" cy="296" r="92" fill="#ffffff" opacity="0.94" />
                <circle cx="474" cy="296" r="92" fill="none" stroke="#183630" strokeWidth="5" />
                <g clipPath="url(#lensClip)">
                  <rect x="382" y="204" width="184" height="184" fill="#e9f6ec" />
                  {/* sel-sel daun */}
                  {[0, 1, 2].map((row) =>
                    [0, 1, 2, 3].map((col) => (
                      <ellipse
                        key={`${row}-${col}`}
                        cx={412 + col * 42 + (row % 2 ? 18 : 0)}
                        cy={240 + row * 34}
                        rx="19"
                        ry="13"
                        fill="#bfe6c9"
                        stroke="#57b876"
                        strokeWidth="2"
                      />
                    )),
                  )}
                  {[
                    [416, 238],
                    [452, 244],
                    [494, 240],
                    [432, 274],
                    [474, 272],
                    [510, 278],
                  ].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="4" fill="#2e7d4f" opacity="0.75" />
                  ))}
                  {/* rongga udara */}
                  <ellipse cx="474" cy="330" rx="62" ry="20" fill="#f3faf4" stroke="#bfe6c9" strokeWidth="2" />
                  {/* stomata */}
                  <path d="M446 356 Q 458 344 470 356 Q 458 362 446 356 Z" fill="#7ecf95" stroke="#2e7d4f" strokeWidth="2.4" />
                  <path d="M478 356 Q 490 344 502 356 Q 490 362 478 356 Z" fill="#7ecf95" stroke="#2e7d4f" strokeWidth="2.4" />
                  <ellipse cx="474" cy="355" rx="5.5" ry="7" fill="#183630" opacity="0.8" />
                  <text x="474" y="378" textAnchor="middle" fontSize="11" fontFamily="IBM Plex Mono, monospace" fill="#183630" fontWeight="600">
                    stomata
                  </text>
                </g>

                {/* panah CO2 masuk / O2 keluar */}
                <g opacity={0.2 + 0.8 * rate} style={{ transition: "opacity 300ms" }}>
                  <g data-anim stroke="#183630" strokeWidth="3" fill="none" style={{ strokeDasharray: "7 8", animation: "dash-flow 1s linear infinite" }}>
                    <path d="M598 268 Q 560 300 512 336" markerEnd="url(#psArrowInk)" />
                  </g>
                  <text x="600" y="258" fontSize="13" fontFamily="IBM Plex Mono, monospace" fill="#183630" fontWeight="700">
                    CO₂
                  </text>
                  <g data-anim stroke="#176bdb" strokeWidth="3" fill="none" style={{ strokeDasharray: "7 8", animation: "dash-flow-rev 1s linear infinite" }}>
                    <path d="M512 348 Q 560 380 596 404" markerEnd="url(#psArrowBlue)" />
                  </g>
                  <text x="598" y="424" fontSize="13" fontFamily="IBM Plex Mono, monospace" fill="#176bdb" fontWeight="700">
                    O₂
                  </text>
                </g>
                <defs>
                  <marker id="psArrowInk" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                    <path d="M0 0 L10 5 L0 10 z" fill="#183630" />
                  </marker>
                  <marker id="psArrowBlue" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                    <path d="M0 0 L10 5 L0 10 z" fill="#176bdb" />
                  </marker>
                </defs>

                {/* label meja */}
                <text x="56" y="452" fontSize="12" fontFamily="IBM Plex Mono, monospace" fill="#183630" opacity="0.75">
                  percobaan no. 04 — daun
                </text>
                <text x="56" y="534" fontSize="12" fontFamily="IBM Plex Mono, monospace" fill="#183630" opacity="0.6">
                  cahaya: {light}% · air: {water}%
                </text>
              </svg>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
