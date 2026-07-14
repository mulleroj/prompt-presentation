# M1A — Bezpečnost a odolnost dat — report

> Navazuje na [`AUDIT_GENERATORU_2026.md`](AUDIT_GENERATORU_2026.md) (ten zůstává nezměněn).
> Rozsah tohoto milníku: pouze bezpečnostní opravy P0/P1. Beze změny vzhledu, palety, rozložení formuláře, stylů i formátu promptu. Změněn jediný soubor: **`index.html`** (pouze JavaScriptová část). Žádný commit, žádná nová závislost, žádný build systém.

---

## 1. Stručný popis opravených problémů

| # | Problém (z auditu) | Priorita | Stav |
|---|---|---|---|
| 1 | **Stored XSS přes název presetu** — `renderPresetList` vkládal uživatelský název přes `innerHTML`. | P0 | ✅ opraveno |
| 2 | **Import JSON bez validace** — jediná kontrola byla `if (imported.data)`; importovaný objekt se použil přímo jako stav. | P0 | ✅ opraveno |
| 3 | **Neodolné načítání `localStorage`** — bez validace typů/rozsahů, bez limitů, riziko pádu na poškozených datech. | P1 | ✅ opraveno |
| 4 | **Prototype pollution** — nekontrolované kopírování klíčů z importu/úložiště. | P0/P1 | ✅ ošetřeno |

---

## 2. Přesný seznam změněných funkcí

Vše v `index.html`, sekce `<script>`:

**Nově přidané (validační/normalizační vrstva):**
- `LIMITS`, `ENUMS`, `DEFAULT_STATE`, `FIELD_SCHEMA`, `FORBIDDEN_KEYS` — konstanty (jediné místo pravdy pro povolené klíče, hodnoty, limity a výchozí stav).
- `isPlainObject(value)` — bezpečné rozpoznání „čistého" objektu (odmítne `null`, pole, exotické prototypy).
- `normalizeString(value, maxLen, fallback)` — typová kontrola + ořez délky.
- `normalizeEnum(value, allowed, fallback)` — allowlist enumů.
- `normalizeNumber(value, min, max, fallback, integer)` — parsování a ořez do rozsahu.
- `normalizeBoolean(value, fallback)` — přijme jen skutečný boolean.
- `normalizeState(raw, base)` — sestaví **nový** stavový objekt výhradně z povolených klíčů (jádro ochrany).
- `normalizePresetStore(raw)` — vyčistí celé úložiště vlastních presetů (drop nevalidních, ořez, limit počtu).
- `validateAndNormalizePresetImport(parsed)` — validace importovaného souboru → `{ ok, name, data }` nebo `{ ok:false, reason }`.
- `buildPresetRow(name, key, isBuiltIn)` — tvorba řádku presetu čistě přes DOM API.

**Přepsané (bezpečnější chování):**
- `renderPresetList()` — kompletně přepsáno z `innerHTML` na `createElement` + `textContent` + `addEventListener` (odstranění XSS a inline handlerů).
- `importPreset(event)` — vložena validační vrstva, rozlišené chybové hlášky, použit jen normalizovaný objekt.
- `loadState()` — odolné načtení stavu s normalizací.
- `getCustomPresets()` — načtení presetů přes `normalizePresetStore`.
- `saveAsPreset()` — limit počtu presetů + normalizace názvu a dat.
- `resetForm()` — používá `DEFAULT_STATE` (jeden zdroj pravdy místo duplikovaného objektu).
- `updateCustomPresetsList()` — čištění `<optgroup>` přes `textContent` místo `innerHTML` (kosmetika, odstraňuje poslední výskyt `innerHTML`).

**Nezměněno (funkčně):** generování promptu, kopírování, export, modal, klávesové zkratky, veškeré HTML, CSS, paleta, styly a jejich názvy.

---

## 3. Přijatá validační pravidla

Zdroj pravdy = `FIELD_SCHEMA` (explicitní allowlist 23 polí). Pro každou hodnotu (z importu i z `localStorage`):

- **Enumy** (`deckFormat`, `deckLength`, `outputLanguage`, `knowledgeLevel`, `illustrationPreset`, `atmosphere`, `themePack`, `constraintLevel`) — musí být řetězec z povoleného seznamu, jinak výchozí hodnota. Seznamy stylů/atmosfér/témat se odvozují z existujících snippet slovníků → **nemohou se rozejít** (46 stylů zůstává v souladu).
- **Řetězce** (`topic`, `primaryGoal`, `targetAudience`, `customLanguage`, `visualConstraints`, `additionalTerminology`) — musí být `string`, jinak výchozí; delší se bezpečně ořízne na limit.
- **Čísla** (`numSlides` 3–60, `bulletsPerSlide` 2–8) — parsují se, zaokrouhlí na celé číslo a ořežou do rozsahu; neplatné → výchozí.
- **Booleany** (7 polí) — přijímá se pouze skutečný `boolean`, jinak výchozí.
- **Neznámé klíče** — ignorovány (nikdy se nekopírují do stavu).
- **Kořenová struktura** — musí být „čistý" objekt; `null`, pole, primitiva a chybějící `data` jsou odmítnuty.
- **Název presetu** — řetězec ořezaný na 100 znaků, `trim()`; prázdný název je nevalidní.

Vždy se sestavuje **nový** objekt; importovaná data se nikdy nepoužijí přímo jako stav.

---

## 4. Použité limity

| Limit | Hodnota | Poznámka |
|---|---|---|
| Název presetu | **100** znaků | dle doporučení |
| Krátká textová pole (`topic`, `primaryGoal`, `targetAudience`, `customLanguage`) | **500** znaků | dle doporučení |
| Víceřádková pole (`visualConstraints`, `additionalTerminology`) | **20 000** znaků | viz odchylka níže |
| Počet uložených presetů | **100** | dle doporučení |

**Odchylka a zdůvodnění:** aplikace nemá jedno velké „hlavní obsahové zadání" (obsah dodává NotebookLM ze zdrojů notebooku). Doporučený limit 20 000 znaků byl proto přiřazen dvěma jediným volnějším víceřádkovým polím (`visualConstraints`, `additionalTerminology`) jako bezpečnostní strop proti nafouknutí `localStorage`; jednořádková pole mají 500. Limity jsou centralizované v konstantě `LIMITS` a snadno upravitelné.

**Způsob počítání délky:** přes `String.length` (počet UTF-16 jednotek) — předvídatelné a konzistentní; ořez `slice(0, max)`. U importu se zásadně neplatný soubor odmítá; jednotlivé přebytečné hodnoty se bezpečně ořežou/normalizují. U `localStorage` se používá bezpečný ořez, aby zůstala zachována validní část dat.

---

## 5. Chování při poškozeném localStorage

- **Neplatný JSON stavu** → zachyceno, tichý fallback na výchozí hodnoty, žádný pád (`loadState`).
- **Neplatný JSON presetů** → chová se, jako by žádné vlastní presety nebyly (`getCustomPresets`).
- **Hodnoty mimo rozsah / špatné typy** → normalizovány na výchozí nebo ořezány (např. `numSlides:999 → 60`).
- **Jeden nevalidní preset mezi validními** → zahodí se jen ten nevalidní, ostatní zůstanou použitelné (`normalizePresetStore`). **Nemaže se vše kvůli jedné chybě.**
- **Příliš mnoho presetů** → načte se prvních 100, zbytek se ignoruje.
- **Škodlivý název presetu v úložišti** → vykreslí se pouze jako text (viz XSS testy).
- **Nebezpečné klíče** (`__proto__`, `prototype`, `constructor`) → přeskočeny; prototyp `Object` se neznečistí.

---

## 6. Zpětná kompatibilita

- **Formát dat se nemění.** Klíče `localStorage` zůstávají `..._state_v2` a `..._presets_v2`; struktura presetu `{ name, data }` i pole ve `data` jsou beze změny.
- Dříve uložený **platný** stav i presety se načtou beze ztráty (ověřeno regresí a round-tripem exportu). Normalizace jen doplní chybějící pole výchozími hodnotami a případně ořeže extrémy.
- Starší exportované soubory z předchozí verze aplikace projdou importem, pokud mají `{ data: {...} }` s rozpoznatelnými poli — neznámá pole se ignorují, chybějící doplní default.
- **Žádná destruktivní migrace**: poškozené části se ignorují, ne mažou plošně.
- Jediná pozorovatelná změna chování je zpřísnění: dříve tolerovaná nesmyslná/škodlivá data jsou nyní normalizována nebo odmítnuta — to je záměr milníku.

---

## 7. Provedené bezpečnostní testy (runtime v prohlížeči, přes lokální server)

**XSS (render názvu presetu):** názvy `<img src=x onerror=…>`, `<script>…</script>`, uvozovky/HTML entity, český název s diakritikou.
- ✅ žádný skript se nespustil (`scriptFired=false`)
- ✅ nevznikl žádný `<img>`/`<script>` element
- ✅ obsah zobrazen pouze jako text; diakritika zachována
- ✅ tlačítka „Načíst"/smazat dál fungují (11 tlačítek, klik bez chyby)

**Import (`validateAndNormalizePresetImport`):** 13 scénářů — validní export, neplatný JSON, `null`, pole, objekt bez `data`, prázdný objekt, neznámé klíče, neplatný enum, číslo mimo rozsah, špatné typy, extrémně dlouhý název, extrémně dlouhé textové pole, částečně validní data.
- ✅ všech 13 prošlo (validní přijat a normalizován; nevalidní odmítnut; přebytky ořezány; neznámé klíče zahozeny)

**Prototype pollution:** `{"data":{"__proto__":{"polluted":"yes"},"constructor":{…},"topic":"safe"}}` (přes `JSON.parse`).
- ✅ `({}).polluted === undefined` (prototyp nezněčištěn)
- ✅ výsledek neobsahuje vlastní klíč `__proto__`; `topic` zachován

**LocalStorage (`normalizePresetStore` / `loadState`):** neplatný JSON, validní starší stav, hodnoty mimo rozsah, nevalidní preset mezi validními, 250 presetů, škodlivý název, položka co není objekt.
- ✅ validní zachovány, nevalidní zahozeny, limit 100 dodržen
- ✅ poškozený stav → fallback na default, bez pádu
- ✅ škodlivý název z úložiště se po reálném reloadu zobrazil jen jako text a nespustil se

**Reálný reload s poškozeným + škodlivým `localStorage`:**
- ✅ stránka se načte, prompt se vygeneruje, konzole bez chyb, XSS nespuštěno, nevalidní položka zahozena, validní preset zachován.

---

## 8. Regresní testy

- ✅ **46 stylů = 46 snippet klíčů** (0 chybějících, 0 nevyužitých)
- ✅ vyplnění formuláře + výběr stylu + atmosféry → generování promptu (well-formed, obsahuje téma/styl/atmosféru)
- ✅ vytvoření presetu (název i data uložena, objeví se v horním selectu)
- ✅ načtení presetu (obnoví hodnoty)
- ✅ smazání presetu
- ✅ export → import round-trip validního souboru
- ✅ persistence po reloadu (téma i styl zachovány)
- ✅ **žádné nové externí síťové požadavky** (jen lokální `GET index.html`)
- ✅ **konzole prohlížeče bez chyb** ve všech fázích
- ✅ kopírování promptu, modal, reset — beze změny logiky, funkční

---

## 9. Známá omezení

- **Ochrana proti obnově prototypu je „drop", ne „throw":** nebezpečné klíče se tiše přeskočí. To je záměr (odolnost), ne skrytá chyba.
- **`normalizeBoolean` je striktní** — hodnota jako `"true"` (řetězec) se nepřijme a spadne na výchozí. Záměrně bezpečnější; u legitimních dat z této aplikace nenastává (ukládá skutečné booleany).
- **Nativní dialogy** (`alert`/`confirm`/`prompt`) zůstávají — nahrazení konzistentním UI je mimo rozsah M1A (viz M1B).
- **Délka se počítá v UTF-16 jednotkách**, ne v grafémech; extrémní emoji/kombinující znaky se teoreticky ořežou uprostřed páru. Pro tato pole nepodstatné.
- **Bez automatizovaného testovacího frameworku** — testy byly provedeny runtime v prohlížeči (dle zadání se nepřidával `package.json` ani build). Testovací kód není součástí repozitáře.
- **`saveState()` ukládá aktuální DOM 1:1** (bez normalizace při zápisu); případné extrémy z UI se normalizují až při čtení. Pole formuláře jsou ale omezena atributy (`min`/`max`) a validace při čtení to pokrývá.

---

## 10. Doporučení pro M1B

1. **Přístupnost (P1):** zpřístupnit toggle „Úroveň omezení" z klávesnice (dnes `display:none` na radiích), přidat `@media (prefers-reduced-motion)`, `role="dialog"` + `aria-modal` + focus-trap a návrat fokusu u modalu.
2. **Nahradit nativní `alert`/`confirm`/`prompt`** konzistentním, stylovaným a lokalizovaným UI (i pro chybové hlášky importu) — bez zavádění frameworku.
3. **Kvalita promptu (P1):** odstranit trojí duplicitu omezení „no screenshots/UI" a mapovat surové enumy (`Length: default`, `Knowledge level: beginner`) na přirozený jazyk.
4. **Volitelně přidat lehký běhový self-test** (skrytý „?test" režim) pro rychlou regresní kontrolu bez build systému.
5. **Až poté** navázat datovou architekturou stylů (M2) a UX vylepšeními (M3) dle auditu.

---

## 11. Post-review opravy M1A.1

Navazuje na nezávislou review [`M1A_SECURITY_REVIEW.md`](M1A_SECURITY_REVIEW.md), která potvrdila nálezy **P2-1** (falešné potvrzení úspěchu při selhání zápisu) a **P3-1** (prázdný import hlásil úspěch). Obojí opraveno. Změněn pouze `index.html` (JS) a tento report. Beze změny vzhledu, CSS, HTML a promptové logiky.

### Oprava P2-1 — pravdivá zpětná vazba při selhání zápisu

- **Nové chování ukládacích funkcí:** `saveState()` i `saveCustomPresets()` nyní vracejí **`true`** při úspěšném zápisu a **`false`** při selhání (storage plný / blokovaný / nedostupný). Výjimka je nadále zachycena, takže aplikace nespadne; uživateli se nevypisuje technický stack trace.
- **Volající, kteří provádějí explicitní uložení, reagují na výsledek:**
  - `saveAsPreset()` — při `false` zobrazí **„Preset se nepodařilo uložit do prohlížeče."** a nezobrazí falešné „Preset byl uložen!".
  - `deletePreset()` — při `false` zobrazí **„Preset se nepodařilo odstranit z úložiště prohlížeče."**; seznam se překreslí z reálného úložiště, takže neodstraněný preset pravdivě zůstane.
  - `importPreset()` — rozlišuje, zda import (a) pouze načetl data do formuláře, nebo (b) také ukládal nový preset. Pokud se stav nepodařilo perzistovat (nebo selhalo uložení nového presetu), zobrazí **„Import byl načten, ale nepodařilo se jej uložit do prohlížeče. Po obnovení stránky se nemusí zachovat."** — netvrdí tedy, že data přežijí reload.
- **Průběžné auto-uložení** (`onFormChange` → `saveState`, `loadPreset`, `resetForm`) návratovou hodnotu ignoruje záměrně — uživatele neobtěžuje hláškou při každé změně, ale neošetřená chyba nevznikne.

### Oprava P3-1 — import bez podporovaných polí je odmítnut

- `validateAndNormalizePresetImport()` nově spočítá počet **rozpoznaných** klíčů z `FIELD_SCHEMA` přítomných ve `data`. Pokud je nula, vrátí `{ ok:false, reason:'empty' }`.
- `importPreset()` pro `reason:'empty'` zobrazí **„Import se nezdařil: soubor neobsahuje žádná podporovaná nastavení."**
- Jasně se rozlišují čtyři případy: `structure` (špatný kořen) · `data` (chybějící/neplatný objekt `data`) · `empty` (platný objekt bez podporovaných polí) · úspěch (alespoň jedno rozpoznané pole).
- **Prototype pollution není oslabena:** kontrolují se pouze klíče z `FIELD_SCHEMA`, takže payload obsahující jen `__proto__` se počítá jako nula rozpoznaných polí → odmítnut. Ověřeno `({}).polluted === undefined`.

### Výsledky cílených testů (runtime v prohlížeči)

**Selhání zápisu (setItem vyhodí výjimku):**
- `saveState()`/`saveCustomPresets()` vrací `false` ✅
- `saveAsPreset` → „Preset se nepodařilo uložit do prohlížeče.", žádné falešné potvrzení, nic neperzistováno, bez pádu ✅
- `deletePreset` → „Preset se nepodařilo odstranit…", preset pravdivě zůstává ✅
- `importPreset` (load-only i save-new) → „Import byl načten, ale nepodařilo se jej uložit…" ✅
- úspěšný zápis → původní „Preset byl uložen!" / „Preset byl úspěšně importován!" ✅ (ověřeno i na **reálné** async funkci `importPreset`)

**Import (rozpoznaná pole):**
- `{ "data": {} }` → odmítnuto (`empty`) ✅
- `{ "data": { "unknown": "value" } }` → odmítnuto (`empty`) ✅
- `{ "data": { "topic": "Elektřina" } }` → povoleno ✅
- validní pole + neznámé pole → povoleno, neznámé ignorováno ✅
- validní plný export → povoleno ✅
- export/import round-trip všech **23 polí** → přesná shoda ✅
- prototype pollution payload → odmítnut/bezpečně ignorován, `({}).polluted === undefined` ✅

**Regrese:** generování promptu ✅ · create/load/delete správného presetu ✅ · export ✅ · import validního exportu ✅ · persistence po reloadu ✅ · XSS názvy jen jako text ✅ · 46 stylů = 46 klíčů ✅ · konzole bez chyb ✅ · 0 externích požadavků ✅.

### P3-2 — ponecháno jako známé omezení

Tiché oříznutí na max. **100** presetů při čtení nebylo funkčně měněno: limit `LIMITS.maxPresets` zůstává 100, aplikace při 130 presetech nespadne a ochrana proti nadměrným datům je zachována (ověřeno). Ponecháno pro pozdější UX milník.

---

*Konec reportu M1A (vč. M1A.1). Změněn pouze `index.html` (JS) a tento report. Nebyl vytvořen commit ani push.*
