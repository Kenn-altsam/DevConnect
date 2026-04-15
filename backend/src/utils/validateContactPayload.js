const ALLOWED_TOPICS = ['General Inquiry', 'Partnership', 'Support'];
const SUPPORTED_LANGUAGES = ['en', 'ru', 'kk'];
const TOPIC_ALIASES = {
  'General Inquiry': 'General Inquiry',
  'Общий запрос': 'General Inquiry',
  'Жалпы сұраныс': 'General Inquiry',
  Partnership: 'Partnership',
  Партнерство: 'Partnership',
  Серіктестік: 'Partnership',
  Support: 'Support',
  Поддержка: 'Support',
  Қолдау: 'Support'
};

function normalizeLanguage(lang) {
  if (typeof lang !== 'string') return 'en';
  const normalized = lang.trim().toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : 'en';
}

function getValidationMessages(lang) {
  const messages = {
    en: {
      allFieldsRequired: 'All fields are required.',
      fullNameLength: 'Full name must be between 2 and 120 characters.',
      invalidEmail: 'Please enter a valid email address.',
      invalidTopic: 'Please select a valid topic.',
      messageLength: 'Message must be between 10 and 5000 characters.'
    },
    ru: {
      allFieldsRequired: 'Все поля обязательны для заполнения.',
      fullNameLength: 'Полное имя должно содержать от 2 до 120 символов.',
      invalidEmail: 'Пожалуйста, введите корректный email адрес.',
      invalidTopic: 'Пожалуйста, выберите корректную тему.',
      messageLength: 'Сообщение должно содержать от 10 до 5000 символов.'
    },
    kk: {
      allFieldsRequired: 'Барлық өрісті толтыру міндетті.',
      fullNameLength: 'Толық аты-жөні 2 мен 120 таңба аралығында болуы керек.',
      invalidEmail: 'Дұрыс email мекенжайын енгізіңіз.',
      invalidTopic: 'Дұрыс тақырыпты таңдаңыз.',
      messageLength: 'Хабарлама 10 мен 5000 таңба аралығында болуы керек.'
    }
  };

  return messages[normalizeLanguage(lang)];
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeTopic(topic) {
  if (typeof topic !== 'string') return '';
  return TOPIC_ALIASES[topic.trim()] || '';
}

function validateContactPayload(payload = {}, lang = 'en') {
  const messages = getValidationMessages(lang);
  const fullName = typeof payload.fullName === 'string' ? payload.fullName.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const topic = normalizeTopic(payload.topic);
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';

  if (!fullName || !email || !topic || !message) {
    return { error: messages.allFieldsRequired };
  }

  if (fullName.length < 2 || fullName.length > 120) {
    return { error: messages.fullNameLength };
  }

  if (!isValidEmail(email)) {
    return { error: messages.invalidEmail };
  }

  if (!ALLOWED_TOPICS.includes(topic)) {
    return { error: messages.invalidTopic };
  }

  if (message.length < 10 || message.length > 5000) {
    return { error: messages.messageLength };
  }

  return {
    value: {
      fullName,
      email: email.toLowerCase(),
      topic,
      message
    }
  };
}

module.exports = {
  validateContactPayload,
  ALLOWED_TOPICS,
  normalizeLanguage,
  normalizeTopic
};
