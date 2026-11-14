class StressCheckApp {
    constructor() {
        this.currentQuestion = 0;
        this.answers = {};
        this.totalScore = 0;
        this.categoryScores = {};
        this.stressLevel = null;
        this.entrySurface = this.getAutoStartSurface() || 'direct';
        this.entryMode = this.entrySurface === 'direct' ? 'manual' : 'linked';
        this.completionTracked = false;
        this.testRunning = false;
        this.resultActionTracked = false;
        this.planClickTracked = false;
        this.init();
    }

    async init() {
        try {
            await i18n.init();
        } catch (e) {
            console.warn('i18n init failed:', e);
        } finally {
            this.setupEventListeners();
            this.hideLoader();
            document.getElementById('intro-screen').classList.add('active');
            this.track('stress_intro_view', { surface: 'intro_screen', entry_mode: this.entryMode, cta_surface: this.entrySurface });
            this.observeIntroCta();
            if (this.entryMode === 'linked') setTimeout(() => this.startTest(this.entrySurface, 'linked'), 80);
        }
    }

    getUrlParam(name) {
        try { return new URLSearchParams(window.location.search || '').get(name) || ''; }
        catch (error) { return ''; }
    }

    getAutoStartSurface() {
        if (this.getUrlParam('start') !== '1') return '';
        const surface = this.getUrlParam('surface');
        if (/^zh_cognitive_distortion_(primary|quick)$/.test(surface)) return surface;
        if (/^fr_cognitive_distortion_(primary|quick)$/.test(surface)) return surface;
        return /^es_cognitive_distortion_(primary|quick)$/.test(surface) ? surface : '';
    }

    setupEventListeners() {
        // Start button
        document.getElementById('btn-start').addEventListener('click', () => this.startTest('intro_primary_cta', 'manual'));

        // Option buttons
        document.getElementById('q-options').addEventListener('click', (e) => {
            const button = e.target.closest('.option-btn');
            if (button) this.selectAnswer(button);
        });

        // Action buttons
        document.getElementById('btn-retry').addEventListener('click', () => this.retryTest());
        document.getElementById('btn-action-plan').addEventListener('click', event => this.openActionPlan(event));
        const btnStoryCard = document.getElementById('btn-story-card');
        if (btnStoryCard) {
            btnStoryCard.addEventListener('click', () => this.generateAndShareCard());
        }

        // Language selector
        document.getElementById('lang-toggle').addEventListener('click', () => this.toggleLanguageMenu());
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeLanguage(e.target.dataset.lang));
        });

        const aboutTest = document.querySelector('.about-test');
        if (aboutTest) {
            aboutTest.addEventListener('toggle', () => {
                if (aboutTest.open) {
                    this.track('stress_about_open', { surface: 'intro_about_test' });
                }
            });
        }

        // Related tests click telemetry
        document.querySelectorAll('.related-card').forEach(card => {
            card.addEventListener('click', () => {
                const targetPath = card.getAttribute('href') || '';
                const key = targetPath.includes('future-self') ? 'future-self' : targetPath.includes('hsp-test') ? 'hsp-test' : targetPath.includes('stress-type') ? 'stress-type' : targetPath.includes('stress-response') ? 'stress-response' : 'other';
                this.track('stress_related_click', { related_target: key, cta_surface: 'stress_result_related' });
                if (typeof gtag === 'function') {
                    gtag('event', 'content_cta_click', {
                        event_category: 'engagement',
                        page_path: location.pathname,
                        target_url: card.href,
                        link_id: 'stress_related_' + (key || 'card')
                    });
                }
            });
        });

        // Initialize curated resource localization & telemetry
        this.initCuratedResources();

        // Initialize Theme Toggle
        this.initTheme();
    }

    getCuratedHref(key, lang) {
        const asins = {
            burnout: '1523508842',
            hsp: '0553062182'
        };
        const koQueries = {
            burnout: '번아웃 에밀리 나가스키',
            hsp: '타인보다 민감한 사람 일레인 아론'
        };
        const amazonDomains = {
            en: { domain: 'amazon.com', tag: 'dopabrain-20' },
            de: { domain: 'amazon.de', tag: '' },
            fr: { domain: 'amazon.fr', tag: '' },
            es: { domain: 'amazon.es', tag: '' },
            pt: { domain: 'amazon.com', tag: 'dopabrain-20' },
            ja: { domain: 'amazon.co.jp', tag: '' }
        };
        const asin = asins[key];
        if (!asin) return '';
        if (lang === 'ko') {
            return 'https://search.kyobobook.co.kr/search?keyword=' + encodeURIComponent(koQueries[key] || key);
        }
        const market = amazonDomains[lang] || amazonDomains.en;
        return 'https://www.' + market.domain + '/dp/' + asin + (market.tag ? ('?tag=' + market.tag) : '');
    }

    initCuratedResources() {
        const card = document.getElementById('curated-resources-card');
        if (!card) return;
        const items = card.querySelectorAll('.curated-item');
        const keys = ['burnout', 'hsp'];
        items.forEach((item, index) => {
            const key = item.dataset.curatedKey || keys[index] || ('resource_' + (index + 1));
            item.dataset.curatedKey = key;
            if (!item.dataset.curatedBound) {
                item.dataset.curatedBound = '1';
                item.addEventListener('click', () => {
                    const lang = (window.i18n && window.i18n.currentLang) || document.documentElement.lang || 'en';
                    this.track('curated_resource_click', {
                        resource_key: key,
                        content_locale: lang,
                        cta_surface: 'curated_resources'
                    });
                    if (typeof gtag === 'function') {
                        gtag('event', 'content_cta_click', {
                            event_category: 'engagement',
                            page_path: location.pathname,
                            target_url: item.href,
                            link_id: 'stress_curated_' + key
                        });
                    }
                });
            }
        });
        this.updateCuratedResources((window.i18n && window.i18n.currentLang) || document.documentElement.lang || 'en');
    }

    updateCuratedResources(lang) {
        const card = document.getElementById('curated-resources-card');
        if (!card) return;
        card.querySelectorAll('.curated-item').forEach((item) => {
            const nextHref = this.getCuratedHref(item.dataset.curatedKey, lang);
            if (nextHref) item.href = nextHref;
        });

        // Dormant high-margin digital workbook slot: set Gumroad/Lemon Squeezy URL to activate
        const workbookCheckoutUrl = '';
        if (!/^https?:\/\//i.test(workbookCheckoutUrl)) return;
        const list = card.querySelector('.curated-list');
        if (!list) return;
        let wbLink = list.querySelector('.curated-item[data-curated-key="workbook_pdf"]');
        if (!wbLink) {
            wbLink = document.createElement('a');
            wbLink.className = 'curated-item';
            wbLink.dataset.curatedKey = 'workbook_pdf';
            wbLink.target = '_blank';
            wbLink.rel = 'noopener noreferrer';
            wbLink.addEventListener('click', () => {
                const currentLang = (window.i18n && window.i18n.currentLang) || document.documentElement.lang || 'en';
                this.track('curated_resource_click', {
                    resource_key: 'workbook_pdf',
                    content_locale: currentLang,
                    cta_surface: 'curated_resources'
                });
                if (typeof gtag === 'function') {
                    gtag('event', 'content_cta_click', {
                        event_category: 'engagement',
                        page_path: location.pathname,
                        target_url: wbLink.href,
                        link_id: 'stress_curated_workbook_pdf'
                    });
                }
            });
            list.appendChild(wbLink);
        }
        wbLink.href = workbookCheckoutUrl;
        wbLink.innerHTML = '';
        const titleSpan = document.createElement('span');
        titleSpan.className = 'curated-item-title';
        titleSpan.textContent = lang === 'ko'
            ? '30일 자율신경 리셋 워크북 (PDF)'
            : '30-Day Stress & HSP Reset Workbook (PDF)';
        const metaSpan = document.createElement('span');
        metaSpan.className = 'curated-item-meta';
        metaSpan.textContent = lang === 'ko'
            ? '프린트용 일지 & 체크리스트 · 즉시 다운로드 ($4.90)'
            : 'Printable daily tracker & worksheets · Instant PDF ($4.90)';
        wbLink.appendChild(titleSpan);
        wbLink.appendChild(metaSpan);
    }

    track(eventName, params = {}) {
        if (typeof gtag !== 'function') return;
        gtag('event', eventName, Object.assign({
            app_name: 'stress-check',
            content_group: 'stress_check'
        }, params));
    }

    observeIntroCta() {
        const startButton = document.getElementById('btn-start');
        if (!startButton || startButton.dataset.viewTracked === '1') return;

        const sendView = () => {
            if (startButton.dataset.viewTracked === '1') return;
            startButton.dataset.viewTracked = '1';
            this.track('stress_intro_cta_view', { surface: 'intro_primary_cta', entry_mode: this.entryMode, cta_surface: this.entrySurface });
        };

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                if (entries.some(entry => entry.isIntersecting)) {
                    sendView();
                    observer.disconnect();
                }
            }, { threshold: 0.6 });
            observer.observe(startButton);
        } else {
            sendView();
        }
    }

    startTest(ctaSurface = 'intro_primary_cta', entryMode = 'manual') {
        if (this.testRunning) return;
        this.testRunning = true;
        this.entryMode = entryMode;
        this.entrySurface = ctaSurface;
        this.track('stress_intro_start_click', { surface: ctaSurface, entry_mode: entryMode, cta_surface: ctaSurface });
        this.track('test_start', { content_type: 'reflection', entry_mode: entryMode, cta_surface: ctaSurface });
        this.currentQuestion = 0;
        this.answers = {};
        this.totalScore = 0;
        this.completionTracked = false;
        this.resultActionTracked = false;
        this.planClickTracked = false;
        this.showScreen('question-screen');
        this.loadQuestion();
    }

    loadQuestion() {
        const question = STRESS_QUESTIONS[this.currentQuestion];
        const qText = document.getElementById('question-text');
        const qCategory = document.getElementById('q-category');
        const qOptions = document.getElementById('q-options');

        qText.textContent = i18n.t(question.text);
        qText.setAttribute('tabindex', '-1');
        qCategory.textContent = i18n.t(question.categoryLabel);

        qOptions.innerHTML = '';
        const options = [
            { value: 1, label: 'options.notAtAll' },
            { value: 2, label: 'options.rarely' },
            { value: 3, label: 'options.sometimes' },
            { value: 4, label: 'options.often' },
            { value: 5, label: 'options.veryMuch' }
        ];

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span class="opt-emoji">${this.getEmoji(opt.value)}</span><span class="opt-text">${i18n.t(opt.label)}</span>`;
            btn.dataset.value = opt.value;

            if (this.answers[question.id] === opt.value) {
                btn.classList.add('selected');
            }

            qOptions.appendChild(btn);
        });

        this.updateProgress();
        qText.focus({ preventScroll: true });
    }

    getEmoji(value) {
        const emojis = ['😊', '🙂', '😐', '😟', '😰'];
        return emojis[value - 1];
    }

    selectAnswer(btn) {
        document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        const question = STRESS_QUESTIONS[this.currentQuestion];
        const value = parseInt(btn.dataset.value);
        this.answers[question.id] = value;

        setTimeout(() => {
            this.nextQuestion();
        }, 300);
    }

    nextQuestion() {
        if (this.currentQuestion < STRESS_QUESTIONS.length - 1) {
            this.currentQuestion++;
            this.loadQuestion();
        } else {
            this.finishTest();
        }
    }

    updateProgress() {
        const progress = ((this.currentQuestion + 1) / STRESS_QUESTIONS.length) * 100;
        document.getElementById('progress-fill').style.width = progress + '%';
        document.getElementById('progress-text').textContent = `${this.currentQuestion + 1} / ${STRESS_QUESTIONS.length}`;
    }

    finishTest() {
        this.calculateResults();
        this.displayResults();
    }

    calculateResults() {
        this.totalScore = Object.values(this.answers).reduce((a, b) => a + b, 0);
        this.categoryScores = calculateCategoryScores(this.answers);
        this.stressLevel = calculateStressLevel(this.totalScore);
    }

    displayResults() {
        this.showScreen('result-screen');
        this.testRunning = false;

        if (!this.completionTracked) {
            this.completionTracked = true;
            this.track('test_complete', { content_type: 'reflection', entry_mode: this.entryMode, cta_surface: this.entrySurface });
        }

        // Result info
        document.getElementById('result-emoji').textContent = this.stressLevel.emoji;
        document.getElementById('result-level-title').textContent = i18n.t(this.stressLevel.title);
        document.getElementById('result-level-subtitle').textContent = i18n.t(this.stressLevel.subtitle);
        document.getElementById('result-desc').textContent = i18n.t(this.stressLevel.description);

        // Category analysis
        this.displayCategoryAnalysis();

        // Relief tips
        this.displayReliefTips();

        this.updateNextStepCard();
        this.updatePlanLink();
        this.observeResultAction();
    }

    getRecommendedNextStep() {
        const currentLang = (window.i18n && typeof i18n.getCurrentLanguage === 'function') ? i18n.getCurrentLanguage() : 'en';
        if (this.totalScore >= 31) {
            const descs = {
                ko: '높은 스트레스는 감각 과부하와 민감성에서 비롯될 수 있습니다. 고감각자(HSP) 성향을 확인해보세요.',
                ja: '高いストレスは感覚の過負荷や敏感さから生じる場合があります。HSP傾向を測定してみましょう。',
                zh: '高度压力通常源于感觉过载与敏感体质。立即测试您的高敏感(HSP)特征。',
                es: 'El estrés alto suele deberse a la sobrecarga sensorial. Evalúa tu perfil de sensibilidad.',
                fr: 'Un stress élevé découle souvent d’une sensibilité sensorielle. Testez votre profil de sensibilité.',
                de: 'Hoher Stress entsteht oft durch sensorische Reizüberflutung. Testen Sie Ihr Sensibilitätsprofil.'
            };
            const ctas = {
                ko: 'HSP 테스트 시작하기 →',
                ja: 'HSP診断を始める →',
                zh: '开始HSP高敏感测试 →',
                es: 'Realizar test HSP →',
                fr: 'Commencer le test HSP →',
                de: 'HSP-Test starten →'
            };
            return {
                key: 'hsp-test',
                path: '/hsp-test/',
                source: 'stress_high',
                emoji: '🧠',
                title: (window.i18n && i18n.t('related.hspTest')) || 'HSP Test',
                desc: descs[currentLang] || 'Overwhelm often stems from sensory processing sensitivity. Check your environmental sensitivity profile.',
                ctaText: ctas[currentLang] || 'Take HSP Test →'
            };
        } else if (this.totalScore >= 16) {
            const descs = {
                ko: '일상의 스트레스를 줄이고 장기적 관점에서 현명한 결정을 내리는 미래 자아 성향 진단입니다.',
                ja: '日々の決断疲れを減らし、長期的な視点でメンタルを整える未来の自分診断です。',
                zh: '减少日常决策疲劳，从长远视角建立心理韧性与目标规划。',
                es: 'Alinea tus decisiones cotidianas con tu resiliencia a largo plazo para reducir el desgaste mental.',
                fr: 'Alignez vos choix quotidiens avec votre vision à long terme pour réduire la fatigue mentale.',
                de: 'Richten Sie tägliche Entscheidungen auf langfristige Resilienz aus, um mentale Erschöpfung zu senken.'
            };
            const ctas = {
                ko: '미래의 나 테스트 시작하기 →',
                ja: '未来の自分診断を始める →',
                zh: '开始未来自画像测试 →',
                es: 'Explorar Yo Futuro →',
                fr: 'Explorer mon Moi Futur →',
                de: 'Zukunfts-Ich Test starten →'
            };
            return {
                key: 'future-self',
                path: '/future-self/',
                source: 'stress_mod',
                emoji: '🔮',
                title: (window.i18n && i18n.t('related.futureSelf')) || 'Future Self',
                desc: descs[currentLang] || 'Align daily decisions with your long-term resilience to reduce recurring mental fatigue.',
                ctaText: ctas[currentLang] || 'Explore Future Self →'
            };
        } else {
            const titles = {
                ko: 'IQ 스타일 퍼즐',
                ja: 'IQスタイルパズル',
                zh: 'IQ 思维挑战',
                es: 'Reto IQ Visual',
                fr: 'Défi Logique IQ',
                de: 'IQ-Logik-Challenge'
            };
            const descs = {
                ko: '안정된 멘탈 상태에서 언어중립 10문항 퍼즐로 패턴 추론과 집중력을 가볍게 점검해보세요.',
                ja: '安定したメンタル状態で、言語に依存しない10問のパズルでパターン推論力を試しましょう。',
                zh: '心理状态良好！通过10道无语言障碍的图形与数字推理题保持思维敏锐。',
                es: 'Tienes una base mental saludable. Pon a prueba tu razonamiento lógico con 10 acertijos visuales.',
                fr: 'Vous disposez d’une base mentale saine. Testez votre logique avec 10 énigmes visuelles.',
                de: 'Sie haben eine gesunde mentale Grundlage. Testen Sie Ihr logisches Denken mit 10 visuellen Rätseln.'
            };
            const ctas = {
                ko: 'IQ 퍼즐 도전하기 →',
                ja: 'IQパズルに挑戦 →',
                zh: '开始IQ推理挑战 →',
                es: 'Probar Reto IQ →',
                fr: 'Essayer le Défi IQ →',
                de: 'IQ-Challenge starten →'
            };
            return {
                key: 'iq-test',
                path: '/iq-test/',
                source: 'stress_low',
                emoji: '🧩',
                title: titles[currentLang] || '10-Puzzle IQ Challenge',
                desc: descs[currentLang] || 'You have a healthy mental foundation. Keep your focus sharp with 10 language-neutral pattern puzzles.',
                ctaText: ctas[currentLang] || 'Try 10-Puzzle IQ Challenge →'
            };
        }
    }

    updateNextStepCard() {
        const nextCard = document.getElementById('next-step-card');
        const nextTitle = document.getElementById('next-step-title');
        const nextDesc = document.getElementById('next-step-desc');
        const nextEmoji = document.getElementById('next-step-emoji');
        const nextCta = document.getElementById('next-step-cta');
        const nextCtaText = document.getElementById('next-step-cta-text');
        if (!nextCard || !nextTitle || !nextDesc || !nextEmoji || !nextCta || !nextCtaText) return;

        const rec = this.getRecommendedNextStep();
        const currentLang = (window.i18n && typeof i18n.getCurrentLanguage === 'function') ? i18n.getCurrentLanguage() : 'en';
        nextTitle.textContent = rec.title;
        nextDesc.textContent = rec.desc;
        nextEmoji.textContent = rec.emoji;
        nextCta.href = `${rec.path}?lang=${encodeURIComponent(currentLang)}&source=${rec.source}`;
        nextCta.setAttribute('data-related-key', rec.key);
        nextCtaText.textContent = rec.ctaText;

        if (!nextCta.dataset.clickBound) {
            nextCta.dataset.clickBound = '1';
            nextCta.addEventListener('click', () => {
                this.track('stress_hero_cta_click', {
                    target_key: rec.key,
                    surface: 'result_hero_funnel'
                });
                if (typeof gtag === 'function') {
                    gtag('event', 'content_cta_click', {
                        event_category: 'engagement',
                        page_path: location.pathname,
                        target_url: nextCta.href,
                        link_id: 'stress_hero_' + (rec.key || 'next')
                    });
                }
            });
        }
    }

    displayCategoryAnalysis() {
        const radarList = document.getElementById('radar-list');
        radarList.innerHTML = '';

        const categoryLabels = {
            work: 'categories.workStudy',
            relationship: 'categories.relationships',
            health: 'categories.health',
            finance: 'categories.finance',
            daily: 'categories.dailyLife'
        };

        Object.entries(this.categoryScores).forEach(([category, score]) => {
            const percentage = Math.round((score / 5) * 100);

            const item = document.createElement('div');
            item.className = 'radar-item';
            item.innerHTML = `
                <div class="radar-label">${i18n.t(categoryLabels[category])}</div>
                <div class="radar-bar-bg">
                    <div class="radar-bar" style="width: 0%"></div>
                </div>
                <div class="radar-value">${score}/5</div>
            `;

            radarList.appendChild(item);

            setTimeout(() => {
                item.querySelector('.radar-bar').style.width = percentage + '%';
            }, 100);
        });
    }

    displayReliefTips() {
        const tipsList = document.getElementById('relief-tips-list');
        tipsList.innerHTML = '';

        const tipsKey = getReliefTips(this.stressLevel.level);
        const tips = i18n.t(tipsKey);

        if (Array.isArray(tips)) {
            tips.forEach(tip => {
                const li = document.createElement('li');
                li.textContent = tip;
                tipsList.appendChild(li);
            });
        }
    }

    observeResultAction() {
        const action = document.getElementById('result-primary-action');
        if (!action || this.resultActionTracked) return;
        let timer = 0;
        const observer = new IntersectionObserver(entries => {
            const visible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.5);
            clearTimeout(timer);
            if (visible && !this.resultActionTracked) timer = setTimeout(() => {
                this.resultActionTracked = true;
                this.track('stress_result_action_view', { surface: 'result_primary_action' });
                observer.disconnect();
            }, 500);
        }, { threshold: [0.5] });
        observer.observe(action);
    }

    updatePlanLink() {
        const currentLang = i18n.getCurrentLanguage();
        const target = new URL('plan.html', window.location.href);
        target.searchParams.set('lang', currentLang);
        target.searchParams.set('source', 'stress_result');
        document.getElementById('btn-action-plan').href = target.toString();

        document.querySelectorAll('.related-card').forEach(card => {
            const rawHref = card.getAttribute('href');
            if (rawHref && rawHref.startsWith('/')) {
                const url = new URL(rawHref, window.location.origin);
                url.searchParams.set('lang', currentLang);
                url.searchParams.set('source', 'stress_result');
                card.href = url.pathname + url.search;
            }
        });

        const nextStepCta = document.getElementById('next-step-cta');
        if (nextStepCta) {
            const rawNext = nextStepCta.getAttribute('href');
            if (rawNext && rawNext.startsWith('/')) {
                const nextUrl = new URL(rawNext, window.location.origin);
                nextUrl.searchParams.set('lang', currentLang);
                nextStepCta.href = nextUrl.pathname + nextUrl.search;
            }
        }
    }

    generateAndShareCard() {
        const btn = document.getElementById('btn-story-card');
        const orig = btn ? btn.textContent : '';
        if (btn) { btn.textContent = '\u23F3 Rendering...'; btn.disabled = true; }

        try {
            const canvas = this.renderStoryCardCanvas();
            if (!canvas) throw new Error('Canvas rendering failed');

            canvas.toBlob(async (blob) => {
                if (!blob) throw new Error('Blob creation failed');
                const file = new File([blob], 'stress-diagnosis-card.png', { type: 'image/png' });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            files: [file],
                            title: 'My Stress Level Profile',
                            text: 'Check your autonomic stress level on DopaBrain: https://dopabrain.com/stress-check/'
                        });
                        this.track('share', { method: 'story_card_native', app_name: 'stress-check' });
                        if (btn) { btn.textContent = '\u2713 Shared!'; setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2500); }
                        return;
                    } catch (shareErr) {
                        if (shareErr.name === 'AbortError') {
                            if (btn) { btn.textContent = orig; btn.disabled = false; }
                            return;
                        }
                    }
                }

                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'stress-diagnosis-card.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(url), 10000);

                this.track('share', { method: 'story_card_download', app_name: 'stress-check' });
                if (btn) { btn.textContent = '\u2713 Saved to Photos!'; setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2500); }
            }, 'image/png');
        } catch (err) {
            console.warn('Stress story card failed:', err);
            if (btn) { btn.textContent = orig; btn.disabled = false; }
        }
    }

    renderStoryCardCanvas() {
        if (!this.stressLevel) return null;
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1920;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        const levelTitle = (window.i18n && i18n.t(this.stressLevel.title)) || 'Moderate Stress';
        const levelSub = (window.i18n && i18n.t(this.stressLevel.subtitle)) || 'Autonomic Strain Profile';
        const emoji = this.stressLevel.emoji || '\u{1F610}';
        const themeColor = this.stressLevel.color || '#3b82f6';

        // Background
        const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920);
        bgGrad.addColorStop(0, '#090b14');
        bgGrad.addColorStop(0.4, '#121024');
        bgGrad.addColorStop(1, '#07080f');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1080, 1920);

        // Glowing orb
        const glow = ctx.createRadialGradient(540, 560, 50, 540, 560, 460);
        glow.addColorStop(0, themeColor + '55');
        glow.addColorStop(0.6, themeColor + '15');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(60, 120, 960, 900);

        // Inner frame
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 3;
        this.drawCanvasRoundRect(ctx, 50, 50, 980, 1820, 36);
        ctx.stroke();
        ctx.restore();

        // Header
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.font = '600 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText('DOPABRAIN  \u2022  AUTONOMIC HEALTH', 540, 150);

        ctx.fillStyle = '#ffffff';
        ctx.font = '800 44px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText('STRESS LEVEL DIAGNOSIS', 540, 220);

        // Central emoji avatar
        ctx.save();
        ctx.beginPath();
        ctx.arc(540, 460, 130, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = themeColor;
        ctx.stroke();

        ctx.font = '120px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 540, 465);
        ctx.restore();

        // Level title & subtitle
        ctx.fillStyle = themeColor;
        ctx.font = '800 60px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText(levelTitle, 540, 680);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.font = '500 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText(levelSub, 540, 735);

        // 5 Category Breakdown
        const categoryLabels = {
            work: (window.i18n && i18n.t('categories.workStudy')) || 'Work & Study',
            relationship: (window.i18n && i18n.t('categories.relationships')) || 'Relationships',
            health: (window.i18n && i18n.t('categories.health')) || 'Health & Body',
            finance: (window.i18n && i18n.t('categories.finance')) || 'Finance & Security',
            daily: (window.i18n && i18n.t('categories.dailyLife')) || 'Daily Life'
        };

        const startY = 820;
        let idx = 0;
        Object.entries(this.categoryScores || {}).forEach(([cat, score]) => {
            const label = categoryLabels[cat] || cat;
            const pct = Math.round((score / 5) * 100);
            const y = startY + (idx * 100);

            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 1.5;
            this.drawCanvasRoundRect(ctx, 120, y, 840, 76, 18);
            ctx.fill();
            ctx.stroke();

            ctx.textAlign = 'left';
            ctx.fillStyle = '#e2e8f0';
            ctx.font = '600 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            ctx.fillText(label, 150, y + 48);

            ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
            this.drawCanvasRoundRect(ctx, 520, y + 26, 320, 24, 12);
            ctx.fill();

            const fillWidth = Math.max(16, (320 * pct) / 100);
            ctx.fillStyle = themeColor;
            this.drawCanvasRoundRect(ctx, 520, y + 26, fillWidth, 24, 12);
            ctx.fill();

            ctx.textAlign = 'right';
            ctx.fillStyle = '#ffffff';
            ctx.font = '700 26px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
            ctx.fillText(pct + '%', 920, y + 48);

            ctx.restore();
            idx++;
        });

        // Somatic recovery advice box
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.strokeStyle = themeColor + '55';
        ctx.lineWidth = 2;
        this.drawCanvasRoundRect(ctx, 120, 1370, 840, 200, 20);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#38bdf8';
        ctx.font = '700 26px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText('\u26A1 SOMATIC REGULATION PROTOCOL', 540, 1425);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
        ctx.font = '500 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText('Take 2 consecutive nasal inhales + 1 long oral exhale', 540, 1485);
        ctx.fillText('to rapidly signal safety to your amygdala and heart rate.', 540, 1525);
        ctx.restore();

        // Footer
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '500 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText('Test your autonomic stress level at', 540, 1680);

        ctx.fillStyle = '#ffffff';
        ctx.font = '700 38px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText('dopabrain.com/stress-check', 540, 1740);

        return canvas;
    }

    drawCanvasRoundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    openActionPlan() {
        if (!this.stressLevel) return;
        this.updatePlanLink();
        if (!this.planClickTracked) {
            this.planClickTracked = true;
            this.track('stress_plan_click', { surface: 'result_primary_action' });
        }
        if (typeof gtag === 'function') {
            gtag('event', 'content_cta_click', {
                event_category: 'engagement',
                page_path: location.pathname,
                target_url: document.getElementById('btn-action-plan').href,
                link_id: 'stress_action_plan'
            });
        }
    }

    retryTest() {
        this.testRunning = false;
        this.showScreen('intro-screen');
        window.scrollTo(0, 0);
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        window.scrollTo(0, 0);
    }

    showLoading() {
        this.showScreen('loading-screen');
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 40;
            if (progress > 100) progress = 100;
            document.getElementById('loading-fill').style.width = progress + '%';

            if (progress === 100) {
                clearInterval(interval);
            }
        }, 200);
    }

    hideLoader() {
        document.getElementById('app-loader').classList.add('hidden');
    }

    toggleLanguageMenu() {
        const menu = document.getElementById('lang-menu');
        menu.classList.toggle('hidden');
    }

    async changeLanguage(lang) {
        await i18n.setLanguage(lang);

        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            }
        });

        this.toggleLanguageMenu();
        this.updateCuratedResources(lang);

        // Reload current screen content
        if (this.currentQuestion > 0 && this.currentQuestion < STRESS_QUESTIONS.length) {
            this.loadQuestion();
        } else if (this.stressLevel) {
            this.displayResults();
        }
    }

    // Theme Toggle Function
    initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;

        // Load theme preference from localStorage
        const savedTheme = localStorage.getItem('app-theme') || 'dark';
        html.setAttribute('data-theme', savedTheme);
        this.updateThemeButton(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = html.getAttribute('data-theme') || 'dark';
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('app-theme', newTheme);
                this.updateThemeButton(newTheme);
            });
        }
    }

    updateThemeButton(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
            themeToggle.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new StressCheckApp();
});
