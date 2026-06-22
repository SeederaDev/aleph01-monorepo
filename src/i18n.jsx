import { createContext, useContext, useEffect, useState } from "react";

/* ============================================================
   Bilingual copy (EN primary, IT). Content from aleph0I decks.
   ============================================================ */
export const DICT = {
  en: {
    meta: {
      title: "aleph0I — agnostic AI & cloud orchestration",
      description: "aleph0I is an AI & Cyber company building matchoice (mtx): an agnostic LLM & cloud orchestrator for on-prem and cloud. Enterprise-grade, defense-grade, EU digital sovereignty.",
    },
    nav: {
      platform: "Platform", solutions: "Solutions", learn: "Learn", developers: "Developers", about: "About", cta: "Join the beta",
      menu: {
        platform: [{ l: "matchoice (mtx)", h: "#matchoice" }, { l: "Coming Q2'27 — join the beta", h: "#contact" }],
        solutions: [{ l: "Custom dev", h: "#solutions" }, { l: "LLM orchestration", h: "#solutions" }, { l: "Big Data", h: "#solutions" }, { l: "Cloud infrastructure", h: "#solutions" }, { l: "Other Services", h: "#solutions" }],
        learn: [{ l: "Blog", h: "#" }, { l: "Whitepapers", h: "#" }, { l: "Thesis", h: "#" }, { l: "Subscribe", h: "#contact" }],
        developers: [{ l: "Docs", h: "#code" }, { l: "Community", h: "#" }, { l: "Get a beta key", h: "#contact" }],
      },
    },
    hero: {
      eyebrow: "AI & CYBER FOR RESILIENCE",
      h1: "aleph0I delivers self-hosted and managed solutions, covering everything from SDN to AI workload orchestration.",
      cta: "Get early access",
      card1Kicker: "THE mtx SUITE",
      card1: "matchoice — one agnostic gateway for every model, on-prem or cloud.",
      card2Kicker: "WHY ALEPH0I",
      card2: "From Math to Cyber Reality. Your tech-partner to blossom a new era.",
    },
    logos: { stat: "Q2'27", statLabel: "MATCHOICE\nSAAS LAUNCH", note: "Built with tech-centers & universities across IL · US · EU" },
    philosophy: { eyebrow: "FROM 0 TO 1. LITERALLY.", h2: "To orchestrate every model, you need a different stack." },
    matchoice: {
      eyebrow: "THE mtx SUITE",
      h2: "Others bolt models onto the cloud. Our edge? An agnostic orchestrator.",
      body: "The mtx middleware optimizes how AI workloads are managed — tuning routing to your user equipments (UEs) and allocation needs. All made possible by mtx's abstraction layer: capacity planning.",
      cta: "Discover matchoice",
    },
    onprem: {
      eyebrow: "DIGITAL SOVEREIGNTY BY DESIGN",
      h2: "On-prem when it matters.\nCloud when it doesn't.",
      body: "Defense-grade workloads shouldn't be cloud-only. aleph0I deploys open-weight LLMs on-prem (e.g. Lenovo ThinkEdge), keeping data inside your perimeter and compliant with European standards.",
      cta: "Explore the architecture",
    },
    services: {
      eyebrow: "ONE-STOP-SHOP",
      h2: "Everything your AI stack needs, from a single partner.",
      items: [
        { t: "Custom dev", d: "We transform enterprise projects into something extraordinary, powered by rapid prototyping from our in-house R&D team." },
        { t: "LLM orchestration", d: "Our workflow engine is magic. You send the prompt, we handle it for you under the best possible conditions." },
        { t: "Big Data", d: "Robust and compliant data architectures designed for European standards, capable of processing terabytes of data in real time: reliably, securely, effortlessly." },
        { t: "Cloud infrastructure", d: "Our unique technology brings cloud computing and storage & backup together seamlessly — powered by a single click." },
        { t: "R&D projects", d: "We turn detailed enterprise requirements into reality, leveraging our dedicated R&D team and proof-of-concepts (POCs)." },
        { t: "MSP", d: "As your Managed Service Provider, we run, monitor and secure your AI & cloud stack end-to-end — one always-on partner, single interface, zero overhead." },
      ],
    },
    spotlight: {
      eyebrow: "USE-CASE SPOTLIGHT",
      h2: "Purpose-built solutions engineered to meet defense-grade requirements.",
      body: "From maritime logistics to mission-critical infrastructure,\naleph0I delivers sovereign on-prem AI and cyber-resilience\nprecisely where the cloud cannot reach.",
      cta: "See use-cases",
    },
    industries: {
      eyebrow: "INDUSTRIES & USE-CASES",
      h2: "Built for mission-critical sectors.",
      items: [
        { t: "Maritime & Ports", d: "On-prem AI for logistics hubs and strategic, defense-grade port sites." },
        { t: "Aviation", d: "Low-latency intelligence for safety- and time-critical operations." },
        { t: "Dual-use & Defense", d: "Sovereign, defense-grade deployments that never leave your perimeter." },
        { t: "Manufacturing", d: "Predictive quality, maintenance and throughput on the factory edge." },
        { t: "Healthcare & Security", d: "Compliant AI for clinics, RSAs and diagnostic laboratories." },
        { t: "Developer community", d: "Open-weight orchestration and tooling for builders and teams." },
      ],
    },
    code: {
      eyebrow: "ONE API. EVERY MODEL.",
      h2: "Switch to matchoice in two lines.",
      body: "matchoice exposes an OpenAI-compatible gateway. Point your client at our base URL, grab a beta key, and orchestrate any model — on-prem or cloud.",
      cta: "Read the docs",
    },
    ventures: {
      eyebrow: "VENTURES · OUTLOOK 26",
      h2: "Wonder-as-a-Service.",
      body: "Beyond the product, aleph0I runs the Wonder Equity Club (WEC) — backing best-in-class AI of tomorrow alongside Sixth Millennium Venture Partners, with privileged access to Israel's deep-tech ecosystem.",
      stats: [
        { n: "$12B+", l: "ISRAELI HIGH-TECH RAISED IN 2024" },
        { n: "42", l: "UNICORNS — #2 DENSITY WORLDWIDE" },
        { n: "$13.4B", l: "TECH EXITS IN 2024 (+78%)" },
      ],
      cta: "Talk to us about ventures",
    },
    research: {
      eyebrow: "RESEARCH",
      h2: "From the lab.",
      items: [
        { date: "2025", title: "AI & AmLo — simplicity in the pop phenomenon of these roaring 20s", href: "https://fondazioneolitec.com/2025/11/28/ai-ed-amlo-la-semplicita-nel-fenomeno-pop-di-questi-ruggenti-anni-20/" },
        { date: "PREPRINT", title: "MALBO — Optimizing LLM-Based Multi-Agent Teams via Multi-Objective Bayesian Optimization", href: "#" },
        { date: "arXiv:2411.16031", title: "AI-enhanced cyber-resilience for networked systems", href: "https://arxiv.org/abs/2411.16031" },
      ],
    },
    contact: {
      eyebrow: "GET IN TOUCH",
      h2: "Step into the AI revolution.",
      body: "Join the Aleph0I community, drop your email and get an exclusive first look at our launch campaign.",
      placeholder: "you@company.com",
      cta: "Join the community",
      note: "HQ Milano · info@aleph01.com",
    },
    footer: {
      tagline: "From Math to Cyber Reality.",
      tagline2: "Perfect engine. Together.",
      cols: [
        { h: "SOLUTIONS", links: ["Custom dev", "LLM orchestration", "Big Data", "Cloud infrastructure", "R&D projects"] },
        { h: "LEARN", links: ["Blog", "Whitepapers", "Thesis", "Subscribe"] },
        { h: "COMPANY", links: ["About aleph0I", "Industries", "Careers"] },
        { h: "CONTACT", links: ["info@aleph01.com", "Milano, IT", "X.com", "LinkedIn"] },
      ],
      rights: "© 2026 ALEPH0I, ALL RIGHTS RESERVED.",
      manage: "Manage cookies",
    },
    pill: "BE A01-READY",
    cookie: {
      title: "We value your privacy",
      body: "We use strictly necessary cookies to run this site and, only with your consent, analytics and marketing cookies. Choose how we may use them. See our",
      policy: "Cookie Policy",
      accept: "Accept all",
      reject: "Reject all",
      customize: "Preferences",
      save: "Save preferences",
      manage: "Manage cookies",
      cats: {
        necessary: { name: "Strictly necessary", note: "Required for the site to function. Always active.", always: "Always on" },
        analytics: { name: "Analytics", note: "Anonymous usage statistics to help us improve." },
        marketing: { name: "Marketing", note: "Personalized content and campaign measurement." },
      },
    },
    legal: {
      close: "Close",
      updated: "Last updated: June 2026",
      privacy: {
        title: "Privacy Policy",
        body: [
          "Data controller — aleph0I (A0I), Milano, Italy. Contact: info@aleph01.com.",
          "What we collect — If you submit the contact / newsletter form we process the email address you provide. With your consent to analytics, we process limited technical data (e.g. anonymized usage, device and browser type).",
          "Why and legal basis — We use your email to reply and to send the launch / newsletter updates you requested (consent, Art. 6(1)(a) GDPR). Necessary operation of the site relies on our legitimate interest (Art. 6(1)(f) GDPR).",
          "Sharing — We never sell your data. Processors (e.g. hosting, email, analytics) act on our instructions under data-processing agreements, within the EU/EEA or under adequate safeguards.",
          "Retention — Email and consent records are kept until you unsubscribe or withdraw consent, then deleted within a reasonable period.",
          "Your rights — Under the GDPR you may access, rectify, erase, restrict or port your data, object to processing, and withdraw consent at any time. To exercise them, or to lodge a complaint with the Italian Garante, contact info@aleph01.com.",
          "This is a template provided for information only and should be reviewed by your legal counsel before launch.",
        ],
      },
      cookie: {
        title: "Cookie Policy",
        body: [
          "What cookies are — Small files stored on your device that let a website work and, optionally, measure how it is used.",
          "Strictly necessary — Always active. They store your language and cookie-consent choice and keep the site functioning. No consent required.",
          "Analytics (optional) — Set only with your consent to produce anonymous, aggregated usage statistics.",
          "Marketing (optional) — Set only with your consent to personalize content and measure campaigns.",
          "Managing consent — You can change or withdraw your choices at any time via “Manage cookies” in the footer, or through your browser settings.",
          "This is a template provided for information only and should be reviewed by your legal counsel before launch.",
        ],
      },
    },
  },

  it: {
    meta: {
      title: "aleph0I — orchestrazione AI & cloud agnostica",
      description: "aleph0I è un'azienda AI & Cyber che sviluppa matchoice (mtx): orchestratore agnostico LLM & cloud per on-prem e cloud. Enterprise-grade, defense-grade, sovranità digitale EU.",
    },
    nav: {
      platform: "Piattaforma", solutions: "Soluzioni", learn: "Formazione", developers: "Developers", about: "Chi siamo", cta: "Entra nella beta",
      menu: {
        platform: [{ l: "matchoice (mtx)", h: "#matchoice" }, { l: "In arrivo Q2'27 — entra nella beta", h: "#contact" }],
        solutions: [{ l: "Custom dev", h: "#solutions" }, { l: "LLM orchestration", h: "#solutions" }, { l: "Big Data", h: "#solutions" }, { l: "Cloud infrastructure", h: "#solutions" }, { l: "Altri servizi", h: "#solutions" }],
        learn: [{ l: "Blog", h: "#" }, { l: "Whitepaper", h: "#" }, { l: "Tesi", h: "#" }, { l: "Iscriviti", h: "#contact" }],
        developers: [{ l: "Docs", h: "#code" }, { l: "Community", h: "#" }, { l: "Chiave beta", h: "#contact" }],
      },
    },
    hero: {
      eyebrow: "AI & CYBER PER LA RESILIENZA",
      h1: "aleph0I offre soluzioni self-hosted e gestite, coprendo tutto, dall'SDN all'orchestrazione degli AI workload.",
      cta: "Accesso anticipato",
      card1Kicker: "LA SUITE mtx",
      card1: "matchoice — un unico gateway agnostico per ogni modello, on-prem o cloud.",
      card2Kicker: "PERCHÉ ALEPH0I",
      card2: "From Math to Cyber Reality. Il tuo partner tech per una nuova era.",
    },
    logos: { stat: "Q2'27", statLabel: "LANCIO SAAS\nMATCHOICE", note: "Costruito con tech-center e università tra IL · US · EU" },
    philosophy: { eyebrow: "DA 0 A 1. LETTERALMENTE.", h2: "Per orchestrare ogni modello, serve uno stack diverso." },
    matchoice: {
      eyebrow: "LA SUITE mtx",
      h2: "Gli altri incollano i modelli al cloud. Il nostro vantaggio? Un orchestratore agnostico.",
      body: "Il middleware mtx ottimizza la gestione degli AI workload — adattando il routing agli user equipment (UE) del cliente e alle necessità di allocazione. Tutto reso possibile dal livello di astrazione di mtx: il capacity planning.",
      cta: "Scopri matchoice",
    },
    onprem: {
      eyebrow: "SOVRANITÀ DIGITALE BY DESIGN",
      h2: "On-prem quando conta.\nCloud quando basta.",
      body: "I workload defense-grade non possono essere solo-cloud. aleph0I esegue LLM open-weight on-prem (es. Lenovo ThinkEdge), tenendo i dati nel tuo perimetro e conformi agli standard europei.",
      cta: "Esplora l'architettura",
    },
    services: {
      eyebrow: "ONE-STOP-SHOP",
      h2: "Tutto ciò che serve al tuo stack AI, da un unico partner.",
      items: [
        { t: "Custom dev", d: "Trasformiamo i progetti enterprise in qualcosa di straordinario, grazie alla prototipazione rapida del nostro team R&D interno." },
        { t: "LLM orchestration", d: "Il nostro workflow engine è magia. Tu invii il prompt, noi lo gestiamo per te nelle migliori condizioni possibili." },
        { t: "Big Data", d: "Architetture dati robuste e conformi, pensate per gli standard europei, capaci di processare terabyte di dati in tempo reale: affidabili, sicure, senza sforzo." },
        { t: "Cloud infrastructure", d: "La nostra tecnologia unica unisce cloud computing, storage e backup senza soluzione di continuità — con un solo click." },
        { t: "R&D projects", d: "Trasformiamo requisiti enterprise dettagliati in realtà, sfruttando il nostro team R&D dedicato e proof-of-concept (POC)." },
        { t: "MSP", d: "Come tuo Managed Service Provider, gestiamo, monitoriamo e proteggiamo il tuo stack AI & cloud end-to-end — un unico partner always-on, interfaccia unica, zero overhead." },
      ],
    },
    spotlight: {
      eyebrow: "USE-CASE IN PRIMO PIANO",
      h2: "Soluzioni su misura, progettate per soddisfare requisiti defense-grade.",
      body: "Dalla logistica marittima alle infrastrutture mission-critical,\naleph0I porta AI on-prem sovrana e cyber-resilienza\nprecisamente dove il cloud non può arrivare.",
      cta: "Vedi gli use-case",
    },
    industries: {
      eyebrow: "INDUSTRIE & USE-CASE",
      h2: "Costruito per i settori mission-critical.",
      items: [
        { t: "Maritime & Porti", d: "AI on-prem per hub logistici e siti portuali strategici defense-grade." },
        { t: "Aviazione", d: "Intelligenza a bassa latenza per operazioni safety- e time-critical." },
        { t: "Dual-use & Difesa", d: "Deployment sovrani e defense-grade che non lasciano mai il tuo perimetro." },
        { t: "Manifattura", d: "Qualità, manutenzione e throughput predittivi sull'edge di fabbrica." },
        { t: "Sanità & Sicurezza", d: "AI conforme per cliniche, RSA e laboratori diagnostici." },
        { t: "Community dev", d: "Orchestrazione open-weight e strumenti per builder e team." },
      ],
    },
    code: {
      eyebrow: "UN'API. OGNI MODELLO.",
      h2: "Passa a matchoice in due righe.",
      body: "matchoice espone un gateway OpenAI-compatibile. Punta il client al nostro base URL, ottieni una chiave beta e orchestra qualsiasi modello — on-prem o cloud.",
      cta: "Leggi la documentazione",
    },
    ventures: {
      eyebrow: "VENTURES · OUTLOOK 26",
      h2: "Wonder-as-a-Service.",
      body: "Oltre al prodotto, aleph0I gestisce il Wonder Equity Club (WEC) — sostenendo le migliori AI di domani insieme a Sixth Millennium Venture Partners, con accesso privilegiato all'ecosistema deep-tech israeliano.",
      stats: [
        { n: "$12B+", l: "RACCOLTI DALL'HIGH-TECH ISRAELIANO NEL 2024" },
        { n: "42", l: "UNICORNI — #2 PER DENSITÀ AL MONDO" },
        { n: "$13.4B", l: "EXIT TECH NEL 2024 (+78%)" },
      ],
      cta: "Parliamo di ventures",
    },
    research: {
      eyebrow: "RICERCA",
      h2: "Dal laboratorio.",
      items: [
        { date: "2025", title: "AI & AmLo — la semplicità nel fenomeno pop di questi ruggenti anni 20", href: "https://fondazioneolitec.com/2025/11/28/ai-ed-amlo-la-semplicita-nel-fenomeno-pop-di-questi-ruggenti-anni-20/" },
        { date: "PREPRINT", title: "MALBO — Ottimizzazione di team multi-agente LLM via Bayesian Optimization multi-obiettivo", href: "#" },
        { date: "arXiv:2411.16031", title: "Cyber-resilienza potenziata dall'AI per sistemi in rete", href: "https://arxiv.org/abs/2411.16031" },
      ],
    },
    contact: {
      eyebrow: "CONTATTACI",
      h2: "Entra nella rivoluzione AI.",
      body: "Unisciti alla community Aleph0I, lascia la tua email e ottieni un'anteprima esclusiva della nostra launch campaign.",
      placeholder: "tu@azienda.com",
      cta: "Unisciti alla community",
      note: "Sede Milano · info@aleph01.com",
    },
    footer: {
      tagline: "From Math to Cyber Reality.",
      tagline2: "Perfect engine. Together.",
      cols: [
        { h: "SOLUZIONI", links: ["Custom dev", "LLM orchestration", "Big Data", "Cloud infrastructure", "R&D projects"] },
        { h: "FORMAZIONE", links: ["Blog", "Whitepapers", "Thesis", "Subscribe"] },
        { h: "AZIENDA", links: ["Chi siamo", "Industrie", "Lavora con noi"] },
        { h: "CONTATTI", links: ["info@aleph01.com", "Milano, IT", "X.com", "LinkedIn"] },
      ],
      rights: "© 2026 ALEPH0I, TUTTI I DIRITTI RISERVATI.",
      manage: "Gestisci i cookie",
    },
    pill: "BE A01-READY",
    cookie: {
      title: "Rispettiamo la tua privacy",
      body: "Usiamo cookie strettamente necessari per il funzionamento del sito e, solo con il tuo consenso, cookie di analisi e marketing. Scegli come possiamo usarli. Leggi la",
      policy: "Cookie Policy",
      accept: "Accetta tutti",
      reject: "Rifiuta tutti",
      customize: "Preferenze",
      save: "Salva preferenze",
      manage: "Gestisci i cookie",
      cats: {
        necessary: { name: "Strettamente necessari", note: "Indispensabili al funzionamento del sito. Sempre attivi.", always: "Sempre attivi" },
        analytics: { name: "Analisi", note: "Statistiche d'uso anonime per aiutarci a migliorare." },
        marketing: { name: "Marketing", note: "Contenuti personalizzati e misurazione delle campagne." },
      },
    },
    legal: {
      close: "Chiudi",
      updated: "Ultimo aggiornamento: giugno 2026",
      privacy: {
        title: "Informativa sulla privacy",
        body: [
          "Titolare del trattamento — aleph0I (A0I), Milano, Italia. Contatto: info@aleph01.com.",
          "Dati raccolti — Se invii il form di contatto / newsletter trattiamo l'indirizzo email fornito. Con il tuo consenso all'analisi, trattiamo dati tecnici limitati (es. uso anonimizzato, tipo di dispositivo e browser).",
          "Finalità e base giuridica — Usiamo la tua email per risponderti e inviarti gli aggiornamenti / newsletter richiesti (consenso, art. 6(1)(a) GDPR). Il funzionamento necessario del sito si basa sul legittimo interesse (art. 6(1)(f) GDPR).",
          "Comunicazione — Non vendiamo i tuoi dati. I responsabili (es. hosting, email, analisi) agiscono su nostra istruzione con accordi di trattamento, nell'UE/SEE o con garanzie adeguate.",
          "Conservazione — Email e prove del consenso sono conservate finché non ti disiscrivi o revochi il consenso, poi cancellate entro un periodo ragionevole.",
          "I tuoi diritti — Ai sensi del GDPR puoi accedere, rettificare, cancellare, limitare o portare i tuoi dati, opporti al trattamento e revocare il consenso in qualsiasi momento. Per esercitarli, o per presentare reclamo al Garante, scrivi a info@aleph01.com.",
          "Questo è un modello fornito a solo scopo informativo e va verificato dal tuo consulente legale prima del lancio.",
        ],
      },
      cookie: {
        title: "Cookie Policy",
        body: [
          "Cosa sono i cookie — Piccoli file salvati sul dispositivo che permettono al sito di funzionare e, opzionalmente, di misurarne l'uso.",
          "Strettamente necessari — Sempre attivi. Memorizzano la lingua e la scelta sui cookie e tengono in funzione il sito. Nessun consenso richiesto.",
          "Analisi (opzionali) — Impostati solo con il tuo consenso per statistiche d'uso anonime e aggregate.",
          "Marketing (opzionali) — Impostati solo con il tuo consenso per personalizzare contenuti e misurare le campagne.",
          "Gestione del consenso — Puoi modificare o revocare le scelte in qualsiasi momento tramite “Gestisci i cookie” nel footer o dalle impostazioni del browser.",
          "Questo è un modello fornito a solo scopo informativo e va verificato dal tuo consulente legale prima del lancio.",
        ],
      },
    },
  },
};

const LangCtx = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("a01-lang") || "en");
  useEffect(() => {
    localStorage.setItem("a01-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);
  return <LangCtx.Provider value={{ lang, setLang, t: DICT[lang] }}>{children}</LangCtx.Provider>;
}

export function useT() {
  return useContext(LangCtx);
}
