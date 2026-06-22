import { useT } from "../../i18n.jsx";
import { SectionHead } from "../../lib/ui.jsx";

export default function Philosophy() {
  const { t } = useT();
  return (
    <section className="stack" id="about">
      <SectionHead className="stack__inner" kicker={t.philosophy.eyebrow} title={t.philosophy.h2} />
    </section>
  );
}
