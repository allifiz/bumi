import Nav from "./components/Nav";
import Hero from "./components/Hero";
import CrossSection from "./components/CrossSection";
import DayNight from "./components/DayNight";
import WaterCycle from "./components/WaterCycle";
import Photosynthesis from "./components/Photosynthesis";
import Closing from "./components/Closing";

export default function App() {
  return (
    <>
      <a
        href="#konten"
        className="sr-only z-200 rounded-lg bg-sun px-4 py-2 font-bold text-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Lewati ke konten
      </a>
      <Nav />
      <main id="konten">
        <Hero />
        <CrossSection />
        <DayNight />
        <WaterCycle />
        <Photosynthesis />
        <Closing />
      </main>
    </>
  );
}
