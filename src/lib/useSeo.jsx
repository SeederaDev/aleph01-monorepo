import { useEffect } from "react";
import { useT } from "../i18n.jsx";

const SITE_URL = "https://aleph0I.com";

/* Ensure a <meta>/<link> tag exists and set its attribute. */
function upsert(selector, create, attr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
  return el;
}
const meta = (key, val, value) =>
  upsert(`meta[${key}="${val}"]`, () => {
    const m = document.createElement("meta");
    m.setAttribute(key, val);
    return m;
  }, "content", value);

/* Keeps title, description and social tags in sync with the active language. */
export function useSeo() {
  const { lang, t } = useT();
  useEffect(() => {
    const { title, description } = t.meta;
    document.title = title;
    document.documentElement.lang = lang;

    meta("name", "description", description);
    meta("property", "og:title", title);
    meta("property", "og:description", description);
    meta("property", "og:locale", lang === "it" ? "it_IT" : "en_US");
    meta("name", "twitter:title", title);
    meta("name", "twitter:description", description);

    upsert('link[rel="canonical"]', () => {
      const l = document.createElement("link");
      l.setAttribute("rel", "canonical");
      return l;
    }, "href", SITE_URL + "/");
  }, [lang, t]);
}
