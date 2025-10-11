import { NextResponse } from "next/server";
function tok(t:string){return (t||"" ).toLowerCase().replace(/[^a-z0-9+#.\s]/g,' ').split(/\s+/).filter(w=>w.length>2)}
function vec(ts:string[]){const m=new Map<string,number>(); for(const t of ts)m.set(t,(m.get(t)||0)+1); return m}
function cos(a:Map<string,number>,b:Map<string,number>){let d=0,na=0,nb=0;const ks=new Set([...a.keys(),...b.keys()]); for(const k of ks){const va=a.get(k)||0; const vb=b.get(k)||0; d+=va*vb; na+=va*va; nb+=vb*vb;} return (na&&nb)? d/(Math.sqrt(na)*Math.sqrt(nb)) : 0;}
export async function POST(req:Request){ const {jd,cv}=await req.json(); const s=Math.round(cos(vec(tok(jd)),vec(tok(cv)))*100);
  const setJD=new Set(tok(jd)); const high:string[]=[]; for(const t of new Set(tok(cv))){ if(setJD.has(t)) high.push(t); if(high.length>=10)break;}
  return NextResponse.json({score: Math.max(0, Math.min(100, s)), highlights: high});
}