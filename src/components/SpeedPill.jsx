import { useState } from "react";
import { useT } from "../i18n.jsx";
import { Bolt } from "../lib/ui.jsx";

export default function SpeedPill() {
  const { t } = useT();
  const [hide, setHide] = useState(false);
  if (hide) return null;
  return (
    <button className="speedpill" onClick={() => setHide(true)}>
      <span className="speedpill__text">{t.pill}</span>
      <span className="speedpill__bolt" aria-hidden="true"><Bolt /></span>
    </button>
  );
}
