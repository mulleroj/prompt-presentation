# M2B1 — Mechanické rozdělení statické aplikace — nezávislá code review

> Nezávislý přezkum milníku **M2B1** na větvi `feat/notebooklm-m2-teacher-redesign` (základ `a4bfb91`).
> Každé podstatné tvrzení z `M2B1_FILE_SPLIT_REPORT.md` bylo ověřeno přímo v diffu, kódu a runtime — nikoli převzato.
> Bez úprav zdrojů, bez commitu, bez push, bez změny stavu PR #1. Jediný nově vytvořený soubor je tento review.

---

## 1. VERDIKT

### ✅ PASS

Rozdělení je **skutečně mechanické a doslovné**. Extrahovaný CSS a JS jsou byte-přesné podřetězce původního inline obsahu (jediné odchylky: konce řádků CRLF — artefakt `core.autocrlf=true`, shodný s původním pracovním stromem — a jeden koncový `\n` na konci každého nového souboru). Runtime chování — generovaný prompt, data, přístupnost i bezpečnost — je **nerozeznatelné** od verze před migrací. Nebyl nalezen žádný nález úrovně P0, P1 ani P2. **Je bezpečné vytvořit commit.**

---

## 2. Přesný rozsah kontrolovaného diffu

| Položka | Hodnota |
|---|---|
| Větev | `feat/notebooklm-m2-teacher-redesign` |
| HEAD | `a4bfb91be6972dea1596ef3fdb3d463b88fa7b18` (`docs: add teacher-focused redesign blueprint`) |
| Upstream | `origin/feat/notebooklm-m2-teacher-redesign` (up to date) |
| `git diff --stat` | `index.html | 1849 +---`, **2 insertions(+), 1847 deletions(-)** |
| `git diff --check` | čistý (žádné whitespace chyby) |
| `git diff --name-status` | `M index.html` |
| Untracked | `M2B1_FILE_SPLIT_REPORT.md`, `js/`, `styles.css` |
| Změněné/přidané soubory | pouze `index.html`, `styles.css`, `js/app.js`, `M2B1_FILE_SPLIT_REPORT.md` |
| Jiné neočekávané změny | **žádné** |
| PR #1 | OPEN, isDraft=true, mergedAt=null (base `master`, head `feat/notebooklm-m2-teacher-redesign`) |

Poznámka k prostředí: přezkum probíhal ve worktree `notebooklm-app-audit-f48b97`, kde je větev `feat/notebooklm-m2-teacher-redesign` vyexpandována s neverzovanými změnami M2B1 (HEAD stále `a4bfb91`, změny dosud necommitnuté) — přesně podle zadání.

**−1847 řádků = 1843 přesunutých obsahových řádků (688 CSS + 1155 JS) + 4 řádky obalových tagů (`<style>`, `</style>`, `<script>`, `</script>`); +2 řádky = nové `<link>` a `<script src>`.** Sedí přesně.

---

## 3. Nálezy P0–P3

| ID | Úroveň | Popis | Blokuje commit? |
|---|---|---|---|
| — | **P0** | žádné | — |
| — | **P1** | žádné | — |
| — | **P2** | žádné | — |
| N1 | **P3 / info** | Nové soubory používají **CRLF** konce řádků a mají navíc **jeden koncový `\n`** na konci souboru oproti extrahovanému bloku. CRLF je artefakt `core.autocrlf=true` a je shodný s původním pracovním stromem `index.html`; při commitu git blob normalizuje na LF (jako u originálu). Koncový newline je běžná/žádoucí POSIX praxe. **Nulový funkční dopad** — prompt se skládá `lines.join('\n')` a v JS neexistuje žádný víceřádkový template literál. Fix není nutný. | ne |
| N2 | **P3 / info** | Responzivita je řešena **jediným breakpointem** `@media (max-width:920px)` (+ `prefers-reduced-motion`). Není to regrese — CSS je doslovně shodné s originálem; jen upozornění, že samostatné tablet/mobil breakpointy (768/480) v aplikaci neexistují a nikdy neexistovaly. | ne |
| N3 | **P3 / info (zděděno)** | P3-3 z M1B: sdílený `#appDialog` není re-entrantní. Nebylo předmětem M2B1, migrací nezavedeno ani nezhoršeno. | ne |
| N4 | **P3 / info** | Migrace zavádí 2 nové HTTP požadavky (`styles.css`, `js/app.js`) místo jednoho inline dokumentu. Zanedbatelné, oba lokální a cacheovatelné. Viz §17 (cache). | ne |

---

## 4. Doslovné porovnání CSS

**Výsledek: DOSLOVNĚ SHODNÉ** (modulo CRLF + koncový `\n`).

- Extrahován obsah mezi `<style>` (ř. 7) a `</style>` (ř. 696) z `git show HEAD:index.html`.
- Po normalizaci konců řádků (CRLF→LF): extrahovaný blok **== `styles.css` znak po znaku**, jediný rozdíl je jeden koncový `\n` na samém konci souboru (`styles.css` má 19 208 vs 19 207 znaků LF-normalizovaně).
- Byte-velikost `styles.css` = **19 904 B**, 688 řádků, závorky `{`/`}` = **86/86** (odpovídá reportu).
- Žádný BOM, žádný NUL, validní UTF-8, žádné osamocené CR.
- Pořadí pravidel, selektory, komentáře, barvy, custom properties, `@media`, `prefers-reduced-motion`, focus-visible styly — beze změny.
- **Index prvního obsahového rozdílu: žádný** (jediný rozdíl je terminační newline na konci souboru).

---

## 5. Doslovné porovnání JavaScriptu

**Výsledek: DOSLOVNĚ SHODNÉ** (modulo CRLF + koncový `\n`).

- Extrahován obsah mezi aplikačním `<script>` (ř. 1120) a `</script>` (ř. 2276).
- Po normalizaci CRLF→LF: extrahovaný blok **== `js/app.js` znak po znaku**, jediný rozdíl je jeden koncový `\n` (56 138 vs 56 137 znaků).
- Byte-velikost `js/app.js` = **57 568 B**, 1155 řádků.
- Žádný BOM, žádný NUL, validní UTF-8.
- Pořadí deklarací, scope, konstanty, mapy, snippety, ochrany — beze změny.
- **Index prvního obsahového rozdílu: žádný.**

**Rekonstrukční kontrola:** vzal jsem původní `index.html`, nahradil blok `<style>…</style>` řetězcem `<link rel="stylesheet" href="styles.css">` a blok `<script>…</script>` řetězcem `<script src="js/app.js"></script>`. Výsledek je (LF-normalizovaně) **znak po znaku shodný s novým `index.html`** → dokazuje, že mimo tyto dva odkazy se v HTML nezměnilo **nic**.

---

## 6. Kontrola `index.html`

| Kontrola | Výsledek |
|---|---|
| `<link rel="stylesheet" href="styles.css">` v `<head>` | ✅ ř. 7, hned za `<title>`, před `</head>` (ř. 8) |
| Správná relativní cesta | ✅ `styles.css` (bez leading slash) |
| `<script src="js/app.js">` před `</body>` | ✅ ř. 431, přesně před `</body>` (ř. 432) |
| Bez `defer` / `async` / `type="module"` | ✅ klasický skript, žádné atributy |
| Duplicitní `<style>` | ✅ žádný (`<style>` se v novém souboru nevyskytuje) |
| Duplicitní aplikační `<script>` | ✅ žádný inline aplikační skript |
| Prázdné/poškozené tagy po extrakci | ✅ žádné |
| HTML struktura vs `a4bfb91` | ✅ jinak shodná (viz rekonstrukční kontrola §5) |
| ID, class, role, ARIA | ✅ beze změny |
| UI texty | ✅ beze změny |
| Pořadí DOM prvků | ✅ beze změny |
| Inline handlery → existující globální funkce | ✅ viz §7 |

---

## 7. Globální scope a inline handlery

`js/app.js` **není** obalen v IIFE, modulu ani `DOMContentLoaded` wrapperu — je to top-level klasický skript (stejně jako původní inline `<script>`). Všech 7 funkcí volaných z HTML je deklarováno jako top-level `function` / `async function`, tedy se stávají vlastnostmi `window`. Inicializace přes `document.addEventListener('DOMContentLoaded', …)` (ř. 410) — beze změny okamžiku.

Úplný seznam inline handlerů (10 výskytů v `index.html`):

| Ř. | Handler (onclick/onchange) | Volaná funkce | Na `window`? | Runtime test |
|---|---|---|---|---|
| 29 | `openManagePresets()` | openManagePresets | ✅ | ✅ otevře dialog, focus dovnitř |
| 368 | `copyToClipboard()` | copyToClipboard | ✅ | ✅ funkce dostupná |
| 369 | `resetForm()` | resetForm | ✅ | ✅ funkce dostupná |
| 372 | `saveAsPreset()` | saveAsPreset | ✅ | ✅ funkce dostupná |
| 373 | `openManagePresets()` | openManagePresets | ✅ | ✅ |
| 374 | `exportPreset()` | exportPreset | ✅ | ✅ funkce dostupná |
| 375 | `document.getElementById('importFile').click()` | (přímý DOM) | n/a | ✅ prvek existuje |
| 376 | `importPreset(event)` | importPreset | ✅ | ✅ funkce dostupná |
| 392 | `closeModal()` | closeModal | ✅ | ✅ zavře dialog, vrátí focus |
| 398 | `closeModal()` | closeModal | ✅ | ✅ |

- **7/7 unikátních funkcí existuje jako `typeof window[fn] === 'function'`.**
- Žádná funkce se nestala lokální; žádná deklarace není zastíněna; globální scope je identický s původním inline skriptem.
- V konzoli **žádný `ReferenceError`** (jediné `[warn]` byly z mnou záměrně vyvolaných fault-injection testů localStorage).

---

## 8. Pořadí načítání a inicializace

| Kontrola | Výsledek |
|---|---|
| Skript se vykoná až po vytvoření potřebného DOM | ✅ je na konci `<body>`; top-level `getElementById('managePresetsModal').addEventListener(...)` má prvek k dispozici |
| Race condition | ✅ žádná |
| Závislost na `document.currentScript` | ✅ žádná (grep prázdný) |
| Závislost na inline proměnné z HTML | ✅ žádná |
| Okamžik inicializace vs originál | ✅ identický (klasický skript na stejné pozici) |
| První načtení bez uloženého stavu | ✅ funguje (fallback na DEFAULT_STATE) |
| První načtení s uloženým stavem | ✅ `loadState()` obnoví hodnoty |
| Opakovaný reload → duplicitní listenery | ✅ nezjištěno; listenery registrovány jednorázově při načtení skriptu |

`defer` by fungoval také (spustil by se rovněž po parsování DOM), ale nezmění riziko — skript je na konci body, kde `defer` nemá praktický rozdíl. Volba klasického skriptu bez `defer` je pro věrné zachování chování správná. `type="module"` by naopak rozbil inline handlery (modulový scope) — správně vyloučeno.

---

## 9. Kontrola síťových cest (Netlify)

| Požadavek | Status | MIME |
|---|---|---|
| `/index.html` | 200 | text/html |
| `/` | 200 | text/html |
| `/styles.css` | 200 | text/css |
| `/js/app.js` | 200 | application/javascript |
| neexistující soubor | 404 | — |

- **Žádné 404, žádné MIME chyby, žádné CORS chyby, žádné externí požadavky** (runtime network log: pouze 3 same-origin soubory; nula fontů/CDN/analytiky).
- Relativní cesty (`styles.css`, `js/app.js`, bez leading slash) se řeší vůči `/index.html` → korektní pro **kořenové nasazení**, funkční i s **query parametrem** a **fragmentem** (ty resolving relativních cest neovlivňují) a na **Netlify deploy-preview** doméně.
- Trailing-slash: aplikace je jednostránková v kořeni; při `/` server servíruje `index.html` a relativní cesty fungují. Aplikace není určena pro libovolný podadresář a to není chyba — odpovídá běžnému Netlify publish celé složky.
- Netlify konfigurace nezměněna.

---

## 10. FOUC (flash of unstyled content)

**Praktický FOUC nezjištěn.** `styles.css` je připojen jako **render-blocking `<link>` v `<head>`** — standardní mechanismus, který první vykreslení blokuje až do načtení CSS, čímž FOUC z principu **předchází**. To je běžné a správné chování externího stylesheetu, ne problém použitelnosti. Runtime potvrdil, že se stylesheet aplikuje (`--bg-primary` = `#0a0e14`, `body` background = `rgb(10,14,20)`, 82 pravidel, sheet přístupný bez CORS). Ani při zpomaleném načtení by nešlo o skutečný viditelný FOUC, protože paint je blokovaný. Kód neupravovat.

---

## 11. Tabulka referenčních promptů (nezávislé porovnání před/po)

Metoda: **dva HTTP servery** — původní jednosouborový `index.html` z `a4bfb91` (port 8766) vs. rozdělená verze (port 8765). Identická konfigurace nastavena přes `setFormState`, výstup `generatePrompt` porovnán přes **SHA-256 + délku**.

| # | Scénář | Délka před | Délka po | Index 1. rozdílu | SHA-256 shoda | Výsledek |
|---|---|---|---|---|---|---|
| 1 | minimální (prázdná pole) | 1410 | 1410 | — (žádný) | ✅ | **PASS** |
| 2 | běžná učitelská (Fotosyntéza, 8. tř., beginner, 8 slidů) | 1613 | 1613 | — | ✅ | **PASS** |
| 3 | plně vyplněná (advanced, 15 slidů, terminologie, emoji 🌍, science) | 1717 | 1717 | — | ✅ | **PASS** |
| 4 | speaker notes zapnuté | 1490 | 1490 | — | ✅ | **PASS** |
| 5 | speaker notes vypnuté | 1441 | 1441 | — | ✅ | **PASS** |
| 6 | vlastní jazyk s whitespace (`  Sloven čina  `) | 1491 | 1491 | — | ✅ | **PASS** |
| 7 | nejdelší snippet (`metaphor-driven`) | 1523 | 1523 | — | ✅ | **PASS** |
| 8 | styl `noir` | 1464 | 1464 | — | ✅ | **PASS** |
| 9 | styl `blueprint` | 1470 | 1470 | — | ✅ | **PASS** |
| 10 | styl `mascot-based` | 1504 | 1504 | — | ✅ | **PASS** |

**Všech 10 scénářů je znak po znaku shodných — 0 rozdílů.** Žádný výstup neobsahuje `\r` (potvrzeno, že CRLF ve zdroji neproniká do promptu). Tvrzení reportu o znakové shodě je nezávisle potvrzeno.

---

## 12. Kontrola všech 46 stylů

Programově ověřeno na obou verzích (nová i původní), styl nastaven jako `illustrationPreset`:

| Kontrola | Výsledek (46/46) |
|---|---|
| Odpovídající snippet přítomen v promptu | ✅ 46/46 |
| Bez `undefined` | ✅ 46/46 |
| Bez `null` | ✅ 46/46 |
| Bez interního tokenu `custom` | ✅ 46/46 |
| Bez syrového `default` | ✅ 46/46 |
| Bez prázdné sekce (`## …\n\n`) | ✅ 46/46 |
| Pořadí sekcí stabilní | ✅ |
| SHA-256 výstupu shodná před vs. po | ✅ 46/46 |

**`styleFails = 0`.** Všech 46 stylů generuje validní prompt a produkuje bit-identický výstup před i po migraci.

---

## 13. Datová shoda (před / po)

Podloženo (a) byte-identitou JS (§5) a (b) runtime introspekcí obou verzí.

| Kategorie | Počet rozdílů |
|---|---|
| `DEFAULT_STATE` (23 klíčů + hodnoty) | **0** |
| `FIELD_SCHEMA` — 23 klíčů, pořadí, typy | **0** |
| Číselné rozsahy (`numSlides` 3–60, `bulletsPerSlide` 2–8) | **0** |
| Textové limity (`shortText` 500, `longText` 20000) | **0** |
| Enumové allowlisty (`ENUMS`) | **0** |
| `LIMITS` (presetName 100, shortText 500, longText 20000, **maxPresets 100**) | **0** |
| Storage klíče (`…_state_v2`, `…_presets_v2`) | **0** |
| 46 stylů / 46 snippet klíčů / názvy / hodnoty | **0** |
| Prompt mapy (`FORMAT_/LENGTH_/KNOWLEDGE_PROMPT_LABELS`, `ATMOSPHERE_/THEME_PACK_SNIPPETS`) | **0** |
| Bezpečnostní konstanty (`FORBIDDEN_KEYS`) | **0** |

**Nula funkčních rozdílů ve všech kategoriích.**

---

## 14. Funkční regresní testy (runtime)

| Test | Výsledek |
|---|---|
| První načtení / reload | ✅ bez chyb v konzoli |
| Textová pole, textarea, selecty, checkboxy, radio skupina | ✅ round-trip |
| Změna úrovně omezení | ✅ |
| Všech 46 stylů → validní prompt | ✅ (§12) |
| Generování promptu | ✅ (`lines.join('\n')`, `generatedPrompt.value`) |
| **Round-trip 23/23** (`setFormState`→`getFormState`) vč. diakritiky `ěščřžýáíé` + emoji 🌍🎓 | ✅ 23/23 shodných |
| Persistence: `saveState` → raw JSON → `loadState` obnoví | ✅ topic zachován |
| Selhání `setItem` (QuotaExceeded) | ✅ `saveState()` vrací `false`, bez pádu, `console.warn` |
| Výjimka `getItem` | ✅ ošetřeno bez pádu |
| Poškozený localStorage (`{corrupt json`) | ✅ fallback na výchozí, bez pádu |
| Kopírování (úspěch/chyba) | ✅ funkce dostupná, bez výjimky |
| Reset, presety (save/load/delete), export/import, limit 100 | ✅ logika verbatim z M1A/M1B |

Konzole sledována po celou dobu — jediné výpisy byly **očekávané `[warn]`** z fault-injection (QuotaExceeded, neplatná uložená data). Žádný `ReferenceError`/`TypeError`/uncaught.

---

## 15. Accessibility retest M1B

| Kontrola | Výsledek |
|---|---|
| `role="dialog"` + `aria-modal="true"` (2 dialogy) | ✅ |
| `aria-labelledby` (`managePresetsTitle`, `appDialogTitle`) | ✅ resolují |
| `aria-describedby` (`appDialogMessage` u appDialogu) | ✅ |
| Live region (`#copyFeedback`, `role="status"`, `aria-live="polite"`) | ✅ |
| Otevření dialogu → focus dovnitř (na `.modal-close`) | ✅ |
| Escape zavře dialog | ✅ |
| Focus trap (Tab drží focus uvnitř) | ✅ |
| Návrat focusu na opener po zavření | ✅ (Escape i `closeModal`) |
| Opakované otevření dialogu | ✅ |
| Žádné kladné `tabindex` | ✅ 0 výskytů |
| Žádné nové klikatelné neinteraktivní prvky | ✅ všechny `onclick` na `<button>` |
| `prefers-reduced-motion` | ✅ pravidlo přítomné a efektivní |
| focus-visible styly | ✅ přítomné (tlačítka, select, checkbox, radio) |

Externí načtení JS **nezměnilo focus management** — kód je verbatim a HTML markup identický. M1B je zachováno.

> Metodická poznámka: jedna první aserce vypadala jako „Escape nezavřel" jen proto, že viditelnost modalu je řízena třídou `.visible` (ne `display`); po opravě signálu Escape korektně zavírá a vrací focus.

---

## 16. Bezpečnostní retest M1A

**XSS** — payloady `<img src=x onerror=alert(1)>`, `<script>alert(1)</script>`, `"><svg onload=alert(1)>`, `<a href="javascript:alert(1)">`:
- ✅ `alertFired = false`
- ✅ `domNodeDelta = 0` (žádný vytvořený aktivní element)
- ✅ všechny payloady se objevily **pouze jako text** v `generatedPrompt.value` (výstup jde do `textarea.value`, ne `innerHTML`; seznam presetů používá `textContent`)

**Import a storage** — `validateAndNormalizePresetImport` (verbatim z M1A):
- ✅ neplatný JSON → `SyntaxError` zachycen v `importPreset`
- ✅ `null`, pole, objekt bez `data`, prázdná `data`, jen neznámé klíče, validní + neznámé klíče → vždy vrácen **bezpečný normalizovaný objekt**, žádná výjimka nepropadla
- ✅ výjimky `getItem`/`setItem` ošetřeny; poškozený localStorage bez pádu; limit 100 presetů (`LIMITS.maxPresets`)

**Prototype pollution** — nebezpečné klíče (`__proto__` v kořeni, ve `data`, v presetu, `constructor`):
- ✅ po každé skupině: **`({}).polluted === undefined`** a `Object.prototype.polluted === undefined`

Ochrany (`FORBIDDEN_KEYS`, allowlist přes `FIELD_SCHEMA` s `hasOwnProperty`, `isPlainObject`, `textContent`) jsou v `js/app.js` přítomné verbatim. M1A je zachováno.

---

## 17. Cache a aktualizace souborů (informační)

Aplikace přešla z jednoho souboru na tři runtime soubory. Posouzení rizika smíšených verzí:

- **Netlify publikuje atomicky** — každý deploy je immutabilní snapshot; server nikdy nekombinuje starý `index.html` s novým assetem na úrovni originu. Riziko „nový index + starý app.js" ze samotného nasazení je proto minimální.
- **Cache prohlížeče** je jediný praktický vektor: assety mají stabilní názvy bez hashe, takže po deployi může prohlížeč krátce servírovat cachovaný `styles.css`/`app.js`. Protože ale tento milník **nemění chování ani obsah**, i případný mix starý/nový je funkčně ekvivalentní. Hard-reload nesoulad odstraní.
- **Do budoucna** (jakmile M2B2+ začne měnit vzhled/logiku) by se hodilo **verzování assetů** (hash v názvu nebo `?v=`), aby se předešlo dočasnému mixu při aktualizaci. Pro M2B1 to není potřeba.

Tento bod **neblokuje commit**. Cache-busting ani service worker se v této fázi nezavádí.

---

## 18. Hodnocení reportu `M2B1_FILE_SPLIT_REPORT.md`

Report je **přesný a nepřehání**. Ověřená tvrzení:

| Tvrzení reportu | Ověření |
|---|---|
| 2278 → 433 / 688 / 1155 řádků | ✅ přesně |
| „byte-přesný" přesun, doslovné podřetězce | ✅ (modulo CRLF + koncový `\n`, což report v §18 poctivě přiznává) |
| styles.css 19 904 B, app.js 57 568 B | ✅ přesně |
| Závorky CSS 86/86 | ✅ |
| Klasický skript na konci body, bez `defer`/`module` | ✅ popis správný (§7/§8) |
| Znaková shoda 7 ref. promptů, 0 rozdílů | ✅ nezávisle potvrzeno (10 scénářů) |
| 23 pole, rozsahy 3–60 / 2–8, limity 500/20000, maxPresets 100 | ✅ |
| 46 stylů, 5 prompt map, storage klíče | ✅ |
| Síť: 3× 200, žádné externí, žádná 404 | ✅ |
| CRLF nemá vliv na prompt (`\n` v JS) | ✅ potvrzeno (0 víceřádkových template literálů) |
| P3-3 re-entrance ponecháno | ✅ zděděné, migrací nezhoršeno |

Report **nezakládá vizuální shodu na screenshotech**, ale na byte-identitě CSS + neměnné HTML struktuře, a explicitně uvádí, že screenshoty do repa nepřidal — jistota je tedy formulována přiměřeně, ne přehnaně. Známá omezení (CRLF, dva HTTP požadavky, P3-3) jsou uvedena pravdivě. Poznámky o „hygieně testu" (§13) a headless focus (§14) jsou upřímné.

---

## 19. Hodnocení velikosti a přiměřenosti diffu

- **Skutečně mechanická změna** — rekonstrukční kontrola (§5) dokazuje, že mimo dva odkazové řádky se v HTML nezměnil ani znak; CSS a JS jsou doslovné podřetězce.
- **Žádný nesouvisející refactoring** — žádné přejmenování, žádné slučování pravidel, žádné nové proměnné, žádný přepis na moduly.
- **Zlepšuje udržovatelnost** — oddělení struktury/stylu/logiky je předpoklad pro obsahové milníky M2; `index.html` klesl z 2278 na 433 řádků.
- **Názvy `styles.css` a `js/app.js`** jsou přiměřené a konvenční.
- **Klasický skript bez `defer`** je správná volba pro věrné zachování chování; `defer` by riziko nezměnil (skript je na konci body), `type="module"` by rozbil inline handlery.
- **Velikost diffu** (−1847 / +2 v `index.html`, +688 CSS, +1155 JS) přesně odpovídá přesunu 1843 obsahových řádků + 4 obalové tagy. Sedí.
- ES moduly / bundler / framework se **nevyžadují** a v tomto kroku by byly škodlivé (změna chování).

---

## 20. Přesná doporučení oprav

**Žádné blokující opravy.** Change je způsobilý k commitu tak, jak je.

Volitelně (nezávazně, nikoli pro M2B1):
1. **Konzistence konců řádků** — do budoucna zvážit `.gitattributes` (`* text=auto eol=lf` nebo cílené `*.css/*.js text`), aby konce řádků byly deterministické napříč prostředími. Kosmetické; nyní bez dopadu.
2. **Verzování assetů** — až M2B2+ začne měnit CSS/JS, přidat hash/`?v=` kvůli cache (viz §17).
3. **P3-3 re-entrance `#appDialog`** — vyřešit v pozdějším milníku (zděděné z M1B).

---

## 21. Doporučení ohledně commitu

✅ **Je bezpečné vytvořit commit.** Změna je čistě mechanická, doslovně ověřená v diffu, kódu i runtime, bez funkčních, datových, přístupnostních či bezpečnostních rozdílů a bez nálezů P0–P2. (Samotný commit/push i změnu stavu PR #1 ponechávám na uživateli — v této fázi jsem nic necommitoval.)

---

## Souhrn provedených kontrol

- **Provedené kontroly/aserce:** > 130 (10 baseline, 6 doslovné porovnání + rekonstrukce, 12 index.html, 10 inline handlerů + scope, 8 pořadí načítání, 6 síť/MIME, 10 referenčních promptů, 46×8 kontrol stylů, 10 kategorií dat, 12 funkčních, 13 accessibility, 14 bezpečnostních).
- **Selhání:** **0** (žádné funkční selhání; jediná zdánlivá anomálie — „Escape" — byla chyba měřicího signálu v testu, po opravě PASS).

---

*Konec nezávislé review M2B1. Vytvořen pouze tento soubor `M2B1_FILE_SPLIT_REVIEW.md`. Zdroje (`index.html`, `styles.css`, `js/app.js`), report M2B1 ani předchozí reporty nebyly upraveny. Nebyl vytvořen commit ani push. Draft PR #1 zůstal otevřený a nesloučený.*
