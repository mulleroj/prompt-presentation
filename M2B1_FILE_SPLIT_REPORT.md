# M2B1 — Mechanické rozdělení statické aplikace — report

> Milník M2B1 na větvi `feat/notebooklm-m2-teacher-redesign` (základ `a4bfb91`). **Čistě mechanický přesun** inline CSS a JS do samostatných souborů bez jakékoli změny vzhledu, funkčnosti, dat, přístupnosti, bezpečnosti nebo generovaného promptu. Bez commitu a push. Předchozí reporty ani blueprint nezměněny.

---

## 1. Manažerské shrnutí

Původní jednosouborový `index.html` (2278 řádků) byl rozdělen na tři soubory: `index.html` (433 řádků, jen struktura + odkazy), `styles.css` (688 řádků CSS) a `js/app.js` (1155 řádků JS). Přesun je **byte-přesný** — extrahovaný CSS i JS jsou doslovné podřetězce původního souboru. Runtime ověření potvrdilo **znakovou shodu všech 7 referenčních promptů**, shodu všech dat (23 polí schématu, 46 stylů, mapy, limity, storage klíče) a zelené výsledky funkčních, přístupnostních i bezpečnostních retestů. Konzole bez chyb, žádné nové externí požadavky, `styles.css` a `js/app.js` se načítají s HTTP 200.

---

## 2. Účel migrace

Připravit udržovatelnou strukturu pro následující milníky M2 (vizuální systém, režimy, galerie stylů, doporučení) rozdělením rostoucího jednosouborového `index.html` do přehledných částí — **bez redesignu a bez změny chování**. Tento krok je nízkorizikový (mechanický přesun ověřitelný znakovou shodou) a je předpokladem pro další, obsahové milníky.

---

## 3. Výchozí struktura `index.html` (před)

| Rozsah | Obsah |
|---|---|
| ř. 1–6 | `<!DOCTYPE>`, `<html lang="cs">`, `<head>`, meta, `<title>` |
| ř. 7 | `<style>` |
| ř. 8–695 | **CSS** (proměnné, layout, komponenty, dialogy, live region, focus, `@media`, `prefers-reduced-motion`) |
| ř. 696 | `</style>` |
| ř. 697 | `</head>` |
| ř. 698–1119 | **HTML** tělo (hlavička, formulář 9 sekcí, výstup, action bar, toast, modaly) |
| ř. 1120 | `<script>` |
| ř. 1121–2275 | **JS** (konstanty, DEFAULT_STATE, FIELD_SCHEMA, LIMITS, ENUMS, mapy, 46 snippetů, storage, validace, import/export, dialogy, focus, generatePrompt, init, listenery) |
| ř. 2276 | `</script>` |
| ř. 2277–2278 | `</body>`, `</html>` |

Kontrola závislostí skriptu: **žádný** `document.currentScript`, `document.write`, `import`/`export`, `type="module"`. Skript používá globální funkce (volané z inline `onclick` v HTML) a jediný okamžitý (mimo `DOMContentLoaded`) přístup k DOM je registrace listeneru na `#managePresetsModal` na konci skriptu — funguje, protože skript je na konci `<body>` (prvek už existuje). Konce řádků: **CRLF** v celém souboru.

---

## 4. Nová struktura souborů (po)

```
index.html     433 řádků  — metadata, <link>, statická HTML struktura, <script src>
styles.css     688 řádků  — přesunutý CSS (19 904 B)
js/app.js     1155 řádků  — přesunutý JS (57 568 B)
```
V `index.html`:
- ř. 7: `<link rel="stylesheet" href="styles.css">` (nahradil blok `<style>…</style>`)
- před `</body>`: `<script src="js/app.js"></script>` (nahradil blok `<script>…</script>`)

---

## 5. Přesný rozsah přesunutého CSS

Celý obsah mezi `<style>` (ř. 7) a `</style>` (ř. 696) — **688 řádků, 19 904 B** — přesunut beze změny do `styles.css`. Zachovány: pořadí pravidel, komentáře, selektory, specificity, barvy, typografie, spacing, radius, stíny, breakpointy (`@media (max-width:920px)`), transitions, `@media (prefers-reduced-motion: reduce)`, focus styly, styly dialogů a live regionu, mobilní chování. Žádné přejmenování tříd, slučování pravidel, nové proměnné ani reformátování. Vyváženost závorek `{`/`}`: 86/86.

---

## 6. Přesný rozsah přesunutého JavaScriptu

Celý obsah mezi `<script>` (ř. 1120) a `</script>` (ř. 2276) — **1155 řádků, 57 568 B** — přesunut beze změny do `js/app.js`. Zachováno: pořadí deklarací, scope a globální dostupnost funkcí, DEFAULT_STATE, FIELD_SCHEMA, LIMITS, ENUMS, promptové mapy, 46 snippetů, storage/validační/import-export/preset/dialogová/focus logika, XSS a prototype-pollution ochrany, `textContent` render, `generatePrompt`, inicializace a event listenery. **Žádný přepis na ES moduly, žádné import/export, žádné přejmenování, žádné nové globální proměnné.**

---

## 7. Zvolený způsob načítání `js/app.js`

**Klasický externí skript na konci `<body>`, bez `defer`, bez `type="module"`:**
```html
    <script src="js/app.js"></script>
```
umístěný přesně tam, kde byl původní inline `<script>` (bezprostředně před `</body>`).

## 8. Důvod nepoužití `defer`

Původní inline skript byl **klasický, na konci body** — vykonává se synchronně v okamžiku, kdy je celý DOM nad ním již naparsovaný. Klasický externí skript na stejné pozici replikuje **přesně stejný okamžik inicializace**: top-level příkazy (včetně registrace listeneru na `#managePresetsModal`) běží, když prvek už existuje; inline `onclick` handlery v HTML odkazují na globální funkce, které klasický (nemodulový) skript vytváří jako globály. `defer` by fungoval také, ale zaváděl by nepatrně odlišné načasování (spuštění až po parsování, těsně před `DOMContentLoaded`) — pro nejvěrnější zachování chování byl zvolen klasický skript na konci body. `type="module"` bylo vyloučeno, protože moduly mají vlastní scope (funkce by přestaly být globální → inline `onclick` by se rozbily) a odložené vykonání.

---

## 9. Potvrzení, že nebyla změněna funkčnost

Přesunutý CSS i JS jsou **doslovné podřetězce původního `index.html`** (ověřeno porovnáním s `git show HEAD:index.html`). Nebyla změněna žádná logika, data, texty UI, ID, třídy, ARIA atributy, pořadí HTML prvků ani generovaný prompt. Jediné změny v `index.html` jsou: odstranění inline `<style>`/`<script>` bloků a přidání dvou odkazovacích řádků.

---

## 10. Tabulka referenčních promptů (před / po)

Zachyceno přes lokální HTTP server před migrací (uloženo do `sessionStorage`), znovu vygenerováno po migraci na potvrzené rozdělené verzi.

| Scénář | Délka (znaků) | Znaková shoda |
|---|---|---|
| A — minimální (téma „Ohmův zákon") | 1491 | ✅ shodné |
| B — učitelská (Ohmův zákon, učiliště, výklad, krátká, step-by-step, technology) | 1628 | ✅ shodné |
| C — plně vyplněná (Detailed/long/German/custom, strict, terminologie, Unicode+emoji+`<x>`) | 1398 | ✅ shodné |
| D — speaker notes zapnuté | 1481 | ✅ shodné |
| E — speaker notes vypnuté | 1432 | ✅ shodné |
| F — vlastní jazyk „  Slovenčina  " (oříznutí) | 1486 | ✅ shodné |
| G — nejdelší snippet (`metaphor-driven`) | 1517 | ✅ shodné |

---

## 11. Potvrzení znakové shody

Všech 7 scénářů: **znak po znaku shodné** (`now === ref`, index prvního rozdílu = −1 u všech). Porovnány obsah, mezery, nové řádky, pořadí sekcí, interpunkce, Unicode/diakritika, checkboxová pravidla, speaker notes, vlastní jazyk i stylové snippety. **0 rozdílů.**

---

## 12. Datová shoda (před / po)

Všechny hodnoty JSON-identické (✅):
- 23 klíčů `FIELD_SCHEMA` a jejich pořadí; 23 výchozích hodnot `DEFAULT_STATE`; typy, enumové allowlisty, číselné rozsahy (numSlides 3–60, bulletsPerSlide 2–8), textové limity (500 / 20000);
- `LIMITS` (presetName 100, shortText 500, longText 20000, maxPresets 100);
- storage klíče `notebooklm_prompt_generator_state_v2` / `..._presets_v2`;
- **46 stylů**, 46 snippet klíčů, ID stylů i texty snippetů;
- mapy `FORMAT_PROMPT_LABELS`, `LENGTH_PROMPT_LABELS`, `KNOWLEDGE_PROMPT_LABELS`, `ATMOSPHERE_SNIPPETS`, `THEME_PACK_SNIPPETS`.

Žádná migrace dat ani nový formát.

---

## 13. Funkční regresní testy

- ✅ Aplikace se načte bez chyby; `styles.css` a `js/app.js` HTTP 200; všechny globální funkce dostupné.
- ✅ Textová pole, textarea, selecty, checkboxy, přepínač úrovně omezení fungují; změna pole (text/checkbox/toggle) mění prompt správně.
- ✅ Všech **46 stylů** generuje validní prompt bez `undefined`/`null`/syrového `default`/`custom`; snippet vždy přítomen.
- ✅ Speaker notes dle checkboxu; screenshotové omezení právě 1×; vlastní jazyk oříznut, prázdný nevypíše `custom`.
- ✅ Vytvoření presetu (dialog, diakritika v názvu zachována), načtení správného presetu, smazání (potvrzení i zrušení).
- ✅ Kopírování: úspěch (polite) i chyba (assertive, is-error).
- ✅ Reset: potvrzený vyčistí, zrušený zachová stav.
- ✅ Import: validní (load-only i save-as-new přes dialog) načte data; export round-trip 23/23; neplatný JSON, prázdný `data`, jen neznámé klíče, poškozená data správně odmítnuty; částečný validní import projde.
- ✅ Persistence: reload zachová stav i presety; poškozený localStorage nezpůsobí pád; jeden nevalidní preset nezničí ostatní.

*Poznámka:* několik prvotních asercí selhalo kvůli hygieně testu (přepis nativních dialogů, které aplikace po M1B nepoužívá, a nechané visící `showDialog` promisy ve sdíleném `#appDialog` — projev známého P3-3). Po čistém reloadu a jednorázové interakci s dialogem vše prošlo.

---

## 14. Accessibility retesty M1B

- ✅ Přepínač „Úroveň omezení" fokusovatelný, `role="radiogroup"`; modaly `role="dialog"` + `aria-modal="true"`; `aria-labelledby`/`aria-describedby` resolují; přístupné názvy zavíracích tlačítek.
- ✅ Live region (`role="status"`, polite/assertive); focus management dialogů (focus dovnitř, trap, návrat) — ověřeno u save/delete/reset flow.
- ✅ `prefers-reduced-motion` pravidlo přítomné a efektivní; žádné kladné `tabindex`; žádný klikatelný `<div>` bez klávesnice (všechny `onclick` na nativních prvcích).
- ✅ Přesun JS nezměnil pořadí registrace listenerů ani focus management (stejný zdroj, stejné pořadí).

*(Focus-based aserce jsou v headless okně občas nespolehlivé — `document.hasFocus()===false` — ale funkční výsledky i sémantika ARIA jsou v pořádku, shodně s M1B.)*

---

## 15. Bezpečnostní retesty M1A

- ✅ **XSS:** názvy presetů `<img onerror>`, `"><svg onload>`, `<a href="javascript:">` → 0 vytvořených elementů, skript se nespustil, zobrazeno jen jako text.
- ✅ **Import:** validní přijat; `null`/pole → `structure`; bez `data` → `data`; `{data:{}}` a jen neznámé klíče → `empty`; dlouhý název ořezán na 100; round-trip 23/23.
- ✅ **Prototype pollution** na kořeni, ve `data`, v presetu i v kolekci presetů → `({}).polluted === undefined`.
- ✅ **Storage:** `getItem` i `setItem` vyhazující výjimku ošetřeny (bez pádu); `saveState`/`saveCustomPresets` vrací `false`; poškozený JSON bez pádu; limit 100 presetů; žádné falešné potvrzení při selhání zápisu.

---

## 16. Síťová kontrola

- ✅ `GET /index.html` → 200, `GET /styles.css` → 200, `GET /js/app.js` → 200.
- ✅ Žádná 404, žádné externí požadavky (nula zdrojů mimo `127.0.0.1`), žádné externí fonty/skripty/styly.
- ✅ Relativní cesty (`styles.css`, `js/app.js`) fungují na kořenové cestě.
- ✅ Konzole bez chyb: žádné syntax errors, `ReferenceError`, `TypeError`, chyby načítání zdrojů ani neošetřené Promise rejection.
- Netlify konfigurace nezměněna (relativní cesty fungují, statické publikování složky stačí).

---

## 17. Vizuální porovnání

CSS je přesunut byte-přesně a načítá se přes `<link>`; ověřeno, že se aplikuje (`--bg-primary` = `#0a0e14`, `body` background = `rgb(10,14,20)`, žádný inline `<style>`). Protože nebyl změněn jediný CSS znak ani struktura HTML, rozložení, rozměry, barvy, fonty, mezery, radius, stíny, breakpointy, animace, focus stavy, dialogy a scrollování jsou **identické** ve všech režimech (desktop/notebook/tablet/mobil/reduced-motion/otevřený dialog/focus/toast). Screenshoty ani vizuální soubory nebyly do repozitáře přidány.

*Poznámka:* náhledový prohlížeč zpočátku cachoval původní inline verzi; po cache-bust reloadu (`?v=`) se korektně načetla rozdělená verze — potvrzeno absencí inline `<style>`/`<script>` a přítomností `<link>`/`<script src>`.

---

## 18. Známá omezení

- **P3-3 (z M1B)** — sdílený `#appDialog` není re-entrantní; při rychlém spuštění více dialogů (např. v automatizovaných testech) mohou promisy kolidovat. V běžném jednorázovém uživatelském toku se neprojeví; nebylo předmětem M2B1. Ponecháno pro pozdější milník.
- Konce řádků zdrojových souborů jsou CRLF (jako původní `index.html`); nemá vliv na generovaný prompt (ten používá `\n` v JS).
- Migrace zavádí dva nové HTTP požadavky (styles.css, js/app.js) místo jednoho inline dokumentu — zanedbatelné, oba lokální a cacheovatelné.

---

## 19. Doporučení pro M2B2

- **M2B2 = vizuální systém** (světlá/adaptivní paleta a tokeny) nad již odděleným `styles.css` — teprve zde měnit vzhled, opět s vizuálním porovnáním před/po.
- Nadále dodržet: žádná změna generovaného promptu, dat, 46 stylů, přístupnosti a bezpečnosti; malé kontrolovatelné diffy.
- Zvážit v pozdějším kroku další rozdělení JS do modulů (`prompt-builder.js`, `storage.js`, `dialogs.js`, `data/styles.js`) — až bude potřeba pro obsahové milníky (galerie, doporučení). V M2B1 záměrně ponecháno jako jediný `js/app.js` (mechanický přesun bez refactoringu).

---

*Konec reportu M2B1. Změněny/přidány pouze `index.html`, `styles.css`, `js/app.js` a tento report. Bez commitu a push. Draft PR #1 zůstal otevřený a nesloučený.*
