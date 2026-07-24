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
            skip: 'Skip to plan', back: '← Back to stress check', language: 'Language',
            eyebrow: 'PRIVATE INTERACTIVE WORKSHEET', title: 'Your 7-Day Stress Reset Plan',
            subtitle: 'Choose the pressure area that needs attention first. Your checklist stays only in this browser.',
            privacy: 'No account · no answers uploaded · editable anytime', customize: 'Customize your plan',
            focusLabel: 'Main pressure area', levelLabel: 'Current load', progress: 'Plan progress',
            smallSteps: 'SMALL STEPS, NOT A PERFECT WEEK', weekTitle: 'Your next seven days',
            reset: 'Reset checks', ad: 'Advertisement', keepTitle: 'Keep the plan where you will use it',
            keepCopy: 'Copy a plain-text version, print it, or bookmark this page. Your checked days are saved locally.',
            copy: 'Copy plan', print: 'Print plan', copied: 'Plan copied.',
            whyTitle: 'Why the plan is intentionally small',
            whyCopy: 'Stress plans are easier to use when actions are specific and brief. This worksheet combines routine, grounding, movement, connection, and review prompts; it does not diagnose or treat a health condition.',
            whoSource: 'WHO: Doing What Matters in Times of Stress', cdcSource: 'CDC: Managing Stress',
            safetyTitle: 'When a worksheet is not enough',
            safetyCopy: 'If stress is severe, persistent, affects daily functioning, or you feel unsafe, contact a qualified health professional or local emergency service. This planner is educational self-help, not medical advice.',
            privacyPolicy: 'Privacy', moreTools: 'More DopaBrain tools',
            focus: { work: 'Work or study', relationship: 'Relationships', health: 'Health and energy', finance: 'Finances', daily: 'Daily overload' },
            focusSummary: {
                work: 'Protect one focus block and reduce one avoidable demand.',
                relationship: 'Lower conflict pressure with a clear, time-bounded conversation.',
                health: 'Start with recovery basics and professional support when symptoms need it.',
                finance: 'Turn vague money worry into one short facts-only review.',
                daily: 'Shrink the list and create one repeatable recovery window.'
            },
            level: { veryLow: 'Light', low: 'Manageable', moderate: 'Moderate', high: 'High', veryHigh: 'Very high' },
            days: [
                ['Name the pressure', 'Write one sentence: “The main pressure today is …” Then choose the smallest part you can influence.'],
                ['Create a 10-minute reset', 'Schedule ten quiet minutes for slow breathing, grounding, stretching, or a short walk.'],
                ['Remove one demand', 'Delay, delegate, shorten, or decline one nonessential task. Use the saved time for recovery.'],
                ['Use a boundary script', 'Try: “I can help with ___, but I cannot do ___ by ___. Can we choose a different plan?”'],
                ['Support your body', 'Choose a realistic sleep window, regular meal, hydration cue, or gentle movement today.'],
                ['Connect on purpose', 'Tell one trusted person what kind of support would help: listening, practical help, or company.'],
                ['Review without judging', 'Keep what helped, change what did not, and choose one action to repeat next week.']
            ],
            focusAction: {
                work: 'Focus add-on: silence notifications for one 25-minute block.',
                relationship: 'Focus add-on: describe one observable fact, one feeling, and one request.',
                health: 'Focus add-on: note symptoms and questions for a qualified health professional if needed.',
                finance: 'Focus add-on: review one balance or bill for 10 minutes, then stop.',
                daily: 'Focus add-on: write only three must-do items for today.'
            },
            day: 'DAY'
        },
        ko: {
            skip:'계획으로 건너뛰기',back:'← 스트레스 체크로 돌아가기',language:'언어',eyebrow:'개인용 인터랙티브 워크시트',title:'나의 7일 스트레스 리셋 플랜',subtitle:'가장 먼저 돌봐야 할 압박 영역을 선택하세요. 체크 기록은 이 브라우저에만 남습니다.',privacy:'가입 없음 · 답변 업로드 없음 · 언제든 수정',customize:'계획 맞춤 설정',focusLabel:'주요 압박 영역',levelLabel:'현재 부담',progress:'계획 진행률',smallSteps:'완벽한 한 주보다 작은 실천',weekTitle:'앞으로 7일',reset:'체크 초기화',ad:'광고',keepTitle:'실제로 볼 곳에 계획을 두세요',keepCopy:'텍스트로 복사하거나 인쇄·북마크할 수 있습니다. 완료 기록은 로컬에 저장됩니다.',copy:'계획 복사',print:'계획 인쇄',copied:'계획을 복사했습니다.',whyTitle:'계획이 의도적으로 작은 이유',whyCopy:'구체적이고 짧은 행동은 실천하기 쉽습니다. 이 워크시트는 루틴, 그라운딩, 움직임, 연결, 점검을 묶지만 진단이나 치료를 제공하지 않습니다.',whoSource:'WHO: 스트레스 상황에서 중요한 일 하기',cdcSource:'CDC: 스트레스 관리',safetyTitle:'워크시트만으로 충분하지 않을 때',safetyCopy:'스트레스가 심하거나 오래 지속되고 일상 기능에 영향을 주거나 안전하지 않다고 느끼면 자격 있는 전문가나 지역 응급기관에 연락하세요. 이 계획은 교육용 자기관리 도구이며 의료 조언이 아닙니다.',privacyPolicy:'개인정보',moreTools:'DopaBrain 도구 더 보기',focus:{work:'직장·학업',relationship:'관계',health:'건강·에너지',finance:'재정',daily:'일상 과부하'},focusSummary:{work:'집중 시간 하나를 지키고 피할 수 있는 요구 하나를 줄이세요.',relationship:'시간을 정한 명확한 대화로 갈등 압박을 낮추세요.',health:'회복의 기본부터 시작하고 필요하면 전문가 도움을 받으세요.',finance:'막연한 돈 걱정을 짧은 사실 확인으로 바꾸세요.',daily:'할 일 목록을 줄이고 반복 가능한 회복 시간을 만드세요.'},level:{veryLow:'가벼움',low:'감당 가능',moderate:'보통',high:'높음',veryHigh:'매우 높음'},days:[['압박 이름 붙이기','“오늘의 가장 큰 압박은 …”을 한 문장으로 쓰고, 내가 바꿀 수 있는 가장 작은 부분을 고르세요.'],['10분 리셋 만들기','느린 호흡, 그라운딩, 스트레칭 또는 짧은 산책을 위한 조용한 10분을 예약하세요.'],['요구 하나 줄이기','필수가 아닌 일 하나를 미루거나 위임하거나 줄이거나 거절하고 그 시간을 회복에 쓰세요.'],['경계 문장 사용하기','“나는 ___까지는 할 수 있지만 ___일까지 ___은 어렵습니다. 다른 방법을 고를까요?”라고 말해보세요.'],['몸을 지원하기','현실적인 수면 시간, 규칙적인 식사, 수분 알림 또는 가벼운 움직임 하나를 고르세요.'],['의도적으로 연결하기','신뢰하는 사람에게 경청, 실질적 도움, 함께 있어 주기 중 무엇이 필요한지 말하세요.'],['판단 없이 돌아보기','도움 된 것은 유지하고 아닌 것은 바꾸며 다음 주 반복할 행동 하나를 고르세요.']],focusAction:{work:'집중 추가: 알림을 끄고 25분간 한 가지 일만 하세요.',relationship:'관계 추가: 관찰 가능한 사실 하나, 감정 하나, 요청 하나를 말하세요.',health:'건강 추가: 필요하면 전문가에게 물을 증상과 질문을 적으세요.',finance:'재정 추가: 잔액이나 청구서 하나만 10분 확인하고 멈추세요.',daily:'일상 추가: 오늘 꼭 할 일은 세 개만 적으세요.'},day:'일차'
        },
        zh: {
            skip:'跳到计划',back:'← 返回压力测试',language:'语言',eyebrow:'私人互动工作表',title:'你的7天压力重置计划',subtitle:'先选择最需要处理的压力领域。勾选记录只保存在此浏览器。',privacy:'无需账户 · 不上传答案 · 随时可编辑',customize:'定制计划',focusLabel:'主要压力领域',levelLabel:'当前负荷',progress:'计划进度',smallSteps:'小步骤，不追求完美一周',weekTitle:'接下来七天',reset:'重置勾选',ad:'广告',keepTitle:'把计划放在你会看到的地方',keepCopy:'可复制纯文本、打印或收藏本页。完成记录保存在本地。',copy:'复制计划',print:'打印计划',copied:'计划已复制。',whyTitle:'为什么计划刻意保持简短',whyCopy:'具体而简短的行动更容易执行。本工作表结合日常安排、安定练习、活动、联系和复盘，不用于诊断或治疗。',whoSource:'世界卫生组织：压力时期做重要的事',cdcSource:'美国疾控中心：管理压力',safetyTitle:'工作表不够时',safetyCopy:'若压力严重、持续、影响日常功能，或你感到不安全，请联系合格的医疗专业人员或当地紧急服务。本计划仅用于教育性自助，不是医疗建议。',privacyPolicy:'隐私',moreTools:'更多 DopaBrain 工具',focus:{work:'工作或学习',relationship:'人际关系',health:'健康与精力',finance:'财务',daily:'日常过载'},focusSummary:{work:'保护一个专注时段，减少一项可避免的要求。',relationship:'用清晰且限时的对话降低冲突压力。',health:'从恢复基础开始，症状需要时寻求专业帮助。',finance:'把模糊的金钱焦虑变成一次简短的事实核对。',daily:'缩短清单，建立一个可重复的恢复时段。'},level:{veryLow:'轻微',low:'可控',moderate:'中等',high:'较高',veryHigh:'很高'},days:[['说出压力','写一句“今天主要的压力是……”，再选出你能影响的最小部分。'],['安排10分钟重置','留出十分钟做缓慢呼吸、安定练习、伸展或短步行。'],['减少一项要求','推迟、委派、缩短或拒绝一项非必要任务，把时间用于恢复。'],['使用边界表达','试着说：“我可以帮___，但无法在___前完成___。我们能换个方案吗？”'],['支持身体','今天选择现实的睡眠时段、规律饮食、饮水提醒或轻度活动。'],['主动联系','告诉一位信任的人你需要倾听、实际帮助还是陪伴。'],['不带评判地复盘','保留有帮助的，调整无效的，并选一项下周重复。']],focusAction:{work:'专注加项：关闭通知，专注一件事25分钟。',relationship:'关系加项：说出一个事实、一种感受和一个请求。',health:'健康加项：必要时记下要向专业人员咨询的症状和问题。',finance:'财务加项：只查看一项余额或账单10分钟，然后停止。',daily:'日常加项：今天只写三件必须完成的事。'},day:'第'
        },
        es: {
            skip:'Ir al plan',back:'← Volver al test de estrés',language:'Idioma',eyebrow:'HOJA INTERACTIVA PRIVADA',title:'Tu plan de 7 días para reducir el estrés',subtitle:'Elige primero el área que necesita atención. Tus marcas quedan solo en este navegador.',privacy:'Sin cuenta · sin subir respuestas · editable',customize:'Personaliza tu plan',focusLabel:'Área principal de presión',levelLabel:'Carga actual',progress:'Progreso',smallSteps:'PASOS PEQUEÑOS, NO UNA SEMANA PERFECTA',weekTitle:'Tus próximos siete días',reset:'Reiniciar',ad:'Publicidad',keepTitle:'Guarda el plan donde lo usarás',keepCopy:'Cópialo, imprímelo o guarda la página. El progreso se conserva localmente.',copy:'Copiar plan',print:'Imprimir',copied:'Plan copiado.',whyTitle:'Por qué el plan es pequeño',whyCopy:'Las acciones concretas y breves son más fáciles de usar. Esta hoja combina rutina, conexión a tierra, movimiento, apoyo y revisión; no diagnostica ni trata.',whoSource:'OMS: En tiempos de estrés, haz lo que importa',cdcSource:'CDC: Manejar el estrés',safetyTitle:'Cuando una hoja no basta',safetyCopy:'Si el estrés es grave, persistente, afecta tu vida diaria o no te sientes a salvo, contacta a un profesional cualificado o a emergencias locales. Esto es autoayuda educativa, no consejo médico.',privacyPolicy:'Privacidad',moreTools:'Más herramientas',focus:{work:'Trabajo o estudio',relationship:'Relaciones',health:'Salud y energía',finance:'Finanzas',daily:'Sobrecarga diaria'},focusSummary:{work:'Protege un bloque de concentración y reduce una demanda evitable.',relationship:'Reduce la presión con una conversación clara y limitada en el tiempo.',health:'Empieza por lo básico y busca apoyo profesional si hace falta.',finance:'Convierte la preocupación difusa en una revisión breve de hechos.',daily:'Reduce la lista y crea una pausa repetible.'},level:{veryLow:'Ligera',low:'Manejable',moderate:'Moderada',high:'Alta',veryHigh:'Muy alta'},days:[['Nombra la presión','Escribe: “La principal presión de hoy es…”. Elige la parte más pequeña que puedes influir.'],['Crea una pausa de 10 minutos','Reserva diez minutos para respirar despacio, orientarte, estirar o caminar.'],['Quita una demanda','Retrasa, delega, acorta o rechaza una tarea no esencial y usa ese tiempo para recuperarte.'],['Usa un límite claro','Prueba: “Puedo ayudar con ___, pero no puedo hacer ___ para ___. ¿Elegimos otro plan?”'],['Apoya a tu cuerpo','Elige hoy un horario de sueño realista, una comida regular, agua o movimiento suave.'],['Conecta con intención','Dile a alguien de confianza si necesitas escucha, ayuda práctica o compañía.'],['Revisa sin juzgar','Conserva lo útil, cambia lo que no funcionó y repite una acción la próxima semana.']],focusAction:{work:'Extra: silencia avisos durante 25 minutos de concentración.',relationship:'Extra: expresa un hecho, una emoción y una petición.',health:'Extra: anota síntomas y preguntas para un profesional si lo necesitas.',finance:'Extra: revisa un saldo o factura durante 10 minutos y detente.',daily:'Extra: escribe solo tres tareas imprescindibles.'},day:'DÍA'
        },
        pt: {
            skip:'Ir para o plano',back:'← Voltar ao teste de estresse',language:'Idioma',eyebrow:'FOLHA INTERATIVA PRIVADA',title:'Seu plano de 7 dias para reduzir o estresse',subtitle:'Escolha primeiro a área que precisa de atenção. As marcações ficam apenas neste navegador.',privacy:'Sem conta · sem enviar respostas · editável',customize:'Personalize o plano',focusLabel:'Principal área de pressão',levelLabel:'Carga atual',progress:'Progresso',smallSteps:'PASSOS PEQUENOS, NÃO UMA SEMANA PERFEITA',weekTitle:'Seus próximos sete dias',reset:'Redefinir',ad:'Publicidade',keepTitle:'Guarde o plano onde vai usá-lo',keepCopy:'Copie, imprima ou salve a página. O progresso fica armazenado localmente.',copy:'Copiar plano',print:'Imprimir',copied:'Plano copiado.',whyTitle:'Por que o plano é pequeno',whyCopy:'Ações específicas e breves são mais fáceis de praticar. Esta folha combina rotina, aterramento, movimento, conexão e revisão; não diagnostica nem trata.',whoSource:'OMS: Fazer o que importa em tempos de estresse',cdcSource:'CDC: Gerenciando o estresse',safetyTitle:'Quando uma folha não basta',safetyCopy:'Se o estresse for intenso, persistente, afetar a vida diária ou você não se sentir seguro, procure um profissional qualificado ou o serviço de emergência local. Isto é autoajuda educativa, não orientação médica.',privacyPolicy:'Privacidade',moreTools:'Mais ferramentas',focus:{work:'Trabalho ou estudo',relationship:'Relacionamentos',health:'Saúde e energia',finance:'Finanças',daily:'Sobrecarga diária'},focusSummary:{work:'Proteja um bloco de foco e reduza uma demanda evitável.',relationship:'Reduza a pressão com uma conversa clara e com tempo definido.',health:'Comece pelo básico e procure apoio profissional quando necessário.',finance:'Transforme a preocupação vaga em uma revisão curta de fatos.',daily:'Reduza a lista e crie uma pausa repetível.'},level:{veryLow:'Leve',low:'Administrável',moderate:'Moderada',high:'Alta',veryHigh:'Muito alta'},days:[['Nomeie a pressão','Escreva: “A principal pressão hoje é…”. Escolha a menor parte que pode influenciar.'],['Crie uma pausa de 10 minutos','Reserve dez minutos para respirar devagar, se orientar, alongar ou caminhar.'],['Remova uma demanda','Adie, delegue, encurte ou recuse uma tarefa não essencial e use o tempo para se recuperar.'],['Use um limite claro','Tente: “Posso ajudar com ___, mas não consigo fazer ___ até ___. Podemos escolher outro plano?”'],['Apoie o corpo','Escolha hoje um horário de sono realista, refeição regular, água ou movimento leve.'],['Conecte-se de propósito','Diga a alguém de confiança se precisa de escuta, ajuda prática ou companhia.'],['Revise sem julgar','Mantenha o que ajudou, mude o que não ajudou e repita uma ação na próxima semana.']],focusAction:{work:'Extra: silencie notificações por 25 minutos de foco.',relationship:'Extra: diga um fato, um sentimento e um pedido.',health:'Extra: anote sintomas e perguntas para um profissional se necessário.',finance:'Extra: revise um saldo ou conta por 10 minutos e pare.',daily:'Extra: escreva apenas três tarefas essenciais.'},day:'DIA'
        },
        ja: {
            skip:'プランへ移動',back:'← ストレスチェックへ戻る',language:'言語',eyebrow:'プライベートなワークシート',title:'7日間ストレス・リセットプラン',subtitle:'まずケアしたい負担領域を選びます。チェックはこのブラウザだけに保存されます。',privacy:'登録不要・回答送信なし・いつでも編集',customize:'プランを調整',focusLabel:'主な負担領域',levelLabel:'現在の負荷',progress:'進捗',smallSteps:'完璧な一週間より小さな一歩',weekTitle:'これからの7日間',reset:'チェックをリセット',ad:'広告',keepTitle:'使う場所にプランを残す',keepCopy:'テキストでコピー、印刷、ブックマークできます。進捗は端末内に保存されます。',copy:'プランをコピー',print:'印刷',copied:'コピーしました。',whyTitle:'あえて小さなプランにする理由',whyCopy:'具体的で短い行動は実行しやすくなります。このシートは日課、グラウンディング、運動、つながり、振り返りを組み合わせますが、診断や治療ではありません。',whoSource:'WHO：ストレスを感じたら大切なことをする',cdcSource:'CDC：ストレス管理',safetyTitle:'シートだけでは足りないとき',safetyCopy:'強いストレスが続く、日常生活に影響する、安全でないと感じる場合は、資格ある専門家や地域の緊急窓口へ。このプランは教育的セルフヘルプで、医療助言ではありません。',privacyPolicy:'プライバシー',moreTools:'他のツール',focus:{work:'仕事・学業',relationship:'人間関係',health:'健康・エネルギー',finance:'お金',daily:'日常の過負荷'},focusSummary:{work:'集中時間を一つ守り、避けられる要求を一つ減らします。',relationship:'時間を区切った明確な会話で摩擦を下げます。',health:'回復の基本から始め、必要なら専門家を頼ります。',finance:'漠然とした不安を短い事実確認に変えます。',daily:'リストを縮め、繰り返せる休息時間を作ります。'},level:{veryLow:'軽い',low:'対処可能',moderate:'中程度',high:'高い',veryHigh:'非常に高い'},days:[['負担に名前をつける','「今日の主な負担は…」と一文で書き、影響できる最小の部分を選びます。'],['10分のリセット','ゆっくりした呼吸、グラウンディング、ストレッチ、短い散歩のため10分を確保します。'],['要求を一つ減らす','必須でないことを延期、委任、短縮、または断り、回復に使います。'],['境界線の言葉を使う','「___はできますが、___までに___はできません。別の方法を選べますか？」と伝えます。'],['体を支える','現実的な睡眠時間、食事、水分、軽い運動から一つ選びます。'],['意図してつながる','信頼する人に、傾聴・実務的な助け・同席のどれが必要か伝えます。'],['評価せず振り返る','役立ったことを残し、合わなかったことを変え、来週繰り返す一つを選びます。']],focusAction:{work:'追加：通知を切り、25分間一つに集中します。',relationship:'追加：一つの事実、一つの気持ち、一つの依頼を伝えます。',health:'追加：必要なら専門家に聞く症状と質問を書きます。',finance:'追加：残高か請求書を一つだけ10分確認します。',daily:'追加：今日必須のことを三つだけ書きます。'},day:'日目'
        },
        de: {
            skip:'Zum Plan',back:'← Zurück zum Stresstest',language:'Sprache',eyebrow:'PRIVATES INTERAKTIVES ARBEITSBLATT',title:'Dein 7-Tage-Stress-Reset-Plan',subtitle:'Wähle zuerst den Bereich, der Aufmerksamkeit braucht. Häkchen bleiben nur in diesem Browser.',privacy:'Kein Konto · keine Antworten hochgeladen · editierbar',customize:'Plan anpassen',focusLabel:'Hauptbelastung',levelLabel:'Aktuelle Belastung',progress:'Fortschritt',smallSteps:'KLEINE SCHRITTE STATT PERFEKTER WOCHE',weekTitle:'Deine nächsten sieben Tage',reset:'Zurücksetzen',ad:'Anzeige',keepTitle:'Bewahre den Plan griffbereit auf',keepCopy:'Kopiere, drucke oder speichere diese Seite. Fortschritt bleibt lokal gespeichert.',copy:'Plan kopieren',print:'Drucken',copied:'Plan kopiert.',whyTitle:'Warum der Plan bewusst klein ist',whyCopy:'Konkrete, kurze Handlungen sind leichter nutzbar. Dieses Blatt verbindet Routine, Erdung, Bewegung, Kontakt und Rückblick; es diagnostiziert oder behandelt nicht.',whoSource:'WHO: Doing What Matters in Times of Stress',cdcSource:'CDC: Stress bewältigen',safetyTitle:'Wenn ein Arbeitsblatt nicht reicht',safetyCopy:'Bei starkem, anhaltendem Stress, beeinträchtigtem Alltag oder Unsicherheit wende dich an qualifiziertes Fachpersonal oder den örtlichen Notdienst. Dies ist edukative Selbsthilfe, keine medizinische Beratung.',privacyPolicy:'Datenschutz',moreTools:'Weitere Tools',focus:{work:'Arbeit oder Studium',relationship:'Beziehungen',health:'Gesundheit und Energie',finance:'Finanzen',daily:'Alltagsüberlastung'},focusSummary:{work:'Schütze einen Fokusblock und reduziere eine vermeidbare Anforderung.',relationship:'Senke Druck mit einem klaren, zeitlich begrenzten Gespräch.',health:'Beginne mit Erholungsgrundlagen und hole bei Bedarf fachliche Hilfe.',finance:'Mache aus diffuser Sorge einen kurzen Faktencheck.',daily:'Kürze die Liste und schaffe ein wiederholbares Erholungsfenster.'},level:{veryLow:'Leicht',low:'Handhabbar',moderate:'Mittel',high:'Hoch',veryHigh:'Sehr hoch'},days:[['Belastung benennen','Schreibe: „Der größte Druck heute ist …“ und wähle den kleinsten beeinflussbaren Teil.'],['10-Minuten-Pause','Plane zehn ruhige Minuten für langsames Atmen, Erdung, Dehnen oder Gehen.'],['Eine Anforderung entfernen','Verschiebe, delegiere, kürze oder lehne eine unwichtige Aufgabe ab und nutze die Zeit zur Erholung.'],['Grenze formulieren','Versuche: „Ich kann bei ___ helfen, aber ___ nicht bis ___. Können wir anders planen?“'],['Körper unterstützen','Wähle heute Schlafzeit, regelmäßige Mahlzeit, Trinkerinnerung oder sanfte Bewegung.'],['Bewusst Kontakt suchen','Sage einer vertrauten Person, ob du Zuhören, praktische Hilfe oder Gesellschaft brauchst.'],['Ohne Urteil prüfen','Behalte Hilfreiches, ändere Unwirksames und wähle eine Handlung für nächste Woche.']],focusAction:{work:'Extra: Benachrichtigungen für 25 Minuten Fokus stummschalten.',relationship:'Extra: eine Tatsache, ein Gefühl und eine Bitte nennen.',health:'Extra: Symptome und Fragen für Fachpersonal notieren.',finance:'Extra: einen Kontostand oder eine Rechnung 10 Minuten prüfen.',daily:'Extra: nur drei Muss-Aufgaben notieren.'},day:'TAG'
        },
        fr: {
            skip:'Aller au plan',back:'← Retour au test de stress',language:'Langue',eyebrow:'FICHE INTERACTIVE PRIVÉE',title:'Votre plan anti-stress sur 7 jours',subtitle:'Choisissez d’abord la zone à traiter. Les coches restent uniquement dans ce navigateur.',privacy:'Sans compte · aucune réponse envoyée · modifiable',customize:'Personnaliser le plan',focusLabel:'Principale source de pression',levelLabel:'Charge actuelle',progress:'Progression',smallSteps:'DE PETITS PAS, PAS UNE SEMAINE PARFAITE',weekTitle:'Vos sept prochains jours',reset:'Réinitialiser',ad:'Publicité',keepTitle:'Gardez le plan là où vous l’utiliserez',keepCopy:'Copiez, imprimez ou ajoutez cette page aux favoris. La progression reste locale.',copy:'Copier le plan',print:'Imprimer',copied:'Plan copié.',whyTitle:'Pourquoi le plan reste volontairement petit',whyCopy:'Des actions précises et brèves sont plus faciles à utiliser. Cette fiche associe routine, ancrage, mouvement, lien et bilan ; elle ne diagnostique ni ne traite.',whoSource:'OMS : Faire ce qui compte en période de stress',cdcSource:'CDC : Gérer le stress',safetyTitle:'Quand une fiche ne suffit pas',safetyCopy:'Si le stress est intense, persistant, gêne le quotidien ou si vous ne vous sentez pas en sécurité, contactez un professionnel qualifié ou les urgences locales. Ceci est une aide éducative, pas un avis médical.',privacyPolicy:'Confidentialité',moreTools:'Autres outils',focus:{work:'Travail ou études',relationship:'Relations',health:'Santé et énergie',finance:'Finances',daily:'Surcharge quotidienne'},focusSummary:{work:'Protégez un bloc de concentration et réduisez une demande évitable.',relationship:'Réduisez la pression par une conversation claire et limitée dans le temps.',health:'Commencez par les bases et cherchez une aide professionnelle si nécessaire.',finance:'Transformez l’inquiétude vague en une courte vérification factuelle.',daily:'Réduisez la liste et créez une pause répétable.'},level:{veryLow:'Légère',low:'Gérable',moderate:'Modérée',high:'Élevée',veryHigh:'Très élevée'},days:[['Nommer la pression','Écrivez : « La principale pression aujourd’hui est… » puis choisissez la plus petite partie influençable.'],['Créer une pause de 10 minutes','Réservez dix minutes pour respirer lentement, vous ancrer, vous étirer ou marcher.'],['Retirer une demande','Reportez, déléguez, raccourcissez ou refusez une tâche non essentielle et récupérez.'],['Poser une limite','Essayez : « Je peux aider pour ___, mais pas faire ___ avant ___. Choisissons-nous un autre plan ? »'],['Soutenir le corps','Choisissez aujourd’hui un horaire de sommeil réaliste, un repas régulier, de l’eau ou un mouvement doux.'],['Se connecter volontairement','Dites à une personne de confiance si vous avez besoin d’écoute, d’aide pratique ou de présence.'],['Faire le bilan sans juger','Gardez ce qui aide, changez le reste et choisissez une action à répéter la semaine prochaine.']],focusAction:{work:'Bonus : coupez les notifications pendant 25 minutes de concentration.',relationship:'Bonus : exprimez un fait, un ressenti et une demande.',health:'Bonus : notez symptômes et questions pour un professionnel si besoin.',finance:'Bonus : vérifiez un solde ou une facture pendant 10 minutes puis arrêtez.',daily:'Bonus : écrivez seulement trois tâches indispensables.'},day:'JOUR'
        },
        ru: {
            skip:'К плану',back:'← Назад к тесту стресса',language:'Язык',eyebrow:'ЛИЧНЫЙ ИНТЕРАКТИВНЫЙ ЛИСТ',title:'Ваш 7-дневный план снижения стресса',subtitle:'Сначала выберите область, которой нужно внимание. Отметки хранятся только в этом браузере.',privacy:'Без аккаунта · ответы не загружаются · можно менять',customize:'Настроить план',focusLabel:'Главная область давления',levelLabel:'Текущая нагрузка',progress:'Прогресс',smallSteps:'МАЛЕНЬКИЕ ШАГИ, А НЕ ИДЕАЛЬНАЯ НЕДЕЛЯ',weekTitle:'Следующие семь дней',reset:'Сбросить',ad:'Реклама',keepTitle:'Сохраните план там, где будете им пользоваться',keepCopy:'Скопируйте, распечатайте или добавьте страницу в закладки. Прогресс хранится локально.',copy:'Копировать',print:'Печать',copied:'План скопирован.',whyTitle:'Почему план намеренно небольшой',whyCopy:'Конкретные короткие действия легче выполнять. Лист сочетает режим, заземление, движение, общение и обзор; он не диагностирует и не лечит.',whoSource:'ВОЗ: Делай то, что важно, во времена стресса',cdcSource:'CDC: Управление стрессом',safetyTitle:'Когда листа недостаточно',safetyCopy:'Если стресс сильный, длительный, мешает повседневной жизни или вы не чувствуете себя в безопасности, обратитесь к квалифицированному специалисту или в местную экстренную службу. Это образовательная самопомощь, не медицинский совет.',privacyPolicy:'Конфиденциальность',moreTools:'Другие инструменты',focus:{work:'Работа или учёба',relationship:'Отношения',health:'Здоровье и энергия',finance:'Финансы',daily:'Повседневная перегрузка'},focusSummary:{work:'Защитите один блок внимания и сократите одно необязательное требование.',relationship:'Снизьте напряжение ясным разговором с ограничением по времени.',health:'Начните с основ восстановления и при необходимости обратитесь к специалисту.',finance:'Превратите смутную тревогу в короткую проверку фактов.',daily:'Сократите список и создайте повторяемое окно отдыха.'},level:{veryLow:'Лёгкая',low:'Управляемая',moderate:'Средняя',high:'Высокая',veryHigh:'Очень высокая'},days:[['Назвать давление','Напишите: «Главное давление сегодня — …» и выберите наименьшую часть, на которую можете влиять.'],['10 минут перезагрузки','Выделите десять минут на медленное дыхание, заземление, растяжку или прогулку.'],['Убрать одно требование','Отложите, делегируйте, сократите или отклоните одну необязательную задачу.'],['Обозначить границу','Скажите: «Я могу помочь с ___, но не могу сделать ___ к ___. Выберем другой план?»'],['Поддержать тело','Выберите реалистичное время сна, регулярную еду, воду или мягкое движение.'],['Связаться осознанно','Скажите близкому, нужна ли вам беседа, практическая помощь или компания.'],['Подвести итог без осуждения','Оставьте полезное, измените остальное и выберите одно действие на следующую неделю.']],focusAction:{work:'Дополнение: отключите уведомления на 25 минут.',relationship:'Дополнение: назовите факт, чувство и просьбу.',health:'Дополнение: запишите симптомы и вопросы специалисту.',finance:'Дополнение: проверьте один баланс или счёт 10 минут и остановитесь.',daily:'Дополнение: запишите только три обязательных дела.'},day:'ДЕНЬ'
        },
        hi: {
            skip:'योजना पर जाएँ',back:'← तनाव जाँच पर लौटें',language:'भाषा',eyebrow:'निजी इंटरैक्टिव वर्कशीट',title:'आपकी 7-दिन की तनाव रीसेट योजना',subtitle:'पहले उस दबाव क्षेत्र को चुनें जिसे ध्यान चाहिए। टिक केवल इसी ब्राउज़र में रहते हैं।',privacy:'कोई खाता नहीं · उत्तर अपलोड नहीं · कभी भी बदलें',customize:'योजना बदलें',focusLabel:'मुख्य दबाव क्षेत्र',levelLabel:'वर्तमान भार',progress:'प्रगति',smallSteps:'छोटे कदम, आदर्श सप्ताह नहीं',weekTitle:'अगले सात दिन',reset:'टिक रीसेट करें',ad:'विज्ञापन',keepTitle:'योजना वहाँ रखें जहाँ उपयोग करेंगे',keepCopy:'कॉपी, प्रिंट या बुकमार्क करें। प्रगति स्थानीय रूप से सहेजी जाती है।',copy:'योजना कॉपी करें',print:'प्रिंट करें',copied:'योजना कॉपी हुई।',whyTitle:'योजना जानबूझकर छोटी क्यों है',whyCopy:'स्पष्ट और छोटे काम करना आसान होता है। यह वर्कशीट दिनचर्या, ग्राउंडिंग, गतिविधि, जुड़ाव और समीक्षा जोड़ती है; यह निदान या उपचार नहीं करती।',whoSource:'WHO: तनाव के समय महत्वपूर्ण काम करना',cdcSource:'CDC: तनाव प्रबंधन',safetyTitle:'जब वर्कशीट पर्याप्त न हो',safetyCopy:'यदि तनाव गंभीर, लगातार, दैनिक जीवन को प्रभावित करने वाला हो या आप असुरक्षित महसूस करें, योग्य स्वास्थ्य पेशेवर या स्थानीय आपात सेवा से संपर्क करें। यह शैक्षिक स्व-सहायता है, चिकित्सीय सलाह नहीं।',privacyPolicy:'गोपनीयता',moreTools:'और उपकरण',focus:{work:'काम या पढ़ाई',relationship:'रिश्ते',health:'स्वास्थ्य और ऊर्जा',finance:'वित्त',daily:'दैनिक बोझ'},focusSummary:{work:'एक फोकस समय बचाएँ और एक टालने योग्य माँग घटाएँ।',relationship:'स्पष्ट, समयबद्ध बातचीत से दबाव घटाएँ।',health:'आराम की बुनियाद से शुरू करें और जरूरत पर पेशेवर सहायता लें।',finance:'अस्पष्ट चिंता को एक छोटी तथ्य-जाँच में बदलें।',daily:'सूची छोटी करें और नियमित आराम समय बनाएँ।'},level:{veryLow:'हल्का',low:'संभालने योग्य',moderate:'मध्यम',high:'उच्च',veryHigh:'बहुत उच्च'},days:[['दबाव का नाम दें','लिखें: “आज मुख्य दबाव है…” और वह सबसे छोटा हिस्सा चुनें जिसे प्रभावित कर सकते हैं।'],['10 मिनट रीसेट','धीमी साँस, ग्राउंडिंग, स्ट्रेचिंग या छोटी सैर के लिए दस मिनट रखें।'],['एक माँग हटाएँ','एक गैर-जरूरी काम टालें, सौंपें, छोटा करें या मना करें और समय आराम में लगाएँ।'],['सीमा की बात कहें','कहें: “मैं ___ में मदद कर सकता/सकती हूँ, पर ___ तक ___ नहीं कर सकता/सकती। दूसरा तरीका चुनें?”'],['शरीर का सहारा दें','आज उचित नींद समय, नियमित भोजन, पानी या हल्की गतिविधि चुनें।'],['जानबूझकर जुड़ें','भरोसेमंद व्यक्ति को बताएँ कि सुनना, व्यावहारिक मदद या साथ में से क्या चाहिए।'],['बिना निर्णय समीक्षा','जो काम आया उसे रखें, बाकी बदलें और अगले सप्ताह दोहराने के लिए एक काम चुनें।']],focusAction:{work:'अतिरिक्त: 25 मिनट के लिए सूचनाएँ बंद करें।',relationship:'अतिरिक्त: एक तथ्य, एक भावना और एक अनुरोध बताएँ।',health:'अतिरिक्त: जरूरत हो तो पेशेवर के लिए लक्षण और प्रश्न लिखें।',finance:'अतिरिक्त: एक बैलेंस या बिल 10 मिनट देखें और रुकें।',daily:'अतिरिक्त: आज केवल तीन जरूरी काम लिखें।'},day:'दिन'
        },
        id: {
            skip:'Ke rencana',back:'← Kembali ke cek stres',language:'Bahasa',eyebrow:'LEMBAR KERJA INTERAKTIF PRIBADI',title:'Rencana Reset Stres 7 Hari',subtitle:'Pilih area tekanan yang perlu ditangani lebih dulu. Centang hanya tersimpan di browser ini.',privacy:'Tanpa akun · jawaban tidak diunggah · dapat diedit',customize:'Sesuaikan rencana',focusLabel:'Area tekanan utama',levelLabel:'Beban saat ini',progress:'Kemajuan',smallSteps:'LANGKAH KECIL, BUKAN MINGGU SEMPURNA',weekTitle:'Tujuh hari ke depan',reset:'Atur ulang',ad:'Iklan',keepTitle:'Simpan rencana di tempat yang akan digunakan',keepCopy:'Salin, cetak, atau tandai halaman ini. Kemajuan tersimpan secara lokal.',copy:'Salin rencana',print:'Cetak',copied:'Rencana disalin.',whyTitle:'Mengapa rencana ini sengaja kecil',whyCopy:'Tindakan spesifik dan singkat lebih mudah dilakukan. Lembar ini menggabungkan rutinitas, grounding, gerak, koneksi, dan tinjauan; bukan diagnosis atau perawatan.',whoSource:'WHO: Doing What Matters in Times of Stress',cdcSource:'CDC: Mengelola Stres',safetyTitle:'Saat lembar kerja tidak cukup',safetyCopy:'Jika stres berat, menetap, mengganggu fungsi harian, atau Anda merasa tidak aman, hubungi tenaga kesehatan berkualifikasi atau layanan darurat lokal. Ini swabantu edukatif, bukan nasihat medis.',privacyPolicy:'Privasi',moreTools:'Alat lainnya',focus:{work:'Kerja atau belajar',relationship:'Hubungan',health:'Kesehatan dan energi',finance:'Keuangan',daily:'Beban harian'},focusSummary:{work:'Lindungi satu blok fokus dan kurangi satu tuntutan yang bisa dihindari.',relationship:'Kurangi tekanan dengan percakapan jelas dan berbatas waktu.',health:'Mulai dari dasar pemulihan dan cari bantuan profesional bila perlu.',finance:'Ubah kekhawatiran samar menjadi pemeriksaan fakta singkat.',daily:'Perkecil daftar dan buat waktu pemulihan berulang.'},level:{veryLow:'Ringan',low:'Terkelola',moderate:'Sedang',high:'Tinggi',veryHigh:'Sangat tinggi'},days:[['Beri nama tekanan','Tulis: “Tekanan utama hari ini adalah…” lalu pilih bagian terkecil yang dapat dipengaruhi.'],['Reset 10 menit','Jadwalkan sepuluh menit untuk napas pelan, grounding, peregangan, atau jalan singkat.'],['Hapus satu tuntutan','Tunda, delegasikan, pendekkan, atau tolak satu tugas non-esensial dan gunakan waktu untuk pulih.'],['Gunakan batas','Coba: “Saya bisa membantu ___, tetapi tidak bisa ___ sebelum ___. Bisakah kita pilih rencana lain?”'],['Dukung tubuh','Pilih waktu tidur realistis, makan teratur, pengingat minum, atau gerak ringan hari ini.'],['Terhubung dengan sengaja','Beri tahu orang tepercaya apakah Anda perlu didengar, bantuan praktis, atau ditemani.'],['Tinjau tanpa menghakimi','Pertahankan yang membantu, ubah yang tidak, dan pilih satu tindakan untuk minggu depan.']],focusAction:{work:'Tambahan: matikan notifikasi selama 25 menit fokus.',relationship:'Tambahan: sampaikan satu fakta, satu perasaan, dan satu permintaan.',health:'Tambahan: catat gejala dan pertanyaan untuk tenaga profesional.',finance:'Tambahan: cek satu saldo atau tagihan selama 10 menit lalu berhenti.',daily:'Tambahan: tulis hanya tiga tugas wajib hari ini.'},day:'HARI'
        },
        tr: {
            skip:'Plana geç',back:'← Stres kontrolüne dön',language:'Dil',eyebrow:'ÖZEL ETKİLEŞİMLİ ÇALIŞMA SAYFASI',title:'7 Günlük Stres Sıfırlama Planın',subtitle:'Önce ilgilenmen gereken baskı alanını seç. İşaretler yalnızca bu tarayıcıda kalır.',privacy:'Hesap yok · cevap yüklenmez · düzenlenebilir',customize:'Planı özelleştir',focusLabel:'Ana baskı alanı',levelLabel:'Mevcut yük',progress:'İlerleme',smallSteps:'MÜKEMMEL HAFTA DEĞİL, KÜÇÜK ADIMLAR',weekTitle:'Önündeki yedi gün',reset:'Sıfırla',ad:'Reklam',keepTitle:'Planı kullanacağın yerde tut',keepCopy:'Kopyala, yazdır veya sayfayı kaydet. İlerleme yerel olarak saklanır.',copy:'Planı kopyala',print:'Yazdır',copied:'Plan kopyalandı.',whyTitle:'Plan neden özellikle küçük',whyCopy:'Belirli ve kısa eylemleri uygulamak daha kolaydır. Bu sayfa rutin, topraklanma, hareket, bağ ve gözden geçirmeyi birleştirir; tanı veya tedavi sağlamaz.',whoSource:'DSÖ: Stres Zamanlarında Önemli Olanı Yapmak',cdcSource:'CDC: Stresi Yönetmek',safetyTitle:'Çalışma sayfası yetmediğinde',safetyCopy:'Stres ağır, kalıcı, günlük işlevi etkileyen düzeydeyse veya güvende hissetmiyorsan nitelikli bir sağlık uzmanına ya da yerel acil servise başvur. Bu eğitim amaçlı öz yardımdır, tıbbi tavsiye değildir.',privacyPolicy:'Gizlilik',moreTools:'Diğer araçlar',focus:{work:'İş veya eğitim',relationship:'İlişkiler',health:'Sağlık ve enerji',finance:'Finans',daily:'Günlük aşırı yük'},focusSummary:{work:'Bir odak bloğunu koru ve önlenebilir bir talebi azalt.',relationship:'Açık ve süreli bir konuşmayla baskıyı azalt.',health:'Temel toparlanmayla başla, gerektiğinde profesyonel destek al.',finance:'Belirsiz para kaygısını kısa bir bilgi kontrolüne çevir.',daily:'Listeyi küçült ve tekrarlanabilir dinlenme alanı oluştur.'},level:{veryLow:'Hafif',low:'Yönetilebilir',moderate:'Orta',high:'Yüksek',veryHigh:'Çok yüksek'},days:[['Baskıyı adlandır','“Bugünkü ana baskı…” diye yaz ve etkileyebileceğin en küçük parçayı seç.'],['10 dakikalık sıfırlama','Yavaş nefes, topraklanma, esneme veya kısa yürüyüş için on dakika ayır.'],['Bir talebi kaldır','Gerekli olmayan bir işi ertele, devret, kısalt veya reddet; zamanı toparlanmaya ayır.'],['Sınır cümlesi kullan','“___ konusunda yardımcı olabilirim ama ___ tarihine kadar ___ yapamam. Başka plan seçelim mi?” de.'],['Bedeni destekle','Gerçekçi uyku saati, düzenli öğün, su hatırlatıcısı veya hafif hareket seç.'],['Amaçlı bağlantı kur','Güvendiğin birine dinlenmeye, pratik yardıma veya eşliğe ihtiyacın olduğunu söyle.'],['Yargılamadan gözden geçir','Yararlı olanı koru, olmayanı değiştir ve gelecek hafta tekrarlanacak bir eylem seç.']],focusAction:{work:'Ek: 25 dakika bildirimleri kapat.',relationship:'Ek: bir gözlem, bir duygu ve bir istek söyle.',health:'Ek: gerekirse uzman için belirtileri ve soruları yaz.',finance:'Ek: bir bakiye veya faturayı 10 dakika incele ve bırak.',daily:'Ek: bugün sadece üç zorunlu iş yaz.'},day:'GÜN'
        }
    };

    const fallback = translations.en;
    const t = key => translations[language]?.[key] ?? fallback[key] ?? key;
    const focusKeys = ['work', 'relationship', 'health', 'finance', 'daily'];
    const levelKeys = ['veryLow', 'low', 'moderate', 'high', 'veryHigh'];
    let focus = focusKeys.includes(query.get('focus')) ? query.get('focus') : 'daily';
    let level = levelKeys.includes(query.get('level')) ? query.get('level') : 'moderate';

    const storageKey = () => `stress-plan:${focus}:${level}`;
    const getChecks = () => {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey()) || '[]');
            return Array.isArray(saved) ? saved : [];
        } catch (_) {
            return [];
        }
    };

    const track = (eventName, params = {}) => {
        if (typeof gtag !== 'function') return;
        gtag('event', eventName, Object.assign({
            app_name: 'stress-check',
            content_group: 'stress_plan',
            plan_language: language,
            plan_focus: focus,
            plan_level: level
        }, params));
    };

    function translateStatic() {
        document.documentElement.lang = language;
        document.querySelectorAll('[data-t]').forEach(node => {
            node.textContent = t(node.dataset.t);
        });
        document.title = `${t('title')} | DopaBrain`;
        document.querySelector('meta[name="description"]').content = t('subtitle');
        document.getElementById('language-select').value = language;
        document.getElementById('back-link').href = `./?lang=${language}`;
    }

    function fillSelects() {
        const focusSelect = document.getElementById('focus-select');
        const levelSelect = document.getElementById('level-select');
        focusSelect.innerHTML = focusKeys.map(key => `<option value="${key}">${t('focus')[key]}</option>`).join('');
        levelSelect.innerHTML = levelKeys.map(key => `<option value="${key}">${t('level')[key]}</option>`).join('');
        focusSelect.value = focus;
        levelSelect.value = level;
    }

    function renderPlan() {
        const checks = getChecks();
        const days = t('days');
        document.getElementById('focus-summary').textContent = t('focusSummary')[focus];
        document.getElementById('day-grid').innerHTML = days.map((day, index) => {
            const detail = index === 0 ? `${day[1]} ${t('focusAction')[focus]}` : day[1];
            const checked = checks.includes(index);
            return `<label class="day-card${checked ? ' done' : ''}">
                <input type="checkbox" data-day="${index}" ${checked ? 'checked' : ''}>
                <span>
                    <span class="day-number">${t('day')} ${index + 1}</span>
                    <h3>${day[0]}</h3>
                    <p>${detail}</p>
                </span>
            </label>`;
        }).join('');
        updateProgress();
    }

    function updateProgress() {
        const checked = [...document.querySelectorAll('.day-card input:checked')];
        document.getElementById('progress-count').textContent = `${checked.length} / 7`;
        document.getElementById('progress-fill').style.width = `${checked.length / 7 * 100}%`;
        document.querySelector('.progress-track').setAttribute('aria-valuenow', String(checked.length));
        document.querySelectorAll('.day-card').forEach(card => {
            card.classList.toggle('done', card.querySelector('input').checked);
        });
    }

    function saveChecks() {
        const checked = [...document.querySelectorAll('.day-card input:checked')].map(input => Number(input.dataset.day));
        localStorage.setItem(storageKey(), JSON.stringify(checked));
        updateProgress();
    }

    function plainTextPlan() {
        const days = t('days');
        return [
            t('title'),
            `${t('focusLabel')}: ${t('focus')[focus]}`,
            `${t('levelLabel')}: ${t('level')[level]}`,
            '',
            ...days.map((day, index) => `${index + 1}. ${day[0]} — ${index === 0 ? `${day[1]} ${t('focusAction')[focus]}` : day[1]}`),
            '',
            t('safetyCopy'),
            'https://dopabrain.com/stress-check/plan.html'
        ].join('\n');
    }

    async function copyPlan() {
        const text = plainTextPlan();
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
        document.getElementById('status-message').textContent = t('copied');
        track('stress_plan_copy', { completed_days: getChecks().length });
    }

    function updateQuery() {
        const next = new URL(location.href);
        next.searchParams.set('lang', language);
        next.searchParams.set('focus', focus);
        next.searchParams.set('level', level);
        history.replaceState({}, '', next);
    }

    function init() {
        translateStatic();
        fillSelects();
        renderPlan();
        updateQuery();

        document.getElementById('language-select').addEventListener('change', event => {
            language = supported.includes(event.target.value) ? event.target.value : 'en';
            localStorage.setItem('preferredLanguage', language);
            translateStatic();
            fillSelects();
            renderPlan();
            updateQuery();
            track('stress_plan_language_change');
        });
        document.getElementById('focus-select').addEventListener('change', event => {
            focus = event.target.value;
            renderPlan();
            updateQuery();
            track('stress_plan_customize', { customize_field: 'focus' });
        });
        document.getElementById('level-select').addEventListener('change', event => {
            level = event.target.value;
            renderPlan();
            updateQuery();
            track('stress_plan_customize', { customize_field: 'level' });
        });
        document.getElementById('day-grid').addEventListener('change', event => {
            if (!event.target.matches('input[data-day]')) return;
            saveChecks();
            track('stress_plan_day_check', {
                plan_day: Number(event.target.dataset.day) + 1,
                checked: event.target.checked ? 'yes' : 'no'
            });
        });
        document.getElementById('reset-button').addEventListener('click', () => {
            localStorage.removeItem(storageKey());
            renderPlan();
            track('stress_plan_reset');
        });
        document.getElementById('copy-button').addEventListener('click', copyPlan);
        document.getElementById('print-button').addEventListener('click', () => {
            track('stress_plan_print', { completed_days: getChecks().length });
            window.print();
        });
        document.getElementById('back-link').addEventListener('click', () => track('stress_plan_return'));

        const ad = document.querySelector('[data-ad-surface]');
        if (ad && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver(entries => {
                if (!entries.some(entry => entry.isIntersecting)) return;
                track('stress_plan_ad_impression', { ad_surface: ad.dataset.adSurface });
                observer.disconnect();
            }, { threshold: 0.2 });
            observer.observe(ad);
        }
        track('stress_plan_view', { entry_source: query.get('source') || 'direct' });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
