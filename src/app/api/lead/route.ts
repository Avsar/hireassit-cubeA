import { NextResponse } from "next/server";
export async function POST(req:Request){
  try{
    const data=await req.formData(); const payload:Record<string,any>={};
    for(const [k,v] of data.entries()) payload[k]=v;
    const url=process.env.LEAD_WEBHOOK_URL;
    if(!url) return NextResponse.json({error:"LEAD_WEBHOOK_URL not set"},{status:500});
    const r=await fetch(url,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    if(!r.ok){ return NextResponse.json({error:'Upstream failed', status:r.status}, {status:502}); }
    return NextResponse.json({ok:true});
  }catch(e:any){ return NextResponse.json({error:e?.message||'Bad request'},{status:400}); }
}