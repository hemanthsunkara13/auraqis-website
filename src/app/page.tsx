import { HeroFilm } from "@/components/v2/HeroFilm";
import { Manifesto } from "@/components/v2/Manifesto";
import { BuildChapter } from "@/components/v2/BuildChapter";
import { ResultReveal } from "@/components/v2/ResultReveal";
import { StepInside } from "@/components/v2/StepInside";
import { ExploreFilm } from "@/components/v2/ExploreFilm";
import { Finale } from "@/components/v2/Finale";
import { buildChapters } from "@/content/v2";

/** Home is the film: vision → build → result → step inside, then a gateway into each category. */
export default function HomePage() {
  return (
    <>
      <HeroFilm />
      <Manifesto />
      <BuildChapter chapters={buildChapters} />
      <ResultReveal />
      <StepInside />
      <ExploreFilm />
      <Finale />
    </>
  );
}
