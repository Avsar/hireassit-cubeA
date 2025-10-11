import { NextResponse } from "next/server";

// No for..of, no spread over iterables; only arrays & classic loops.

function tok(t: string) {
  return (t || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function vec(ts: string[]) {
  const m = new Map<string, number>();
  for (let i = 0; i < ts.length; i++) {
    const t = ts[i];
    m.set(t, (m.get(t) || 0) + 1);
  }
  return m;
}

function cos(a: Map<string, number>, b: Map<string, number>) {
  let dot = 0,
    na = 0,
    nb = 0;

  // Build array of unique keys without using Set iteration/spread
  const keysArr = Array.from(a.keys()).concat(Array.from(b.keys()));
  const seen: Record<string, true> = {};
  for (let i = 0; i < keysArr.length; i++) {
    const k = keysArr[i];
    if (seen[k]) continue;
    seen[k] = true;

    const va = a.get(k) || 0;
    const vb = b.get(k) || 0;
    dot += va * vb;
    na += va * va;
    nb += vb * vb;
  }

  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export async function POST(req: Request) {
  const { jd, cv } = await req.json();

  const vJD = vec(tok(jd || ""));
  const vCV = vec(tok(cv || ""));
  const s = Math.round(cos(vJD, vCV) * 100);

  // Highlights without Set/for..of
  const jdTokens = tok(jd || []);
  const cvTokens = tok(cv || []);
  const jdSeen: Record<string, true> = {};
  for (let i = 0; i < jdTokens.length; i++) jdSeen[jdTokens[i]] = true;

  const cvUnique: string[] = [];
  const cvSeen: Record<string, true> = {};
  for (let i = 0; i < cvTokens.length; i++) {
    const t = cvTokens[i];
    if (!cvSeen[t]) {
      cvSeen[t] = true;
      cvUnique.push(t);
    }
  }

  const highlights: string[] = [];
  for (let i = 0; i < cvUnique.length && highlights.length < 10; i++) {
    const t = cvUnique[i];
    if (jdSeen[t]) highlights.push(t);
  }

  return NextResponse.json({
    score: Math.max(0, Math.min(100, s)),
    highlights,
  });
}
