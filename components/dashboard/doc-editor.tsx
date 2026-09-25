"use client";

import { useState, useTransition } from "react";
import {
  draftSection,
  improveSection,
  saveDraft,
} from "@/app/dashboard/projects/[id]/editor/actions";

export type DocSection = {
  heading: string;
  purpose: string;
  points: string[];
  content: string;
};

function toMarkdown(title: string, sections: DocSection[]) {
  const parts = [`# ${title || "Untitled draft"}`];
  for (const s of sections) {
    parts.push(`## ${s.heading}\n\n${s.content || "_(not drafted yet)_"}`);
  }
  return parts.join("\n\n");
}

function Prose({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((l) => l.trim().startsWith("- ") || l.trim() === "")) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5 text-[15px] leading-7 text-ink-secondary">
              {lines
                .filter((l) => l.trim().startsWith("- "))
                .map((l, j) => (
                  <li key={j}>{l.trim().slice(2)}</li>
                ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-[15px] leading-7 text-ink-secondary">
            {block}
          </p>
        );
      })}
    </div>
  );
}

export function DocEditor({
  draftId,
  projectId,
  initialTitle,
  sections,
}: {
  draftId: string;
  projectId: string;
  initialTitle: string;
  sections: DocSection[];
}) {
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [title, setTitle] = useState(initialTitle);
  const [values, setValues] = useState<string[]>(sections.map((s) => s.content));
  const [busy, setBusy] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  const current = (): DocSection[] =>
    sections.map((s, i) => ({ ...s, content: values[i] ?? "" }));

  const runAI = (index: number, aiMode: "draft" | "improve") => {
    const formData = new FormData();
    formData.set("projectId", projectId);
    formData.set("heading", sections[index].heading);
    formData.set("purpose", sections[index].purpose);
    formData.set("points", JSON.stringify(sections[index].points));
    if (aiMode === "improve") formData.set("current", values[index]);

    setBusy(index);
    setNotice(null);
    startTransition(async () => {
      const res =
        aiMode === "draft" ? await draftSection(formData) : await improveSection(formData);
      if (res.ok && typeof res.text === "string") {
        setValues((old) => old.map((v, i) => (i === index ? res.text! : v)));
      } else {
        setNotice(res.error ?? "AI request failed.");
      }
      setBusy(null);
    });
  };

  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(toMarkdown(title, current()));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setNotice("Couldn't access the clipboard.");
    }
  };

  const tabClass = (active: boolean) =>
    active
      ? "rounded-control bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand"
      : "rounded-control px-3 py-1.5 text-sm font-medium text-ink-secondary transition-colors hover:bg-surface-subtle hover:text-ink";

  return (
    <form action={saveDraft} className="mt-6">
      <input type="hidden" name="draftId" value={draftId} />
      <input type="hidden" name="projectId" value={projectId} />
      <input
        type="hidden"
        name="meta"
        value={JSON.stringify(
          sections.map(({ heading, purpose, points }) => ({ heading, purpose, points }))
        )}
      />
      {sections.map((_, i) => (
        <input key={i} type="hidden" name={`section-${i}`} value={values[i] ?? ""} />
      ))}

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setMode("write")} className={tabClass(mode === "write")}>
            Write
          </button>
          <button type="button" onClick={() => setMode("preview")} className={tabClass(mode === "preview")}>
            Preview
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyMarkdown}
            className="inline-flex h-9 items-center rounded-field border border-line bg-surface px-3 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle"
          >
            {copied ? "Copied!" : "Copy markdown"}
          </button>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-9 items-center rounded-field bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-wait disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-card border border-line bg-surface px-8 py-10 sm:px-12">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          name="title"
          placeholder="Untitled draft"
          className="font-sans w-full border-0 bg-transparent text-3xl font-semibold tracking-tight text-ink focus:outline-none"
        />

        {mode === "write" ? (
          sections.map((s, i) => (
            <section key={s.heading + i} className="mt-8">
              <h2 className="font-sans text-xl font-semibold tracking-tight text-ink">
                {s.heading}
              </h2>
              {s.purpose ? <p className="mt-1 text-xs text-ink-muted">{s.purpose}</p> : null}
              <textarea
                rows={Math.max(6, (values[i] ?? "").split("\n").length + 2)}
                value={values[i] ?? ""}
                onChange={(e) =>
                  setValues((old) => old.map((v, idx) => (idx === i ? e.target.value : v)))
                }
                placeholder="Write here, or let AI draft this section."
                className="mt-3 w-full resize-y border-0 bg-transparent text-[15px] leading-7 text-ink-secondary focus:outline-none"
              />
              <div className="mt-1 flex items-center gap-4">
                <button
                  type="button"
                  disabled={busy === i}
                  onClick={() => runAI(i, "draft")}
                  className="text-xs font-medium text-brand underline underline-offset-4 hover:text-brand-hover disabled:opacity-50"
                >
                  {busy === i ? "Working…" : "Draft with AI"}
                </button>
                <button
                  type="button"
                  disabled={busy === i || !values[i]}
                  onClick={() => runAI(i, "improve")}
                  className="text-xs font-medium text-brand underline underline-offset-4 hover:text-brand-hover disabled:opacity-50"
                >
                  Rewrite with AI
                </button>
              </div>
            </section>
          ))
        ) : (
          <article className="mt-6 space-y-8">
            {current().map((s, i) => (
              <section key={s.heading + i}>
                <h2 className="font-sans text-xl font-semibold tracking-tight text-ink">
                  {s.heading}
                </h2>
                <div className="mt-3">
                  <Prose text={s.content} />
                </div>
              </section>
            ))}
          </article>
        )}
      </div>

      {notice ? (
        <p className="mt-3 rounded-control border-l-2 border-error bg-error-soft px-3 py-2 text-sm text-error">
          {notice}
        </p>
      ) : null}
    </form>
  );
}