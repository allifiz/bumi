import { useState } from "react";
import { KUIS, SIMPUL, SISI, SUMBER } from "../data/content";
import Reveal from "./Reveal";

function Glyph({ id }: { id: string }) {
  const common = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "#183630", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (id) {
    case "matahari":
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" fill="#fff8e8" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="12" y1="2.6" x2="12" y2="5.2" transform={`rotate(${a} 12 12)`} />
          ))}
        </svg>
      );
    case "udara":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M3 8h9a2.5 2.5 0 1 0-2.4-3.2" />
          <path d="M3 12.5h14a2.6 2.6 0 1 1-2.5 3.3" />
          <path d="M3 17h7a2.2 2.2 0 1 1-2.1 2.8" />
        </svg>
      );
    case "air":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 3.5 C 8 9 5.5 12.4 5.5 15.2 a 6.5 6.5 0 0 0 13 0 C 18.5 12.4 16 9 12 3.5 Z" fill="#cfe4ff" />
        </svg>
      );
    case "tumbuhan":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M12 21 C 12 14 12 10 12 6" />
          <path d="M12 12 C 7 12 4.5 9 4.5 4.5 C 9.5 4.5 12 7 12 12 Z" fill="#cfe9d6" />
          <path d="M12 9 C 17 9 19.5 6 19.5 2 C 14.5 2 12 4.5 12 9 Z" fill="#cfe9d6" />
        </svg>
      );
    case "tanah":
      return (
        <svg {...common} aria-hidden="true">
          <path d="M3 7 L12 3.5 L21 7 L12 10.5 Z" fill="#efd9bf" />
          <path d="M3 12 L12 8.5 L21 12" />
          <path d="M3 17 L12 13.5 L21 17" />
          <path d="M3 21 L12 17.5 L21 21" />
        </svg>
      );
    default:
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="14.5" r="5" fill="#ffe3d9" />
          <circle cx="5.5" cy="9.5" r="1.8" />
          <circle cx="9.5" cy="5.8" r="1.8" />
          <circle cx="14.5" cy="5.8" r="1.8" />
          <circle cx="18.5" cy="9.5" r="1.8" />
        </svg>
      );
  }
}

function Quiz() {
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const soal = KUIS[idx];
  const answered = chosen !== null;

  const choose = (i: number) => {
    if (answered) return;
    setChosen(i);
    if (i === soal.benar) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx + 1 >= KUIS.length) {
      setDone(true);
    } else {
      setIdx((v) => v + 1);
      setChosen(null);
    }
  };

  const ulang = () => {
    setIdx(0);
    setChosen(null);
    setScore(0);
    setDone(false);
  };

  const pesan =
    score === 3
      ? "Sempurna! Insting planetmu tajam — Bumi beruntung punya pengamat sepertimu."
      : score === 2
        ? "Hebat! Sebagian besar gambarannya sudah kamu pegang. Coba sekali lagi untuk skor penuh?"
        : "Tidak apa-apa — setiap ilmuwan hebat pernah salah. Gulir ke atas, coba lagi eksperimennya, lalu tantang kuisnya.";

  return (
    <div className="paper-card mx-auto max-w-2xl p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-2xl font-black text-ink">Kuis singkat</h3>
        <span className="font-mono text-xs font-semibold text-ink/60">
          {done ? "SELESAI" : `soal ${idx + 1}/${KUIS.length}`}
        </span>
      </div>

      {/* progres */}
      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {KUIS.map((_, i) => (
          <span
            key={i}
            className={`h-2 flex-1 rounded-full border border-ink/40 transition-colors duration-300 ${
              done || i < idx || (i === idx && answered) ? (i < idx || done ? "bg-leaf" : "bg-sun") : "bg-paper"
            }`}
          />
        ))}
      </div>

      {!done ? (
        <div key={idx}>
          <p className="mt-5 text-lg leading-snug font-extrabold text-ink">{soal.pertanyaan}</p>
          <div className="mt-4 grid gap-2.5">
            {soal.opsi.map((op, i) => {
              let cls = "bg-paper text-ink hover:bg-paper-deep";
              if (answered) {
                if (i === soal.benar) cls = "bg-leaf text-ink";
                else if (i === chosen) cls = "bg-coral text-ink";
                else cls = "bg-paper text-ink/45";
              }
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => choose(i)}
                  disabled={answered}
                  className={`btn-pop rounded-xl px-4 py-3 text-left text-[15px] font-bold transition-colors duration-200 ${cls} disabled:cursor-default`}
                >
                  <span className="font-mono mr-2.5 text-xs text-coral-deep">{String.fromCharCode(65 + i)}</span>
                  {op}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="mt-4 rounded-xl border-2 border-dashed border-ink/40 bg-paper-deep/60 p-4" role="status">
              <p className={`font-display text-lg font-black ${chosen === soal.benar ? "text-leaf-deep" : "text-coral-deep"}`}>
                {chosen === soal.benar ? "Tepat sekali!" : "Belum tepat — dan itu tidak apa-apa."}
              </p>
              <p className="mt-1 text-sm leading-relaxed font-medium text-ink/80">{soal.penjelasan}</p>
              <button type="button" onClick={next} className="btn-pop mt-3 rounded-xl bg-sun px-5 py-2.5 text-sm font-extrabold text-ink">
                {idx + 1 >= KUIS.length ? "Lihat hasil" : "Soal berikutnya →"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5 text-center" role="status">
          <p className="font-display text-5xl font-black text-ink">
            {score}<span className="text-ink/40">/{KUIS.length}</span>
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed font-medium text-ink/75">{pesan}</p>
          <button type="button" onClick={ulang} className="btn-pop mt-4 rounded-xl bg-coral px-5 py-2.5 text-sm font-extrabold text-ink">
            Ulangi kuis
          </button>
        </div>
      )}
    </div>
  );
}

export default function Closing() {
  const [pilih, setPilih] = useState<string | null>(null);
  const simpul = SIMPUL.find((s) => s.id === pilih) ?? null;
  const relasi = simpul ? SISI.filter((e) => e.a === simpul.id || e.b === simpul.id) : [];

  return (
    <section id="jaringan" className="relative overflow-hidden bg-paper py-20 sm:py-24" aria-label="Bab F: semua saling terhubung">
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle key={i} cx="600" cy="430" r={120 + i * 90} fill="none" stroke="#183630" strokeWidth="1.4" strokeDasharray={i % 2 ? "3 10" : undefined} />
        ))}
      </svg>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-xs font-semibold tracking-[0.22em] text-coral-deep">BAB F · SINTESIS</p>
          <h2 className="font-display mt-2 max-w-2xl text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.02] font-black text-ink">
            Semua saling <span className="text-coral-deep">terhubung.</span>
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed font-medium text-ink/75">
            Matahari, air, batuan, udara, dan makhluk hidup membentuk satu mesin raksasa yang saling
            memberi. Ketuk satu unsur dan lihat benang hubungannya.
          </p>
        </Reveal>

        {/* jaring ekosistem */}
        <Reveal delay={100}>
          <div className="relative mt-8 h-[420px] rounded-2xl border-[2.5px] border-ink bg-paper-deep/60 shadow-pop-lg md:h-[470px]">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {SISI.map((e) => {
                const a = SIMPUL.find((s) => s.id === e.a)!;
                const b = SIMPUL.find((s) => s.id === e.b)!;
                const nyala = pilih !== null && (e.a === pilih || e.b === pilih);
                const redup = pilih !== null && !nyala;
                return (
                  <line
                    key={`${e.a}-${e.b}`}
                    x1={parseFloat(a.pos.left)}
                    y1={parseFloat(a.pos.top)}
                    x2={parseFloat(b.pos.left)}
                    y2={parseFloat(b.pos.top)}
                    stroke={nyala ? "#f4795b" : "#183630"}
                    strokeWidth={nyala ? 3 : 1.6}
                    vectorEffect="non-scaling-stroke"
                    strokeDasharray={nyala ? "8 7" : "2 6"}
                    opacity={redup ? 0.15 : nyala ? 1 : 0.4}
                    style={{ transition: "opacity 300ms ease" }}
                    className={nyala ? "wc-river-dash" : ""}
                  />
                );
              })}
            </svg>

            {SIMPUL.map((s) => {
              const active = pilih === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setPilih(active ? null : s.id)}
                  aria-pressed={active}
                  aria-label={`Unsur ${s.label}: tampilkan hubungannya`}
                  className={`btn-pop absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-full border-[3px] border-ink transition-transform duration-200 ${
                    active ? "scale-110" : "hover:scale-105"
                  }`}
                  style={{ left: s.pos.left, top: s.pos.top, background: s.warna, width: "clamp(64px, 11vw, 92px)", height: "clamp(64px, 11vw, 92px)", justifyContent: "center" }}
                >
                  <Glyph id={s.id} />
                  <span className="font-mono px-1 text-center text-[9px] leading-tight font-bold text-ink sm:text-[10px]">
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* keterangan unsur */}
        <Reveal delay={140}>
          <div className="paper-card mx-auto mt-5 max-w-2xl p-5" role="status">
            {simpul ? (
              <>
                <div className="flex items-center gap-2.5">
                  <span className="h-4 w-4 rounded-full border-2 border-ink" style={{ background: simpul.warna }} />
                  <h3 className="font-display text-xl font-black text-ink">{simpul.label}</h3>
                </div>
                <p className="mt-1.5 text-[15px] leading-relaxed font-medium text-ink/85">{simpul.keterangan}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {relasi.map((r) => {
                    const other = SIMPUL.find((s) => s.id === (r.a === simpul.id ? r.b : r.a))!;
                    return (
                      <span key={`${r.a}-${r.b}`} className="rounded-lg border-2 border-ink bg-sun/60 px-2 py-0.5 font-mono text-[11px] font-semibold text-ink">
                        ↔ {other.label.toLowerCase()}: {r.label}
                      </span>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-sm font-medium text-ink/65">
                Pilih salah satu lingkaran di atas — misalnya <strong className="text-ink">Matahari</strong> — untuk melihat perannya dalam
                jaring-jaring kehidupan.
              </p>
            )}
          </div>
        </Reveal>

        {/* kuis */}
        <Reveal delay={80}>
          <div className="mt-16">
            <Quiz />
          </div>
        </Reveal>

        {/* penutup */}
        <Reveal delay={60}>
          <div className="mt-16 text-center">
            <p className="font-display mx-auto max-w-2xl text-[clamp(1.5rem,3.4vw,2.4rem)] leading-snug font-black text-ink">
              Satu planet, miliaran proses, dan kamu ada di tengahnya.
              <span className="text-ocean"> Penjelajahan baru dimulai.</span>
            </p>
            <a href="#sampul" className="btn-pop mt-7 inline-flex items-center gap-2.5 rounded-xl bg-ocean px-7 py-3.5 text-lg font-extrabold text-paper">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M9 15V4M4 8l5-5 5 5" fill="none" stroke="#fff8e8" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Jelajahi lagi
            </a>
          </div>
        </Reveal>

        {/* sumber belajar */}
        <Reveal delay={80}>
          <div className="mt-16 border-t-[2.5px] border-dashed border-ink/25 pt-8">
            <h3 className="font-mono text-xs font-semibold tracking-[0.22em] text-ink/60">SUMBER BELAJAR LANJUTAN</h3>
            <ul className="mt-4 grid gap-x-10 gap-y-3 sm:grid-cols-2">
              {SUMBER.map((s, i) => (
                <li key={s.url} className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-bold text-coral-deep">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-[15px] font-extrabold text-ocean underline decoration-coral decoration-[3px] underline-offset-4 transition-colors hover:text-ocean-deep"
                    >
                      {s.label}
                    </a>
                    <span className="font-mono ml-2 text-[11px] text-ink/55">— {s.ket}</span>
                  </div>
                </li>
              ))}
            </ul>
            <p className="font-mono mt-4 text-[11px] leading-relaxed text-ink/55">
              Angka dan model di halaman ini disederhanakan untuk pembelajaran; sumber di atas dapat diverifikasi publik.
            </p>
          </div>
        </Reveal>
      </div>

      <footer className="relative mx-auto mt-14 max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t-[2.5px] border-ink/15 pt-5">
          <p className="font-display text-lg font-black text-ink">
            BUMI<span className="text-coral">!</span>
            <span className="font-mono ml-2 text-[10px] font-semibold tracking-widest text-ink/50">LABORATORIUM PLANET HIDUP</span>
          </p>
          <p className="font-mono text-[11px] text-ink/55">dibuat untuk rasa ingin tahu · ilustrasi & simulasi disederhanakan</p>
        </div>
      </footer>
    </section>
  );
}
