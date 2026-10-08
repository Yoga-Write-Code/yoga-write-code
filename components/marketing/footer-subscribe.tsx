"use client";

import { useEffect, useRef } from "react";

export function FooterSubscribe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.querySelector("script")) return;

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/ghost/signup-form@~0.3/umd/signup-form.min.js";
    script.async = true;
    script.dataset.buttonColor = "#4e00ff";
    script.dataset.buttonTextColor = "#FFFFFF";
    script.dataset.site = "https://yoga-write-code.ghost.io/";
    script.dataset.locale = "en";
    container.appendChild(script);
  }, []);

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full max-w-[440px]"
      style={{ minHeight: 58 }}
    />
  );
}
