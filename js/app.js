class StressCheckApp {
    constructor() {
        this.currentQuestion = 0;
        this.answers = {};
        this.totalScore = 0;
        this.categoryScores = {};
        this.stressLevel = null;
        this.adShown = false;
        this.adCountdown = 5;
        this.init();
    }

    async init() {
        await i18n.init();
        this.setupEventListeners();
        this.hideLoader();
        document.getElementById('intro-screen').classList.add('active');
    }

    setupEventListeners() {
        // Start button
        document.getElementById('btn-start').addEventListener('click', () => this.startTest());

        // Option buttons
        document.getElementById('q-options').addEventListener('click', (e) => {
            if (e.target.classList.contains('option-btn')) {
                this.selectAnswer(e.target);
            }
        });

        // Action buttons
        document.getElementById('btn-retry').addEventListener('click', () => this.retryTest());
        document.getElementById('btn-premium-unlock').addEventListener('click', () => this.showAdOverlay());
        document.getElementById('btn-share').addEventListener('click', () => this.shareResult());
        document.getElementById('btn-save-image').addEventListener('click', () => this.saveResultImage());
        document.getElementById('ad-close').addEventListener('click', () => this.closeAdOverlay());

        // Language selector
        document.getElementById('lang-toggle').addEventListener('click', () => this.toggleLanguageMenu());
        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeLanguage(e.target.dataset.lang));
        });
    }

    startTest() {
        this.currentQuestion = 0;
        this.answers = {};
        this.totalScore = 0;
        this.showScreen('question-screen');
        this.loadQuestion();
    }

    loadQuestion() {
        const question = STRESS_QUESTIONS[this.currentQuestion];
        const qText = document.getElementById('question-text');
        const qCategory = document.getElementById('q-category');
        const qOptions = document.getElementById('q-options');

        qText.textContent = i18n.t(question.text);
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
        this.showLoading();

        setTimeout(() => {
            this.displayResults();
        }, 2000);
    }

    calculateResults() {
        this.totalScore = Object.values(this.answers).reduce((a, b) => a + b, 0);
        this.categoryScores = calculateCategoryScores(this.answers);
        this.stressLevel = calculateStressLevel(this.totalScore);
    }

    displayResults() {
        this.showScreen('result-screen');

        // Update gauge
        const percentage = Math.round(((this.totalScore - 15) / (75 - 15)) * 100);
        const angle = (percentage / 100) * 360;

        document.getElementById('gauge-fill').style.background = `conic-gradient(${this.stressLevel.color} 0deg, ${this.stressLevel.color} ${angle}deg, rgba(255,255,255,0.08) ${angle}deg)`;
        document.querySelector('.gauge-percent').textContent = percentage + '%';
        document.querySelector('.gauge-label').textContent = i18n.t('result.stressLevel');

        // Result info
        document.getElementById('result-emoji').textContent = this.stressLevel.emoji;
        document.getElementById('result-level-title').textContent = i18n.t(this.stressLevel.title);
        document.getElementById('result-level-subtitle').textContent = i18n.t(this.stressLevel.subtitle);
        document.getElementById('result-desc').textContent = i18n.t(this.stressLevel.description);

        // Category analysis
        this.displayCategoryAnalysis();

        // Relief tips
        this.displayReliefTips();

        // Recommendations
        this.displayRecommendations();
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

        const tipsKey = getRelieefTips(this.stressLevel.level);
        const tips = i18n.t(tipsKey);

        if (Array.isArray(tips)) {
            tips.forEach(tip => {
                const li = document.createElement('li');
                li.textContent = tip;
                tipsList.appendChild(li);
            });
        }
    }

    displayRecommendations() {
        const recGrid = document.getElementById('rec-grid');
        recGrid.innerHTML = '';

        RECOMMENDED_APPS.forEach(app => {
            const card = document.createElement('a');
            card.className = 'rec-card';
            card.href = `https://dopabrain.com/${app.name}/`;
            card.innerHTML = `
                <div class="rec-icon">${app.icon}</div>
                <div class="rec-info">
                    <div class="rec-name">${i18n.t(app.label)}</div>
                    <div class="rec-desc">${i18n.t(app.description)}</div>
                </div>
            `;
            recGrid.appendChild(card);
        });
    }

    showAdOverlay() {
        this.adShown = false;
        this.adCountdown = 5;
        document.getElementById('ad-overlay').classList.add('active');
        document.getElementById('ad-close').style.display = 'none';

        this.adTimer = setInterval(() => {
            this.adCountdown--;
            document.getElementById('ad-countdown').textContent = this.adCountdown;

            if (this.adCountdown <= 0) {
                clearInterval(this.adTimer);
                document.getElementById('ad-close').style.display = 'inline-flex';
                document.getElementById('ad-countdown').style.display = 'none';
                this.unlockPremium();
            }
        }, 1000);
    }

    closeAdOverlay() {
        document.getElementById('ad-overlay').classList.remove('active');
        if (this.adTimer) clearInterval(this.adTimer);
    }

    unlockPremium() {
        const premiumContent = document.getElementById('premium-content');
        const aiAnalysis = document.getElementById('ai-analysis-content');

        const analysisKey = getAIAnalysis(this.stressLevel.level);
        const analysis = i18n.t(analysisKey);

        aiAnalysis.textContent = analysis;
        premiumContent.style.display = 'block';

        document.getElementById('btn-premium-unlock').style.display = 'none';
    }

    shareResult() {
        const levelName = i18n.t(this.stressLevel.title);
        const text = `내 스트레스 레벨: ${levelName} (${Math.round(((this.totalScore - 15) / (75 - 15)) * 100)}%)`;
        const url = 'https://dopabrain.com/stress-check/';

        if (navigator.share) {
            navigator.share({
                title: i18n.t('app.title'),
                text: text,
                url: url
            }).catch(() => {});
        } else {
            this.copyToClipboard(`${text}\n${url}`);
        }
    }

    saveResultImage() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 768;

        const ctx = canvas.getContext('2d');

        // Background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#0f0f23');
        gradient.addColorStop(1, '#1a1a3a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 40px -apple-system, BlinkMacSystemFont, Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText('스트레스 레벨 체크', canvas.width / 2, 60);

        // Emoji
        ctx.font = '120px Arial';
        ctx.fillText(this.stressLevel.emoji, canvas.width / 2, 200);

        // Result
        ctx.fillStyle = this.stressLevel.color;
        ctx.font = 'bold 48px -apple-system, BlinkMacSystemFont, Segoe UI';
        ctx.fillText(i18n.t(this.stressLevel.title), canvas.width / 2, 320);

        // Percentage
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, Segoe UI';
        const percentage = Math.round(((this.totalScore - 15) / (75 - 15)) * 100);
        ctx.fillText(`${percentage}%`, canvas.width / 2, 400);

        // Date
        ctx.fillStyle = '#a0a0b8';
        ctx.font = '16px -apple-system, BlinkMacSystemFont, Segoe UI';
        ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, 450);

        // Footer
        ctx.fillStyle = '#5a5a70';
        ctx.font = '14px -apple-system, BlinkMacSystemFont, Segoe UI';
        ctx.fillText('dopabrain.com/stress-check/', canvas.width / 2, canvas.height - 30);

        // Download
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `stress-check-${new Date().toISOString().slice(0, 10)}.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert(i18n.t('message.copiedToClipboard'));
        });
    }

    retryTest() {
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
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new StressCheckApp();
});
