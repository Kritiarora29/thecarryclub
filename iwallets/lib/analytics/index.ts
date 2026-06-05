"use client";

import { getClientTrackingContext } from "./tracking-context";
import { pushToDataLayer, pushToMetaPixel } from "./gtm";
import { getUTMEventProperties } from "./utm";

export { AnalyticsEvents } from "./events";
export type { AnalyticsEvent } from "./events";
export { captureUTMParameters, getSessionUTM, getFirstTouchUTM } from "./utm";
export { captureClickIds, getStoredClickIds } from "./click-ids";
export { getVisitorId } from "./visitor-id";
export { pushToDataLayer, pushToMetaPixel } from "./gtm";
export { getClientTrackingContext } from "./tracking-context";
export { useUTMCapture } from "./useUTMCapture";

// ── Conversion events that carry full UTM attribution ────────────────────────
const CONVERSION_EVENTS = new Set([
  "add_to_cart", "initiate_checkout", "add_payment_info", "purchase", "lead",
]);

// ── Client-side dataLayer push ────────────────────────────────────────────────

export function track(eventName: string, properties?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  const ctx = getClientTrackingContext();
  const shouldIncludeUTM = CONVERSION_EVENTS.has(eventName.toLowerCase());

  let utmProps: Record<string, unknown> = {};
  if (shouldIncludeUTM) {
    const utm = getUTMEventProperties();
    utmProps = Object.fromEntries(Object.entries(utm).filter(([, v]) => v !== undefined));
  }

  const twoYears = 60 * 60 * 24 * 365 * 2;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  if (ctx.clientId) {
    document.cookie = `ga_client_id=${encodeURIComponent(ctx.clientId)}; Path=/; Max-Age=${twoYears}; SameSite=Lax${secure}`;
  }

  pushToDataLayer(eventName, {
    user_id:       ctx.userId    || undefined,
    visitor_id:    ctx.visitorId || undefined,
    client_id:     ctx.clientId  || undefined,
    session_id:    ctx.sessionId || undefined,
    ga_session_id: ctx.sessionId || undefined,
    gcl_aw:        ctx.gclAw     || undefined,
    msclkid:       ctx.msclkid   || undefined,
    ttclid:        ctx.ttclid    || undefined,
    wbraid:        ctx.wbraid    || undefined,
    gbraid:        ctx.gbraid    || undefined,
    fbp:           ctx.fbp       || undefined,
    fbc:           ctx.fbc       || undefined,
    environment:   ctx.environment,
    page_location: window.location.href,
    page_path:     window.location.pathname,
    referrer:      ctx.referrerUrl || document.referrer || "",
    ...utmProps,
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function trackPageView(path?: string, properties?: Record<string, unknown>): void {
  track("page_view", {
    page_path:  path || window.location.pathname,
    page_title: document.title,
    page_url:   window.location.href,
    ...properties,
  });
}

// ── Server-side conversion (calls our Next.js API route) ─────────────────────

export interface ConversionPayload {
  event_name: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  value?: number;
  currency?: string;
  order_id?: string;
  content_ids?: string[];
  custom_data?: Record<string, unknown>;
}

export async function trackConversion(data: ConversionPayload): Promise<void> {
  if (typeof window === "undefined") return;

  const ctx = getClientTrackingContext();

  // Push to GTM dataLayer (client-side Meta Pixel + GA4 tag fires from GTM)
  track(data.event_name, {
    value:       data.value,
    currency:    data.currency || "INR",
    order_id:    data.order_id,
    content_ids: data.content_ids,
    ...data.custom_data,
  });

  // Also push directly to Meta Pixel for redundancy
  if (data.event_name === "purchase") {
    pushToMetaPixel("Purchase", {
      value:    data.value,
      currency: data.currency || "INR",
      order_id: data.order_id,
    });
  } else if (data.event_name === "initiate_checkout") {
    pushToMetaPixel("InitiateCheckout", {
      value:    data.value,
      currency: data.currency || "INR",
    });
  } else if (data.event_name === "add_to_cart") {
    pushToMetaPixel("AddToCart", {
      value:    data.value,
      currency: data.currency || "INR",
      content_ids: data.content_ids,
    });
  } else if (data.event_name === "view_content") {
    pushToMetaPixel("ViewContent", {
      content_ids: data.content_ids,
    });
  }

  // Fire server-side conversion via our API route (bypasses ad blockers)
  try {
    await fetch("/api/track-conversion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        currency: data.currency || "INR",
        tracking: {
          client_id:    ctx.clientId  || ctx.visitorId,
          session_id:   ctx.sessionId,
          visitor_id:   ctx.visitorId,
          gclid:        ctx.gclid,
          gclAw:        ctx.gclAw,
          msclkid:      ctx.msclkid,
          fbclid:       ctx.fbclid,
          ttclid:       ctx.ttclid,
          wbraid:       ctx.wbraid,
          gbraid:       ctx.gbraid,
          fbp:          ctx.fbp,
          fbc:          ctx.fbc,
          utm_source:   ctx.utmSource,
          utm_medium:   ctx.utmMedium,
          utm_campaign: ctx.utmCampaign,
          utm_term:     ctx.utmTerm,
          utm_content:  ctx.utmContent,
          landing_page: ctx.landingPage,
          referrer:     ctx.referrerUrl,
          page_location: window.location.href,
        },
      }),
    });
  } catch (e) {
    console.warn("[Conversion] server-side fire failed:", e);
  }
}
