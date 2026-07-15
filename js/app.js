        // ========================================
        // CONFIGURATION & CONSTANTS
        // ========================================
        const STORAGE_KEY = 'notebooklm_prompt_generator_state_v2';
        const PRESETS_KEY = 'notebooklm_prompt_generator_presets_v2';

        // Illustration style snippets (English for prompt)
        const ILLUSTRATION_SNIPPETS = {
            // 🖌️ Ilustrační & Výtvarné
            '3d-cut-paper': 'Layered paper-cut illustrations, soft shadows, handcrafted feel.',
            'flat-vector': 'Clean flat vector illustrations, geometric shapes, minimal detail.',
            'watercolor': 'Soft watercolor washes with hand-drawn sketch lines.',
            'isometric': 'Clean isometric illustrations with subtle depth and perspective.',
            'claymorphism': 'Clay-like 3D objects, playful rounded forms.',
            'retro-poster': 'Mid-century poster style, bold shapes, print texture.',
            'comic': 'Bold outlines, comic-style panels, simple shading.',
            'storybook': 'Whimsical storybook illustrations, warm and friendly.',
            'collage': 'Cutout collage style with magazine-like textures.',
            'noir': 'High-contrast, moody, minimalist illustrations.',
            'paper-collage': 'Hand-made paper collage style, layered textures, visible paper edges, torn paper aesthetic.',
            'ink-line-art': 'Ink and line art style, black and white pen drawings, illustrative sketches, fine linework.',
            'pastel-chalkboard': 'Pastel chalkboard style, chalk-drawn aesthetic, educational and warm, soft colors.',
            'gouache': 'Gouache illustration style, full opaque colors, painterly aesthetic, slightly poster-like.',
            'soft-gradient': 'Soft gradient illustrations, gentle color transitions, calm modern visual, no UI elements.',
            // 🧠 Konceptuální & Expresivní
            'narrative-visual': 'Narrative visual story style, story split into sequential images, cinematic flow.',
            'journey-roadmap': 'Journey and roadmap style, path-based visuals, evolution and progression steps.',
            'metaphor-driven': 'Metaphor-driven visuals, concepts explained through bridges, paths, buildings, and symbolic imagery.',
            'explainer-style': 'Explainer illustration style, "how it works" diagrams, clear cause-and-effect visuals.',
            'abstract-concept': 'Abstract concept art, non-representational shapes expressing ideas, not reality.',
            'surreal-edu': 'Surreal educational style, surrealist metaphors to explain concepts, dreamlike logic.',
            'symbolic-visual': 'Symbolic visual language, icons replaced with meaningful illustrated symbols.',
            'minimal-metaphor': 'Minimal metaphor style, one simple image equals one strong metaphor per slide.',
            // 📚 Narativní & Autorské
            'illustrated-narrative': 'Illustrated narrative style, each slide as a chapter illustration in a visual story.',
            'storyboard-frames': 'Storyboard frames style, cinematic and comic-like framing, sequential visuals.',
            'visual-diary': 'Visual diary and sketchbook style, personal hand-drawn feel, notebook aesthetic.',
            'journey-illustration': 'Journey illustration style, visual path of transformation, progression line.',
            // 🎭 Stylové / Atmosférické
            'dreamlike': 'Dreamlike soft focus style, gentle blurred aesthetic, ethereal and calming.',
            'dark-academia': 'Dark academia visual style, scholarly depth, books and thoughts, moody and intellectual.',
            'nordic-light': 'Light Nordic illustration style, airy and minimal, Scandinavian simplicity, soft tones.',
            'boho-handcrafted': 'Boho handcrafted style, organic shapes, warm earthy tones, artisan feel.',
            // 📖 Vzdělávací / Výkladové
            'infographic-clean': 'Clean infographic style, icons replaced with simple illustrations, clear visual hierarchy.',
            'concept-map': 'Concept map style, connected ideas, visual thinking diagrams with linked nodes.',
            'step-by-step': 'Step-by-step diagrams, process flows, numbered sequences with clear progression.',
            'whiteboard': 'Whiteboard illustration style, hand-drawn explanations, teacher-at-board aesthetic.',
            'textbook-modern': 'Modern textbook style, clean blocks, highlighted sections, structured layouts.',
            'vintage-edu': 'Old textbook-style diagrams, muted colors, educational tone.',
            // 👶 Pro děti / Školy
            'kids-flat': 'Kids educational flat style, simple shapes, bright colors, friendly and approachable.',
            'playful-classroom': 'Playful classroom style, school environment visuals, chalkboards, notebooks, pencils.',
            'mascot-based': 'Mascot-based style, a friendly character guide appears across all slides as a narrator.',
            // 💼 Profesionální / Technické
            'corporate-minimal': 'Corporate minimal style, neutral tones, conservative and restrained visuals.',
            'research-academic': 'Academic research style, scholarly diagrams, restrained and methodical visuals.',
            'legal-policy': 'Formal document style, structured layouts, no metaphors, clear and precise.',
            'blueprint': 'Precise line-art diagrams, schematic blueprint style.',
            'engineering-diagram': 'Engineering diagram style, functional schematics, technical precision.',
            'data-storytelling': 'Data storytelling without charts, explanatory visuals, numbers presented through imagery.'
        };

        // Atmosphere snippets (English for prompt)
        const ATMOSPHERE_SNIPPETS = {
            'friendly': 'Friendly and encouraging tone throughout.',
            'serious': 'Serious and professional tone throughout.',
            'academic': 'Academic and rigorous tone throughout.',
            'playful': 'Playful and humorous tone throughout.',
            'inspirational': 'Inspirational and uplifting tone throughout.',
            'calm': 'Calm and minimalist tone throughout.',
            'dramatic': 'Dramatic and cinematic tone throughout.',
            'futuristic': 'Futuristic and sleek tone throughout.',
            'historical': 'Historical and archival tone throughout.',
            'cozy': 'Cozy and story-like tone throughout.'
        };

        // Theme pack snippets (English for prompt)
        const THEME_PACK_SNIPPETS = {
            'education': 'Use clear explanations, didactic structure, and teaching-oriented examples.',
            'business': 'Focus on efficiency, decision-making, impact, and practical outcomes.',
            'technology': 'Use precise terminology, workflows, and system-oriented explanations.',
            'history': 'Provide context, narratives, causes and consequences.',
            'kids': 'Use simple language, concrete examples, and easy metaphors.',
            'creative': 'Frame content as a story with imagery and analogies.',
            'legal': 'Use precise terminology, cautious language, and avoid metaphors or humor.',
            'science': 'Use neutral tone, hypotheses, data-driven explanations, and methodology.'
        };

        // Human-readable prompt instructions for internal enum keys, so the
        // generated prompt never leaks raw values like "default" or "beginner".
        // Format labels describe ONLY the deck format; the speaker-notes rule is
        // emitted separately and conditionally (see generatePrompt) so it never
        // duplicates the format description or contradicts the checkbox.
        const FORMAT_PROMPT_LABELS = {
            'Presenter Deck': 'Presenter deck – concise slides that support a spoken presentation.',
            'Detailed Deck': 'Detailed deck – slides carry the full explanation on their own.'
        };
        const LENGTH_PROMPT_LABELS = {
            'short': 'Keep the deck concise – include only the most essential points.',
            'default': 'Use a balanced length appropriate to the source material.',
            'long': 'Create a more thorough deck with enough depth and explanation.'
        };
        const KNOWLEDGE_PROMPT_LABELS = {
            'beginner': 'beginners with little or no prior knowledge',
            'intermediate': 'an audience with some background knowledge',
            'advanced': 'an advanced, well-informed audience'
        };

        // Built-in presets
        const BUILT_IN_PRESETS = {
            '__preset_usecases': {
                name: '10 případů použití – 3D Cut Paper',
                data: {
                    deckFormat: 'Presenter Deck',
                    deckLength: 'default',
                    outputLanguage: 'Czech',
                    customLanguage: '',
                    topic: '10 praktických případů použití',
                    primaryGoal: 'Demonstrovat praktické aplikace pomocí konkrétních příkladů',
                    targetAudience: 'Manažeři a lidé s rozhodovací pravomocí',
                    knowledgeLevel: 'intermediate',
                    numSlides: 12,
                    exactSlides: true,
                    oneIdea: true,
                    bulletsPerSlide: 3,
                    speakerNotes: true,
                    noInventedFacts: true,
                    noScreenshots: true,
                    illustrationPreset: '3d-cut-paper',
                    atmosphere: 'friendly',
                    visualConsistency: true,
                    visualConstraints: 'No screenshots, no photos, no icons. One illustration per slide.',
                    constraintLevel: 'normal',
                    themePack: 'education',
                    geminiNaming: true,
                    additionalTerminology: ''
                }
            },
            '__preset_lesson': {
                name: 'Výuková prezentace – Studenti – Začátečníci',
                data: {
                    deckFormat: 'Presenter Deck',
                    deckLength: 'long',
                    outputLanguage: 'Czech',
                    customLanguage: '',
                    topic: 'Výuková lekce',
                    primaryGoal: 'Naučit základní koncepty s jasnými vysvětleními',
                    targetAudience: 'Studenti bez předchozích znalostí',
                    knowledgeLevel: 'beginner',
                    numSlides: 15,
                    exactSlides: true,
                    oneIdea: true,
                    bulletsPerSlide: 4,
                    speakerNotes: true,
                    noInventedFacts: true,
                    noScreenshots: true,
                    illustrationPreset: 'storybook',
                    atmosphere: 'friendly',
                    visualConsistency: true,
                    visualConstraints: 'No screenshots, no photos, no icons. One illustration per slide.',
                    constraintLevel: 'normal',
                    themePack: 'kids',
                    geminiNaming: true,
                    additionalTerminology: ''
                }
            },
            '__preset_workshop': {
                name: 'Workshop – Učitelé – Středně pokročilí',
                data: {
                    deckFormat: 'Detailed Deck',
                    deckLength: 'default',
                    outputLanguage: 'Czech',
                    customLanguage: '',
                    topic: 'Interaktivní workshop',
                    primaryGoal: 'Provést učitele praktickými aktivitami',
                    targetAudience: 'Učitelé a pedagogové s určitými zkušenostmi',
                    knowledgeLevel: 'intermediate',
                    numSlides: 10,
                    exactSlides: true,
                    oneIdea: true,
                    bulletsPerSlide: 4,
                    speakerNotes: false,
                    noInventedFacts: true,
                    noScreenshots: true,
                    illustrationPreset: 'flat-vector',
                    atmosphere: 'serious',
                    visualConsistency: true,
                    visualConstraints: 'No screenshots, no photos, no icons. One illustration per slide.',
                    constraintLevel: 'strict',
                    themePack: 'education',
                    geminiNaming: true,
                    additionalTerminology: ''
                }
            }
        };

        // Form field IDs (constraintLevel is handled separately as radio buttons)
        const FORM_FIELDS = [
            'deckFormat', 'deckLength', 'outputLanguage', 'customLanguage',
            'topic', 'primaryGoal', 'targetAudience', 'knowledgeLevel', 'numSlides',
            'exactSlides', 'oneIdea', 'bulletsPerSlide', 'speakerNotes',
            'noInventedFacts', 'noScreenshots',
            'illustrationPreset', 'atmosphere', 'visualConsistency',
            'visualConstraints',
            'themePack', 'geminiNaming', 'additionalTerminology'
        ];

        // ========================================
        // VALIDATION & NORMALIZATION (M1A – security)
        // Central place that turns any untrusted input (imported JSON or
        // localStorage) into a safe, allowlisted application state object.
        // ========================================

        // Documented limits (see M1A_SECURITY_REPORT.md).
        const LIMITS = {
            presetName: 100,     // preset name
            shortText: 500,      // single-line inputs
            longText: 20000,     // multi-line free-text (visual constraints, terminology)
            maxPresets: 100      // stored custom presets
        };

        // Allowlisted enum values. Style/atmosphere/theme lists are derived
        // from the snippet dictionaries so they cannot drift out of sync.
        const ENUMS = {
            deckFormat: ['Presenter Deck', 'Detailed Deck'],
            deckLength: ['short', 'default', 'long'],
            outputLanguage: ['Czech', 'English', 'German', 'French', 'Spanish', 'custom'],
            knowledgeLevel: ['beginner', 'intermediate', 'advanced'],
            illustrationPreset: Object.keys(ILLUSTRATION_SNIPPETS),
            atmosphere: Object.keys(ATMOSPHERE_SNIPPETS),
            themePack: Object.keys(THEME_PACK_SNIPPETS),
            constraintLevel: ['normal', 'strict']
        };

        // Single source of truth for default values (also used by resetForm).
        const DEFAULT_STATE = {
            deckFormat: 'Presenter Deck',
            deckLength: 'default',
            outputLanguage: 'Czech',
            customLanguage: '',
            topic: '',
            primaryGoal: '',
            targetAudience: '',
            knowledgeLevel: 'intermediate',
            numSlides: 10,
            exactSlides: true,
            oneIdea: true,
            bulletsPerSlide: 4,
            speakerNotes: true,
            noInventedFacts: true,
            noScreenshots: true,
            illustrationPreset: '3d-cut-paper',
            atmosphere: 'friendly',
            visualConsistency: true,
            visualConstraints: 'No screenshots, no photos, no icons. One illustration per slide.',
            constraintLevel: 'normal',
            themePack: 'education',
            geminiNaming: true,
            additionalTerminology: ''
        };

        // Per-field normalization rules. Only keys listed here are ever
        // copied into application state (explicit allowlist).
        const FIELD_SCHEMA = {
            deckFormat: { type: 'enum', values: ENUMS.deckFormat },
            deckLength: { type: 'enum', values: ENUMS.deckLength },
            outputLanguage: { type: 'enum', values: ENUMS.outputLanguage },
            customLanguage: { type: 'string', max: LIMITS.shortText },
            topic: { type: 'string', max: LIMITS.shortText },
            primaryGoal: { type: 'string', max: LIMITS.shortText },
            targetAudience: { type: 'string', max: LIMITS.shortText },
            knowledgeLevel: { type: 'enum', values: ENUMS.knowledgeLevel },
            numSlides: { type: 'number', min: 3, max: 60, integer: true },
            exactSlides: { type: 'boolean' },
            oneIdea: { type: 'boolean' },
            bulletsPerSlide: { type: 'number', min: 2, max: 8, integer: true },
            speakerNotes: { type: 'boolean' },
            noInventedFacts: { type: 'boolean' },
            noScreenshots: { type: 'boolean' },
            illustrationPreset: { type: 'enum', values: ENUMS.illustrationPreset },
            atmosphere: { type: 'enum', values: ENUMS.atmosphere },
            visualConsistency: { type: 'boolean' },
            visualConstraints: { type: 'string', max: LIMITS.longText },
            constraintLevel: { type: 'enum', values: ENUMS.constraintLevel },
            themePack: { type: 'enum', values: ENUMS.themePack },
            geminiNaming: { type: 'boolean' },
            additionalTerminology: { type: 'string', max: LIMITS.longText }
        };

        // Dangerous keys that must never be treated as data keys.
        const FORBIDDEN_KEYS = ['__proto__', 'prototype', 'constructor'];

        /** True only for real, plain (non-array, non-null) objects. */
        function isPlainObject(value) {
            if (typeof value !== 'object' || value === null || Array.isArray(value)) {
                return false;
            }
            const proto = Object.getPrototypeOf(value);
            return proto === Object.prototype || proto === null;
        }

        /** Coerce to a string and clamp to maxLen; otherwise fall back. */
        function normalizeString(value, maxLen, fallback) {
            if (typeof value !== 'string') return fallback;
            return value.length > maxLen ? value.slice(0, maxLen) : value;
        }

        /** Return value only if it is in the allowlist; otherwise fall back. */
        function normalizeEnum(value, allowed, fallback) {
            return (typeof value === 'string' && allowed.indexOf(value) !== -1) ? value : fallback;
        }

        /** Parse to a finite number, clamp to [min,max]; otherwise fall back. */
        function normalizeNumber(value, min, max, fallback, integer) {
            let n = value;
            if (typeof n === 'string' && n.trim() !== '') n = Number(n);
            if (typeof n !== 'number' || !isFinite(n)) return fallback;
            if (integer) n = Math.round(n);
            if (n < min) n = min;
            if (n > max) n = max;
            return n;
        }

        /** Accept only real booleans; otherwise fall back. */
        function normalizeBoolean(value, fallback) {
            return typeof value === 'boolean' ? value : fallback;
        }

        /**
         * Build a fresh, safe state object from untrusted input.
         * Iterates the allowlist (FIELD_SCHEMA) only and reads exclusively
         * own properties, so unknown keys, inherited props and prototype
         * pollution vectors (__proto__, constructor, ...) are never applied.
         */
        function normalizeState(raw, base) {
            const source = isPlainObject(raw) ? raw : {};
            const result = {};
            Object.keys(FIELD_SCHEMA).forEach(key => {
                const rule = FIELD_SCHEMA[key];
                const def = base[key];
                const hasOwn = Object.prototype.hasOwnProperty.call(source, key);
                const val = hasOwn ? source[key] : undefined;
                switch (rule.type) {
                    case 'string':
                        result[key] = normalizeString(val, rule.max, def);
                        break;
                    case 'enum':
                        result[key] = normalizeEnum(val, rule.values, def);
                        break;
                    case 'number':
                        result[key] = normalizeNumber(val, rule.min, rule.max, def, rule.integer);
                        break;
                    case 'boolean':
                        result[key] = normalizeBoolean(val, def);
                        break;
                }
            });
            return result;
        }

        /**
         * Normalize a whole custom-presets store loaded from localStorage.
         * Keeps only valid entries, drops corrupt ones, strips forbidden
         * keys and enforces the preset count limit.
         */
        function normalizePresetStore(raw) {
            if (!isPlainObject(raw)) return {};
            const clean = {};
            let count = 0;
            Object.keys(raw).forEach(key => {
                if (count >= LIMITS.maxPresets) return;
                if (FORBIDDEN_KEYS.indexOf(key) !== -1) return;
                const entry = raw[key];
                if (!isPlainObject(entry) || !isPlainObject(entry.data)) return;
                const name = normalizeString(entry.name, LIMITS.presetName, '').trim();
                if (!name) return; // skip nameless / invalid presets
                clean[key] = { name: name, data: normalizeState(entry.data, DEFAULT_STATE) };
                count++;
            });
            return clean;
        }

        /**
         * Validate an imported preset file.
         * Returns { ok:true, name, data } or { ok:false, reason } where reason is
         * 'structure' (wrong root shape), 'data' (missing/invalid data object) or
         * 'empty' (valid object but no recognized FIELD_SCHEMA field).
         */
        function validateAndNormalizePresetImport(parsed) {
            if (!isPlainObject(parsed)) return { ok: false, reason: 'structure' };
            if (!isPlainObject(parsed.data)) return { ok: false, reason: 'data' };
            // Require at least one recognized field so that {} or unknown-only
            // data is not silently accepted as "all defaults". Only schema keys
            // are checked, so a __proto__-only payload counts as zero (rejected).
            const recognized = Object.keys(FIELD_SCHEMA).filter(
                key => Object.prototype.hasOwnProperty.call(parsed.data, key)
            );
            if (recognized.length === 0) return { ok: false, reason: 'empty' };
            return {
                ok: true,
                name: normalizeString(parsed.name, LIMITS.presetName, '').trim(),
                data: normalizeState(parsed.data, DEFAULT_STATE)
            };
        }

        // ========================================
        // INITIALIZATION
        // ========================================
        document.addEventListener('DOMContentLoaded', () => {
            loadState();
            updateCustomPresetsList();
            setupEventListeners();
            generatePrompt();
        });

        /**
         * Setup all event listeners
         */
        function setupEventListeners() {
            // Form field changes
            FORM_FIELDS.forEach(fieldId => {
                const el = document.getElementById(fieldId);
                if (el) {
                    el.addEventListener('change', onFormChange);
                    el.addEventListener('input', onFormChange);
                }
            });

            // Radio buttons for constraint level
            document.querySelectorAll('input[name="constraintLevel"]').forEach(radio => {
                radio.addEventListener('change', onFormChange);
            });

            // Deck format changes speaker notes default
            document.getElementById('deckFormat').addEventListener('change', (e) => {
                const speakerNotes = document.getElementById('speakerNotes');
                speakerNotes.checked = (e.target.value === 'Presenter Deck');
                onFormChange();
            });

            // Custom language visibility
            document.getElementById('outputLanguage').addEventListener('change', (e) => {
                const wrapper = document.getElementById('customLanguageWrapper');
                wrapper.classList.toggle('visible', e.target.value === 'custom');
            });

            // Preset selection
            document.getElementById('presetSelect').addEventListener('change', (e) => {
                if (e.target.value) {
                    loadPreset(e.target.value);
                }
            });
        }

        /**
         * Handle form change
         */
        function onFormChange() {
            saveState();
            generatePrompt();
        }

        // ========================================
        // STATE MANAGEMENT
        // ========================================

        /**
         * Get current form state
         */
        function getFormState() {
            const state = {};
            FORM_FIELDS.forEach(fieldId => {
                const el = document.getElementById(fieldId);
                if (el) {
                    if (el.type === 'checkbox') {
                        state[fieldId] = el.checked;
                    } else if (el.type === 'number') {
                        state[fieldId] = parseInt(el.value, 10);
                    } else {
                        state[fieldId] = el.value;
                    }
                }
            });
            // Handle radio buttons
            const constraintRadio = document.querySelector('input[name="constraintLevel"]:checked');
            state.constraintLevel = constraintRadio ? constraintRadio.value : 'normal';
            return state;
        }

        /**
         * Set form state
         */
        function setFormState(state) {
            FORM_FIELDS.forEach(fieldId => {
                const el = document.getElementById(fieldId);
                if (el && state.hasOwnProperty(fieldId)) {
                    if (el.type === 'checkbox') {
                        el.checked = state[fieldId];
                    } else {
                        el.value = state[fieldId];
                    }
                }
            });
            // Handle radio buttons
            if (state.constraintLevel) {
                const radio = document.getElementById(state.constraintLevel === 'strict' ? 'constraintStrict' : 'constraintNormal');
                if (radio) radio.checked = true;
            }
            // Handle custom language visibility
            const wrapper = document.getElementById('customLanguageWrapper');
            wrapper.classList.toggle('visible', state.outputLanguage === 'custom');
        }

        /**
         * Save state to localStorage
         */
        // Returns true if the write succeeded, false if storage was
        // unavailable/full. Callers doing an explicit save can report the
        // real outcome; continuous auto-save callers may ignore it.
        function saveState() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(getFormState()));
                return true;
            } catch (e) {
                console.warn('Nepodařilo se uložit stav:', e);
                return false;
            }
        }

        /**
         * Load state from localStorage
         */
        function loadState() {
            let parsed;
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (!saved) return;
                parsed = JSON.parse(saved);
            } catch (e) {
                // Corrupt JSON: keep safe defaults, do not crash.
                console.warn('Neplatná uložená data stavu – použity výchozí hodnoty.');
                return;
            }
            // Always normalize: unknown/invalid/out-of-range values are
            // replaced by safe defaults; valid values are preserved.
            setFormState(normalizeState(parsed, DEFAULT_STATE));
        }

        /**
         * Reset form
         */
        async function resetForm() {
            const ok = await showDialog({
                title: 'Obnovit výchozí hodnoty',
                message: 'Opravdu chcete obnovit všechna pole na výchozí hodnoty?',
                confirmText: 'Obnovit',
                cancelText: 'Zrušit'
            });
            if (!ok) return;

            setFormState({ ...DEFAULT_STATE });

            document.getElementById('presetSelect').value = '';
            saveState();
            generatePrompt();
            showStatus('Nastavení bylo obnoveno na výchozí hodnoty.');
        }

        // ========================================
        // PROMPT GENERATION (English output)
        // ========================================

        /**
         * Generate the final prompt
         */
        function generatePrompt() {
            const state = getFormState();
            const lines = [];

            // Append a "## Title" section only when it has at least one line,
            // so empty/optional sections never produce a bare header.
            function section(title, items) {
                const nonEmpty = items.filter(Boolean);
                if (nonEmpty.length === 0) return;
                lines.push('## ' + title);
                nonEmpty.forEach(i => lines.push(i));
                lines.push('');
            }

            // 1) Role & main task (generator instruction, not user content).
            //    The "do not invent" rule is handled once, conditionally, in the
            //    Slide Structure section so it never duplicates or conflicts.
            lines.push('You are creating a slide deck in NotebookLM Studio from the provided notebook sources.');
            lines.push('Apply the configuration below.');
            lines.push('');

            // 2) Topic & goal – values supplied by the user (clearly marked).
            section('Presentation Topic', [
                state.topic ? `- Topic (provided by the user): ${state.topic}` : '',
                state.primaryGoal ? `- Primary goal (provided by the user): ${state.primaryGoal}` : ''
            ]);

            // 3) Audience & purpose.
            section('Audience & Purpose', [
                `- Pitch the content for ${KNOWLEDGE_PROMPT_LABELS[state.knowledgeLevel] || state.knowledgeLevel}.`,
                state.targetAudience ? `- Target audience (provided by the user): ${state.targetAudience}` : '',
                THEME_PACK_SNIPPETS[state.themePack] ? `- Content framing: ${THEME_PACK_SNIPPETS[state.themePack]}` : ''
            ]);

            // 4) Language & length (mapped to natural instructions, no raw enums).
            //    For a custom language use the trimmed value; if it is empty,
            //    omit the language line entirely (never leak the internal
            //    "custom" key) and let the language follow the source content.
            const language = state.outputLanguage === 'custom'
                ? (state.customLanguage || '').trim()
                : state.outputLanguage;
            section('Language & Length', [
                language ? `- Output language: ${language}.` : '',
                `- Format: ${FORMAT_PROMPT_LABELS[state.deckFormat] || state.deckFormat}`,
                `- Length: ${LENGTH_PROMPT_LABELS[state.deckLength] || state.deckLength}`
            ]);

            // 5) Slide structure.
            section('Slide Structure', [
                state.exactSlides
                    ? `- Produce exactly ${state.numSlides} slides (no more, no less).`
                    : `- Aim for approximately ${state.numSlides} slides.`,
                state.oneIdea ? '- One main idea per slide.' : '',
                `- At most ${state.bulletsPerSlide} bullet points per slide.`,
                state.speakerNotes ? '- Include detailed speaker notes for each slide.' : '',
                state.noInventedFacts ? '- Use only facts grounded in the provided sources; do not invent information.' : ''
            ]);

            // 6) Visual style.
            section('Visual Style', [
                ILLUSTRATION_SNIPPETS[state.illustrationPreset] ? `- Illustration style: ${ILLUSTRATION_SNIPPETS[state.illustrationPreset]}` : '',
                ATMOSPHERE_SNIPPETS[state.atmosphere] ? `- Atmosphere: ${ATMOSPHERE_SNIPPETS[state.atmosphere]}` : ''
            ]);

            // 7) Text & readability.
            section('Text & Readability', [
                '- Keep on-slide text short and scannable; prefer concise phrases over full paragraphs.',
                '- Ensure text stays clearly legible against the illustrations.'
            ]);

            // 8) Image rules – each general restriction is added at most once.
            //    The user's free-text constraints are respected verbatim; the
            //    "no screenshots" rule is only added when the user hasn't already
            //    stated it (targeted known-concept check, not text dedup).
            const vc = (state.visualConstraints || '').trim();
            const imageRules = [];
            if (vc) imageRules.push(`- ${vc}`);
            if (state.noScreenshots && !/screenshot/i.test(vc)) {
                imageRules.push('- No screenshots, UI mockups, or interface elements.');
            }
            if (state.constraintLevel === 'strict') {
                imageRules.push('- Strict mode: no gradients, no logos, and no brand marks.');
            }
            section('Image Rules', imageRules);

            // 9) Terminology & notes (user content clearly under its own header).
            const notes = [];
            if (state.geminiNaming) {
                notes.push('- When referring to Gemini, use only the name "Gemini" (no version numbers such as 1.5 or 2.0).');
            }
            if (state.additionalTerminology) {
                state.additionalTerminology.split('\n').map(l => l.trim()).filter(Boolean)
                    .forEach(term => notes.push(`- ${term}`));
            }
            section('Terminology & Notes', notes);

            // 10) Final consistency & closing instruction.
            if (state.visualConsistency) {
                lines.push('Keep the illustration style and atmosphere consistent across every slide.');
            }
            lines.push('Do not explain your process and do not add extra slides.');

            // Set output
            const promptText = lines.join('\n');
            document.getElementById('generatedPrompt').value = promptText;
            document.getElementById('outputStats').textContent = `${promptText.length} znaků`;
        }

        // ========================================
        // CLIPBOARD
        // ========================================

        async function copyToClipboard() {
            const textarea = document.getElementById('generatedPrompt');
            const text = textarea.value;
            try {
                await navigator.clipboard.writeText(text);
                showStatus('✓ Zkopírováno do schránky.');
            } catch (e) {
                try {
                    textarea.select();
                    document.execCommand('copy');
                    showStatus('✓ Zkopírováno do schránky.');
                } catch (e2) {
                    showStatus('Kopírování se nezdařilo.', true);
                }
            }
        }

        // ========================================
        // ACCESSIBLE FEEDBACK & DIALOGS
        // ========================================

        /**
         * Non-blocking status message. Visible toast + polite/assertive
         * screen-reader announcement (the #copyFeedback element is a live
         * region). Errors use assertive so they are announced promptly.
         */
        function showStatus(message, isError) {
            const el = document.getElementById('copyFeedback');
            el.classList.toggle('is-error', !!isError);
            el.setAttribute('aria-live', isError ? 'assertive' : 'polite');
            // Re-set text so the live region re-announces even for repeats.
            el.textContent = '';
            // eslint-disable-next-line no-unused-expressions
            void el.offsetWidth;
            el.textContent = message;
            el.classList.add('show');
            clearTimeout(el._hideTimer);
            el._hideTimer = setTimeout(() => el.classList.remove('show'), isError ? 4000 : 2200);
        }

        /** Visible, non-disabled, focusable descendants of a container. */
        function getFocusable(container) {
            const sel = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
            return Array.from(container.querySelectorAll(sel))
                .filter(el => el.offsetParent !== null || el === document.activeElement);
        }

        /** Keep Tab focus inside `container` while a modal is open. */
        function trapFocus(container, e) {
            const f = getFocusable(container);
            if (f.length === 0) return;
            const first = f[0];
            const last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }

        /**
         * Accessible replacement for native confirm()/prompt(). Returns a
         * Promise resolving to: the entered string (input dialog, confirmed),
         * true (confirm dialog, confirmed), or null/false when cancelled.
         * Manages focus (move in, trap, restore) and Escape/Enter keys.
         */
        function showDialog(opts) {
            const o = opts || {};
            const isInput = !!o.input;
            return new Promise(resolve => {
                const overlay = document.getElementById('appDialog');
                const modal = overlay.querySelector('.modal');
                const titleEl = document.getElementById('appDialogTitle');
                const msgEl = document.getElementById('appDialogMessage');
                const inputWrap = document.getElementById('appDialogInputWrap');
                const inputEl = document.getElementById('appDialogInput');
                const inputLabel = document.getElementById('appDialogInputLabel');
                const confirmBtn = document.getElementById('appDialogConfirm');
                const cancelBtn = document.getElementById('appDialogCancel');
                const closeBtn = document.getElementById('appDialogClose');

                titleEl.textContent = o.title || '';
                msgEl.textContent = o.message || '';
                msgEl.style.display = o.message ? '' : 'none';
                inputWrap.style.display = isInput ? '' : 'none';
                inputLabel.textContent = o.inputLabel || o.title || 'Hodnota';
                inputEl.value = isInput ? (o.defaultValue || '') : '';
                confirmBtn.textContent = o.confirmText || 'OK';
                cancelBtn.textContent = o.cancelText || 'Zrušit';
                confirmBtn.classList.toggle('btn-primary', true);

                const previouslyFocused = document.activeElement;
                overlay.classList.add('visible');
                // Move focus into the dialog. Try synchronously, then once more
                // in a microtask in case the element was not yet focusable.
                const focusTarget = isInput ? inputEl : confirmBtn;
                const focusInto = () => {
                    focusTarget.focus();
                    if (isInput && document.activeElement === inputEl) inputEl.select();
                };
                focusInto();
                Promise.resolve().then(() => { if (document.activeElement !== focusTarget) focusInto(); });

                function cleanup(result) {
                    overlay.classList.remove('visible');
                    overlay.removeEventListener('keydown', onKey, true);
                    confirmBtn.removeEventListener('click', onConfirm);
                    cancelBtn.removeEventListener('click', onCancel);
                    closeBtn.removeEventListener('click', onCancel);
                    overlay.removeEventListener('mousedown', onOverlay);
                    if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
                    resolve(result);
                }
                function onConfirm() { cleanup(isInput ? inputEl.value : true); }
                function onCancel() { cleanup(isInput ? null : false); }
                function onOverlay(e) { if (e.target === overlay) onCancel(); }
                function onKey(e) {
                    if (e.key === 'Escape') { e.preventDefault(); onCancel(); }
                    else if (e.key === 'Enter' && (!isInput || e.target === inputEl)) { e.preventDefault(); onConfirm(); }
                    else if (e.key === 'Tab') { trapFocus(modal, e); }
                }
                confirmBtn.addEventListener('click', onConfirm);
                cancelBtn.addEventListener('click', onCancel);
                closeBtn.addEventListener('click', onCancel);
                overlay.addEventListener('mousedown', onOverlay);
                overlay.addEventListener('keydown', onKey, true);
            });
        }

        // ========================================
        // PRESETS MANAGEMENT
        // ========================================

        function getCustomPresets() {
            let parsed;
            try {
                const saved = localStorage.getItem(PRESETS_KEY);
                parsed = saved ? JSON.parse(saved) : {};
            } catch (e) {
                // Corrupt JSON: behave as if there were no custom presets.
                return {};
            }
            // Drop invalid entries, normalize names/data, enforce the limit.
            return normalizePresetStore(parsed);
        }

        // Returns true if the write succeeded, false if storage was
        // unavailable/full, so callers can avoid a false success message.
        function saveCustomPresets(presets) {
            try {
                localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
                return true;
            } catch (e) {
                console.warn('Nepodařilo se uložit presety:', e);
                return false;
            }
        }

        function updateCustomPresetsList() {
            const group = document.getElementById('customPresetsGroup');
            const presets = getCustomPresets();
            group.textContent = '';
            Object.keys(presets).forEach(key => {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = presets[key].name;
                group.appendChild(opt);
            });
        }

        function loadPreset(key) {
            let preset;
            if (BUILT_IN_PRESETS[key]) {
                preset = BUILT_IN_PRESETS[key];
            } else {
                const customPresets = getCustomPresets();
                preset = customPresets[key];
            }
            if (preset && preset.data) {
                setFormState(preset.data);
                saveState();
                generatePrompt();
            }
        }

        async function saveAsPreset() {
            const name = await showDialog({
                title: 'Uložit preset',
                message: 'Zadejte název nového presetu:',
                input: true,
                inputLabel: 'Název presetu',
                confirmText: 'Uložit',
                cancelText: 'Zrušit'
            });
            if (name === null) return;                 // cancelled
            if (!name.trim()) { showStatus('Zadejte prosím název presetu.', true); return; }
            const presets = getCustomPresets();
            if (Object.keys(presets).length >= LIMITS.maxPresets) {
                showStatus('Nelze uložit: byl dosažen maximální počet uložených presetů (' + LIMITS.maxPresets + ').', true);
                return;
            }
            const key = 'custom_' + Date.now();
            const safeName = normalizeString(name, LIMITS.presetName, '').trim() || 'Preset';
            presets[key] = {
                name: safeName,
                data: normalizeState(getFormState(), DEFAULT_STATE)
            };
            if (saveCustomPresets(presets)) {
                updateCustomPresetsList();
                document.getElementById('presetSelect').value = key;
                showStatus('Preset byl uložen.');
            } else {
                showStatus('Preset se nepodařilo uložit do prohlížeče.', true);
            }
        }

        async function deletePreset(key) {
            const ok = await showDialog({
                title: 'Smazat preset',
                message: 'Opravdu chcete tento preset smazat? Tuto akci nelze vrátit zpět.',
                confirmText: 'Smazat',
                cancelText: 'Zrušit'
            });
            if (!ok) return;
            const presets = getCustomPresets();
            delete presets[key];
            const saved = saveCustomPresets(presets);
            if (!saved) {
                showStatus('Preset se nepodařilo odstranit z úložiště prohlížeče.', true);
            } else {
                showStatus('Preset byl smazán.');
            }
            // Re-render from actual storage: on failure the preset truthfully
            // reappears; on success it is gone.
            updateCustomPresetsList();
            renderPresetList();
            if (saved && document.getElementById('presetSelect').value === key) {
                document.getElementById('presetSelect').value = '';
            }
            // The deleted row (and its button) is gone; move focus to a stable
            // element so keyboard users are not dropped onto <body>.
            const manage = document.getElementById('managePresetsModal');
            if (manage.classList.contains('visible')) {
                const closeBtn = manage.querySelector('.modal-close');
                if (closeBtn) closeBtn.focus();
            }
        }

        function exportPreset() {
            const state = getFormState();
            const data = {
                name: state.topic || 'Nepojmenovaný preset',
                exportedAt: new Date().toISOString(),
                data: state
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `notebooklm-preset-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }

        function importPreset(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (e) => {
                // 1) Parse — reject anything that is not valid JSON.
                let parsed;
                try {
                    parsed = JSON.parse(e.target.result);
                } catch (err) {
                    showStatus('Import se nezdařil: soubor není platný JSON.', true);
                    return;
                }
                // 2) Validate structure and normalize into an allowlisted object.
                //    On failure the current application state is left untouched.
                const validated = validateAndNormalizePresetImport(parsed);
                if (!validated.ok) {
                    let msg;
                    if (validated.reason === 'structure') {
                        msg = 'Import se nezdařil: soubor nemá podporovanou strukturu presetu.';
                    } else if (validated.reason === 'empty') {
                        msg = 'Import se nezdařil: soubor neobsahuje žádná podporovaná nastavení.';
                    } else {
                        msg = 'Import se nezdařil: soubor obsahuje neplatná nebo nepodporovaná data.';
                    }
                    showStatus(msg, true);
                    return;
                }
                // 3) Only the safe, normalized object is used from here on.
                let presetSaveFailed = false;
                const saveAsNew = await showDialog({
                    title: 'Import presetu',
                    message: 'Uložit importovaná nastavení jako nový preset? Zvolte „Jen načíst" pro pouhé načtení do formuláře.',
                    confirmText: 'Uložit jako preset',
                    cancelText: 'Jen načíst'
                });
                if (saveAsNew) {
                    const name = await showDialog({
                        title: 'Název presetu',
                        input: true,
                        inputLabel: 'Název presetu',
                        defaultValue: validated.name || 'Importovaný preset',
                        confirmText: 'Uložit',
                        cancelText: 'Zrušit'
                    });
                    if (name !== null && name.trim()) {
                        const presets = getCustomPresets();
                        if (Object.keys(presets).length >= LIMITS.maxPresets) {
                            showStatus('Nelze uložit: byl dosažen maximální počet uložených presetů (' + LIMITS.maxPresets + '). Preset bude pouze načten.', true);
                        } else {
                            const key = 'custom_' + Date.now();
                            presets[key] = {
                                name: normalizeString(name, LIMITS.presetName, '').trim() || 'Importovaný preset',
                                data: validated.data
                            };
                            if (saveCustomPresets(presets)) {
                                updateCustomPresetsList();
                                document.getElementById('presetSelect').value = key;
                            } else {
                                presetSaveFailed = true;
                            }
                        }
                    }
                }
                // Load into the form (in-memory) and try to persist that state.
                setFormState(validated.data);
                const stateSaved = saveState();
                generatePrompt();
                // Report the real outcome: only claim persistence if it happened.
                if (stateSaved && !presetSaveFailed) {
                    showStatus('Preset byl úspěšně importován.');
                } else {
                    showStatus('Import byl načten, ale nepodařilo se jej uložit do prohlížeče. Po obnovení stránky se nemusí zachovat.', true);
                }
            };
            reader.readAsText(file);
            event.target.value = '';
        }

        // ========================================
        // MODAL
        // ========================================

        let managePresetsReturnFocus = null;

        function openManagePresets() {
            renderPresetList();
            const overlay = document.getElementById('managePresetsModal');
            managePresetsReturnFocus = document.activeElement;
            overlay.classList.add('visible');
            overlay.addEventListener('keydown', manageModalKeydown, true);
            // Move focus into the dialog (first focusable = close button), with
            // a microtask retry in case it was not yet focusable this tick.
            const focusInto = () => {
                const focusable = getFocusable(overlay.querySelector('.modal'));
                (focusable[0] || overlay).focus();
            };
            focusInto();
            Promise.resolve().then(() => {
                if (!overlay.contains(document.activeElement)) focusInto();
            });
        }

        function closeModal() {
            const overlay = document.getElementById('managePresetsModal');
            if (!overlay.classList.contains('visible')) return;
            overlay.classList.remove('visible');
            overlay.removeEventListener('keydown', manageModalKeydown, true);
            // Restore focus to whatever opened the modal.
            if (managePresetsReturnFocus && managePresetsReturnFocus.focus) {
                managePresetsReturnFocus.focus();
            }
            managePresetsReturnFocus = null;
        }

        function manageModalKeydown(e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeModal();
            } else if (e.key === 'Tab') {
                trapFocus(document.getElementById('managePresetsModal').querySelector('.modal'), e);
            }
        }

        // Build one preset row entirely via DOM APIs. User-controlled values
        // (preset name) are set with textContent only, and the preset key is
        // captured in a closure – never interpolated into HTML or an inline
        // handler – so no untrusted data can be parsed as markup or script.
        function buildPresetRow(name, key, isBuiltIn) {
            const item = document.createElement('div');
            item.className = 'preset-item';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'preset-item-name';
            nameSpan.textContent = name;
            if (isBuiltIn) {
                const badge = document.createElement('span');
                badge.className = 'preset-item-badge';
                badge.textContent = 'Vestavěný';
                nameSpan.appendChild(document.createTextNode(' '));
                nameSpan.appendChild(badge);
            }

            const actions = document.createElement('div');
            actions.className = 'preset-item-actions';

            const loadBtn = document.createElement('button');
            loadBtn.className = 'btn btn-small';
            loadBtn.textContent = 'Načíst';
            loadBtn.addEventListener('click', () => { loadPreset(key); closeModal(); });
            actions.appendChild(loadBtn);

            if (!isBuiltIn) {
                const delBtn = document.createElement('button');
                delBtn.className = 'btn btn-small';
                delBtn.textContent = '🗑️';
                delBtn.setAttribute('aria-label', 'Smazat preset ' + name);
                delBtn.addEventListener('click', () => deletePreset(key));
                actions.appendChild(delBtn);
            }

            item.appendChild(nameSpan);
            item.appendChild(actions);
            return item;
        }

        function renderPresetList() {
            const container = document.getElementById('presetList');
            const customPresets = getCustomPresets();
            container.textContent = ''; // clear safely (no innerHTML)

            // Built-in presets
            Object.keys(BUILT_IN_PRESETS).forEach(key => {
                container.appendChild(buildPresetRow(BUILT_IN_PRESETS[key].name, key, true));
            });

            // Custom presets
            const customKeys = Object.keys(customPresets);
            customKeys.forEach(key => {
                container.appendChild(buildPresetRow(customPresets[key].name, key, false));
            });

            if (customKeys.length === 0) {
                const empty = document.createElement('p');
                empty.style.color = 'var(--text-muted)';
                empty.style.textAlign = 'center';
                empty.style.padding = '16px';
                empty.textContent = 'Zatím nemáte žádné vlastní presety.';
                container.appendChild(empty);
            }
        }

        // Close the manage-presets modal on overlay (outside) click. No unsaved
        // work is lost here. Escape and Tab-trapping are handled per-modal while
        // it is open (manageModalKeydown / showDialog), so no global key handler
        // is needed.
        document.getElementById('managePresetsModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        });
