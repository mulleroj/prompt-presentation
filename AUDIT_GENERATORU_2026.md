# AUDIT GENERÁTORU PROMPTŮ PRO NOTEBOOKLM — 2026

> **Rozsah:** čistě auditní fáze. Nebyl změněn žádný existující soubor, neproběhla žádná implementace, nebyl vytvořen commit ani nainstalována žádná knihovna. Jediný nově vytvořený soubor je tento auditní dokument.
>
> **Legenda spolehlivosti zjištění:**
> - ✅ **Ověřeno** — potvrzeno čtením zdrojového kódu a/nebo runtime kontrolou v prohlížeči.
> - 💡 **Návrh** — doporučení, které vychází z ověřeného stavu, ale je to má úvaha, nikoli fakt.
>
> **Priority:** `P0` chyba / zásadní překážka · `P1` vysoký přínos, řešit brzy · `P2` užitečné zlepšení · `P3` možné pozdější rozšíření.

---

## 1. Manažerské shrnutí

Aplikace je **jednosouborová statická webová stránka** (`index.html`, ~75 kB, ~1725 řádků) bez build systému, bez závislostí a bez frameworku. Veškerá logika je ve vanilla JavaScriptu, veškerý styl v jednom inline `<style>`. To je z hlediska bezpečnosti a udržovatelnosti **velká výhoda**: aplikace je plně lokální, funguje offline, neobsahuje jediný externí požadavek (ověřeno) a nepřenáší žádná uživatelská data ven.

Funkčně aplikace dělá přesně to, co má: sestavuje strukturovaný anglický prompt pro NotebookLM (modul Slide Deck) z formuláře, průběžně ho zobrazuje, umožňuje kopírování, ukládá stav i vlastní presety do `localStorage` a podporuje import/export JSON. Prompt je poskládaný modulárně (`## sekce`) a s volitelnými poli pracuje korektně.

Hlavní slabiny jsou tři:
1. **Bezpečnost (P0):** názvy presetů se vykreslují přes `innerHTML` bez escapování → **potvrzené stored XSS** (byť lokální, v rámci jednoho prohlížeče uživatele; kritické zejména při importu cizího JSON).
2. **Produkt/UX pro cílovou skupinu (P1):** vzhled je tmavý „vývojářský konzolový" (monospace, téměř černé pozadí). Pro učitele bez technického zázemí působí chladně a odrazujícím dojmem. Formulář vysype všech 9 sekcí a 46 vizuálních stylů najednou, bez průvodce, náhledů a doporučení.
3. **Datová architektura stylů (P1):** každý styl je pouze jedna anglická věta v plochém slovníku, oddělená od českého popisku v HTML `<option>`. Pro plánované rozšíření knihovny stylů (desítky variant, bohatší pravidla) je tato struktura nedostatečná a náchylná k rozjetí (label vs. snippet se udržují ručně).

Doporučení: **nepřepisovat aplikaci od nuly.** Základ je zdravý. Postupovat malými bezpečnými milníky — nejprve opravit XSS a robustnost dat (P0), poté zavést udržovatelnou datovou strukturu stylů a teprve na ní stavět UX vylepšení (průvodce, galerie, doporučení).

---

## 2. Popis současné architektury (✅ ověřeno)

### Technologický stack
- **Žádný build, žádné závislosti, žádný package manager.** V repozitáři jsou jen `index.html`, `.gitignore` a `.git`. (`.claude/` je git-ignorováno a patří harnessu, ne projektu.)
- **HTML5 + inline CSS + vanilla JavaScript (ES6+).** Žádný framework, žádný bundler, žádný TypeScript.
- **Jazyk UI:** čeština. **Jazyk generovaného promptu:** angličtina (záměr — NotebookLM dostává instrukce anglicky, výstupní jazyk prezentace je konfigurovatelné pole).

### Struktura adresářů
```
/
├── index.html      ← celá aplikace (styl + markup + logika)
├── .gitignore      ← OS/IDE/log ignore
└── .git
```
Plochá struktura. Žádné `src/`, `assets/`, `tests/`, žádné konfigurační soubory.

### Hlavní části `index.html`
| Rozsah řádků | Obsah |
|---|---|
| 7–634 | `<style>` — CSS proměnné (tmavá paleta), layout, komponenty, jediný `@media (max-width:920px)` |
| 636–1006 | Markup — hlavička, dvoupanelový layout (formulář vlevo, výstup vpravo), action bar |
| 1011–1027 | Modal správy presetů |
| 1032–1094 | Datové slovníky: `ILLUSTRATION_SNIPPETS` (46 stylů), `ATMOSPHERE_SNIPPETS` (10), `THEME_PACK_SNIPPETS` (8) |
| 1123–1208 | `BUILT_IN_PRESETS` (3 vestavěné presety) |
| 1211–1219 | `FORM_FIELDS` — seznam ID polí |
| 1224–1503 | Inicializace, správa stavu, **generování promptu** |
| 1509–1722 | Clipboard, presety, modal, klávesové zkratky |

### Řízení stavu (✅)
- Stav není držen v žádném objektu; **zdrojem pravdy je přímo DOM**. `getFormState()` čte hodnoty z polí podle `FORM_FIELDS`, `setFormState()` je zpět zapisuje.
- Při každé změně (`input`/`change`) se volá `onFormChange()` → `saveState()` + `generatePrompt()`. Prompt se tedy generuje **živě** (to je dobře).
- `constraintLevel` (radio) je řešen zvlášť mimo `FORM_FIELDS`.

### Skládání promptu (✅)
`generatePrompt()` (ř. 1398) staví pole řádků `lines[]` a spojuje `\n`. Moduly: úvodní věta → `## Output Configuration` → `## Prompt Instructions` → `## Slide Structure` → `## Visual & Style Guidelines` → volitelně `## Notes` → uzavírací věta. Hodnoty se vkládají přes template literály. Volitelná pole se přidávají jen pokud jsou vyplněná.

### Struktura stylů a presetů (✅)
- **Styly:** tři ploché `KLÍČ → anglická věta` slovníky. Český popisek stylu žije **odděleně** v `<option>` v HTML. Vazba mezi popiskem a snippetem je pouze konvence (stejný `value`).
- **Presety:** vestavěné jako JS objekt `{ name, data }`; vlastní v `localStorage` pod stejným tvarem.

### Úložiště (✅)
- `localStorage` klíče: `notebooklm_prompt_generator_state_v2` (stav formuláře) a `notebooklm_prompt_generator_presets_v2` (vlastní presety). Verzování `_v2` v klíči je připraveno na budoucí migrace, ale **žádná migrační logika neexistuje**.
- Čtení je obalené `try/catch`; při chybě se tiše použije prázdný objekt / výchozí stav.

### Build a deployment (✅)
- **Žádná konfigurace.** Deployment = nahrání jednoho souboru na libovolný statický hosting (nebo otevření lokálně). To je legitimní a robustní volba pro tento typ nástroje.
- Poznámka: `navigator.clipboard` a `file://` — při otevření přímo ze souboru mohou být některé API omezené; přes HTTP funguje vše (ověřeno na lokálním serveru).

### Závislosti (✅)
- **Žádné.** Nic zastaralého ani rizikového, protože není co aktualizovat. Fonty (`Inter`, `Cascadia Code`) se pouze odkazují v `font-family` a načítají se lokálně — nejsou taženy z Google Fonts, takže offline režim zůstává zachován (jen padnou na systémový fallback, pokud font není nainstalován).

---

## 3. Co je na aplikaci povedené

- ✅ **Plně lokální a offline.** Žádný externí požadavek, žádné CDN, žádná analytika, žádný tracker (ověřeno grepem — nic nenalezeno). Přesně splňuje požadavek „jednoduchá, lokální, důvěryhodná".
- ✅ **Živý náhled promptu.** Prompt se přepočítává při každé změně; uživatel okamžitě vidí výsledek.
- ✅ **Modulární a čitelná struktura promptu.** Markdown sekce, správně vynechaná prázdná pole.
- ✅ **Rozumný stav & persistence.** Uložení do `localStorage` s `try/catch`, obnovení po refreshi.
- ✅ **Presety + import/export.** Vestavěné pedagogické presety (výuka, workshop), vlastní presety, export/import JSON.
- ✅ **Zpětná vazba u kopírování** (toast) a potvrzení u destruktivních akcí (`confirm` u resetu i mazání).
- ✅ **Čistý, komentovaný a konzistentně organizovaný kód** — dobře se v něm orientuje i přes jeden soubor.
- ✅ **Bez runtime chyb** — při načtení 0 chyb v konzoli, prompt se generuje korektně (ověřeno).
- ✅ **46 vizuálních stylů a 46 snippet klíčů je aktuálně přesně v souladu** (ověřeno runtime porovnáním) — dnes tedy žádný styl „nevypadne".

---

## 4. Největší problémy vzhledu a použitelnosti

### Vzhled (Část 3)
- 💡 **Tmavé „IDE" ladění neodpovídá cílové skupině.** Paleta je téměř černá (`--bg-primary:#0a0e14`), akcenty neonové, výstup i pole v monospace. Zadání explicitně chce „moderní, důvěryhodný, přehledný a přívětivý, nikoli … příliš technologicky chladný". Aktuální vzhled je pravý opak — vypadá jako vývojářský nástroj.
- 💡 **Vizuální hierarchie je plochá.** Všech 9 sekcí má stejnou váhu; nic nevede oko k „hlavnímu" (téma, cíl, generovat/kopírovat).
- ✅ **Kontrast pomocných textů je hraniční.** `--text-muted:#636e7b` na tmavém pozadí u drobného písma (0.72–0.78 rem) pravděpodobně nesplní WCAG AA 4.5:1 pro malý text (nutno doměřit, ale vizuálně slabé).
- 💡 **Délka řádků výstupu** není omezená — na širokém monitoru se prompt roztáhne přes celý panel.

### Použitelnost pro učitele (Část 2)
- 💡 **Není okamžitě jasné „co mám udělat první".** Chybí úvodní věta/onboarding, žádné zvýraznění prvního kroku. Uživatel vidí zeď formuláře.
- 💡 **Příliš mnoho voleb najednou.** 9 sekcí, řada checkboxů a **46 stylů v jednom `<select>`** bez náhledu a bez vysvětlení „kdy který styl použít". Pro necílovou skupinu prompt-engineeringu zahlcující.
- 💡 **Žádné kroky / průvodce.** Proces není rozfázovaný (obsah → styl → hotový prompt).
- 💡 **Rozdíl „obsah vs. vizuální styl" je naznačen jen názvy sekcí**, není explicitně vysvětlen.
- ✅ **Výstup je editovatelný jen zdánlivě** — `#generatedPrompt` je `readonly`. Uživatel nemůže prompt doladit přímo v poli (musí kopírovat a upravit jinde). Zadání přitom chce „snadno … dále upravit".
- 💡 **Native dialogy `prompt()`/`alert()`/`confirm()`** působí zastarale a na mobilu nepředvídatelně; nejsou stylované ani lokalizovatelné konzistentně s appkou.
- 💡 **Reset maže vše najednou** — chybí reset jednotlivé sekce.
- 💡 **Angličtina výstupu není vysvětlena** — učitel může být zmatený, proč je vygenerovaný text anglicky, když appka i pole „Jazyk výstupu: Čeština" jsou české.

### Přístupnost (Část 3)
- ✅ **Toggle „Úroveň omezení" není ovladatelný klávesnicí.** `.toggle-group input[type="radio"]{display:none}` (ř. 306) → radia vypadnou z pořadí tabulátoru i z fokusu. Klávesnicoví a odečítačoví uživatelé je nedosáhnou. **WCAG selhání.**
- ✅ **`prefers-reduced-motion` není respektován** nikde. Přechody a `transform: scale()` běží vždy.
- ✅ **Modal nemá `role="dialog"`, `aria-modal`, focus-trap ani návrat fokusu.** Escape zavírá (dobře), ale fokus zůstane „za" modalem.
- ✅ **Hlavičkový `<select>` presetů nemá `<label>`** (jen vizuální kontext). Ostatní pole `<label for>` mají správně.

### Responzivita (✅ ověřeno ze zdroje)
- Existuje jediný breakpoint `@media (max-width:920px)` → panely pod sebe, formulář `max-height:52vh`, výstup `48vh`. Funkční, ale na mobilu dost stísněné (dvakrát skrolovací oblast nad sebou). Mezi 640 px a 920 px `form-panel` s `min-width:420px` může způsobit horizontální přetečení. **Doporučuji doměřit na reálném mobilu.**

---

## 5. Problémy logiky generování promptu (Část 4)

- ✅ **Duplicitní/nadbytečné instrukce o „žádných screenshotech".** Omezení se do promptu může dostat **až 3×**: (1) checkbox `noScreenshots` → „No screenshots, no UI elements…", (2) výchozí text pole `visualConstraints` = „No screenshots, no photos, no icons…", (3) přísný režim → „…no UI-like elements". Vzájemně si neodporují, ale opakují se.
- ✅ **Surové hodnoty enumů unikají do promptu.** `- Length: default` (ověřeno ve výstupu) a `- Knowledge level: beginner/intermediate/advanced` jsou strojové klíče, ne přirozený jazyk. Mělo by být mapováno (např. `default → standard length`, `short → concise`).
- ✅ **Styl = jen jedna věta.** Žádný sdílený základ, žádná pravidla barev / typografie / rozvržení / „čemu se vyhnout" per styl. Prompt tak o zvoleném stylu řekne minimum.
- 💡 **Pravidla čitelnosti/množství textu jsou slabá.** Je tam `bulletsPerSlide` a „one idea per slide", ale žádné explicitní „krátké titulky, max N slov na odrážku, vysoký kontrast textu vůči ilustraci".
- ✅ **Bezpečné vkládání hodnot do promptu — v pořádku.** Výstup jde do `textarea.value` (ne `innerHTML`), takže z pohledu promptu nehrozí injektáž do stránky. Uživatelský text se vkládá 1:1; případný `##` nebo pomlčka ve vstupu může teoreticky rozbít strukturu markdownu, ale to je kosmetické.
- ✅ **Prázdná/volitelná pole ošetřena správně** — topic/goal/audience se přidají jen když jsou vyplněná; `## Notes` se objeví jen když je co psát.
- ✅ **Škálovatelnost:** dnešní plochý slovník zvládne desítky jednovětých stylů, ale **jakmile budou styly bohatší, začne se text duplikovat** (stejné fráze o konzistenci, „no UI", atd.). To řeší navržená architektura (sekce 8).

---

## 6. Technický dluh a rizika (Části 1 a 6)

| # | Zjištění | Závažnost | Stav |
|---|---|---|---|
| 6.1 | **Stored XSS přes název presetu.** `renderPresetList()` skládá HTML řetězec s `preset.name` a `key` a vkládá `container.innerHTML` (ř. 1678–1709). Ověřeno: název `<b>` se vykreslí jako element → `<img src=x onerror=…>` by se spustil. Vektor: `prompt()` při ukládání i **import cizího JSON**. | **P0** | ✅ ověřeno (runtime) |
| 6.2 | **Validace importu je jen `if (imported.data)`** (ř. 1626). Žádná kontrola typů/whitelistu klíčů/rozsahů. Cizí soubor může vnést libovolná data do stavu i do názvu presetu (viz 6.1). | **P0** | ✅ ověřeno |
| 6.3 | **Žádná migrace/sanitizace starého `localStorage`.** Poškozený/neúplný stav se sice nezhroutí (try/catch), ale `setFormState` slepě nastaví hodnoty; chybějící pole zůstanou v předchozím stavu, neznámé `constraintLevel` se ignoruje. Chybí validace rozsahů (`numSlides`, `bulletsPerSlide`). | **P1** | ✅ ověřeno |
| 6.4 | **Žádné omezení délky vstupů.** `topic`, `additionalTerminology`, `visualConstraints` bez limitu → extrémně dlouhý vstup nafoukne prompt i `localStorage` (kvóta ~5 MB). | **P2** | ✅ ověřeno |
| 6.5 | **`key` presetu se vkládá do `onclick="loadPreset('${key}')"`.** Dnes je `key` generován interně (`custom_ + Date.now()`), takže bezpečné; ale je to křehký vzor (inline handler + řetězcová interpolace). | **P2** | ✅ ověřeno |
| 6.6 | **Label stylu (HTML) a snippet (JS) se udržují ručně.** Dnes v souladu (46 = 46), ale při rozšiřování hrozí rozjetí; chybějící snippet navíc **selže tiše** (řádek se prostě nepřidá). | **P1** | ✅ ověřeno |
| 6.7 | **Žádné testy, žádný lint, žádná typová kontrola.** Regrese se nezachytí. | **P2** | ✅ ověřeno |
| 6.8 | **Fokus/přístupnost** (radio `display:none`, modal bez ARIA/focus-trap, reduced-motion). | **P1** | ✅ ověřeno |

**Ochrana citlivého obsahu / síť:** ✅ aplikace nikam nic neposílá, takže riziko úniku je minimální. Jediná „exfiltrace" by byla přes škodlivý importovaný JSON kombinovaný s XSS (6.1) — proto je oprava XSS P0.

---

## 7. Doporučená cílová podoba aplikace (💡 návrh)

Zachovat filozofii **jeden lehký, lokální, offline nástroj**, ale posunout ho od „vývojářské konzole" k **přívětivému pedagogickému nástroji**:

- **Vizuální koncepce (jedna hlavní):** *„Klidný světlý pracovní list"* — světlé/neutrální pozadí, jeden důvěryhodný akcent (např. tlumená modrá/inkoustová), sans-serif pro UI (monospace nechat **jen** pro výstupní prompt), velkorysý bílý prostor, karty s jemným stínem, výrazná primární akce. Podpora světlého i tmavého režimu přes `prefers-color-scheme`. Moderní, ale ne dětinské ani neonové.
- **Tok ve 3 krocích:** (1) *O čem to je* (obsah, cíl, publikum) → (2) *Jak to má vypadat* (styl z galerie + atmosféra) → (3) *Hotový prompt* (náhled, kopírovat, doladit, uložit). Pokročilá nastavení schovat do „Rozšířené".
- **Galerie stylů** místo dlouhého `<select>`: karty s miniaturou/popiskem, kategorií a větou „vhodné pro…".
- **Editovatelný výstup** (odebrat `readonly`) + export TXT/MD.
- **Bezpečné výchozí pedagogické presety** jako výchozí bod pro nováčka.
- Postupně, **bez velkého přepisu** — všechno výše jde přidat inkrementálně nad stávající kód nebo po jednorázovém rozdělení do `index.html` + `app.js` + `styles.css` + `styles-data.js` (volitelné, ne nutné).

---

## 8. Návrh datové architektury stylů (💡 návrh)

Cíl: jedno místo pravdy pro každý styl (dnes jsou label a snippet oddělené), sdílený základ bez duplikace, připravenost na desítky stylů a bohatší pravidla. Struktura je čistě **datová** (JSON/JS objekt), snadno serializovatelná a rozšiřitelná.

```jsonc
// Sdílený základ – jednou, ne v každém stylu
const STYLE_BASE = {
  common: [
    "One illustration per slide.",
    "Keep the chosen style and atmosphere consistent across all slides.",
    "No screenshots, no photos, no UI mockups."
  ]
};

// Jeden styl = jeden objekt
{
  "id": "3d-cut-paper",
  "nazev": "3D Cut-Paper (vystřihovánky)",
  "popisCz": "Vrstvené papírové výřezy s měkkými stíny a ručním pocitem.",
  "kategorie": "ilustracni-vytvarne",
  "vhodnePouziti": ["příběhové výuky", "měkká, přívětivá témata", "nižší stupně škol"],
  "nevhodnePouziti": ["striktně technická/datová témata"],
  "barevnySystem": { "paleta": "teplé pastely", "kontrast": "střední" },
  "typografie": "měkký sans-serif, kulaté tvary",
  "pravidlaRozvrzeni": "jeden výjev na střed, velký vzdušný okraj",
  "obrazovyStyl": "layered paper-cut illustrations, soft shadows, handcrafted feel",
  "typickeSnimky": ["titulní výjev", "koncept jako scéna", "shrnutí jako koláž"],
  "vyhnoutSe": ["fotorealismus", "ikony", "ostré technické linie"],
  "promptModulKratky": "Layered paper-cut illustrations, soft shadows, handcrafted feel.",
  "pravidlaRozsirena": [
    "Use warm pastel palette with soft directional light.",
    "Compose one central paper-cut scene per slide with generous margins."
  ],
  "inspirace": { "zdroj": "awesome-notebookLM (koncept)", "licence": "ověřit", "poznamka": "přeformulováno vlastními slovy" }
}
```

**Zásady:**
- `promptModulKratky` = dnešní jednovětý snippet (zpětná kompatibilita); `pravidlaRozsirena` se přidají jen v „přísném" / detailním režimu → **žádná duplikace** sdílených frází (ty jsou v `STYLE_BASE`).
- `nazev`/`popisCz` nahradí ruční `<option>` labely → **konec rozjíždění label vs. snippet** (6.6). `<select>`/galerie se generují z dat.
- `kategorie` řídí filtrování a galerii; `vhodnePouziti`/`nevhodnePouziti` napájejí doporučení stylu a kontrolu rozporů.
- **K inspiraci z `awesome-notebookLM`:** brát jen jako námět na kategorie a typy stylů; texty formulovat vlastními slovy, do `inspirace` zapsat zdroj a stav licence. Nekopírovat README/obrázky/celé prompty.

---

## 9. Tabulka doporučených funkcí (Část 5)

| Funkce | Uživatelský přínos | Náročnost | Rizika | Priorita | Milník |
|---|---|---|---|---|---|
| Oprava XSS (escapování názvů) | Bezpečnost | Nízká | — | **P0** | 1. |
| Validace importovaného JSON | Bezpečnost, robustnost | Nízká–stř. | — | **P0** | 1. |
| Validace/sanitizace `localStorage` + rozsahy | Odolnost vůči starým datům | Nízká | — | **P1** | 1. |
| Klávesnicově dostupný toggle + reduced-motion + ARIA modal | Přístupnost (WCAG) | Nízká | — | **P1** | 1. |
| Mapování enumů v promptu (`default`→text) + odstranění duplicit | Kvalita výstupu | Nízká | — | **P1** | 1. |
| Datová architektura stylů (sekce 8) | Udržovatelnost, škálování | Střední | migrace dat | **P1** | 2. |
| Editovatelný výstup (zrušit `readonly`) | „Dále upravit" | Velmi nízká | — | **P1** | 2. |
| Export TXT / Markdown | Snadné sdílení | Nízká | — | **P2** | 2. |
| Průvodce ve 3 krocích | Srozumitelnost pro učitele | Střední | — | **P1** | 3. |
| Vizuální galerie stylů | Volba stylu bez zahlcení | Střední–vyš. | potřeba miniatur | **P1** | 3. |
| Kategorie + filtrování + vyhledávání stylů | Orientace v desítkách stylů | Nízká–stř. (nad daty) | — | **P2** | 3. |
| Jednoduchý / pokročilý režim | Méně voleb najednou | Nízká | — | **P2** | 3. |
| Kontrola neúplných / rozporných nastavení | Prevence chyb | Střední | falešné poplachy | **P2** | 3. |
| Doporučení stylu podle tématu/publika | Rozhodovací pomoc | Střední | kvalita heuristiky | **P2** | 4. |
| Bezpečné výchozí pedagogické presety (rozšíření) | Rychlý start | Nízká | — | **P2** | 3. |
| Náhled promptu (už existuje – jen dopilovat) | — | — | — | hotovo | — |
| Reset jen jedné sekce | Bezpečnější práce | Nízká | — | **P2** | 3. |
| Historie posledních promptů | Návrat k dřívějšku | Střední | kvóta `localStorage` | **P3** | 4. |
| Oblíbené styly | Rychlost | Nízká | — | **P3** | 4. |
| Duplikování presetu | Pohodlí | Nízká | — | **P3** | 4. |
| Porovnání dvou variant promptu | Ladění | Střední | UI složitost | **P3** | 4. |
| „Nová varianta" (duplikace stavu) | Experimentování | Nízká | — | **P3** | 4. |
| Tisknutelné/sdílené shrnutí nastavení | Sdílení | Střední | — | **P3** | 4. |
| Sekce „ukázka, pro jaké téma je styl vhodný" | Edukace uživatele | Nízká (nad daty) | — | **P2** | 3. |
| Stránka zdrojů a inspirací | Transparentnost/licence | Nízká | — | **P2** | 2. |
| Živý import/export nastavení v JSON (už existuje) | — | — | — | hotovo | — |

---

## 10. Rozdělení práce do malých bezpečných milníků (💡 návrh)

- **Milník 1 — Bezpečnost a odolnost (P0/P1), bez změny vzhledu.** XSS escapování, validace importu, sanitizace/rozsahy `localStorage`, přístupnostní opravy (toggle, reduced-motion, ARIA modalu), úklid duplicit a enumů v promptu. *Malý diff, žádné vizuální riziko.*
- **Milník 2 — Datová vrstva stylů + drobná UX.** Zavést strukturu z §8, generovat `<select>`/data z ní, přidat `pravidlaRozsirena`, zrušit `readonly` výstupu, export TXT/MD, stránka zdrojů/licencí. *Migrace dat, UI beze změny konceptu.*
- **Milník 3 — UX pro učitele.** Světlý přívětivý redesign + průvodce 3 kroky + galerie stylů + kategorie/filtr/hledání + jednoduchý/pokročilý režim + reset sekce + kontrola rozporů.
- **Milník 4 — Nadstavby.** Doporučení stylu, historie, oblíbené, duplikace, porovnání variant, tisk/sdílení shrnutí.

Každý milník je samostatně nasaditelný a testovatelný; pořadí ctí „nejdřív bezpečnost, pak základ, pak vzhled, pak nadstavby".

---

## 11. Doporučený první implementační milník (💡 návrh)

**Milník 1 — Bezpečnost & odolnost.** Důvody: obsahuje jediné **P0** (XSS + validace importu), je nízkorizikový (nemění vzhled ani tok), je malý a dá se snadno ověřit, a odblokuje bezpečné pokračování (zejména sdílení/import presetů). Konkrétně:
1. Escapovat `preset.name` (a nepoužívat inline `onclick` s interpolovaným `key` — navázat listenery přes `dataset`).
2. Validovat importovaný JSON proti whitelistu polí a rozsahů; názvy ošetřit jako text.
3. Sanitizovat načtený `localStorage` (typy, rozsahy `numSlides`/`bulletsPerSlide`, známé enumy).
4. Přístupnost: nahradit `display:none` u radií vizuálně skrytým, ale fokusovatelným vzorem; `@media (prefers-reduced-motion: reduce)`; `role="dialog"`+`aria-modal`+focus-trap+návrat fokusu.
5. Prompt: zmapovat `deckLength`/`knowledgeLevel` na přirozený jazyk a sjednotit „no screenshots/UI" na jedno místo.

---

## 12. Soubory, kterých se první milník pravděpodobně dotkne

- **`index.html`** — jediný zdrojový soubor; dotčené oblasti:
  - `renderPresetList()` (ř. ~1670–1710) — escapování, odstranění inline `onclick`.
  - `importPreset()` (ř. ~1619–1655) — validace.
  - `loadState()` / `setFormState()` (ř. ~1308–1352) — sanitizace/rozsahy.
  - CSS `.toggle-group input[type="radio"]` (ř. ~306) + nový `@media (prefers-reduced-motion)` + ARIA atributy modalu (ř. ~1014–1027).
  - `generatePrompt()` (ř. ~1398–1503) — mapování enumů, deduplikace omezení.
- 💡 *Volitelně* (pokud se v tomto milníku rozhodne pro rozdělení souboru): nové `app.js` / `styles.css`. **Doporučuji ponechat na milník 2** a v M1 se držet jednoho souboru, aby byl diff malý a bezpečný.

*(Pozn.: `.gitignore` ani žádný jiný soubor by se dotýkat neměl.)*

---

## 13. Provedené kontroly a jejich výsledky (Část 7)

| Kontrola | Výsledek |
|---|---|
| Instalace závislostí | **Neprováděna** (není `package.json`, není třeba). |
| Lint | **N/A** — v projektu není žádný lint konfigurován. |
| TypeScript kontrola | **N/A** — projekt je čisté HTML/JS, žádný TS. |
| Testy | **N/A** — žádné testy neexistují. |
| Produkční build | **N/A** — statický jednosouborový web, žádný build krok. |
| Načtení v prohlížeči (přes lokální `python -m http.server`) | ✅ **Prošlo** — stránka se načte, formulář funkční. |
| Kontrola konzole | ✅ **Prošlo** — 0 chyb / varování při načtení. |
| Runtime: generování promptu | ✅ **Prošlo** — prompt 1141 znaků, korektní struktura. |
| Runtime: soulad 46 stylů ↔ 46 snippet klíčů | ✅ **Prošlo** — 0 chybějících, 0 nevyužitých. |
| Runtime: potvrzení XSS v `renderPresetList` | ⚠️ **Potvrzena zranitelnost** — název presetu se vykresluje jako HTML. |
| Externí požadavky / CDN / trackery | ✅ **Žádné** (grep nenašel nic). |
| Statická kontrola `innerHTML`/`eval`/`document.write` | ✅ Jen 2× `innerHTML` (ř. 1552 bezpečné, ř. 1709 rizikové), žádný `eval`/`document.write`. |

> **Poznámka k prostředí:** lokální statický server byl spuštěn jen pro čtení (neinvazivní ověření) a nezanechává v projektu žádnou stopu. Pořízení screenshotů opakovaně timeoutovalo (renderer), proto byl vizuální audit veden ze zdrojového CSS; funkční a datové ověření proběhlo přes konzoli prohlížeče.

---

*Konec auditu. Tento dokument je jediná provedená změna v pracovním stromu; `index.html` ani jiný existující soubor nebyl upraven.*
