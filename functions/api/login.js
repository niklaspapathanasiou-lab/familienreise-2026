import {makeSession,cookie,json} from "../_shared.js";
export async function onRequestPost({request,env}) {
  if(!env.SITE_PASSWORD) return json({error:"Die Website ist noch nicht fertig konfiguriert."},503);
  let body; try{body=await request.json()}catch{return json({error:"Ungültige Anfrage."},400)}
  if(typeof body.password!=="string" || body.password.length>200 || body.password!==env.SITE_PASSWORD) return json({error:"Das Passwort stimmt nicht."},401);
  const token=await makeSession(env.SESSION_SECRET);
  return json({ok:true},200,{"Set-Cookie":cookie(token),"X-Content-Type-Options":"nosniff"});
}
