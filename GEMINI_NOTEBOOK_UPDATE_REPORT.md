# Gemini Notebook update – milestone report

Date: 2026-10-02
Branch: `feat/notebooklm-m2-teacher-redesign`

## Changes

- Updated active app naming and presentation formats to Gemini Notebook / Presenter Slides. The Czech format label is **Snímky pro prezentujícího**; Detailed Deck is described as a detailed presentation with explanations on the slides.
- Added a separate **Nastavte v Gemini Notebooku** summary for format, length, and language. These settings no longer appear in the prompt body.
- Reworked prompt generation around the presentation goal, audience, optional content outline, slide structure, source grounding, visual style, readability, image rules, and terminology.
- Added the optional multiline `contentOutline` field to the shared allowlist-based state model, form state, persistence, reset, and preset import/export.
- Removed active speaker-notes and exact-slide controls/instructions. Slide count now produces a preference such as `Aim for about 10 slides.` Source grounding remains a required instruction.
- Kept all 46 illustration style IDs, atmosphere choices, and theme packs.

## Compatibility

- Legacy `Presenter Deck` values normalize to `Presenter Slides` when state or preset data is loaded.
- `speakerNotes` and `exactSlides` are accepted as legacy-only import keys, then ignored. They are not copied to normalized app state or exports.
- Missing `contentOutline` defaults to an empty string. Existing allowlists, string limits, enum validation, malformed JSON handling, and forbidden-key filtering remain in place.
- Storage keys remain unchanged so existing browser data is discoverable by the updated app.

## Prompt example

Before, the prompt began with a NotebookLM Studio instruction and repeated language, format, and length inside the prompt; it could also demand an exact slide count and speaker notes.

After (illustrative excerpt):

```text
## Presentation Goal
- Topic (provided by the user): Ohmův zákon
- Primary goal (provided by the user): Vysvětlit základní vztahy

## Audience & Purpose
- Pitch the content for beginners with little or no prior knowledge.
- Target audience (provided by the user): Studenti střední školy

## Content Outline
- Úvod a motivace
- Napětí, proud a odpor
- Ohmův zákon
- Výpočet jednoduchého příkladu
- Shrnutí

## Slide Structure
- Aim for about 12 slides.
- One main idea per slide.
- At most 4 bullet points per slide.
- Use only facts grounded in the provided sources; do not invent information.
```

The separate settings summary shows `Formát: Snímky pro prezentujícího`, `Délka: Výchozí`, and `Jazyk: Čeština` for that configuration.

## Verification

- `node --check js/app.js` passed.
- Loaded the app in a local browser. The default prompt and separate settings summary rendered; editing the topic and outline updated the prompt.
- Confirmed a populated outline creates a `## Content Outline` list and a blank outline omits the section.
- Function-level regression checks passed for all 46 style snippets, approximate slide-count language, absence of legacy/product/settings duplication in the prompt, required source grounding, `Presenter Deck` migration, legacy speaker/exact import acceptance, and prototype-pollution filtering.
- Opened the preset-management dialog and confirmed keyboard focus enters it and Escape closes it while returning focus to the opener.
- The page references only local `styles.css` and `js/app.js`; no external assets or libraries were added.
- A narrow browser preview showed the stacked responsive layout without visible horizontal clipping. An exact 390 px viewport and browser-console log capture were not available through this verification session.

## Kept as-is / limitations

- This milestone did not add style galleries, new style IDs, APIs, dependencies, or a new build system. Existing uncommitted M2C work on the branch was preserved.
- Gemini Notebook controls format, length, and language outside the generated prompt. The app provides a summary for the user to set there; it does not connect to Gemini.
- No commit or push was made.

## Final integration

The final integration includes the already-developed M2C teacher flow. Because the M2C and Gemini Notebook changes overlap in the runtime files, both layers are being closed in one integration commit.
