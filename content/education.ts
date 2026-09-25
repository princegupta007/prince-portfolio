import type { EduItem } from "./types";

/**
 * 08 · Background — education cards + trajectory note.
 */

export const BACKGROUND_HEAD = {
  idx: "08",
  title: "Background",
  meta: "Education & trajectory",
} as const;

// CV: Education — MCA (Data Science & Data Analytics), JECRC University,
//     2021–2023; BCA (Computer Science), University of Rajasthan, 2017–2021
export const EDUCATION: EduItem[] = [
  {
    degree: "Master of Computer Applications",
    field: "Data Science & Data Analytics",
    school: "JECRC University",
    place: "Jaipur, India",
    years: "2021 — 2023",
    abbr: "MCA",
  },
  {
    degree: "Bachelor of Computer Applications",
    field: "Computer Science",
    school: "University of Rajasthan",
    place: "Jaipur, India",
    years: "2017 — 2021",
    abbr: "BCA",
  },
];

// CV: Summary — continuous work since Jan 2023 (no gaps)
export const TRAJECTORY_NOTE =
  "**Working continuously since Jan 2023** — from junior full-stack delivery through agency work for international clients to independent end-to-end product ownership. 3.5+ years, no gaps." as const;
