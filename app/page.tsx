import { Hero } from "@/components/sections/Hero";
import { Numbers } from "@/components/sections/Numbers";
import { Expertise } from "@/components/sections/Expertise";
import { Exhibit } from "@/components/sections/Exhibit";
import { Experience } from "@/components/sections/Experience";
import { Principles } from "@/components/sections/Principles";
import { Stack } from "@/components/sections/Stack";
import { Background } from "@/components/sections/Background";
import { Contact } from "@/components/sections/Contact";
import { Reveal } from "@/components/interactive/Reveal";
import { InteractionLayer } from "@/components/interactive/InteractionLayer";
import { TimelineFill } from "@/components/interactive/TimelineFill";

/**
 * Single-page composition — 01 Hero → 09 Contact (03·B Wiring renders inside
 * Expertise, matching the prototype). All sections are Server Components;
 * interactivity comes only from the sanctioned islands (HeroCanvas,
 * WiringDiagram, RoleLens, CopyButton + the Phase 3 shell islands).
 * Section order matches SECTION_IDS (content/nav.ts) for the scrollspy,
 * dot rail, menu and footer index.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Numbers />
      <Expertise />
      <Exhibit />
      <Experience />
      <Principles />
      <Stack />
      <Background />
      <Contact />
      <Reveal />
      <InteractionLayer />
      <TimelineFill />
    </>
  );
}
