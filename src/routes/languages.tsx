import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import pythonSrc from "../code/python/signhome.py?raw";
import javaSrc from "../code/java/SignHome.java?raw";
import jsSrc from "../code/js/classifier.js?raw";
import cssSrc from "../code/css/signhome.css?raw";
import htmlSrc from "../code/html/index.html?raw";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/languages")({ component: Languages });

const FILES = [
  { id: "python", label: "Python", ext: "signhome.py", source: pythonSrc },
  { id: "javascript", label: "JavaScript", ext: "classifier.js", source: jsSrc },
  { id: "java", label: "Java", ext: "SignHome.java", source: javaSrc },
  { id: "css", label: "CSS", ext: "signhome.css", source: cssSrc },
  { id: "html", label: "HTML", ext: "index.html", source: htmlSrc },
] as const;

function Languages() {
  const [active, setActive] = useState<(typeof FILES)[number]["id"]>("python");
  const file = FILES.find((f) => f.id === active) ?? FILES[0];

  return (
    <main className="mx-auto w-full min-w-0 max-w-5xl px-4 py-8 sm:px-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-subtle">Thesis sources</p>
      <h1 className="mt-2 text-3xl font-medium tracking-tight text-fg">Five languages, one pipeline</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
        The live control center stays in the browser. These files are the same L, A, F, V, W
        classifier and serial map in Python, JavaScript, Java, CSS, and HTML.
      </p>

      <div className="mt-6 flex min-w-0 flex-wrap gap-1 rounded-md border border-border bg-surface p-1">
        {FILES.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActive(f.id)}
            className={cn(
              "rounded-sm px-3 py-1.5 text-sm transition-colors duration-150",
              active === f.id ? "bg-surface-2 text-fg" : "text-muted hover:text-fg",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <section className="mt-4 overflow-hidden rounded-xl border border-border bg-surface shadow-panel">
        <header className="flex items-center justify-between border-b border-border px-4 py-2">
          <p className="font-mono text-xs text-muted">{file.ext}</p>
          <p className="text-[11px] uppercase tracking-widest text-subtle">{file.label}</p>
        </header>
        <pre className="max-h-[70vh] overflow-auto p-4 font-mono text-[12px] leading-relaxed text-fg">
          <code>{file.source}</code>
        </pre>
      </section>
    </main>
  );
}
