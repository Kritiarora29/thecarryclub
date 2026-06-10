"use client";

import { useState, useEffect } from "react";
import { track, getClientTrackingContext, getVisitorId } from "@/lib/analytics";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FiredEvent {
  name: string;
  time: string;
}

interface ApiResult {
  sent: boolean;
  status?: number;
  error?: string;
}

interface ServerResult {
  event: string;
  event_id: string;
  sgtm: ApiResult;
  meta: ApiResult;
  ga4: ApiResult;
  time: string;
}

// ── Env config checks (client-readable vars only) ─────────────────────────────

const API_STATUSES = [
  { label: "GTM Container ID",     envKey: "NEXT_PUBLIC_GTM_ID",           value: process.env.NEXT_PUBLIC_GTM_ID },
  { label: "Meta Pixel ID",        envKey: "NEXT_PUBLIC_META_PIXEL_ID",    value: process.env.NEXT_PUBLIC_META_PIXEL_ID },
  { label: "Meta Access Token",    envKey: "META_ACCESS_TOKEN (server)",   value: "set server-side" },
  { label: "GA4 Measurement ID",   envKey: "GA4_MEASUREMENT_ID (server)",  value: "set server-side" },
  { label: "sGTM Container URL",   envKey: "GTM_SERVER_CONTAINER_URL",     value: "set server-side" },
];

// ── Client events ─────────────────────────────────────────────────────────────

const CLIENT_EVENTS = [
  { name: "page_view",         props: { page_path: "/test-events" } },
  { name: "view_content",      props: { content_ids: ["test-product-001"], value: 1150 } },
  { name: "add_to_cart",       props: { content_ids: ["test-product-001"], value: 1150, currency: "INR" } },
  { name: "initiate_checkout", props: { value: 1150, currency: "INR" } },
  { name: "add_payment_info",  props: { payment_method: "card" } },
  { name: "search",            props: { search_string: "slim wallet" } },
  { name: "lead",              props: { source: "test" } },
];

// ── Server conversion events ──────────────────────────────────────────────────

const SERVER_EVENTS = [
  {
    label: "view_content",
    data: { event_name: "view_content", content_ids: ["test-product-001"] },
  },
  {
    label: "add_to_cart",
    data: { event_name: "add_to_cart", value: 1150, currency: "INR", content_ids: ["test-product-001"] },
  },
  {
    label: "initiate_checkout",
    data: { event_name: "initiate_checkout", value: 1150, currency: "INR", content_ids: ["test-product-001"] },
  },
  {
    label: "purchase",
    data: {
      event_name: "purchase",
      email: "test@thecarryclub.in",
      first_name: "Test",
      last_name: "User",
      value: 1150,
      currency: "INR",
      order_id: "test-order-001",
      content_ids: ["test-product-001"],
    },
  },
  {
    label: "lead",
    data: { event_name: "lead", email: "test@thecarryclub.in", custom_data: { source: "test-console" } },
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${ok ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
      {ok ? "✓ SET" : "? SERVER"}
    </span>
  );
}

function ResultBadge({ result }: { result: ApiResult }) {
  if (result.sent) {
    return <span className="text-green-600 text-xs font-medium">✓ {result.status ?? "OK"}</span>;
  }
  return (
    <span className="text-red-500 text-xs" title={result.error}>
      ✗ {result.error?.slice(0, 50) || `HTTP ${result.status}`}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TestEventsPage() {
  const [ctx, setCtx] = useState<ReturnType<typeof getClientTrackingContext> | null>(null);
  const [firedClient, setFiredClient] = useState<FiredEvent[]>([]);
  const [serverResults, setServerResults] = useState<ServerResult[]>([]);
  const [loadingServer, setLoadingServer] = useState<string | null>(null);
  const [dataLayer, setDataLayer] = useState<unknown[]>([]);

  useEffect(() => {
    getVisitorId();
    setCtx(getClientTrackingContext());
    setDataLayer((window as any).dataLayer?.slice(-5) ?? []);
  }, []);

  function fireClientEvent(name: string, props: Record<string, unknown>) {
    track(name, props);
    const time = new Date().toLocaleTimeString();
    setFiredClient((prev) => [{ name, time }, ...prev]);
    setDataLayer((window as any).dataLayer?.slice(-5) ?? []);
  }

  async function fireServerEvent(label: string, data: Record<string, unknown>) {
    setLoadingServer(label);
    try {
      const ctx = getClientTrackingContext();
      const res = await fetch("/api/track-conversion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          currency: (data.currency as string) || "INR",
          tracking: {
            client_id:    ctx.clientId  || ctx.visitorId,
            visitor_id:   ctx.visitorId,
            session_id:   ctx.sessionId,
            fbp:          ctx.fbp,
            fbc:          ctx.fbc,
            fbclid:       ctx.fbclid,
            gclid:        ctx.gclid,
            page_location: window.location.href,
          },
        }),
      });
      const json = await res.json();
      const time = new Date().toLocaleTimeString();
      setServerResults((prev) => [{ event: label, ...json, time }, ...prev]);
    } catch (e: any) {
      const time = new Date().toLocaleTimeString();
      setServerResults((prev) => [
        { event: label, event_id: "—", sgtm: { sent: false, error: e.message }, meta: { sent: false, error: e.message }, ga4: { sent: false, error: e.message }, time },
        ...prev,
      ]);
    }
    setLoadingServer(null);
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Analytics Test Console</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Test GTM dataLayer events and server-side conversion API calls (Meta CAPI · GA4 MP · sGTM).
            Open DevTools → Network tab to see outbound requests.
          </p>
        </div>

        {/* API Configuration Status */}
        <section className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold text-zinc-800 mb-3">API Configuration</h2>
          <div className="space-y-2">
            {API_STATUSES.map(({ label, envKey, value }) => (
              <div key={envKey} className="flex items-center justify-between text-sm">
                <span className="text-zinc-700">{label}</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-zinc-400">{value || envKey}</code>
                  <StatusBadge ok={!!value} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-zinc-400 mt-3">
            Server-only vars (META_ACCESS_TOKEN, GA4_API_SECRET, etc.) cannot be read client-side — check your .env.local.
          </p>
        </section>

        {/* Tracking Context */}
        <section className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold text-zinc-800 mb-3">Current Tracking Context</h2>
          {ctx ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 font-mono text-xs">
              {[
                ["visitor_id",    ctx.visitorId   || "—"],
                ["client_id",     ctx.clientId    || "— (GA4 not loaded)"],
                ["session_id",    ctx.sessionId   || "—"],
                ["user_id",       ctx.userId      || "— (not logged in)"],
                ["utm_source",    ctx.utmSource   || "—"],
                ["utm_medium",    ctx.utmMedium   || "—"],
                ["utm_campaign",  ctx.utmCampaign || "—"],
                ["gclid",         ctx.gclid       || "—"],
                ["fbclid",        ctx.fbclid      || "—"],
                ["fbp",           ctx.fbp         || "—"],
                ["fbc",           ctx.fbc         || "—"],
                ["environment",   ctx.environment],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-1">
                  <span className="text-zinc-400 min-w-[110px]">{k}:</span>
                  <span className="text-zinc-700 truncate">{v}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-400">Loading…</p>
          )}
          <button
            onClick={() => { setCtx(getClientTrackingContext()); }}
            className="mt-3 text-xs text-blue-500 hover:underline"
          >
            Refresh context
          </button>
        </section>

        {/* Client Events → GTM dataLayer */}
        <section className="bg-white border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-semibold text-zinc-800">Client Events → GTM dataLayer</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Fires track() → window.dataLayer.push(). Check GTM Preview panel.
              </p>
            </div>
            <button
              className="text-xs bg-zinc-900 text-white px-3 py-1.5 rounded-lg hover:bg-zinc-700"
              onClick={() => {
                CLIENT_EVENTS.forEach(({ name, props }, i) => {
                  setTimeout(() => fireClientEvent(name, props as Record<string, unknown>), i * 150);
                });
              }}
            >
              Fire all
            </button>
          </div>

          <div className="space-y-1.5">
            {CLIENT_EVENTS.map(({ name, props }) => {
              const lastFired = firedClient.find((f) => f.name === name);
              return (
                <div key={name} className="flex items-center justify-between bg-zinc-50 rounded-lg px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-sm text-zinc-800">{name}</span>
                    <span className="text-xs text-zinc-400 ml-2 truncate hidden sm:inline">
                      {JSON.stringify(props).slice(0, 60)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    {lastFired && (
                      <span className="text-green-600 text-xs">✓ {lastFired.time}</span>
                    )}
                    <button
                      className="text-xs border border-zinc-300 px-2.5 py-1 rounded-lg hover:bg-zinc-100"
                      onClick={() => fireClientEvent(name, props as Record<string, unknown>)}
                    >
                      Fire
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {dataLayer.length > 0 && (
            <div className="mt-4 bg-zinc-900 rounded-lg p-3">
              <p className="text-xs text-zinc-400 mb-1">Last 5 dataLayer entries:</p>
              <pre className="text-xs text-green-400 max-h-40 overflow-y-auto whitespace-pre-wrap">
                {JSON.stringify(dataLayer, null, 2)}
              </pre>
            </div>
          )}
        </section>

        {/* Server Conversion Events */}
        <section className="bg-white border rounded-xl p-5">
          <div className="mb-3">
            <h2 className="font-semibold text-zinc-800">Server Conversion Events → /api/track-conversion</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Sends to Meta CAPI · GA4 MP · sGTM from the server. Responses shown below each event.
            </p>
          </div>

          <div className="space-y-2">
            {SERVER_EVENTS.map(({ label, data }) => {
              const prevResult = serverResults.find((r) => r.event === label);
              const isLoading  = loadingServer === label;
              return (
                <div key={label} className="border rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-zinc-800">{label}</span>
                    <button
                      className={`text-xs px-3 py-1.5 rounded-lg ${isLoading ? "bg-zinc-200 text-zinc-400 cursor-not-allowed" : "bg-zinc-900 text-white hover:bg-zinc-700"}`}
                      onClick={() => !isLoading && fireServerEvent(label, data as Record<string, unknown>)}
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending…" : "Fire"}
                    </button>
                  </div>

                  <pre className="mt-2 text-xs text-zinc-500 bg-zinc-50 rounded p-2 overflow-x-auto">
                    {JSON.stringify(data, null, 2)}
                  </pre>

                  {prevResult && (
                    <div className="mt-2 pt-2 border-t space-y-1">
                      <p className="text-xs text-zinc-400">{prevResult.time} · event_id: {prevResult.event_id}</p>
                      <div className="flex gap-4 flex-wrap text-xs">
                        <span className="text-zinc-500">sGTM:</span>
                        <ResultBadge result={prevResult.sgtm} />
                        <span className="text-zinc-500">Meta:</span>
                        <ResultBadge result={prevResult.meta} />
                        <span className="text-zinc-500">GA4:</span>
                        <ResultBadge result={prevResult.ga4} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Instructions */}
        <section className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-blue-800 space-y-2">
          <h2 className="font-semibold">How to verify events arrived</h2>
          <ul className="list-disc list-inside space-y-1 text-blue-700 text-xs">
            <li><strong>GTM dataLayer:</strong> Open GTM Preview mode → connect to this tab → fire events → see them in the debug panel.</li>
            <li><strong>Meta CAPI:</strong> Meta Events Manager → Pixel → Test Events tab → set <code className="bg-blue-100 px-1 rounded">META_TEST_EVENT_CODE</code> in .env.local → fire a server event → appears within ~30s.</li>
            <li><strong>GA4 MP:</strong> GA4 DebugView (Admin → DebugView) — takes up to 60s. For instant feedback check the Network tab for <code className="bg-blue-100 px-1 rounded">/api/track-conversion</code> response.</li>
            <li><strong>sGTM:</strong> Set <code className="bg-blue-100 px-1 rounded">GTM_SERVER_CONTAINER_URL</code> in .env.local → fire a server event → check your sGTM debug panel.</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
