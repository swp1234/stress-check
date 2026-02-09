// Stress Check Questions Data
// 5-point scale: 1=Not at all, 5=Very much

const STRESS_QUESTIONS = [
    {
        id: 1,
        category: 'work',
        categoryLabel: 'questions.workStudy',
        text: 'questions.q1'
    },
    {
        id: 2,
        category: 'work',
        categoryLabel: 'questions.workStudy',
        text: 'questions.q2'
    },
    {
        id: 3,
        category: 'work',
        categoryLabel: 'questions.workStudy',
        text: 'questions.q3'
    },
    {
        id: 4,
        category: 'relationship',
        categoryLabel: 'questions.relationships',
        text: 'questions.q4'
    },
    {
        id: 5,
        category: 'relationship',
        categoryLabel: 'questions.relationships',
        text: 'questions.q5'
    },
    {
        id: 6,
        category: 'relationship',
        categoryLabel: 'questions.relationships',
        text: 'questions.q6'
    },
    {
        id: 7,
        category: 'health',
        categoryLabel: 'questions.health',
        text: 'questions.q7'
    },
    {
        id: 8,
        category: 'health',
        categoryLabel: 'questions.health',
        text: 'questions.q8'
    },
    {
        id: 9,
        category: 'health',
        categoryLabel: 'questions.health',
        text: 'questions.q9'
    },
    {
        id: 10,
        category: 'finance',
        categoryLabel: 'questions.finance',
        text: 'questions.q10'
    },
    {
        id: 11,
        category: 'finance',
        categoryLabel: 'questions.finance',
        text: 'questions.q11'
    },
    {
        id: 12,
        category: 'finance',
        categoryLabel: 'questions.finance',
        text: 'questions.q12'
    },
    {
        id: 13,
        category: 'daily',
        categoryLabel: 'questions.dailyLife',
        text: 'questions.q13'
    },
    {
        id: 14,
        category: 'daily',
        categoryLabel: 'questions.dailyLife',
        text: 'questions.q14'
    },
    {
        id: 15,
        category: 'daily',
        categoryLabel: 'questions.dailyLife',
        text: 'questions.q15'
    }
];

const STRESS_LEVELS = [
    {
        minScore: 15,
        maxScore: 25,
        level: 'veryLow',
        emoji: '😊',
        color: '#2ecc71',
        title: 'results.veryLow.title',
        subtitle: 'results.veryLow.subtitle',
        description: 'results.veryLow.description'
    },
    {
        minScore: 26,
        maxScore: 40,
        level: 'low',
        emoji: '🙂',
        color: '#3498db',
        title: 'results.low.title',
        subtitle: 'results.low.subtitle',
        description: 'results.low.description'
    },
    {
        minScore: 41,
        maxScore: 55,
        level: 'moderate',
        emoji: '😐',
        color: '#f39c12',
        title: 'results.moderate.title',
        subtitle: 'results.moderate.subtitle',
        description: 'results.moderate.description'
    },
    {
        minScore: 56,
        maxScore: 70,
        level: 'high',
        emoji: '😟',
        color: '#e74c3c',
        title: 'results.high.title',
        subtitle: 'results.high.subtitle',
        description: 'results.high.description'
    },
    {
        minScore: 71,
        maxScore: 75,
        level: 'veryHigh',
        emoji: '😰',
        color: '#c0392b',
        title: 'results.veryHigh.title',
        subtitle: 'results.veryHigh.subtitle',
        description: 'results.veryHigh.description'
    }
];

const RECOMMENDED_APPS = [
    {
        name: 'emotion-temp',
        icon: '🌡️',
        label: 'apps.emotionTemp',
        description: 'apps.emotionTempDesc'
    },
    {
        name: 'affirmation',
        icon: '💝',
        label: 'apps.affirmation',
        description: 'apps.affirmationDesc'
    },
    {
        name: 'detox-timer',
        icon: '📵',
        label: 'apps.detoxTimer',
        description: 'apps.detoxTimerDesc'
    },
    {
        name: 'white-noise',
        icon: '🎵',
        label: 'apps.whiteNoise',
        description: 'apps.whiteNoiseDesc'
    },
    {
        name: 'color-personality',
        icon: '🎨',
        label: 'apps.colorPersonality',
        description: 'apps.colorPersonalityDesc'
    },
    {
        name: 'future-self',
        icon: '🔮',
        label: 'apps.futureSelf',
        description: 'apps.futureSelfDesc'
    }
];

// Helper functions
function calculateStressLevel(totalScore) {
    for (const level of STRESS_LEVELS) {
        if (totalScore >= level.minScore && totalScore <= level.maxScore) {
            return level;
        }
    }
    return STRESS_LEVELS[STRESS_LEVELS.length - 1];
}

function calculateCategoryScores(answers) {
    const categories = {
        work: [],
        relationship: [],
        health: [],
        finance: [],
        daily: []
    };

    STRESS_QUESTIONS.forEach(q => {
        if (answers[q.id]) {
            categories[q.category].push(answers[q.id]);
        }
    });

    const scores = {};
    for (const [key, values] of Object.entries(categories)) {
        if (values.length > 0) {
            scores[key] = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
        }
    }

    return scores;
}

function getReliefTips(stressLevel) {
    const tipsMap = {
        'veryLow': 'tips.veryLow',
        'low': 'tips.low',
        'moderate': 'tips.moderate',
        'high': 'tips.high',
        'veryHigh': 'tips.veryHigh'
    };
    return tipsMap[stressLevel];
}

function getAIAnalysis(stressLevel) {
    const analysisMap = {
        'veryLow': 'analysis.veryLow',
        'low': 'analysis.low',
        'moderate': 'analysis.moderate',
        'high': 'analysis.high',
        'veryHigh': 'analysis.veryHigh'
    };
    return analysisMap[stressLevel];
}
