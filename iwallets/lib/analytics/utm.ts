export interface UTMParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_id?: string;
  gclid?: string;
  fbclid?: string;
  ref?: string;
  landing_page?: string;
  referrer?: string;
  timestamp?: string;
}

const UTM_STORAGE_KEY = "tcc_utm";
const UTM_SESSION_KEY = "tcc_utm_s";

export function captureUTMParameters(): UTMParameters | null {
  if (typeof window === "undefined") return null;

  const urlParams = new URLSearchParams(window.location.search);
  const hasUTM = [
    "utm_source", "utm_medium", "utm_campaign", "utm_term",
    "utm_content", "utm_id", "gclid", "fbclid", "ref",
  ].some((p) => urlParams.has(p));

  if (!hasUTM) return null;

  const utmParams: UTMParameters = {
    utm_source:   urlParams.get("utm_source")   || undefined,
    utm_medium:   urlParams.get("utm_medium")   || undefined,
    utm_campaign: urlParams.get("utm_campaign") || undefined,
    utm_term:     urlParams.get("utm_term")     || undefined,
    utm_content:  urlParams.get("utm_content")  || undefined,
    utm_id:       urlParams.get("utm_id")       || undefined,
    gclid:        urlParams.get("gclid")        || undefined,
    fbclid:       urlParams.get("fbclid")       || undefined,
    ref:          urlParams.get("ref")          || undefined,
    landing_page: window.location.pathname,
    referrer:     document.referrer             || undefined,
    timestamp:    new Date().toISOString(),
  };

  (Object.keys(utmParams) as (keyof UTMParameters)[]).forEach((k) => {
    if (utmParams[k] === undefined) delete utmParams[k];
  });

  try {
    sessionStorage.setItem(UTM_SESSION_KEY, JSON.stringify(utmParams));
    if (!localStorage.getItem(UTM_STORAGE_KEY)) {
      localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams));
    }
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `tcc_utm=${encodeURIComponent(JSON.stringify(utmParams))}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax${secure}`;
  } catch (e) {
    console.warn("[UTM] Storage unavailable:", e);
  }

  return utmParams;
}

export function getSessionUTM(): UTMParameters | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(UTM_SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

export function getFirstTouchUTM(): UTMParameters | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

export function getUTMEventProperties(): Record<string, string | undefined> {
  const primary = getSessionUTM() || getFirstTouchUTM();
  if (!primary) return {};
  return {
    campaign_source:  primary.utm_source,
    campaign_medium:  primary.utm_medium,
    campaign_name:    primary.utm_campaign,
    campaign_term:    primary.utm_term,
    campaign_content: primary.utm_content,
    campaign_id:      primary.utm_id,
    gclid:            primary.gclid,
    fbclid:           primary.fbclid,
    referral_code:    primary.ref,
    landing_page:     primary.landing_page,
    referrer:         primary.referrer,
  };
}
