/* ============================================================
   Groq landing — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---- Nav: shadow on scroll ---- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  const burger = document.getElementById("navBurger");
  const mobileNav = document.getElementById("mobileNav");
  const toggleMenu = (open) => {
    if (open) mobileNav.style.paddingTop = nav.offsetHeight + 28 + "px";
    burger.classList.toggle("open", open);
    mobileNav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    mobileNav.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () =>
    toggleMenu(!mobileNav.classList.contains("open"))
  );
  mobileNav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => toggleMenu(false))
  );

  /* ---- Cookie + speed pill dismiss ---- */
  const cookie = document.getElementById("cookie");
  cookie
    .querySelectorAll("[data-cookie]")
    .forEach((b) => b.addEventListener("click", () => cookie.classList.add("hide")));

  const pill = document.getElementById("speedpill");
  if (pill) pill.addEventListener("click", () => pill.classList.add("hide"));

  /* ---- Seamless logo marquee (duplicate content) ---- */
  const track = document.getElementById("logosTrack");
  if (track) track.innerHTML += track.innerHTML;

  /* ---- Scroll reveal ---- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---- Provider poll: animate bars when scrolled into view ---- */
  const pollBars = document.getElementById("pollBars");
  if (pollBars) {
    const pollIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          pollBars.querySelectorAll(".pbar").forEach((bar, i) => {
            setTimeout(() => bar.classList.add("run"), i * 90);
          });
          pollIO.disconnect();
        });
      },
      { threshold: 0.35 }
    );
    pollIO.observe(pollBars);
  }

  /* ---- Code tabs ---- */
  const tabs = document.querySelectorAll(".code__tab");
  const panes = document.querySelectorAll(".code__pane");
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("is-active"));
      panes.forEach((p) => p.classList.remove("is-active"));
      tab.classList.add("is-active");
      const pane = document.querySelector(`.code__pane[data-pane="${tab.dataset.tab}"]`);
      if (pane) pane.classList.add("is-active");
    })
  );

  /* ---- Copy code ---- */
  const copyBtn = document.querySelector(".code__copy");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const active = document.querySelector(".code__pane.is-active code");
      if (!active) return;
      const text = active.innerText.replace(/^\s*\d+\s?/gm, "");
      navigator.clipboard?.writeText(text);
      copyBtn.textContent = "✓";
      setTimeout(() => (copyBtn.textContent = "⧉"), 1200);
    });
  }
})();
