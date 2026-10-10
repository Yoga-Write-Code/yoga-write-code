"use client";

import { useState } from "react";
import { deriveFallbackKeywords } from "@/lib/keywords";

export type SerpResult = {
  keyword?: string;
  title: string;
  url: string;
  score: number;
};

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function asKeywords(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((k) => String(k).trim()).filter(Boolean);
}

function asSerpResults(value: unknown): SerpResult[] {
  if (!Array.isArray(value)) return [];
  return (value as Record<string, unknown>[])
    .filter((r) => r && typeof r.title === "string" && typeof r.url === "string")
    .map((r) => ({
      keyword: typeof r.keyword === "string" ? r.keyword : undefined,
      title: String(r.title),
      url: String(r.url),
      score: typeof r.score === "number" ? r.score : 0,
    }));
}

export function OpportunitySerp({
  targetKeywords,
  keywordGaps,
  fallbackTitle,
  defaultExpanded = false,
}: {
  targetKeywords: unknown;
  keywordGaps: unknown;
  fallbackTitle?: string;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const stored = asKeywords(targetKeywords);
  const keywords = stored.length > 0 ? stored : fallbackTitle ? deriveFallbackKeywords(fallbackTitle) : [];
  const results = asSerpResults(keywordGaps);

  if (keywords.length === 0 && results.length === 0) {
    return <span className="text-xs text-ink-muted">No keyword data yet — re-run analysis.</span>;
  }

  return (
    <div className="min-w-0">
      {keywords.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((kw) => (
            <span
              key={kw}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-line bg-surface-subtle px-2.5 py-1 text-xs font-medium text-ink"
              title={kw}
            >
              <span aria-hidden="true" className="shrink-0 text-ink-muted">⌕</span>
              <span className="truncate">{kw}</span>
            </span>
          ))}
        </div>
      ) : null}

      {results.length > 0 ? (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="flex items-center gap-1.5 text-left text-xs font-semibold text-ink-secondary transition-colors hover:text-ink"
          >
            <span>
              SERP · top {results.length} ranking {results.length === 1 ? "page" : "pages"}
            </span>
            <span aria-hidden="true" className="text-ink-muted">
              {expanded ? "−" : "+"}
            </span>
          </button>
          {expanded ? (
            <ol className="mt-2 space-y-1.5">
              {results.map((r, i) => (
                <li
                  key={`${r.url}-${i}`}
                  className="rounded-control border border-line bg-surface px-2.5 py-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-surface-subtle text-[11px] font-bold text-ink-muted">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] text-ink-muted">{domainOf(r.url)}</p>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block truncate text-[13px] font-medium text-brand hover:underline"
                        title={r.title}
                      >
                        {r.title}
                      </a>
                    </div>
                    <span className="shrink-0 rounded-full bg-surface-subtle px-2 py-0.5 text-[11px] font-semibold text-ink-secondary" title="Relevance score from live search">
                      {r.score}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-1 truncate text-xs text-ink-muted">
              {results
                .slice(0, 3)
                .map((r) => domainOf(r.url))
                .join(" · ")}
              {results.length > 3 ? ` +${results.length - 3} more` : ""}
            </p>
          )}
        </div>
      ) : (
        <p className="mt-1.5 text-[11px] text-ink-muted">No live SERP data (search enrichment off).</p>
      )}
    </div>
  );
}
