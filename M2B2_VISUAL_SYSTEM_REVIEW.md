# M2B2 — Klidný světlý vizuální systém — nezávislá code review

> Nezávislý přezkum milníku **M2B2** na větvi `feat/notebooklm-m2-teacher-redesign` (základ `00a1131`).
> Každé podstatné tvrzení z `M2B2_VISUAL_SYSTEM_REPORT.md` ověřeno přímo v CSS, DOM a runtime — nikoli převzato.
> Bez úprav zdrojů, bez commitu, bez push, bez změny stavu PR #1. Jediný nově vytvořený soubor je tento review.

---

## 1. VERDIKT

### ⚠️ PASS WITH MINOR FIXES

Redesign je **skutečně jen vizuální** a technicky velmi čistý: diff se dotýká pouze `styles.css`, `index.html` a `js/app.js` jsou nedotčené, generovaný prompt je **znak po znaku shodný** s `00a1131` (0 rozdílů, 46/46 stylů validních), M1A i M1B zůstaly plně zachovány, kontrast textu splňuje WCAG AA/AAA v obou režimech a responzivita je bez horizontálního scrollu od 320 do 1920 px. Vizuálně jde o **výrazné zlepšení** oproti tmavému „terminálu".

Nalezeny **drobné, neblokující** nedostatky: chybí deklarace `color-scheme` (nativní ovládací prvky se v tmavém režimu kreslí světle), report mírně přeceňuje „kompletnost" tmavého režimu, a je pár nepoužitých tokenů. Žádný nález úrovně P0/P1. **Commit je bezpečný**; doporučené opravy jsou kosmetické a lze je udělat v tomto commitu nebo v malém navazujícím kroku.

---

## 2. Přesný rozsah diffu

| Položka | Hodnota |
|---|---|
| Větev / HEAD | `feat/notebooklm-m2-teacher-redesign` / `00a1131` |
| Upstream | synchronní (`0 0`) |
| `git diff --stat` | `styles.css | 1592 ++--`, **904 insertions(+), 688 deletions(-)** |
| `git diff --check` | čistý (exit 0) |
| Změněné soubory (tracked) | pouze `styles.css` |
| `index.html` / `js/app.js` | **nezměněny** (`git diff --name-only` prázdný) |
| Untracked | `M2B2_VISUAL_SYSTEM_REPORT.md` (+ tento review) |
| PR #1 | OPEN, isDraft=true, mergedAt=null |

Rozsah odpovídá zadání M2B2. Kompletní přepis `styles.css` (688 → 904 řádků) je pro změnu palety + zavedení token systému + tmavý režim + forced-colors přiměřený a **neobsahuje zbytečnou duplicitu** (viz §6, §23).

---

## 3. Nálezy P0–P3

| ID | Úroveň | Popis | Blokuje? |
|---|---|---|---|
| — | **P0** | žádné | — |
| — | **P1** | žádné | — |
| **F1** | **P2** | **`color-scheme` není deklarováno.** Runtime `getComputedStyle(:root).colorScheme = "normal"`. V tmavém režimu tak prohlížeč kreslí interní nativní chrome — rozbalený seznam `<select>`, spin tlačítka `<input type=number>` — ve **světlém** schématu (bílý popup na tmavé stránce). CSS-stylované povrchy jsou správně; jde o nativní prvky. Report navíc označuje dark mode za „kompletní". **Oprava:** `:root { color-scheme: light; }` + v dark media query `color-scheme: dark;` (nebo `color-scheme: light dark` na `:root`). Neblokuje. | ne |
| **F2** | **P3** | **Nepoužité tokeny:** `--sp-1`, `--sp-8`, `--sp-12` (spacing škála deklarována kompletní, ale krajní hodnoty se nepoužívají) a `--warning` (0 výskytů — aplikace nemá varovný stav). Kosmetický úklid; `--warning` je obhajitelný sémanticky (připraven, kontrastně navržen). | ne |
| **F3** | **P3** | **Klidový non-text kontrast okrajů** polí a sekundárních tlačítek = **1.62:1** vůči povrchu (< 3:1 dle WCAG 1.4.11). Report to přiznává (§20). Zmírněno výrazným focus ringem + `forced-colors` podporou; hranice prvku není jediným nositelem stavu. | ne |
| **F4** | **P3** | **Přesnost reportu:** tvrzení „tmavý režim … kompletní" (§1, §20) je vzhledem k F1 mírně silnější než důkazy. Doporučeno přeformulovat na „kontrastně kompletní pro CSS povrchy; `color-scheme` nativních prvků zatím nedeklarováno". | ne |
| **F5** | **P3 (info)** | **Raster screenshoty nešlo pořídit** — screenshot pipeline náhledového prohlížeče v tomto prostředí opakovaně timeoutoval (renderer, ne stránka; konzole čistá, DOM/JS/měření funkční). Vizuál ověřen **jinou runtime metodou** (computed styles + accessibility tree + geometrie), nikoli pixelovým snímkem. Pixelová shoda tedy **není** rasterově potvrzena; ostatní je ověřeno kvantitativně. | ne |
| **F6** | **P3 (info)** | `--content-max:1560px` ponechává na širokém monitoru promptový panel ~880 px široký. Formulářový sloupec je zastropován na 660 px (čitelnost OK); široký prompt je pro strukturovaný výstup přijatelný. Zvážit strop čitelnosti u promptu později. | ne |

---

## 4. Hodnocení vizuálního směru

**Vizuální verdikt: výrazné zlepšení (s drobnými nedostatky).**

Očima učitele, který appku vidí poprvé (posouzeno z ověřených barev, typografie, hierarchie a struktury; rastr nešlo pořídit — viz F5):

- **Co aplikace dělá** je čitelné z hlavičky (h1 + podnadpis, tmavý text na bílé) — jasnější než původní neonově modrý nadpis s dekorativním `🎯`.
- **Důvěryhodnost/profesionalita:** ano — světlé plochy, tlumená modrá, střídmé stíny, žádný terminál.
- **Klid vs zahlcení:** klidnější (bílé karty, jednotné mezery, žádné gradienty/uppercase). Ale **9 sekcí najednou zůstává** — to je záměrně mimo rozsah M2B2 (řeší M2C). Web tedy působí uspořádaně, ne však „minimálně".
- **Hierarchie** je jasnější než v `00a1131`: nadpisy sekcí normální velikost/váha 600, primární akce (Kopírovat) je jediné plné modré tlačítko, ostatní jsou sekundární.
- **Hlavní vs vedlejší akce** odlišené (primary vs secondary). Reset zůstává neutrální (ne agresivní červená) — vhodné.
- **Skenovatelnost:** karty s jemným ohraničením a `--shadow-sm`, bez efektu „karta v kartě".
- **Není to sterilní bankovní formulář?** Riziko existuje (světlá + jedna modrá je střídmá paleta), ale tip callout v `--accent-weak` a jemné povrchy to drží přívětivé, ne dětinské. Modrý akcent je použit **uměřeně** (primární akce, focus, checked toggle, odkazy/badge) — nezneužívá se pro nesouvisející významy.
- **Promptový panel** je rozpoznatelný jako výstup (mono, bílý povrch, jemně tónovaný panel kolem, počítadlo znaků).

Prostor ke zlepšení (mimo rozsah M2B2, pro M2C+): vizuální odlišení „kroků/priorit", méň sekcí naráz, výraznější oddělení primárního CTA.

---

## 5. Porovnání původního a nového vzhledu

| Aspekt | `00a1131` (před) | M2B2 (po) |
|---|---|---|
| Pozadí stránky | `#0a0e14` (téměř černá) | `#f5f7fa` (světlá studená šeď) |
| Karty | `#1a2028` tmavé | `#ffffff` bílé + `--shadow-sm` |
| Text | `#e8edf4` světlý | `#1f2733` tmavý |
| Akcent | neon `#4dabf7` | tlumená `#2563d6` |
| Nadpis sekce | gradient + UPPERCASE + modrá | tmavý text 600, normální velikost |
| Prompt | tmavý „code editor" | bílý povrch, mono, jako pracovní výstup |
| Overlay modalu | `rgba(0,0,0,0.75)` černá stěna | `rgba(15,23,42,0.45)` |
| Hlavička | gradient + `🎯` | čistá bílá, bez dekorativního emoji |
| Šířka | plná | strop 1560 px, vycentrováno |
| Téma | jen tmavé | světlé výchozí + adaptivní tmavé |

Rasterové vedle-sebe porovnání nešlo pořídit (F5); rozdíly výše jsou doloženy z computed stylů obou verzí (staré `00a1131` servírováno paralelně).

---

## 6. Kontrola selektorů

Programová inventura (HTML třídy/ID × JS třídy × CSS selektory):

| Metric | Hodnota |
|---|---|
| HTML class názvy / ID | 33 / 45 |
| JS přidávané třídy | 11 (`btn`, `btn-primary`, `btn-small`, `is-error`, `modal-overlay`, `preset-item`, `preset-item-actions`, `preset-item-badge`, `preset-item-name`, `show`, `visible`) |
| JS querySelector tokeny | `.modal`, `.modal-close` |
| CSS selektorových bloků (mimo at-rule) | 95 |
| **HTML/JS třídy bez CSS pravidla** | **0** |
| **CSS třídy/ID bez výskytu v HTML/JS (orphan/typo)** | **0** |
| **Chybějící stavové selektory** | **0** (všech 11 JS state-tříd nastylováno) |

- Žádný starý selektor po redesignu, žádný překlep, žádné pravidlo pro stav, který JS nepoužívá.
- **Žádné nebezpečné globální selektory:** stylovány jen `input[type=…]`, `select`, `textarea` (formulářové prvky); **žádný** bare `button`/`div`/`a`/`p`. Tlačítka přes `.btn`.
- **Žádný nový `!important`** (4 výskyty, identické s `00a1131`, všechny v `prefers-reduced-motion`).
- **Žádné skrytí obsahu kvůli vzhledu:** jediný `display:none` je funkční `.custom-language-wrapper` (toggle přes `.visible`, jako dřív).
- **Přístupnostní techniky zachovány beze změny významu:** skryté radio přepínače (`position:absolute;opacity:0`, **ne** `display:none`), `.sr-only` (clip technika), logika modalu (`opacity`+`visibility`, transition jen `opacity`).

---

## 7. Kontrola design tokenů

| Token | Světlý | Tmavý | Užití | Výsledek |
|---|---|---|---|---|
| `--bg` | `#f5f7fa` | `#0f141b` | stránka, form sloupec | ✅ |
| `--surface` | `#ffffff` | `#171d26` | karty, pole, prompt | ✅ |
| `--surface-2` | `#eef1f5` | `#1e2630` | output panel, presety | ✅ |
| `--surface-3` | `#e7ecf2` | `#232c38` | btn active | ✅ 1× |
| `--border` | `#dce1e8` | `#2b3440` | oddělovače | ✅ |
| `--border-strong` | `#c3ccd8` | `#3a4552` | pole, toggle | ✅ |
| `--text` | `#1f2733` | `#e6eaf0` | hlavní text | ✅ |
| `--text-secondary` | `#3d4757` | `#c2cad6` | labely | ✅ |
| `--text-muted` | `#5b6472` | `#9aa4b2` | pomocný, placeholder (ref. i z JS) | ✅ |
| `--accent` | `#2563d6` | `#5b9bff` | primár, focus, checked | ✅ |
| `--accent-hover` | `#1c50bf` | `#79adff` | hover | ✅ |
| `--accent-weak` | `#e8f0fe` | `#1a2740` | tips, badge | ✅ 2× |
| `--on-accent` | `#ffffff` | `#0f141b` | text na barvě | ✅ 5× |
| `--success` | `#0f7a48` | `#35b87c` | toast | ✅ |
| `--error` | `#c23b3b` | `#e06666` | toast is-error | ✅ |
| `--warning` | `#8a5a00` | `#e0a34a` | — | ⚠️ **0× (nepoužit)** |
| `--focus-ring` / `--focus-shadow` | `#2563d6` / rgba | `#7cadff` / rgba | focus | ✅ |
| `--tips-border` | `#a9c6f2` | `#2b3f63` | tips okraj | ✅ |
| `--r-sm/md/lg` | 6/10/14 px | = | konzistentně | ✅ |
| `--shadow-sm/md` | 2 úrovně | = | konzistentně | ✅ |
| `--sp-2/3/4/6` | 8/12/16/24 | = | 8/8/17/4× | ✅ |
| `--sp-1/8/12` | 4/32/48 | = | **0×** | ⚠️ nepoužité |
| `--control-h` / `--content-max` | 42px / 1560px | = | ✅ | ✅ |

- Názvy srozumitelné a konzistentní; tokeny mají jasnou odpovědnost; **žádné natvrdo zadané barvy mimo tokeny** v komponentách (jen `rgba()` pro overlay/stíny/focus-shadow, což je legitimní).
- Akcent není zneužit pro nesouvisející významy.
- **Nedostatek:** `--warning`, `--sp-1`, `--sp-8`, `--sp-12` deklarované, nepoužité (F2). Spacing škála 4/8/12/16/24/32/48 je „kompletní deklarace", reálně se používá 8/12/16/24 — obhajitelný vzor, ale report by neměl tvrdit plné využití škály.

---

## 8. Nezávislé kontrastní výsledky (přepočteno, ne z reportu)

**Světlý režim** (na reálně vyrenderovaných barvách):

| Pár | Kontrast | Práh | Výsledek |
|---|---|---|---|
| hlavní text na povrchu / na `--bg` | 15.04 / 14.01 | 4.5 | ✅ AAA |
| pomocný text `--text-muted` na povrchu | 5.98 | 4.5 | ✅ AA |
| **placeholder** na povrchu | 5.98 | 4.5 | ✅ AA |
| label na povrchu | 9.39 | 4.5 | ✅ AAA |
| **primární tlačítko** (bílá na `#2563d6`) | 5.48 | 4.5 | ✅ AA |
| sekundární tlačítko (text) | 15.04 | 4.5 | ✅ AAA |
| **selected toggle** (bílá na accentu) | 5.48 | 4.5 | ✅ AA |
| úspěch / chyba toast (bílý text) | 5.39 / 5.27 | 4.5 | ✅ AA |
| prompt text na promptu | 15.04 | 4.5 | ✅ AAA |
| focus ring `#2563d6` vs povrch | 5.48 | 3.0 (non-text) | ✅ |
| **okraj pole / sek. tlačítka vs povrch** | **1.62** | 3.0 (non-text) | ⚠️ F3 |

**Tmavý režim** (přepočteno po načtení pod dark):

| Pár | Kontrast | Výsledek |
|---|---|---|
| hlavní text na povrchu / `--bg` | 14.02 / 15.31 | ✅ AAA |
| pomocný text / placeholder na povrchu | 6.71 | ✅ AA |
| label na povrchu | 10.25 | ✅ AAA |
| primární tlačítko (tmavý text na `#5b9bff`) | 6.67 | ✅ AA |
| selected toggle | 6.67 | ✅ AA |
| prompt text | 14.02 | ✅ AAA |
| success toast (tmavý text) | 7.30 | ✅ AA |

- **Textový kontrast** ✅ všude AA/AAA v obou režimech.
- **Non-text hranice:** focus ring ✅ (≥ 3:1); **klidový okraj polí 1.62** (F3) — pod prahem 1.4.11, ale se silným focusem a forced-colors.
- **Disabled:** aplikace nemá disabled prvky (0 `disabled` v HTML) → nerelevantní.
- **Hover/active** (z tokenů): sekundární hover `--surface-2` (text ~13:1 ✅), primární hover `--accent-hover #1c50bf` (bílý text 7.12 ✅), active `--surface-3` ✅.

**Kontrastní tvrzení reportu jsou správná** (nezávisle potvrzena).

---

## 9. Hodnocení světlého režimu

**Připravený.** Paleta odpovídá tokenům; všechny textové kontrasty AA/AAA; pole, tlačítka, toggle, prompt, modal, tips, toasty čitelné; focus výrazný; hierarchie jasná; není přehnaně sterilní (tip callout + jemné povrchy). Světlý režim je hlavním deliverable a je kvalitní.

---

## 10. Samostatné hodnocení tmavého režimu

**Připravený s jednou drobnou opravou (F1) — doporučuji ZACHOVAT, ne odkládat.**

- Všechny důležité tokeny mají tmavou variantu; žádná část nezůstane světlá se světlým textem (ověřeno: body/section/prompt/button/border všechny tmavé po načtení pod dark).
- Promptový panel je `#171d26` (soft slate) — **nepůsobí** jako původní agresivní terminál `#0a0e14`.
- Kontrast ✅ (text 14–15:1, akcent 6.67, toast 7.3); focus ring viditelný; dialog/overlay/live regiony čitelné.
- **Runtime přepnutí systémového tématu se projeví bez reloadu** — ověřeno: přepnutí na dark bez navigace konzistentně aktualizovalo body/section/tlačítko/okraj (token override přes media query je live). (Opačný směr občas ukázal přechodný „smíšený" computed-read — vyhodnoceno jako emulační artefakt automatizace, ne defekt: hodnoty se po repaintu srovnají.)
- **F1 (P2):** chybí `color-scheme` → nativní rozbalený `<select>` a spin tlačítka number inputu se kreslí světle. Neovlivňuje čitelnost hlavního UI (vše CSS-stylované), ale je to viditelná nekonzistence nativního chrome.
- `forced-colors` se s dark mode **nepere** — v `forced-colors: active` OS přebere barvy přes systémové klíče (CanvasText/Highlight) bez ohledu na téma; blok je přítomen a konzistentní.
- Emoji/obrázky nejsou problém (žádné rastry; emoji jen drobná dekorace).

Tmavý režim je token-based, kompaktní (~25 řádků override), kontrastně kvalitní a blueprint jej výslovně chtěl (adaptivní). **Nezvětšuje zbytečně rozsah.** Doporučení: zachovat + přidat `color-scheme`.

---

## 11. Typografie

- **Font stack UI:** `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` — bez `@font-face`, žádný síťový požadavek (ověřeno v síti). Na **Windows** (hlavní uživatel) padne na `Segoe UI`/`system-ui` (Inter není předpokládán instalovaný); na macOS na system-ui/`-apple-system`. ✅
- **Prompt mono:** `ui-monospace, "Cascadia Code", "SFMono-Regular", "Consolas", "Liberation Mono", monospace` — moderní systémový stack; na Windows `Consolas`. ✅
- **Hierarchie/velikosti:** h1 20 px/700, podnadpis 0.82 rem/muted, nadpis sekce 0.95 rem/600 (**bez uppercase** — ověřeno `textTransform:none`), label 0.85/500, prompt 0.85 rem mono/1.7, modal 1.05/600. Line-height body 1.55. Bez extrémního letter-spacingu.
- **Diakritika/emoji/dlouhé texty:** česká diakritika a emoji 🌍🎓 renderují správně (round-trip i prompty OK); dlouhé české názvy presetů se lámou (`overflow-wrap:anywhere`); dlouhé texty tlačítek se zalamují (ověřeno 320 px). Zoom 200 % ≈ 640 CSS px → reflow bez H-scrollu.

---

## 12. Layout a responzivita

Runtime měření (horizontální scroll / přetečení prvků):

| Šířka | H-scroll | Layout | Přetečení |
|---|---|---|---|
| 1920 | ✅ ne | 2 panely, app cap 1560, vycentrováno | 0 |
| 1440 / 1280 / 1024 | ✅ ne | 2 panely | 0 |
| **921** | ✅ ne | 2 panely (form 471 / out 435) | 0 |
| **920 / 919** | ✅ ne | 1 sloupec (breakpoint `max-width:920`) | 0 |
| 768 | ✅ ne | 1 sloupec, modal se vejde | 0 |
| 390 / 360 | ✅ ne | 1 sloupec, form-row→sloupec | 0 |
| **320** (+ dlouhé téma) | ✅ ne | 1 sloupec, tlačítka zalomena | **0** |

- Žádné překrývání, žádné příliš úzké sloupce, rozumné proporce formulář/prompt. Dlouhý prompt, dlouhé téma, nejdelší tlačítko, dlouhý/škodlivý název presetu (§18) i otevřený modal ověřeny bez přetečení.
- **Breakpoint 920/921** čistě přepíná mezi 1 a 2 sloupci.
- `--content-max:1560px` — formulářový sloupec je stropován na 660 px (čitelnost ✅), prompt ~880 px (přijatelné, F6).
- Landscape/virtuální klávesnice řešeny `dvh` fallbackem (`100dvh`, `52dvh`/`48dvh`).

---

## 13. Formulářové prvky

- Jednotný vzhled inputů/textarea/selectů/checkboxů/radia; **min-výška 42 px** (44 px na `pointer:coarse`).
- Stavy: default/hover (`--text-muted` border)/**focus-visible** (2px `--focus-ring` + offset)/focus (accent border + `--focus-shadow`). Placeholder `--text-muted` (kontrast 5.98 ✅).
- Checkbox `accent-color:var(--accent)` (themováno i v dark). Selected toggle = accent plocha + `--on-accent` **plus** focus-visible ring — není jen jemná barva.
- **Autofill/invalid/readonly:** aplikace nepoužívá `disabled` ani `:invalid`; `#generatedPrompt` je `readonly` (styl OK). Autofill Chrome nebylo možné rasterově ověřit (F5) — pole mají explicitní `background:var(--surface)`, což riziko přebarvení autofillem zmírňuje, ne však zcela (WebKit autofill kreslí vlastní žluté pozadí; drobné doporučení viz §24).
- **Nedostatek F1:** nativní šipka selectu a spinnery number inputu v dark bez `color-scheme` = světlé.

---

## 14. Tlačítka

- Hierarchie: **primární** (`.btn-primary`, plný accent, `--on-accent`) skutečně nejvýraznější; **sekundární** (`.btn`, surface+border) nepůsobí jako primární. Reset je neutrální sekundární — **destruktivní akce není dominantní** (žádná červená plocha). ✅
- Jednotná výška (40 px / 44 na dotyku); hover/active/focus-visible viditelné; `white-space:nowrap` proti ořezu, dlouhé české texty se zalamují na úrovni lišty (`flex-wrap`).
- Malé tlačítko (`⚙️ Spravovat`, `.btn-small`) 36 px — na dotyku 44 px. Delete v presetu 60×35, viditelné a nezakryté i u škodlivého názvu (§18).
- Vizuální hierarchie odpovídá skutečné důležitosti akcí (Kopírovat = jediné primární), ne jen třídám.

---

## 15. Promptový panel

- Výstup snadno nalezitelný (pravý panel, `--surface-2` tónovaný rám + bílý povrch textarea), jasně oddělený od formuláře.
- Mono čitelné, kontrast 15.04:1 (light) / 14.02:1 (dark); scroll funguje (`resize:none`, `flex:1`); focus výrazný.
- Světlé pozadí nezhoršuje orientaci; kopírovací akce zůstává výrazné primární tlačítko v action baru.
- Dark prompt `#171d26` **nepůsobí** jako návrat ke starému terminálu.

---

## 16. Modaly a overlay

- Overlay `rgba(15,23,42,0.45)` (ne neprůhledná černá); dialog `--surface` + `--shadow-md`, jasně oddělený; nadpis/text/vstup/tlačítka/zavírací tlačítko sjednoceny; kontrast ✅ v obou režimech.
- **Vejde se na mobil** (768: 461×428 uvnitř viewportu; `padding` na overlay + `max-height` s `dvh`); scroll uvnitř `.modal-body`.
- **Funkčně (M1B) beze změny:** otevření → focus dovnitř → focus trap → Escape zavře → **návrat focusu na opener** (vše ✅ runtime); klik mimo dialog a re-entrance nezměněny (jen CSS).
- Reduced motion (transition-duration ~0) a forced-colors bloky přítomné.

---

## 17. Stavové zprávy

- Toast (`.copy-feedback`) rozlišuje success (`--success`) a **chybu** (`.is-error` → `--error`); text `--on-accent`; kontrast 5.27–7.30:1.
- **Význam není nesen jen barvou** — toast obsahuje textovou zprávu (nastavovanou `showStatus`), sémantika `role="status"` + `aria-live` zachována; `.is-error` navíc.
- Zpráva je `position:fixed` vpravo dole, `max-width:min(92vw,420px)` → vejde se na mobil, nepřekrývá kritický obsah. Dark varianta kompletní.

---

## 18. Accessibility testy (M1B retest)

| Kontrola | Výsledek |
|---|---|
| role=dialog / aria-modal (2 dialogy) | ✅ 2 / 2 |
| aria-labelledby / aria-describedby | ✅ (HTML nedotčeno) |
| live region (aria-live) | ✅ 1 |
| Tab/Escape/focus trap/návrat focusu | ✅ (open→focus in→Esc→návrat na opener) |
| focus-visible na polích i tlačítkách | ✅ 2px ring + offset |
| **0 kladných tabindex** | ✅ |
| žádný klikatelný neinteraktivní prvek | ✅ (jen CSS změna) |
| reduced motion | ✅ blok zachován |
| forced-colors | ✅ přidán (ohraničení + Highlight focus + checked toggle outline) |
| dotykové plochy | ✅ 44 px na `pointer:coarse` |
| kontrast focus indikátoru | ✅ ≥ 3:1 |
| zoom 200 % | ✅ reflow bez H-scrollu |

M1B **plně zachováno**. Skryté radio přepínače zůstávají fokusovatelné (technika beze změny).

---

## 19. Funkční a promptová regrese

| Test | Výsledek |
|---|---|
| 10 referenčních promptů vs `00a1131` (SHA-256) | ✅ **0 rozdílů** |
| 46 stylů | ✅ `styleFails=0` |
| Round-trip 23/23 (diakritika + emoji + custom jazyk) | ✅ 23/23 |
| Generování / speaker notes / vlastní jazyk | ✅ (identické prompty) |
| Persistence / storage error / poškozený localStorage | ✅ ošetřeno |
| Dialogy (open/Esc/focus) | ✅ |
| Konzole | ✅ bez chyb |

**Žádná funkční změna, žádná změna promptu.** (Očekávané — `js/app.js` a `index.html` nedotčené.)

---

## 20. Bezpečnostní retesty (M1A)

| Test | Výsledek |
|---|---|
| XSS (`<img onerror>`, `<script>`, `"><svg>`, `javascript:`) | ✅ alert nespuštěn, **0 vytvořených aktivních elementů**, jen text |
| **Škodlivý + dlouhý (300+) název presetu** | ✅ render v `<span>`/textContent, **0 aktivních elementů**, položka uvnitř modalu (429≤461), **delete tlačítko viditelné a nezakryté** |
| Import (`null`, pole, bez `data`, prázdná, neznámé klíče) | ✅ bezpečný objekt bez výjimky |
| Prototype pollution (`__proto__` v `data`, vnořeně, přes JSON.parse) | ✅ `({}).polluted === undefined`, `Object.prototype` čistý |
| Poškozený localStorage / selhání `setItem` / limit 100 | ✅ ošetřeno |
| Nové externí požadavky | ✅ žádné |

M1A **zachováno** (logika v nedotčeném `js/app.js`); nový layout dlouhý škodlivý text bezpečně zalomí a **nepřekryje destruktivní tlačítka**.

---

## 21. Síťová kontrola

- `index.html` / `styles.css` / `js/app.js` → **200**; `styles.css` MIME `text/css`.
- **Žádná 404, žádné externí fonty/CSS/JS, žádný nový požadavek** oproti `00a1131` (jen 3 same-origin soubory).
- Konzole bez chyb.

---

## 22. Hodnocení reportu `M2B2_VISUAL_SYSTEM_REPORT.md`

| Tvrzení | Ověření |
|---|---|
| Paleta = skutečné tokeny | ✅ přesně |
| Kontrastní hodnoty (14.01, 15.04, 5.98, 9.39, 5.48, 5.39, 5.27 …) | ✅ nezávisle potvrzeno |
| Počet změn +904/−688 | ✅ přesně |
| Absence screenshotové validace přiznána (§15, §20) | ✅ pravdivě |
| Prompty 0 rozdílů / 46 stylů / M1A / M1B | ✅ potvrzeno |
| Síť bez externích požadavků | ✅ |
| Klidové okraje polí < 3:1 přiznáno (§20) | ✅ |
| **„tmavý režim … kompletní"** (§1, §20) | ⚠️ **mírně přehnané** — chybí `color-scheme` (F1/F4); přesnější: „kontrastně kompletní pro CSS povrchy" |
| Využití spacing škály | ⚠️ `--sp-1/8/12`, `--warning` nepoužité (F2) |

Report je celkově **pravdivý a nepřehání** vizuální jistotu (screenshoty korektně označeny jako nepořízené). Jediné přeceněné je slovo „kompletní" u tmavého režimu (F4) a implicitní plné využití tokenů (F2). Známá omezení jsou jinak dostatečná.

---

## 23. Hodnocení velikosti a kvality CSS diffu

- **+904/−688 odpovídá** změně: nová paleta na každém pravidle + token systém + adaptivní tmavý režim (~25 řádků) + `forced-colors` blok + jemné breakpointy (560 px, `pointer:coarse`). **Bez zbytečné duplicity.**
- **Skutečně mechanicko-vizuální:** žádný nesouvisející refactoring logiky, žádné dotčení HTML/JS, žádné nové globální selektory, žádný nový `!important`.
- Přechod z 8-space odsazení (inline reziduum) na standardní CSS formátování zlepšuje čitelnost externího souboru — legitimní pro samostatný stylesheet.
- Náhrada `color-mix()` za `--focus-shadow`/`--tips-border` tokeny zvyšuje kompatibilitu — dobré rozhodnutí.

---

## 24. Přesná doporučení oprav

**Doporučené (neblokující):**
1. **F1 — přidat `color-scheme`** do `styles.css`: `:root { color-scheme: light; }` a v `@media (prefers-color-scheme: dark) :root { color-scheme: dark; }` (nebo `color-scheme: light dark;` na `:root`). Sjednotí nativní `<select>` popup a number spinnery s tmavým režimem.
2. **F4 — report:** přeformulovat „kompletní tmavý režim" na „kontrastně kompletní pro CSS povrchy; `color-scheme` nativních prvků doplnit".
3. **F2 — úklid tokenů:** odstranit nepoužité `--sp-1`, `--sp-8`, `--sp-12` nebo je vědomě ponechat jako škálu; `--warning` ponechat (připraven pro budoucí varovné stavy).

**Volitelné (P3, později):**
4. **F3** — zvážit mírně silnější klidový okraj polí (např. accent-tinted focus už je OK); nebo ponechat s odůvodněním (focus + forced-colors).
5. WebKit **autofill**: doplnit `input:-webkit-autofill { -webkit-text-fill-color: var(--text); box-shadow: 0 0 0 1000px var(--surface) inset; }` pro zachování palety při autofillu (nebylo rasterově ověřeno).
6. **F6** — zvážit strop čitelnosti promptu na ultra-wide.

---

## 25. Doporučení ohledně commitu

✅ **Je bezpečné vytvořit commit.** Změna je čistě vizuální, ověřená v CSS/DOM/runtime; M1A i M1B zachovány, prompty znak po znaku shodné (0 rozdílů), kontrast AA/AAA, responzivita bez přetečení 320–1920, síť čistá. Nálezy jsou **neblokující** (P2/P3, kosmetické). Doporučuji před (nebo těsně po) commitu přidat jednořádkové `color-scheme` (F1) a upravit formulaci reportu o tmavém režimu (F4); ani jedno není podmínkou commitu. Samotný commit/push/změnu PR ponechávám na uživateli.

---

## Souhrn

- **Provedené kontroly/aserce:** > 90 (baseline, inventura selektorů, rizikové vzory, kontrast světlý+tmavý ~25 párů, tokeny, prompt regrese 10+46, funkční, a11y, bezpečnost vč. škodlivého názvu, síť, responzivita 8 šířek).
- **Selhání:** 0 funkčních; nalezeny 1× P2 + 5× P3 (kosmetické/informační).
- **Nepoužité/problematické selektory:** **0 orphan/typo selektorů**; nepoužité **tokeny**: 4 (`--sp-1`, `--sp-8`, `--sp-12`, `--warning`).

*Konec nezávislé review M2B2. Vytvořen pouze tento soubor `M2B2_VISUAL_SYSTEM_REVIEW.md`. Zdroje (`styles.css`, `index.html`, `js/app.js`), report M2B2 ani předchozí reporty nebyly upraveny. Bez commitu a push. Draft PR #1 zůstal otevřený a nesloučený.*
