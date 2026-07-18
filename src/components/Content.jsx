import {
  Hero, Logos, Philosophy, Matchoice, OnPrem, Services,
  Spotlight, Industries, Code, Contact,
} from "./sections/index.js";

/* Default page composition. Swap/reorder/trim this list to re-assemble the page. */
export const defaultSections = [
  Hero,
  Logos,
  Philosophy,
  Matchoice,
  OnPrem,
  Services,
  Spotlight,
  Industries,
  Code,
  Contact,
];

/* <main> wrapper that renders a list of section components.
   Pass `sections` to compose a different page from the same building blocks. */
export default function Content({ sections = defaultSections }) {
  return (
    <main id="main">
      {sections.map((Section, i) => <Section key={Section.name || i} />)}
    </main>
  );
}
