import { json, requireSession } from "../_shared.js";

const ALLOWED_CITIES = ["Allgemein", "Singapur", "Bangkok", "Chiang Mai"];

export async function onRequestGet({ request, env }) {
  const denied = await requireSession(request, env);
  if (denied) return denied;

  if (!env.DB) {
    return json({ error: "Die Kommentardatenbank ist noch nicht verbunden." }, 503);
  }

  // day_key is optional so this endpoint remains compatible with older comments.
  // If the column has not been added yet, run the SQL migration provided below.
  const { results = [] } = await env.DB.prepare(
    "SELECT id, name, city, body, created_at, day_key FROM comments ORDER BY id DESC LIMIT 300"
  ).all();

  return json({ comments: results });
}

export async function onRequestPost({ request, env }) {
  const denied = await requireSession(request, env);
  if (denied) return denied;

  if (!env.DB) {
    return json({ error: "Die Kommentardatenbank ist noch nicht verbunden." }, 503);
  }

  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Ungültige Anfrage." }, 400);
  }

  const name = typeof b.name === "string" ? b.name.trim().slice(0, 60) : "";
  const city = ALLOWED_CITIES.includes(b.city) ? b.city : "Allgemein";
  const body = typeof b.body === "string" ? b.body.trim().slice(0, 1200) : "";
  const dayKey = typeof b.day_key === "string" ? b.day_key.trim().slice(0, 200) : "";

  if (!name || !body) {
    return json({ error: "Bitte Namen und Kommentar ausfüllen." }, 400);
  }

  if (!env.SITE_PASSWORD) {
    return json({ error: "Website nicht konfiguriert." }, 503);
  }

  const created = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";

  await env.DB.prepare(
    "INSERT INTO comments (name, city, body, created_at, day_key) VALUES (?, ?, ?, ?, ?)"
  ).bind(name, city, body, created, dayKey || null).run();

  return json({ ok: true });
}
