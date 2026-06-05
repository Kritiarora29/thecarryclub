export interface ClientTrackingIds {
  clientId: string;
  sessionId: string;
  gclAw: string;
}

function readCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const prefix = `${name}=`;
  for (const part of document.cookie.split(";")) {
    const t = part.trim();
    if (t.startsWith(prefix)) return decodeURIComponent(t.slice(prefix.length));
  }
  return "";
}

function findCookieByPrefix(prefix: string): string {
  if (typeof document === "undefined") return "";
  for (const part of document.cookie.split(";")) {
    const t = part.trim();
    if (t.startsWith(prefix) && !t.startsWith("_ga=")) {
      const eq = t.indexOf("=");
      if (eq > -1) return decodeURIComponent(t.slice(eq + 1));
    }
  }
  return "";
}

function parseClientId(ga: string): string {
  if (!ga) return "";
  const parts = ga.split(".");
  return parts.length >= 4 ? `${parts[2]}.${parts[3]}` : ga;
}

function parseSessionId(gaSession: string): string {
  if (!gaSession) return "";
  const parts = gaSession.split(".");
  if (parts.length < 3) return "";
  let sessionPart = parts[2];
  if (sessionPart.startsWith("s")) {
    const dollarIdx = sessionPart.indexOf("$");
    sessionPart = dollarIdx > 0 ? sessionPart.slice(1, dollarIdx) : sessionPart.slice(1);
  }
  return /^\d+$/.test(sessionPart) ? sessionPart : "";
}

export function readTrackingIds(): ClientTrackingIds {
  return {
    clientId:  parseClientId(readCookie("_ga")),
    sessionId: parseSessionId(findCookieByPrefix("_ga_")),
    gclAw:     readCookie("_gcl_aw"),
  };
}
