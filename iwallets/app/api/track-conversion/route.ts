import { NextResponse } from "next/server";
import crypto from "crypto";

interface TrackingContext {
  client_id?: string;
  session_id?: string;
  visitor_id?: string;
  gclid?: string;
  gclAw?: string;
  msclkid?: string;
  fbclid?: string;
  ttclid?: string;
  wbraid?: string;
  gbraid?: string;
  fbp?: string;
  fbc?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  landing_page?: string;
  referrer?: string;
  page_location?: string;
}

interface ConversionPayload {
  event_name: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  value?: number;
  currency?: string;
  order_id?: string;
  content_ids?: string[];
  custom_data?: Record<string, unknown>;
  tracking: TrackingContext;
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.toLowerCase().trim()).digest("hex");
}

function generateEventId(): string {
  return `evt_${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
}

function extractRawGclid(gclAw?: string): string {
  if (!gclAw) return "";
  const parts = gclAw.split(".");
  return parts.length >= 3 ? parts.slice(2).join(".") : "";
}

// ── Meta CAPI ────────────────────────────────────────────────────────────────

async function sendToMetaCAPI(
  payload: ConversionPayload,
  eventId: string,
  clientIp: string,
  userAgent: string,
  hashedEmail: string,
  hashedFirstName: string,
  hashedLastName: string,
): Promise<void> {
  const pixelId    = process.env.META_PIXEL_ID;
  const token      = process.env.META_ACCESS_TOKEN;
  const apiVersion = process.env.META_API_VERSION || "v21.0";
  const testCode   = process.env.META_TEST_EVENT_CODE;

  if (!pixelId || !token) return;

  const ctx = payload.tracking;

  const body: Record<string, unknown> = {
    data: [{
      event_name:       payload.event_name,
      event_time:       Math.floor(Date.now() / 1000),
      event_id:         eventId,
      action_source:    "website",
      event_source_url: ctx.page_location || "https://thecarryclub.in",
      user_data: {
        em:               hashedEmail     ? [hashedEmail]     : undefined,
        fn:               hashedFirstName ? [hashedFirstName] : undefined,
        ln:               hashedLastName  ? [hashedLastName]  : undefined,
        external_id:      hashedEmail     ? [hashedEmail]     : undefined,
        client_ip_address: clientIp || undefined,
        client_user_agent: userAgent || undefined,
        fbc: ctx.fbc || undefined,
        fbp: ctx.fbp || undefined,
      },
      custom_data: {
        value:       payload.value,
        currency:    payload.currency || "INR",
        order_id:    payload.order_id,
        content_ids: payload.content_ids,
        ...(payload.custom_data || {}),
      },
    }],
  };
  if (testCode) body.test_event_code = testCode;

  const res = await fetch(`https://graph.facebook.com/${apiVersion}/${pixelId}/events?access_token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = await res.json().catch(() => ({}));
  if (!res.ok || (result as any).error) {
    console.error("[Meta CAPI]", (result as any).error?.message || res.status);
  }
}

// ── GA4 Measurement Protocol ──────────────────────────────────────────────────

async function sendToGA4(payload: ConversionPayload, eventId: string): Promise<void> {
  const measurementId = process.env.GA4_MEASUREMENT_ID;
  const apiSecret     = process.env.GA4_API_SECRET;
  if (!measurementId || !apiSecret) return;

  const ctx = payload.tracking;

  const body = {
    client_id: ctx.client_id || ctx.visitor_id || eventId,
    events: [{
      name: payload.event_name,
      params: {
        event_id:       eventId,
        session_id:     ctx.session_id || undefined,
        engagement_time_msec: 1,
        transaction_id: payload.order_id || undefined,
        value:          payload.value ?? undefined,
        currency:       payload.currency || "INR",
        source:         ctx.utm_source  || undefined,
        medium:         ctx.utm_medium  || undefined,
        campaign:       ctx.utm_campaign || undefined,
        gclid:          ctx.gclid       || undefined,
        ...(payload.custom_data || {}),
      },
    }],
  };

  const res = await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }
  );

  if (res.status !== 204 && !res.ok) {
    console.error(`[GA4 MP] ${res.status} — ${payload.event_name}`);
  }
}

// ── sGTM ─────────────────────────────────────────────────────────────────────

async function sendToSGTM(
  payload: ConversionPayload,
  eventId: string,
  clientIp: string,
  userAgent: string,
  hashedEmail: string,
  hashedFirstName: string,
  hashedLastName: string,
): Promise<void> {
  const sgtmUrl = process.env.GTM_SERVER_CONTAINER_URL;
  if (!sgtmUrl) return;

  const ctx = payload.tracking;

  const body = {
    event_name:     payload.event_name,
    event_id:       eventId,
    event_time:     Math.floor(Date.now() / 1000),
    action_source:  "website",
    page_location:  ctx.page_location || "https://thecarryclub.in",
    transaction_id: payload.order_id || eventId,
    client_id:      ctx.client_id || ctx.visitor_id || "",
    session_id:     ctx.session_id || "",
    ga_session_id:  ctx.session_id || "",
    gcl_aw:         ctx.gclAw || "",
    hashed_email:   hashedEmail,
    external_id:    hashedEmail,
    gclid:          ctx.gclid || extractRawGclid(ctx.gclAw),
    msclkid:        ctx.msclkid || "",
    fbclid:         ctx.fbclid || "",
    ttclid:         ctx.ttclid || "",
    wbraid:         ctx.wbraid || "",
    gbraid:         ctx.gbraid || "",
    fbp:            ctx.fbp || "",
    fbc:            ctx.fbc || "",
    ...(payload.email ? {
      user_data: {
        email_address:        hashedEmail,
        sha256_email_address: hashedEmail,
        address: { first_name: hashedFirstName, last_name: hashedLastName },
      },
    } : {}),
    consent: {
      ad_user_data: "granted", ad_storage: "granted",
      analytics_storage: "granted", functionality_storage: "granted",
      personalization_storage: "granted",
    },
    initial_utm_source:   ctx.utm_source   || "",
    initial_utm_medium:   ctx.utm_medium   || "",
    initial_utm_campaign: ctx.utm_campaign || "",
    initial_utm_term:     ctx.utm_term     || "",
    initial_utm_content:  ctx.utm_content  || "",
    initial_landing_page: ctx.landing_page || "",
    initial_referrer_url: ctx.referrer     || "",
    client_ip:  clientIp,
    user_agent: userAgent,
    source:     "server",
    value:      payload.value ?? "",
    currency:   payload.currency || "INR",
    ...(payload.custom_data || {}),
  };

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const previewHeader = process.env.SGTM_PREVIEW_HEADER;
  if (previewHeader) headers["X-Gtm-Server-Preview"] = previewHeader;

  const res = await fetch(`${sgtmUrl}/webhook`, { method: "POST", headers, body: JSON.stringify(body) });
  if (!res.ok) console.error(`[sGTM] ${res.status} — ${payload.event_name}`);
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  let payload: ConversionPayload;
  try {
    payload = await req.json();
    if (!payload.event_name || !payload.tracking) {
      return NextResponse.json({ error: "Missing event_name or tracking" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventId   = generateEventId();
  const clientIp  = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "";
  const userAgent = req.headers.get("user-agent") || "";

  const hashedEmail     = payload.email      ? sha256(payload.email)      : "";
  const hashedFirstName = payload.first_name ? sha256(payload.first_name) : "";
  const hashedLastName  = payload.last_name  ? sha256(payload.last_name)  : "";

  await Promise.allSettled([
    sendToMetaCAPI(payload, eventId, clientIp, userAgent, hashedEmail, hashedFirstName, hashedLastName)
      .catch((e) => console.error("[Meta CAPI] uncaught:", e)),
    sendToGA4(payload, eventId)
      .catch((e) => console.error("[GA4 MP] uncaught:", e)),
    sendToSGTM(payload, eventId, clientIp, userAgent, hashedEmail, hashedFirstName, hashedLastName)
      .catch((e) => console.error("[sGTM] uncaught:", e)),
  ]);

  return NextResponse.json({ success: true, event_id: eventId });
}
