class I18n {
    constructor() {
        this.translations = {};
        this.supportedLanguages = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
        this.currentLang = this.detectLanguage();
    }

    detectLanguage() {
        const saved = localStorage.getItem('preferredLanguage');
        if (saved && this.supportedLanguages.includes(saved)) {
            return saved;
        }

        const browserLang = navigator.language.substring(0, 2).toLowerCase();
        return this.supportedLanguages.includes(browserLang) ? browserLang : 'en';
    }

    async loadTranslations(lang) {
        try {
            const response = await fetch(`js/locales/${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang}`);
            this.translations[lang] = await response.json();
        } catch (error) {
            console.error(`Error loading translations for ${lang}:`, error);
            if (lang !== 'en') {
                await this.loadTranslations('en');
            }
        }
    }

    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                return key;
            }
        }

        return value || key;
    }

    async setLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) return;

        this.currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);

        if (!this.translations[lang]) {
            await this.loadTranslations(lang);
        }

        this.updateUI();
    }

    updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);

            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.type === 'text' || el.type === 'email') {
                    el.placeholder = translation;
                } else {
                    el.value = translation;
                }
            } else if (el.hasAttribute('data-i18n-placeholder')) {
                el.placeholder = translation;
            } else if (el.hasAttribute('data-i18n-title')) {
                el.title = translation;
            } else {
                el.textContent = translation;
            }
        });

        document.documentElement.lang = this.currentLang;
    }

    async init() {
        await this.loadTranslations(this.currentLang);
        if (this.currentLang !== 'en') {
            await this.loadTranslations('en');
        }
        this.updateUI();
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    getLanguageName(lang) {
        const names = {
            'ko': '한국어',
            'en': 'English',
            'zh': '中文',
            'hi': 'हिन्दी',
            'ru': 'Русский',
            'ja': '日本語',
            'es': 'Español',
            'pt': 'Português',
            'id': 'Indonesia',
            'tr': 'Türkçe',
            'de': 'Deutsch',
            'fr': 'Français'
        };
        return names[lang] || lang;
    }
}

const i18n = new I18n();
