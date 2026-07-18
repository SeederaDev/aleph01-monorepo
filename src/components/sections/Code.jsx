import { useState } from "react";
import { useT } from "../../i18n.jsx";

const SNIPPETS = {
  py: [
    ["1", <><span className="c-k">import</span> os</>],
    ["2", <><span className="c-k">import</span> openai</>],
    ["3", ""],
    ["4", <>client = openai.<span className="c-fn">OpenAI</span>(</>],
    ["5", <>{"    "}base_url=<span className="c-s">"https://api.aleph01.com/mtx/v1"</span>,</>],
    ["6", <>{"    "}api_key=os.environ.<span className="c-fn">get</span>(<span className="c-s">"MTX_API_KEY"</span>)</>],
    ["7", ")"],
  ],
  js: [
    ["1", <><span className="c-k">import</span> OpenAI <span className="c-k">from</span> <span className="c-s">"openai"</span>;</>],
    ["2", ""],
    ["3", <><span className="c-k">const</span> client = <span className="c-k">new</span> <span className="c-fn">OpenAI</span>({'{'}</>],
    ["4", <>{"  "}baseURL: <span className="c-s">"https://api.aleph01.com/mtx/v1"</span>,</>],
    ["5", <>{"  "}apiKey: process.env.<span className="c-n">MTX_API_KEY</span>,</>],
    ["6", "});"],
  ],
};

export default function Code() {
  const { t } = useT();
  const [tab, setTab] = useState("py");
  return (
    <section className="code" id="code">
      <div className="container code__head reveal">
        <span className="eyebrow eyebrow--orange">{t.code.eyebrow}</span>
        <h2>{t.code.h2}</h2>
        <a href="#contact" className="btn btn--primary">{t.code.cta}</a>
      </div>
      <div className="container">
        <div className="code__window reveal">
          <div className="code__tabs">
            <button className={`code__tab ${tab === "py" ? "is-active" : ""}`} onClick={() => setTab("py")}>PYTHON</button>
            <button className={`code__tab ${tab === "js" ? "is-active" : ""}`} onClick={() => setTab("js")}>JAVASCRIPT</button>
          </div>
          <pre className="code__pane is-active"><code>
            {SNIPPETS[tab].map(([n, line], i) => (
              <span key={i}><span className="ln">{n}</span>{line}{"\n"}</span>
            ))}
          </code></pre>
        </div>
      </div>
    </section>
  );
}
