import { NAV_ITEMS } from "../data/content";
import { useActiveSection } from "../lib/hooks";

const IDS = NAV_ITEMS.map((n) => n.id);

export default function Nav() {
  const active = useActiveSection(IDS);
  return (
    <header className="fixed inset-x-0 top-0 z-100 border-b-[2.5px] border-ink bg-paper/95 backdrop-blur-[2px]">
      <nav
        aria-label="Bab penjelajahan"
        className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6"
      >
        <a
          href="#sampul"
          className="font-display text-2xl font-black tracking-tight text-ink"
        >
          BUMI<span className="text-coral">!</span>
          <span className="ml-2 hidden align-middle font-mono text-[10px] font-medium tracking-widest text-ink/60 sm:inline">
            LAB PLANET HIDUP
          </span>
        </a>
        <div className="ml-auto flex items-center gap-0.5 overflow-x-auto sm:gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`group relative flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-bold transition-colors duration-150 sm:px-2.5 ${
                  isActive
                    ? "bg-ink text-paper"
                    : "text-ink/70 hover:bg-ink/8 hover:text-ink"
                }`}
              >
                <span
                  className={`font-mono text-[10px] ${
                    isActive ? "text-sun" : "text-coral"
                  }`}
                >
                  {item.huruf}
                </span>
                <span className="hidden md:inline">{item.label}</span>
                <span
                  className={`absolute inset-x-2 -bottom-[2.5px] h-[3px] rounded-full bg-coral transition-transform duration-200 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
