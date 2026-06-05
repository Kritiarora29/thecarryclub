declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    fbq?: (...args: unknown[]) => void;
  }
}

export function pushToDataLayer(event: string, data?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...data });
  } catch (e) {
    console.warn("[GTM] dataLayer push failed:", e);
  }
}

export function pushToMetaPixel(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined" || !window.fbq) return;
  try {
    window.fbq("track", eventName, params);
  } catch (e) {
    console.warn("[Meta Pixel] fbq push failed:", e);
  }
}
