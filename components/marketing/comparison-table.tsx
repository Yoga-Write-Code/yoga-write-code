"use client";

interface ComparisonFeature {
  name: string;
  ywc: boolean;
  competitor: boolean;
}

interface ComparisonTableProps {
  competitorName: string;
  features: ComparisonFeature[];
}

export function ComparisonTable({ competitorName, features }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-card border border-line shadow-pop">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-surface-subtle">
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
              Feature
            </th>
            <th className="bg-[#EDE9FE] px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#7C3AED]">
              Yoga Write Code
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted">
              {competitorName}
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr
              key={feature.name}
              className={index < features.length - 1 ? "border-b border-line" : ""}
            >
              <td className="px-4 py-3 font-medium text-ink">{feature.name}</td>
              <td className="bg-[#EDE9FE]/30 px-4 py-3 text-center">
                {feature.ywc ? (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-success-soft text-success">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7.5L6 10.5L11 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                ) : (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-error-soft text-error">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                {feature.competitor ? (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-success-soft text-success">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7.5L6 10.5L11 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                ) : (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-surface-subtle text-ink-muted">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
