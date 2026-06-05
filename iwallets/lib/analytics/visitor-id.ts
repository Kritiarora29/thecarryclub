const VISITOR_ID_KEY = "tcc_vid";
const COOKIE_NAME = "tcc_vid";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 2;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? match[1] : null;
}

function writeCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

export function getVisitorId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY) || readCookie(COOKIE_NAME);
    if (!id) id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
    writeCookie(COOKIE_NAME, id, COOKIE_MAX_AGE);
    return id;
  } catch {
    return null;
  }
}
