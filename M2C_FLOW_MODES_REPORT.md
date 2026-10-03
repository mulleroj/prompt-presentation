# M2C — Čtyřkrokový tok a režimy Jednoduchý / Pokročilý — report

> Milník **M2C** na větvi `feat/notebooklm-m2-teacher-redesign` (základ `fccd732`).
> Přeuspořádání dlouhého formuláře do hybridního jednostránkového toku o 4 krocích + režimy **Jednoduchý / Pokročilý**. Bez commitu a push.
> Změněny pouze `index.html`, `styles.css`, `js/app.js`; přidán tento report. Žádná změna promptu, `FIELD_SCHEMA`, `DEFAULT_STATE`, storage klíčů, formátu presetů/exportu, 23 polí, 46 stylů ani snippetů.

---

## 1. Manažerské shrnutí

Světlé téma z M2B2.2 bylo schváleno, proto M2C **neřeší vzhled**, ale hlavní zbývající problém: **dlouhý formulář s 9 sekcemi a 23 poli zobrazenými najednou**. Aplikace byla přeuspořádána do **4 kroků** (Obsah → Publikum a účel → Vzhled → Výsledek) a doplněna o **režim zobrazení Jednoduchý / Pokročilý**. Jednoduchý ukazuje 10 nejčastějších voleb, Pokročilý zpřístupní všech 23 polí.

Jde o **hybridní jednostránkový tok**, ne uzamčeného průvodce: všechny kroky jsou na jedné stránce, uživatel může kdykoli přejít na kterýkoli krok, není povinné pořadí ani validační blokace, prompt se aktualizuje živě. Skrytá pole **zůstávají v DOM se svými hodnotami** a promptová logika je nadále používá; skryjí se skutečným atributem `hidden` (mimo tab order i a11y strom). V Jednoduchém režimu upozorňuje neblokující hláška, pokud jsou aktivní skryté pokročilé hodnoty.

Implementace je **čistě UI vrstva** nad stávajícím stavem: `js/app.js` má **166 přidaných řádků a 0 odebraných** (žádná existující logika, prompt, schéma ani data nezměněny). Runtime ověření: **10/10 referenčních promptů SHA-256 shodných s `fccd732`** (0 rozdílů), **stejná konfigurace generuje identický prompt v Jednoduchém i Pokročilém režimu**, 46/46 stylů validních, round-trip 23/23, M1A i M1B zachovány, responzivita 320–1920 px bez přetečení, žádné externí požadavky, konzole bez chyb.

---

## 2. Výchozí problém dlouhého formuláře

Ověřeno z kódu `fccd732`: formulář = **9 sekcí, 23 polí, vše viditelné najednou** (Nastavení výstupu, Hlavní obsah, Pravidla pro slidy, Vizuální styl, Atmosféra, Vizuální konzistence, Vizuální omezení, Tematický balíček, Pravidla terminologie). Učitel bez znalosti prompt-engineeringu nemá vedení „co dělat první" a je zahlcen desítkami ovládacích prvků. Audit i blueprint (§3, §5) to označily jako hlavní UX problém.

---

## 3. Nová čtyřkroková architektura

| Krok | Název | Obsah |
|---|---|---|
| 1 | **Obsah** | Co se generuje, formát, jazyk, délka, strukturální volby |
| 2 | **Publikum a účel** | Pro koho, úroveň znalostí, účel, tón, poznámky řečníka |
| 3 | **Vzhled** | Výběr z 46 stylů + vizuální a layoutové instrukce |
| 4 | **Výsledek** | Živě generovaný prompt, počet znaků, kopírování |

- **Desktop:** kroky 1–3 v levém pracovním sloupci (`form-panel`), krok 4 jako pravý výsledkový panel (`output-panel`).
- **Mobil (≤ 920 px):** kroky pod sebou v pořadí 1 → 2 → 3 → 4; **výsledek je až za krokem 3** (ověřeno: `output-panel.top ≥ form-panel.top`).
- Krok 4 se aktualizuje živě a **nevyžaduje tlačítko „Další" ani dokončení předchozích kroků**.
- V M2C zachován současný `<select>` se 46 styly (bez galerie/filtru/hledání/doporučení — to je M2D/M2E).

---

## 4. Inventura všech 23 polí

Podle skutečného `FIELD_SCHEMA` v `fccd732` (typy/výchozí hodnoty nezměněny).

| # | Klíč | Label (CZ) | Typ | Default | Krok | Režim |
|---|---|---|---|---|---|---|
| 1 | `topic` | Téma / Název | text | "" | 1 | Jednoduchý |
| 2 | `deckFormat` | Formát prezentace | enum (select) | Presenter Deck | 1 | Jednoduchý |
| 3 | `deckLength` | Délka prezentace | enum (select) | default | 1 | Jednoduchý |
| 4 | `outputLanguage` | Jazyk výstupu | enum (select) | Czech | 1 | Jednoduchý |
| 5 | `customLanguage` | Vlastní jazyk | text (podmíněné) | "" | 1 | Jednoduchý* |
| 6 | `numSlides` | Počet slidů | number 3–60 | 10 | 1 | Pokročilý |
| 7 | `exactSlides` | Generovat přesně N slidů | checkbox | true | 1 | Pokročilý |
| 8 | `oneIdea` | Jedna myšlenka na slide | checkbox | true | 1 | Pokročilý |
| 9 | `bulletsPerSlide` | Počet odrážek na slide | number 2–8 | 4 | 1 | Pokročilý |
| 10 | `targetAudience` | Cílová skupina | text | "" | 2 | Jednoduchý |
| 11 | `knowledgeLevel` | Úroveň znalostí | enum (select) | intermediate | 2 | Jednoduchý |
| 12 | `primaryGoal` | Hlavní cíl prezentace | text | "" | 2 | Jednoduchý |
| 13 | `speakerNotes` | Poznámky pro přednášejícího | checkbox | true | 2 | Jednoduchý |
| 14 | `atmosphere` | Atmosféra / tón | enum (select) | friendly | 2 | Pokročilý |
| 15 | `noInventedFacts` | Žádné vymyšlené fakty | checkbox | true | 2 | Pokročilý |
| 16 | `themePack` | Tematický balíček | enum (select) | education | 2 | Pokročilý |
| 17 | `illustrationPreset` | Styl ilustrací (46) | enum (select) | 3d-cut-paper | 3 | Jednoduchý |
| 18 | `noScreenshots` | Žádné screenshoty / UI | checkbox | true | 3 | Pokročilý |
| 19 | `visualConsistency` | Uzamknout vizuální konzistenci | checkbox | true | 3 | Pokročilý |
| 20 | `visualConstraints` | Vizuální omezení | textarea | „No screenshots…" | 3 | Pokročilý |
| 21 | `constraintLevel` | Úroveň omezení | radio (normal/strict) | normal | 3 | Pokročilý |
| 22 | `geminiNaming` | Používat jen „Gemini" | checkbox | true | 3 | Pokročilý |
| 23 | `additionalTerminology` | Další pravidla terminologie | textarea | "" | 3 | Pokročilý |

\* `customLanguage` je Jednoduchý, ale zobrazuje se jen když je jazyk „Vlastní…" (stávající chování).

---

## 5. Zařazení polí do kroků

| Krok | Počet polí | Pole |
|---|---|---|
| **1 — Obsah** | 9 | topic, deckFormat, deckLength, outputLanguage, customLanguage, numSlides, exactSlides, oneIdea, bulletsPerSlide |
| **2 — Publikum a účel** | 7 | targetAudience, knowledgeLevel, primaryGoal, speakerNotes, atmosphere, noInventedFacts, themePack |
| **3 — Vzhled** | 7 | illustrationPreset, noScreenshots, visualConsistency, visualConstraints, constraintLevel, geminiNaming, additionalTerminology |
| **4 — Výsledek** | 0 | (živý prompt, počet znaků, kopírování) |

Součet: 9 + 7 + 7 = **23**.

---

## 6. Jednoduchý versus Pokročilý

| Režim | Počet polí | Pole |
|---|---|---|
| **Viditelné v obou** (Jednoduchý = základ) | **10** | topic, deckFormat, deckLength, outputLanguage, customLanguage, targetAudience, knowledgeLevel, primaryGoal, speakerNotes, illustrationPreset |
| **Pouze Pokročilý** | **13** | numSlides, exactSlides, oneIdea, bulletsPerSlide, atmosphere, noInventedFacts, themePack, noScreenshots, visualConsistency, visualConstraints, constraintLevel, geminiNaming, additionalTerminology |

10 + 13 = **23**. Přepínač `viewMode` je **pouze zobrazení** — není v `FIELD_SCHEMA`, promptu, exportu ani presetu, a v M2C nemá vlastní localStorage klíč.

---

## 7. Zdůvodnění jednoduché sady

Jednoduchý režim pokrývá **běžný učitelský scénář „vytvořit prezentaci"**: co (téma), jak (formát, délka, jazyk), pro koho (cílová skupina, úroveň), proč (cíl), jak vypadá (styl) a zda s poznámkami řečníka. To je 10 rozhodnutí — dost pro plnohodnotný výstup s bezpečnými výchozími hodnotami, bez zahlcení. Do Pokročilého patří přesné číselné limity (počet slidů, odrážek), strukturální volby (přesně N slidů, jedna myšlenka), jemné vizuální a obsahové instrukce (omezení, úroveň omezení, konzistence, screenshoty), méně časté framing/tón (atmosféra, tematický balíček) a rozšiřující terminologie. Kritériem není počet, ale jednoduchost běžného scénáře — výchozí hodnoty pokročilých polí produkují rozumný prompt i bez zásahu.

---

## 8. Implementace navigace kroků

- Sémantický `<nav aria-label="Kroky vytvoření promptu">` s `<ol>` a 4 nativními `<button>` — číslo (`.step-nav-num`, `aria-hidden`) + český název.
- Klik → `goToStep(id)`: nastaví `aria-current="step"` na tlačítko, `scrollIntoView` (respektuje reduced-motion), **focus na sekci kroku** (`tabindex="-1"`, `aria-labelledby` na nadpis kroku). Žádný reload, žádná ztráta hodnot.
- Aktivní krok značen `aria-current="step"` **a** vizuálně (barva + kroužek čísla) — ne jen barvou.
- **Žádný falešný ukazatel dokončení ani procenta** (formulář nemá povinné dokončování).
- Každý krok má viditelné číslo (`.step-badge`), český nadpis `<h2>`, krátkou pomocnou větu (`.step-hint`) a jednoznačné ID (`step1`–`step4`). Dekorativní emoji sekcí nahrazeny číselnými značkami (čistě HTML/CSS, žádné obrázky/SVG).

---

## 9. Implementace režimového přepínače

- `<div class="mode-switch" role="radiogroup">` se **dvěma nativními radio** (`viewMode`: `simple`/`advanced`), popisky „Jednoduchý" / „Pokročilý", pod nimi krátká nápověda (`#modeHint`).
- Výchozí **Jednoduchý** (checked v HTML). Šipky přepínají nativně (radiogroup), mezerník vybírá, focus-visible viditelný.
- `change` → `setViewMode(mode)`: aplikuje viditelnost, aktualizuje nápovědu, přepočítá upozornění, **oznámí změnu přes polite live region** (`#modeAnnounce`).
- Změna režimu **nemění žádné pole ani prompt** (ověřeno) a **neresetuje hodnoty**.

---

## 10. Chování skrytých hodnot

- Pokročilá pole jsou seskupena v `<div class="advanced-block" data-advanced hidden>` uvnitř každého kroku.
- V Jednoduchém režimu se blok skryje **skutečným atributem `hidden`** + CSS `.advanced-block[hidden]{display:none}` (aby `display:flex` bloku nepřebilo UA pravidlo) → pole **nejsou renderována, nejsou v tab orderu ani v accessibility stromu** (ověřeno: 0 pokročilých polí renderováno v Simple, potvrzeno i přes accessibility tree).
- Hodnoty skrytých polí **zůstávají v DOM beze změny**; `getFormState`/`generatePrompt` je čtou dál podle ID → **prompt je identický bez ohledu na režim**.
- Při přepnutí na Pokročilý: zobrazí se všech 23 polí s původními hodnotami, obnoví se pořadí focusu, změna oznámena live regionem.
- **Focus management:** pokud je focus uvnitř bloku, který se má skrýt, `setViewMode('simple')` nejprve přesune focus na přepínač režimu a teprve pak skryje (ověřeno).

---

## 11. Detekce aktivních pokročilých nastavení

- `isAdvancedFieldActive(id)` porovná aktuální hodnotu s `DEFAULT_STATE[id]` (checkbox/number/text; `constraintLevel` přes vybrané radio).
- `activeAdvancedFields()` vrátí seznam, `updateAdvNotice()` v Jednoduchém režimu zobrazí neblokující hlášku `Pokročilá nastavení jsou aktivní (N).` s akcí **„Zobrazit pokročilá nastavení"**.
- Akce přepne na Pokročilý a přesune focus na **první aktivní pokročilé pole** (ověřeno: klik → režim advanced, focus na `numSlides`).
- Upozornění: **není chyba**, používá klidné akcentní pozadí (ne agresivní červenou), je čitelné a přístupné (`role="status"`), **aktualizuje se při každé změně hodnot** (napojeno na `generatePrompt`) a **zmizí, když jsou všechna pokročilá pole ve výchozím stavu** (ověřeno 0 → skryto, 1 → „(1)", 2 → „(2)", 12 → „(12)").

---

## 12. Chování při presetu, importu a resetu

- **Preset load:** naplní všech 23 polí včetně skrytých (ověřeno: topic, numSlides=25, constraintLevel=strict načteny); **zůstane aktuální (Jednoduchý) režim a zobrazí se upozornění** s počtem aktivních pokročilých hodnot (méně překvapivá varianta dle zadání). Přepnutím na Pokročilý se načtené skryté hodnoty ukážou.
- **Import:** funguje bez ohledu na režim (validace/normalizace z M1A beze změny); po importu se přepočítá upozornění.
- **Reset:** po resetu se přepočítá počet aktivních pokročilých polí (upozornění zmizí), přepínač režimu zůstává funkční.
- Export obsahuje **stejné datové hodnoty jako před M2C**; režim se **neexportuje ani neukládá do presetů**. Škodlivý název presetu zůstává vykreslen jen jako text (`textContent`). Preset select + „Spravovat" zůstaly v hlavičce beze změny významu.

---

## 13. Desktopové uspořádání

- Pod hlavičkou nový `.flow-toolbar`: vlevo navigace kroků (vodorovná), vpravo přepínač režimu; pod ním řádek nápovědy režimu.
- `main` zůstává dvoupanelový: vlevo `form-panel` (kroky 1–3, vlastní scroll), vpravo `output-panel` = krok 4. Výsledek nepřekrývá navigaci ani hlavičku, dlouhý prompt se scrolluje, počet znaků a kopírování dostupné, focus na promptu viditelný. Strop šířky 1560 px zachován.

---

## 14. Mobilní uspořádání

- `.flow-toolbar` se zalamuje: navigace kroků přes celou šířku (`flex-basis:100%`), přepínač pod ní; menší okraje na ≤ 560 px.
- Navigace kroků se **zalamuje** (flex-wrap) — názvy se neořezávají (ověřeno na 320 px: nav 2–3 řádky, 0 přetečení).
- Pořadí 1 → 2 → 3 → 4; **krok 4 (výsledek) až za krokem 3** (form-panel nad output-panel). Panely nejsou sticky přes celou obrazovku. Prompt bez horizontálního scrollu.

---

## 15. Accessibility výsledky (M1B + nové prvky)

| Kontrola | Výsledek |
|---|---|
| Hierarchie nadpisů | ✅ 1× `h1` → 4× `h2` (Obsah, Publikum a účel, Vzhled, Výsledek) |
| Navigace kroků: `nav` + `aria-label`, nativní buttony, `aria-current="step"` | ✅ |
| Focus po aktivaci kroku (na sekci s `aria-labelledby`) | ✅ |
| Přepínač režimu: `role="radiogroup"` + 2 nativní radio, šipky/mezerník, focus-visible | ✅ |
| Live region oznámení změny režimu (polite) | ✅ „Zobrazena všechna nastavení…" / „Zobrazeny jen základní volby…" |
| Skrytá pokročilá pole: `hidden`, mimo tab order i a11y strom | ✅ 0 pokročilých polí renderováno v Simple |
| Bezpečné přemístění focusu při skrytí | ✅ (focus → přepínač) |
| Upozornění na aktivní hodnoty přístupné (`role="status"`) | ✅ |
| Dialogy M1B: open/Escape/focus trap/návrat focusu, ARIA | ✅ |
| Žádné kladné `tabindex`, žádný klikatelný neinteraktivní prvek | ✅ 0 |
| reduced-motion, forced-colors (rozšířeno o nav/režim) | ✅ zachováno/rozšířeno |
| 200 % zoom | ✅ reflow bez H-scrollu |

---

## 16. Referenční promptové porovnání (proti `fccd732`)

| # | Scénář | SHA-256 vs fccd732 |
|---|---|---|
| 1 | minimální | ✅ shodné |
| 2 | běžná učitelská | ✅ shodné |
| 3 | plně vyplněná (emoji) | ✅ shodné |
| 4 | speaker notes on | ✅ shodné |
| 5 | speaker notes off | ✅ shodné |
| 6 | vlastní jazyk s whitespace | ✅ shodné |
| 7 | nejdelší snippet | ✅ shodné |
| 8–10 | noir / blueprint / mascot | ✅ shodné |
| 9′ | stav s aktivními skrytými pokročilými hodnotami (Simple) | ✅ shodné jako 10′ |
| 10′ | stejný stav po přepnutí do Pokročilého | ✅ **identický s 9′** |

**0 rozdílů.** Skrytí pole nemění jeho hodnotu ani prompt; Jednoduchý a Pokročilý režim při stejných hodnotách generují **totožný prompt** (SHA-256 shodné).

---

## 17. Výsledky všech 46 stylů

Programově ověřeno: **46/46 `styleFails = 0`** — každý styl produkuje validní prompt (snippet přítomen, bez `undefined`/`null`/prázdné sekce), pořadí sekcí stabilní. Žádný z 46 stylů nebyl odstraněn ani změněn.

---

## 18. Funkční regresní testy

| Test | Výsledek |
|---|---|
| Kroky 1–4: klik, focus, `aria-current`, žádný reload, zachování hodnot | ✅ |
| Režim: výchozí Jednoduchý, přepnutí na Pokročilý a zpět | ✅ |
| Pokročilý: všech 23 polí; Jednoduchý: 10 polí (13 skrytých) | ✅ |
| Hodnoty pokročilých polí se neztrácejí; skrytá pole mimo tab order | ✅ |
| Změna režimu nemění prompt | ✅ |
| Upozornění: 0 → skryto, 1, 2, 12 → správný počet; reset/preset → přepočet | ✅ |
| Generování / kopírování / počet znaků | ✅ |
| Preset save/load (23/23 vč. skrytých) / správa | ✅ |
| Round-trip 23/23, persistence, storage error chování | ✅ |
| Vlastní jazyk, speaker notes, dialogy | ✅ |

---

## 19. Bezpečnostní retesty (M1A)

| Test | Výsledek |
|---|---|
| XSS v poli (`<img onerror>`, `<script>`) | ✅ alert nespuštěn, **0 vytvořených elementů** |
| Dlouhý škodlivý název presetu | ✅ jako text (`textContent`), bez přetečení |
| Neplatný import / neznámé klíče | ✅ bezpečné |
| Prototype pollution | ✅ `({}).polluted === undefined` |
| Poškozený localStorage / výjimka `setItem` | ✅ ošetřeno (`saveState` false, fallback) |
| Nové navigační názvy / režimové zprávy / počty | ✅ přes `textContent`, **žádný `innerHTML`** |

Nová M2C logika nepoužívá `innerHTML` — vše přes `textContent`/atributy.

---

## 20. Síťová kontrola

- `index.html` / `styles.css` / `js/app.js` → **200**; žádná 404.
- **Žádné externí fonty, CSS ani JS**, žádný nový síťový požadavek; konzole bez chyb.

---

## 21. Známá omezení

- **Režim se nepersistuje** (bez localStorage klíče v M2C, dle zadání) — po reloadu se vždy začíná v Jednoduchém. Případné zapamatování režimu je kandidát pro pozdější milník.
- **Krok „současný" se určuje kliknutím** (a výchozím krokem 1), ne scroll-spy — hybridní tok nemá povinné pořadí, takže `aria-current` sleduje poslední navštívený krok.
- Rasterové screenshoty **nešlo v tomto prostředí pořídit** (screenshot pipeline náhledového prohlížeče timeoutoval); vzhled a struktura ověřeny kvantitativně (computed styles, geometrie, **accessibility tree**).
- Během vývoje odhalen a opraven bug: `.advanced-block{display:flex}` původně přebíjelo `[hidden]`; doplněno `.advanced-block[hidden]{display:none}` — pole se nyní skutečně skryjí (potvrzeno a11y stromem).

---

## 22. Doporučení pro M2D

- **M2D = galerie stylů** (blueprint §6–7): nahradit `<select>` v kroku 3 kartami stylů s 8 kategoriemi, filtrem a hledáním (`radiogroup` karet), nad novým `data/styles.js`. Zachovat 46 id a identické snippety → prompt beze změny.
- Zachovat pravidlo M2: **žádná změna promptu, dat, 46 stylů, přístupnosti ani bezpečnosti**; malé kontrolovatelné diffy.
- Zvážit zapamatování režimu (Jednoduchý/Pokročilý) do samostatného localStorage klíče, pokud to bude UX vyžadovat — mimo rozsah M2C.
- Krok 3 je připraven přijmout galerii místo `<select>` bez zásahu do kroků 1, 2, 4.

---

*Konec reportu M2C. Změněny pouze `index.html`, `styles.css`, `js/app.js`; přidán tento report. Bez commitu a push. Draft PR #1 zůstal otevřený a nesloučený.*
