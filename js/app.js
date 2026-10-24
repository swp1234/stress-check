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
                const key = targetPath.includes('future-self') ? 'future-self' : targetPath.includes('hsp-test') ? 'hsp-test' : targetPath.includes('stress-response') ? 'stress-response' : 'other';
                this.track('stress_related_click', { related_target: key, cta_surface: 'stress_result_related' });
            });
        });

        // Initialize Theme Toggle
        this.initTheme();
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
            const descs = {
                ko: '안정된 멘탈 상태에서 당신의 고유한 인지 스타일과 최고의 업무 집중 방식을 탐색해보세요.',
                ja: '安定した心理状態から、あなたの認知スタイルと最適な集中パターンを探求しましょう。',
                zh: '心理状态良好！探索您的独特认知风格与高效思维专注模式。',
                es: 'Tienes una base mental saludable. Descubre tu estilo cognitivo y hábitos de enfoque óptimos.',
                fr: 'Vous disposez d’une base mentale saine. Découvrez votre style cognitif et vos forces d’attention.',
                de: 'Sie haben eine gesunde mentale Grundlage. Entdecken Sie Ihren kognitiven Stil und Fokus-Stärken.'
            };
            const ctas = {
                ko: '뇌 유형 테스트 시작하기 →',
                ja: '脳タイプ診断を始める →',
                zh: '开始大脑类型测试 →',
                es: 'Descubrir Tipo de Cerebro →',
                fr: 'Découvrir mon Type de Cerveau →',
                de: 'Gehirntyp entdecken →'
            };
            return {
                key: 'brain-type',
                path: '/brain-type/',
                source: 'stress_low',
                emoji: '⚡',
                title: (window.i18n && i18n.t('related.brainType')) || 'Brain Type',
                desc: descs[currentLang] || 'You have a healthy mental foundation. Discover your cognitive style and optimal focus habits.',
                ctaText: ctas[currentLang] || 'Discover Brain Type →'
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
    }

    openActionPlan() {
        if (!this.stressLevel) return;
        this.updatePlanLink();
        if (!this.planClickTracked) {
            this.planClickTracked = true;
            this.track('stress_plan_click', { surface: 'result_primary_action' });
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
