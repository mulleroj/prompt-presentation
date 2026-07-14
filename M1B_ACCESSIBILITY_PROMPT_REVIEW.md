# M1B — Nezávislá code review

> Nezávislá kontrola milníku **M1B — Přístupnost a kvalita generovaného promptu** na větvi `feat/notebooklm-m1b-accessibility-prompt-quality` (základ `58a041e`). Tvrzení z [`M1B_ACCESSIBILITY_PROMPT_REPORT.md`](M1B_ACCESSIBILITY_PROMPT_REPORT.md) byla brána jen jako seznam deklarací; vše ověřeno přímo v kódu a runtime v prohlížeči. V této fázi nebyl změněn žádný soubor aplikace, nebyl vytvořen commit ani push.

---

## 1. Verdikt

### ✅ PASS WITH MINOR FIXES

Všechny hlavní cíle M1B jsou splněny a runtime ověřeny: přístupnost ovládání, správa fokusu, náhrada nativních dialogů, mapování enumů, deduplikace, modulární struktura promptu. Zachovány vzhled, layout, datový formát, 46 stylů i celá bezpečnost M1A. **Nenalezen žádný P0/P1/P2 problém.** Nalezeny pouze **4× P3** (neblokující). **Commit je bezpečné vytvořit.**

---

## 2. Rozsah kontrolovaného diffu

`git diff` proti `58a041e`: jediný změněný soubor **`index.html`**, **+417 / −129**, `git diff --check` bez nálezů. Nový soubor: `M1B_ACCESSIBILITY_PROMPT_REPORT.md`.

Ověřeno:
- Všechny změny patří do rozsahu M1B (CSS přístupnosti, ARIA/HTML, dialog systém, přepis `generatePrompt`, mapovací tabulky, správa fokusu). **Žádný nesouvisející refactoring.**
- **Vzhled/layout** změněn jen v rámci nutných a11y oprav (focus-visible, sr-only, is-error toast, transition overlaye `all`→`opacity`). Paleta nezměněna.
- **Datový formát presetů** (`{name,data}`, klíče `_state_v2`/`_presets_v2`) nezměněn.
- **46 stylů** zachováno (46 option = 46 snippet klíčů, identity beze změny).
- **Bezpečnost M1A** (allowlist import, `normalizeString`, `textContent` render) nedotčena.

---

## 3. Nálezy P0–P3

**P0 / P1 / P2 — žádné.**

**P3 (neblokující):**
- **P3-1 — Popis formátu zmiňuje „speaker notes" i při vypnutém checkboxu.** `FORMAT_PROMPT_LABELS['Presenter Deck']` = „…paired with separate speaker notes." se do promptu vloží vždy pro Presenter Deck, i když uživatel odškrtne „poznámky pro přednášejícího". Mírná nekonzistence (pravidlo vypnuté v UI zůstává naznačené v promptu). Zavedeno M1B. *Návrh:* neutrální popis formátu bez zmínky o poznámkách, nebo klauzuli o poznámkách přidat jen když je checkbox zapnutý.
- **P3-2 — Okrajový leak `custom` jazyka.** Při `outputLanguage='custom'` a prázdném vlastním jazyce prompt vypíše „Output language: custom." (interní hodnota). Pre-existující (ne z M1B), ale mimo pokrytí mapování. *Návrh:* při prázdném custom použít výchozí jazyk nebo řádek vynechat.
- **P3-3 — Sdílený `#appDialog` není re-entrantní.** Dva souběžné `showDialog()` by naskládaly posluchače na stejné prvky. Přes UI nespustitelné (všichni volající `await`ují a overlay blokuje interakci), pouze robustnostní poznámka.
- **P3-4 — Klik mimo dialog zahodí rozepsaný název presetu.** U zadávání názvu (uložení/import) klik na overlay = zrušení a ztráta rozepsaného textu; u destruktivních potvrzení (smazání/reset) je klik-mimo = bezpečné zrušení. Chování běžné u dialogů, ale u zadávání názvu může překvapit.

Žádný z těchto nálezů neblokuje commit.

---

## 4. Dialogy a focus management

`showDialog` ověřen přímo (ne přes wrapper):

| Scénář | Výsledek |
|---|---|
| Vstupní dialog, potvrzení | vrací zadaný řetězec (`'hello'`) ✅ |
| Vstupní dialog, Escape | vrací `null` ✅ |
| Potvrzovací dialog, potvrzení | vrací `true` ✅ |
| Potvrzovací dialog, zrušení / tlačítko × | vrací `false` ✅ |
| Enter ve vstupu | potvrdí **jednou** (žádné zdvojení), vytvoří 1 preset ✅ |
| Opakovaný rychlý Enter | další stisky bez efektu (posluchače odebrány) ✅ |
| Focus při otevření | na vstup (input dialog) / potvrzovací tlačítko ✅ |
| Focus trap Tab / Shift+Tab | cyklí uvnitř (poslední→první ověřeno) ✅ |
| Návrat fokusu po zavření | na spouštěč; po smazání na tlačítko „Zavřít" modalu ✅ |
| Reuse dialogu | title/message/input/hodnota se resetují, **žádný stale stav** ✅ |
| Zavřený dialog | nezachytává klávesy ✅ |
| Odstraněný spouštěč (smazaný řádek) | bez chyby, fokus přesunut na modal-close ✅ |

Modal správy presetů: fokus dovnitř, Escape zavírá, klik mimo zavírá, návrat fokusu na spouštěč — ověřeno. Redundantní globální Escape handler odstraněn, řeší per-modal listenery.

*Pozn.:* headless okno hlásí `document.hasFocus()===false`; potvrzeno, že `focus()` u viditelných prvků mění `activeElement` a že přesun/trap/návrat fokusu fungují. Některé prvotní aserce „false" byly artefakty testu (await na wrapper funkci vracející `undefined`, ne na `showDialog`) — po opravě testu vše zeleně.

---

## 5. Klávesnice

- Žádné kladné `tabindex`. ✅
- Žádný klikatelný `<div>` bez klávesnicového ovládání (všechny `onclick` na nativních prvcích). ✅
- Přepínač „Úroveň omezení": radia fokusovatelná (`display!==none`), v pořadí tabulátoru, klik na label aktivuje volbu a promítne se do promptu, nativní chování (mezerník/šipky) zachováno. ✅
- Enter/Escape v dialozích předvídatelné (viz §4). ✅
- Focus-visible obrysy pro `.btn`, `.modal-close`, `select`, checkboxy. ✅

---

## 6. ARIA a live regiony

- Oba modaly: `role="dialog"`, `aria-modal="true"`, platný `aria-labelledby` (dialog i `aria-describedby`), přístupný název zavíracího tlačítka „Zavřít dialog". Všechna ID resolují, **žádné duplicitní ID**. ✅
- Přepínač: `role="radiogroup"` + `aria-labelledby` → „Úroveň omezení"; volby pojmenované, stav `checked` exponován. ✅
- Live region (`#copyFeedback`): `role="status"`, `aria-live="polite"`, `aria-atomic`; text nastavován přes `textContent` (re-oznámení i pro stejný text díky clear+reflow+set). ✅
- Chyby: `showStatus(msg, true)` → `aria-live="assertive"` + `.is-error` (červený toast). Úspěch → `polite`, bez `is-error`. Ověřeno: chyba kopírování označena jako chyba, úspěch jako polite. ✅
- Skrytý dialog (`visibility:hidden`) není v aktivním accessibility tree. ✅

---

## 7. Reduced motion

`@media (prefers-reduced-motion: reduce)` přítomen a efektivní: `animation-duration`/`transition-duration: 0.001ms !important`, `animation-iteration-count: 1 !important`, `scroll-behavior: auto !important` na `*`/`::before`/`::after`. Nevypíná stavové indikátory (mění se opacity/třídy, jen bez animace). Overlaye mají `visibility` instantní (transition jen `opacity`), takže se dialog otevře okamžitě a je fokusovatelný — v reduced-motion i mimo něj. Layout se nerozbije. ✅

---

## 8. Tabulka enumových mapování

| Pole | DOM hodnota | CZ popisek | Výsledná instrukce | Výsledek |
|---|---|---|---|---|
| deckFormat | `Presenter Deck` | Presenter Deck (s poznámkami) | „Presenter deck – concise slides paired with separate speaker notes." | ✅ (viz P3-1) |
| deckFormat | `Detailed Deck` | Detailed Deck (podrobný) | „Detailed deck – slides carry the full explanation on their own." | ✅ |
| deckLength | `short` | Krátká | „Keep the deck concise…" | ✅ |
| deckLength | `default` | Standardní | „Use a balanced length appropriate to the source material." | ✅ |
| deckLength | `long` | Dlouhá | „Create a more thorough deck…" | ✅ |
| knowledgeLevel | `beginner` | Začátečník | „…beginners with little or no prior knowledge." | ✅ |
| knowledgeLevel | `intermediate` | Středně pokročilý | „…an audience with some background knowledge." | ✅ |
| knowledgeLevel | `advanced` | Pokročilý | „…an advanced, well-informed audience." | ✅ |
| outputLanguage | Czech/English/German/French/Spanish | — | čitelný název jazyka (verbatim) | ✅ |
| outputLanguage | `custom` (prázdné pole) | Vlastní… | „Output language: custom." | ⚠ P3-2 |
| atmosphere | 10 hodnot | — | `ATMOSPHERE_SNIPPETS` (všech 10) | ✅ |
| themePack | 8 hodnot | — | `THEME_PACK_SNIPPETS` (všech 8) | ✅ |
| constraintLevel | `normal` | Normální | (bez řádku) | ✅ |
| constraintLevel | `strict` | Přísná | „Strict mode: no gradients, no logos, and no brand marks." | ✅ |
| illustrationPreset | 46 hodnot | — | `ILLUSTRATION_SNIPPETS` (všech 46) | ✅ |

Žádná platná UI hodnota nechybí v mapování; žádná zastaralá hodnota nezpůsobí chybu (fallback `|| state.x`). Ověřeno 18 kombinací formát×délka×znalost → **0 syrových enum leaků** (kromě okrajového `custom`).

---

## 9. Kontrola všech 46 stylů

Programově vygenerován prompt pro každý z 46 stylů:
- Všech 46 má odpovídající snippet (46 = 46). ✅
- Žádný prompt neobsahuje `undefined`/`null`/`NaN`. ✅
- Snippet stylu je vždy přítomen (deduplikace ho neodstraní – týká se jen obrazových omezení, ne stylu). ✅
- Žádná prázdná sekce ani hlavička bez těla. ✅
- Nejdelší snippet (`metaphor-driven`, 100 znaků) nezpůsobí poškozené formátování. ✅
- Zákaz fotografií/ikon pochází z pole `visualConstraints` (uživatelsky editovatelné), ne z automatiky vázané na styl → **žádný styl vyžadující ikonografii (`infographic-clean`, `concept-map`, …) nedostává vynucený zákaz ikon nezávisle na UI**. ✅
- Zákaz screenshotů se objevuje **nejvýše 1×**. ✅

**Žádný konfliktní styl nenalezen.**

---

## 10. Duplicity a konflikty promptu

Počty výskytů konceptů (výchozí + přísný režim):

| Koncept | Výskyt | Posouzení |
|---|---|---|
| screenshot | 1 | ✅ (dříve až 3×) |
| UI/interface/UI-like | 0 samostatně | ✅ konsolidováno |
| photo | 1 | ✅ (z uživatelských omezení) |
| icon | 1 | ✅ |
| „do not invent" / „grounded" | 1 řádek | ✅ (počet 2 byl artefakt regexu – jedna věta) |
| one main idea | 1 | ✅ |
| speaker notes | 2 | ⚠ P3-1 (formát + checkbox); při vypnutém checkboxu zůstává 1× v popisu formátu |
| readability | 2 | ✅ záměrné (2 pravidla) |
| language / audience | 1 / 2 | ✅ různý kontext, ne duplicita |

Vypnutá pravidla ověřena: `noInventedFacts` OFF → 0×, `oneIdea` OFF → 0×, `speakerNotes` OFF → 0× (mimo popis formátu, viz P3-1), `noScreenshots` OFF + prázdné vc → 0×. Sekce „Image Rules" se při prázdném obsahu vynechá. Deduplikace je založená na pojmenovaných modulech + cílené kontrole známého konceptu (`/screenshot/i`), ne na náhodném porovnávání vět.

---

## 11. Porovnání délky a kvality promptu

| Scénář | Před (58a041e) | Po M1B |
|---|---|---|
| A – minimální | 1141 | 1424 |
| B – běžná učitelská | 1234 | 1602 |
| C – plně vyplněný + přísný | 1395 | 1724 |
| D – nejdelší snippet (`metaphor-driven`) | — | 1517 |
| E – styl s ikonami (`infographic-clean`) | — | 1507 |

Nárůst je **odůvodněný**: mapování surových enumů na přirozené instrukce (delší, ale srozumitelné), nová sekce „Text & Readability" (pravidla čitelnosti z auditu), plnější rámování role. Deduplikace opakování snížila, ale méně, než přidaná srozumitelnost. Prompt zůstává čitelný a ručně editovatelný, podstatné informace nejsou utopeny (uživatelský obsah je nahoře a explicitně označen). Generické formulace jsou minimální a účelné; jediná diskutabilní věta „Ensure text stays clearly legible against the illustrations." je pro ilustračně zaměřený nástroj relevantní.

---

## 12. Výsledky bezpečnostních retestů M1A

- XSS přes názvy presetů (`<img onerror>`, `<script>`) → nespuštěno, 0 injektovaných elementů, jen text. ✅
- Export/import round-trip **23/23** polí (vč. Unicode/emoji). ✅
- Import bez podporovaných polí (`{data:{}}`, jen neznámé klíče) → odmítnut (`empty`). ✅
- Prototype pollution na kořeni, v `data`, v položce i kolekci presetů → `({}).polluted === undefined`. ✅
- Selhání zápisu localStorage → `saveState`/`saveCustomPresets` vrací `false` (bez falešného potvrzení – nyní chybová varianta `showStatus`). ✅
- Poškozený localStorage → bez pádu, výchozí hodnoty. ✅
- Limit 100 presetů zachován. ✅
- Validace/ořez názvu presetu (100) zachována i v novém dialogu; prázdný název neuloží. ✅

---

## 13. Regresní výsledky

46 = 46 stylů ✅ · typy polí (text/number/select/checkbox/toggle) mění prompt ✅ · generování ✅ · kopírování úspěch (polite) i chyba (assertive/is-error) ✅ · reset potvrzený i zrušený ✅ · vytvoření presetu potvrzené i zrušené ✅ · validace názvu (prázdný odmítnut, dlouhý ořezán) ✅ · načtení správného presetu ✅ · smazání potvrzené i zrušené ✅ · export ✅ · import bez uložení i s uložením ✅ · reload + persistence (topic/slidy/strict) ✅ · diakritika + emoji ✅ · **konzole bez chyb** ✅ · **0 externích požadavků** ✅.

**Celkem provedeno ~130 runtime asercí; 0 skutečných selhání** (prvotní „false" aserce byly artefakty testu a po opravě potvrzeny jako korektní chování).

---

## 14. Velikost diffu

+417 / −129 v jediném souboru je **přiměřené** rozsahu milníku: ~150 řádků dialog/focus infrastruktura + ~90 řádků přepis `generatePrompt` do modulů + a11y CSS/HTML. Bez zbytečného balastu, bez plošného refactoringu, bez frameworku/závislostí. Kód je čitelný, komentáře vysvětlují bezpečnostní/a11y důvody. Žádné nové globální kolize (nové identifikátory `showDialog`, `showStatus`, `getFocusable`, `trapFocus`, `*_PROMPT_LABELS` unikátní).

---

## 15. Přesná doporučení oprav (neblokující, pro M1B.1 nebo M2)

1. **P3-1:** upravit `FORMAT_PROMPT_LABELS` na neutrální popis, nebo klauzuli o poznámkách přesunout pod podmínku `state.speakerNotes` (odstraní nekonzistenci při vypnutém checkboxu).
2. **P3-2:** v `generatePrompt` ošetřit `outputLanguage==='custom' && !customLanguage` – použít výchozí jazyk nebo řádek vynechat.
3. **P3-3:** volitelně chránit `showDialog` proti re-entranci (např. brzký návrat, pokud je `#appDialog` již `visible`).
4. **P3-4:** zvážit vypnutí zavírání klikem mimo u dialogu se zadáváním názvu (u destruktivních potvrzení klik-mimo = zrušení je v pořádku).

---

## 16. Doporučení ohledně commitu

**Ano — commit je bezpečné vytvořit.** Všechny cíle M1B ověřeny, nenalezen žádný P0/P1/P2, bezpečnost M1A zachována, aplikace funkčně i vizuálně konzistentní. Nalezené P3 jsou drobné a lze je zařadit do M1B.1/M2. Samotný commit ponechávám na uživateli – v této fázi jsem nic necommitoval.

---

*Konec review. Nebyl změněn žádný soubor aplikace, nebyl vytvořen commit ani push.*
