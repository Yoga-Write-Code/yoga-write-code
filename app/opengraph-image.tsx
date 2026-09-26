/* eslint-disable @next/next/no-img-element -- opengraph-image routes are rendered by satori, where next/image does not apply */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteBaseUrl, siteConfig, workflowSteps } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.ogHeadline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logoData: string = await readFile(join(process.cwd(), "app", "icon.svg"), "base64");
const logoSrc: string = `data:image/svg+xml;base64,${logoData}`;

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 72px",
          backgroundColor: "#fafaf9",
          backgroundImage: "linear-gradient(135deg, #fafaf9 0%, #f6f5ff 60%, #eeecff 100%)",
          color: "#1c1917",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Rendered by satori, so alt is decorative and next/image does not apply here. */}
          <img src={logoSrc} alt="" width={56} height={56} />
          <div style={{ display: "flex", fontSize: 30, letterSpacing: "-0.02em" }}>
            {siteConfig.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: 72,
              height: 6,
              borderRadius: 999,
              backgroundColor: "#5b4bdb",
              marginBottom: 28,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 76,
              lineHeight: 1.08,
              letterSpacing: "-0.035em",
              maxWidth: 1000,
            }}
          >
            {siteConfig.ogHeadline}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 28,
              lineHeight: 1.4,
              color: "#57534e",
              maxWidth: 900,
            }}
          >
            {siteConfig.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 1,
              backgroundColor: "#d6d3d1",
              marginBottom: 28,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {workflowSteps.map((step) => (
                <div
                  key={step}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 20px",
                    borderRadius: 999,
                    border: "1px solid #d6d3d1",
                    backgroundColor: "rgba(255, 255, 255, 0.72)",
                    fontSize: 20,
                    color: "#57534e",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      backgroundColor: "#5b4bdb",
                    }}
                  />
                  {step}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", fontSize: 22, color: "#78716c" }}>
              {siteBaseUrl.host}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
