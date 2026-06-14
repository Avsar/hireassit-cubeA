// Thin wrapper around the gtag() that layout.tsx installs for GA4 (G-PG157F1SSR).
// Safe to call anywhere on the client: no-ops during SSR or if GA hasn't loaded
// (e.g. blocked by an ad blocker), so it can never throw or break a render.

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: GtagParams) => void;
  }
}

/** Fire a GA4 event. Mark the event name as a Key Event in the GA4 UI to count it as a conversion. */
export function track(event: string, params: GtagParams = {}): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event, params);
  }
}
