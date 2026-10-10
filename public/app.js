const $ = (selector, root = document) => root.querySelector(selector);
let tripData = null;
let commentsCache = [];

const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}[c]));

async function api(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({
    error: "Antwort konnte nicht gelesen werden."
  }));

  if (!response.ok) {
    throw new Error(data.error || "Es ist ein Fehler aufgetreten.");
  }

  return data;
}

function mapUrl(place, city) {
  return "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(`${place} ${city}`);
}

function slug(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/*
 * The day key is sent to /api/comments with each comment.
 * The comments API and D1 table must save and return this field
 * for comments to remain attached to the correct day.
 */
function dayKey(day, index) {
  return String(day.id || day.key || `${day.dateLabel || index}-${day.city || ""}-${day.title || ""}`);
}

function renderComments(comments, key) {
  const matching = comments.filter(comment => String(comment.day_key ?? "") === String(key));

  if (!matching.length) {
    return '<p class="muted">Noch keine Kommentare zu diesem Tag. Schreib den ersten!</p>';
  }

  return matching.map(comment => `
    <article class="comment">
      <div class="comment-meta">
        <strong>${esc(comment.name)}${comment.city ? ` · ${esc(comment.city)}` : ""}</strong>
        <span>${esc(comment.created_at || "")}</span>
      </div>
      <p>${esc(comment.body)}</p>
    </article>
  `).join("");
}

function renderTrip(data) {
  tripData = data;
  const days = Array.isArray(data.days) ? data.days : [];
  const cities = [...new Set(days.map(day => day.city).filter(Boolean))];

  $("#city-nav").innerHTML = cities
    .map(city => `<a href="#city-${slug(city)}">${esc(city)}</a>`)
    .join("");

  $("#days").innerHTML = cities.map(city => `
    <section id="city-${slug(city)}">
      <h2 style="margin:24px 0 12px">${esc(city)}</h2>
      <div class="days">
        ${days.map((day, index) => ({ day, index }))
          .filter(entry => entry.day.city === city)
          .map(({ day, index }) => {
            const key = dayKey(day, index);
            const items = Array.isArray(day.items) ? day.items : [];

            return `
              <article class="day-card" id="day-${slug(key)}">
                <div class="day-top">
                  <div>
                    <div class="day-date">${esc(day.dateLabel)}</div>
                    <h3>${esc(day.title)}</h3>
                  </div>
                  <span class="tag">${esc(day.status || "Reiseplan")}</span>
                </div>

                ${day.description ? `<p>${esc(day.description)}</p>` : ""}

                <div class="attraction-list">
                  ${items.map(item => `
                    <article class="attraction">
                      ${item.image ? `
                        <a class="attraction-image-link"
                           href="${esc(item.infoUrl || item.url || mapUrl(item.place || item.title, city))}"
                           target="_blank" rel="noopener">
                          <img class="attraction-image"
                               src="${esc(item.image)}"
                               alt="${esc(item.title)}"
                               loading="lazy"
                               onerror="this.closest('.attraction-image-link').hidden=true">
                        </a>` : ""}
                      <div class="attraction-copy">
                        <strong>${esc(item.time ? `${item.time} · ` : "")}${esc(item.title)}</strong>
                        ${item.note ? `<p>${esc(item.note)}</p>` : ""}
                        <div class="attraction-links">
                          <a class="map-link"
                             href="${esc(item.url || mapUrl(item.place || item.title, city))}"
                             target="_blank" rel="noopener">↗ Google Maps</a>
                          ${item.infoUrl ? `
                            <a class="map-link" href="${esc(item.infoUrl)}"
                               target="_blank" rel="noopener">Offizielle Infos ↗</a>` : ""}
                        </div>
                      </div>
                    </article>
                  `).join("")}
                </div>

                <section class="day-comments" aria-label="Kommentare zu ${esc(day.title)}">
                  <h4>Kommentare zu diesem Tag</h4>
                  <div class="day-comments-list" data-comments-for="${esc(key)}">
                    ${renderComments(commentsCache, key)}
                  </div>
                  <form class="day-comment-form" data-day-key="${esc(key)}" data-day-city="${esc(city)}">
                    <label>
                      Dein Name
                      <input name="name" type="text" maxlength="80" required
                             placeholder="Name" autocomplete="name">
                    </label>
                    <label>
                      Kommentar
                      <textarea name="body" maxlength="2000" rows="3" required
                                placeholder="Ideen, Hinweise oder Fragen zu diesem Tag …"></textarea>
                    </label>
                    <button type="submit">Kommentar veröffentlichen</button>
                    <p class="day-comment-status muted" aria-live="polite"></p>
                  </form>
                </section>
              </article>
            `;
          }).join("")}
      </div>
    </section>
  `).join("");

  $("#login-panel").hidden = true;
  $("#trip-panel").hidden = false;
  attachDayCommentForms();
}

async function loadComments() {
  try {
    const data = await api("/api/comments");
    commentsCache = Array.isArray(data.comments) ? data.comments : [];

    document.querySelectorAll("[data-comments-for]").forEach(container => {
      container.innerHTML = renderComments(commentsCache, container.dataset.commentsFor);
    });

    // Keep the old, general comments area working if it still exists in index.html.
    const generalComments = $("#comments");
    if (generalComments) {
      const general = commentsCache.filter(comment => !comment.day_key);
      generalComments.innerHTML = general.length
        ? general.map(comment => `
            <article class="comment">
              <div class="comment-meta">
                <strong>${esc(comment.name)}${comment.city ? ` · ${esc(comment.city)}` : ""}</strong>
                <span>${esc(comment.created_at || "")}</span>
              </div>
              <p>${esc(comment.body)}</p>
            </article>
          `).join("")
        : '<p class="muted">Noch keine allgemeinen Kommentare.</p>';
    }
  } catch (error) {
    document.querySelectorAll("[data-comments-for]").forEach(container => {
      container.textContent = error.message;
    });
    const generalComments = $("#comments");
    if (generalComments) generalComments.textContent = error.message;
  }
}

function attachDayCommentForms() {
  document.querySelectorAll(".day-comment-form").forEach(form => {
    form.addEventListener("submit", async event => {
      event.preventDefault();

      const status = $(".day-comment-status", form);
      const submitButton = $('button[type="submit"]', form);
      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const body = String(formData.get("body") || "").trim();
      const city = form.dataset.dayCity || "";
      const key = form.dataset.dayKey || "";

      if (!name || !body) {
        status.textContent = "Bitte Name und Kommentar ausfüllen.";
        return;
      }

      status.textContent = "Wird veröffentlicht …";
      submitButton.disabled = true;

      try {
        await api("/api/comments", {
          method: "POST",
          body: JSON.stringify({
            name,
            city,
            body,
            day_key: key
          })
        });

        form.reset();
        status.textContent = "Kommentar veröffentlicht.";
        await loadComments();
      } catch (error) {
        status.textContent = error.message;
      } finally {
        submitButton.disabled = false;
      }
    });
  });
}

async function enterSite() {
  const data = await api("/api/trip");
  commentsCache = [];
  renderTrip(data);
  await loadComments();
}

const loginForm = $("#login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    $("#login-error").textContent = "";

    try {
      await api("/api/login", {
        method: "POST",
        body: JSON.stringify({ password: $("#password").value })
      });
      $("#password").value = "";
      await enterSite();
    } catch (error) {
      $("#login-error").textContent = error.message;
    }
  });
}

const logoutButton = $("#logout-button");
if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    await api("/api/logout", {
      method: "POST",
      body: "{}"
    }).catch(() => {});

    $("#trip-panel").hidden = true;
    $("#login-panel").hidden = false;
  });
}

// Retain the old general-comment form if the page still contains it.
const generalCommentForm = $("#comment-form");
if (generalCommentForm) {
  generalCommentForm.addEventListener("submit", async event => {
    event.preventDefault();
    const status = $("#comment-status");
    status.textContent = "Wird veröffentlicht …";

    try {
      await api("/api/comments", {
        method: "POST",
        body: JSON.stringify({
          name: $("#comment-name").value,
          city: $("#comment-city").value,
          body: $("#comment-text").value
        })
      });

      $("#comment-text").value = "";
      status.textContent = "Kommentar veröffentlicht.";
      await loadComments();
    } catch (error) {
      status.textContent = error.message;
    }
  });
}

enterSite().catch(() => {
  // A visitor who is not logged in will see the login panel.
});
