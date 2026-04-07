"use client";

import Script from "next/script";

/** Reserve4You embed — Poule & Poulette (Aradoo). */
const R4Y_SCRIPT_ID = "r4y-widget-sdk";
const R4Y_SCRIPT_SRC = "https://xinori.dev.web.aradoo.be/widget/sdk.js";
const R4Y_BUSINESS_ID = "6973945e-2d33-48b8-b82c-3034345a3525";

/**
 * Laadt de officiële widget-SDK en rendert het mountpunt.
 * Zie Reserve4You-documentatie voor styling van `.r4y-widget`.
 */
export function Reserve4YouWidget() {
  return (
    <>
      <Script
        id={R4Y_SCRIPT_ID}
        src={R4Y_SCRIPT_SRC}
        strategy="afterInteractive"
      />
      <div
        className="r4y-widget mt-6 w-full max-w-3xl"
        data-business={R4Y_BUSINESS_ID}
      />
    </>
  );
}
