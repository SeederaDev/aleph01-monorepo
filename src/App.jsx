import { useT } from "./i18n.jsx";
import { useReveal } from "./lib/ui.jsx";
import { useSeo } from "./lib/useSeo.jsx";
import Header from "./components/Header.jsx";
import Content from "./components/Content.jsx";
import Footer from "./components/Footer.jsx";
// import SpeedPill from "./components/SpeedPill.jsx"; // hidden for now
import CookieBanner from "./components/CookieBanner.jsx";
import LegalModal from "./components/LegalModal.jsx";

export default function App() {
  const { lang } = useT();
  useSeo();
  useReveal([lang]); // re-scan reveals after a language switch re-render

  return (
    <>
      <Header />
      <Content />
      <Footer />
      {/* <SpeedPill /> hidden for now */}
      <CookieBanner />
      <LegalModal />
    </>
  );
}
