import { useEffect } from "react";

/* Render a string with \n as <br/> */
export const Lines = ({ text = "" }) =>
  text.split("\n").map((l, i, a) => (
    <span key={i}>{l}{i < a.length - 1 && <br />}</span>
  ));

/* The aleph/lightning accent mark, reused across sections */
export const Bolt = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
  </svg>
);

/* Reusable centered/section heading (eyebrow + h2 [+ cta]) */
export function SectionHead({ kicker, title, className = "", light = false, cta, children }) {
  return (
    <div className={`container ${className} reveal`}>
      <span className={`eyebrow ${light ? "eyebrow--light" : "eyebrow--orange"}`}>{kicker}</span>
      <h2><Lines text={title} /></h2>
      {cta}
      {children}
    </div>
  );
}

/* Scroll-reveal: reveals every .reveal node when it enters the viewport.
   Re-scans on each `deps` change so newly-rendered nodes are observed too. */
export function useReveal(deps = []) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))
        ),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
