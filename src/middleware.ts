import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Lightweight Edge Middleware — bot protection & security headers
// ---------------------------------------------------------------------------
// Runs on Vercel's Edge Runtime (shared instances, so the in-memory rate
// limiter is more effective than per-invocation serverless).
//
// Layers:
// 1. Block requests with no User-Agent (scanners, naive bots)
// 2. Block known aggressive scraper/bot user agents
// 3. Basic sliding-window rate limit per IP (30 req / 10s)
// 4. Add standard security headers to every response
// ---------------------------------------------------------------------------

const BLOCKED_UA_PATTERNS = [
  /python-requests/i,
  /scrapy/i,
  /httpclient/i,
  /java\//i,
  /wget/i,
  /curl/i,
  /go-http-client/i,
  /python-urllib/i,
  /aiohttp/i,
  /httpx/i,
  /node-fetch/i,
  /axios/i,
  /mechanize/i,
  /libwww-perl/i,
  /lwp-trivial/i,
  /php\//i,
  /nikto/i,
  /sqlmap/i,
  /nmap/i,
  /masscan/i,
  /zgrab/i,
  /censys/i,
  /shodan/i,
];

// ---- Simple sliding-window rate limiter ----
// Edge instances are long-lived on Vercel, so a Map works well enough to
// catch rapid-fire requests from a single IP.  The map is capped at 10k
// entries to prevent memory pressure; when it grows beyond that we evict
// the oldest half.
const RATE_WINDOW_MS = 10_000; // 10 seconds
const RATE_LIMIT = 30; // requests per window

interface RateEntry {
  count: number;
  windowStart: number;
}

const ipHits = new Map<string, RateEntry>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);

  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    ipHits.set(ip, { count: 1, windowStart: now });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT) return true;
  return false;
}

// Evict stale entries periodically to cap memory.
function evictStale() {
  if (ipHits.size < 10_000) return;
  const now = Date.now();
  const keys = Array.from(ipHits.keys());
  for (const ip of keys) {
    const entry = ipHits.get(ip);
    if (entry && now - entry.windowStart > RATE_WINDOW_MS * 2) ipHits.delete(ip);
  }
  // If still too big, drop oldest half
  if (ipHits.size >= 10_000) {
    const entries = Array.from(ipHits.entries()).sort(
      (a, b) => a[1].windowStart - b[1].windowStart
    );
    for (let i = 0; i < entries.length / 2; i++) ipHits.delete(entries[i][0]);
  }
}

// ---- Security headers applied to every response ----
const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
};

export function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // 1. Block empty user agent (scanners)
  if (!ua) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 2. Block known scraper/bot user agents
  if (BLOCKED_UA_PATTERNS.some((re) => re.test(ua))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 3. Rate limit
  evictStale();
  if (isRateLimited(ip)) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": "10" },
    });
  }

  // 4. Add security headers to the response
  const response = NextResponse.next();
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  return response;
}

// Only run on page / API routes — skip static assets, images, fonts, etc.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico   (favicon file)
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot|otf)).*)",
  ],
};
