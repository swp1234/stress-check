(() => {
    'use strict';

    const supported = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
    const contexts = ['work', 'relationship', 'family', 'school'];
    const tones = ['warm', 'clear', 'firm'];
    const query = new URLSearchParams(location.search);
    const storedLanguage = localStorage.getItem('preferredLanguage');
    const browserLanguage = (navigator.language || 'en').slice(0, 2).toLowerCase();
    let language = supported.includes(query.get('lang')) ? query.get('lang')
        : supported.includes(storedLanguage) ? storedLanguage
        : supported.includes(browserLanguage) ? browserLanguage : 'en';
    let context = contexts.includes(query.get('context')) ? query.get('context') : 'all';
    let tone = tones.includes(query.get('tone')) ? query.get('tone') : 'clear';
    const source = (query.get('source') || 'direct').slice(0, 80);
    const shared = window.BOUNDARY_SCRIPT_TRANSLATIONS || {};

    const ui = {
        en: {
            skip:'Skip to phrase library',back:'← Open the script builder',language:'Language',eyebrow:'COPYABLE REFERENCE LIBRARY',title:'Boundary Phrase Library',subtitle:'Browse 12 warm, clear, and firm phrase variations for work, relationships, family, and school. Copy one or open it in the builder to make it yours.',privacy:'No account · no diagnosis · edit before using',filterTitle:'FIND A USEFUL STARTING POINT',searchLabel:'Search phrases',searchPlaceholder:'deadline, plans, privacy…',contextLabel:'Situation',toneLabel:'Tone',all:'All situations',count:'{count} templates shown · 3 tone options each',noResults:'No matching phrase. Try another word or situation.',copy:'Copy phrase',copied:'Phrase copied.',edit:'Edit in builder',ad:'Advertisement',howTitle:'Use a phrase as a draft, not a verdict',howCopy:'Keep observable facts, one realistic request, and an action you control. Read the result aloud and remove anything that sounds like a threat, diagnosis, or guess about motives.',builderLink:'Build a custom script',planLink:'Open the 7-day plan',safetyTitle:'Safety comes before a script',safetyCopy:'Do not use a confrontation phrase if you fear violence, stalking, coercion, retaliation, or immediate danger. Seek support appropriate to your situation.',privacyPolicy:'Privacy',moreTools:'More DopaBrain tools'
        },
        ko: {
            skip:'문장 라이브러리로 건너뛰기',back:'← 문장 빌더 열기',language:'언어',eyebrow:'복사 가능한 참조 라이브러리',title:'경계 표현 문장 라이브러리',subtitle:'직장, 관계, 가족, 학교에서 쓸 수 있는 부드러운·명확한·단호한 12가지 표현을 살펴보세요. 복사하거나 빌더에서 나에게 맞게 수정할 수 있습니다.',privacy:'가입 없음 · 진단 아님 · 사용 전 수정',filterTitle:'쓸 만한 시작 문장 찾기',searchLabel:'문장 검색',searchPlaceholder:'마감일, 약속, 개인정보…',contextLabel:'상황',toneLabel:'말투',all:'모든 상황',count:'문장 {count}개 표시 · 각 3가지 말투',noResults:'일치하는 문장이 없습니다. 다른 단어나 상황을 선택해 보세요.',copy:'문장 복사',copied:'문장을 복사했습니다.',edit:'빌더에서 수정',ad:'광고',howTitle:'정답이 아니라 초안으로 사용하세요',howCopy:'관찰 가능한 사실, 현실적인 요청 하나, 내가 통제할 행동을 남기세요. 소리 내어 읽고 위협, 진단, 동기 추측처럼 들리는 부분은 지우세요.',builderLink:'맞춤 대화문 만들기',planLink:'7일 계획 열기',safetyTitle:'문장보다 안전이 먼저입니다',safetyCopy:'폭력, 스토킹, 강압, 보복 또는 즉각적인 위험이 우려된다면 대면 문장을 사용하지 마세요. 상황에 맞는 도움을 구하세요.',privacyPolicy:'개인정보',moreTools:'DopaBrain 도구 더 보기'
        },
        zh: {
            skip:'跳到表达库',back:'← 打开对话稿生成器',language:'语言',eyebrow:'可复制的参考库',title:'界限表达语句库',subtitle:'浏览适用于工作、关系、家庭和学校的12种温和、清晰或坚定表达。可直接复制，也可在生成器中修改。',privacy:'无需账号 · 不是诊断 · 使用前请修改',filterTitle:'找到合适的开场表达',searchLabel:'搜索语句',searchPlaceholder:'截止日期、计划、隐私…',contextLabel:'情境',toneLabel:'语气',all:'全部情境',count:'显示 {count} 个模板 · 每个有3种语气',noResults:'没有匹配的语句，请尝试其他关键词或情境。',copy:'复制语句',copied:'语句已复制。',edit:'在生成器中修改',ad:'广告',howTitle:'把语句当作草稿，而不是结论',howCopy:'保留可观察的事实、一个现实的请求和你能控制的行动。朗读一次，删除听起来像威胁、诊断或揣测动机的内容。',builderLink:'生成自定义对话稿',planLink:'打开7天计划',safetyTitle:'安全比表达更重要',safetyCopy:'如果你担心暴力、跟踪、胁迫、报复或即时危险，请不要使用对质语句，并寻求适合你情况的支持。',privacyPolicy:'隐私',moreTools:'更多 DopaBrain 工具'
        },
        hi: {
            skip:'वाक्य लाइब्रेरी पर जाएँ',back:'← संवाद बिल्डर खोलें',language:'भाषा',eyebrow:'कॉपी करने योग्य संदर्भ लाइब्रेरी',title:'सीमा-वाक्य लाइब्रेरी',subtitle:'काम, रिश्ते, परिवार और स्कूल के लिए 12 नरम, स्पष्ट और दृढ़ वाक्य देखें। कॉपी करें या बिल्डर में बदलें।',privacy:'कोई खाता नहीं · निदान नहीं · उपयोग से पहले संपादित करें',filterTitle:'उपयोगी शुरुआत खोजें',searchLabel:'वाक्य खोजें',searchPlaceholder:'समय-सीमा, योजना, गोपनीयता…',contextLabel:'स्थिति',toneLabel:'लहजा',all:'सभी स्थितियाँ',count:'{count} टेम्पलेट · हर एक के 3 लहजे',noResults:'कोई मिलता वाक्य नहीं। दूसरा शब्द या स्थिति आज़माएँ।',copy:'वाक्य कॉपी करें',copied:'वाक्य कॉपी हो गया।',edit:'बिल्डर में बदलें',ad:'विज्ञापन',howTitle:'इसे मसौदा मानें, अंतिम फैसला नहीं',howCopy:'देखे जा सकने वाले तथ्य, एक वास्तविक अनुरोध और अपने नियंत्रण की कार्रवाई रखें। ज़ोर से पढ़ें और धमकी, निदान या मंशा के अनुमान जैसी बात हटाएँ।',builderLink:'अपना संवाद बनाएँ',planLink:'7-दिन की योजना खोलें',safetyTitle:'सुरक्षा पहले आती है',safetyCopy:'यदि हिंसा, पीछा करने, दबाव, बदले या तुरंत खतरे का डर हो तो सामना करने वाला वाक्य न प्रयोग करें। उचित सहायता लें।',privacyPolicy:'गोपनीयता',moreTools:'और DopaBrain टूल'
        },
        ru: {
            skip:'Перейти к библиотеке фраз',back:'← Открыть конструктор',language:'Язык',eyebrow:'БИБЛИОТЕКА ФРАЗ ДЛЯ КОПИРОВАНИЯ',title:'Библиотека фраз о границах',subtitle:'Выберите из 12 мягких, ясных и твёрдых вариантов для работы, отношений, семьи и учёбы. Скопируйте или измените в конструкторе.',privacy:'Без аккаунта · не диагноз · отредактируйте перед использованием',filterTitle:'НАЙДИТЕ ПОДХОДЯЩЕЕ НАЧАЛО',searchLabel:'Поиск фраз',searchPlaceholder:'срок, планы, личное…',contextLabel:'Ситуация',toneLabel:'Тон',all:'Все ситуации',count:'Показано шаблонов: {count} · по 3 тона',noResults:'Подходящих фраз нет. Попробуйте другое слово или ситуацию.',copy:'Копировать фразу',copied:'Фраза скопирована.',edit:'Изменить в конструкторе',ad:'Реклама',howTitle:'Используйте как черновик, а не вердикт',howCopy:'Оставьте наблюдаемые факты, одну реалистичную просьбу и действие под вашим контролем. Прочитайте вслух и уберите угрозы, диагнозы и догадки о мотивах.',builderLink:'Создать свой текст',planLink:'Открыть план на 7 дней',safetyTitle:'Безопасность важнее текста',safetyCopy:'Не используйте фразу для конфронтации, если опасаетесь насилия, преследования, принуждения, мести или непосредственной угрозы. Обратитесь за подходящей поддержкой.',privacyPolicy:'Конфиденциальность',moreTools:'Другие инструменты DopaBrain'
        },
        ja: {
            skip:'フレーズ集へ移動',back:'← 会話文ビルダーを開く',language:'言語',eyebrow:'コピーできる参考フレーズ集',title:'境界線フレーズ集',subtitle:'職場、関係、家族、学校で使える、やわらかい・明確・毅然とした12種類の表現を選べます。コピーまたはビルダーで編集できます。',privacy:'登録不要 · 診断ではありません · 使用前に編集',filterTitle:'使える書き出しを探す',searchLabel:'フレーズを検索',searchPlaceholder:'締切、予定、プライバシー…',contextLabel:'状況',toneLabel:'トーン',all:'すべての状況',count:'{count}件表示 · 各3トーン',noResults:'一致するフレーズがありません。別の言葉や状況をお試しください。',copy:'フレーズをコピー',copied:'コピーしました。',edit:'ビルダーで編集',ad:'広告',howTitle:'正解ではなく下書きとして使う',howCopy:'観察できる事実、現実的なお願いを一つ、自分が選べる行動を残します。声に出して読み、脅し・診断・動機の決めつけに聞こえる部分を削りましょう。',builderLink:'自分用の会話文を作る',planLink:'7日間プランを開く',safetyTitle:'言葉より安全を優先',safetyCopy:'暴力、ストーカー行為、強要、報復、差し迫った危険が心配な場合は、対決する表現を使わず、状況に合う支援を求めてください。',privacyPolicy:'プライバシー',moreTools:'DopaBrainの他のツール'
        },
        es: {
            skip:'Ir a la biblioteca',back:'← Abrir el generador',language:'Idioma',eyebrow:'BIBLIOTECA DE REFERENCIA COPIABLE',title:'Biblioteca de frases para poner límites',subtitle:'Explora 12 variantes cálidas, claras y firmes para el trabajo, las relaciones, la familia y los estudios. Copia una o edítala en el generador.',privacy:'Sin cuenta · no es un diagnóstico · edita antes de usar',filterTitle:'ENCUENTRA UN BUEN PUNTO DE PARTIDA',searchLabel:'Buscar frases',searchPlaceholder:'plazo, planes, privacidad…',contextLabel:'Situación',toneLabel:'Tono',all:'Todas las situaciones',count:'{count} plantillas · 3 tonos cada una',noResults:'No hay frases coincidentes. Prueba otra palabra o situación.',copy:'Copiar frase',copied:'Frase copiada.',edit:'Editar en el generador',ad:'Publicidad',howTitle:'Úsala como borrador, no como veredicto',howCopy:'Conserva hechos observables, una petición realista y una acción que controles. Léela en voz alta y elimina amenazas, diagnósticos o suposiciones sobre motivos.',builderLink:'Crear un guion propio',planLink:'Abrir el plan de 7 días',safetyTitle:'La seguridad va primero',safetyCopy:'No uses una frase de confrontación si temes violencia, acoso, coacción, represalias o peligro inmediato. Busca apoyo apropiado para tu situación.',privacyPolicy:'Privacidad',moreTools:'Más herramientas DopaBrain'
        },
        pt: {
            skip:'Ir para a biblioteca',back:'← Abrir o gerador',language:'Idioma',eyebrow:'BIBLIOTECA DE REFERÊNCIA COPIÁVEL',title:'Biblioteca de frases para limites',subtitle:'Veja 12 variações acolhedoras, claras e firmes para trabalho, relacionamentos, família e estudos. Copie ou edite no gerador.',privacy:'Sem conta · não é diagnóstico · edite antes de usar',filterTitle:'ENCONTRE UM BOM PONTO DE PARTIDA',searchLabel:'Buscar frases',searchPlaceholder:'prazo, planos, privacidade…',contextLabel:'Situação',toneLabel:'Tom',all:'Todas as situações',count:'{count} modelos · 3 tons cada',noResults:'Nenhuma frase encontrada. Tente outra palavra ou situação.',copy:'Copiar frase',copied:'Frase copiada.',edit:'Editar no gerador',ad:'Publicidade',howTitle:'Use como rascunho, não como veredito',howCopy:'Mantenha fatos observáveis, um pedido realista e uma ação sob seu controle. Leia em voz alta e remova ameaças, diagnósticos ou suposições sobre motivos.',builderLink:'Criar roteiro personalizado',planLink:'Abrir plano de 7 dias',safetyTitle:'A segurança vem primeiro',safetyCopy:'Não use uma frase de confronto se houver medo de violência, perseguição, coerção, retaliação ou perigo imediato. Busque apoio adequado.',privacyPolicy:'Privacidade',moreTools:'Mais ferramentas DopaBrain'
        },
        id: {
            skip:'Ke perpustakaan frasa',back:'← Buka pembuat skrip',language:'Bahasa',eyebrow:'PUSTAKA REFERENSI YANG BISA DISALIN',title:'Pustaka Frasa Batasan',subtitle:'Jelajahi 12 variasi hangat, jelas, dan tegas untuk pekerjaan, hubungan, keluarga, dan sekolah. Salin atau edit di pembuat skrip.',privacy:'Tanpa akun · bukan diagnosis · edit sebelum digunakan',filterTitle:'TEMUKAN TITIK AWAL',searchLabel:'Cari frasa',searchPlaceholder:'tenggat, rencana, privasi…',contextLabel:'Situasi',toneLabel:'Nada',all:'Semua situasi',count:'{count} templat · masing-masing 3 nada',noResults:'Tidak ada frasa yang cocok. Coba kata atau situasi lain.',copy:'Salin frasa',copied:'Frasa disalin.',edit:'Edit di pembuat skrip',ad:'Iklan',howTitle:'Gunakan sebagai draf, bukan keputusan',howCopy:'Pertahankan fakta yang dapat diamati, satu permintaan realistis, dan tindakan yang Anda kendalikan. Baca keras-keras lalu hapus ancaman, diagnosis, atau dugaan motif.',builderLink:'Buat skrip khusus',planLink:'Buka rencana 7 hari',safetyTitle:'Keselamatan lebih utama',safetyCopy:'Jangan gunakan frasa konfrontasi jika Anda takut kekerasan, penguntitan, paksaan, pembalasan, atau bahaya langsung. Cari dukungan yang sesuai.',privacyPolicy:'Privasi',moreTools:'Alat DopaBrain lainnya'
        },
        tr: {
            skip:'İfade kitaplığına geç',back:'← Metin oluşturucuyu aç',language:'Dil',eyebrow:'KOPYALANABİLİR REFERANS KİTAPLIĞI',title:'Sınır İfadeleri Kitaplığı',subtitle:'İş, ilişki, aile ve okul için 12 sıcak, net ve kararlı ifade seçeneğine göz atın. Kopyalayın veya oluşturucuda düzenleyin.',privacy:'Hesap yok · tanı değildir · kullanmadan önce düzenleyin',filterTitle:'UYGUN BİR BAŞLANGIÇ BUL',searchLabel:'İfade ara',searchPlaceholder:'son tarih, planlar, gizlilik…',contextLabel:'Durum',toneLabel:'Ton',all:'Tüm durumlar',count:'{count} şablon · her biri 3 ton',noResults:'Eşleşen ifade yok. Başka bir kelime veya durum deneyin.',copy:'İfadeyi kopyala',copied:'İfade kopyalandı.',edit:'Oluşturucuda düzenle',ad:'Reklam',howTitle:'Karar değil taslak olarak kullanın',howCopy:'Gözlemlenebilir gerçekleri, gerçekçi bir isteği ve kontrolünüzdeki eylemi koruyun. Sesli okuyup tehdit, tanı veya niyet tahmini gibi gelen kısımları çıkarın.',builderLink:'Özel metin oluştur',planLink:'7 günlük planı aç',safetyTitle:'Güvenlik önce gelir',safetyCopy:'Şiddet, takip, zorlama, misilleme veya yakın tehlikeden korkuyorsanız yüzleşme ifadesi kullanmayın. Uygun destek arayın.',privacyPolicy:'Gizlilik',moreTools:'Diğer DopaBrain araçları'
        },
        de: {
            skip:'Zur Formulierungsbibliothek',back:'← Textgenerator öffnen',language:'Sprache',eyebrow:'KOPIERBARE FORMULIERUNGSHILFEN',title:'Bibliothek für klare Grenzen',subtitle:'Entdecke 12 warme, klare und bestimmte Varianten für Arbeit, Beziehung, Familie und Schule. Kopiere sie oder passe sie im Generator an.',privacy:'Kein Konto · keine Diagnose · vor Nutzung bearbeiten',filterTitle:'EINEN GUTEN EINSTIEG FINDEN',searchLabel:'Formulierungen suchen',searchPlaceholder:'Frist, Pläne, Privatsphäre…',contextLabel:'Situation',toneLabel:'Ton',all:'Alle Situationen',count:'{count} Vorlagen · je 3 Tonlagen',noResults:'Keine passende Formulierung. Versuche ein anderes Wort oder eine andere Situation.',copy:'Formulierung kopieren',copied:'Formulierung kopiert.',edit:'Im Generator bearbeiten',ad:'Werbung',howTitle:'Als Entwurf nutzen, nicht als Urteil',howCopy:'Behalte beobachtbare Fakten, eine realistische Bitte und eine Handlung unter deiner Kontrolle. Lies laut und entferne Drohungen, Diagnosen oder Vermutungen über Motive.',builderLink:'Eigenen Text erstellen',planLink:'7-Tage-Plan öffnen',safetyTitle:'Sicherheit geht vor',safetyCopy:'Nutze keine konfrontative Formulierung, wenn du Gewalt, Stalking, Zwang, Vergeltung oder unmittelbare Gefahr befürchtest. Suche passende Unterstützung.',privacyPolicy:'Datenschutz',moreTools:'Weitere DopaBrain-Werkzeuge'
        },
        fr: {
            skip:'Aller à la bibliothèque',back:'← Ouvrir le générateur',language:'Langue',eyebrow:'BIBLIOTHÈQUE DE RÉFÉRENCE À COPIER',title:'Bibliothèque de phrases pour poser ses limites',subtitle:'Parcourez 12 variantes chaleureuses, claires et fermes pour le travail, les relations, la famille et les études. Copiez-les ou adaptez-les dans le générateur.',privacy:'Sans compte · pas un diagnostic · à modifier avant usage',filterTitle:'TROUVEZ UN BON POINT DE DÉPART',searchLabel:'Rechercher une phrase',searchPlaceholder:'délai, projets, vie privée…',contextLabel:'Situation',toneLabel:'Ton',all:'Toutes les situations',count:'{count} modèles · 3 tons chacun',noResults:'Aucune phrase correspondante. Essayez un autre mot ou une autre situation.',copy:'Copier la phrase',copied:'Phrase copiée.',edit:'Modifier dans le générateur',ad:'Publicité',howTitle:'Utilisez-la comme brouillon, pas comme verdict',howCopy:'Gardez des faits observables, une demande réaliste et une action sous votre contrôle. Lisez à voix haute et retirez menaces, diagnostics ou suppositions sur les intentions.',builderLink:'Créer mon propre texte',planLink:'Ouvrir le programme de 7 jours',safetyTitle:'La sécurité passe avant le texte',safetyCopy:'N’utilisez pas une phrase de confrontation si vous craignez violence, harcèlement, coercition, représailles ou danger immédiat. Cherchez un soutien adapté.',privacyPolicy:'Confidentialité',moreTools:'Autres outils DopaBrain'
        }
    };

    const scenarioTitles = {
        en:{work:'Extra work and deadline changes',relationship:'Cancelled plans',family:'Personal information shared without permission',school:'Uneven last-minute group work'},
        ko:{work:'추가 업무와 마감일 변경',relationship:'반복되는 약속 취소',family:'동의 없이 공유된 개인정보',school:'마감 직전 몰린 조별 과제'},
        zh:{work:'额外工作与截止日期变更',relationship:'临时取消计划',family:'未经同意分享个人信息',school:'临近截止才分配的小组任务'},
        hi:{work:'अतिरिक्त काम और बदलती समय-सीमा',relationship:'रद्द होती योजनाएँ',family:'बिना अनुमति निजी बात साझा करना',school:'अंतिम समय का असमान समूह कार्य'},
        ru:{work:'Дополнительная работа и перенос сроков',relationship:'Отмена общих планов',family:'Личная информация без разрешения',school:'Неравная групповая работа в последний момент'},
        ja:{work:'追加業務と締切変更',relationship:'予定のキャンセル',family:'無断で共有された個人情報',school:'直前に偏ったグループ課題'},
        es:{work:'Trabajo extra y cambios de plazo',relationship:'Planes cancelados',family:'Información personal compartida sin permiso',school:'Trabajo grupal desigual a última hora'},
        pt:{work:'Trabalho extra e mudanças de prazo',relationship:'Planos cancelados',family:'Informações pessoais compartilhadas sem permissão',school:'Trabalho em grupo desigual de última hora'},
        id:{work:'Pekerjaan tambahan dan perubahan tenggat',relationship:'Rencana yang dibatalkan',family:'Informasi pribadi dibagikan tanpa izin',school:'Tugas kelompok mendadak yang tidak seimbang'},
        tr:{work:'Ek iş ve son tarih değişiklikleri',relationship:'İptal edilen planlar',family:'İzinsiz paylaşılan özel bilgiler',school:'Son dakika ve dengesiz grup işi'},
        de:{work:'Mehrarbeit und geänderte Fristen',relationship:'Abgesagte Pläne',family:'Persönliche Informationen ohne Zustimmung',school:'Ungleiche Gruppenarbeit kurz vor Abgabe'},
        fr:{work:'Travail supplémentaire et délais modifiés',relationship:'Projets annulés',family:'Informations personnelles partagées sans accord',school:'Travail de groupe inégal à la dernière minute'}
    };

    const elements = {
        language: document.getElementById('language-select'),
        context: document.getElementById('context-select'),
        tone: document.getElementById('tone-select'),
        search: document.getElementById('phrase-search'),
        grid: document.getElementById('phrase-grid'),
        count: document.getElementById('result-count'),
        empty: document.getElementById('no-results')
    };
    const viewedCards = new Set();
    let searchTimer = 0;

    const currentUi = () => ui[language] || ui.en;
    const corpus = () => shared[language] || shared.en;
    const track = (eventName, params = {}) => {
        if (typeof gtag !== 'function') return;
        gtag('event', eventName, Object.assign({
            app_name: 'stress-check',
            content_group: 'boundary_library',
            library_language: language,
            library_context: context,
            library_tone: tone,
            entry_source: source,
            revenue_goal: 'daily_0_10'
        }, params));
    };

    function setStaticText() {
        const text = currentUi();
        document.documentElement.lang = language;
        document.querySelectorAll('[data-ui]').forEach(node => {
            const value = text[node.dataset.ui];
            if (value) node.textContent = value;
        });
        document.title = `${text.title} | DopaBrain`;
        document.querySelector('meta[name="description"]').content = text.subtitle;
        elements.search.placeholder = text.searchPlaceholder;
        elements.language.value = language;
        document.getElementById('builder-back-link').href = `script.html?lang=${language}&source=boundary_library_header`;
        document.getElementById('builder-link').href = `script.html?lang=${language}&source=boundary_library_footer`;
        document.getElementById('plan-link').href = `plan.html?lang=${language}&source=boundary_library`;
    }

    function fillFilters() {
        const text = currentUi();
        const data = corpus();
        elements.context.replaceChildren();
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = text.all;
        elements.context.appendChild(allOption);
        contexts.forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = data.contexts[key];
            elements.context.appendChild(option);
        });
        elements.tone.replaceChildren(...tones.map(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = data.tones[key];
            return option;
        }));
        elements.context.value = context;
        elements.tone.value = tone;
    }

    function phraseParts(contextKey) {
        const data = corpus();
        const example = data.examples[contextKey];
        return [
            [data.labels.opening, data.openings[tone]],
            [data.labels.situation, example[0]],
            [data.labels.request, example[1]],
            [data.labels.boundary, example[2]]
        ];
    }

    function phraseText(contextKey) {
        const data = corpus();
        return [
            scenarioTitles[language]?.[contextKey] || scenarioTitles.en[contextKey],
            `${currentUi().contextLabel}: ${data.contexts[contextKey]}`,
            `${currentUi().toneLabel}: ${data.tones[tone]}`,
            '',
            ...phraseParts(contextKey).map(([label, value]) => `${label}: ${value}`),
            '',
            currentUi().safetyCopy,
            'https://dopabrain.com/stress-check/library.html'
        ].join('\n');
    }

    function makeCard(contextKey) {
        const data = corpus();
        const text = currentUi();
        const card = document.createElement('article');
        card.className = 'phrase-card card';
        card.dataset.context = contextKey;

        const contextLabel = document.createElement('p');
        contextLabel.className = 'phrase-context';
        contextLabel.textContent = data.contexts[contextKey];
        const heading = document.createElement('h2');
        heading.textContent = scenarioTitles[language]?.[contextKey] || scenarioTitles.en[contextKey];
        const lines = document.createElement('div');
        lines.className = 'phrase-lines';
        phraseParts(contextKey).forEach(([label, value]) => {
            const row = document.createElement('div');
            row.className = 'phrase-line';
            const labelNode = document.createElement('span');
            labelNode.className = 'phrase-label';
            labelNode.textContent = label;
            const valueNode = document.createElement('span');
            valueNode.className = 'phrase-text';
            valueNode.textContent = value;
            row.append(labelNode, valueNode);
            lines.appendChild(row);
        });
        const actions = document.createElement('div');
        actions.className = 'phrase-actions';
        const copy = document.createElement('button');
        copy.type = 'button';
        copy.className = 'phrase-copy';
        copy.dataset.context = contextKey;
        copy.textContent = text.copy;
        const edit = document.createElement('a');
        edit.className = 'phrase-edit';
        edit.dataset.context = contextKey;
        edit.href = `script.html?lang=${language}&context=${contextKey}&tone=${tone}&example=1&source=boundary_library`;
        edit.textContent = text.edit;
        actions.append(copy, edit);
        const status = document.createElement('p');
        status.className = 'copy-status';
        status.setAttribute('aria-live', 'polite');
        card.append(contextLabel, heading, lines, actions, status);
        return card;
    }

    function observeCards() {
        if (!('IntersectionObserver' in window)) return;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const cardContext = entry.target.dataset.context;
                const key = `${language}:${tone}:${cardContext}`;
                if (!viewedCards.has(key)) {
                    viewedCards.add(key);
                    track('boundary_library_card_view', { template_context: cardContext });
                }
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.35 });
        elements.grid.querySelectorAll('.phrase-card').forEach(card => observer.observe(card));
    }

    function render() {
        const term = elements.search.value.trim().toLocaleLowerCase(language);
        const visible = contexts.filter(contextKey => {
            if (context !== 'all' && context !== contextKey) return false;
            if (!term) return true;
            return phraseText(contextKey).toLocaleLowerCase(language).includes(term);
        });
        elements.grid.replaceChildren(...visible.map(makeCard));
        elements.count.textContent = currentUi().count.replace('{count}', String(visible.length));
        elements.empty.hidden = visible.length !== 0;
        observeCards();
    }

    async function copyPhrase(contextKey, status) {
        const value = phraseText(contextKey);
        try {
            await navigator.clipboard.writeText(value);
        } catch (_) {
            const area = document.createElement('textarea');
            area.value = value;
            area.style.position = 'fixed';
            area.style.opacity = '0';
            document.body.appendChild(area);
            area.select();
            document.execCommand('copy');
            area.remove();
        }
        status.textContent = currentUi().copied;
        track('boundary_library_copy', { template_context: contextKey });
    }

    function updateQuery() {
        const next = new URL(location.href);
        next.searchParams.set('lang', language);
        if (context === 'all') next.searchParams.delete('context');
        else next.searchParams.set('context', context);
        next.searchParams.set('tone', tone);
        history.replaceState({}, '', next);
    }

    function init() {
        if (!shared.en) {
            elements.grid.textContent = currentUi().noResults;
            return;
        }
        setStaticText();
        fillFilters();
        render();
        updateQuery();

        elements.language.addEventListener('change', event => {
            language = supported.includes(event.target.value) ? event.target.value : 'en';
            localStorage.setItem('preferredLanguage', language);
            setStaticText();
            fillFilters();
            render();
            updateQuery();
            track('boundary_library_language_change');
        });
        elements.context.addEventListener('change', event => {
            context = event.target.value;
            render();
            updateQuery();
            track('boundary_library_filter', { filter_name: 'context', filter_value: context });
        });
        elements.tone.addEventListener('change', event => {
            tone = event.target.value;
            render();
            updateQuery();
            track('boundary_library_filter', { filter_name: 'tone', filter_value: tone });
        });
        elements.search.addEventListener('input', () => {
            render();
            window.clearTimeout(searchTimer);
            searchTimer = window.setTimeout(() => {
                track('boundary_library_search', { search_length: elements.search.value.trim().length });
            }, 450);
        });
        elements.grid.addEventListener('click', event => {
            const copy = event.target.closest('.phrase-copy');
            if (copy) {
                copyPhrase(copy.dataset.context, copy.closest('.phrase-card').querySelector('.copy-status'));
                return;
            }
            const edit = event.target.closest('.phrase-edit');
            if (edit) {
                track('boundary_library_edit_click', { template_context: edit.dataset.context });
            }
        });
        document.getElementById('builder-back-link').addEventListener('click', () => track('boundary_library_builder_click', { link_surface: 'header' }));
        document.getElementById('builder-link').addEventListener('click', () => track('boundary_library_builder_click', { link_surface: 'footer' }));
        document.getElementById('plan-link').addEventListener('click', () => track('boundary_library_plan_click'));
        const ad = document.querySelector('[data-ad-surface]');
        if (ad && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                if (!entries.some(entry => entry.isIntersecting)) return;
                track('boundary_library_ad_impression', { ad_surface: ad.dataset.adSurface });
                observer.disconnect();
            }, { threshold: 0.2 });
            observer.observe(ad);
        }
        track('boundary_library_view');
    }

    init();
})();
