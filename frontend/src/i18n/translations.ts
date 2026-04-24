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
    stat1val: string
    stat1label: string
    stat2val: string
    stat2label: string
    stat3val: string
    stat3label: string
    featuresTitle: string
    feat1desc: string
    feat2desc: string
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
    purposeOptions: string[]
    submit: string
    loading: string
    resultTitle: string
    approved: string
    rejected: string
    review: string
    probability: string
    riskLabel: string
    factorsTitle: string
    fillForm: string
    pDefault: string
    riskFactors: string
    metrics: string
    lowRisk: string
    mediumRisk: string
    highRisk: string
    lowRiskDesc: string
    mediumRiskDesc: string
    highRiskDesc: string
  }
  chatbot: {
    title: string
    subtitle: string
    placeholder: string
    send: string
    welcome: string
    quickReplies: string[]
  }
  photo: {
    title: string
    subtitle: string
    upload: string
    analyze: string
    drag: string
    analyzing: string
    extracting: string
    extracted: string
    documentTypes: string[]
    docFields: {
      fullName: string
      birthDate: string
      documentNumber: string
      inn: string
      address: string
    }
    transfer: string
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
    loginSubtitle: string
    registerSubtitle: string
    confirmPassword: string
    fullName: string
    phone: string
    birthDate: string
    monthlyIncome: string
    employmentYears: string
    requiredFields: string
    passwordMismatch: string
    passwordTooShort: string
    loginError: string
    registerError: string
  }
  footer: {
    tagline: string
    product: string
    company: string
    legal: string
    rights: string
    about: string
    team: string
    contacts: string
    privacy: string
    terms: string
    licenses: string
  }
  common: {
    startNow: string
    freeDemo: string
    continueAsGuest: string
    enter: string
    registering: string
    calculate: string
    analyzing: string
    send: string
    typeMessage: string
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
    stat1val: '99.2%',
    stat1label: 'Точность модели',
    stat2val: '<1с',
    stat2label: 'Время ответа',
    stat3val: '7',
    stat3label: 'Языков интерфейса',
    featuresTitle: 'Всё необходимое в одном месте',
    feat1desc: 'Два режима: для банковского сотрудника с полной анкетой и для клиента с упрощённым вводом.',
    feat2desc: 'ИИ отвечает на вопросы о кредитах, ставках и условиях на любом из 7 языков.',
    feat3desc: 'Загрузите фото паспорта или справки — система автоматически извлечёт данные.',
  },
  scoring: {
    title: 'Кредитный скоринг',
    subtitle: 'Выберите режим заполнения анкеты',
    tabEmployee: 'Режим сотрудника',
    tabClient: 'Режим клиента',
    fields: {
      age: 'Возраст',
      income: 'Ежемесячный доход (₸)',
      employment: 'Стаж работы (лет)',
      loanAmount: 'Сумма займа (₸)',
      loanTerm: 'Срок займа (мес)',
      interestRate: 'Процентная ставка (%)',
      pastDue: 'Просрочки 30+ дней',
      inquiries: 'Запросов в бюро (6 мес)',
      fullName: 'ФИО заявителя',
      phone: 'Телефон',
      email: 'Email',
      purpose: 'Цель займа',
    },
    purposeOptions: ['Потребительский', 'Автокредит', 'Ипотека', 'Бизнес', 'Рефинансирование', 'Образование', 'Другое'],
    submit: 'Рассчитать скоринг',
    loading: 'Анализирую данные...',
    resultTitle: 'Результат скоринга',
    approved: 'Одобрено',
    rejected: 'Отказ',
    review: 'На проверке',
    probability: 'Вероятность дефолта',
    riskLabel: 'Уровень риска',
    factorsTitle: 'Ключевые факторы',
    fillForm: 'Заполните анкету и нажмите «Рассчитать»',
    pDefault: 'P(default)',
    riskFactors: 'Факторы риска',
    metrics: 'Метрики',
    lowRisk: 'Низкий',
    mediumRisk: 'Средний',
    highRisk: 'Высокий',
    lowRiskDesc: '✓ Низкий риск невозврата. Профиль заёмщика надёжный.',
    mediumRiskDesc: '⚠ Умеренный риск. Рекомендуется дополнительная проверка.',
    highRiskDesc: '✕ Высокий риск дефолта. Рекомендован отказ или снижение суммы.',
  },
  chatbot: {
    title: 'Чат-консультант',
    subtitle: 'Задайте вопрос о кредитных продуктах',
    placeholder: 'Напишите сообщение...',
    send: 'Отправить',
    welcome: 'Здравствуйте! Я ваш ИИ-консультант. Чем могу помочь?',
    quickReplies: ['Каковы ставки?', 'Как работает скоринг?', 'Условия кредита', 'Что такое дефолт?'],
  },
  photo: {
    title: 'Анализ по фото',
    subtitle: 'Загрузите документ для автоматического распознавания',
    upload: 'Загрузить фото',
    analyze: 'Анализировать',
    drag: 'Перетащите файл или нажмите для загрузки',
    analyzing: 'Распознаю документ...',
    extracting: 'Извлекаю данные...',
    extracted: 'Данные извлечены',
    documentTypes: ['Паспорт', 'Справка о доходах', 'ИНН', 'СНИЛС'],
    docFields: {
      fullName: 'ФИО',
      birthDate: 'Дата рождения',
      documentNumber: 'Серия/Номер',
      inn: 'ИНН',
      address: 'Адрес',
    },
    transfer: 'Перенести в форму скоринга',
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
    loginSubtitle: 'Войдите для доступа к полному функционалу',
    registerSubtitle: 'Создайте аккаунт для персонализированного скоринга',
    confirmPassword: 'Подтверждение пароля',
    fullName: 'ФИО',
    phone: 'Телефон',
    birthDate: 'Дата рождения',
    monthlyIncome: 'Ежемесячный доход (₸)',
    employmentYears: 'Стаж работы (лет)',
    requiredFields: 'Заполните все поля',
    passwordMismatch: 'Пароли не совпадают',
    passwordTooShort: 'Пароль должен содержать минимум 6 символов',
    loginError: 'Неверный email или пароль',
    registerError: 'Ошибка регистрации. Попробуйте другой email.',
  },
  footer: {
    tagline: 'Интеллектуальный кредитный скоринг',
    product: 'Продукт',
    company: 'Компания',
    legal: 'Правовая информация',
    rights: '© 2025 CreditScore AI. Все права защищены.',
    about: 'О нас',
    team: 'Команда',
    contacts: 'Контакты',
    privacy: 'Конфиденциальность',
    terms: 'Условия',
    licenses: 'Лицензии',
  },
  common: {
    startNow: 'Начните прямо сейчас',
    freeDemo: 'Бесплатная демонстрация. Никакой регистрации.',
    continueAsGuest: 'Продолжить без входа',
    enter: 'Вход',
    registering: 'Регистрация',
    calculate: 'Рассчитать',
    analyzing: 'Анализирую...',
    send: 'Отправить',
    typeMessage: 'Введите сообщение...',
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
    stat1val: '99.2%',
    stat1label: 'Model Accuracy',
    stat2val: '<1s',
    stat2label: 'Response Time',
    stat3val: '7',
    stat3label: 'Languages',
    featuresTitle: 'Everything you need in one place',
    feat1desc: 'Two modes: full employee questionnaire and simplified client input.',
    feat2desc: 'AI answers questions about loans, rates and terms in any of 7 languages.',
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
      interestRate: 'Interest Rate (%)',
      pastDue: 'Past Due 30+ days',
      inquiries: 'Bureau Inquiries (6m)',
      fullName: 'Full Name',
      phone: 'Phone',
      email: 'Email',
      purpose: 'Loan Purpose',
    },
    purposeOptions: ['Consumer', 'Auto Loan', 'Mortgage', 'Business', 'Refinancing', 'Education', 'Other'],
    submit: 'Calculate Score',
    loading: 'Analyzing data...',
    resultTitle: 'Scoring Result',
    approved: 'Approved',
    rejected: 'Rejected',
    review: 'Under Review',
    probability: 'Default Probability',
    riskLabel: 'Risk Level',
    factorsTitle: 'Key Factors',
    fillForm: 'Fill out the form and click "Calculate"',
    pDefault: 'P(default)',
    riskFactors: 'Risk Factors',
    metrics: 'Metrics',
    lowRisk: 'Low',
    mediumRisk: 'Medium',
    highRisk: 'High',
    lowRiskDesc: '✓ Low default risk. Borrower profile is reliable.',
    mediumRiskDesc: '⚠ Moderate risk. Additional verification recommended.',
    highRiskDesc: '✕ High default risk. Rejection or amount reduction recommended.',
  },
  chatbot: {
    title: 'Chat Advisor',
    subtitle: 'Ask a question about credit products',
    placeholder: 'Type a message...',
    send: 'Send',
    welcome: 'Hello! I am your AI advisor. How can I help you?',
    quickReplies: ['What are the rates?', 'How does scoring work?', 'Loan terms', 'What is default?'],
  },
  photo: {
    title: 'Photo Analysis',
    subtitle: 'Upload a document for automatic recognition',
    upload: 'Upload Photo',
    analyze: 'Analyze',
    drag: 'Drag a file or click to upload',
    analyzing: 'Recognizing document...',
    extracting: 'Extracting data...',
    extracted: 'Data extracted',
    documentTypes: ['Passport', 'Income Statement', 'Tax ID', 'SNILS'],
    docFields: {
      fullName: 'Full Name',
      birthDate: 'Date of Birth',
      documentNumber: 'Series/Number',
      inn: 'Tax ID',
      address: 'Address',
    },
    transfer: 'Transfer to scoring form',
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
    loginSubtitle: 'Sign in to access full features',
    registerSubtitle: 'Create an account for personalized scoring',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    phone: 'Phone',
    birthDate: 'Date of Birth',
    monthlyIncome: 'Monthly Income',
    employmentYears: 'Employment Years',
    requiredFields: 'Please fill all required fields',
    passwordMismatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
    loginError: 'Invalid email or password',
    registerError: 'Registration failed. Try another email.',
  },
  footer: {
    tagline: 'Intelligent credit scoring',
    product: 'Product',
    company: 'Company',
    legal: 'Legal',
    rights: '© 2025 CreditScore AI. All rights reserved.',
    about: 'About Us',
    team: 'Team',
    contacts: 'Contacts',
    privacy: 'Privacy',
    terms: 'Terms',
    licenses: 'Licenses',
  },
  common: {
    startNow: 'Start Now',
    freeDemo: 'Free demo. No registration required.',
    continueAsGuest: 'Continue as guest',
    enter: 'Enter',
    registering: 'Registering',
    calculate: 'Calculate',
    analyzing: 'Analyzing...',
    send: 'Send',
    typeMessage: 'Type a message...',
  },
}

// Кыргызча (ky) - добавляем недостающие поля
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
    stat1val: '99.2%',
    stat1label: 'Моделдин тактыгы',
    stat2val: '<1с',
    stat2label: 'Жооп убактысы',
    stat3val: '7',
    stat3label: 'Тилдер',
    featuresTitle: 'Бардыгы бир жерде',
    feat1desc: 'Эки режим: кызматкерлер үчүн жана кардарлар үчүн.',
    feat2desc: 'AI кредиттер жөнүндө суроолорго 7 тилде жооп берет.',
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
      interestRate: 'Пайыз ставкасы (%)',
      pastDue: 'Мерзими өткөн 30+ күн',
      inquiries: 'Бюро суроо-талаптары (6 ай)',
      fullName: 'Толук аты',
      phone: 'Телефон',
      email: 'Email',
      purpose: 'Кредиттин максаты',
    },
    purposeOptions: ['Керектөө', 'Автокредит', 'Ипотека', 'Бизнес', 'Кайра каржылоо', 'Билим алуу', 'Башка'],
    submit: 'Скорингди эсептөө',
    loading: 'Маалыматтарды талдоо...',
    resultTitle: 'Скоринг натыйжасы',
    approved: 'Бекитилди',
    rejected: 'Баш тартылды',
    review: 'Карап жатат',
    probability: 'Дефолт ыктымалдуулугу',
    riskLabel: 'Тобокелдик деңгээли',
    factorsTitle: 'Негизги факторлор',
    fillForm: 'Анкетаны толтуруп «Эсептөө» баскычын басыңыз',
    pDefault: 'P(default)',
    riskFactors: 'Тобокелдик факторлору',
    metrics: 'Метрикалар',
    lowRisk: 'Төмөн',
    mediumRisk: 'Орто',
    highRisk: 'Жогорку',
    lowRiskDesc: '✓ Төмөн тобокелдик. Кардардын профили ишенимдүү.',
    mediumRiskDesc: '⚠ Орточо тобокелдик. Кошумча текшерүү сунушталат.',
    highRiskDesc: '✕ Жогорку тобокелдик. Баш тартуу же сумманы азайтуу сунушталат.',
  },
  chatbot: {
    title: 'Чат-кеңешчи',
    subtitle: 'Кредит продукттары жөнүндө суроо бериңиз',
    placeholder: 'Билдирүү жазыңыз...',
    send: 'Жөнөтүү',
    welcome: 'Саламатсызбы! Мен сиздин AI-кеңешчиңизмин. Кандай жардам керек?',
    quickReplies: ['Ставкалар кандай?', 'Скоринг кантип иштейт?', 'Кредит шарттары', 'Дефолт деген эмне?'],
  },
  photo: {
    title: 'Сүрөт талдоо',
    subtitle: 'Автоматтык таанып билүү үчүн документти жүктөңүз',
    upload: 'Сүрөт жүктөө',
    analyze: 'Талдоо',
    drag: 'Файлды сүйрөңүз же жүктөө үчүн басыңыз',
    analyzing: 'Документти тааныйм...',
    extracting: 'Маалыматтарды алам...',
    extracted: 'Маалыматтар алынды',
    documentTypes: ['Паспорт', 'Киреше жөнүндө маалымат', 'ИНН', 'СНИЛС'],
    docFields: {
      fullName: 'Толук аты',
      birthDate: 'Туулган күнү',
      documentNumber: 'Серия/Номер',
      inn: 'ИНН',
      address: 'Дареги',
    },
    transfer: 'Скоринг формасына өткөрүү',
  },
  auth: {
    loginTitle: 'Кирүү',
    registerTitle: 'Катталуу',
    email: 'Email',
    password: 'Сырсөз',
    loginBtn: 'Кирүү',
    registerBtn: 'Катталуу',
    noAccount: 'Аккаунтуңуз жокпу?',
    register: 'Катталуу',
    orContinue: 'же конок катары улантуу',
    loginSubtitle: 'Толук мүмкүнчүлүктөрдү ачуу үчүн кириңиз',
    registerSubtitle: 'Жеке скоринг үчүн аккаунт түзүңүз',
    confirmPassword: 'Сырсөздү ырастоо',
    fullName: 'Толук аты',
    phone: 'Телефон',
    birthDate: 'Туулган күн',
    monthlyIncome: 'Айлык киреше',
    employmentYears: 'Иш стажы (жыл)',
    requiredFields: 'Бардык талап кылынган талааларды толтуруңуз',
    passwordMismatch: 'Сырсөздөр дал келбейт',
    passwordTooShort: 'Сырсөз кеминде 6 белгиден турушу керек',
    loginError: 'Email же сырсөз туура эмес',
    registerError: 'Катталоодо ката. Башка email колдонуңуз.',
  },
  footer: {
    tagline: 'Акылдуу кредиттик скоринг',
    product: 'Продукт',
    company: 'Компания',
    legal: 'Укуктук маалымат',
    rights: '© 2025 CreditScore AI. Бардык укуктар корголгон.',
    about: 'Биз жөнүндө',
    team: 'Команда',
    contacts: 'Байланыш',
    privacy: 'Купуялык',
    terms: 'Шарттар',
    licenses: 'Лицензиялар',
  },
  common: {
    startNow: 'Азыр баштоо',
    freeDemo: 'Акысыз демо. Катталуунун кереги жок.',
    continueAsGuest: 'Конок катары улантуу',
    enter: 'Кирүү',
    registering: 'Катталуу',
    calculate: 'Эсептөө',
    analyzing: 'Талдоо...',
    send: 'Жөнөтүү',
    typeMessage: 'Билдирүү жазыңыз...',
  },
}

// Немецкий (de) - кратко, добавляем недостающие поля
const de: Translations = {
  ...JSON.parse(JSON.stringify(en)), // Берём за основу en
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
    subline: 'Sofortige Kreditnehmerbewertung in Sekunden.',
    ctaPrimary: 'Bewertung starten',
    stat1val: '99,2%',
    stat1label: 'Modellgenauigkeit',
    stat2val: '<1s',
    stat2label: 'Antwortzeit',
    stat3val: '7',
    stat3label: 'Sprachen',
    featuresTitle: 'Alles an einem Ort',
    feat1desc: 'Zwei Modi: vollständiger Mitarbeiterfragebogen und vereinfachte Kundeneingabe.',
    feat2desc: 'KI beantwortet Fragen zu Krediten in 7 Sprachen.',
    feat3desc: 'Laden Sie ein Foto hoch — das System extrahiert Daten automatisch.',
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
      interestRate: 'Zinssatz (%)',
      pastDue: 'Überfällig 30+ Tage',
      inquiries: 'Kreditanfragen (6 Mon)',
      fullName: 'Vollständiger Name',
      phone: 'Telefon',
      email: 'E-Mail',
      purpose: 'Kreditzweck',
    },
    purposeOptions: ['Verbraucher', 'Autokredit', 'Hypothek', 'Geschäft', 'Refinanzierung', 'Bildung', 'Andere'],
    submit: 'Score berechnen',
    loading: 'Daten werden analysiert...',
    resultTitle: 'Scoring-Ergebnis',
    approved: 'Genehmigt',
    rejected: 'Abgelehnt',
    review: 'In Prüfung',
    probability: 'Ausfallwahrscheinlichkeit',
    riskLabel: 'Risikoniveau',
    factorsTitle: 'Schlüsselfaktoren',
    fillForm: 'Füllen Sie das Formular aus und klicken Sie auf "Berechnen"',
    pDefault: 'P(default)',
    riskFactors: 'Risikofaktoren',
    metrics: 'Metriken',
    lowRisk: 'Niedrig',
    mediumRisk: 'Mittel',
    highRisk: 'Hoch',
    lowRiskDesc: '✓ Niedriges Ausfallrisiko. Kreditnehmerprofil ist zuverlässig.',
    mediumRiskDesc: '⚠ Moderatrisiko. Zusätzliche Überprüfung empfohlen.',
    highRiskDesc: '✕ Hohes Ausfallrisiko. Ablehnung oder Reduzierung empfohlen.',
  },
  chatbot: {
    title: 'Chat-Berater',
    subtitle: 'Fragen Sie zu Kreditprodukten',
    placeholder: 'Nachricht eingeben...',
    send: 'Senden',
    welcome: 'Hallo! Ich bin Ihr KI-Berater.',
    quickReplies: ['Zinssätze?', 'Wie funktioniert Scoring?', 'Kreditkonditionen', 'Was ist Ausfall?'],
  },
  photo: {
    title: 'Fotoanalyse',
    subtitle: 'Dokument zur Erkennung hochladen',
    upload: 'Foto hochladen',
    analyze: 'Analysieren',
    drag: 'Datei ziehen oder klicken',
    analyzing: 'Dokument wird erkannt...',
    extracting: 'Daten werden extrahiert...',
    extracted: 'Daten extrahiert',
    documentTypes: ['Reisepass', 'Einkommensnachweis', 'Steuer-ID', 'SNILS'],
    docFields: {
      fullName: 'Vollständiger Name',
      birthDate: 'Geburtsdatum',
      documentNumber: 'Serie/Nummer',
      inn: 'Steuer-ID',
      address: 'Adresse',
    },
    transfer: 'In Scoring-Formular übernehmen',
  },
  auth: {
    loginTitle: 'Anmelden',
    registerTitle: 'Registrieren',
    email: 'E-Mail',
    password: 'Passwort',
    loginBtn: 'Anmelden',
    registerBtn: 'Registrieren',
    noAccount: 'Kein Konto?',
    register: 'Registrieren',
    orContinue: 'oder als Gast fortfahren',
    loginSubtitle: 'Melden Sie sich an für vollen Zugriff',
    registerSubtitle: 'Konto für personalisiertes Scoring erstellen',
    confirmPassword: 'Passwort bestätigen',
    fullName: 'Vollständiger Name',
    phone: 'Telefon',
    birthDate: 'Geburtsdatum',
    monthlyIncome: 'Monatliches Einkommen',
    employmentYears: 'Beschäftigungsjahre',
    requiredFields: 'Bitte füllen Sie alle Pflichtfelder aus',
    passwordMismatch: 'Passwörter stimmen nicht überein',
    passwordTooShort: 'Passwort muss mindestens 6 Zeichen lang sein',
    loginError: 'Ungültige E-Mail oder Passwort',
    registerError: 'Registrierung fehlgeschlagen.',
  },
  footer: {
    tagline: 'Intelligentes Kredit-Scoring',
    product: 'Produkt',
    company: 'Unternehmen',
    legal: 'Rechtliches',
    rights: '© 2025 CreditScore AI. Alle Rechte vorbehalten.',
    about: 'Über uns',
    team: 'Team',
    contacts: 'Kontakte',
    privacy: 'Datenschutz',
    terms: 'AGB',
    licenses: 'Lizenzen',
  },
  common: {
    startNow: 'Jetzt starten',
    freeDemo: 'Kostenlose Demo. Keine Registrierung.',
    continueAsGuest: 'Als Gast fortfahren',
    enter: 'Anmelden',
    registering: 'Registrieren',
    calculate: 'Berechnen',
    analyzing: 'Analysiere...',
    send: 'Senden',
    typeMessage: 'Nachricht eingeben...',
  },
}

// Французский (fr)
const fr: Translations = {
  ...JSON.parse(JSON.stringify(en)),
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
    badge: "Scoring IA nouvelle génération",
    headline1: 'Analyse intelligente',
    headline2: 'des risques crédit',
    subline: "Évaluation instantanée de l'emprunteur.",
    ctaPrimary: "Démarrer",
    stat1val: '99,2%',
    stat1label: 'Précision',
    stat2val: '<1s',
    stat2label: 'Temps réponse',
    stat3val: '7',
    stat3label: 'Langues',
    featuresTitle: 'Tout en un seul endroit',
    feat1desc: 'Deux modes : employé et client.',
    feat2desc: "L'IA répond en 7 langues.",
    feat3desc: 'Téléchargez une photo — extraction automatique.',
  },
  scoring: {
    title: 'Scoring Crédit',
    subtitle: 'Choisissez le mode',
    tabEmployee: 'Mode Employé',
    tabClient: 'Mode Client',
    fields: {
      age: 'Âge',
      income: 'Revenu mensuel',
      employment: "Années d'expérience",
      loanAmount: 'Montant du prêt',
      loanTerm: 'Durée (mois)',
      interestRate: "Taux (%)",
      pastDue: 'Retards 30+ jours',
      inquiries: 'Demandes (6 mois)',
      fullName: 'Nom complet',
      phone: 'Téléphone',
      email: 'Email',
      purpose: 'Objet du prêt',
    },
    purposeOptions: ['Consommation', 'Auto', 'Hypothèque', 'Entreprise', 'Refinancement', 'Éducation', 'Autre'],
    submit: 'Calculer',
    loading: 'Analyse...',
    resultTitle: 'Résultat',
    approved: 'Approuvé',
    rejected: 'Refusé',
    review: 'En révision',
    probability: 'Probabilité défaut',
    riskLabel: 'Niveau risque',
    factorsTitle: 'Facteurs clés',
    fillForm: 'Remplissez le formulaire',
    pDefault: 'P(défaut)',
    riskFactors: 'Facteurs risque',
    metrics: 'Métriques',
    lowRisk: 'Faible',
    mediumRisk: 'Moyen',
    highRisk: 'Élevé',
    lowRiskDesc: '✓ Risque faible. Profil fiable.',
    mediumRiskDesc: '⚠ Risque modéré. Vérification supplémentaire.',
    highRiskDesc: '✕ Risque élevé. Refus recommandé.',
  },
  chatbot: {
    title: 'Conseiller Chat',
    subtitle: 'Posez votre question',
    placeholder: 'Tapez un message...',
    send: 'Envoyer',
    welcome: 'Bonjour! Comment puis-je vous aider?',
    quickReplies: ['Taux?', 'Comment ça marche?', 'Conditions', 'Défaut?'],
  },
  photo: {
    title: 'Analyse Photo',
    subtitle: 'Téléchargez un document',
    upload: 'Télécharger',
    analyze: 'Analyser',
    drag: 'Glissez ou cliquez',
    analyzing: 'Reconnaissance...',
    extracting: 'Extraction...',
    extracted: 'Données extraites',
    documentTypes: ['Passeport', 'Revenus', 'Taxe', 'SNILS'],
    docFields: {
      fullName: 'Nom complet',
      birthDate: 'Date naissance',
      documentNumber: 'N° document',
      inn: 'N° fiscal',
      address: 'Adresse',
    },
    transfer: 'Transférer',
  },
  auth: {
    loginTitle: 'Connexion',
    registerTitle: 'Inscription',
    email: 'Email',
    password: 'Mot de passe',
    loginBtn: 'Se connecter',
    registerBtn: "S'inscrire",
    noAccount: 'Pas de compte?',
    register: 'Inscription',
    orContinue: 'ou continuer invité',
    loginSubtitle: 'Connectez-vous',
    registerSubtitle: 'Créez un compte',
    confirmPassword: 'Confirmer',
    fullName: 'Nom complet',
    phone: 'Téléphone',
    birthDate: 'Date naissance',
    monthlyIncome: 'Revenu mensuel',
    employmentYears: 'Années expérience',
    requiredFields: 'Champs requis',
    passwordMismatch: 'Mots de passe différents',
    passwordTooShort: '6 caractères min',
    loginError: 'Email ou mot de passe invalide',
    registerError: 'Échec inscription',
  },
  footer: {
    tagline: 'Scoring crédit intelligent',
    product: 'Produit',
    company: 'Entreprise',
    legal: 'Mentions légales',
    rights: '© 2025 CreditScore AI.',
    about: 'À propos',
    team: 'Équipe',
    contacts: 'Contacts',
    privacy: 'Confidentialité',
    terms: 'Conditions',
    licenses: 'Licences',
  },
  common: {
    startNow: 'Commencer',
    freeDemo: 'Démo gratuite',
    continueAsGuest: 'Invité',
    enter: 'Entrer',
    registering: 'Inscription',
    calculate: 'Calculer',
    analyzing: 'Analyse...',
    send: 'Envoyer',
    typeMessage: 'Tapez...',
  },
}

// Китайский (zh)
const zh: Translations = {
  ...JSON.parse(JSON.stringify(en)),
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
    subline: '秒级评估借款人。',
    ctaPrimary: '开始评估',
    stat1val: '99.2%',
    stat1label: '模型准确率',
    stat2val: '<1秒',
    stat2label: '响应时间',
    stat3val: '7',
    stat3label: '支持语言',
    featuresTitle: '一站式解决方案',
    feat1desc: '两种模式：员工和客户。',
    feat2desc: 'AI用7种语言回答问题。',
    feat3desc: '上传护照照片，自动提取数据。',
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
      interestRate: '利率（%）',
      pastDue: '逾期30+天',
      inquiries: '征信查询（6月）',
      fullName: '姓名',
      phone: '电话',
      email: '邮箱',
      purpose: '贷款用途',
    },
    purposeOptions: ['消费', '车贷', '房贷', '商业', '再融资', '教育', '其他'],
    submit: '计算评分',
    loading: '分析数据中...',
    resultTitle: '评分结果',
    approved: '已批准',
    rejected: '已拒绝',
    review: '审核中',
    probability: '违约概率',
    riskLabel: '风险等级',
    factorsTitle: '关键因素',
    fillForm: '填写表格并点击“计算”',
    pDefault: 'P(违约)',
    riskFactors: '风险因素',
    metrics: '指标',
    lowRisk: '低',
    mediumRisk: '中',
    highRisk: '高',
    lowRiskDesc: '✓ 违约风险低。借款人可靠。',
    mediumRiskDesc: '⚠ 中等风险。建议额外审核。',
    highRiskDesc: '✕ 违约风险高。建议拒绝或降低额度。',
  },
  chatbot: {
    title: '智能客服',
    subtitle: '询问信用产品问题',
    placeholder: '输入消息...',
    send: '发送',
    welcome: '您好！我是您的AI顾问。',
    quickReplies: ['利率？', '评分如何工作？', '贷款条件', '什么是违约？'],
  },
  photo: {
    title: '照片分析',
    subtitle: '上传文件进行识别',
    upload: '上传照片',
    analyze: '分析',
    drag: '拖拽或点击上传',
    analyzing: '识别文档中...',
    extracting: '提取数据中...',
    extracted: '数据已提取',
    documentTypes: ['护照', '收入证明', '税号', 'SNILS'],
    docFields: {
      fullName: '姓名',
      birthDate: '出生日期',
      documentNumber: '证件号码',
      inn: '税号',
      address: '地址',
    },
    transfer: '转移到评分表单',
  },
  auth: {
    loginTitle: '登录',
    registerTitle: '注册',
    email: '邮箱',
    password: '密码',
    loginBtn: '登录',
    registerBtn: '注册',
    noAccount: '没有账号？',
    register: '注册',
    orContinue: '或以访客身份继续',
    loginSubtitle: '登录访问全部功能',
    registerSubtitle: '创建账户',
    confirmPassword: '确认密码',
    fullName: '姓名',
    phone: '电话',
    birthDate: '出生日期',
    monthlyIncome: '月收入',
    employmentYears: '工作年限',
    requiredFields: '请填写所有必填字段',
    passwordMismatch: '密码不匹配',
    passwordTooShort: '密码至少6个字符',
    loginError: '邮箱或密码错误',
    registerError: '注册失败',
  },
  footer: {
    tagline: '智能信用评分',
    product: '产品',
    company: '公司',
    legal: '法律信息',
    rights: '© 2025 CreditScore AI.',
    about: '关于我们',
    team: '团队',
    contacts: '联系方式',
    privacy: '隐私政策',
    terms: '服务条款',
    licenses: '许可证',
  },
  common: {
    startNow: '立即开始',
    freeDemo: '免费演示',
    continueAsGuest: '访客模式',
    enter: '进入',
    registering: '注册中',
    calculate: '计算',
    analyzing: '分析中...',
    send: '发送',
    typeMessage: '输入消息...',
  },
}

// Арабский (ar)
const ar: Translations = {
  ...JSON.parse(JSON.stringify(en)),
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
    subline: 'تقييم فوري للمقترض في ثوانٍ.',
    ctaPrimary: 'بدء التقييم',
    stat1val: '99.2%',
    stat1label: 'دقة النموذج',
    stat2val: '<1ث',
    stat2label: 'وقت الاستجابة',
    stat3val: '7',
    stat3label: 'لغات',
    featuresTitle: 'كل ما تحتاجه',
    feat1desc: 'وضعان: موظف وعميل.',
    feat2desc: 'AI يجيب على الأسئلة بـ 7 لغات.',
    feat3desc: 'حمّل صورة جواز السفر — استخراج تلقائي.',
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
      interestRate: 'معدل الفائدة (%)',
      pastDue: 'متأخرات 30+ يوم',
      inquiries: 'استعلامات (6 أشهر)',
      fullName: 'الاسم الكامل',
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      purpose: 'الغرض من القرض',
    },
    purposeOptions: ['استهلاكي', 'سيارة', 'رهن عقاري', 'تجاري', 'إعادة تمويل', 'تعليمي', 'أخرى'],
    submit: 'احسب',
    loading: 'جاري التحليل...',
    resultTitle: 'النتيجة',
    approved: 'موافق',
    rejected: 'مرفوض',
    review: 'قيد المراجعة',
    probability: 'احتمالية التخلف',
    riskLabel: 'مستوى المخاطرة',
    factorsTitle: 'العوامل الرئيسية',
    fillForm: 'املأ النموذج وانقر "احسب"',
    pDefault: 'P(التخلف)',
    riskFactors: 'عوامل المخاطرة',
    metrics: 'المقاييس',
    lowRisk: 'منخفض',
    mediumRisk: 'متوسط',
    highRisk: 'مرتفع',
    lowRiskDesc: '✓ مخاطرة منخفضة. ملف العميل موثوق.',
    mediumRiskDesc: '⚠ مخاطرة متوسطة. يوصى بتحقق إضافي.',
    highRiskDesc: '✕ مخاطرة عالية. يوصى بالرفض أو تخفيض المبلغ.',
  },
  chatbot: {
    title: 'مستشار الدردشة',
    subtitle: 'اسأل عن منتجات الائتمان',
    placeholder: 'اكتب رسالة...',
    send: 'إرسال',
    welcome: 'مرحباً! كيف يمكنني مساعدتك؟',
    quickReplies: ['الأسعار؟', 'كيف يعمل؟', 'شروط القرض', 'ما هو التخلف؟'],
  },
  photo: {
    title: 'تحليل الصور',
    subtitle: 'حمّل مستنداً للتعرف',
    upload: 'تحميل',
    analyze: 'تحليل',
    drag: 'اسحب أو انقر',
    analyzing: 'جاري التعرف...',
    extracting: 'جاري استخراج البيانات...',
    extracted: 'تم استخراج البيانات',
    documentTypes: ['جواز سفر', 'إثبات دخل', 'رقم ضريبي', 'SNILS'],
    docFields: {
      fullName: 'الاسم الكامل',
      birthDate: 'تاريخ الميلاد',
      documentNumber: 'الرقم',
      inn: 'الرقم الضريبي',
      address: 'العنوان',
    },
    transfer: 'نقل إلى النموذج',
  },
  auth: {
    loginTitle: 'تسجيل الدخول',
    registerTitle: 'تسجيل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    loginBtn: 'دخول',
    registerBtn: 'تسجيل',
    noAccount: 'ليس لديك حساب؟',
    register: 'التسجيل',
    orContinue: 'أو كضيف',
    loginSubtitle: 'سجل الدخول',
    registerSubtitle: 'أنشئ حساباً',
    confirmPassword: 'تأكيد كلمة المرور',
    fullName: 'الاسم الكامل',
    phone: 'الهاتف',
    birthDate: 'تاريخ الميلاد',
    monthlyIncome: 'الدخل الشهري',
    employmentYears: 'سنوات الخبرة',
    requiredFields: 'املأ الحقول المطلوبة',
    passwordMismatch: 'كلمات المرور غير متطابقة',
    passwordTooShort: '6 أحرف على الأقل',
    loginError: 'بريد أو كلمة مرور غير صالحة',
    registerError: 'فشل التسجيل',
  },
  footer: {
    tagline: 'تسجيل ائتماني ذكي',
    product: 'المنتج',
    company: 'الشركة',
    legal: 'قانوني',
    rights: '© 2025 CreditScore AI.',
    about: 'معلومات عنا',
    team: 'الفريق',
    contacts: 'جهات الاتصال',
    privacy: 'الخصوصية',
    terms: 'الشروط',
    licenses: 'التراخيص',
  },
  common: {
    startNow: 'ابدأ الآن',
    freeDemo: 'نسخة تجريبية مجانية',
    continueAsGuest: 'ضيف',
    enter: 'دخول',
    registering: 'جاري التسجيل',
    calculate: 'احسب',
    analyzing: 'جاري التحليل...',
    send: 'إرسال',
    typeMessage: 'اكتب رسالة...',
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