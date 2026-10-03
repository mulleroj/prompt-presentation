# M1A — Nezávislá code review

> Nezávislá kontrola milníku **M1A — Bezpečnost a odolnost dat**. Tvrzení z [`M1A_SECURITY_REPORT.md`](M1A_SECURITY_REPORT.md) byla použita pouze jako seznam deklarovaných změn; každé bylo ověřeno přímo v aktuálním kódu `index.html` a runtime testy v prohlížeči (lokální server). V této fázi nebyl změněn žádný soubor aplikace, nebyl vytvořen commit ani push.

---

## 1. Celkový verdikt

### ✅ PASS WITH MINOR FIXES

Všechny čtyři bezpečnostní cíle milníku (XSS, validace importu, odolnost localStorage, prototype pollution) jsou **splněny a runtime ověřeny**. Nenalezen žádný **P0 ani P1** problém. Nalezeny pouze **1× P2** a **2× P3** neblokující nálezy (robustnost/UX), které nebrání commitu.

**Commit je bezpečné vytvořit.** Doporučuji drobný P2 nález (falešné potvrzení úspěchu při plném úložišti) vyřešit v M1B, nikoli blokovat jím M1A.

---

## 2. Přesný seznam kontrolovaných změn

Diff: `index.html` **+304 / −86**, jediný změněný soubor (`git diff --stat`). `git diff --check` bez nálezů. Změny jsou **výhradně v JS** — žádná úprava CSS, HTML markupu, palety ani textů (ověřeno: všechny „markup" řádky v diffu jsou pouze *odstraněné* JS řetězce ze starého `innerHTML`).

Kontrolováno:
- **Nová validační vrstva:** `LIMITS`, `ENUMS`, `DEFAULT_STATE`, `FIELD_SCHEMA`, `FORBIDDEN_KEYS`, `isPlainObject`, `normalizeString`, `normalizeEnum`, `normalizeNumber`, `normalizeBoolean`, `normalizeState`, `normalizePresetStore`, `validateAndNormalizePresetImport`.
- **Přepsané funkce:** `renderPresetList` + nová `buildPresetRow` (XSS), `importPreset` (validace), `loadState`, `getCustomPresets` (odolnost), `saveAsPreset` (limit + normalizace), `resetForm` (→ `DEFAULT_STATE`), `updateCustomPresetsList` (`innerHTML`→`textContent`).
- Nezměněno: generování promptu, export, kopírování, modal, klávesové zkratky, veškeré HTML/CSS.

Verifikace nutnosti a rozsahu: všechny změny jsou v rozsahu M1A. **Žádná nesouvisející úprava.** Event handlery nebyly přerušeny (staré inline `onclick` nahrazeny `addEventListener` se stejnou sémantikou včetně `closeModal()` u „Načíst"). Datový formát (`_state_v2`, `_presets_v2`, tvar `{name,data}`) beze změny.

---

## 3. Nalezené problémy podle priorit

### P0 / P1 — žádné ✅

### P2
- **P2-1 — Falešné potvrzení úspěchu při selhání zápisu do localStorage.** `saveCustomPresets` / `saveState` chybu zápisu (kvóta plná / storage blokován) tiše spolknou (`try/catch` + `console.warn`), ale `saveAsPreset` poté **vždy** zobrazí `„Preset byl uložen!"` a importní větev `„Preset byl úspěšně importován!"`, i když nic nebylo perzistováno.
  *Runtime potvrzeno:* při vyhozené `QuotaExceededError` → alert „Preset byl uložen!", ale `getCustomPresets().length === 0`. Aplikace nespadne (dobře), ale uživatel je uveden v omyl.
  *Poznámka:* jde o předexistující vzor, ale funkce `saveAsPreset` byla v M1A upravena a téma spadá do „odolnosti úložiště", proto uvedeno zde.

### P3
- **P3-1 — Import prázdného/nerozpoznaného `data` hlásí úspěch.** Soubor `{"data":{}}` nebo `{"data":{ jenNeznáméKlíče }}` projde jako `ok` a načte samé výchozí hodnoty, přičemž se zobrazí „úspěšně importován". Uživatel nedostane signál, že se nenačetlo nic smysluplného. (Bezpečnostně v pořádku — jen UX.)
- **P3-2 — Tiché oříznutí na 100 presetů při čtení.** Při >100 uložených presetů se přebytek při čtení zahodí a následný zápis perzistuje jen 100 (hraniční ztráta dat). Odpovídá záměru milníku, ale je vhodné zdokumentovat/uvědomit uživatele.

*(P3-3 kosmetika: délka se počítá v UTF-16 jednotkách — teoretické rozseknutí surrogate páru při ořezu; pro reálný obsah těchto polí nepodstatné. Report to již uvádí.)*

---

## 4. Tabulka všech 23 položek schématu

Ověřeno runtime: každý klíč existuje v DOM, typ i výchozí hodnota jsou konzistentní, enum/rozsah odpovídá UI, round-trip zachová hodnotu.

| # | Klíč | Typ | Pravidlo | Odpovídá UI | Round-trip |
|---|---|---|---|---|---|
| 1 | deckFormat | enum | Presenter/Detailed Deck | ✅ | ✅ |
| 2 | deckLength | enum | short/default/long | ✅ | ✅ |
| 3 | outputLanguage | enum | Czech/English/German/French/Spanish/custom | ✅ | ✅ |
| 4 | customLanguage | string | ≤500 | ✅ (input) | ✅ |
| 5 | topic | string | ≤500 | ✅ | ✅ |
| 6 | primaryGoal | string | ≤500 | ✅ | ✅ |
| 7 | targetAudience | string | ≤500 | ✅ | ✅ |
| 8 | knowledgeLevel | enum | beginner/intermediate/advanced | ✅ | ✅ |
| 9 | numSlides | number | 3–60, celé | ✅ (min/max) | ✅ |
| 10 | exactSlides | boolean | true/false | ✅ | ✅ |
| 11 | oneIdea | boolean | true/false | ✅ | ✅ |
| 12 | bulletsPerSlide | number | 2–8, celé | ✅ (min/max) | ✅ |
| 13 | speakerNotes | boolean | true/false | ✅ | ✅ |
| 14 | noInventedFacts | boolean | true/false | ✅ | ✅ |
| 15 | noScreenshots | boolean | true/false | ✅ | ✅ |
| 16 | illustrationPreset | enum | 46 hodnot z ILLUSTRATION_SNIPPETS | ✅ (46=46) | ✅ |
| 17 | atmosphere | enum | 10 hodnot z ATMOSPHERE_SNIPPETS | ✅ | ✅ |
| 18 | visualConsistency | boolean | true/false | ✅ | ✅ |
| 19 | visualConstraints | string | ≤20000 | ✅ (textarea) | ✅ |
| 20 | constraintLevel | enum | normal/strict | ✅ (radio) | ✅ |
| 21 | themePack | enum | 8 hodnot z THEME_PACK_SNIPPETS | ✅ | ✅ |
| 22 | geminiNaming | boolean | true/false | ✅ | ✅ |
| 23 | additionalTerminology | string | ≤20000 | ✅ (textarea) | ✅ |

Kontrola křížových nesrovnalostí: **0 chybějících polí, 0 přebytečných položek, 0 typových/enum/rozsahových rozdílů.** `FORM_FIELDS` (22) + `constraintLevel` = 23 = `FIELD_SCHEMA` = `DEFAULT_STATE`.

---

## 5. Výsledky XSS testů

Payloady vložené jako názvy presetů, poté render / reload / load / delete:

| Payload | Spuštěno? | Vykresleno jako |
|---|---|---|
| `<img src=x onerror=…>` | ❌ ne | text |
| `<script>alert(1)</script>` | ❌ ne | text |
| `"><svg onload=…>` | ❌ ne | text |
| `<a href="javascript:…">klikni</a>` | ❌ ne | text |
| `${…}` | ❌ ne | text |
| Český `& " < > ěščřž` | ❌ ne | text, diakritika/entity zachovány |

- `scriptsFired = []`, vytvořených `img/script/svg/a` elementů = **0**.
- **Cílení tlačítek i u škodlivých názvů:** smazání odebralo přesně 1 správný klíč; „Načíst" načetlo data odpovídající položky (closure funguje). ✅
- Bezpečné i **po uložení → reloadu → opětovném renderu** (reálný reload potvrzen: XSS nespuštěno, položka jen text, konzole bez chyb).
- Uživatelská data se nedostávají nebezpečně jinam: náhled promptu je `textarea.value` (bez parsování HTML), toast/hlášky jsou statické, export je JSON, chybové hlášky **nevypisují** obsah souboru.

---

## 6. Výsledky importních testů — **23/23 ✅**

validExport ✅ · invalidJson (odmítnut) ✅ · emptyFile ✅ · nullRoot (structure) ✅ · arrayRoot (structure) ✅ · stringRoot (structure) ✅ · numberRoot (structure) ✅ · noData (data) ✅ · dataNull (data) ✅ · dataArray (data) ✅ · unknownKeysIgnored ✅ · invalidEnum→default ✅ · numberAsString→number ✅ · numberGarbage→default ✅ · booleanAsString→default ✅ · longName→100 ✅ · longText→20000 ✅ · protoPayloadRoot ✅ · protoPayloadInData ✅ · partiallyValid ✅ · unicodeEmoji ✅ · allDefaultsFromEmptyData ✅ (viz P3-1).

- Importovaný objekt **není nikdy použit přímo jako stav** — vždy se sestaví nový objekt jen z allowlistu (`normalizeState`). Ověřeno čtením kódu i chováním unknown-keys.
- Žádný `Object.assign`/spread/merge nad nedůvěryhodnými daty (grep + čtení).
- Při chybě importu **zůstává stav nedotčen** (funkce vrací před `setFormState`).

---

## 7. Výsledky localStorage testů — **13/13 ✅**

Poškozený JSON stavu i presetů → fallback bez pádu ✅ · pole místo objektu → `{}` ✅ · smíšené úložiště: validní zachován, škodlivý ponechán jako bezpečná data, `badType` a prázdný název zahozeny ✅ · normalizace hodnot ✅ · limit 100 vynucen ✅ · duplicitní názvy (různé klíče) zachovány ✅ · starší validní stav načten ✅.

**Odolnost při chybě přístupu (klíčový bod):**
- `getItem` vyhodí (SecurityError / blokované úložiště) → `loadState` i `getCustomPresets` bezpečné, bez pádu ✅.
- `setItem` vyhodí (QuotaExceededError) → `saveState` i `saveCustomPresets` chybu spolknou, **nevyhodí volajícímu** ✅ — ale viz **P2-1** (falešné potvrzení úspěchu).

---

## 8. Výsledky prototype pollution testů — ✅

| Úroveň | Payload | `({}).polluted` | Výsledek |
|---|---|---|---|
| kořen importu | `{"__proto__":{…},"data":{…}}` | `undefined` ✅ | data přijata čistá |
| uvnitř `data` | `{"data":{"__proto__":{…},"constructor":{…}}}` | `undefined` ✅ | bez klíče `__proto__` ve výsledku |
| položka presetu | `{name,data:{"__proto__":…}}` | `undefined` ✅ | data normalizována |
| kolekce presetů (localStorage) | vlastní klíč `__proto__` v úložišti | `undefined` ✅ | klíč zahozen (`FORBIDDEN_KEYS`) |

- `isPlainObject` odmítá `null`, pole i objekty s nestandardním prototypem (potvrzeno). `JSON.parse` vytváří `__proto__` jako **vlastní** klíč (proto zůstává `Object.prototype`) → `isPlainObject` správně vrací `true` a nebezpečný klíč je následně buď mimo allowlist (`normalizeState`), nebo explicitně zahozen (`normalizePresetStore`).
- Žádná alternativní cesta ke kopírování nebezpečných vlastností (serializace/normalizace/ukládání) — ověřeno grepem (`Object.assign`/spread/merge/`eval`/`new Function`/`document.write` = nenalezeno mimo `{...DEFAULT_STATE}`).

---

## 9. Regresní výsledky — ✅

46 stylů = 46 snippet klíčů ✅ · změna pole typu text/checkbox/select mění prompt ✅ (`exactly`↔`approximately`, změna stylu) · statistiky znaků ✅ · reset → výchozí ✅ · vytvoření/načtení/**správné** smazání presetu ✅ · export→import round-trip (23/23) ✅ · persistence po reloadu ✅ · česká diakritika + emoji zachovány ✅ · konzole bez chyb ve všech fázích ✅ · žádné nové externí požadavky (staticky 0 externích zdrojů, žádný `fetch`/XHR) ✅.

**Vizuální/strukturní invariance `renderPresetList`:** třídy `preset-item`, `preset-item-name`, `preset-item-badge`, `preset-item-actions`, `btn btn-small` zachovány; pořadí `name → actions` zachováno; 3 odznaky „Vestavěný" u built-in; ovládání (Načíst/smazat) funkční. ✅

---

## 10. Hodnocení velikosti a přiměřenosti diffu

+304 / −86 je **přiměřené a proporční**. Cca +190 řádků tvoří nutná validační vrstva (schéma 23 polí + 6 čistých pomocných funkcí + 2 normalizátory + validátor) — to je inherentní cena explicitních allowlistů, nikoli bloat. `renderPresetList` narostl kvůli bezpečnému DOM sestavení (nahrazuje řetězcové šablony). `resetForm` se o −24 zmenšil díky `DEFAULT_STATE`. **Žádné zbytečné ani nesouvisející změny.** Kód nelze výrazně zkrátit bez oslabení bezpečnosti (allowlist by neměl být nahrazen generickou smyčkou). Komentáře vysvětlují bezpečnostní důvody, ne samozřejmosti. Žádné nové globální kolize názvů (nové identifikátory `LIMITS/ENUMS/FIELD_SCHEMA/…` jsou unikátní).

---

## 11. Přesné návrhy oprav (neblokující, pro M1B)

- **P2-1:** změnit `saveCustomPresets`/`saveState`, aby vracely `boolean` úspěch; v `saveAsPreset` a importní větvi zobrazit `„Preset byl uložen!"` jen při `true`, jinak např. `„Uložení selhalo: úložiště je plné nebo nedostupné."`
- **P3-1:** volitelně po `normalizeState` porovnat výsledek s `DEFAULT_STATE`; pokud se neliší v žádném rozpoznaném poli, informovat „Soubor neobsahoval žádná rozpoznaná nastavení."
- **P3-2:** při dosažení limitu 100 při čtení zobrazit nenápadné upozornění, případně řešit spolu s UI presetů v pozdějším milníku.

---

## 12. Doporučení ohledně commitu

**Ano — commit je bezpečné vytvořit.** Byly ověřeny všechny cíle M1A, nenalezen žádný P0/P1 problém, aplikace je funkčně i vizuálně beze změny a všechny testy prošly. Nalezené P2/P3 jsou neblokující a lze je zařadit do M1B. (Samotné vytvoření commitu ponechávám na uživateli — v této fázi jsem nic necommitoval.)

---

*Konec review. Nebyl změněn žádný soubor aplikace, nebyl vytvořen commit ani push.*
