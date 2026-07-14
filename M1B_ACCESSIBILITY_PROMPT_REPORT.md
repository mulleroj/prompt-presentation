# M1B — Přístupnost a kvalita generovaného promptu — report

> Navazuje na [`AUDIT_GENERATORU_2026.md`](AUDIT_GENERATORU_2026.md), [`M1A_SECURITY_REPORT.md`](M1A_SECURITY_REPORT.md) a [`M1A_SECURITY_REVIEW.md`](M1A_SECURITY_REVIEW.md) (ty zůstávají nezměněny).
> Větev: `feat/notebooklm-m1b-accessibility-prompt-quality` (z commitu `58a041e`). Změněn jediný soubor aplikace: **`index.html`**. Bez commitu a push.

---

## 1. Manažerské shrnutí

M1B odstraňuje hlavní přístupnostní bariéry z auditu a čistí generovaný prompt, aniž by měnil vzhled, barevnou paletu, rozložení, datový formát nebo 46 vizuálních stylů.

Přístupnost: přepínač „Úroveň omezení" je nyní plně ovladatelný klávesnicí (byl `display:none`), oba modaly mají korektní `role="dialog"` / `aria-modal` / název a plnohodnotnou správu fokusu (přesun dovnitř, focus-trap, návrat na spouštěč, Escape), přibyl viditelný focus, respekt k `prefers-reduced-motion`, přístupný live region pro stavové zprávy a přístupné popisky ovládacích prvků. Nativní `alert`/`confirm`/`prompt` byly nahrazeny jedním přístupným dialogem a nerušivým status toastem.

Prompt: surové enumové hodnoty (`Length: default`, `Knowledge level: beginner`) jsou nahrazeny přirozenými instrukcemi, trojí duplicita zákazu screenshotů je zredukována na jediný výskyt, odstraněn latentní konflikt („do not invent" vs. odpovídající checkbox), prompt je poskládán z pojmenovaných modulů bez prázdných sekcí a s jasně odděleným uživatelským obsahem.

Všechny bezpečnostní záruky z M1A byly zachovány a znovu ověřeny (XSS jen jako text, 23/23 round-trip, odmítnutí prázdného importu, ochrana proti prototype pollution, odolnost localStorage). Regrese proběhla bez chyb, konzole čistá, žádné externí požadavky.

---

## 2. Přesný rozsah změn

Jediný změněný soubor: **`index.html`** (`git diff --stat` proti `58a041e`: **+417 / −129**, pouze tento soubor).

- **CSS:** přístupný přepínač (bez `display:none`), focus-visible pro tlačítka/selecty/checkboxy, `.sr-only` utilita, chybová varianta toastu, `@media (prefers-reduced-motion: reduce)`, transition overlaye jen na `opacity` (viz §3).
- **HTML:** `aria-label` selectu presetů, `role="radiogroup"` + `aria-labelledby` přepínače, live region toastu, sémantika modalu správy presetů + přístupný název tlačítka zavřít, nový generický přístupný dialog `#appDialog`.
- **JS:** `showStatus`, `getFocusable`, `trapFocus`, `showDialog` (Promise-based), správa fokusu modalu, náhrada `alert`/`confirm`/`prompt`, přepis `generatePrompt` (mapování enumů, deduplikace, moduly), mapovací tabulky `FORMAT_/LENGTH_/KNOWLEDGE_PROMPT_LABELS`, `aria-label` tlačítka smazat.

Beze změny: barevná paleta, layout, 46 stylů a jejich názvy, datový formát presetů/`localStorage`, veškerá validační/bezpečnostní vrstva M1A.

---

## 3. Opravy přístupnosti

| Oblast | Před | Po |
|---|---|---|
| Přepínač „Úroveň omezení" | `display:none` na radiích → nedosažitelné klávesnicí | Vizuálně skryté, ale **fokusovatelné** nativní radio (`position:absolute; opacity:0`), viditelný focus ring na labelu, `role="radiogroup"` s názvem „Úroveň omezení", stav (checked) i názvy voleb exponované čtečce |
| Modal správy presetů | Bez ARIA, bez správy fokusu | `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, přístupný název tlačítka „Zavřít dialog", fokus přesunut dovnitř, **focus-trap** na Tab, návrat fokusu na spouštěč, Escape zavírá, klik mimo zavírá |
| Fokus / klávesnice | Bez viditelného focusu u tlačítek | `:focus-visible` obrys pro `.btn`, `.modal-close`, `select`, checkboxy; žádné kladné `tabindex`; žádné klikatelné `<div>` (vše nativní prvky); pořadí fokusu = vizuální tok |
| Reduced motion | Neřešeno | `@media (prefers-reduced-motion: reduce)` vypíná animace/přechody a plynulé scrollování, stav zůstává okamžitě čitelný |
| Stavové zprávy | Blokující `alert` | Nerušivý toast, který je zároveň **live region** (`role="status"`, `aria-live="polite"`, chyby `assertive`) |
| Dekorativní / popisky | Emoji tlačítko smazat bez názvu | Tlačítko smazat má `aria-label` „Smazat preset {název}"; select presetů má `aria-label` |

**Poznámka k `visibility`:** transition overlaye byl zúžen z `all` na `opacity`, aby se `visibility` přepínala okamžitě a dialog byl fokusovatelný ve stejném ticku, kdy se zobrazí (jinak `element.focus()` selhal, dokud probíhal přechod). Vizuální fade-in přes `opacity` a pop `.modal` přes `transform` zůstávají.

---

## 4. Změny dialogů

Zavedena jedna přístupná náhrada (`showDialog`, Promise-based) + nerušivý `showStatus`.

| Místo | Před | Po |
|---|---|---|
| Zadání názvu presetu (uložení) | `prompt()` | Přístupný dialog s popsaným polem, Enter potvrdí, Escape zruší, fokus dovnitř/zpět |
| Import – „uložit jako nový preset?" | `confirm()` | Přístupný dialog (Uložit jako preset / Jen načíst) |
| Import – název presetu | `prompt()` | Přístupný dialog s polem |
| Smazání presetu | `confirm()` | Přístupný potvrzovací dialog (vědomé potvrzení zachováno), po smazání fokus na tlačítko zavřít |
| Reset | `confirm()` | Přístupný potvrzovací dialog |
| Úspěch/chyba (uložení, import, kopírování, mazání) | `alert()` | `showStatus()` – viditelný toast + oznámení čtečce |

**Zachováno:** vědomé potvrzení u smazání i resetu; bezpečná validace názvu z M1A (`normalizeString`, limit 100) beze změny; jména jdou výhradně přes `textContent` → XSS cesta se znovu neotevřela. **Žádné nativní `alert`/`confirm`/`prompt` v kódu nezůstaly.**

---

## 5. Změny struktury promptu

Prompt se skládá z pojmenovaných modulů přidávaných podmíněně; prázdná sekce se nikdy nevypíše (pomocná funkce `section()` přeskočí header bez položek). Stabilní pořadí:

1. Role a hlavní úkol
2. Presentation Topic (jen když je téma/cíl – uživatelský obsah označen „provided by the user")
3. Audience & Purpose
4. Language & Length
5. Slide Structure
6. Visual Style
7. Text & Readability *(nová sekce – pravidla čitelnosti a množství textu z auditu)*
8. Image Rules (deduplikované)
9. Terminology & Notes (jen když je obsah)
10. Závěrečná kontrola konzistence + uzávěr

Uživatelské hodnoty jsou jasně odděleny od instrukcí generátoru (vlastní sekce, popisky „provided by the user"), takže se obsah nezamění za systémovou instrukci. Bezpečnost vkládání z M1A (výstup do `textarea.value`, ne `innerHTML`) je zachována.

---

## 6. Mapování enumů na uživatelské instrukce

Interní klíče se už do promptu nikdy nevypisují syrově. České UI nadále generuje anglický prompt (současný záměr).

| Pole | Klíč | Instrukce v promptu |
|---|---|---|
| deckFormat | `Presenter Deck` | „Presenter deck – concise slides paired with separate speaker notes." |
| deckFormat | `Detailed Deck` | „Detailed deck – slides carry the full explanation on their own." |
| deckLength | `short` | „Keep the deck concise – include only the most essential points." |
| deckLength | `default` | „Use a balanced length appropriate to the source material." |
| deckLength | `long` | „Create a more thorough deck with enough depth and explanation." |
| knowledgeLevel | `beginner` | „…for beginners with little or no prior knowledge." |
| knowledgeLevel | `intermediate` | „…for an audience with some background knowledge." |
| knowledgeLevel | `advanced` | „…for an advanced, well-informed audience." |

Výchozí hodnota už negeneruje technický balast (`default` → smysluplná věta). `outputLanguage` obsahuje čitelné názvy jazyků (Czech/English/…), mapování nepotřebuje; `custom` používá zadaný jazyk.

---

## 7. Odstraněné duplicity a konflikty

- **Trojí zákaz screenshotů/UI → jednou.** Dříve se objevoval až 3× (checkbox `noScreenshots` v „Slide Structure", výchozí text `visualConstraints`, přísný režim „no UI-like elements"). Nyní: uživatelská volná omezení (`visualConstraints`) se respektují doslovně; kanonické „No screenshots, UI mockups, or interface elements." se přidá **jen když** je uživatel sám nezmiňuje (cílená kontrola známého konceptu `/screenshot/i`, nikoli náhodné porovnávání vět); přísný režim přidává už jen skutečně nové položky (gradients, logos, brand marks) – bez opakování UI/screenshotů.
  - Ověřeno: v minimálním, běžném i plně vyplněném scénáři se slovo „screenshot" objevuje **právě 1×**.
- **Odstraněn konflikt „do not invent".** Úvodní věta dříve tvrdila „do not invent content beyond the sources" natvrdo; to duplikovalo a při **vypnutém** `noInventedFacts` odporovalo. Nově řídí toto pravidlo výhradně příslušný checkbox (jednou, podmíněně).
- **Konsolidace obrazových pravidel** do jediné sekce „Image Rules" (dříve rozprostřené mezi „Slide Structure" a „Visual & Style Guidelines").

Deduplikace je založená na pojmenovaných modulech a podmíněném přidávání známých pravidel – ne na obecném porovnávání textů.

---

## 8. Porovnání délky promptu (před / po)

| Scénář | Před | Po | Rozdíl |
|---|---|---|---|
| A – minimální formulář (výchozí, bez tématu) | 1141 | 1424 | +283 |
| B – běžná učitelská prezentace | 1234 | 1614 | +380 |
| C – plně vyplněný + přísný + dlouhý snippet + terminologie | 1395 | 1743 | +348 |

**Zdůvodnění nárůstu (jasný důvod, ne balast):**
1. Surové enumy nahrazeny přirozenými instrukcemi (delší, ale srozumitelné – přímý cíl auditu).
2. Nová sekce **Text & Readability** (2 řádky) – pravidla čitelnosti/množství textu vyžadovaná auditem.
3. Plnější úvodní rámování role a úkolu.

**Úspora z deduplikace** (screenshoty 3×→1×, odstranění konfliktu) snížila opakování, ale je menší než přínos výše. Podstatné instrukce se neztratily, prompt zůstává čitelný a ručně upravitelný. Výsledek je delší, ale s doložitelným přínosem srozumitelnosti.

---

## 9. Accessibility testy (runtime v prohlížeči)

- **Přepínač:** fokusovatelný (`display !== none`), `role="radiogroup"` s názvem „Úroveň omezení", volby „Normální/Přísná" pojmenované, stav checked exponován, klik na label aktivuje volbu a promítne se do promptu. ✅
- **Modal správy presetů:** `role=dialog`, `aria-modal=true`, `aria-labelledby`, přístupný název zavíracího tlačítka; fokus přesunut dovnitř; Escape zavírá; návrat fokusu na spouštěč. ✅
- **Generický dialog:** `role=dialog`, `aria-modal`, `aria-labelledby`+`aria-describedby`; fokus na pole/tlačítko; **focus-trap** (Tab z posledního → první ověřeno); Enter potvrdí, Escape zruší; návrat fokusu. ✅
- **Live region:** `role="status"`, `aria-live="polite"` (chyby `assertive`); zprávy se nastavují textem → oznámení čtečce. ✅
- **Klávesnice:** žádné kladné `tabindex`, žádné klikatelné `<div>` (vše nativní), pořadí fokusu odpovídá vizuálu. ✅
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` přítomen a efektivní (`transition-duration: 0`). ✅

*Poznámka k prostředí:* headless testovací okno hlásí `document.hasFocus() === false`; přesto se ověřilo, že `element.focus()` mění `activeElement` u viditelných prvků a že se fokus korektně přesouvá do dialogů, uvnitř se drží (trap) a vrací na spouštěč.

---

## 10. Regresní testy

46 stylů = 46 snippet klíčů ✅ · změna pole (text/checkbox/select/toggle) mění prompt ✅ · generování promptu ✅ · kopírování (status) ✅ · reset (dialog + status) ✅ · vytvoření presetu (dialog) ✅ · načtení **správného** presetu ✅ · smazání **správného** presetu (dialog, potvrzení i zrušení) ✅ · export ✅ · import validního exportu ✅ · persistence po **reálném reloadu** (topic, počet slidů, délka, přísný režim) ✅ · česká diakritika + emoji zachovány ✅ · **konzole bez chyb** ✅ · **žádné nové externí požadavky** ✅.

---

## 11. Zopakované bezpečnostní testy M1A

- XSS: název presetu `<img src=x onerror=…>` se po uložení, reloadu i renderu zobrazí **jen jako text**, žádný `img`/`script` element, skript se nespustí. ✅
- Export/import round-trip: **23/23** polí přesná shoda (vč. Unicode/emoji). ✅
- Import bez podporovaných polí (`{data:{}}`, jen neznámé klíče) → **odmítnut** (`reason:'empty'`). ✅
- Prototype pollution payload → `({}).polluted === undefined`, výsledek bez klíče `__proto__`. ✅
- Selhání zápisu localStorage → `saveState`/`saveCustomPresets` vrací `false`, bez pádu, bez falešného potvrzení (nyní přes `showStatus` chybová varianta). ✅
- Poškozený `localStorage` → aplikace se načte s výchozími hodnotami, bez pádu. ✅

---

## 12. Známá omezení

- **Náhrada nativních dialogů je hotová v prioritních tocích** (název presetu, potvrzení smazání, reset, import, stavové zprávy). Jiné jednoduché akce nativní dialog nepoužívaly.
- **Dekorativní emoji v hlavičkách sekcí** (`<span>📤</span>` apod.) zůstávají v accessibility tree jako drobný text navíc; nejde o interaktivní prvky ani o WCAG selhání. Ponecháno pro M2 (spolu s případným povýšením hlaviček sekcí na skutečné nadpisy).
- **Kontrast pomocných textů** (`--text-muted`) je stále hraniční pro drobné písmo – řešení patří do vizuálního redesignu M2 (změna palety je mimo rozsah M1B).
- **Zavírání modalu klikem mimo** je ponecháno (žádná neuložená práce se neztrácí); u zadávání názvu presetu vede klik mimo / Escape ke zrušení akce, což je očekávané.
- **Délka promptu vzrostla** (viz §8) – záměrně, kvůli srozumitelnosti a pravidlům čitelnosti.
- **P3-2 z M1A** (tiché oříznutí na 100 presetů) zůstává známým omezením, M1B se ho nedotýká.

---

## 13. Doporučení pro M2 (redesign)

1. **Světlý, přívětivý vizuál** (mimo „vývojářskou konzoli"), podpora světlého i tmavého režimu, vyřešení kontrastu pomocných textů – teprve zde měnit paletu.
2. **Hlavičky sekcí jako skutečné nadpisy** (`<h2>`/`<h3>`) + `aria-hidden` na dekorativní emoji.
3. **Průvodce ve 3 krocích** a **galerie stylů** (nad datovou architekturou stylů z auditu).
4. **Kategorie/filtr/hledání** stylů, doporučení stylu, jednoduchý/pokročilý režim.
5. Zvážit vizuální rozlišení „polite" a „error" toastu i barevně sladit s novou paletou.

---

## Post-review opravy M1B.1

Navazuje na nezávislou review [`M1B_ACCESSIBILITY_PROMPT_REVIEW.md`](M1B_ACCESSIBILITY_PROMPT_REVIEW.md), která označila **P3-1** (poznámky pro přednášejícího v popisu formátu i při vypnutém checkboxu) a **P3-2** (leak interní hodnoty `custom` u prázdného vlastního jazyka). Obojí opraveno. Změněn pouze `index.html` a tento report. Beze změny dialogového systému, vzhledu, layoutu, přístupnosti, datového formátu a 46 stylů.

### Odstranění nekonzistence speaker notes (P3-1)

Popis formátu byl **oddělen** od pravidla o poznámkách. `FORMAT_PROMPT_LABELS` nyní popisuje **jen formát** a nezmiňuje speaker notes u žádné hodnoty:
- `Presenter Deck` → „Presenter deck – concise slides that support a spoken presentation." (dříve „…paired with separate speaker notes.")
- `Detailed Deck` → beze změny (poznámky nezmiňoval).

Jediným zdrojem instrukce o poznámkách zůstává podmíněné pravidlo v sekci „Slide Structure" (`state.speakerNotes ? '- Include detailed speaker notes for each slide.' : ''`). Řešení je principiální (oddělení popisu formátu od volitelného pravidla), platí pro **všechny** hodnoty formátu, ne jen pro jednu.

**Chování speaker notes:**
- Poznámky **zapnuté** → informace o speaker notes je v promptu **právě jednou** (v „Slide Structure").
- Poznámky **vypnuté** → speaker notes **nejsou nikde** (ani v popisu formátu).
- Popis formátu nadále smysluplně vysvětluje formát; žádná prázdná sekce, žádná duplicita.

### Chování prázdného vlastního jazyka (P3-2)

Výpočet jazyka upraven: u `outputLanguage === 'custom'` se vlastní jazyk **ořízne** (`trim`); je-li výsledek prázdný, **řádek „Output language" se vynechá** (jazyk se řídí zdrojovým obsahem). Interní hodnota `custom` se do promptu nikdy nedostane. Řádek se vkládá podmíněně, takže sekce „Language & Length" zůstává neprázdná (obsahuje Format + Length). Nebyl přidán žádný nový validační systém ani modal.

**Chování vlastního jazyka:**
- `custom` + neprázdná hodnota → použije zadaný (oříznutý) jazyk.
- `custom` + prázdná / jen whitespace hodnota → žádná konkrétní jazyková instrukce, žádné `custom`.
- Standardní jazyky → stávající mapování beze změny.

### Výsledky cílených testů (runtime)

**Speaker notes:**
- Presenter Deck + ON → „speaker notes" 1× ✅ · Presenter Deck + OFF → 0× ✅
- Detailed Deck + ON → 1× ✅ · Detailed Deck + OFF → 0× ✅
- Popisy formátu smysluplné, žádná prázdná sekce ✅

**Vlastní jazyk:**
- `custom` + „Slovenština" → „- Output language: Slovenština.", bez slova `custom` ✅
- `custom` + „  Deutsch  " → oříznuto na „Deutsch" ✅
- `custom` + prázdné → řádek vynechán, žádné `custom` ✅
- `custom` + jen whitespace → žádné `custom` ✅
- Czech/English/German/French/Spanish → mapování funkční ✅
- Sekce „Language & Length" u prázdného custom zůstává neprázdná ✅

**Regrese:** 46 stylů validní prompt (bez `undefined`/`null`/syrového `default`) ✅ · screenshot právě 1× ✅ · vypnutá volitelná pravidla se nevypisují ✅ · round-trip 23/23 ✅ · prázdný import odmítnut ✅ · prototype pollution `({}).polluted === undefined` ✅ · XSS jen text ✅ · dialogy a focus management nedotčené ✅ · konzole bez chyb ✅ · 0 externích požadavků ✅.

### P3-3 a P3-4 — nezměněno

Nálezy **P3-3** (re-entrance sdíleného `#appDialog`) a **P3-4** (klik mimo dialog zahodí rozepsaný název) **nebyly v tomto kroku měněny** — ponechány jako známá omezení pro pozdější milník.

---

*Konec reportu M1B (vč. M1B.1). Změněn pouze `index.html` a tento report. Nebyl vytvořen commit ani push.*
