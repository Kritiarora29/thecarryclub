import { getUTMEventProperties } from "./utm";
import { getStoredClickIds } from "./click-ids";
import { readTrackingIds } from "./read-tracking-cookies";
import { getVisitorId } from "./visitor-id";

export interface TrackingContext {
  userId: string;
  visitorId: string;
  clientId: string;
  sessionId: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  landingPage: string;
  referrerUrl: string;
  gclid: string;
  msclkid: string;
  fbclid: string;
  ttclid: string;
  wbraid: string;
  gbraid: string;
  fbp: string;
  fbc: string;
  gclAw: string;
  userAgent: string;
  environment: string;
}

function empty(): TrackingContext {
  return {
    userId: "", visitorId: "", clientId: "", sessionId: "",
    utmSource: "", utmMedium: "", utmCampaign: "", utmTerm: "", utmContent: "",
    landingPage: "", referrerUrl: "",
    gclid: "", msclkid: "", fbclid: "", ttclid: "", wbraid: "", gbraid: "",
    fbp: "", fbc: "", gclAw: "",
    userAgent: "", environment: "Dev",
  };
}

export function getClientTrackingContext(): TrackingContext {
  if (typeof window === "undefined") return empty();

  const ctx = empty();
  ctx.environment = window.location.hostname.includes("thecarryclub") ? "Prod" : "Dev";
  ctx.userAgent = navigator.userAgent || "";
  ctx.visitorId = getVisitorId() || "";

  try {
    ctx.userId = localStorage.getItem("tcc_uid") || document.cookie.match(/tcc_uid=([^;]+)/)?.[1] || "";
  } catch { /* ignore */ }

  try {
    const ids = readTrackingIds();
    ctx.clientId = ids.clientId;
    ctx.sessionId = ids.sessionId;
    ctx.gclAw = ids.gclAw;
  } catch { /* ignore */ }

  try {
    const utm = getUTMEventProperties();
    ctx.utmSource   = (utm.campaign_source   as string) || "";
    ctx.utmMedium   = (utm.campaign_medium   as string) || "";
    ctx.utmCampaign = (utm.campaign_name     as string) || "";
    ctx.utmTerm     = (utm.campaign_term     as string) || "";
    ctx.utmContent  = (utm.campaign_content  as string) || "";
    ctx.gclid       = (utm.gclid             as string) || "";
    ctx.fbclid      = (utm.fbclid            as string) || "";
    ctx.landingPage = (utm.landing_page      as string) || window.location.pathname;
    ctx.referrerUrl = (utm.referrer          as string) || document.referrer || "";
  } catch {
    ctx.landingPage = window.location.pathname;
    ctx.referrerUrl = document.referrer || "";
  }

  try {
    const cids = getStoredClickIds();
    ctx.gclid   = ctx.gclid   || cids.gclid   || "";
    ctx.msclkid = cids.msclkid || "";
    ctx.fbclid  = ctx.fbclid  || cids.fbclid  || "";
    ctx.ttclid  = cids.ttclid  || "";
    ctx.wbraid  = cids.wbraid  || "";
    ctx.gbraid  = cids.gbraid  || "";
    ctx.fbp     = cids._fbp    || "";
    ctx.fbc     = cids._fbc    || "";
  } catch { /* ignore */ }

  return ctx;
}
