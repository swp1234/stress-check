(() => {
    'use strict';

    const supported = ['ko', 'en', 'zh', 'hi', 'ru', 'ja', 'es', 'pt', 'id', 'tr', 'de', 'fr'];
    const query = new URLSearchParams(location.search);
    const storedLanguage = localStorage.getItem('preferredLanguage');
    const browserLanguage = (navigator.language || 'en').slice(0, 2).toLowerCase();
    let language = supported.includes(query.get('lang')) ? query.get('lang')
        : supported.includes(storedLanguage) ? storedLanguage
        : supported.includes(browserLanguage) ? browserLanguage : 'en';

    const translations = {
        en: {
            skip:'Skip to builder',back:'← Back to 7-day plan',language:'Language',eyebrow:'PRIVATE CONVERSATION TOOL',title:'Boundary & Request Script Builder',subtitle:'Prepare calm, clear words before a difficult conversation. What you type stays in this browser.',privacy:'No account · no text uploaded · clear anytime',step:'BUILD YOUR SCRIPT',builderTitle:'Describe the conversation',example:'Use an example',contextLabel:'Situation',toneLabel:'Tone',situationLabel:'What happened? Use observable facts.',factHint:'Avoid labels or guessing motives.',requestLabel:'What specific change are you asking for?',requestHint:'Choose one realistic, observable action.',boundaryLabel:'What will you do if that cannot happen?',boundaryHint:'Name your next action, not a punishment.',generate:'Build my script',missing:'Complete all three text boxes first.',resultEyebrow:'YOUR DRAFT',resultTitle:'A script you can edit before using',deliveryTip:'Tip: choose a calm moment, read it aloud once, and shorten any sentence that does not sound like you.',copy:'Copy script',print:'Print',reset:'Start over',copied:'Script copied.',ad:'Advertisement',whyTitle:'What this builder is—and is not',whyCopy:'It helps organize observable facts, one request, and your own next action. It cannot predict another person’s response and is not legal, medical, workplace, or relationship-safety advice.',planLink:'Add this conversation to your 7-day stress plan →',safetyTitle:'Safety comes before a script',safetyCopy:'Do not use a confrontation script if you fear violence, stalking, coercion, retaliation, or immediate danger. Seek support from a trusted local professional, workplace representative, or emergency service appropriate to your situation.',privacyPolicy:'Privacy',moreTools:'More DopaBrain tools',
            contexts:{work:'Work',relationship:'Relationship',family:'Family',school:'School'},tones:{warm:'Warm',clear:'Clear',firm:'Firm'},
            labels:{opening:'Opening',situation:'Situation',request:'Request',boundary:'My next step'},
            openings:{warm:'I care about handling this constructively, so I want to explain what I need.',clear:'I want to be clear about the situation and the change I am asking for.',firm:'I need to be direct about what I can and cannot agree to.'},
            placeholders:{situation:'Example: the deadline changed twice without notice',request:'Example: please tell me before changing an agreed deadline',boundary:'Example: I will confirm a new delivery date before accepting the change'},
            examples:{
                work:['The deadline changed twice after we agreed on the schedule.','Please check with me before changing an agreed deadline.','I will confirm a realistic new delivery date before accepting extra work.'],
                relationship:['Plans were cancelled twice after I had already arranged my time.','Please tell me as soon as you know that plans need to change.','I will stop holding the full evening open unless we confirm on the day.'],
                family:['My personal decisions were discussed with other relatives without asking me.','Please ask me before sharing personal information about me.','I will keep future details private if that boundary cannot be respected.'],
                school:['Two group tasks were assigned to me the night before the deadline.','Please divide tasks and confirm owners at least two days before the deadline.','I will complete only the part we agreed I would own.']
            }
        },
        ko: {
            skip:'문장 빌더로 건너뛰기',back:'← 7일 계획으로 돌아가기',language:'언어',eyebrow:'개인용 대화 준비 도구',title:'경계·요청 문장 빌더',subtitle:'어려운 대화를 시작하기 전에 차분하고 명확한 문장을 준비하세요. 입력 내용은 이 브라우저에만 남습니다.',privacy:'가입 없음 · 텍스트 업로드 없음 · 언제든 삭제',step:'문장 만들기',builderTitle:'대화 상황을 적어보세요',example:'예시 사용',contextLabel:'상황',toneLabel:'말투',situationLabel:'무슨 일이 있었나요? 관찰 가능한 사실만 적으세요.',factHint:'낙인이나 상대의 의도 추측은 피하세요.',requestLabel:'어떤 구체적인 변화를 요청하나요?',requestHint:'현실적으로 확인할 수 있는 행동 하나를 고르세요.',boundaryLabel:'요청이 어렵다면 나는 무엇을 할 건가요?',boundaryHint:'벌이 아니라 내가 취할 다음 행동을 적으세요.',generate:'내 문장 만들기',missing:'세 개의 입력란을 모두 작성하세요.',resultEyebrow:'나의 초안',resultTitle:'사용 전에 자유롭게 다듬을 문장',deliveryTip:'팁: 차분한 때를 고르고 한 번 소리 내어 읽은 뒤, 나답지 않은 문장은 짧게 줄이세요.',copy:'문장 복사',print:'인쇄',reset:'처음부터',copied:'문장을 복사했습니다.',ad:'광고',whyTitle:'이 도구가 할 수 있는 것과 없는 것',whyCopy:'관찰 가능한 사실, 요청 하나, 내가 취할 행동을 정리하는 도구입니다. 상대의 반응을 예측할 수 없으며 법률·의료·직장·관계 안전 조언이 아닙니다.',planLink:'이 대화를 7일 스트레스 계획에 추가하기 →',safetyTitle:'문장보다 안전이 먼저입니다',safetyCopy:'폭력, 스토킹, 강압, 보복 또는 즉각적인 위험이 두렵다면 대면용 문장을 사용하지 마세요. 상황에 맞는 지역 전문가, 직장 담당자 또는 응급기관의 도움을 받으세요.',privacyPolicy:'개인정보',moreTools:'DopaBrain 도구 더 보기',
            contexts:{work:'직장',relationship:'연인·친구',family:'가족',school:'학교'},tones:{warm:'부드럽게',clear:'명확하게',firm:'단호하게'},labels:{opening:'시작',situation:'상황',request:'요청',boundary:'나의 다음 행동'},openings:{warm:'이 문제를 서로 존중하며 풀고 싶어서 내가 필요한 것을 말하려고 해요.',clear:'현재 상황과 내가 요청하는 변화를 명확히 말하고 싶어요.',firm:'내가 동의할 수 있는 것과 없는 것을 분명히 말해야겠어요.'},placeholders:{situation:'예: 합의한 뒤 마감일이 예고 없이 두 번 바뀌었다',request:'예: 합의한 마감일을 바꾸기 전에 알려 달라',boundary:'예: 추가 업무를 받기 전에 가능한 새 일정을 확인하겠다'},examples:{work:['합의한 일정 뒤에 마감일이 두 번 바뀌었습니다.','합의한 마감일을 바꾸기 전에 저와 먼저 확인해 주세요.','추가 업무를 받기 전에 가능한 새 납기일을 확인하겠습니다.'],relationship:['내가 시간을 비운 뒤 약속이 두 번 취소되었습니다.','계획이 바뀌는 것을 알게 되면 바로 알려 주세요.','당일 확인 전에는 저녁 전체를 비워 두지 않겠습니다.'],family:['내 동의 없이 나의 개인적인 결정이 다른 친척에게 전달되었습니다.','내 개인 정보를 공유하기 전에 먼저 물어봐 주세요.','이 경계가 지켜지지 않으면 앞으로 세부 내용을 공유하지 않겠습니다.'],school:['마감 전날 밤에 조별 과제 두 개가 내 몫으로 배정되었습니다.','마감 이틀 전까지 역할을 나누고 담당자를 확인해 주세요.','처음 합의한 내 담당 부분까지만 완료하겠습니다.']}
        },
        zh: {
            skip:'跳到生成器',back:'← 返回7天计划',language:'语言',eyebrow:'私人对话工具',title:'界限与请求话术生成器',subtitle:'在困难对话前准备冷静、清晰的话。输入内容只保存在此浏览器。',privacy:'无需账户 · 不上传文本 · 随时清除',step:'生成你的话术',builderTitle:'描述这次对话',example:'使用示例',contextLabel:'情境',toneLabel:'语气',situationLabel:'发生了什么？只写可观察的事实。',factHint:'避免贴标签或猜测动机。',requestLabel:'你希望对方做出什么具体改变？',requestHint:'选择一个现实且可观察的行动。',boundaryLabel:'如果无法做到，你会采取什么行动？',boundaryHint:'写下你的下一步，而不是惩罚。',generate:'生成我的话术',missing:'请先填写三个文本框。',resultEyebrow:'你的草稿',resultTitle:'使用前可自行修改的话术',deliveryTip:'提示：选择平静的时刻，朗读一次，并缩短任何不像你会说的话。',copy:'复制话术',print:'打印',reset:'重新开始',copied:'话术已复制。',ad:'广告',whyTitle:'这个工具能做什么、不能做什么',whyCopy:'它帮助整理可观察的事实、一个请求和你自己的下一步。它无法预测对方反应，也不构成法律、医疗、职场或关系安全建议。',planLink:'把这次对话加入7天减压计划 →',safetyTitle:'安全比话术更重要',safetyCopy:'如果你担心暴力、跟踪、胁迫、报复或眼前危险，请勿使用对峙话术。请向可信的当地专业人士、职场代表或适合你情况的紧急服务求助。',privacyPolicy:'隐私',moreTools:'更多DopaBrain工具',
            contexts:{work:'工作',relationship:'伴侣或朋友',family:'家庭',school:'学校'},tones:{warm:'温和',clear:'清晰',firm:'坚定'},labels:{opening:'开场',situation:'情况',request:'请求',boundary:'我的下一步'},openings:{warm:'我希望以建设性的方式处理这件事，所以想说明我的需要。',clear:'我想清楚说明目前的情况和我请求的改变。',firm:'我需要直接说明我能接受和不能接受的事情。'},placeholders:{situation:'例如：商定后截止日期在没有通知的情况下改了两次',request:'例如：更改商定的截止日期前请先告诉我',boundary:'例如：接受额外工作前，我会先确认新的可行日期'},examples:{work:['商定日程后，截止日期又被更改了两次。','更改商定的截止日期前，请先与我确认。','接受额外工作前，我会确认一个现实的新交付日期。'],relationship:['我已经安排好时间后，计划被取消了两次。','如果知道计划需要改变，请尽快告诉我。','除非当天确认，否则我不会再把整个晚上都空出来。'],family:['未经我同意，我的个人决定被告诉了其他亲属。','分享我的个人信息前，请先征求我的同意。','如果这个界限无法被尊重，我将不再分享未来的细节。'],school:['截止日期前一晚，有两项小组任务被分配给我。','请至少提前两天分配任务并确认负责人。','我只会完成最初约定由我负责的部分。']}
        },
        hi: {
            skip:'बिल्डर पर जाएँ',back:'← 7-दिन की योजना पर लौटें',language:'भाषा',eyebrow:'निजी बातचीत उपकरण',title:'सीमा और अनुरोध स्क्रिप्ट बिल्डर',subtitle:'कठिन बातचीत से पहले शांत और स्पष्ट शब्द तैयार करें। आपका लिखा इसी ब्राउज़र में रहता है।',privacy:'कोई खाता नहीं · टेक्स्ट अपलोड नहीं · कभी भी साफ करें',step:'अपनी स्क्रिप्ट बनाएँ',builderTitle:'बातचीत का वर्णन करें',example:'उदाहरण भरें',contextLabel:'स्थिति',toneLabel:'लहजा',situationLabel:'क्या हुआ? केवल दिखाई देने वाले तथ्य लिखें।',factHint:'लेबल या इरादे का अनुमान न लगाएँ।',requestLabel:'आप कौन-सा स्पष्ट बदलाव चाहते हैं?',requestHint:'एक व्यावहारिक, दिखाई देने वाला कदम चुनें।',boundaryLabel:'यदि ऐसा न हो सके तो आप क्या करेंगे?',boundaryHint:'सज़ा नहीं, अपना अगला कदम लिखें।',generate:'मेरी स्क्रिप्ट बनाएँ',missing:'पहले तीनों बॉक्स भरें।',resultEyebrow:'आपका मसौदा',resultTitle:'इस्तेमाल से पहले संपादित करने योग्य स्क्रिप्ट',deliveryTip:'सुझाव: शांत समय चुनें, एक बार ज़ोर से पढ़ें और जो वाक्य आपके जैसे न लगे उसे छोटा करें।',copy:'स्क्रिप्ट कॉपी करें',print:'प्रिंट',reset:'फिर से शुरू करें',copied:'स्क्रिप्ट कॉपी हो गई।',ad:'विज्ञापन',whyTitle:'यह बिल्डर क्या है और क्या नहीं',whyCopy:'यह तथ्य, एक अनुरोध और आपका अगला कदम व्यवस्थित करता है। यह दूसरे व्यक्ति की प्रतिक्रिया नहीं बता सकता और कानूनी, चिकित्सा, कार्यस्थल या संबंध-सुरक्षा सलाह नहीं है।',planLink:'इस बातचीत को 7-दिन की तनाव योजना में जोड़ें →',safetyTitle:'सुरक्षा स्क्रिप्ट से पहले है',safetyCopy:'यदि हिंसा, पीछा, दबाव, बदला या तुरंत खतरे का डर हो तो सामना करने वाली स्क्रिप्ट का उपयोग न करें। भरोसेमंद स्थानीय विशेषज्ञ, कार्यस्थल प्रतिनिधि या उचित आपात सेवा से मदद लें।',privacyPolicy:'गोपनीयता',moreTools:'और DopaBrain टूल',
            contexts:{work:'काम',relationship:'रिश्ता',family:'परिवार',school:'स्कूल'},tones:{warm:'नरम',clear:'स्पष्ट',firm:'दृढ़'},labels:{opening:'शुरुआत',situation:'स्थिति',request:'अनुरोध',boundary:'मेरा अगला कदम'},openings:{warm:'मैं इसे रचनात्मक तरीके से संभालना चाहता/चाहती हूँ, इसलिए अपनी ज़रूरत बताना चाहता/चाहती हूँ।',clear:'मैं स्थिति और अपने अनुरोध को स्पष्ट करना चाहता/चाहती हूँ।',firm:'मुझे साफ़ कहना है कि मैं किस बात से सहमत हो सकता/सकती हूँ और किससे नहीं।'},placeholders:{situation:'उदाहरण: बिना सूचना समय-सीमा दो बार बदली',request:'उदाहरण: तय समय-सीमा बदलने से पहले मुझे बताएँ',boundary:'उदाहरण: अतिरिक्त काम लेने से पहले नई तारीख तय करूँगा/करूँगी'},examples:{work:['सहमति के बाद समय-सीमा दो बार बदली गई।','तय समय-सीमा बदलने से पहले मुझसे बात करें।','अतिरिक्त काम लेने से पहले मैं नई व्यावहारिक तारीख तय करूँगा/करूँगी।'],relationship:['मेरे समय तय करने के बाद योजनाएँ दो बार रद्द हुईं।','योजना बदलने का पता चलते ही मुझे बताएँ।','उसी दिन पुष्टि न हो तो मैं पूरी शाम खाली नहीं रखूँगा/रखूँगी।'],family:['मेरी अनुमति के बिना मेरे निजी फैसले रिश्तेदारों से साझा किए गए।','मेरी निजी जानकारी साझा करने से पहले पूछें।','सीमा न मानी गई तो मैं आगे की निजी बातें साझा नहीं करूँगा/करूँगी।'],school:['समय-सीमा से एक रात पहले दो समूह कार्य मुझे दिए गए।','कम से कम दो दिन पहले काम बाँटकर जिम्मेदारी तय करें।','मैं केवल अपना पहले से तय हिस्सा पूरा करूँगा/करूँगी।']}
        },
        ru: {
            skip:'К конструктору',back:'← К плану на 7 дней',language:'Язык',eyebrow:'ЛИЧНЫЙ ИНСТРУМЕНТ ДЛЯ РАЗГОВОРА',title:'Конструктор просьбы и границ',subtitle:'Подготовьте спокойные и ясные слова перед трудным разговором. Текст остаётся в браузере.',privacy:'Без аккаунта · без загрузки текста · можно очистить',step:'СОЗДАЙТЕ ТЕКСТ',builderTitle:'Опишите разговор',example:'Вставить пример',contextLabel:'Ситуация',toneLabel:'Тон',situationLabel:'Что произошло? Укажите наблюдаемые факты.',factHint:'Без ярлыков и догадок о мотивах.',requestLabel:'О каком конкретном изменении вы просите?',requestHint:'Выберите одно реалистичное действие.',boundaryLabel:'Что вы сделаете, если это невозможно?',boundaryHint:'Назовите свой шаг, а не наказание.',generate:'Создать текст',missing:'Сначала заполните все три поля.',resultEyebrow:'ВАШ ЧЕРНОВИК',resultTitle:'Текст, который можно изменить',deliveryTip:'Совет: выберите спокойный момент, прочитайте вслух и сократите фразы, которые звучат не по-вашему.',copy:'Копировать',print:'Печать',reset:'Начать заново',copied:'Текст скопирован.',ad:'Реклама',whyTitle:'Что делает и чего не делает этот инструмент',whyCopy:'Он упорядочивает факты, одну просьбу и ваш следующий шаг. Он не предсказывает реакцию и не заменяет юридическую, медицинскую или профессиональную помощь.',planLink:'Добавить разговор в 7-дневный план →',safetyTitle:'Безопасность важнее текста',safetyCopy:'Не используйте текст для конфронтации, если опасаетесь насилия, преследования, принуждения, мести или непосредственной угрозы. Обратитесь к подходящему местному специалисту, представителю на работе или экстренной службе.',privacyPolicy:'Конфиденциальность',moreTools:'Другие инструменты',
            contexts:{work:'Работа',relationship:'Отношения',family:'Семья',school:'Учёба'},tones:{warm:'Мягкий',clear:'Ясный',firm:'Твёрдый'},labels:{opening:'Начало',situation:'Ситуация',request:'Просьба',boundary:'Мой следующий шаг'},openings:{warm:'Мне важно решить это конструктивно, поэтому я хочу объяснить, что мне нужно.',clear:'Я хочу ясно описать ситуацию и изменение, о котором прошу.',firm:'Мне нужно прямо сказать, с чем я могу и не могу согласиться.'},placeholders:{situation:'Например: срок дважды изменили без предупреждения',request:'Например: предупреждайте меня до изменения согласованного срока',boundary:'Например: я согласую новую дату до принятия дополнительной работы'},examples:{work:['После согласования графика срок меняли дважды.','Пожалуйста, согласуйте со мной изменение срока заранее.','Перед дополнительной работой я подтвержу реалистичную новую дату.'],relationship:['Планы дважды отменяли после того, как я освободил(а) время.','Сообщайте мне сразу, как только планы меняются.','Без подтверждения в тот же день я не буду оставлять весь вечер свободным.'],family:['Мои личные решения обсуждали с родственниками без моего согласия.','Спрашивайте меня перед передачей личной информации обо мне.','Если граница не соблюдается, я не буду делиться подробностями.'],school:['Две групповые задачи передали мне накануне срока.','Распределяйте задачи и ответственных минимум за два дня.','Я выполню только ту часть, о которой мы договорились.']}
        },
        ja: {
            skip:'作成ツールへ移動',back:'← 7日間プランに戻る',language:'言語',eyebrow:'プライベート会話ツール',title:'境界線・お願い文ビルダー',subtitle:'難しい会話の前に、落ち着いて明確に伝える言葉を準備します。入力内容はブラウザ内だけに残ります。',privacy:'登録不要 · テキスト送信なし · いつでも消去',step:'文章を作る',builderTitle:'会話の状況を入力',example:'例を使う',contextLabel:'場面',toneLabel:'口調',situationLabel:'何が起きましたか？観察できる事実を書いてください。',factHint:'決めつけや相手の意図の推測は避けます。',requestLabel:'どのような具体的な変化をお願いしますか？',requestHint:'現実的で確認できる行動を一つ選びます。',boundaryLabel:'難しい場合、自分はどう行動しますか？',boundaryHint:'罰ではなく自分の次の行動を書きます。',generate:'文章を作成',missing:'3つの入力欄をすべて埋めてください。',resultEyebrow:'下書き',resultTitle:'使う前に編集できる文章',deliveryTip:'ヒント：落ち着いた時間を選び、一度声に出して読み、自分らしくない文は短くしましょう。',copy:'文章をコピー',print:'印刷',reset:'最初から',copied:'文章をコピーしました。',ad:'広告',whyTitle:'このツールができること・できないこと',whyCopy:'観察できる事実、一つのお願い、自分の次の行動を整理します。相手の反応を予測するものではなく、法律・医療・職場・関係の安全に関する助言ではありません。',planLink:'この会話を7日間ストレスプランに追加 →',safetyTitle:'文章より安全が優先です',safetyCopy:'暴力、ストーカー行為、強制、報復、差し迫った危険が心配な場合は、対決する文章を使わないでください。地域の専門家、職場の担当者、緊急サービスに相談してください。',privacyPolicy:'プライバシー',moreTools:'他のDopaBrainツール',
            contexts:{work:'仕事',relationship:'パートナー・友人',family:'家族',school:'学校'},tones:{warm:'やわらかく',clear:'明確に',firm:'毅然と'},labels:{opening:'はじめに',situation:'状況',request:'お願い',boundary:'自分の次の行動'},openings:{warm:'建設的に解決したいので、私に必要なことを伝えたいです。',clear:'現在の状況と、お願いしたい変化を明確に伝えます。',firm:'同意できることとできないことを、はっきり伝える必要があります。'},placeholders:{situation:'例：合意後に締切が予告なく2回変わった',request:'例：合意した締切を変える前に知らせてほしい',boundary:'例：追加作業を受ける前に新しい納期を確認する'},examples:{work:['合意した予定の後で、締切が2回変わりました。','合意した締切を変える前に、私に確認してください。','追加作業を受ける前に、現実的な新しい納期を確認します。'],relationship:['時間を空けた後で、予定が2回キャンセルされました。','予定が変わると分かった時点で知らせてください。','当日に確認できない限り、夜全体を空けておきません。'],family:['私の同意なく、個人的な決定が親族に共有されました。','私の個人情報を共有する前に確認してください。','この境界が守られない場合、今後は詳細を共有しません。'],school:['締切前夜にグループ課題が2つ私に割り当てられました。','少なくとも2日前に役割と担当を決めてください。','最初に合意した自分の担当分だけを完成させます。']}
        },
        es: {
            skip:'Ir al generador',back:'← Volver al plan de 7 días',language:'Idioma',eyebrow:'HERRAMIENTA PRIVADA DE CONVERSACIÓN',title:'Generador de límites y peticiones',subtitle:'Prepara palabras serenas y claras antes de una conversación difícil. Lo que escribes queda en este navegador.',privacy:'Sin cuenta · sin subir texto · bórralo cuando quieras',step:'CREA TU GUIÓN',builderTitle:'Describe la conversación',example:'Usar un ejemplo',contextLabel:'Situación',toneLabel:'Tono',situationLabel:'¿Qué ocurrió? Usa hechos observables.',factHint:'Evita etiquetas o adivinar intenciones.',requestLabel:'¿Qué cambio concreto estás pidiendo?',requestHint:'Elige una acción realista y observable.',boundaryLabel:'¿Qué harás si eso no es posible?',boundaryHint:'Indica tu siguiente acción, no un castigo.',generate:'Crear mi guión',missing:'Completa primero los tres campos.',resultEyebrow:'TU BORRADOR',resultTitle:'Un guión que puedes editar antes de usar',deliveryTip:'Consejo: elige un momento tranquilo, léelo en voz alta y acorta cualquier frase que no suene a ti.',copy:'Copiar guión',print:'Imprimir',reset:'Empezar de nuevo',copied:'Guión copiado.',ad:'Publicidad',whyTitle:'Qué es y qué no es este generador',whyCopy:'Ayuda a ordenar hechos observables, una petición y tu propio siguiente paso. No predice la respuesta de otra persona ni es asesoramiento legal, médico, laboral o de seguridad.',planLink:'Añadir esta conversación al plan de 7 días →',safetyTitle:'La seguridad va antes que un guión',safetyCopy:'No uses un guión de confrontación si temes violencia, acoso, coacción, represalias o peligro inmediato. Busca apoyo de un profesional local, representante laboral o servicio de emergencia adecuado.',privacyPolicy:'Privacidad',moreTools:'Más herramientas',
            contexts:{work:'Trabajo',relationship:'Relación',family:'Familia',school:'Estudios'},tones:{warm:'Cálido',clear:'Claro',firm:'Firme'},labels:{opening:'Inicio',situation:'Situación',request:'Petición',boundary:'Mi siguiente paso'},openings:{warm:'Me importa manejar esto de forma constructiva, así que quiero explicar lo que necesito.',clear:'Quiero dejar clara la situación y el cambio que estoy pidiendo.',firm:'Necesito ser directo/a sobre lo que puedo y no puedo aceptar.'},placeholders:{situation:'Ejemplo: el plazo cambió dos veces sin avisar',request:'Ejemplo: avísame antes de cambiar un plazo acordado',boundary:'Ejemplo: confirmaré una nueva fecha antes de aceptar más trabajo'},examples:{work:['El plazo cambió dos veces después de acordar el calendario.','Consulta conmigo antes de cambiar un plazo acordado.','Confirmaré una nueva fecha realista antes de aceptar trabajo extra.'],relationship:['Los planes se cancelaron dos veces después de reservar mi tiempo.','Avísame en cuanto sepas que los planes deben cambiar.','No reservaré toda la tarde si no confirmamos ese día.'],family:['Mis decisiones personales se compartieron con familiares sin preguntarme.','Pregúntame antes de compartir información personal sobre mí.','No compartiré más detalles si no se respeta este límite.'],school:['Me asignaron dos tareas del grupo la noche anterior al plazo.','Repartamos tareas y responsables al menos dos días antes.','Completaré solo la parte que acordamos que era mía.']}
        },
        pt: {
            skip:'Ir ao gerador',back:'← Voltar ao plano de 7 dias',language:'Idioma',eyebrow:'FERRAMENTA PRIVADA DE CONVERSA',title:'Gerador de Limites e Pedidos',subtitle:'Prepare palavras calmas e claras antes de uma conversa difícil. O que você escreve fica neste navegador.',privacy:'Sem conta · sem envio de texto · apague quando quiser',step:'CRIE SEU ROTEIRO',builderTitle:'Descreva a conversa',example:'Usar um exemplo',contextLabel:'Situação',toneLabel:'Tom',situationLabel:'O que aconteceu? Use fatos observáveis.',factHint:'Evite rótulos ou adivinhar intenções.',requestLabel:'Que mudança específica você está pedindo?',requestHint:'Escolha uma ação realista e observável.',boundaryLabel:'O que você fará se isso não acontecer?',boundaryHint:'Indique seu próximo passo, não uma punição.',generate:'Criar meu roteiro',missing:'Preencha primeiro os três campos.',resultEyebrow:'SEU RASCUNHO',resultTitle:'Um roteiro que você pode editar',deliveryTip:'Dica: escolha um momento calmo, leia em voz alta e encurte frases que não soem como você.',copy:'Copiar roteiro',print:'Imprimir',reset:'Recomeçar',copied:'Roteiro copiado.',ad:'Publicidade',whyTitle:'O que este gerador é — e não é',whyCopy:'Ele organiza fatos observáveis, um pedido e seu próximo passo. Não prevê a resposta de outra pessoa nem oferece orientação jurídica, médica, profissional ou de segurança.',planLink:'Adicionar esta conversa ao plano de 7 dias →',safetyTitle:'A segurança vem antes do roteiro',safetyCopy:'Não use um roteiro de confronto se teme violência, perseguição, coerção, retaliação ou perigo imediato. Procure um profissional local, representante no trabalho ou serviço de emergência adequado.',privacyPolicy:'Privacidade',moreTools:'Mais ferramentas',
            contexts:{work:'Trabalho',relationship:'Relacionamento',family:'Família',school:'Estudos'},tones:{warm:'Acolhedor',clear:'Claro',firm:'Firme'},labels:{opening:'Abertura',situation:'Situação',request:'Pedido',boundary:'Meu próximo passo'},openings:{warm:'Quero lidar com isso de forma construtiva, então preciso explicar o que necessito.',clear:'Quero deixar clara a situação e a mudança que estou pedindo.',firm:'Preciso ser direto/a sobre o que posso e não posso aceitar.'},placeholders:{situation:'Exemplo: o prazo mudou duas vezes sem aviso',request:'Exemplo: avise antes de mudar um prazo combinado',boundary:'Exemplo: vou confirmar uma nova data antes de aceitar mais trabalho'},examples:{work:['O prazo mudou duas vezes depois de combinarmos o cronograma.','Fale comigo antes de mudar um prazo combinado.','Vou confirmar uma nova data realista antes de aceitar trabalho extra.'],relationship:['Os planos foram cancelados duas vezes depois que reservei meu tempo.','Avise assim que souber que os planos precisam mudar.','Não vou reservar a noite toda sem confirmação no mesmo dia.'],family:['Minhas decisões pessoais foram compartilhadas com parentes sem me perguntar.','Pergunte antes de compartilhar informações pessoais sobre mim.','Não vou compartilhar novos detalhes se esse limite não for respeitado.'],school:['Duas tarefas do grupo foram passadas para mim na véspera do prazo.','Dividam as tarefas e confirmem responsáveis com dois dias de antecedência.','Vou concluir apenas a parte que combinamos que seria minha.']}
        },
        id: {
            skip:'Lewati ke pembuat',back:'← Kembali ke rencana 7 hari',language:'Bahasa',eyebrow:'ALAT PERCAKAPAN PRIBADI',title:'Pembuat Skrip Batas & Permintaan',subtitle:'Siapkan kata-kata yang tenang dan jelas sebelum percakapan sulit. Teks tetap di browser ini.',privacy:'Tanpa akun · tanpa unggah teks · hapus kapan saja',step:'BUAT SKRIP',builderTitle:'Jelaskan percakapannya',example:'Pakai contoh',contextLabel:'Situasi',toneLabel:'Nada',situationLabel:'Apa yang terjadi? Gunakan fakta yang bisa diamati.',factHint:'Hindari label atau menebak niat.',requestLabel:'Perubahan spesifik apa yang Anda minta?',requestHint:'Pilih satu tindakan realistis yang bisa diamati.',boundaryLabel:'Apa yang akan Anda lakukan jika itu tidak terjadi?',boundaryHint:'Sebutkan langkah Anda, bukan hukuman.',generate:'Buat skrip saya',missing:'Isi ketiga kotak terlebih dahulu.',resultEyebrow:'DRAF ANDA',resultTitle:'Skrip yang dapat diedit sebelum digunakan',deliveryTip:'Tip: pilih waktu tenang, baca keras sekali, lalu pendekkan kalimat yang tidak terasa seperti Anda.',copy:'Salin skrip',print:'Cetak',reset:'Mulai lagi',copied:'Skrip disalin.',ad:'Iklan',whyTitle:'Apa fungsi dan batas alat ini',whyCopy:'Alat ini menyusun fakta, satu permintaan, dan langkah Anda sendiri. Alat ini tidak memprediksi respons atau memberi nasihat hukum, medis, kerja, atau keselamatan hubungan.',planLink:'Tambahkan percakapan ini ke rencana 7 hari →',safetyTitle:'Keselamatan lebih penting dari skrip',safetyCopy:'Jangan gunakan skrip konfrontasi jika Anda takut kekerasan, penguntitan, paksaan, pembalasan, atau bahaya langsung. Cari dukungan profesional lokal, perwakilan kerja, atau layanan darurat yang sesuai.',privacyPolicy:'Privasi',moreTools:'Alat DopaBrain lainnya',
            contexts:{work:'Pekerjaan',relationship:'Hubungan',family:'Keluarga',school:'Sekolah'},tones:{warm:'Hangat',clear:'Jelas',firm:'Tegas'},labels:{opening:'Pembuka',situation:'Situasi',request:'Permintaan',boundary:'Langkah saya'},openings:{warm:'Saya ingin menangani ini secara baik, jadi saya ingin menjelaskan apa yang saya perlukan.',clear:'Saya ingin memperjelas situasi dan perubahan yang saya minta.',firm:'Saya perlu tegas tentang apa yang bisa dan tidak bisa saya setujui.'},placeholders:{situation:'Contoh: tenggat berubah dua kali tanpa pemberitahuan',request:'Contoh: beri tahu sebelum mengubah tenggat yang disepakati',boundary:'Contoh: saya akan memastikan tanggal baru sebelum menerima tugas tambahan'},examples:{work:['Tenggat berubah dua kali setelah jadwal disepakati.','Konfirmasi dengan saya sebelum mengubah tenggat yang disepakati.','Saya akan memastikan tanggal baru yang realistis sebelum menerima tugas tambahan.'],relationship:['Rencana dibatalkan dua kali setelah saya menyediakan waktu.','Beri tahu saya segera setelah tahu rencana perlu berubah.','Saya tidak akan mengosongkan seluruh malam tanpa konfirmasi hari itu.'],family:['Keputusan pribadi saya dibagikan kepada kerabat tanpa izin.','Tanyakan kepada saya sebelum membagikan informasi pribadi saya.','Saya tidak akan membagikan detail lagi jika batas ini tidak dihormati.'],school:['Dua tugas kelompok diberikan kepada saya malam sebelum tenggat.','Bagi tugas dan pastikan penanggung jawab setidaknya dua hari sebelumnya.','Saya hanya akan menyelesaikan bagian yang sejak awal menjadi tanggung jawab saya.']}
        },
        tr: {
            skip:'Oluşturucuya geç',back:'← 7 günlük plana dön',language:'Dil',eyebrow:'ÖZEL KONUŞMA ARACI',title:'Sınır ve İstek Metni Oluşturucu',subtitle:'Zor bir konuşmadan önce sakin ve net sözler hazırlayın. Yazdıklarınız bu tarayıcıda kalır.',privacy:'Hesap yok · metin yüklenmez · istediğin zaman sil',step:'METNİNİ OLUŞTUR',builderTitle:'Konuşmayı anlat',example:'Örnek kullan',contextLabel:'Durum',toneLabel:'Ton',situationLabel:'Ne oldu? Gözlemlenebilir gerçekleri yaz.',factHint:'Etiketlerden ve niyet tahmininden kaçın.',requestLabel:'Hangi belirli değişikliği istiyorsun?',requestHint:'Gerçekçi ve gözlemlenebilir bir eylem seç.',boundaryLabel:'Bu olmazsa sen ne yapacaksın?',boundaryHint:'Ceza değil, kendi sonraki adımını yaz.',generate:'Metnimi oluştur',missing:'Önce üç alanı da doldur.',resultEyebrow:'TASLAĞIN',resultTitle:'Kullanmadan önce düzenleyebileceğin metin',deliveryTip:'İpucu: sakin bir an seç, bir kez sesli oku ve sana benzemeyen cümleleri kısalt.',copy:'Metni kopyala',print:'Yazdır',reset:'Baştan başla',copied:'Metin kopyalandı.',ad:'Reklam',whyTitle:'Bu araç nedir, ne değildir',whyCopy:'Gözlemlenebilir gerçekleri, tek bir isteği ve kendi sonraki adımını düzenler. Karşı tarafın yanıtını öngörmez; hukuki, tıbbi, iş veya ilişki güvenliği tavsiyesi değildir.',planLink:'Bu konuşmayı 7 günlük plana ekle →',safetyTitle:'Güvenlik metinden önce gelir',safetyCopy:'Şiddet, takip, baskı, misilleme veya yakın tehlikeden korkuyorsan yüzleşme metni kullanma. Uygun bir yerel uzmandan, işyeri temsilcisinden veya acil servisten destek al.',privacyPolicy:'Gizlilik',moreTools:'Diğer araçlar',
            contexts:{work:'İş',relationship:'İlişki',family:'Aile',school:'Okul'},tones:{warm:'Sıcak',clear:'Net',firm:'Kararlı'},labels:{opening:'Başlangıç',situation:'Durum',request:'İstek',boundary:'Sonraki adımım'},openings:{warm:'Bunu yapıcı biçimde ele almak istiyorum; bu yüzden neye ihtiyacım olduğunu açıklayacağım.',clear:'Durumu ve istediğim değişikliği netleştirmek istiyorum.',firm:'Neyi kabul edip edemeyeceğim konusunda doğrudan olmam gerekiyor.'},placeholders:{situation:'Örnek: son tarih haber verilmeden iki kez değişti',request:'Örnek: kararlaştırılan tarihi değiştirmeden önce haber ver',boundary:'Örnek: ek işi kabul etmeden önce yeni tarihi onaylayacağım'},examples:{work:['Takvim üzerinde anlaştıktan sonra son tarih iki kez değişti.','Kararlaştırılan tarihi değiştirmeden önce benimle görüşün.','Ek işi kabul etmeden önce gerçekçi yeni tarihi onaylayacağım.'],relationship:['Zamanımı ayırdıktan sonra planlar iki kez iptal edildi.','Planların değişeceğini öğrenince hemen haber ver.','Aynı gün onaylamazsak tüm akşamı boş tutmayacağım.'],family:['Kişisel kararlarım bana sorulmadan akrabalarla paylaşıldı.','Benimle ilgili özel bilgileri paylaşmadan önce sor.','Bu sınıra uyulmazsa gelecekte ayrıntı paylaşmayacağım.'],school:['Son tarihten önceki gece iki grup görevi bana verildi.','Görevleri en az iki gün önce bölüp sorumluları belirleyin.','Yalnızca başta anlaştığımız kendi bölümümü tamamlayacağım.']}
        },
        de: {
            skip:'Zum Generator',back:'← Zurück zum 7-Tage-Plan',language:'Sprache',eyebrow:'PRIVATES GESPRÄCHSWERKZEUG',title:'Generator für Grenzen & Bitten',subtitle:'Bereite ruhige, klare Worte vor einem schwierigen Gespräch vor. Dein Text bleibt in diesem Browser.',privacy:'Kein Konto · kein Text-Upload · jederzeit löschen',step:'TEXT ERSTELLEN',builderTitle:'Beschreibe das Gespräch',example:'Beispiel verwenden',contextLabel:'Situation',toneLabel:'Ton',situationLabel:'Was ist passiert? Nutze beobachtbare Fakten.',factHint:'Vermeide Etiketten und Vermutungen über Motive.',requestLabel:'Um welche konkrete Änderung bittest du?',requestHint:'Wähle eine realistische, beobachtbare Handlung.',boundaryLabel:'Was wirst du tun, wenn das nicht möglich ist?',boundaryHint:'Nenne deinen nächsten Schritt, keine Strafe.',generate:'Meinen Text erstellen',missing:'Fülle zuerst alle drei Felder aus.',resultEyebrow:'DEIN ENTWURF',resultTitle:'Ein Text, den du vor der Nutzung bearbeiten kannst',deliveryTip:'Tipp: Wähle einen ruhigen Moment, lies den Text einmal laut und kürze Sätze, die nicht nach dir klingen.',copy:'Text kopieren',print:'Drucken',reset:'Neu beginnen',copied:'Text kopiert.',ad:'Werbung',whyTitle:'Was dieses Werkzeug ist – und was nicht',whyCopy:'Es ordnet beobachtbare Fakten, eine Bitte und deinen eigenen nächsten Schritt. Es sagt keine Reaktion voraus und ist keine Rechts-, Medizin-, Arbeits- oder Sicherheitsberatung.',planLink:'Dieses Gespräch zum 7-Tage-Plan hinzufügen →',safetyTitle:'Sicherheit geht vor',safetyCopy:'Nutze keinen Konfrontationstext, wenn du Gewalt, Stalking, Zwang, Vergeltung oder unmittelbare Gefahr befürchtest. Suche passende Hilfe bei einer lokalen Fachperson, Arbeitnehmervertretung oder Notfallstelle.',privacyPolicy:'Datenschutz',moreTools:'Weitere Werkzeuge',
            contexts:{work:'Arbeit',relationship:'Beziehung',family:'Familie',school:'Schule'},tones:{warm:'Warm',clear:'Klar',firm:'Bestimmt'},labels:{opening:'Einstieg',situation:'Situation',request:'Bitte',boundary:'Mein nächster Schritt'},openings:{warm:'Mir ist wichtig, das konstruktiv zu lösen, deshalb möchte ich erklären, was ich brauche.',clear:'Ich möchte die Situation und die gewünschte Änderung klar benennen.',firm:'Ich muss direkt sagen, womit ich einverstanden sein kann und womit nicht.'},placeholders:{situation:'Beispiel: Die Frist wurde zweimal ohne Hinweis geändert',request:'Beispiel: Bitte informiere mich vor einer Änderung der vereinbarten Frist',boundary:'Beispiel: Ich bestätige einen neuen Termin, bevor ich Mehrarbeit annehme'},examples:{work:['Die Frist wurde nach unserer Terminabsprache zweimal geändert.','Bitte sprich mit mir, bevor eine vereinbarte Frist geändert wird.','Ich bestätige einen realistischen neuen Termin, bevor ich Mehrarbeit annehme.'],relationship:['Pläne wurden zweimal abgesagt, nachdem ich mir Zeit genommen hatte.','Sag mir bitte Bescheid, sobald du weißt, dass sich Pläne ändern.','Ohne Bestätigung am selben Tag halte ich nicht den ganzen Abend frei.'],family:['Meine persönlichen Entscheidungen wurden ohne meine Zustimmung mit Verwandten geteilt.','Frag mich, bevor du persönliche Informationen über mich weitergibst.','Wenn diese Grenze nicht respektiert wird, teile ich künftig keine Details.'],school:['Zwei Gruppenaufgaben wurden mir am Abend vor der Abgabe zugewiesen.','Teilt Aufgaben und Zuständigkeiten mindestens zwei Tage vorher auf.','Ich erledige nur den Teil, den wir als meinen vereinbart haben.']}
        },
        fr: {
            skip:'Aller au générateur',back:'← Retour au programme de 7 jours',language:'Langue',eyebrow:'OUTIL DE CONVERSATION PRIVÉ',title:'Générateur de limites et demandes',subtitle:'Préparez des mots calmes et clairs avant une conversation difficile. Votre texte reste dans ce navigateur.',privacy:'Sans compte · aucun texte envoyé · effaçable à tout moment',step:'CRÉEZ VOTRE SCRIPT',builderTitle:'Décrivez la conversation',example:'Utiliser un exemple',contextLabel:'Situation',toneLabel:'Ton',situationLabel:'Que s’est-il passé ? Utilisez des faits observables.',factHint:'Évitez les étiquettes et les suppositions sur les intentions.',requestLabel:'Quel changement précis demandez-vous ?',requestHint:'Choisissez une action réaliste et observable.',boundaryLabel:'Que ferez-vous si ce n’est pas possible ?',boundaryHint:'Nommez votre prochaine action, pas une punition.',generate:'Créer mon script',missing:'Remplissez d’abord les trois champs.',resultEyebrow:'VOTRE BROUILLON',resultTitle:'Un script modifiable avant utilisation',deliveryTip:'Conseil : choisissez un moment calme, lisez-le à voix haute et raccourcissez toute phrase qui ne vous ressemble pas.',copy:'Copier le script',print:'Imprimer',reset:'Recommencer',copied:'Script copié.',ad:'Publicité',whyTitle:'Ce que cet outil est — et n’est pas',whyCopy:'Il organise des faits observables, une demande et votre propre prochaine étape. Il ne prédit pas la réponse et ne constitue pas un conseil juridique, médical, professionnel ou de sécurité.',planLink:'Ajouter cette conversation au programme de 7 jours →',safetyTitle:'La sécurité passe avant le script',safetyCopy:'N’utilisez pas un script de confrontation si vous craignez violence, harcèlement, coercition, représailles ou danger immédiat. Demandez de l’aide à un professionnel local, représentant du personnel ou service d’urgence adapté.',privacyPolicy:'Confidentialité',moreTools:'Autres outils',
            contexts:{work:'Travail',relationship:'Relation',family:'Famille',school:'Études'},tones:{warm:'Chaleureux',clear:'Clair',firm:'Ferme'},labels:{opening:'Ouverture',situation:'Situation',request:'Demande',boundary:'Ma prochaine étape'},openings:{warm:'Je tiens à gérer cela de manière constructive, alors je veux expliquer ce dont j’ai besoin.',clear:'Je veux clarifier la situation et le changement que je demande.',firm:'Je dois être direct·e sur ce que je peux ou ne peux pas accepter.'},placeholders:{situation:'Exemple : le délai a changé deux fois sans préavis',request:'Exemple : préviens-moi avant de modifier un délai convenu',boundary:'Exemple : je confirmerai une nouvelle date avant d’accepter du travail en plus'},examples:{work:['Le délai a changé deux fois après notre accord sur le calendrier.','Merci de me consulter avant de modifier un délai convenu.','Je confirmerai une nouvelle date réaliste avant d’accepter du travail supplémentaire.'],relationship:['Les projets ont été annulés deux fois après que j’ai réservé mon temps.','Préviens-moi dès que tu sais que les projets doivent changer.','Je ne réserverai pas toute la soirée sans confirmation le jour même.'],family:['Mes décisions personnelles ont été partagées avec des proches sans mon accord.','Demande-moi avant de partager des informations personnelles me concernant.','Je ne partagerai plus de détails si cette limite n’est pas respectée.'],school:['Deux tâches de groupe m’ont été attribuées la veille de l’échéance.','Répartissons les tâches et responsables au moins deux jours avant.','Je terminerai uniquement la partie convenue comme étant la mienne.']}
        }
    };

    window.BOUNDARY_SCRIPT_TRANSLATIONS = translations;
    if (!document.getElementById('builder-main')) return;

    const fallback = translations.en;
    const libraryLabelByLocale = {
        ko:'복사 가능한 예문 보기 →',en:'Browse copyable phrase examples →',zh:'浏览可复制的表达示例 →',
        hi:'कॉपी करने योग्य वाक्य देखें →',ru:'Посмотреть готовые примеры →',ja:'コピーできる例文を見る →',
        es:'Ver ejemplos para copiar →',pt:'Ver exemplos para copiar →',id:'Lihat contoh yang bisa disalin →',
        tr:'Kopyalanabilir örnekleri gör →',de:'Kopierbare Beispiele ansehen →',fr:'Voir des exemples à copier →'
    };
    const t = key => translations[language]?.[key] ?? fallback[key] ?? key;
    const contextKeys = ['work', 'relationship', 'family', 'school'];
    const toneKeys = ['warm', 'clear', 'firm'];
    let context = contextKeys.includes(query.get('context')) ? query.get('context') : 'work';
    let tone = toneKeys.includes(query.get('tone')) ? query.get('tone') : 'clear';

    const elements = {
        language: document.getElementById('language-select'),
        context: document.getElementById('context-select'),
        tone: document.getElementById('tone-select'),
        situation: document.getElementById('situation-input'),
        request: document.getElementById('request-input'),
        boundary: document.getElementById('boundary-input'),
        validation: document.getElementById('validation-message'),
        result: document.getElementById('result-card'),
        output: document.getElementById('script-output'),
        status: document.getElementById('status-message')
    };

    const source = (query.get('source') || 'direct').slice(0, 80);
    const track = (eventName, params = {}) => {
        if (typeof gtag !== 'function') return;
        gtag('event', eventName, Object.assign({
            app_name: 'stress-check',
            content_group: 'boundary_script',
            script_language: language,
            script_context: context,
            script_tone: tone,
            entry_source: source,
            revenue_goal: 'daily_0_10'
        }, params));
    };

    function translateStatic() {
        document.documentElement.lang = language;
        document.querySelectorAll('[data-t]').forEach(node => {
            node.textContent = t(node.dataset.t);
        });
        document.title = `${t('title')} | DopaBrain`;
        document.querySelector('meta[name="description"]').content = t('subtitle');
        elements.language.value = language;
        elements.situation.placeholder = t('placeholders').situation;
        elements.request.placeholder = t('placeholders').request;
        elements.boundary.placeholder = t('placeholders').boundary;
        document.getElementById('back-link').href = `plan.html?lang=${language}&focus=${context === 'relationship' || context === 'work' ? context : 'daily'}&source=boundary_script`;
        document.getElementById('plan-link').href = `plan.html?lang=${language}&focus=${context === 'relationship' || context === 'work' ? context : 'daily'}&source=boundary_script`;
        document.getElementById('library-link').textContent = libraryLabelByLocale[language] || libraryLabelByLocale.en;
        document.getElementById('library-link').href = `library.html?lang=${language}&context=${context}&tone=${tone}&source=boundary_script`;
    }

    function fillSelects() {
        elements.context.innerHTML = contextKeys.map(key => `<option value="${key}">${t('contexts')[key]}</option>`).join('');
        elements.tone.innerHTML = toneKeys.map(key => `<option value="${key}">${t('tones')[key]}</option>`).join('');
        elements.context.value = context;
        elements.tone.value = tone;
    }

    function updateQuery() {
        const next = new URL(location.href);
        next.searchParams.set('lang', language);
        next.searchParams.set('context', context);
        next.searchParams.set('tone', tone);
        history.replaceState({}, '', next);
    }

    function updateCounts() {
        document.querySelectorAll('[data-count-for]').forEach(counter => {
            const input = document.getElementById(counter.dataset.countFor);
            counter.textContent = `${input.value.length} / ${input.maxLength}`;
        });
    }

    function scriptParts() {
        return [
            [t('labels').opening, t('openings')[tone]],
            [t('labels').situation, elements.situation.value.trim()],
            [t('labels').request, elements.request.value.trim()],
            [t('labels').boundary, elements.boundary.value.trim()]
        ];
    }

    function renderResult() {
        const values = [elements.situation, elements.request, elements.boundary].map(input => input.value.trim());
        if (values.some(value => !value)) {
            elements.validation.textContent = t('missing');
            elements.result.hidden = true;
            track('boundary_script_validation_error');
            return;
        }
        elements.validation.textContent = '';
        elements.output.replaceChildren(...scriptParts().map(([label, text]) => {
            const row = document.createElement('div');
            row.className = 'script-line';
            const labelNode = document.createElement('span');
            labelNode.className = 'script-label';
            labelNode.textContent = label;
            const textNode = document.createElement('span');
            textNode.className = 'script-text';
            textNode.textContent = text;
            row.append(labelNode, textNode);
            return row;
        }));
        elements.result.hidden = false;
        elements.status.textContent = '';
        localStorage.setItem('boundary-script-draft', JSON.stringify({
            context, tone, situation: values[0], request: values[1], boundary: values[2]
        }));
        track('boundary_script_generate', {
            situation_length: values[0].length,
            request_length: values[1].length,
            boundary_length: values[2].length
        });
        elements.result.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }

    function plainText() {
        return [
            t('title'),
            `${t('contextLabel')}: ${t('contexts')[context]}`,
            `${t('toneLabel')}: ${t('tones')[tone]}`,
            '',
            ...scriptParts().map(([label, text]) => `${label}: ${text}`),
            '',
            t('safetyCopy'),
            'https://dopabrain.com/stress-check/script.html'
        ].join('\n');
    }

    async function copyScript() {
        const text = plainText();
        try {
            await navigator.clipboard.writeText(text);
        } catch (_) {
            const area = document.createElement('textarea');
            area.value = text;
            area.style.position = 'fixed';
            area.style.opacity = '0';
            document.body.appendChild(area);
            area.select();
            document.execCommand('copy');
            area.remove();
        }
        elements.status.textContent = t('copied');
        track('boundary_script_copy');
    }

    function loadDraft() {
        try {
            const draft = JSON.parse(localStorage.getItem('boundary-script-draft') || 'null');
            if (!draft) return;
            if (!query.has('context') && contextKeys.includes(draft.context)) context = draft.context;
            if (!query.has('tone') && toneKeys.includes(draft.tone)) tone = draft.tone;
            elements.situation.value = String(draft.situation || '').slice(0, 240);
            elements.request.value = String(draft.request || '').slice(0, 240);
            elements.boundary.value = String(draft.boundary || '').slice(0, 240);
        } catch (_) {}
    }

    function resetBuilder() {
        [elements.situation, elements.request, elements.boundary].forEach(input => { input.value = ''; });
        elements.result.hidden = true;
        elements.validation.textContent = '';
        elements.status.textContent = '';
        localStorage.removeItem('boundary-script-draft');
        updateCounts();
        elements.situation.focus();
        track('boundary_script_reset');
    }

    function init() {
        loadDraft();
        if (query.get('example') === '1') {
            const example = t('examples')[context];
            [elements.situation.value, elements.request.value, elements.boundary.value] = example;
        }
        translateStatic();
        fillSelects();
        updateCounts();
        updateQuery();

        elements.language.addEventListener('change', event => {
            language = supported.includes(event.target.value) ? event.target.value : 'en';
            localStorage.setItem('preferredLanguage', language);
            translateStatic();
            fillSelects();
            elements.result.hidden = true;
            updateQuery();
            track('boundary_script_language_change');
        });
        elements.context.addEventListener('change', event => {
            context = event.target.value;
            translateStatic();
            elements.result.hidden = true;
            updateQuery();
            track('boundary_script_customize', { customize_field: 'context' });
        });
        elements.tone.addEventListener('change', event => {
            tone = event.target.value;
            elements.result.hidden = true;
            updateQuery();
            track('boundary_script_customize', { customize_field: 'tone' });
        });
        [elements.situation, elements.request, elements.boundary].forEach(input => input.addEventListener('input', updateCounts));
        document.getElementById('example-button').addEventListener('click', () => {
            const example = t('examples')[context];
            [elements.situation.value, elements.request.value, elements.boundary.value] = example;
            updateCounts();
            track('boundary_script_example', { example_context: context });
            renderResult();
        });
        document.getElementById('generate-button').addEventListener('click', renderResult);
        document.getElementById('copy-button').addEventListener('click', copyScript);
        document.getElementById('print-button').addEventListener('click', () => {
            track('boundary_script_print');
            window.print();
        });
        document.getElementById('reset-button').addEventListener('click', resetBuilder);
        document.getElementById('plan-link').addEventListener('click', () => track('boundary_script_plan_click'));
        document.getElementById('library-link').addEventListener('click', () => track('boundary_script_library_click'));
        document.getElementById('back-link').addEventListener('click', () => track('boundary_script_plan_click', { link_surface: 'header' }));
        const ad = document.querySelector('[data-ad-surface]');
        if (ad && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                if (!entries.some(entry => entry.isIntersecting)) return;
                track('boundary_script_ad_impression', { ad_surface: ad.dataset.adSurface });
                observer.disconnect();
            }, { threshold: 0.2 });
            observer.observe(ad);
        }
        track('boundary_script_view');
        if (query.get('example') === '1') {
            track('boundary_script_template_load', { template_context: context });
        }
    }

    init();
})();
