export interface ClickIds {
  gclid?: string;
  msclkid?: string;
  fbclid?: string;
  ttclid?: string;
  wbraid?: string;
  gbraid?: string;
  _fbp?: string;
  _fbc?: string;
}

const CLICK_IDS_KEY = "tcc_cids";

function getCookieValue(cookies: string, name: string): string | null {
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function captureClickIds(): ClickIds | null {
  if (typeof window === "undefined") return null;

  const urlParams = new URLSearchParams(window.location.search);
  const cookies = document.cookie;

  const ids: ClickIds = {
    gclid:   urlParams.get("gclid")   || undefined,
    msclkid: urlParams.get("msclkid") || undefined,
    fbclid:  urlParams.get("fbclid")  || undefined,
    ttclid:  urlParams.get("ttclid")  || undefined,
    wbraid:  urlParams.get("wbraid")  || undefined,
    gbraid:  urlParams.get("gbraid")  || undefined,
    _fbp:    getCookieValue(cookies, "_fbp") || undefined,
    _fbc:    getCookieValue(cookies, "_fbc") || undefined,
  };

  const hasIds = Object.values(ids).some(Boolean);
  if (!hasIds) return null;

  try {
    const existing = getStoredClickIds();
    const merged = { ...existing, ...Object.fromEntries(Object.entries(ids).filter(([, v]) => v)) };
    localStorage.setItem(CLICK_IDS_KEY, JSON.stringify(merged));
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `tcc_cids=${encodeURIComponent(JSON.stringify(merged))}; path=/; max-age=${60 * 60 * 24 * 90}; SameSite=Lax${secure}`;
    return merged;
  } catch {
    return ids;
  }
}

export function getStoredClickIds(): ClickIds {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(CLICK_IDS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}
