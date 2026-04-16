const onboardingState = {
  step: 1,
  lang: 'en',
  role: localStorage.getItem('onboardingRole') || 'client'
};
const ONBOARDING_SEEN_STORAGE_KEY = 'devconnectOnboardingSeen';

function markOnboardingSeen() {
  try {
    localStorage.setItem(ONBOARDING_SEEN_STORAGE_KEY, 'true');
  } catch (_error) {
    // Storage can be unavailable in some browser modes; navigation should still work.
  }
}

function normalizeLanguage(lang) {
  if (lang === 'kz') return 'kk';
  return ['en', 'ru', 'kk'].includes(lang) ? lang : 'en';
}

const copy = {
  en: {
    skip: 'Skip',
    progress: (step, total) => `Step ${step} of ${total}`,
    languageBadge: 'Personalize the experience',
    languageTitle: 'Choose your language',
    languageText: 'Select the language you want to use across the platform.',
    roleBadge: 'Shape your journey',
    roleTitle: 'Who are you joining as?',
    roleText: 'We will adapt the next steps, recommendations, and dashboard for your goals.',
    clientKicker: 'Client',
    clientTitle: 'I have a project',
    clientText: 'Post an idea, define a budget, and get matched with verified specialists.',
    specialistKicker: 'Specialist',
    specialistTitle: 'I am an IT specialist',
    specialistText: 'Show your skills, verification status, and availability to quality clients.',
    detailsBadge: 'Quick setup',
    detailsTitleClient: 'Tell us what you want to build',
    detailsTextClient: 'This takes under a minute and helps us show the right specialists first.',
    detailsTitleSpecialist: 'Tell us how you want to work',
    detailsTextSpecialist: 'This helps us surface better projects and a sharper dashboard.',
    clientProjectType: 'What do you want to build?',
    clientBudget: 'Budget range',
    clientGoal: 'Main goal',
    specialistStack: 'Main focus',
    specialistLevel: 'Experience level',
    specialistGoal: 'What are you looking for?',
    optWebsite: 'Website',
    optMobile: 'Mobile app',
    optAi: 'AI product',
    optOther: 'Other',
    budget1: 'Up to $1,000',
    budget2: '$1,000 – $5,000',
    budget3: '$5,000 – $15,000',
    budget4: 'Custom budget',
    stack1: 'Frontend',
    stack2: 'Backend',
    stack3: 'Design',
    stack4: 'AI / ML',
    level1: 'Junior',
    level2: 'Middle',
    level3: 'Senior',
    level4: 'Lead',
    back: 'Back',
    continue: 'Continue',
    resultBadge: 'Ready',
    resultTitleClient: 'You are ready to post your project',
    resultTextClient: 'We will guide you to the client experience with verified specialists and clear project setup.',
    resultTitleSpecialist: 'You are ready to showcase your profile',
    resultTextSpecialist: 'We will guide you to the specialist experience with verification and better project visibility.',
    summaryLanguage: 'Language',
    summaryRole: 'Role',
    summaryFocus: 'Focus',
    finish: 'Enter platform',
    clientRoleLabel: 'Client',
    specialistRoleLabel: 'IT specialist',
    projectPlaceholder: 'Launch fast with a trusted team',
    specialistPlaceholder: 'Strong projects with serious founders',
    languageNames: { en: 'English', ru: 'Russian', kk: 'Kazakh' },
    summaryClient: (type, goal) => `${type} · ${goal || 'Launch fast'}`,
    summarySpecialist: (stack, goal) => `${stack} · ${goal || 'Meaningful work'}`
  },
  ru: {
    skip: 'Пропустить',
    progress: (step, total) => `Шаг ${step} из ${total}`,
    languageBadge: 'Персонализация',
    languageTitle: 'Выберите язык',
    languageText: 'Выберите язык, на котором будет работать платформа.',
    roleBadge: 'Настройка пути',
    roleTitle: 'Кто вы?',
    roleText: 'Следующие шаги, рекомендации и кабинет будут настроены под вашу цель.',
    clientKicker: 'Клиент',
    clientTitle: 'У меня есть проект',
    clientText: 'Опубликуйте идею, задайте бюджет и получите доступ к проверенным специалистам.',
    specialistKicker: 'Специалист',
    specialistTitle: 'Я IT-специалист',
    specialistText: 'Покажите навыки, статус верификации и доступность для сильных клиентов.',
    detailsBadge: 'Быстрая настройка',
    detailsTitleClient: 'Расскажите, что хотите создать',
    detailsTextClient: 'Это займет меньше минуты и поможет сразу показать подходящих специалистов.',
    detailsTitleSpecialist: 'Расскажите, как хотите работать',
    detailsTextSpecialist: 'Это поможет показать вам лучшие проекты и более точный кабинет.',
    clientProjectType: 'Что вы хотите создать?',
    clientBudget: 'Диапазон бюджета',
    clientGoal: 'Главная цель',
    specialistStack: 'Основное направление',
    specialistLevel: 'Уровень опыта',
    specialistGoal: 'Что вы ищете?',
    optWebsite: 'Веб-сайт',
    optMobile: 'Мобильное приложение',
    optAi: 'AI-продукт',
    optOther: 'Другое',
    budget1: 'До $1,000',
    budget2: '$1,000 – $5,000',
    budget3: '$5,000 – $15,000',
    budget4: 'Индивидуально',
    stack1: 'Frontend',
    stack2: 'Backend',
    stack3: 'Дизайн',
    stack4: 'AI / ML',
    level1: 'Junior',
    level2: 'Middle',
    level3: 'Senior',
    level4: 'Lead',
    back: 'Назад',
    continue: 'Продолжить',
    resultBadge: 'Готово',
    resultTitleClient: 'Вы готовы опубликовать проект',
    resultTextClient: 'Мы направим вас в клиентский сценарий с проверенными специалистами и понятной настройкой проекта.',
    resultTitleSpecialist: 'Вы готовы показать свой профиль',
    resultTextSpecialist: 'Мы направим вас в сценарий специалиста с верификацией и лучшей видимостью проектов.',
    summaryLanguage: 'Язык',
    summaryRole: 'Роль',
    summaryFocus: 'Фокус',
    finish: 'Войти на платформу',
    clientRoleLabel: 'Клиент',
    specialistRoleLabel: 'IT-специалист',
    projectPlaceholder: 'Быстро запустить продукт с надежной командой',
    specialistPlaceholder: 'Сильные проекты и серьезные заказчики',
    languageNames: { en: 'Английский', ru: 'Русский', kk: 'Казахский' },
    summaryClient: (type, goal) => `${type} · ${goal || 'Быстрый запуск'}`,
    summarySpecialist: (stack, goal) => `${stack} · ${goal || 'Сильные проекты'}`
  },
  kk: {
    skip: 'Өткізіп жіберу',
    progress: (step, total) => `${step} / ${total} қадам`,
    languageBadge: 'Жекелендіру',
    languageTitle: 'Тілді таңдаңыз',
    languageText: 'Платформада қолданылатын тілді таңдаңыз.',
    roleBadge: 'Бағытыңызды таңдаңыз',
    roleTitle: 'Сіз кім ретінде кіресіз?',
    roleText: 'Келесі қадамдар, ұсыныстар және кабинет сіздің мақсатыңызға сай бейімделеді.',
    clientKicker: 'Клиент',
    clientTitle: 'Менде жоба бар',
    clientText: 'Идеяңызды жариялап, бюджетті көрсетіп, тексерілген мамандарды табыңыз.',
    specialistKicker: 'Маман',
    specialistTitle: 'Мен IT маманымын',
    specialistText: 'Дағдыларыңызды, тексеру мәртебесін және бос уақытыңызды көрсетіңіз.',
    detailsBadge: 'Жылдам баптау',
    detailsTitleClient: 'Не жасағыңыз келетінін айтыңыз',
    detailsTextClient: 'Бұл бір минуттан аз уақыт алады және бірден дұрыс мамандарды көрсетеді.',
    detailsTitleSpecialist: 'Қалай жұмыс істегіңіз келетінін айтыңыз',
    detailsTextSpecialist: 'Бұл сізге жақсы жобалар мен нақты кабинет көрсетуге көмектеседі.',
    clientProjectType: 'Не жасағыңыз келеді?',
    clientBudget: 'Бюджет аралығы',
    clientGoal: 'Негізгі мақсат',
    specialistStack: 'Негізгі бағытыңыз',
    specialistLevel: 'Тәжірибе деңгейі',
    specialistGoal: 'Не іздеп жүрсіз?',
    optWebsite: 'Веб-сайт',
    optMobile: 'Мобильді қосымша',
    optAi: 'AI өнімі',
    optOther: 'Басқа',
    budget1: '$1,000 дейін',
    budget2: '$1,000 – $5,000',
    budget3: '$5,000 – $15,000',
    budget4: 'Жеке бюджет',
    stack1: 'Frontend',
    stack2: 'Backend',
    stack3: 'Дизайн',
    stack4: 'AI / ML',
    level1: 'Junior',
    level2: 'Middle',
    level3: 'Senior',
    level4: 'Lead',
    back: 'Артқа',
    continue: 'Жалғастыру',
    resultBadge: 'Дайын',
    resultTitleClient: 'Сіз жоба жариялауға дайынсыз',
    resultTextClient: 'Біз сізді тексерілген мамандар мен анық жоба баптауы бар клиенттік сценарийге апарамыз.',
    resultTitleSpecialist: 'Сіз профиліңізді көрсетуге дайынсыз',
    resultTextSpecialist: 'Біз сізді тексеру және жақсы жобалар көрінетін маман сценарийіне апарамыз.',
    summaryLanguage: 'Тіл',
    summaryRole: 'Рөл',
    summaryFocus: 'Фокус',
    finish: 'Платформаға кіру',
    clientRoleLabel: 'Клиент',
    specialistRoleLabel: 'IT маманы',
    projectPlaceholder: 'Сенімді командамен тез іске қосу',
    specialistPlaceholder: 'Мықты жобалар мен нақты тапсырыс берушілер',
    languageNames: { en: 'Ағылшын', ru: 'Орыс', kk: 'Қазақша' },
    summaryClient: (type, goal) => `${type} · ${goal || 'Тез іске қосу'}`,
    summarySpecialist: (stack, goal) => `${stack} · ${goal || 'Мазмұнды жұмыс'}`
  }
};

const totalSteps = 5;
const panels = [...document.querySelectorAll('.onboarding-panel')];
const progressFill = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');
const progressPercent = document.getElementById('progressPercent');
const skipBtn = document.getElementById('skipBtn');
const progressBlock = document.querySelector('.onboarding-progress');

function t(key) {
  return copy[onboardingState.lang][key];
}

function showStep(step) {
  onboardingState.step = Math.max(1, Math.min(totalSteps, step));

  panels.forEach(panel => {
    panel.classList.toggle('active', Number(panel.dataset.step) === onboardingState.step);
  });

  const pct = Math.round((onboardingState.step / totalSteps) * 100);

  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressLabel) progressLabel.textContent = t('progress')(onboardingState.step, totalSteps);
  if (progressPercent) progressPercent.textContent = `${pct}%`;
  if (progressBlock) progressBlock.classList.toggle('hidden', onboardingState.step === 1);
  if (skipBtn) skipBtn.textContent = t('skip');

  applyCopy();
}

function applyCopy() {
  document.documentElement.lang = onboardingState.lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const value = t(key);
    if (typeof value === 'string') {
      el.textContent = value;
    }
  });

  const detailsTitle = document.getElementById('detailsTitle');
  const detailsText = document.getElementById('detailsText');
  const resultTitle = document.getElementById('resultTitle');
  const resultText = document.getElementById('resultText');
  const clientGoal = document.getElementById('clientGoal');
  const specialistGoal = document.getElementById('specialistGoal');

  if (onboardingState.role === 'client') {
    if (detailsTitle) detailsTitle.textContent = t('detailsTitleClient');
    if (detailsText) detailsText.textContent = t('detailsTextClient');
    if (resultTitle) resultTitle.textContent = t('resultTitleClient');
    if (resultText) resultText.textContent = t('resultTextClient');
  } else {
    if (detailsTitle) detailsTitle.textContent = t('detailsTitleSpecialist');
    if (detailsText) detailsText.textContent = t('detailsTextSpecialist');
    if (resultTitle) resultTitle.textContent = t('resultTitleSpecialist');
    if (resultText) resultText.textContent = t('resultTextSpecialist');
  }

  if (clientGoal) clientGoal.placeholder = t('projectPlaceholder');
  if (specialistGoal) specialistGoal.placeholder = t('specialistPlaceholder');

  updateSummary();
}

function selectLanguage(lang) {
  onboardingState.lang = normalizeLanguage(lang);
  localStorage.setItem('language', onboardingState.lang);

  document.querySelectorAll('.lang-choice').forEach(card => {
    card.classList.toggle('selected', card.dataset.lang === onboardingState.lang);
  });

  applyCopy();
  setTimeout(() => showStep(3), 180);
}

function selectRole(role) {
  onboardingState.role = role;
  localStorage.setItem('onboardingRole', role);

  document.querySelectorAll('.role-choice').forEach(card => {
    card.classList.toggle('selected', card.dataset.role === role);
  });

  const clientForm = document.getElementById('clientForm');
  const specialistForm = document.getElementById('specialistForm');

  if (clientForm) clientForm.classList.toggle('hidden', role !== 'client');
  if (specialistForm) specialistForm.classList.toggle('hidden', role !== 'specialist');

  applyCopy();
  setTimeout(() => showStep(4), 180);
}

function updateSummary() {
  const summaryLanguage = document.getElementById('summaryLanguage');
  const summaryRole = document.getElementById('summaryRole');
  const summaryFocus = document.getElementById('summaryFocus');
  const finishBtn = document.getElementById('finishBtn');

  const languageLabel = copy[onboardingState.lang].languageNames[onboardingState.lang];
  const roleLabel =
      onboardingState.role === 'client' ? t('clientRoleLabel') : t('specialistRoleLabel');

  let focus = '';

  if (onboardingState.role === 'client') {
    const projectTypeEl = document.getElementById('projectType');
    const clientGoalEl = document.getElementById('clientGoal');

    const type = projectTypeEl?.selectedOptions?.[0]?.textContent || '';
    const goal = clientGoalEl?.value.trim() || '';

    focus = t('summaryClient')(type, goal);
  } else {
    const specialistStackEl = document.getElementById('specialistStack');
    const specialistGoalEl = document.getElementById('specialistGoal');

    const stack = specialistStackEl?.selectedOptions?.[0]?.textContent || '';
    const goal = specialistGoalEl?.value.trim() || '';

    focus = t('summarySpecialist')(stack, goal);
  }

  if (summaryLanguage) summaryLanguage.textContent = languageLabel;
  if (summaryRole) summaryRole.textContent = roleLabel;
  if (summaryFocus) summaryFocus.textContent = focus;

  if (finishBtn) {
    finishBtn.setAttribute(
        'href',
        onboardingState.role === 'client' ? 'clients.html' : 'developers.html'
    );
  }
}

function initChoices() {
  document.querySelectorAll('.onboarding-next').forEach(btn => {
    btn.addEventListener('click', () => showStep(2));
  });

  document.querySelectorAll('.lang-choice').forEach(card => {
    card.addEventListener('click', () => selectLanguage(card.dataset.lang));
  });

  document.querySelectorAll('.role-choice').forEach(card => {
    card.addEventListener('click', () => selectRole(card.dataset.role));
  });

  document.querySelectorAll('.onboarding-back').forEach(btn => {
    btn.addEventListener('click', () => showStep(onboardingState.step - 1));
  });

  const detailsNext = document.getElementById('detailsNext');
  if (detailsNext) {
    detailsNext.addEventListener('click', () => {
      updateSummary();
      showStep(5);
    });
  }

  [
    'projectType',
    'budgetRange',
    'clientGoal',
    'specialistStack',
    'specialistLevel',
    'specialistGoal'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('input', updateSummary);
    el.addEventListener('change', updateSummary);
  });

  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      markOnboardingSeen();
      window.location.href = 'index.html';
    });
  }

  const finishBtn = document.getElementById('finishBtn');
  if (finishBtn) {
    finishBtn.addEventListener('click', markOnboardingSeen);
  }
}

function restoreVisualSelections() {
  onboardingState.lang = normalizeLanguage(localStorage.getItem('language') || onboardingState.lang);

  document.querySelectorAll('.lang-choice').forEach(card => {
    card.classList.toggle('selected', card.dataset.lang === onboardingState.lang);
  });

  document.querySelectorAll('.role-choice').forEach(card => {
    card.classList.toggle('selected', card.dataset.role === onboardingState.role);
  });

  const clientForm = document.getElementById('clientForm');
  const specialistForm = document.getElementById('specialistForm');

  if (clientForm) clientForm.classList.toggle('hidden', onboardingState.role !== 'client');
  if (specialistForm) specialistForm.classList.toggle('hidden', onboardingState.role !== 'specialist');
}

initChoices();
markOnboardingSeen();
restoreVisualSelections();
showStep(1);
