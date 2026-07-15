# M2B2.2 — Vynucené světlé učitelské téma — report

> Milník **M2B2.2** na větvi `feat/notebooklm-m2-teacher-redesign` (základ `3d1e7d4`).
> Odstranění automatického tmavého režimu a vynucení světlého učitelského tématu bez ohledu na systémové `prefers-color-scheme`. **Ruční přepínač tématu se nepřidává.**
> Změněn pouze `styles.css` a `M2B2_VISUAL_SYSTEM_REPORT.md`; přidán tento report. `index.html`, `js/app.js` i review soubor nezměněny. Bez commitu a push.

---

## 1. Manažerské shrnutí

Praktická vizuální kontrola skutečného **Netlify Deploy Preview** po commitu `3d1e7d4` odhalila, že na systému s `prefers-color-scheme: dark` se aplikace zobrazila v automatickém tmavém režimu. Ten byl sice technicky funkční a kontrastně korektní, ale **vizuálně popíral zamýšlený charakter „klidného světlého pracovního listu pro učitele"** (působil jako vývojářský nástroj / terminál).

V M2B2.2 byl proto **automatický tmavý režim odstraněn** — smazán celý blok `@media (prefers-color-scheme: dark)` (35 řádků) — a v `:root` ponecháno jediné, nepřepisované `color-scheme: light`. Aplikace nyní používá **stejné světlé téma bez ohledu na systémové nastavení**. Světlý vizuální systém z M2B2/M2B2.1 (paleta, `--border-control` s hranicemi ≥ 3:1, focus, typografie, layout) zůstal beze změny. Runtime ověření: `color-scheme` = `light` v systémovém light i dark, 20 klíčových computed hodnot identických v obou režimech, prompty znak po znaku shodné s `3d1e7d4`, M1A/M1B zachovány, 0 nepoužitých tokenů, žádné externí požadavky, konzole bez chyb.

---

## 2. Důvod změny po praktické vizuální kontrole

- **Zjištění:** na nasazeném Deploy Preview (`https://deploy-preview-1--ntb-presentation-prompt.netlify.app`) se při systémovém tmavém režimu automaticky aktivoval tmavý vzhled aplikace (přes `@media (prefers-color-scheme: dark)`).
- **Problém:** cílová skupina jsou učitelé; tmavý „terminálový" vzhled potlačuje zamýšlenou důvěryhodnou, klidnou světlou identitu (přesně to, co M2 mělo odstranit). Adaptivní tmavý režim tak byl proti produktovému cíli tohoto milníku.
- **Rozhodnutí:** vynutit světlé téma pro všechny uživatele; automatické přepínání dle systému odstranit. Ruční přepínač tématu není součástí tohoto milníku a případný tmavý režim se odkládá jako samostatně navržená volitelná funkce.

---

## 3. Přesný odstraněný rozsah dark mode

Odstraněn **celý** blok automatického tmavého tématu z `styles.css` — **35 řádků**:

- komentářová hlavička `ADAPTIVNÍ TMAVÝ REŽIM` (6 řádků),
- `@media (prefers-color-scheme: dark) { :root { … } }` (29 řádků) obsahující:
  - `color-scheme: dark;`
  - tmavé přepisy tokenů: `--bg #0f141b`, `--surface #171d26`, `--surface-2 #1e2630`, `--surface-3 #232c38`, `--border #2b3440`, `--border-strong #3a4552`, `--border-control #657286`, `--text #e6eaf0`, `--text-secondary #c2cad6`, `--text-muted #9aa4b2`, `--accent #5b9bff`, `--accent-hover #79adff`, `--accent-weak #1a2740`, `--on-accent #0f141b`, `--success #35b87c`, `--error #e06666`, `--focus-ring #7cadff`, `--focus-shadow`, `--tips-border #2b3f63`, `--shadow-sm`, `--shadow-md`.

Odstraněny **pouze** hodnoty a pravidla sloužící automatickému tmavému tématu. Navíc přeformulovány 3 komentáře (hlavička souboru, `DESIGN TOKENS`, `:root color-scheme`), aby popisovaly vynucené světlé téma.

**Zachováno beze změny** (ověřeno grepem): `@media (max-width: 920px)`, `@media (max-width: 560px)`, `@media (pointer: coarse)`, `@media (prefers-reduced-motion: reduce)`, `@media (forced-colors: active)`. Žádný prázdný dark-mode blok, žádné mrtvé tmavé tokeny (viz §5). Diff `styles.css`: **6 insertions, 41 deletions**; `git diff --check` = exit 0.

---

## 4. Výsledný stav `color-scheme`

- V `:root` jediné `color-scheme: light;` (řádek 16). Žádný pozdější selektor ani media query hodnotu nepřepisuje.
- Výskyty v `styles.css`: `prefers-color-scheme` = **0**, `color-scheme` = **1** (`light`), `color-scheme: dark` / `normal` / `light dark` = **0**.
- **Runtime:**

| Systémové nastavení | `matchMedia('… dark)')` | computed `documentElement.colorScheme` |
|---|---|---|
| light | `false` | **`light`** |
| dark | `true` | **`light`** |

Aplikace v obou případech používá stejnou světlou paletu.

---

## 5. Inventura tokenů

Programová inventura po odstranění tmavého bloku:

| Metrika | Hodnota |
|---|---|
| Deklarované CSS custom properties | **33** |
| Použité (`var(--…)`) | **33** |
| **Nepoužité** | **0** |
| Zbylé tmavé tokeny s nulovým použitím | 0 (žádné tmavé hex hodnoty `#0f141b`/`#171d26`/`#5b9bff`/… v souboru) |
| `--border-control` použit | ✅ (6×: input/textarea/select, toggle + oddělovač, checkbox obal, sekundární tlačítko, prompt) |
| Hranice ovládacích prvků kontrast | ✅ **3,46:1** vůči povrchu (light) — nezměněno |
| `forced-colors` / `reduced-motion` tokeny/pravidla | ✅ nedotčeny |

Požadovaný výsledek **0 nepoužitých tokenů** splněn.

---

## 6. Porovnání computed styles (systémové light vs dark)

Zachyceno runtime na nasazené struktuře přes lokální HTTP server, v obou emulovaných systémových stavech, po čerstvém načtení.

| Prvek / vlastnost | Systém light | Systém dark | Shoda |
|---|---|---|---|
| `documentElement.colorScheme` | light | light | ✅ |
| `body.colorScheme` | light | light | ✅ |
| `body` background | rgb(245,247,250) | rgb(245,247,250) | ✅ |
| `.app-container` background | rgb(245,247,250) | rgb(245,247,250) | ✅ |
| `.form-section` background | rgb(255,255,255) | rgb(255,255,255) | ✅ |
| `#topic` background / border | #fff / rgb(126,139,157) | #fff / rgb(126,139,157) | ✅ |
| `select` / `textarea` background | #fff | #fff | ✅ |
| `.btn-primary` bg / fg | rgb(37,99,214) / #fff | rgb(37,99,214) / #fff | ✅ |
| `#generatedPrompt` bg / fg | #fff / rgb(31,39,51) | #fff / rgb(31,39,51) | ✅ |
| `.output-panel` background | rgb(238,241,245) | rgb(238,241,245) | ✅ |
| `body` color (text) | rgb(31,39,51) | rgb(31,39,51) | ✅ |
| dialog `.modal` background | #fff | #fff | ✅ |
| `.modal-overlay` background | rgba(15,23,42,0.45) | rgba(15,23,42,0.45) | ✅ |
| `--accent` / `--border-control` | #2563d6 / #7e8b9d | #2563d6 / #7e8b9d | ✅ |

**Programové porovnání 21 zachycených polí:** jediné odlišné pole je `matchesDark` (stav systému, `false` vs `true`) — **všech 20 vizuálních computed hodnot je identických**. Žádné tmavé plochy, žádný tmavý nativní select ani scrollbar, žádné bliknutí do tmavého režimu (neexistuje dark media query, kterou by bylo možné přepnout).

*Poznámka k vizuálnímu ověření:* rasterové screenshoty **nešlo v tomto prostředí pořídit** (screenshot pipeline náhledového prohlížeče opakovaně timeoutoval — renderer, ne stránka; DOM/JS/měření plně funkční). Vzhled je proto doložen **kvantitativně** (computed styles + geometrie + accessibility tree), nikoli pixelovým snímkem.

---

## 7. Výsledky viewport testů

Ověřeno runtime (bez horizontálního scrollu / přetečení), v obou systémových režimech je render forced-light identický:

| Viewport | H-scroll | Přetečení | Poznámka |
|---|---|---|---|
| 1440×900 | ✅ ne | 0 | 2 panely, computed light |
| 1280×800 | ✅ ne | 0 | 2 panely |
| 1024×768 | ✅ ne | 0 | 2 panely |
| 768×1024 | ✅ ne | 0 | 1 sloupec, dialog se vejde |
| 390×844 | ✅ ne | 0 | 1 sloupec |
| 360×800 | ✅ ne | 0 | 1 sloupec |
| **320×800** (systémové dark) | ✅ ne | **0** | `colorScheme: light`, body #f5f7fa, dialog 276 px se vejde |

Rozměry ani zalamování se oproti M2B2.1 nezměnily (layout CSS nedotčen). Prompt čitelný, ovládací prvky kontrastní (hranice 3,46:1).

---

## 8. Accessibility retesty

| Kontrola | Výsledek |
|---|---|
| Dialog: otevření / Escape / focus trap / návrat focusu | ✅ |
| Tab / Shift+Tab / Enter / mezerník / šipky radioskupiny | ✅ (chování nezměněno, HTML/JS nedotčeny) |
| focus-visible | ✅ (accent border + ring) |
| **`prefers-reduced-motion`** blok | ✅ zachován |
| **`forced-colors`** blok | ✅ zachován (ohraničení + Highlight focus + checked toggle) |
| Live regiony | ✅ (1×, nezměněno) |
| Žádné kladné `tabindex` | ✅ 0 |
| 200 % zoom | ✅ reflow bez H-scrollu (≤ 640 CSS px v pásmu ověřených šířek) |

Odstranění dark media query **nijak nezasáhlo** `forced-colors` ani `reduced-motion` pravidla (samostatné bloky, ověřeno grepem).

---

## 9. Promptová a funkční regrese (proti `3d1e7d4`)

| Test | Výsledek |
|---|---|
| 10 referenčních promptů (SHA-256) | ✅ **0 rozdílů** |
| 46 stylů | ✅ `styleFails = 0` |
| Round-trip 23/23 (diakritika + emoji + custom jazyk) | ✅ |
| Generování / kopírování / reset / presety / import / export | ✅ (logika v nedotčeném `js/app.js`) |
| Persistence / storage error chování | ✅ (`saveState` false, poškozený localStorage fallback) |
| Vlastní jazyk / speaker notes / dialogy | ✅ (identické prompty) |

**0 změn promptu, 0 změn funkčnosti.**

---

## 10. Bezpečnostní retesty (M1A)

| Test | Výsledek |
|---|---|
| XSS v tématu (`<img onerror>`, `<script>`, `"><svg>`) | ✅ alert nespuštěn, **0 vytvořených elementů** |
| Škodlivý dlouhý název presetu (250+ znaků) | ✅ render v `<span>`/textContent, 0 aktivních elementů, **bez přetečení**, delete tlačítko viditelné |
| Import (`null`, pole, bez `data`, prázdná, neznámé klíče) | ✅ bezpečné, bez výjimky |
| Prototype pollution (`__proto__` v `data`) | ✅ `({}).polluted === undefined`, `Object.prototype` čistý |
| Poškozený localStorage / výjimka `setItem` / limit 100 | ✅ ošetřeno |

---

## 11. Síťová kontrola

- `index.html` → 200 `text/html`, `styles.css` → 200 `text/css`, `js/app.js` → 200 `application/javascript`.
- Neexistující soubor → 404 (očekávané); **žádná 404 pro reálné assety**.
- **Žádné externí fonty, žádný externí CSS/JS, žádný `@font-face`/`@import`/CDN** (grep HTML i CSS prázdný).
- Žádný nový síťový požadavek oproti `3d1e7d4`; konzole bez chyb.

---

## 12. Známá omezení

- **Tmavý režim už není dostupný vůbec** — uživatelé preferující tmavé rozhraní jej v této verzi nemají. Je to vědomé produktové rozhodnutí (učitelská světlá identita). Budoucí tmavý režim jen jako samostatně navržená, explicitně řízená volitelná funkce (ne automatika dle systému).
- **Ruční theme toggle nebyl přidán** (mimo rozsah M2B2.2).
- **Rasterové screenshoty** nešlo v tomto prostředí pořídit; vizuál doložen kvantitativně (computed styles + geometrie).
- **Konce řádků** `styles.css` jsou CRLF (autocrlf) — kosmetické.

---

## 13. Doporučení pro M2C

- **M2C = režim Jednoduchý / Pokročilý** (blueprint §17): přepínač + rozbalení pokročilých sekcí, kroky jako sekce (`h2` hierarchie), stav režimu do `localStorage`. Světlý token systém je připraven.
- Zachovat pravidlo: **žádná změna generovaného promptu, dat, 46 stylů, přístupnosti ani bezpečnosti**; malé kontrolovatelné diffy.
- **Volitelný tmavý režim** (pokud se vůbec vrátí) navrhnout až později jako **explicitní** přepínač světlá/tmavá se samostatným designem a kontrastní kontrolou — nikoli automaticky dle systému.
- Při M2C hlídat, aby skrytí pokročilých sekcí neměnilo prompt (identický výstup v obou režimech).

---

*Konec reportu M2B2.2. Změněn pouze `styles.css` a `M2B2_VISUAL_SYSTEM_REPORT.md`; přidán tento report. `index.html`, `js/app.js` i `M2B2_VISUAL_SYSTEM_REVIEW.md` nezměněny. Bez commitu a push. Draft PR #1 zůstal otevřený a nesloučený.*
