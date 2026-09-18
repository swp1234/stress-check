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
                const key = targetPath.includes('hsp-test') ? 'hsp-test' : targetPath.includes('stress-response') ? 'stress-response' : 'other';
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

        this.updatePlanLink();
        this.observeResultAction();
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
