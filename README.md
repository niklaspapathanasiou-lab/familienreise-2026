# Private Familien-Reisewebsite – Asien 2026

Ein einfacher Startpunkt für eine private Familien-Website mit gemeinsamem Passwort, Tagesplänen, Google-Maps-Suchlinks und Kommentaren ohne individuelle Konten.

## Was enthalten ist

- Mobile-first Oberfläche für iPhone und Desktop
- Ein gemeinsames Website-Passwort
- Server-seitige Sitzung (Cookie), keine Passwörter im Browser gespeichert
- Kommentare mit Anzeigename ohne separate Registrierung
- Kommentare und Zugang nur für Besucher mit Passwort
- Tagesplan vom 18. bis 31. Oktober 2026
- Singapore-Tage als vorläufige Vorschläge; Bangkok/Chiang Mai als ergänzbare Platzhalter
- Kommentare werden in einer Cloudflare D1-Datenbank gespeichert

## Hosting ohne STRATO: Cloudflare Pages + D1 (Free-Tier verfügbar)

Diese Vorlage benötigt ein Backend. Bitte nicht einfach nur `public/` als statische Website veröffentlichen: Dann funktionieren Passwortschutz und Kommentare nicht sicher.

### Einrichtung (einmalig)

1. Erstelle ein kostenloses Cloudflare-Konto unter https://dash.cloudflare.com/
2. Lege ein D1 database an, z. B. `familienreise-comments`.
3. Führe die SQL-Migration aus: `migrations/0001_comments.sql` (Cloudflare Dashboard → D1 → Console).
4. Erstelle ein Pages-Projekt und lade diesen Ordner über ein GitHub-Repository hoch oder verwende die Wrangler CLI.
5. In den Pages-Projekteinstellungen unter **Settings → Variables and Secrets** setze:
   - `SITE_PASSWORD`: das gemeinsame Familienpasswort (lang und nicht wiederverwendet)
   - `SESSION_SECRET`: ein zufälliger, geheimer Wert mit mindestens 32 zufälligen Zeichen
6. Unter **Settings → Bindings** verbinde die D1-Datenbank mit dem Binding-Namen `DB`.
7. Ersetze `REPLACE_WITH_DATABASE_ID` in `wrangler.toml` durch die Datenbank-ID, falls du Wrangler verwendest.
8. Veröffentliche das Projekt und teste Passwort, Kommentare und Abmeldung in einem privaten Browserfenster.

Cloudflare kann seine Tarifgrenzen und Oberfläche ändern. Vor Veröffentlichung bitte aktuelle Free-Tier-Limits prüfen.

## Sicherheit und Grenzen

- Der Reiseplan wird erst nach gültigem Passwort über eine API ausgeliefert. Kommentare sind ebenfalls geschützt.
- Ein gemeinsames Passwort bedeutet, dass alle Familienmitglieder dieselbe Zugangsberechtigung teilen; einzelne Personen sind nicht verifiziert. Der angegebene Name bei einem Kommentar ist selbst gewählt.
- Es gibt derzeit keine Bearbeitungs-/Löschfunktion für Kommentare und keine Moderationsoberfläche. Kommentare können bis zu 100 neueste Einträge anzeigen.
- Bei öffentlich geteilter URL bleibt die Website nicht öffentlich lesbar, aber jeder mit Passwort kann sie sehen. Teile keine privaten Dokumente oder sensiblen Daten.
- Verwende HTTPS (Cloudflare Pages liefert dies standardmäßig).
- Reiseangaben zu Bangkok/Chiang Mai und Flugdetails müssen vor der Veröffentlichung geprüft werden; unbekannte Transfers und Unterkünfte sind absichtlich als offen markiert.

## Inhalte ändern

Die Startseite und Gestaltung sind in `public/index.html` und `public/styles.css`.
Die Tagespläne befinden sich in `functions/api/trip.js`. Jeder Tag hat Stadt, Datum, Titel, Beschreibung und eine Liste mit Orten. Ändere die Einträge dort, bevor du veröffentlichst.

## Google Maps

Wenn bei einem Ort kein eigener `url` angegeben ist, erstellt die Website einen Google-Maps-Suchlink aus dem Ortsnamen und der Stadt. Die Links sind Suchergebnisse, keine bestätigten Routen oder Reservierungen.
