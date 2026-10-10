import {json,requireSession} from "../_shared.js";
export async function onRequestGet({request,env}) {
 const denied=await requireSession(request,env); if(denied)return denied;
 if(!env.DB) return json({error:"Die Kommentardatenbank ist noch nicht verbunden."},503);
 const {results=[]}=await env.DB.prepare("SELECT id,name,city,body,created_at FROM comments ORDER BY id DESC LIMIT 100").all();
 return json({comments:results});
}
export async function onRequestPost({request,env}) {
 const denied=await requireSession(request,env); if(denied)return denied;
 if(!env.DB) return json({error:"Die Kommentardatenbank ist noch nicht verbunden."},503);
 let b;try{b=await request.json()}catch{return json({error:"Ungültige Anfrage."},400)}
 const name=typeof b.name==="string"?b.name.trim().slice(0,60):"";
 const city=["Allgemein","Singapur","Bangkok","Chiang Mai"].includes(b.city)?b.city:"Allgemein";
 const body=typeof b.body==="string"?b.body.trim().slice(0,1200):"";
 if(!name||!body)return json({error:"Bitte Namen und Kommentar ausfüllen."},400);
 if(!env.SITE_PASSWORD)return json({error:"Website nicht konfiguriert."},503);
 const created=new Date().toISOString().replace("T"," ").slice(0,16)+" UTC";
 await env.DB.prepare("INSERT INTO comments (name,city,body,created_at) VALUES (?,?,?,?)").bind(name,city,body,created).run();
 return json({ok:true});
}
