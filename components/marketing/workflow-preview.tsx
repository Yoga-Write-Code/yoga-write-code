"use client";

import { useEffect, useState } from "react";

const previewSteps = [
  {
    label: "Analyze Website",
    metrics: [
      ["Domain", "yourwebsite.com"],
      ["Category", "Content operations"],
      ["Positioning", "A connected content system"],
    ],
  },
  {
    label: "Content Opportunities",
    metrics: [
      ["Opportunities found", "5"],
      ["Top score", "88"],
      ["Top pick", "Your next pillar topic"],
    ],
  },
  {
    label: "Topic Cluster",
    metrics: [
      ["Pillar topic", "Your content pillar"],
      ["Supporting topics", "11"],
      ["Funnel stage", "Top + middle"],
    ],
  },
  {
    label: "SEO Brief",
    metrics: [
      ["Primary keyword", "Your target keyword"],
      ["Search intent", "Informational"],
      ["Suggested headings", "9"],
    ],
  },
  {
    label: "Outline",
    metrics: [
      ["H2 sections", "8"],
      ["Est. word count", "1,600"],
      ["Status", "Ready to draft"],
    ],
  },
] as const;

export function WorkflowPreview() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % previewSteps.length);
    }, 3600);

    return () => window.clearInterval(timer);
  }, []);

  const step = previewSteps[activeStep];

  return (
    <div className="mx-auto mt-14 w-full max-w-[920px] overflow-hidden rounded-2xl border border-line bg-surface text-left font-sans shadow-pop">
      <div className="flex items-center gap-2 border-b border-line bg-surface-subtle px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
        <div className="ml-2 flex-1 rounded-md border border-line bg-surface px-3 py-1.5 text-xs text-ink-muted">
          app.yogawritecode.com
        </div>
      </div>

      <div className="grid grid-cols-2 border-b border-line sm:grid-cols-5">
        {previewSteps.map((item, index) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setActiveStep(index)}
            aria-pressed={activeStep === index}
            className={`border-r border-line px-3 py-3 text-left transition-colors last:border-r-0 ${
              activeStep === index ? "bg-brand-soft" : "hover:bg-surface-subtle"
            }`}
          >
            <span
              className={`block text-[10px] font-bold uppercase tracking-[0.08em] ${
                activeStep === index ? "text-brand-hover" : "text-ink-muted"
              }`}
            >
              Step {index + 1}
            </span>
            <span
              className={`mt-1 block text-xs font-semibold ${
                activeStep === index ? "text-brand-hover" : "text-ink"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div className="grid min-h-[150px] gap-4 p-6 sm:grid-cols-3 sm:p-7">
        {step.metrics.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-line bg-surface-subtle p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-muted">
              {label}
            </p>
            <p className="mt-2 text-xl font-extrabold tracking-tight text-ink">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
