const SUPPORTED_LANGUAGES = ['en', 'ru', 'kk'];

function normalizeLanguage(lang) {
  if (typeof lang !== 'string') return 'en';
  const normalized = lang.trim().toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : 'en';
}

function getValidationMessages(lang) {
  const messages = {
    en: {
      fullNameRequired: 'Full name must be between 2 and 120 characters.',
      invalidEmail: 'Please enter a valid email address.',
      roleRequired: 'Role must be between 2 and 120 characters.',
      locationRequired: 'Location must be between 2 and 120 characters.',
      stackRequired: 'Main stack must be between 2 and 200 characters.',
      portfolioRequired: 'Portfolio / links must be between 10 and 2000 characters.',
      experienceRequired: 'Experience summary must be between 20 and 3000 characters.'
    },
    ru: {
      fullNameRequired: 'Полное имя должно содержать от 2 до 120 символов.',
      invalidEmail: 'Пожалуйста, введите корректный email адрес.',
      roleRequired: 'Роль должна содержать от 2 до 120 символов.',
      locationRequired: 'Локация должна содержать от 2 до 120 символов.',
      stackRequired: 'Основной стек должен содержать от 2 до 200 символов.',
      portfolioRequired: 'Портфолио / ссылки должны содержать от 10 до 2000 символов.',
      experienceRequired: 'Описание опыта должно содержать от 20 до 3000 символов.'
    },
    kk: {
      fullNameRequired: 'Толық аты-жөні 2 мен 120 таңба аралығында болуы керек.',
      invalidEmail: 'Дұрыс email мекенжайын енгізіңіз.',
      roleRequired: 'Рөл 2 мен 120 таңба аралығында болуы керек.',
      locationRequired: 'Орналасу 2 мен 120 таңба аралығында болуы керек.',
      stackRequired: 'Негізгі стек 2 мен 200 таңба аралығында болуы керек.',
      portfolioRequired: 'Портфолио / сілтемелер 10 мен 2000 таңба аралығында болуы керек.',
      experienceRequired: 'Тәжірибе сипаттамасы 20 мен 3000 таңба аралығында болуы керек.'
    }
  };

  return messages[normalizeLanguage(lang)];
}

function normalizeField(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateDeveloperApplicationPayload(payload = {}, lang = 'en') {
  const messages = getValidationMessages(lang);
  const fullName = normalizeField(payload.fullName);
  const email = normalizeField(payload.email);
  const role = normalizeField(payload.role);
  const location = normalizeField(payload.location);
  const mainStack = normalizeField(payload.mainStack);
  const portfolioLinks = normalizeField(payload.portfolioLinks);
  const experienceSummary = normalizeField(payload.experienceSummary);

  if (fullName.length < 2 || fullName.length > 120) {
    return { error: messages.fullNameRequired };
  }

  if (!isValidEmail(email)) {
    return { error: messages.invalidEmail };
  }

  if (role.length < 2 || role.length > 120) {
    return { error: messages.roleRequired };
  }

  if (location.length < 2 || location.length > 120) {
    return { error: messages.locationRequired };
  }

  if (mainStack.length < 2 || mainStack.length > 200) {
    return { error: messages.stackRequired };
  }

  if (portfolioLinks.length < 10 || portfolioLinks.length > 2000) {
    return { error: messages.portfolioRequired };
  }

  if (experienceSummary.length < 20 || experienceSummary.length > 3000) {
    return { error: messages.experienceRequired };
  }

  return {
    value: {
      fullName,
      email: email.toLowerCase(),
      role,
      location,
      mainStack,
      portfolioLinks,
      experienceSummary,
      status: 'new'
    }
  };
}

module.exports = {
  normalizeLanguage,
  validateDeveloperApplicationPayload
};
