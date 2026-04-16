const SUPPORTED_LANGUAGES = ['en', 'ru', 'kk'];

function normalizeLanguage(lang) {
  if (typeof lang !== 'string') return 'en';
  const normalized = lang.trim().toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : 'en';
}

function getValidationMessages(lang) {
  const messages = {
    en: {
      titleRequired: 'Project title must be between 3 and 120 characters.',
      budgetRequired: 'Budget is required and must be 80 characters or fewer.',
      timelineRequired: 'Timeline is required and must be 80 characters or fewer.',
      stackRequired: 'Tech stack is required and must be 200 characters or fewer.',
      descriptionRequired: 'Project description must be between 20 and 3000 characters.',
      outcomeRequired: 'Expected outcome must be between 10 and 1500 characters.'
    },
    ru: {
      titleRequired: 'Название проекта должно содержать от 3 до 120 символов.',
      budgetRequired: 'Укажите бюджет длиной не более 80 символов.',
      timelineRequired: 'Укажите срок длиной не более 80 символов.',
      stackRequired: 'Укажите технологический стек длиной не более 200 символов.',
      descriptionRequired: 'Описание проекта должно содержать от 20 до 3000 символов.',
      outcomeRequired: 'Ожидаемый результат должен содержать от 10 до 1500 символов.'
    },
    kk: {
      titleRequired: 'Жоба атауы 3 пен 120 таңба аралығында болуы керек.',
      budgetRequired: 'Бюджетті енгізіңіз, ұзындығы 80 таңбадан аспауы керек.',
      timelineRequired: 'Мерзімді енгізіңіз, ұзындығы 80 таңбадан аспауы керек.',
      stackRequired: 'Технологиялық стекті енгізіңіз, ұзындығы 200 таңбадан аспауы керек.',
      descriptionRequired: 'Жоба сипаттамасы 20 мен 3000 таңба аралығында болуы керек.',
      outcomeRequired: 'Күтілетін нәтиже 10 мен 1500 таңба аралығында болуы керек.'
    }
  };

  return messages[normalizeLanguage(lang)];
}

function normalizeField(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateProjectPayload(payload = {}, lang = 'en') {
  const messages = getValidationMessages(lang);
  const projectTitle = normalizeField(payload.projectTitle);
  const budget = normalizeField(payload.budget);
  const timeline = normalizeField(payload.timeline);
  const techStack = normalizeField(payload.techStack);
  const projectDescription = normalizeField(payload.projectDescription);
  const expectedOutcome = normalizeField(payload.expectedOutcome);

  if (projectTitle.length < 3 || projectTitle.length > 120) {
    return { error: messages.titleRequired };
  }

  if (!budget || budget.length > 80) {
    return { error: messages.budgetRequired };
  }

  if (!timeline || timeline.length > 80) {
    return { error: messages.timelineRequired };
  }

  if (!techStack || techStack.length > 200) {
    return { error: messages.stackRequired };
  }

  if (projectDescription.length < 20 || projectDescription.length > 3000) {
    return { error: messages.descriptionRequired };
  }

  if (expectedOutcome.length < 10 || expectedOutcome.length > 1500) {
    return { error: messages.outcomeRequired };
  }

  return {
    value: {
      projectTitle,
      budget,
      timeline,
      techStack,
      projectDescription,
      expectedOutcome
    }
  };
}

module.exports = {
  validateProjectPayload,
  normalizeLanguage
};
