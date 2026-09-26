process.env.RTL_SKIP_AUTO_CLEANUP = "true";

import globalJsdom from "global-jsdom";

globalJsdom(undefined, { url: "http://localhost:3000" });

Object.defineProperty(globalThis, "localStorage", {
  value: (globalThis as unknown as { window: Window }).window.localStorage,
  configurable: true,
});
