"use client";

import { useEffect } from "react";

/** Reserve4You / Aradoo — zelfde laadpatroon als officiële embed-snippet. */
const R4Y_SCRIPT_ID = "r4y-widget-sdk";
const R4Y_SCRIPT_SRC = "https://xinori.dev.web.aradoo.be/widget/sdk.js";
const R4Y_BUSINESS_ID = "6973945e-2d33-48b8-b82c-3034345a3525";

export function Reserve4YouWidget() {
  useEffect(() => {
    const d = document;
    const tag = "script";
    if (d.getElementById(R4Y_SCRIPT_ID)) return;

    const first = d.getElementsByTagName(tag)[0];
    const f = d.createElement(tag);
    f.id = R4Y_SCRIPT_ID;
    f.src = R4Y_SCRIPT_SRC;
    f.async = true;

    if (first?.parentNode) {
      first.parentNode.insertBefore(f, first);
    } else {
      d.head.appendChild(f);
    }
  }, []);

  return (
    <div
      className="r4y-widget mt-6 w-full max-w-3xl"
      data-business={R4Y_BUSINESS_ID}
    />
  );
}
