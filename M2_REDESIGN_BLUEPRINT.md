# M2 — Redesign Blueprint (produktový, UX a vizuální návrh)

> **Návrhový milník M2A. Žádná implementace.** Jediný nový soubor je tento dokument. `index.html` ani jiné soubory nejsou měněny, není vytvořen commit ani push.
>
> **Konvence spolehlivosti:**
> - ✅ **Ověřeno** — potvrzeno v aktuálním kódu `index.html` (commit `f8a81bc`) a runtime testy v této session (M1A/M1B).
> - 🎯 **Návrh** — doporučená změna pro M2.
> - ⏳ **Odloženo** — vědomě mimo M2, pro pozdější milník.
>
> Větev: `feat/notebooklm-m2-teacher-redesign` (z `f8a81bc`).

---

## 1. Manažerské shrnutí

Aplikace po M1A/M1B funguje spolehlivě, bezpečně a přístupně, ale její **produktová vrstva je pořád „nástroj pro techniky"**: tmavé IDE ladění, devět rovnocenných sekcí najednou a 46 stylů v jednom rozbalovacím seznamu. Pro hlavní cílovou skupinu — učitele bez znalosti prompt engineeringu a designu — je první dojem zahlcující a chybí vedení „co dělat první".

M2 navrhuje **evoluci, ne přepis**: zachovat osvědčené jádro (lokální statický web, živé generování, presety, 46 stylů, bezpečnost a přístupnost z M1A/M1B) a přidat přes něj přívětivou vrstvu:

1. **Jednoduchý režim ve 4 krocích** (Obsah → Publikum a účel → Vzhled → Výsledek) s bezpečnými pedagogickými výchozími hodnotami, plus **Pokročilé nastavení** pro zkušené.
2. **Galerii stylů s kategoriemi, filtrem a hledáním** místo dlouhého `<select>`, postavenou nad novým datovým modelem stylu.
3. **Lokální pravidlové doporučení stylu** (bez AI, bez sítě) s vysvětlením důvodu.
4. **Světlý, adaptivní, důvěryhodný vizuál** s jasnou typografickou hierarchií.
5. **Bezpečnější model náhledu promptu** (auto-náhled + ochrana ručních úprav).

Doporučený směr: **hybridní informační architektura** (kroky navádějí, ale vše je na jedné stránce s živým náhledem), **adaptivní světlé téma**, **rozdělení `index.html` do několika souborů bez frameworku**, a **postupné milníky M2B–M2F** s malým prvním diffem (vizuální systém + layout), který nezmění žádnou funkčnost.

---

## 2. Ověřený popis současného toku (✅)

Ověřeno z kódu `f8a81bc` a runtime testů v této session.

**Struktura obrazovky (desktop):** hlavička (název + podnadpis + `#presetSelect` + „Spravovat"), dvoupanelový `main` — vlevo `form-panel` (šířka 52 %, min 420 px, max 640 px, vlastní scroll), vpravo `output-panel` s `#generatedPrompt` (readonly textarea) + „Tipy". Dole `action-bar` s tlačítky Kopírovat / Reset / Uložit preset / Načíst preset / Export JSON / Import JSON.

**Formulář = 9 sekcí, všechny viditelné najednou:** (1) Nastavení výstupu (formát, délka, jazyk + vlastní jazyk), (2) Hlavní obsah (téma, cíl, cílová skupina, úroveň znalostí, počet slidů), (3) Pravidla pro slidy (5 checkboxů + odrážky), (4) Vizuální styl (jeden `<select>` se 46 styly v 7 optgroup), (5) Atmosféra (10 hodnot), (6) Vizuální konzistence (checkbox), (7) Vizuální omezení (textarea + toggle Normální/Přísná), (8) Tematický balíček (8 hodnot), (9) Pravidla terminologie (checkbox + textarea).

**Tok (ověřeno):**
1. První otevření → tmavá obrazovka, formulář předvyplněný výchozími hodnotami, prompt se **generuje živě** hned.
2. Vyplnění zadání → psaní do polí, `oninput`/`onchange` → `saveState()` + `generatePrompt()`.
3. Výběr stylu → dlouhý `<select>` s optgroup; bez náhledu, bez popisu „kdy použít".
4. Pokročilé volby → nejsou oddělené; všechno je „pokročilé i základní" zároveň.
5. Generování → automatické, výstup do readonly textarea, počítadlo znaků.
6. Kopírování → tlačítko → `navigator.clipboard` → přístupný toast (live region z M1B).
7. Presety → header `<select>` (vestavěné + vlastní) + modal „Správa presetů" (Načíst / Smazat) — přístupný dialog z M1B.
8. Import/Export → JSON přes `<input type=file>` a `Blob` download; import validovaný a normalizovaný (M1A).
9. Mobil → jediný breakpoint `@media (max-width:920px)`: panely pod sebe, `form-panel` `max-height:52vh`, `output-panel` `min-height:48vh` — dvě nezávisle scrollovací oblasti nad sebou.

**Stav & úložiště (✅):** zdroj pravdy = DOM; `localStorage` klíče `..._state_v2`, `..._presets_v2`; import/localStorage prochází allowlist normalizací (M1A); render názvů přes `textContent` (žádné XSS). Prompt se skládá modulárně z pojmenovaných sekcí, mapované enumy, deduplikace (M1B).

---

## 3. Hlavní UX problémy (✅ pozorováno / 🎯 posouzení)

1. **Zahlcení na první pohled.** 9 sekcí a desítky ovládacích prvků naráz; žádná hierarchie „nejdřív tohle". Učitel neví, kde začít.
2. **Tmavý „terminálový" vzhled** neodpovídá cílové skupině (audit to označil explicitně). Působí technicky a chladně.
3. **46 stylů v jednom `<select>`** bez náhledu, popisu, doporučení a vhodnosti — nejtěžší rozhodnutí v celé appce je podané nejhůř.
4. **Design ≠ obsah není vysvětlen.** „Atmosféra", „Vizuální konzistence", „Tematický balíček", „Úroveň omezení" jsou pojmy, kterým laik nerozumí.
5. **Chybí doporučení a výchozí cesta.** Nováček nemá „udělej to za mě rozumně".
6. **Anglický výstup není vysvětlen** (české UI → anglický prompt) — může mást.
7. **Mobil:** výsledek je pod formulářem v druhé scroll-oblasti; po vyplnění není zřejmé, kam kliknout pro výsledek/kopírování.
8. **Readonly výstup** — audit i zadání chtějí „snadno upravit"; dnes nelze ladit přímo.
9. **Presety vs. historie** — historie posledních promptů neexistuje; opětovné použití = jen ručně uložený preset.

---

## 4. Cílové uživatelské scénáře (🎯)

### A. Běžný učitel (primární)
- **Nejkratší cesta:** Krok 1 (téma „Ohmův zákon") → Krok 2 (publikum „1. ročník učiliště", účel „vysvětlit učivo", délka „krátká") → Krok 3 (klikne **„Doporučit styl"** → vybere jednu ze 3 karet) → Krok 4 (Kopírovat). ~5 rozhodnutí.
- **Potřebné informace:** téma, publikum, účel. **Volitelné:** vše ostatní (bezpečné defaulty).
- **Místa rozhodování:** délka (3 volby), styl (doporučené karty). **Rizika zahlcení:** galerie 46 stylů → mitigace: nejdřív jen 3–5 doporučených + „Zobrazit všechny".
- **Návrat/oprava:** kroky jsou stále na jedné stránce; klik na krok = skok zpět; živý náhled ukazuje efekt.

### B. Pokročilý učitel
- **Nejkratší cesta:** přepne **Pokročilé nastavení** (nebo je vždy vidí), doladí strukturu, množství textu, obrazová pravidla, omezení, jazyk, speaker notes, konkrétní styl z galerie s filtrem.
- **Potřebné:** téma; **volitelné:** vše ostatní, ale chce k němu přístup bez skrolování skrz nováčkovské vysvětlivky.
- **Rizika:** skrytí pokročilého by ho zdržovalo → řešení: přepínač „Jednoduchý / Pokročilý" s uložením volby do `localStorage`.
- **Návrat/oprava:** živý náhled + „Přehled aktivních nastavení".

### C. Opakování starší konfigurace
- **Cesta:** otevře **Presety** nebo **Historii** → vybere → případně doladí → Kopírovat.
- **Potřebné:** existující preset/historie; **volitelné:** úpravy.
- **Rizika:** záměna historie a presetů → jasně vizuálně oddělit (presety = pojmenované, historie = časová, dočasná).

### D. Experimentující uživatel
- **Cesta:** galerie stylů → náhled „pro co je styl vhodný" → přepíná styly a **živě vidí, jak se mění prompt** → „Nová varianta" / „Duplikovat preset" → případně **porovnání dvou variant** (⏳ pozdější).
- **Potřebné:** téma; **volitelné:** vše.
- **Rizika:** ztráta rozdělané práce při experimentu → auto-uložení stavu + nedestruktivní varianty.

---

## 5. Doporučená informační architektura (🎯)

**Doporučení: hybrid — jedna stránka s krokovým vedením a trvale přítomným živým náhledem.** Ne čistý lineární wizard (bránil by pokročilým a opakovanému použití), ne dnešní plochá zeď (zahlcuje nováčky).

**Proč hybrid:** zachová živé generování a rychlý přístup pro pokročilé, ale dá nováčkovi jasnou lineární cestu a „stav dokončení". Kroky jsou kotvy/sekce, ne oddělené obrazovky — návrat je okamžitý.

### Jednoduchý režim — 4 kroky
1. **Obsah** — téma (povinné), stručný cíl.
2. **Publikum a účel** — cílová skupina, úroveň znalostí, účel/tón, délka.
3. **Vzhled** — doporučené styly (3–5 karet) nebo galerie; atmosféra zjednodušená na „Vzhled a nálada".
4. **Výsledek** — živý prompt, Kopírovat / Stáhnout / Uložit preset, přehled nastavení.

### Pokročilé nastavení (rozbalovací, per-sekce)
Přesná struktura slidů (přesný počet, odrážky, „přesně N"), obrazová pravidla + úroveň omezení, speaker notes, „žádné vymyšlené fakty", vlastní jazyk, terminologie, vizuální konzistence, tematický balíček.

- **Vždy viditelné:** hlavička, přepínač Jednoduchý/Pokročilý, kroky 1–4, náhled (na desktopu), primární akce.
- **Skryté v pokročilém:** technické volby výše (rozbalené sekce „Zobrazit pokročilé").
- **Návrat k předchozímu kroku:** klik na krok v ukazateli kroků / kotva; nic se neztrácí (živý stav).
- **Živý výsledek:** ano (viz §8, s ochranou ručních úprav).
- **Stav dokončení:** ukazatel kroků označí splněné (téma zadáno, publikum vyplněno, styl vybrán) a upozorní na chybějící povinné (téma).

**Jednoduchý režim nesmí produkovat horší prompt** — používá stejné bezpečné výchozí hodnoty jako `DEFAULT_STATE` (přesně N slidů, jedna myšlenka na slide, speaker notes u Presenter Deck, žádné vymyšlené fakty, žádné screenshoty, konzistence zapnutá).

---

## 6. Nový systém kategorií stylů (🎯, odvozeno z reálných 46)

Dnešních 7 optgroup zjednodušuji a sceluji do **8 srozumitelných kategorií** (46 = 8+6+10+6+5+4+3+4):

| # | Kategorie (CZ) | Počet | Charakter |
|---|---|---|---|
| 1 | Výukové a přehledné | 8 | Jasná struktura, diagramy, učebnicový klid |
| 2 | Hravé a žákovské | 6 | Přátelské, barevné, pro mladší |
| 3 | Umělecké a ilustrační | 10 | Ruční, malířské, texturové |
| 4 | Konceptuální a metaforické | 6 | Myšlenky přes symboly a metafory |
| 5 | Příběhové a autorské | 5 | Vyprávění, sekvence, kapitoly |
| 6 | Atmosférické a stylové | 4 | Nálada, tón, filmovost |
| 7 | Profesionální a minimalistické | 3 | Střízlivé, odborné, formální |
| 8 | Technické a digitální | 4 | Schémata, izometrie, data |

---

## 7. Datový model stylu + kompletní návrh 46 karet (🎯)

### Datový model karty stylu
```jsonc
{
  "id": "3d-cut-paper",           // beze změny – shoduje se s dnešním ILLUSTRATION_SNIPPETS klíčem
  "name": "3D Cut-Paper (vystřihovánky)", // dnešní CZ label z <option>
  "shortName": "Vystřihovánky",   // krátký chip do karty
  "category": "artistic",         // slug jedné z 8 kategorií
  "description": "Vrstvené papírové výřezy s měkkými stíny a ručním pocitem.",
  "bestFor": ["příběhová témata", "měkká/přívětivá témata", "nižší stupně"],
  "avoidFor": ["hustá data", "striktně technická schémata"],
  "tags": ["ruční", "teplé", "hravé", "měkké"],
  "palette": "teplé pastely",
  "visualMood": "přívětivá, hravá",
  "complexity": "medium",         // low | medium | high (náročnost výjevu)
  "educationSafe": true,          // vhodné bez výhrad pro školní prostředí
  "featured": true,               // kandidát do „doporučené" a výchozí galerie
  "sourceAttribution": { "inspiredBy": "awesome-notebookLM (koncept)", "license": "ověřit", "note": "přeformulováno vlastními slovy" },
  "promptModule": "Layered paper-cut illustrations, soft shadows, handcrafted feel." // = dnešní snippet (beze změny)
}
```
> `promptModule` = **beze změny** převzatý dnešní anglický snippet → generovaný prompt zůstane identický. `name`/`id` = dnešní hodnoty → **žádná ztráta ani přejmenování** 46 stylů.

### Kompletní mapování všech 46 stylů
Legenda: **K** = kategorie (1–8 dle §6), **Edu** = educationSafe, **Cx** = complexity (N/S/V = nízká/střední/vysoká), **F** = featured.

| id | shortName (CZ) | K | Vhodné pro | Nevhodné pro | Tagy | Edu | Cx | F |
|---|---|---|---|---|---|---|---|---|
| infographic-clean | Infografika | 1 | data, přehledy, shrnutí | umělecká témata | čisté, ikonické, přehledné | ✅ | S | ★ |
| concept-map | Myšlenková mapa | 1 | vztahy pojmů, opakování | lineární příběh | uzly, vazby, struktura | ✅ | S | ★ |
| step-by-step | Postupové schéma | 1 | návody, procesy | volná diskuse | kroky, proces, číslované | ✅ | N | ★ |
| whiteboard | Tabule | 1 | výklad, odvození | prémiová prezentace | ruční, školní, jasné | ✅ | N | ★ |
| textbook-modern | Moderní učebnice | 1 | strukturovaná látka | zábavní obsah | bloky, zvýraznění | ✅ | N | ★ |
| vintage-edu | Klasická učebnice | 1 | historie, klasika | moderní tech | retro, tlumené, klidné | ✅ | N | |
| explainer-style | Jak to funguje | 1 | příčina–následek | čistě umělecké | vysvětlující, kauzalita | ✅ | S | ★ |
| flat-vector | Plochý vektor | 1 | univerzální, čisté | detailní realismus | minimal, geometrie | ✅ | N | ★ |
| storybook | Pohádková kniha | 2 | mladší žáci, příběh | odborná data | teplé, přátelské, vyprávěcí | ✅ | S | ★ |
| kids-flat | Dětské ploché | 2 | 1. stupeň, základy | dospělé publikum | jednoduché tvary, jasné barvy | ✅ | N | ★ |
| playful-classroom | Školní prostředí | 2 | školní témata | firemní | tabule, tužky, hravé | ✅ | S | |
| mascot-based | Postava-průvodce | 2 | motivace, děti | formální | maskot, průvodce | ✅ | S | |
| claymorphism | Modelína | 2 | hravá témata | vážná data | 3D, měkké, oblé | ✅ | S | |
| comic | Komiks | 2 | příběh, zapamatování | právní/vědecké | panely, obrysy, dynamické | ✅ | S | |
| watercolor | Akvarel | 3 | jemná/přírodní témata | technická přesnost | malířské, měkké, ruční | ✅ | S | ★ |
| gouache | Gouache malba | 3 | výtvarná témata | data | plné barvy, malířské | ✅ | S | |
| ink-line-art | Perokresba | 3 | výklad, skici | barevná bohatost | linka, ČB, skica | ✅ | S | |
| paper-collage | Papírová koláž | 3 | ruční pocit | přesná schémata | koláž, textura, trhané | ✅ | S | |
| collage | Koláž | 3 | kreativní témata | formální | výstřižky, časopisové | ⚠ | S | |
| pastel-chalkboard | Křídová kresba | 3 | výuka, teplý tón | prémiové | křída, pastely, školní | ✅ | N | |
| 3d-cut-paper | Vystřihovánky | 3 | příběh, měkká témata | hustá data | ruční, teplé, hravé | ✅ | S | ★ |
| soft-gradient | Jemné přechody | 3 | klidná moderní témata | ostrá schémata | přechody, klid, moderní | ✅ | N | |
| retro-poster | Retro plakát | 3 | kampaně, historie | vědecká přesnost | mid-century, tisk, bold | ✅ | S | |
| boho-handcrafted | Ruční organický | 3 | teplá/lidská témata | tech/data | organické, zemité | ✅ | S | |
| metaphor-driven | Metafory | 4 | abstraktní koncepty | doslovná data | mosty, cesty, symboly | ✅ | V | ★ |
| abstract-concept | Abstraktní | 4 | ideje, filozofie | konkrétní návody | nereprez., expresivní | ⚠ | V | |
| surreal-edu | Surreální výklad | 4 | zaujetí, metafora | fakta 1:1 | snové, surreální | ⚠ | V | |
| symbolic-visual | Symbolický jazyk | 4 | ikonická sdělení | realismus | symboly, ikony | ✅ | S | |
| minimal-metaphor | Minimal metafora | 4 | jedna silná myšlenka | mnoho detailů | minimal, 1 obraz | ✅ | N | ★ |
| journey-roadmap | Cesta / roadmapa | 4 | vývoj, etapy | statická data | cesta, progrese | ✅ | S | ★ |
| narrative-visual | Příběh v obrazech | 5 | vyprávění | odborná hustota | sekvence, filmové | ✅ | S | |
| illustrated-narrative | Kapitoly příběhu | 5 | delší příběh | krátká data | kapitoly, ilustrace | ✅ | S | |
| storyboard-frames | Filmové rámování | 5 | postup děje | tabulky | storyboard, rámy | ✅ | S | |
| visual-diary | Zápisník / skicák | 5 | osobní tón | firemní | ruční, deník | ✅ | S | |
| journey-illustration | Vizuální linka | 5 | transformace | statické | linka, progrese | ✅ | S | |
| dreamlike | Snový styl | 6 | atmosféra, klid | přesnost | rozostřené, éterické | ⚠ | S | |
| dark-academia | Temný akademický | 6 | humanitní, klasika | děti | knihy, tlumené, vážné | ⚠ | S | |
| nordic-light | Severský minimal | 6 | čistota, klid | bohatá témata | vzdušné, jemné tóny | ✅ | N | ★ |
| noir | Temný minimalismus | 6 | drama, kontrast | veselá témata | vysoký kontrast, moody | ⚠ | S | |
| corporate-minimal | Firemní střízlivý | 7 | business, reporty | dětské | neutrální, konzervativní | ✅ | N | ★ |
| research-academic | Vědecký | 7 | výzkum, odborné | zábava | metodické, střízlivé | ✅ | S | ★ |
| legal-policy | Formální dokumenty | 7 | právo, politika | metafory/humor | přesné, formální | ✅ | N | |
| blueprint | Technický výkres | 8 | schémata, konstrukce | měkká témata | blueprint, linky | ✅ | S | ★ |
| engineering-diagram | Funkční nákres | 8 | technika, funkce | umělecké | schéma, přesnost | ✅ | V | |
| isometric | Izometrie 3D | 8 | systémy, produkty | tradiční výuka | izometrie, hloubka | ✅ | S | ★ |
| data-storytelling | Data bez grafů | 8 | čísla v příběhu | volná estetika | data, vysvětlující | ✅ | S | ★ |

> ⚠ u `educationSafe` = použitelné, ale vhodné spíš pro starší/specifická témata (ne primárně pro nejmladší). `featured` (★, ~18) = výchozí sada do galerie a zdroj pro doporučení.

---

## 8. Systém doporučování stylu (🎯, lokální, bez AI a bez sítě)

Transparentní **pravidlový scoring** nad daty z §7. Žádné volání modelu, žádný síťový požadavek.

### Vstupy
- Téma (volný text → jednoduché klíčové skupiny), publikum/věk (z „úrovně znalostí" + volného textu), účel (tematický balíček / tón), délka.

### Datová struktura pravidel
```jsonc
// mapování signálů na tagy/kategorie s vahami
const RECO_RULES = {
  audienceYoung:   { match: ["učiliště","žáci","děti","1. stupeň","základní"], boostCategory: {2:3, 1:1}, boostTags: {"hravé":2,"přátelské":2}, requireEducationSafe: true },
  audienceExpert:  { match: ["vysoká","odborník","výzkum","firma"], boostCategory: {7:3, 8:2, 1:1} },
  topicTechnical:  { match: ["schéma","postup","zákon","stroj","síť","kód","proces"], boostCategory: {8:3, 1:2}, boostTags: {"kroky":2,"schéma":2} },
  topicHistory:    { match: ["historie","dějiny","válka","století"], boostCategory: {6:2, 1:1}, boostTags: {"retro":2} },
  topicScience:    { match: ["věda","fyzika","biologie","chemie","data"], boostCategory: {8:2, 1:2, 7:1} },
  purposeStory:    { match: ["příběh","motivace","zapamatování"], boostCategory: {5:3, 2:2} },
  purposeFormal:   { match: ["seriózní","odborn","prezentace pro vedení"], boostCategory: {7:3}, penalizeTags: {"hravé":-2} }
};
```

### Scoring
`score(style) = Σ boostCategory[style.category] + Σ boostTags∩style.tags − Σ penalizeTags∩style.tags + (style.featured ? 1 : 0)`; při `requireEducationSafe` se `educationSafe:false` vyřadí.

### Tie-breaking
Vyšší `featured` → nižší `complexity` (jednodušší pro nováčky) → abecedně dle `shortName` (stabilní, deterministické).

### Fallback / prázdné téma
- **Prázdné/nejasné téma:** vrať **výchozí pedagogickou sadu** = top `featured` z kategorií 1 a 2 (Výukové, Hravé), max 5. Doporučení se nesnaží „hádat" — jasně napíše: *„Zatím bez tématu — tady jsou univerzálně vhodné výukové styly."*
- **Žádné pravidlo nesedí:** stejná výchozí sada.

### Výstup a vysvětlení
Vrať **3–5** stylů, každý s krátkým důvodem odvozeným z pravidla, které nejvíc přispělo:
- „Vhodné pro technické schéma a postup." (topicTechnical)
- „Dobré pro mladší žáky a zapamatování." (audienceYoung + purposeStory)
- „Vhodné pro seriózní odbornou prezentaci." (purposeFormal)

### Ovládání
- Doporučení lze **ignorovat** — galerie všech 46 je vždy o klik dál („Zobrazit všechny styly").
- Systém **nepředstírá inteligenci**: popiska „Doporučeno na základě tématu a publika (jednoduchá pravidla, žádná AI)."

---

## 9. Vizuální systém (🎯)

**Jeden hlavní směr: „Klidný světlý pracovní list" — adaptivní (světlé výchozí + tmavý režim), moderní, důvěryhodné, ne dětské, ne terminálové.** Monospace **jen** pro výstupní prompt; UI v humanistickém sans-serifu.

### Barvy (návrh tokenů — světlý režim)
| Token | Hodnota | Užití |
|---|---|---|
| `--bg` | `#f7f8fa` | pozadí stránky |
| `--surface` | `#ffffff` | karty, panely |
| `--surface-2` | `#eef1f5` | jemné bloky, hover |
| `--border` | `#dce1e8` | okraje |
| `--text` | `#1f2733` | hlavní text |
| `--text-muted` | `#5b6472` | popisky (kontrast ≥ 4.5:1 na `--surface`) |
| `--accent` | `#2f6fed` (tlumená modrá) | primární akce, focus |
| `--accent-hover` | `#255fd0` | hover |
| `--success` | `#1f9d63` | uloženo/hotovo |
| `--warning` | `#b9770a` | rozporná nastavení |
| `--error` | `#c23b3b` | chyby |
| `--focus-ring` | `#2f6fed` (2px + offset) | viditelný focus |

Tmavý režim = stejné tokeny s převrácenými plochami (`--bg:#0f141b`, `--surface:#171d26`, text světlý), akcent mírně zesvětlený pro kontrast. Řízeno `prefers-color-scheme` + ruční přepínač (uložený do `localStorage`).

### Ostatní tokeny
- **Radius:** `--r-sm:6px`, `--r-md:10px`, `--r-lg:16px` (karty).
- **Stíny:** jen 2 úrovně — `--shadow-sm` (karty), `--shadow-md` (modaly/plovoucí). Bez glassmorphism, bez plošných gradientů.
- **Spacing:** 4px základ → 4/8/12/16/24/32/48.
- **Typografie:** systémový humanistický sans (`system-ui, "Segoe UI", Inter, sans-serif`); stupnice 12/14/16(base)/20/24/30; nadpisy 600–700, tělo 400–500; délka řádku textu max ~70 znaků.
- **Tlačítka:** primární (accent, plné), sekundární (surface + border), tiché (jen text); min výška 40px, dotyk ≥ 44px.
- **Pole:** `--surface`, 1px border, focus = border accent + 3px ring; label vždy nad polem.
- **Karty stylů:** `--surface`, `--r-lg`, `--shadow-sm`, náhledový pruh + název + krátký popis + chip kategorie + tag „vhodné pro".

**Vyloučeno:** pastelový dětský web, neonový „AI" vzhled, přehnané gradienty, všudypřítomný glass, přeplněné karty, emoji jako navigace (emoji jen jako drobná dekorace s `aria-hidden`).

---

## 10. Desktopový wireframe (🎯, textově)

```
┌──────────────────────────────────────────────────────────────────────┐
│ HLAVIČKA:  Logo/název   |   [Jednoduchý ▸ Pokročilý]   [☀/🌙]  [Presety ▾] │
├───────────────────────────────┬──────────────────────────────────────┤
│  LEVÝ SLOUPEC (kroky, scroll)  │  PRAVÝ SLOUPEC (sticky náhled)        │
│  ┌ Ukazatel kroků 1─2─3─4 ┐    │  ┌ Výsledný prompt ──────────────┐   │
│  ①  Obsah                      │  │  [Auto-náhled | Ruční úpravy]  │   │
│     • Téma *                   │  │  ...................            │   │
│     • Cíl                      │  │  (živý text, editovatelný      │   │
│  ②  Publikum a účel            │  │   po odemčení)                 │   │
│     • Cílová skupina           │  │  1 240 znaků · 12 slidů        │   │
│     • Úroveň znalostí          │  └────────────────────────────────┘   │
│     • Účel / tón · Délka       │  [Kopírovat] [Stáhnout ▾] [Uložit]    │
│  ③  Vzhled                     │  ┌ Přehled aktivních nastavení ─┐     │
│     • [Doporučit styl]         │  │ Publikum: začátečníci …       │     │
│     • Galerie (3–5 karet) …    │  │ ⚠ Rozpor: „minimal" + „detail"│     │
│     • [Zobrazit všech 46 ▾]    │  └───────────────────────────────┘     │
│  ▸ Pokročilé nastavení         │                                        │
│     (struktura, obraz. pravidla,│                                       │
│      omezení, jazyk, notes…)   │                                        │
└───────────────────────────────┴──────────────────────────────────────┘
```
- Náhled je **sticky** (drží se při skrolování kroků).
- **Ověření dvoupanelu:** pro toto množství obsahu je 2-panel vhodný na širokém desktopu; na užším notebooku se pravý panel zúží a karty galerie se zalomí. Pokud by náhled tlačil obsah, na středních šířkách se náhled přesune pod kroky s tlačítkem „Skočit na výsledek".

---

## 11. Mobilní wireframe (🎯, textově)

```
┌───────────────────────────┐
│ Název   [Jed./Pokr.] [☀]  │
│ Kroky ① ② ③ ④  (sticky top)│
├───────────────────────────┤
│ ① Obsah                    │
│   Téma *  [____________]   │
│   Cíl     [____________]   │
│ ② Publikum a účel …        │
│ ③ Vzhled                   │
│   [Doporučit styl]         │
│   [karta][karta][karta]    │
│   [Zobrazit všech 46]      │
│ ▸ Pokročilé nastavení      │
├───────────────────────────┤
│ (sticky bottom bar)        │
│ [👁 Náhled promptu] [Kopír]│
└───────────────────────────┘
```
- **Klíčové řešení mobilu:** výsledek NENÍ „několik obrazovek dole". Trvale **sticky spodní lišta** s „Náhled promptu" (otevře náhled jako plný panel/`<dialog>`) a rychlým „Kopírovat". Ukazatel kroků nahoře je také sticky pro rychlý skok.
- Náhledový panel má „Zavřít" a vrací fokus na spouštěč (jako M1B dialog).

---

## 12. Návrh náhledu promptu a bezpečný model stavu (🎯)

**Doporučení: kombinace živého auto-náhledu a chráněné ruční verze.**

- **Výchozí stav = „Auto".** Prompt se generuje živě z formuláře (jako dnes). Textarea je **read-only v Auto režimu**.
- **„Upravit ručně"** přepne do stavu **„Ruční"**: textarea se odemkne. Od té chvíle **auto-regenerace NEPŘEPISUJE** ruční text — místo toho se u náhledu objeví nenápadné upozornění *„Formulář se změnil — [Znovu vygenerovat] přepíše ruční úpravy."*
- **„Znovu vygenerovat / Obnovit z formuláře"** vědomě zahodí ruční verzi (s potvrzením přes M1B dialog) a vrátí Auto.
- Tím se řeší hlavní riziko: **auto-update nikdy tiše nesmaže ruční práci**.

Doplňkově u náhledu:
- počet znaků (máme), přehled aktivních nastavení, **upozornění na prázdné/rozporné hodnoty** (např. téma prázdné; „minimalistický" styl + „detailní" omezení; „přesně N slidů" mimo rozsah) — jako neblokující `warning` chip.
- Kopírovat (máme), **Stáhnout jako .txt/.md** (⏳ M2F), Uložit preset.

**Model stavu (návrh):** `{ mode: "auto" | "manual", manualText: string|null, formState: {...} }` v paměti; do `localStorage` se ukládá `formState` (jako dnes) + volitelně `mode`. Ruční text se needituje generátorem, jen na explicitní akci.

---

## 13. Presety, historie a import (🎯 / ⏳)

**Presety (M2F, 🎯):** vyčlenit do přehledného panelu/`<dialog>` s akcemi: **Nový, Přejmenovat, Duplikovat, Smazat, Export, Import**. Vizuálně jako karty s názvem + datem. Duplikace = „vytvoř variantu". Vše nad stávající bezpečnou vrstvou (M1A normalizace, `textContent`, limit 100).

**Historie posledních promptů (⏳ pozdější, po M2F):**
- pouze **lokální** (`localStorage`, oddělený klíč `..._history_v1`),
- **omezený počet** (např. 10) s FIFO,
- **vizuálně odlišená** od presetů (časová osa „Naposledy vytvořené", šedě, bez názvu),
- ukládá jen `formState` + timestamp; **žádná citlivá data** navíc; u prvního použití krátké upozornění „Historie se ukládá jen ve vašem prohlížeči."
- Přínos: rychlý návrat k experimentu; riziko: zmatení s presety → proto oddělená sekce a jiný vizuál.

**Do M2 patří:** zpřehlednění presetů (M2F). **Odloženo:** historie, porovnání dvou variant, sdílené shrnutí.

---

## 14. Pravidla responsivity (🎯, podle chování)

| Rozsah (chování) | Layout |
|---|---|
| **Široký desktop** (≳ 1200px) | 2 sloupce; sticky náhled vpravo; galerie 3–4 karty na řádek |
| **Notebook** (~ 900–1200px) | 2 sloupce užší; galerie 2–3 karty; náhled užší |
| **Tablet** (~ 600–900px) | 1 sloupec; náhled sekce dole + sticky „Skočit na výsledek"; galerie 2 karty |
| **Mobil** (≲ 600px) | 1 sloupec; sticky horní kroky + spodní lišta (Náhled/Kopírovat); galerie 1 karta |

Kontrola: délka formuláře (kroky zkracují vnímanou délku), galerie (grid `auto-fill, minmax`), sticky prvky (kroky/náhled/spodní lišta), modal (plný na mobilu), tlačítka (dotyk ≥ 44px), mobilní klávesnice (spodní lišta nesmí zakrýt aktivní pole — použít `env(safe-area-inset)` a skrytí lišty při fokusu vstupu), **dlouhé české názvy** (žádné `nowrap`, `overflow-wrap`), landscape/portrait (sticky výšky v `dvh`, ne `vh`).

---

## 15. Pravidla přístupnosti (🎯, M2 nesmí pokazit M1B)

- **Nadpisy:** logická hierarchie `h1` (název) → `h2` (kroky) → `h3` (sekce). Kroky jako skutečné nadpisy, ne jen vizuální bloky.
- **Skupiny voleb:** `fieldset` + `legend` pro publikum/účel, pravidla slidů, omezení; přepínač Jednoduchý/Pokročilý jako `role=radiogroup` nebo tab s `aria-selected`.
- **Karty stylů:** každá karta = **nativní `<button>`** (nebo `role=radio` v `radiogroup` „Vyberte styl") — plně ovladatelné klávesnicí, vybraný stav přes `aria-pressed`/`aria-checked`, viditelný focus, název + popis v přístupném jméně.
- **Klávesnicové filtrování:** filtr kategorií = tlačítka/`radiogroup`; hledání = `search` input s `aria-controls` na grid; výsledky oznámené přes `aria-live="polite"` („Zobrazeno 6 stylů").
- **Focus management:** zachovat M1B (focus-trap v dialozích, návrat fokusu); nové panely (náhled na mobilu) stejný vzor.
- **Kontrast:** všechny tokeny ≥ 4.5:1 pro text (světlý i tmavý režim); ověřit `--text-muted`.
- **Dotykové plochy** ≥ 44×44px; **reduced-motion** rozšířit na nové animace (galerie, přechody kroků) — zachovat M1B `@media`.
- **Live regiony:** doporučení, filtrování, validace přes existující polite/assertive vzor.
- **Validace formuláře:** povinné téma s `aria-required` + inline chybová zpráva svázaná `aria-describedby`; rozpory jako neblokující upozornění.
- **Popisy ikon:** dekorativní `aria-hidden`, funkční ikony `aria-label`.

---

## 16. Doporučená technická architektura (🎯)

### Varianta A — zachovat jednosouborový `index.html`
- **+** nulové riziko nasazení (Netlify: drag&drop 1 souboru), žádná migrace, offline triviální.
- **−** soubor už má ~2260 řádků; po M2 (galerie, data 46 karet, doporučení, 2 režimy, témata) by narostl na ~4000–5000+ řádků → horší udržovatelnost, těžší review, riziko chyb.
- **Rozumný strop:** ~2500–3000 řádků; M2 ho překročí.

### Varianta B — rozdělit statiku bez frameworku a bez bundleru
Navržené soubory:
```
index.html
styles.css
js/app.js            (bootstrap, stav, události)
js/prompt-builder.js (generatePrompt + mapy)
js/storage.js        (localStorage + normalizace z M1A)
js/dialogs.js        (showDialog/showStatus/focus z M1B)
data/styles.js       (46 karet dle §7)
data/reco-rules.js   (pravidla doporučení §8)
```
Načtení přes `<script>` v pevném pořadí (nebo `type="module"` s relativními importy — funguje přes `http://`/Netlify bez buildu). **Bez `package.json`, bez bundleru, bez závislostí.**
- **+** čitelnost, snadné review, izolace bezpečnostní (storage) a a11y (dialogs) vrstvy, snadné budoucí testy (malé čisté funkce).
- **−** jednorázová migrace; drobné riziko pořadí načítání; `file://` + ES moduly mají CORS omezení (řeší se lokálním serverem / Netlify — na produkci OK).

### Doporučení: **Varianta B**, ale **postupně a bezpečně**.
M2B jako první krok pouze **extrahuje CSS do `styles.css`** a JS do `js/app.js` **beze změny chování** (čistý přesun + `<link>`/`<script>`), ověří identický runtime, teprve další milníky přidávají moduly a nový obsah. Migrace je nízkoriziková, protože jde o mechanický přesun s runtime porovnáním. Netlify: přidat `netlify.toml` není nutné, statické publikování složky stačí.

---

## 17. Rozdělení M2 do implementačních milníků (🎯)

| Milník | Uživatelský přínos | Technický rozsah | Dotčené soubory | Rizika | Testovací plán | Závisí na | Nepatří sem |
|---|---|---|---|---|---|---|---|
| **M2B** Vizuální systém + rozdělení | Světlý moderní vzhled, čistší kód | Tokeny/paleta, extrakce CSS+JS, adaptivní téma; **beze změny funkcí** | `index.html`, nový `styles.css`, `js/app.js` | regrese při přesunu; kontrast | vizuální porovnání, plná M1A/M1B regrese, konzole/síť | — | nové funkce, galerie, režimy |
| **M2C** Jednoduchý/Pokročilý režim | Nováček vidí méně, pokročilý má vše | přepínač + rozbalení pokročilých sekcí; kroky jako sekce; stav režimu do `localStorage` | `index.html`/`js/app.js`, `styles.css` | skrytí nesmí měnit prompt | prompt identický při obou režimech; a11y (fieldset/kroky) | M2B | galerie, doporučení |
| **M2D** Galerie a filtrování stylů | Srozumitelný výběr z 46 | `data/styles.js`, karty jako `radiogroup`, filtr+hledání; `<select>` nahrazen (hodnoty i prompt beze změny) | `data/styles.js`, `index.html`, `styles.css`, `js/app.js` | a11y karet; udržet 46 id/promptů | 46 stylů → identický snippet; klávesnice; live region | M2B, M2C | doporučení, historie |
| **M2E** Doporučení stylu | „Vyber za mě rozumně" | `data/reco-rules.js`, scoring, 3–5 karet + důvod | `data/reco-rules.js`, `js/app.js`, `index.html` | falešná inteligence; determinismus | scoring jednotky, fallback, prázdné téma | M2D | historie, porovnání |
| **M2F** Náhled + presety | Ruční úpravy bez ztráty, přehledné presety | model Auto/Ruční, upozornění na rozpory, panel presetů (nový/přejmenovat/duplikovat/export/import), stáhnout .txt/.md | `js/prompt-builder.js`, `js/storage.js`, `js/dialogs.js`, `index.html` | přepsání ruční verze; bezpečnost úložiště | ochrana ruční verze; M1A security retest | M2B (+ ideálně M2C) | historie, sdílení |
| **⏳ M2G+** Historie, porovnání variant, sdílené shrnutí | opakování a experiment | historie (lokální, limit), diff dvou promptů | pozdější | kvóta, matení s presety | — | M2F | — |

---

## 18. Doporučený první implementační milník (🎯)

**M2B — Vizuální systém + bezpečné rozdělení souborů.** Důvody: (1) největší vnímaný přínos (odstraní „terminálový" dojem, hlavní bod auditu) při **nulové změně funkčnosti**; (2) připraví udržovatelnou strukturu pro M2C–M2F; (3) nízké riziko — mechanický přesun + tokeny, ověřitelný vizuálním porovnáním a plnou M1A/M1B regresí; (4) malý „logický" diff (přesun + náhrada palety), snadno kontrolovatelný.

**M2B výslovně NEmění:** žádnou funkci, žádný prompt, žádný z 46 stylů, datový formát, dialogy ani přístupnostní chování z M1B.

---

## 19. Soubory, kterých se první milník (M2B) pravděpodobně dotkne

- **`index.html`** — odkaz na `styles.css`/`js/app.js`, odstranění inline `<style>`/`<script>`, drobné doplnění tokenů/přepínače tématu (bez změny struktury formuláře).
- **`styles.css`** (nový) — přesunuté styly + nové tokeny palety, focus, spacing, adaptivní téma.
- **`js/app.js`** (nový) — přesunutý JavaScript beze změny logiky.
- *(volitelně)* `M2B_*.md` report po dokončení.

---

## 20. Otevřená rizika a známá omezení

- **Migrace do modulů** (M2B) může zavést regrese při přesunu — mitigace: čistý přesun bez úprav + runtime porovnání před/po.
- **`file://` + ES moduly**: na produkci (Netlify/HTTP) OK; lokální testy přes statický server (jako dosud).
- **Karty stylů bez skutečných obrázků**: M2 nepřidává obrázky (omezení) → náhled = barevný/typografický „mood" pruh, ne rastr. Skutečné náhledy = pozdější.
- **Doporučení je heuristika** — může minout; proto vždy dostupná plná galerie a jasná popiska „jednoduchá pravidla, ne AI".
- **Kontrast tmavého režimu** a `--text-muted` nutno doměřit při implementaci.
- **Nezvětšovat prompt** kvůli redesignu — generátor zůstává z M1B (jen se přesune).
- **`awesome-notebookLM`**: použít jen jako námět kategorií/popisů; texty formulovat vlastními slovy, `sourceAttribution` u dotčených stylů, nekopírovat obrázky/celé prompty, ověřit licenci před převzetím čehokoli.

---

## 21. Jednoznačná finální rozhodnutí (§14)

| Otázka | Rozhodnutí | Důvod |
|---|---|---|
| Průvodce / jedna stránka / hybrid | **Hybrid** (kroky na jedné stránce + živý náhled) | vede nováčka, nebrzdí pokročilé, drží živé generování |
| Jednoduchý a pokročilý režim | **Ano** | jádro řešení zahlcení; pokročilí neztratí kontrolu |
| Tmavý / světlý / adaptivní | **Adaptivní, výchozí světlý** | důvěryhodnost pro učitele, ne terminál; respekt `prefers-color-scheme` |
| Živý prompt | **Ano, ale s ochranou ruční verze** (Auto/Ruční) | rychlá zpětná vazba bez tichého přepsání úprav |
| Sticky panel | **Ano** (náhled desktop, spodní lišta mobil) | výsledek vždy po ruce, řeší mobilní „výsledek dole" |
| Kolik doporučených stylů | **3–5** (default 4) | dost na volbu, ne zahlcení |
| Jak zobrazit všech 46 | **Galerie s kategoriemi + filtr + hledání** (karty jako `radiogroup`) | nahradí nepřehledný `<select>`, plně přístupné |
| Rozdělit `index.html` | **Ano, postupně** (M2B: CSS+JS ven, dál moduly) | udržitelnost po růstu; nízké riziko krok za krokem |
| Které funkce odložit | **Historie, porovnání variant, sdílené shrnutí, skutečné obrázkové náhledy** | nižší priorita, vyšší náklady/rizika |
| Inspirace z `awesome-notebookLM` | **Jen jako námět kategorií/popisů**, vlastní formulace + atribuce, ověřit licenci | právní čistota, udržovatelná vlastní data |

---

## 22. Rozlišení: ověřený stav / doporučení / odloženo (souhrn)

- **✅ Ověřený současný stav:** jednosouborový statický web; 2-panel desktop + 1 breakpoint 920px; 9 sekcí naráz; 46 stylů v `<select>`/7 optgroup; živé generování; readonly výstup; presety + import/export + `localStorage`; tmavá paleta; bezpečnost M1A a přístupnost/dialogy/prompt-kvalita M1B.
- **🎯 Doporučené změny (M2):** hybridní IA + 4 kroky; jednoduchý/pokročilý režim; světlý adaptivní vizuální systém; galerie stylů + 8 kategorií + datový model + filtr/hledání; lokální doporučení; sticky náhled + ochrana ruční verze; zpřehlednění presetů; rozdělení do souborů bez frameworku.
- **⏳ Odloženo:** historie promptů, porovnání dvou variant, sdílené/tisknutelné shrnutí, skutečné obrázkové náhledy stylů, migrace na framework/bundler (nedoporučeno vůbec).

---

*Konec blueprintu M2A. Jediný nový soubor je tento dokument. `index.html` nezměněn, žádná implementace, žádný commit ani push.*
