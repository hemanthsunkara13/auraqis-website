/**
 * V2 media manifest. All V2 imagery is AI-generated concept visualisation derived from one
 * conceptual residence; it is not a built AURAQIS project and is labelled as such on the site.
 * Files are produced by tools/media/enhance.py (+ finalize.py).
 */
export type Film = { src: string; mobile?: string; poster: string };
export type FrameSet = { base: string; count: number; aspect: number };

const film = (name: string, mobile = true): Film => ({
  src: `/media/video/${name}.mp4`,
  mobile: mobile ? `/media/video/${name}-720.mp4` : undefined,
  poster: `/media/video/${name}.jpg`,
});

export const films = {
  hero: film("hero"),
  result: film("result"),
  kitchen: film("kitchen"),
  bedroom: film("bedroom"),
  smart: film("smart"),
  smartReverse: { src: "/media/video/smart-reverse.mp4", poster: "/media/video/smart-end.jpg" } as Film,
};

export const sequences = {
  build: { base: "/media/frames/build", count: 180, aspect: 16 / 9 } satisfies FrameSet,
  enter: { base: "/media/frames/enter", count: 200, aspect: 16 / 9 } satisfies FrameSet,
};

export const still = (id: string) => `/media/stills/${id}.jpg`;

export const CONCEPT_LABEL = "Concept visualisation · AI-generated imagery";
