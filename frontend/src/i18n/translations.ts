export type LangCode = 'ru' | 'en' | 'ky' | 'de' | 'fr' | 'zh' | 'ar'

export interface Translations {
  nav: {
    chatbot: string
    photoAnalysis: string
    scoring: string
    login: string
    register: string
    logout: string
    profile: string
  }
  home: {
    badge: string
    headline1: string
    headline2: string
    subline: string
    ctaPrimary: string
    ctaSecondary: string
    stat1val: string
    stat1label: string
    stat2val: string
    stat2label: string
    stat3val: string
    stat3label: string
    featuresTitle: string
    feat1title: string
    feat1desc: string
    feat2title: string
    feat2desc: string
    feat3title: string
    feat3desc: string
  }
  scoring: {
    title: string
    subtitle: string
    tabEmployee: string
    tabClient: string
    fields: {
      age: string
      income: string
      employment: string
      loanAmount: string
      loanTerm: string
      interestRate: string
      pastDue: string
      inquiries: string
      fullName: string
      phone: string
      email: string
      purpose: string
    }
    submit: string
    loading: string
    resultTitle: string
    approved: string
    rejected: string
    review: string
    probability: string
    riskLabel: string
    factorsTitle: string
  }
  chatbot: {
    title: string
    subtitle: string
    placeholder: string
    send: string
    welcome: string
  }
  photo: {
    title: string
    subtitle: string
    upload: string
    analyze: string
    drag: string
  }
  auth: {
    loginTitle: string
    registerTitle: string
    email: string
    password: string
    loginBtn: string
    registerBtn: string
    noAccount: string
    register: string
    orContinue: string
  }
  footer: {
    tagline: string
    product: string
    company: string
    legal: string
    rights: string
  }
}

const ru: Translations = {
  nav: {
    chatbot: 'Чат-консультант',
    photoAnalysis: 'Анализ по фото',
    scoring: 'Кредитный скоринг',
    login: 'Вход',
    register: 'Регистрация',
    logout: 'Выйти',
    profile: 'Профиль',
  },
  home: {
    badge: 'ИИ-скоринг нового поколения',
    headline1: 'Умный анализ',
    headline2: 'кредитных рисков',
    subline: 'Мгновенная оценка заёмщика за секунды. Ансамблевые ML-модели, объяснимый ИИ и понятный интерфейс для специалистов и клиентов.',
    ctaPrimary: 'Начать оценку',
    ctaSecondary: 'Смотреть демо',
    stat1val: '99.2%',
    stat1label: 'Точность модели',
    stat2val: '<1с',
    stat2label: 'Время ответа',
    stat3val: '7',
    stat3label: 'Языков интерфейса',
    featuresTitle: 'Всё необходимое в одном месте',
    feat1title: 'Скоринг по форме',
    feat1desc: 'Два режима: для банковского сотрудника с полной анкетой и для клиента с упрощённым вводом.',
    feat2title: 'Чат-консультант',
    feat2desc: 'ИИ отвечает на вопросы о кредитах, ставках и условиях на любом из 7 языков.',
    feat3title: 'Анализ документов',
    feat3desc: 'Загрузите фото паспорта или справки — система автоматически извлечёт данные.',
  },
  scoring: {
    title: 'Кредитный скоринг',
    subtitle: 'Выберите режим заполнения анкеты',
    tabEmployee: 'Режим сотрудника',
    tabClient: 'Режим клиента',
    fields: {
      age: 'Возраст',
      income: 'Ежемесячный доход',
      employment: 'Стаж работы (лет)',
      loanAmount: 'Сумма займа',
      loanTerm: 'Срок займа (мес)',
      interestRate: 'Процентная ставка',
      pastDue: 'Просрочки 30+ дней',
      inquiries: 'Запросов в бюро (6 мес)',
      fullName: 'ФИО заявителя',
      phone: 'Телефон',
      email: 'Email',
      purpose: 'Цель займа',
    },
    submit: 'Рассчитать скоринг',
    loading: 'Анализирую данные...',
    resultTitle: 'Результат скоринга',
    approved: 'Одобрено',
    rejected: 'Отказ',
    review: 'На проверке',
    probability: 'Вероятность дефолта',
    riskLabel: 'Уровень риска',
    factorsTitle: 'Ключевые факторы',
  },
  chatbot: {
    title: 'Чат-консультант',
    subtitle: 'Задайте вопрос о кредитных продуктах',
    placeholder: 'Напишите сообщение...',
    send: 'Отправить',
    welcome: 'Здравствуйте! Я ваш ИИ-консультант. Чем могу помочь?',
  },
  photo: {
    title: 'Анализ по фото',
    subtitle: 'Загрузите документ для автоматического распознавания',
    upload: 'Загрузить фото',
    analyze: 'Анализировать',
    drag: 'Перетащите файл или нажмите для загрузки',
  },
  auth: {
    loginTitle: 'Вход',
    registerTitle: 'Регистрация',
    email: 'Email',
    password: 'Пароль',
    loginBtn: 'Войти',
    registerBtn: 'Зарегистрироваться',
    noAccount: 'Нет аккаунта?',
    register: 'Зарегистрироваться',
    orContinue: 'или продолжить как гость',
  },
  footer: {
    tagline: 'Интеллектуальный кредитный скоринг',
    product: 'Продукт',
    company: 'Компания',
    legal: 'Правовая информация',
    rights: '© 2025 CreditScore AI. Все права защищены.',
  },
}

const en: Translations = {
  nav: {
    chatbot: 'Chat Advisor',
    photoAnalysis: 'Photo Analysis',
    scoring: 'Credit Scoring',
    login: 'Sign In',
    register: 'Sign Up',
    logout: 'Sign Out',
    profile: 'Profile',
  },
  home: {
    badge: 'Next-gen AI Scoring',
    headline1: 'Intelligent analysis',
    headline2: 'of credit risks',
    subline: 'Instant borrower assessment in seconds. Ensemble ML models, explainable AI and a clear interface for specialists and clients.',
    ctaPrimary: 'Start Assessment',
    ctaSecondary: 'Watch Demo',
    stat1val: '99.2%',
    stat1label: 'Model Accuracy',
    stat2val: '<1s',
    stat2label: 'Response Time',
    stat3val: '7',
    stat3label: 'Languages',
    featuresTitle: 'Everything you need in one place',
    feat1title: 'Form-based Scoring',
    feat1desc: 'Two modes: full employee questionnaire and simplified client input.',
    feat2title: 'Chat Advisor',
    feat2desc: 'AI answers questions about loans, rates and terms in any of 7 languages.',
    feat3title: 'Document Analysis',
    feat3desc: 'Upload a passport or certificate photo — the system extracts data automatically.',
  },
  scoring: {
    title: 'Credit Scoring',
    subtitle: 'Choose form mode',
    tabEmployee: 'Employee Mode',
    tabClient: 'Client Mode',
    fields: {
      age: 'Age',
      income: 'Monthly Income',
      employment: 'Employment Years',
      loanAmount: 'Loan Amount',
      loanTerm: 'Loan Term (months)',
      interestRate: 'Interest Rate',
      pastDue: 'Past Due 30+ days',
      inquiries: 'Bureau Inquiries (6m)',
      fullName: 'Full Name',
      phone: 'Phone',
      email: 'Email',
      purpose: 'Loan Purpose',
    },
    submit: 'Calculate Score',
    loading: 'Analyzing data...',
    resultTitle: 'Scoring Result',
    approved: 'Approved',
    rejected: 'Rejected',
    review: 'Under Review',
    probability: 'Default Probability',
    riskLabel: 'Risk Level',
    factorsTitle: 'Key Factors',
  },
  chatbot: {
    title: 'Chat Advisor',
    subtitle: 'Ask a question about credit products',
    placeholder: 'Type a message...',
    send: 'Send',
    welcome: 'Hello! I am your AI advisor. How can I help you?',
  },
  photo: {
    title: 'Photo Analysis',
    subtitle: 'Upload a document for automatic recognition',
    upload: 'Upload Photo',
    analyze: 'Analyze',
    drag: 'Drag a file or click to upload',
  },
  auth: {
    loginTitle: 'Sign In',
    registerTitle: 'Sign Up',
    email: 'Email',
    password: 'Password',
    loginBtn: 'Sign In',
    registerBtn: 'Sign Up',
    noAccount: "Don't have an account?",
    register: 'Register',
    orContinue: 'or continue as guest',
  },
  footer: {
    tagline: 'Intelligent credit scoring',
    product: 'Product',
    company: 'Company',
    legal: 'Legal',
    rights: '© 2025 CreditScore AI. All rights reserved.',
  },
}

const ky: Translations = {
  nav: {
    chatbot: 'Чат-кеңешчи',
    photoAnalysis: 'Сүрөт талдоо',
    scoring: 'Кредит скоринг',
    login: 'Кирүү',
    register: 'Катталуу',
    logout: 'Чыгуу',
    profile: 'Профиль',
  },
  home: {
    badge: 'Жаңы муун AI скоринг',
    headline1: 'Акылдуу талдоо',
    headline2: 'кредиттик тобокелдиктер',
    subline: 'Секунданын ичинде ыкчам баалоо. Ансамбль ML-моделдер жана жеткиликтүү интерфейс.',
    ctaPrimary: 'Баалоону баштоо',
    ctaSecondary: 'Демо көрүү',
    stat1val: '99.2%',
    stat1label: 'Моделдин тактыгы',
    stat2val: '<1с',
    stat2label: 'Жооп убактысы',
    stat3val: '7',
    stat3label: 'Тилдер',
    featuresTitle: 'Бардыгы бир жерде',
    feat1title: 'Форма боюнча скоринг',
    feat1desc: 'Эки режим: кызматкерлер үчүн жана кардарлар үчүн.',
    feat2title: 'Чат-кеңешчи',
    feat2desc: 'AI кредиттер жөнүндө суроолорго 7 тилде жооп берет.',
    feat3title: 'Документ талдоо',
    feat3desc: 'Паспорттун сүрөтүн жүктөп коюңуз — система маалыматтарды автоматтык түрдө чыгарат.',
  },
  scoring: {
    title: 'Кредит скоринг',
    subtitle: 'Форма режимин тандаңыз',
    tabEmployee: 'Кызматкер режими',
    tabClient: 'Кардар режими',
    fields: {
      age: 'Жашы',
      income: 'Айлык киреше',
      employment: 'Иш стажы (жыл)',
      loanAmount: 'Кредит суммасы',
      loanTerm: 'Кредит мөөнөтү (ай)',
      interestRate: 'Пайыз ставкасы',
      pastDue: 'Мерзими өткөн 30+ күн',
      inquiries: 'Бюро суроо-талаптары (6 ай)',
      fullName: 'Толук аты',
      phone: 'Телефон',
      email: 'Email',
      purpose: 'Кредиттин максаты',
    },
    submit: 'Скорингди эсептөө',
    loading: 'Маалыматтарды талдоо...',
    resultTitle: 'Скоринг натыйжасы',
    approved: 'Бекитилди',
    rejected: 'Баш тартылды',
    review: 'Карап жатат',
    probability: 'Дефолт ыктымалдуулугу',
    riskLabel: 'Тобокелдик деңгээли',
    factorsTitle: 'Негизги факторлор',
  },
  chatbot: {
    title: 'Чат-кеңешчи',
    subtitle: 'Кредит продукттары жөнүндө суроо бериңиз',
    placeholder: 'Билдирүү жазыңыз...',
    send: 'Жөнөтүү',
    welcome: 'Саламатсызбы! Мен сиздин AI-кеңешчиңизмин. Кандай жардам керек?',
  },
  photo: {
    title: 'Сүрөт талдоо',
    subtitle: 'Автоматтык таанып билүү үчүн документти жүктөңүз',
    upload: 'Сүрөт жүктөө',
    analyze: 'Талдоо',
    drag: 'Файлды сүйрөңүз же жүктөө үчүн басыңыз',
  },
  auth: {
    loginTitle: 'Кош келиңиз',
    registerTitle: 'Катталуу',
    email: 'Email',
    password: 'Сырсөз',
    loginBtn: 'Кирүү',
    registerBtn: 'Катталуу',
    noAccount: 'Аккаунтуңуз жокпу?',
    register: 'Катталуу',
    orContinue: 'же конок катары улантуу',
  },
  footer: {
    tagline: 'Акылдуу кредиттик скоринг',
    product: 'Продукт',
    company: 'Компания',
    legal: 'Укуктук маалымат',
    rights: '© 2025 CreditScore AI. Бардык укуктар корголгон.',
  },
}

const de: Translations = {
  nav: {
    chatbot: 'Chat-Berater',
    photoAnalysis: 'Fotoanalyse',
    scoring: 'Kredit-Scoring',
    login: 'Anmelden',
    register: 'Registrieren',
    logout: 'Abmelden',
    profile: 'Profil',
  },
  home: {
    badge: 'KI-Scoring der nächsten Generation',
    headline1: 'Intelligente Analyse',
    headline2: 'von Kreditrisiken',
    subline: 'Sofortige Kreditnehmerbewertung in Sekunden. Ensemble-ML-Modelle, erklärbares KI und klare Benutzeroberfläche.',
    ctaPrimary: 'Bewertung starten',
    ctaSecondary: 'Demo ansehen',
    stat1val: '99,2%',
    stat1label: 'Modellgenauigkeit',
    stat2val: '<1s',
    stat2label: 'Antwortzeit',
    stat3val: '7',
    stat3label: 'Sprachen',
    featuresTitle: 'Alles an einem Ort',
    feat1title: 'Formularbasiertes Scoring',
    feat1desc: 'Zwei Modi: vollständiger Mitarbeiterfragebogen und vereinfachte Kundeneingabe.',
    feat2title: 'Chat-Berater',
    feat2desc: 'KI beantwortet Fragen zu Krediten, Zinssätzen und Konditionen in 7 Sprachen.',
    feat3title: 'Dokumentenanalyse',
    feat3desc: 'Laden Sie ein Reisepass- oder Bescheinigungsfoto hoch — das System extrahiert die Daten automatisch.',
  },
  scoring: {
    title: 'Kredit-Scoring',
    subtitle: 'Formularmodus auswählen',
    tabEmployee: 'Mitarbeitermodus',
    tabClient: 'Kundenmodus',
    fields: {
      age: 'Alter',
      income: 'Monatliches Einkommen',
      employment: 'Beschäftigungsjahre',
      loanAmount: 'Kreditbetrag',
      loanTerm: 'Kreditlaufzeit (Monate)',
      interestRate: 'Zinssatz',
      pastDue: 'Überfällig 30+ Tage',
      inquiries: 'Kreditanfragen (6 Mon)',
      fullName: 'Vollständiger Name',
      phone: 'Telefon',
      email: 'E-Mail',
      purpose: 'Kreditzweck',
    },
    submit: 'Score berechnen',
    loading: 'Daten werden analysiert...',
    resultTitle: 'Scoring-Ergebnis',
    approved: 'Genehmigt',
    rejected: 'Abgelehnt',
    review: 'In Prüfung',
    probability: 'Ausfallwahrscheinlichkeit',
    riskLabel: 'Risikoniveau',
    factorsTitle: 'Schlüsselfaktoren',
  },
  chatbot: {
    title: 'Chat-Berater',
    subtitle: 'Fragen Sie zu Kreditprodukten',
    placeholder: 'Nachricht eingeben...',
    send: 'Senden',
    welcome: 'Hallo! Ich bin Ihr KI-Berater. Wie kann ich helfen?',
  },
  photo: {
    title: 'Fotoanalyse',
    subtitle: 'Dokument zur automatischen Erkennung hochladen',
    upload: 'Foto hochladen',
    analyze: 'Analysieren',
    drag: 'Datei ziehen oder klicken zum Hochladen',
  },
  auth: {
    loginTitle: 'Willkommen zurück',
    registerTitle: 'Registrieren',
    email: 'E-Mail',
    password: 'Passwort',
    loginBtn: 'Anmelden',
    registerBtn: 'Registrieren',
    noAccount: 'Kein Konto?',
    register: 'Registrieren',
    orContinue: 'oder als Gast fortfahren',
  },
  footer: {
    tagline: 'Intelligentes Kredit-Scoring',
    product: 'Produkt',
    company: 'Unternehmen',
    legal: 'Rechtliches',
    rights: '© 2025 CreditScore AI. Alle Rechte vorbehalten.',
  },
}

const fr: Translations = {
  nav: {
    chatbot: 'Conseiller Chat',
    photoAnalysis: 'Analyse Photo',
    scoring: 'Scoring Crédit',
    login: 'Connexion',
    register: "S'inscrire",
    logout: 'Déconnexion',
    profile: 'Profil',
  },
  home: {
    badge: "Scoring IA de nouvelle génération",
    headline1: 'Analyse intelligente',
    headline2: 'des risques crédit',
    subline: "Évaluation instantanée de l'emprunteur en quelques secondes. Modèles ML ensemblistes et interface claire.",
    ctaPrimary: "Démarrer l'évaluation",
    ctaSecondary: 'Voir la démo',
    stat1val: '99,2%',
    stat1label: 'Précision du modèle',
    stat2val: '<1s',
    stat2label: 'Temps de réponse',
    stat3val: '7',
    stat3label: 'Langues',
    featuresTitle: 'Tout ce dont vous avez besoin',
    feat1title: 'Scoring par formulaire',
    feat1desc: 'Deux modes : questionnaire complet pour employé et saisie simplifiée pour client.',
    feat2title: 'Conseiller Chat',
    feat2desc: "L'IA répond aux questions sur les crédits en 7 langues.",
    feat3title: 'Analyse de documents',
    feat3desc: 'Téléchargez une photo de passeport — le système extrait automatiquement les données.',
  },
  scoring: {
    title: 'Scoring Crédit',
    subtitle: 'Choisissez le mode de saisie',
    tabEmployee: 'Mode Employé',
    tabClient: 'Mode Client',
    fields: {
      age: 'Âge',
      income: 'Revenu mensuel',
      employment: "Années d'expérience",
      loanAmount: 'Montant du prêt',
      loanTerm: 'Durée du prêt (mois)',
      interestRate: "Taux d'intérêt",
      pastDue: 'Retards 30+ jours',
      inquiries: 'Demandes bureau (6 mois)',
      fullName: 'Nom complet',
      phone: 'Téléphone',
      email: 'Email',
      purpose: 'Objet du prêt',
    },
    submit: 'Calculer le score',
    loading: 'Analyse en cours...',
    resultTitle: 'Résultat du scoring',
    approved: 'Approuvé',
    rejected: 'Refusé',
    review: 'En révision',
    probability: 'Probabilité de défaut',
    riskLabel: 'Niveau de risque',
    factorsTitle: 'Facteurs clés',
  },
  chatbot: {
    title: 'Conseiller Chat',
    subtitle: 'Posez une question sur les produits crédit',
    placeholder: 'Tapez un message...',
    send: 'Envoyer',
    welcome: 'Bonjour ! Je suis votre conseiller IA. Comment puis-je vous aider ?',
  },
  photo: {
    title: 'Analyse Photo',
    subtitle: 'Téléchargez un document pour la reconnaissance automatique',
    upload: 'Télécharger photo',
    analyze: 'Analyser',
    drag: 'Glissez un fichier ou cliquez pour télécharger',
  },
  auth: {
    loginTitle: 'Bon retour',
    registerTitle: "S'inscrire",
    email: 'Email',
    password: 'Mot de passe',
    loginBtn: 'Se connecter',
    registerBtn: "S'inscrire",
    noAccount: 'Pas de compte ?',
    register: "S'inscrire",
    orContinue: "ou continuer en tant qu'invité",
  },
  footer: {
    tagline: 'Scoring crédit intelligent',
    product: 'Produit',
    company: 'Entreprise',
    legal: 'Mentions légales',
    rights: '© 2025 CreditScore AI. Tous droits réservés.',
  },
}

const zh: Translations = {
  nav: {
    chatbot: '智能客服',
    photoAnalysis: '照片分析',
    scoring: '信用评分',
    login: '登录',
    register: '注册',
    logout: '退出',
    profile: '个人资料',
  },
  home: {
    badge: '下一代AI信用评分',
    headline1: '智能分析',
    headline2: '信用风险',
    subline: '秒级借款人评估。集成ML模型、可解释AI和清晰界面。',
    ctaPrimary: '开始评估',
    ctaSecondary: '观看演示',
    stat1val: '99.2%',
    stat1label: '模型准确率',
    stat2val: '<1秒',
    stat2label: '响应时间',
    stat3val: '7',
    stat3label: '支持语言',
    featuresTitle: '一站式解决方案',
    feat1title: '表单评分',
    feat1desc: '两种模式：员工完整问卷和客户简化输入。',
    feat2title: '智能客服',
    feat2desc: 'AI用7种语言回答关于贷款的问题。',
    feat3title: '文件分析',
    feat3desc: '上传护照或证明照片，系统自动提取数据。',
  },
  scoring: {
    title: '信用评分',
    subtitle: '选择表单模式',
    tabEmployee: '员工模式',
    tabClient: '客户模式',
    fields: {
      age: '年龄',
      income: '月收入',
      employment: '工作年限',
      loanAmount: '贷款金额',
      loanTerm: '贷款期限（月）',
      interestRate: '利率',
      pastDue: '逾期30+天',
      inquiries: '征信查询（6月）',
      fullName: '姓名',
      phone: '电话',
      email: '邮箱',
      purpose: '贷款用途',
    },
    submit: '计算评分',
    loading: '分析数据中...',
    resultTitle: '评分结果',
    approved: '已批准',
    rejected: '已拒绝',
    review: '审核中',
    probability: '违约概率',
    riskLabel: '风险等级',
    factorsTitle: '关键因素',
  },
  chatbot: {
    title: '智能客服',
    subtitle: '询问信用产品问题',
    placeholder: '输入消息...',
    send: '发送',
    welcome: '您好！我是您的AI顾问。有什么可以帮您？',
  },
  photo: {
    title: '照片分析',
    subtitle: '上传文件进行自动识别',
    upload: '上传照片',
    analyze: '分析',
    drag: '拖拽文件或点击上传',
  },
  auth: {
    loginTitle: '欢迎回来',
    registerTitle: '注册',
    email: '邮箱',
    password: '密码',
    loginBtn: '登录',
    registerBtn: '注册',
    noAccount: '没有账号？',
    register: '注册',
    orContinue: '或以访客身份继续',
  },
  footer: {
    tagline: '智能信用评分',
    product: '产品',
    company: '公司',
    legal: '法律信息',
    rights: '© 2025 CreditScore AI. 保留所有权利。',
  },
}

const ar: Translations = {
  nav: {
    chatbot: 'مستشار الدردشة',
    photoAnalysis: 'تحليل الصور',
    scoring: 'تسجيل الائتمان',
    login: 'تسجيل الدخول',
    register: 'تسجيل',
    logout: 'تسجيل الخروج',
    profile: 'الملف الشخصي',
  },
  home: {
    badge: 'تسجيل ائتماني بالذكاء الاصطناعي',
    headline1: 'تحليل ذكي',
    headline2: 'لمخاطر الائتمان',
    subline: 'تقييم فوري للمقترض في ثوانٍ. نماذج ML متكاملة وذكاء اصطناعي قابل للتفسير.',
    ctaPrimary: 'بدء التقييم',
    ctaSecondary: 'مشاهدة العرض',
    stat1val: '99.2%',
    stat1label: 'دقة النموذج',
    stat2val: '<1ث',
    stat2label: 'وقت الاستجابة',
    stat3val: '7',
    stat3label: 'لغات',
    featuresTitle: 'كل ما تحتاجه في مكان واحد',
    feat1title: 'التسجيل بالنموذج',
    feat1desc: 'وضعان: استبيان موظف كامل وإدخال مبسط للعميل.',
    feat2title: 'مستشار الدردشة',
    feat2desc: 'يجيب الذكاء الاصطناعي على أسئلة القروض بـ 7 لغات.',
    feat3title: 'تحليل المستندات',
    feat3desc: 'قم بتحميل صورة جواز السفر — يستخرج النظام البيانات تلقائياً.',
  },
  scoring: {
    title: 'تسجيل الائتمان',
    subtitle: 'اختر وضع النموذج',
    tabEmployee: 'وضع الموظف',
    tabClient: 'وضع العميل',
    fields: {
      age: 'العمر',
      income: 'الدخل الشهري',
      employment: 'سنوات الخبرة',
      loanAmount: 'مبلغ القرض',
      loanTerm: 'مدة القرض (أشهر)',
      interestRate: 'معدل الفائدة',
      pastDue: 'متأخرات 30+ يوم',
      inquiries: 'استعلامات المكتب (6 أشهر)',
      fullName: 'الاسم الكامل',
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      purpose: 'الغرض من القرض',
    },
    submit: 'احسب النقاط',
    loading: 'جاري تحليل البيانات...',
    resultTitle: 'نتيجة التسجيل',
    approved: 'موافق عليه',
    rejected: 'مرفوض',
    review: 'قيد المراجعة',
    probability: 'احتمالية التخلف',
    riskLabel: 'مستوى المخاطرة',
    factorsTitle: 'العوامل الرئيسية',
  },
  chatbot: {
    title: 'مستشار الدردشة',
    subtitle: 'اسأل عن منتجات الائتمان',
    placeholder: 'اكتب رسالة...',
    send: 'إرسال',
    welcome: 'مرحباً! أنا مستشارك بالذكاء الاصطناعي. كيف يمكنني مساعدتك؟',
  },
  photo: {
    title: 'تحليل الصور',
    subtitle: 'قم بتحميل مستند للتعرف التلقائي',
    upload: 'تحميل صورة',
    analyze: 'تحليل',
    drag: 'اسحب ملفاً أو انقر للتحميل',
  },
  auth: {
    loginTitle: 'مرحباً بعودتك',
    registerTitle: 'تسجيل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    loginBtn: 'تسجيل الدخول',
    registerBtn: 'تسجيل',
    noAccount: 'ليس لديك حساب؟',
    register: 'التسجيل',
    orContinue: 'أو المتابعة كضيف',
  },
  footer: {
    tagline: 'تسجيل ائتماني ذكي',
    product: 'المنتج',
    company: 'الشركة',
    legal: 'المعلومات القانونية',
    rights: '© 2025 CreditScore AI. جميع الحقوق محفوظة.',
  },
}

export const translations: Record<LangCode, Translations> = { ru, en, ky, de, fr, zh, ar }

export const LANGUAGES: { code: LangCode; label: string; flag: string; rtl?: boolean }[] = [
  { code: 'ru', label: 'Рус', flag: '🇷🇺' },
  { code: 'en', label: 'Eng', flag: '🇬🇧' },
  { code: 'ky', label: 'Кырг', flag: '🇰🇬' },
  { code: 'de', label: 'Deu', flag: '🇩🇪' },
  { code: 'fr', label: 'Fra', flag: '🇫🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ar', label: 'عربي', flag: '🇸🇦', rtl: true },
]