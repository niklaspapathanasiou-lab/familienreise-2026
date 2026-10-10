const COOKIE = "family_trip_session";
const encoder = new TextEncoder();
function b64url(bytes) {
  let s = ""; for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
async function sign(value, secret) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), {name:"HMAC",hash:"SHA-256"}, false, ["sign"]);
  return b64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value))));
}
export async function makeSession(secret) {
  const payload = b64url(encoder.encode(JSON.stringify({exp:Date.now()+7*24*60*60*1000,nonce:crypto.randomUUID()})));
  return payload+"."+await sign(payload,secret);
}
export async function hasSession(request, secret) {
  const raw = request.headers.get("Cookie") || "";
  const found = raw.split(";").map(x=>x.trim()).find(x=>x.startsWith(COOKIE+"="));
  if(!found) return false;
  const token = decodeURIComponent(found.slice(COOKIE.length+1)).split(".");
  if(token.length!==2) return false;
  try{
    if(await sign(token[0],secret)!==token[1]) return false;
    const payload=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(token[0].replace(/-/g,"+").replace(/_/g,"/")),c=>c.charCodeAt(0))));
    return payload.exp>Date.now();
  }catch{return false;}
}
export function cookie(value, maxAge=604800) {
  return `${COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}
export function clearCookie(){return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;}
export function json(data,status=200,headers={}){return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store",...headers}});}
export async function requireSession(request, env) {
  if(!env.SESSION_SECRET || !(await hasSession(request,env.SESSION_SECRET))) return json({error:"Bitte zuerst das Familienpasswort eingeben."},401);
  return null;
}
