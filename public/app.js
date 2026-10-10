const $ = (s) => document.querySelector(s);
let tripData = null;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
async function api(url, options={}) {
  const r = await fetch(url, {credentials:"same-origin", ...options, headers:{"Content-Type":"application/json", ...(options.headers||{})}});
  const data = await r.json().catch(()=>({error:"Antwort konnte nicht gelesen werden."}));
  if(!r.ok) throw new Error(data.error || "Es ist ein Fehler aufgetreten.");
  return data;
}
function mapUrl(place, city) { return "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(place+" "+city); }
function renderTrip(data) {
  tripData = data;
  const cities = [...new Set(data.days.map(d=>d.city))];
  $("#city-nav").innerHTML = cities.map(c=>`<a href="#city-${slug(c)}">${esc(c)}</a>`).join("");
  $("#days").innerHTML = cities.map(city => `<section id="city-${slug(city)}"><h2 style="margin:24px 0 12px">${esc(city)}</h2><div class="days">${data.days.filter(d=>d.city===city).map(d=>`
    <article class="day-card"><div class="day-top"><div><div class="day-date">${esc(d.dateLabel)}</div><h3>${esc(d.title)}</h3></div><span class="tag">${esc(d.status || "Reiseplan")}</span></div>
    <p>${esc(d.description)}</p>
    ${d.items.map(item=>`<p><strong>${esc(item.time ? item.time+" · " : "")}${esc(item.title)}</strong>${item.note ? " — "+esc(item.note):""}<br><a class="map-link" href="${esc(item.url || mapUrl(item.place || item.title,city))}" target="_blank" rel="noopener">↗ In Google Maps öffnen</a></p>`).join("")}
  </article>`).join("")}</div></section>`).join("");
  $("#login-panel").hidden = true; $("#trip-panel").hidden = false;
}
function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}
async function loadComments(){
  try{
    const data=await api("/api/comments");
    $("#comments").innerHTML = data.comments.length ? data.comments.map(c=>`<article class="comment"><div class="comment-meta"><strong>${esc(c.name)} · ${esc(c.city)}</strong><span>${esc(c.created_at)}</span></div><p>${esc(c.body)}</p></article>`).join("") : '<p class="muted">Noch keine Kommentare. Mach den Anfang!</p>';
  }catch(e){$("#comments").textContent=e.message;}
}
async function enterSite(){
  const data=await api("/api/trip");
  renderTrip(data);
  await loadComments();
}
$("#login-form").addEventListener("submit", async e=>{
  e.preventDefault(); $("#login-error").textContent="";
  try{await api("/api/login",{method:"POST",body:JSON.stringify({password:$("#password").value})});$("#password").value="";await enterSite();}
  catch(err){$("#login-error").textContent=err.message;}
});
$("#logout-button").addEventListener("click",async()=>{await api("/api/logout",{method:"POST",body:"{}"}).catch(()=>{});$("#trip-panel").hidden=true;$("#login-panel").hidden=false;});
$("#comment-form").addEventListener("submit",async e=>{
  e.preventDefault();$("#comment-status").textContent="Wird veröffentlicht …";
  try{await api("/api/comments",{method:"POST",body:JSON.stringify({name:$("#comment-name").value,city:$("#comment-city").value,body:$("#comment-text").value})});$("#comment-text").value="";$("#comment-status").textContent="Kommentar veröffentlicht.";await loadComments();}
  catch(err){$("#comment-status").textContent=err.message;}
});
enterSite().catch(()=>{});
