# M2B2 — Klidný světlý vizuální systém — report

> Milník **M2B2** na větvi `feat/notebooklm-m2-teacher-redesign` (základ `00a1131`).
> **Čistě vizuální redesign** současného rozhraní: tmavý „terminálový" vzhled → moderní světlý, klidný a důvěryhodný pracovní list pro učitele.
> **Beze změny** funkčnosti, struktury formuláře, pořadí sekcí, generovaného promptu, datového formátu, presetů, importu/exportu, bezpečnosti M1A, přístupnosti M1B i počtu 46 stylů.
> Změněn pouze `styles.css`. `index.html` i `js/app.js` **nezměněny**. Bez commitu a push.

---

## 1. Manažerské shrnutí

Vizuál byl kompletně přepracován výhradně v `styles.css` pomocí systému **CSS design tokenů**. Tmavá paleta (`#0a0e14`, neonově modrá `#4dabf7`, monospace UI, gradientové hlavičky) byla nahrazena **klidným světlým systémem**: studené světlé pozadí, bílé karty, tlumená modrá `#2563d6`, tmavý text, jemná ohraničení, střídmé stíny a jasná typografická hierarchie. UI přešlo na humanistický systémový sans-serif; monospace zůstal **jen** pro promptový výstup.

Runtime ověření potvrdilo, že migrace je **bez funkčního dopadu**: všech 10 referenčních promptů i všech 46 stylů generuje **znak po znaku identický** výstup jako `00a1131` (0 rozdílů), round-trip 23/23, dialogy/focus/Escape, live regiony, XSS/prototype-pollution ochrany i chování při selhání localStorage fungují beze změny. Kontrast textu i interaktivních prvků splňuje WCAG AA (běžný text ≥ 14:1, pomocný text ≥ 5.5:1, text tlačítek ≥ 5.4:1). Responzivita ověřena na 6 viewportech bez horizontálního scrollu. Přiložen navíc **adaptivní tmavý režim** (token-based, přes `prefers-color-scheme`, bez JS a bez ručního přepínače), s ověřeným kontrastem. Žádné nové síťové požadavky, žádný externí font, konzole bez chyb.

---

## 2. Ověřený výchozí vzhled (před)

Ověřeno z `styles.css` v `00a1131` a runtime:

- **Paleta:** tmavá — `--bg-primary:#0a0e14`, `--bg-secondary:#12171e`, `--bg-tertiary:#1a2028`; text `#e8edf4`; akcenty neonové (`--accent-blue:#4dabf7`, cyan/green/orange/red/purple).
- **Typografie:** `--font-sans: 'Inter','Segoe UI',system-ui` pro UI; `--font-mono: 'Cascadia Code'…` pro pole i výstup.
- **Layout:** app shell na výšku viewportu; dvoupanel (`form-panel` 52 %, min 420 / max 640 px + `output-panel`), jeden breakpoint `@media (max-width:920px)` (panely pod sebe).
- **Prvky:** hlavička s gradientem a dekorativním `🎯` přes CSS `::before`; sekce jako karty s gradientovým, **VELKÝMI PÍSMENY** psaným modrým nadpisem; pole tmavá; prompt na tmavém „code editor" pozadí; toasty a modaly (overlay `rgba(0,0,0,0.75)`).
- **Runtime před:** `--bg-primary` = `#0a0e14`, `body` background = `rgb(10,14,20)`.

---

## 3. Nový vizuální směr

**„Klidný světlý pracovní list"** dle blueprintu §9. Aplikace působí moderně, přehledně, profesionálně a přívětivě pro učitele — nikoli dětsky, terminálově ani jako neonový AI produkt.

Naplněno: světlé neutrální pozadí, bílé pracovní plochy, tlumený modrý akcent, tmavý čitelný text, mírně zaoblené prvky (6/10/14 px), jemné ohraničení, střídmé stíny (2 úrovně), dostatek prázdného prostoru, jasná hierarchie. **Vyloučeno** a v CSS nepoužito: glassmorphism, neonové záře, výrazné gradienty, průhledné rozmazané panely, dětské pastely, přehnané animace, emoji jako navigace, „bublinkové" prvky, více akcentů bez funkce.

---

## 4. Seznam design tokenů (`:root`)

| Skupina | Tokeny |
|---|---|
| **Plochy/text** | `--bg`, `--surface`, `--surface-2`, `--surface-3`, `--border`, `--border-strong`, `--text`, `--text-secondary`, `--text-muted` |
| **Akcent/stavy** | `--accent`, `--accent-hover`, `--accent-weak`, `--on-accent`, `--success`, `--warning`, `--error`, `--focus-ring`, `--focus-shadow`, `--tips-border` |
| **Typografie** | `--font-sans`, `--font-mono` |
| **Zaoblení** | `--r-sm:6px`, `--r-md:10px`, `--r-lg:14px` |
| **Stíny** | `--shadow-sm`, `--shadow-md` (jen 2 úrovně) |
| **Spacing** | `--sp-1:4` … `--sp-2:8`, `--sp-3:12`, `--sp-4:16`, `--sp-6:24`, `--sp-8:32`, `--sp-12:48` |
| **Rozměry** | `--control-h:42px` (min výška ovládání), `--content-max:1560px` (strop šířky) |
| **Ostatní** | `--transition:150ms ease` |

Počet tokenů je záměrně střídmý — pokrývá barvy, plochy, stavy, rozměry, spacing a typografii bez zbytečné inflace.

---

## 5. Barevná paleta (světlý režim)

| Token | Hodnota | Užití |
|---|---|---|
| `--bg` | `#f5f7fa` | pozadí stránky (studená světlá šeď) |
| `--surface` | `#ffffff` | karty, panely, hlavička, pole |
| `--surface-2` | `#eef1f5` | výstupní panel, hover, seznam presetů |
| `--surface-3` | `#e7ecf2` | zvýrazněný povrch (btn active) |
| `--border` | `#dce1e8` | jemné ohraničení |
| `--border-strong` | `#c3ccd8` | ohraničení polí, hover |
| `--text` | `#1f2733` | hlavní text (tmavá uhlová) |
| `--text-secondary` | `#3d4757` | popisky polí |
| `--text-muted` | `#5b6472` | pomocný text, placeholder |
| `--accent` | `#2563d6` | primární akce, focus, odkazy |
| `--accent-hover` | `#1c50bf` | hover/active akcentu |
| `--accent-weak` | `#e8f0fe` | tip callout, badge presetu |
| `--success` | `#0f7a48` | toast „zkopírováno" |
| `--warning` | `#8a5a00` | varování (text-safe) |
| `--error` | `#c23b3b` | chybový toast |

`--on-accent: #ffffff` = text na barevných plochách (tlačítko, přepínač, toast).

---

## 6. Výsledky kontrastní kontroly (runtime, WCAG)

Měřeno na skutečně vyrenderovaných barvách (nikoli jen z hodnot tokenů).

**Světlý režim:**

| Pár | Kontrast | Práh | Výsledek |
|---|---|---|---|
| hlavní text `#1f2733` na `--bg` | **14.01** | 4.5 | ✅ AAA |
| hlavní text na `--surface` | **15.04** | 4.5 | ✅ AAA |
| pomocný `--text-muted` na `--bg` | **5.57** | 4.5 | ✅ AA |
| pomocný `--text-muted` na `--surface` | **5.98** | 4.5 | ✅ AA |
| label `--text-secondary` na `--surface` | **9.39** | 4.5 | ✅ AAA |
| bílý text na primárním tlačítku `#2563d6` | **5.48** | 4.5 | ✅ AA |
| odkaz/akcent `#2563d6` na `--surface` | **5.48** | 4.5 | ✅ AA |
| bílý text na success toast `#0f7a48` | **5.39** | 4.5 | ✅ AA |
| bílý text na error toast `#c23b3b` | **5.27** | 4.5 | ✅ AA |
| focus ring `#2563d6` vs `--bg` | **~4.24** | 3.0 (non-text) | ✅ |

**Tmavý režim (prefers-color-scheme: dark):**

| Pár | Kontrast | Výsledek |
|---|---|---|
| text `#e6eaf0` na `--bg`/`--surface` | 15.31 / 14.02 | ✅ AAA |
| `--text-muted` na povrchu/pozadí | 6.71 / 7.33 | ✅ AA |
| dark text na primárním tlačítku `#5b9bff` | 6.67 | ✅ AA |
| dark text na success/error toast | 7.30 / 5.51 | ✅ AA |
| odkaz `#5b9bff` na povrchu | 6.11 | ✅ AA |

Placeholder používá `--text-muted` (≥ 5.5:1). Disabled stavy nejsou v aplikaci přítomné (žádný prvek není disabled). Vybraný přepínač i focus jsou signalizovány kromě barvy i tvarem/ringem (viz §14).

---

## 7. Typografický systém

- **Bez externího fontu / síťového požadavku.** UI stack: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` — Inter jen jako preferovaný, s garantovaným systémovým fallbackem (nepředpokládá lokální instalaci).
- **Prompt** zachovává monospace charakter přes moderní systémový stack: `ui-monospace, "Cascadia Code", "SFMono-Regular", "Consolas", "Liberation Mono", monospace`.
- **Hierarchie:** h1 20 px/700; podnadpis 0.82 rem/muted; nadpis sekce 0.95 rem/600 (normální velikost písmen, **bez uppercase**); label 0.85 rem/500; checkbox popisek 0.88 rem/500 + pomocný 0.78 rem/400; tlačítka 0.88 rem/500; prompt 0.85 rem mono/1.7; nadpis modalu 1.05 rem/600; toast 0.88 rem/600.
- **Čitelnost:** `body` line-height 1.55; delší texty nejsou drobné; nadpisy výrazné, ne obrovské; žádné uppercase pro dlouhé texty; bez extrémního letter-spacingu.

---

## 8. Změny pozadí a hlavního layoutu

- Tmavé celostránkové pozadí → světlé `--bg`; panely a karty jasně vizuálně odděleny (`--surface` bílá vs `--surface-2` výstupní panel vs `--bg` stránka/formulářový sloupec).
- **Strop šířky:** `.app-container` `max-width:1560px` + `margin-inline:auto` → na širokém monitoru se obsah neroztáhne do pustiny (ověřeno na 1920: app 1560 px, vycentrovaná).
- Zachován původní layout: app shell na výšku viewportu, dvoupanel, vnitřní scroll panelů, breakpoint 920 px. Přidán `100dvh` fallback k `100vh` pro stabilnější mobilní výšku.
- Karty mají jen `--shadow-sm` (žádné těžké stíny); formulářový sloupec působí jako uspořádaný formulář.

---

## 9. Změny formulářových sekcí

- Sekce sjednoceny na **konzistentní bílou kartu** (`--surface`, `--r-lg`, 1px `--border`, `--shadow-sm`).
- Nadpis sekce: gradient + uppercase + neonová modrá → klidný tmavý text 600, normální velikost, jemná spodní linka. Emoji v nadpisu ponecháno jako **drobná tlumená dekorace** (opacity 0.85) — obsah HTML nezměněn.
- Jednotné mezery (`--sp-4`), jemné oddělovače, jasné seskupení. Žádný efekt „karty v kartě", žádné přehnané rámování ani barevné plochy.

---

## 10. Změny polí a tlačítek

**Pole** (text/number/select/textarea/checkbox/toggle):
- Jednotný vzhled: `--surface`, 1px `--border-strong`, `--r-sm`, **min-výška 42 px** (na dotyku 44 px přes `@media (pointer:coarse)`).
- Stavy: běžný / hover (`--text-muted` border) / **focus-visible** (2px `--focus-ring` outline + offset) / focus (border accent + 3px jemný `--focus-shadow` ring). Placeholder v `--text-muted` (kontrast ✅).
- Checkbox `accent-color:var(--accent)`; toggle zachovává přístupnou techniku vizuálně skrytého radia (žádné `display:none`), vybraný stav `--accent` + `--on-accent`.
- Nativní ovládání zachováno.

**Tlačítka:**
- Hierarchie: **primární** (`.btn-primary` — plný accent, `--on-accent` text) pro hlavní akci; **sekundární** (`.btn` — `--surface` + border) pro ostatní. Reset zůstává neutrální sekundární (žádná agresivní červená plocha).
- Jednotná min-výška 40 px (44 px na dotyku), jasný hover/active/focus-visible, `white-space:nowrap` proti ořezu; dlouhé české texty se nezalomí nevhodně. **Texty ani funkce tlačítek nezměněny.**

---

## 11. Změny promptového panelu

Prompt už není tmavý „code editor": pozadí `--surface` (bílé), tmavý text, monospace, 1px `--border`, `--r-md`, `--shadow-sm`, padding `--sp-4`, line-height 1.7, výrazný focus (accent border + `--focus-shadow`). Výstupní panel má jemně tónované pozadí `--surface-2`, aby prompt vizuálně „seděl" jako pracovní výstup a přitom ladil s celou aplikací. Editovatelnost, `readonly`, počítadlo znaků, kopírování a všechny funkce beze změny.

---

## 12. Změny presetů a modalů

- **Presety:** seznam (`.preset-list`/`.preset-item`) na `--surface-2` s jemným ohraničením; badge „vestavěný" v `--accent-weak`/`--accent` jako pill; `overflow-wrap:anywhere` na názvu → **dlouhé i škodlivé názvy nerozbijí layout** (název se stále vykresluje přes `textContent`, viz §18). Funkčnost presetů nezměněna.
- **Modaly (dialogový systém M1B zachován):** overlay `rgba(15,23,42,0.45)` (ne neprůhledná černá stěna), dialog `--surface` s `--shadow-md`, jasně oddělený od pozadí; nadpis/text/vstup/tlačítka/zavírací tlačítko sjednoceny; `max-height` a padding s `dvh` fallbackem → **vejde se do mobilního viewportu** (ověřeno 768: modal 461×428 uvnitř viewportu). Focus trap, návrat focusu, chování kliknutí mimo dialog a re-entrance **nezměněny** (jen CSS).

---

## 13. Responzivní chování (runtime měření)

| Viewport | H-scroll | Layout | Poznámka |
|---|---|---|---|
| 1920×1080 | ✅ ne | 2 panely, app 1560 px vycentrovaná | strop šířky funguje |
| 1440×900 | ✅ ne | 2 panely | vyvážené proporce (form 660 / output zbytek) |
| 1280×800 | ✅ ne | 2 panely | notebook, vše dostupné |
| 1024×768 | ✅ ne | 2 panely (>920) | — |
| 768×1024 | ✅ ne | 1 sloupec (≤920) | panely pod sebe, modal se vejde |
| 390×844 | ✅ ne | 1 sloupec, `form-row`→sloupec | pole plná šířka |
| 360×800 | ✅ ne | 1 sloupec | **0 přetékajících prvků** |

Přidán jemný breakpoint `@media (max-width:560px)` (menší okraje, `form-row` na sloupec, preset select plná šířka) a `@media (pointer:coarse)` (dotykové plochy 44 px). Informační architektura nezměněna. Dlouhé české názvy: `overflow-wrap:anywhere` na názvech presetů, `flex-wrap` na akční liště a preset ovládání.

---

## 14. Reduced motion a přístupnost

- **Reduced motion:** původní `@media (prefers-reduced-motion: reduce)` zachován (přechody/animace prakticky okamžité, stavy viditelné). Přechody jsou krátké (150–200 ms), žádné poskakování ani velké transformace; stav nezávisí na animaci.
- **M1B nezhoršeno (runtime):** dialog otevře → focus dovnitř → Escape zavře → **focus se vrátí na opener** (vše ✅); `role="dialog"`+`aria-modal`+`aria-labelledby`/`aria-describedby` beze změny (HTML nedotčeno); live region `role="status"` polite; **0 kladných `tabindex`**; žádný nový klikatelný neinteraktivní prvek (CSS-only změna).
- **Focus-visible** rozšířen na všechna pole (text/number/select/textarea/checkbox/toggle) — 2px ring + offset, výrazný na světlém pozadí, neořezaný.
- **Kontrast** ✅ AA/AAA (§6). **Dotykové plochy** ≥ 44 px na dotyku.
- **Forced-colors / Windows high contrast:** přidán `@media (forced-colors: active)` — zachovává ohraničení polí/karet/modalů (CanvasText), focus přes `Highlight` a **vybraný přepínač** dostane `Highlight` outline (nespoléhá jen na pozadí, které systém odstraní).
- **Zoom 200 %:** odpovídá ~640 CSS px → reflow přes stack (≤920 px) bez horizontálního scrollu (ověřeno v pásmu 360–768 px).

---

## 15. Vizuální testovací matice

Ověřeno runtime (computed styles, kontrast, měření přetečení a rozměrů). Screenshoty do repozitáře **nepřidány** (dle zadání).

- **Viewporty:** 1920×1080, 1440×900, 1280×800, 1024×768, 768×1024, 390×844, 360×800 — všechny bez H-scrollu (§13).
- **Stavy:** výchozí prázdný formulář (světlá paleta aplikována: `--bg`=#f5f7fa, `body` bg rgb(245,247,250), primary btn #2563d6/bílý text 5.48); plně vyplněný formulář; dlouhé téma a nejdelší stylový název (`metaphor-driven`); dlouhý prompt; otevřený dialog (fit na 768); focus na poli/tlačítku/přepínači (ring viditelný); success i error toast (kontrast ✅); seznam presetů; **škodlivý název presetu** vykreslen jako text bez rozbití layoutu; reduced motion; tmavý režim (kontrast CSS povrchů ✅; nativní `color-scheme` doplněn v M2B2.1).

> Poznámka: náhledový screenshot pipeline v tomto prostředí opakovaně timeoutoval (renderer, ne stránka — konzole čistá, JS a měření fungují), proto je vizuální shoda doložena **kvantitativně** (computed styles + kontrast + měření layoutu/přetečení) místo rastrových snímků.

---

## 16. Znakové porovnání promptů (proti `00a1131`)

Referenční výstupy vygenerovány přes stejné konfigurace na M2B2 verzi a porovnány SHA-256 s baseline `00a1131`.

| # | Scénář | Délka | SHA-256 vs 00a1131 |
|---|---|---|---|
| 1 | minimální | 1410 | ✅ shodné |
| 2 | běžná učitelská | 1613 | ✅ shodné |
| 3 | plně vyplněná (emoji 🌍) | 1717 | ✅ shodné |
| 4 | speaker notes on | 1490 | ✅ shodné |
| 5 | speaker notes off | 1441 | ✅ shodné |
| 6 | vlastní jazyk s whitespace | 1491 | ✅ shodné |
| 7 | nejdelší snippet (`metaphor-driven`) | 1523 | ✅ shodné |
| 8–10 | noir / blueprint / mascot | 1464 / 1470 / 1504 | ✅ shodné |

**0 rozdílů. Všech 46 stylů: `styleFails=0`** (snippet přítomen, bez `undefined`/`null`/prázdné sekce). Očekávané, protože `js/app.js` a `index.html` jsou nedotčené.

---

## 17. Funkční regresní testy (runtime)

| Test | Výsledek |
|---|---|
| 46 stylů → validní prompt | ✅ 46/46 |
| Generování promptu, znaková shoda vs `00a1131` | ✅ 0 rozdílů |
| Round-trip 23/23 (vč. diakritiky + emoji, custom jazyk) | ✅ 23/23 |
| Persistence (save → localStorage → load) | ✅ |
| Selhání `setItem` (Quota) | ✅ `saveState()` = false, bez pádu |
| Poškozený localStorage | ✅ fallback bez pádu |
| Dialogy (open/Escape/focus návrat) | ✅ |
| Live regiony, speaker notes, vlastní jazyk | ✅ beze změny (identický prompt) |
| Konzole | ✅ bez chyb |

---

## 18. Bezpečnostní retesty (M1A)

| Test | Výsledek |
|---|---|
| XSS (`<img onerror>`, `<script>`, `"><svg onload>`, `javascript:`) | ✅ alert nespuštěn, **0 vytvořených DOM uzlů**, jen text |
| Škodlivý název presetu | ✅ vykreslen jako text (`textContent`), layout nerozbit (`overflow-wrap`) |
| Import: `null`, pole, bez `data`, prázdná `data`, jen neznámé klíče | ✅ bezpečný normalizovaný objekt, bez výjimky |
| Prototype pollution (`__proto__` v `data` i vnořeně) | ✅ `({}).polluted === undefined`, `Object.prototype` čistý |
| Poškozený localStorage / selhání zápisu / limit 100 | ✅ ošetřeno (M1A beze změny) |
| Nové externí požadavky | ✅ žádné |

Bezpečnostní logika je v `js/app.js`, který **nebyl dotčen** — M1A je zachováno.

---

## 19. Síťová kontrola

- `GET /index.html` → 200, `GET /styles.css` → 200 (`text/css`), `GET /js/app.js` → 200.
- **Žádná 404, žádné externí požadavky** (jen 3 same-origin soubory), **žádný externí font / CSS / JS**, žádný nový síťový požadavek oproti `00a1131`.
- Konzole bez chyb.

---

## 20. Známá omezení

- **Tmavý režim je zahrnut** (token-based, `prefers-color-scheme`), kontrastně ověřený pro CSS povrchy — automatický, **bez ručního přepínače a bez JS** (dle rozsahu M2B2). Ruční theme toggle je záměrně odložen (kandidát pro pozdější milník). *Oprava (M2B2.1):* nezávislá review zjistila, že v M2B2 chyběla deklarace `color-scheme` (nativní `<select>` popup a spinnery se v tmavém režimu kreslily světle); doplněno v M2B2.1 — viz závěrečná sekce. Formulace „kompletní tmavý režim" z původní verze reportu tedy **neplatila již před opravou**.
- **Screenshoty nebyly přidány** do repozitáře (dle zadání); vizuální shoda je doložena kvantitativně (viz §15), protože náhledový screenshot pipeline v tomto prostředí timeoutoval.
- **Inter** je uveden jako preferovaný font, ale **není bundlován** — spoléhá na systémový fallback (`ui-sans-serif`, `Segoe UI`…). Žádný síťový požadavek. Vzhled je proto na různých OS mírně odlišný (očekávané, přijatelné).
- **Klidová ohraničení polí** byla v M2B2 záměrně jemná (`#c3ccd8`, non-text kontrast ~1,62:1). *Oprava (M2B2.1):* nezávislá review to označila (F3); zaveden token `--border-control` s kontrastem **≥ 3:1** vůči povrchu i okolí (světlý `#7e8b9d`, tmavý `#657286`) pro pole, textarea, selecty, přepínač, obaly checkboxů, sekundární tlačítka, promptový panel i dialogové pole. Focus zůstává výraznější (accent + ring); dekorativní okraje karet zůstávají jemné. Viz závěrečná sekce.
- **Konce řádků** `styles.css` jsou CRLF (autocrlf, jako ostatní soubory) — kosmetické, bez vlivu.
- `@media (pointer:coarse)` zvětšuje dotykové plochy na 44 px na dotykových zařízeních; na desktopu s myší zůstávají kompaktní (`.btn-small` 36 px).

---

## 21. Doporučení pro M2C

- **M2C = režim Jednoduchý / Pokročilý** (blueprint §17): přepínač + rozbalení pokročilých sekcí, kroky jako sekce (`h2`), stav režimu do `localStorage`. Nový vizuální systém tokenů je na to připraven (karty, spacing, focus).
- Zachovat pravidlo M2B: **žádná změna generovaného promptu, dat, 46 stylů, přístupnosti ani bezpečnosti**; malé kontrolovatelné diffy.
- Při M2C hlídat, aby skrytí pokročilých sekcí neměnilo prompt (identický výstup v obou režimech) a aby kroky měly správnou hierarchii nadpisů a `fieldset`/`legend` u skupin.
- Zvážit ruční theme toggle (světlá/tmavá/systém) až s M2C, nad již existujícími tokeny (jen přidat `data-theme` override + drobný JS) — mimo rozsah M2B2.

---

## Post-review opravy M2B2.1

Nezávislá review (`M2B2_VISUAL_SYSTEM_REVIEW.md`, verdikt **PASS WITH MINOR FIXES**) našla tři cílené nedostatky. Ty byly opraveny v kroku **M2B2.1** čistě v `styles.css` (bez zásahu do `index.html`, `js/app.js`, funkčnosti, promptu, HTML struktury, pořadí sekcí, JS stavů, 46 stylů, bezpečnosti ani accessibility logiky). Historii nezamlčujeme: uvedené formulace o „kompletním" tmavém režimu z původní verze reportu **neplatily již před opravou**.

### F1 — doplnění `color-scheme`
- **Zjištění review:** `getComputedStyle(:root).colorScheme === "normal"` → nativní ovládací prvky (rozbalený `<select>`, spinnery `<input type=number>`) se v tmavém režimu kreslily světle.
- **Oprava:** do `:root` doplněno `color-scheme: light;`, do `@media (prefers-color-scheme: dark) :root` doplněno `color-scheme: dark;`. Bez JS, bez ručního přepínače, bez nového HTML, bez síťového požadavku.
- **Nové chování:** ve světlém tématu se nativní prvky (select popup, spinnery, checkbox, radio, scrollbary) kreslí ve světlém schématu; v tmavém tématu v tmavém — sladěné s aplikací.
- **Runtime ověření:** světlý režim → computed `color-scheme: light`; tmavý režim → `color-scheme: dark`; **přepnutí systémového tématu za běhu bez reloadu** aktualizuje `color-scheme` i plochy (ověřeno `matchMedia` + computed hodnoty).

### F3 — kontrast klidových hranic ovládacích prvků
- **Zjištění review:** klidová hranice polí ~**1,62 : 1** vůči povrchu (< 3:1).
- **Oprava:** zaveden samostatný token **`--border-control`** (světlý `#7e8b9d`, tmavý `#657286`) použitý pro: text/number input, textarea, select, přepínač úrovně omezení (a jeho oddělovač), obal checkboxu, sekundární tlačítka, promptový panel a vstupní pole v dialogu. Dekorativní okraje karet/panelů zůstávají jemné (`--border`), scrollbar používá `--border-strong`.
- **Naměřené kontrasty (nezávisle přepočteno na vyrenderovaných barvách):**

| Prvek | Před (světlý) | Po (světlý) | Po (tmavý) |
|---|---|---|---|
| text input / textarea / select / number | 1,62 | **3,46** | **3,47** |
| obal checkboxu | 1,31 | **3,46** | **3,47** |
| přepínač úrovně omezení | 1,62 | **3,46** | **3,47** |
| sekundární tlačítko | 1,62 | **3,46** | **3,47** |
| promptový panel (vnitřní / vnější hrana) | 1,06 | **3,46 / 3,06** | **3,47 / 3,13** |
| dialogové vstupní pole | 1,62 | **3,46** | **3,47** |

- **Stavy:** hover ≥ klid (`--text-muted`, ~5,98:1) — silnější než klidová hranice; **focus-visible** zůstává nejvýraznější (accent border ~5,48:1 + 3px ring); checked/selected přepínač = plocha accentu + `--on-accent` (ne jen jemná barva); `forced-colors` blok zachován. Paleta zůstává klidná (slate `#7e8b9d`, nikoli černé rámečky).

### F2 — úklid nepoužitých tokenů
- Programová inventura potvrdila nulové použití. Odstraněny: `--sp-1`, `--sp-8`, `--sp-12` (spacing škála zredukována na skutečně užívané `--sp-2/3/4/6`) a `--warning` (aplikace nemá varovný stav ani odpovídající styl) — ve světlém i tmavém režimu. Po úpravě znovu ověřeno, že žádný odstraněný token není nikde referencován.

### Výsledky cílených testů M2B2.1
- **Kontrast:** všechny ovládací hranice ≥ 3:1 v obou režimech (viz tabulka); textové kontrasty beze změny (AA/AAA).
- **`color-scheme`:** světlý = `light`, tmavý = `dark`, runtime přepnutí bez reloadu funkční.
- **Prompt/funkce:** 10/10 referenčních promptů SHA-256 **shodných s `00a1131`** (0 rozdílů), 46/46 stylů validních, round-trip 23/23.
- **Bezpečnost:** XSS (0 aktivních elementů, `alertFired=false`), prototype pollution `({}).polluted === undefined`, storage chyby ošetřeny, škodlivý dlouhý název bez přetečení.
- **Accessibility:** dialog open/Escape/návrat focusu, 0 kladných tabindex, skryté radio přepínače stále fokusovatelné, reduced-motion i forced-colors zachovány.
- **Responzivita:** 320–1440 px bez horizontálního scrollu a přetečení; dialog se vejde; kontrastnější hranice nezměnily rozměry ani zalamování.
- **Síť/konzole:** 3× same-origin 200, žádné externí požadavky, konzole bez chyb.

### Vizuální ověření M2B2.1
Rasterové screenshoty **nešlo v tomto prostředí pořídit** (screenshot pipeline náhledového prohlížeče opakovaně timeoutoval — renderer, ne stránka; DOM/JS/měření funkční). Vzhled byl ověřen **alternativní runtime metodou**: čtení `getComputedStyle` reálně vyrenderovaných barev, nezávislý přepočet kontrastů, accessibility tree (DOM renderuje kompletně) a měření geometrie/přetečení. Pixelová shoda tedy není rasterově potvrzena; barvy, kontrasty a rozměry jsou ověřeny kvantitativně.

---

## M2B2.2 — Vynucené světlé téma

**Praktická kontrola Netlify Deploy Preview** (commit `3d1e7d4`) ukázala, že při systémovém `prefers-color-scheme: dark` se aplikace automaticky přepnula do tmavého vzhledu. Přestože byl technicky funkční a kontrastně v pořádku, **tmavý vzhled potlačoval zamýšlený charakter „klidného světlého pracovního listu pro učitele"** a působil jako vývojářský nástroj / terminál. Rozhodnutí: **automatický tmavý režim odstranit** a vynutit světlé učitelské téma bez ohledu na systémové nastavení.

### Co se změnilo (jen `styles.css`)
- **Odstraněn celý blok `@media (prefers-color-scheme: dark)`** (35 řádků: komentářová hlavička + 28 řádků override barevných tokenů a stínů). Šlo o jedinou automatickou tmavou variantu; žádná jiná pravidla nebyla dotčena.
- V `:root` **zůstává `color-scheme: light;`** — nyní jediné a nepřepisované; žádný `color-scheme: dark` ani `light dark` už v souboru není. Nativní prvky (select popup, spinnery, scrollbary) se tak drží světlého schématu i na systému nastaveném na tmavý.
- Aktualizovány komentáře (hlavička souboru + `:root`), aby popisovaly vynucené světlé téma místo adaptivního.
- **Světlý vizuální systém se nezměnil** — paleta, `--border-control`, kontrastní hranice polí (≥ 3:1), focus ring, radius, stíny, typografie, spacing, layout, prompt, modaly i stavové zprávy zůstávají přesně jako v M2B2.1.

### Výsledný stav
- Aplikace používá **stejnou světlou paletu bez ohledu na systémové nastavení**.
- `getComputedStyle(document.documentElement).colorScheme` = **`light`** při systémovém light **i** dark.
- **Ruční theme toggle nebyl přidán** (mimo rozsah). Případný tmavý režim může být v budoucnu zaveden **pouze jako samostatně navržená, volitelná a explicitně řízená funkce** (např. `data-theme` přepínač), nikoli jako automatické přepínání dle systému.

### Výsledky testů (systémové light i dark)
- **Computed styles:** 20 klíčových vizuálních hodnot (html/body/kontejner/karta/input/select/textarea/primární tlačítko/prompt/dialog/overlay/…) **shodných** v obou systémových režimech; jediný rozdíl je `matchMedia('(prefers-color-scheme: dark)')` (stav systému), nikoli vzhled.
- **`color-scheme`:** `light` v obou režimech; **žádné tmavé plochy, žádný tmavý nativní select ani scrollbar, žádné bliknutí do tmavého režimu** (žádná dark media query → nic k přepnutí).
- **Prompt/funkce:** 10/10 referenčních promptů SHA-256 **shodných s `3d1e7d4`** (0 rozdílů), 46/46 stylů validních, round-trip 23/23.
- **Bezpečnost:** XSS 0 aktivních elementů, prototype pollution `({}).polluted === undefined`, storage chyby ošetřeny, škodlivý dlouhý název bez přetečení (delete tlačítko viditelné).
- **Accessibility:** dialog open/Escape/návrat focusu, 0 kladných tabindex, `forced-colors` i `prefers-reduced-motion` bloky **zachovány** (odstranění dark media query se jich nedotklo).
- **Responzivita:** 320–1440 px bez horizontálního scrollu/přetečení i při systémovém dark; dialog se vejde.
- **Síť/konzole:** 3× same-origin 200, žádné externí požadavky, konzole bez chyb.

> Historicky: tmavý režim v M2B2 **existoval** (token-based, přes `prefers-color-scheme`) a byl v M2B2.1 doplněn o `color-scheme` a kontrast; v **M2B2.2** byl automatický tmavý režim záměrně **odstraněn** ve prospěch vynuceného světlého učitelského tématu. Podrobnosti viz `M2B2_2_LIGHT_THEME_REPORT.md`.

---

*Konec reportu M2B2 (+ opravy M2B2.1 a M2B2.2). Změněn pouze `styles.css`; upraven tento report; přidán `M2B2_2_LIGHT_THEME_REPORT.md`. `index.html`, `js/app.js` i review soubor nezměněny. Bez commitu a push. Draft PR #1 zůstal otevřený a nesloučený.*
