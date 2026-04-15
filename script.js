function normalizeLanguage(lang) {
  if (lang === 'kz') return 'kk';
  return ['en', 'ru', 'kk'].includes(lang) ? lang : 'en';
}

let currentLang = normalizeLanguage(localStorage.getItem('language') || 'en');

function updateElementText(el, text) {
  if (!text) return;
  if (el.dataset.placeholderKey) {
    el.placeholder = text;
    return;
  }
  if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
    el.textContent = text;
    return;
  }
  if (el.children.length === 0) {
    el.textContent = text;
    return;
  }
  let updated = false;
  Array.from(el.childNodes).forEach(node => {
    if (!updated && node.nodeType === 3 && node.textContent.trim().length >= 0) {
      node.textContent = text;
      updated = true;
    }
  });
}

function setLanguage(lang) {
  currentLang = normalizeLanguage(lang);
  localStorage.setItem('language', currentLang);
  document.querySelectorAll('[data-en], [data-placeholder-en]').forEach(el => {
    const key = el.dataset.placeholderKey ? `placeholder${currentLang.charAt(0).toUpperCase()+currentLang.slice(1)}` : currentLang;
    const attr = el.dataset.placeholderKey ? `data-placeholder-${currentLang}` : `data-${currentLang}`;
    const text = el.getAttribute(attr);
    updateElementText(el, text);
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
  });
  document.documentElement.lang = currentLang;
}

function normalizePath(path) {
  const clean = path.split('/').pop() || 'index.html';
  return clean === '' ? 'index.html' : clean;
}

function initActiveNav() {
  const current = normalizePath(window.location.pathname);
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http')) return;
    const target = normalizePath(href);
    link.classList.toggle('active-page', target === current);
  });
}

function initLanguageSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
  });
  setLanguage(currentLang);
}

function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!cursor || !ring || window.innerWidth < 769) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = `${mx - 6}px`;
    cursor.style.top = `${my - 6}px`;
  });
  function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = `${rx - 20}px`;
    ring.style.top = `${ry - 20}px`;
    requestAnimationFrame(animRing);
  }
  animRing();
  document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
      ring.style.transform = 'scale(1.5)';
      ring.style.borderColor = 'rgba(61,127,255,0.7)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      ring.style.transform = 'scale(1)';
      ring.style.borderColor = 'rgba(61,127,255,0.5)';
    });
  });
}

function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  reveals.forEach(r => obs.observe(r));
}

function animateCounter(el, target, suffix = '') {
  const dur = 1800;
  const startTime = performance.now();
  function update(now) {
    const t = Math.min((now - startTime) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.innerHTML = Math.floor(eased * target) + suffix;
    if (t < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initStats() {
  const statsBar = document.querySelector('.stats-bar');
  if (!statsBar) return;
  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        statsObs.disconnect();
        document.querySelectorAll('.stat-num').forEach(el => {
          const raw = el.textContent;
          const num = parseInt(raw.replace(/\D/g, ''), 10);
          const suffix = raw.includes('%') ? '<span>%</span>' : '<span>+</span>';
          animateCounter(el, num, suffix);
        });
      }
    });
  }, { threshold: 0.5 });
  statsObs.observe(statsBar);
}

const PUBLISHED_PROJECT_STORAGE_KEY = 'publishedProjectsPreview';

function getContactMessages(lang) {
  const messages = {
    en: {
      sending: 'Sending your request...',
      success: 'Your request has been sent successfully.',
      invalid: 'Please fill in all fields correctly.',
      error: 'Unable to send your request right now.',
      networkError: 'Unable to reach the server right now.',
      fullNameRequired: 'Please enter your full name.',
      emailRequired: 'Please enter your email.',
      topicRequired: 'Please choose a topic.',
      messageTooShort: 'Message must be at least 10 characters.'
    },
    ru: {
      sending: 'Отправляем ваш запрос...',
      success: 'Ваш запрос успешно отправлен.',
      invalid: 'Пожалуйста, корректно заполните все поля.',
      error: 'Сейчас не удалось отправить запрос.',
      networkError: 'Сейчас не удается подключиться к серверу.',
      fullNameRequired: 'Пожалуйста, укажите ваше полное имя.',
      emailRequired: 'Пожалуйста, укажите ваш email.',
      topicRequired: 'Пожалуйста, выберите тему.',
      messageTooShort: 'Сообщение должно содержать не менее 10 символов.'
    },
    kk: {
      sending: 'Сұранысыңыз жіберіліп жатыр...',
      success: 'Сұранысыңыз сәтті жіберілді.',
      invalid: 'Барлық өрісті дұрыс толтырыңыз.',
      error: 'Қазір сұранысты жіберу мүмкін болмады.',
      networkError: 'Қазір серверге қосылу мүмкін болмады.',
      fullNameRequired: 'Толық аты-жөніңізді енгізіңіз.',
      emailRequired: 'Email мекенжайыңызды енгізіңіз.',
      topicRequired: 'Тақырыпты таңдаңыз.',
      messageTooShort: 'Хабарлама кемінде 10 таңбадан тұруы керек.'
    }
  };

  return messages[lang] || messages.en;
}

function getProjectMessages(lang) {
  const messages = {
    en: {
      sending: 'Publishing your project...',
      loading: 'Loading published projects...',
      success: 'Project published successfully.',
      error: 'Unable to publish the project right now.',
      listError: 'Unable to load projects right now.',
      networkError: 'Unable to reach the server right now.',
      titleRequired: 'Please enter a project title.',
      budgetRequired: 'Please enter a budget.',
      timelineRequired: 'Please enter a timeline.',
      stackRequired: 'Please enter a tech stack.',
      descriptionRequired: 'Project description must be at least 20 characters.',
      outcomeRequired: 'Expected outcome must be at least 10 characters.',
      budgetLabel: 'Budget',
      timelineLabel: 'Timeline',
      stackLabel: 'Tech stack',
      descriptionLabel: 'Project description',
      outcomeLabel: 'Expected outcome',
      publishedNow: 'Published just now',
      publishedOn: 'Published',
      noProjects: 'No projects yet'
    },
    ru: {
      sending: 'Публикуем ваш проект...',
      loading: 'Загружаем опубликованные проекты...',
      success: 'Проект успешно опубликован.',
      error: 'Сейчас не удалось опубликовать проект.',
      listError: 'Сейчас не удалось загрузить проекты.',
      networkError: 'Сейчас не удается подключиться к серверу.',
      titleRequired: 'Пожалуйста, укажите название проекта.',
      budgetRequired: 'Пожалуйста, укажите бюджет.',
      timelineRequired: 'Пожалуйста, укажите срок.',
      stackRequired: 'Пожалуйста, укажите технологический стек.',
      descriptionRequired: 'Описание проекта должно содержать не менее 20 символов.',
      outcomeRequired: 'Ожидаемый результат должен содержать не менее 10 символов.',
      budgetLabel: 'Бюджет',
      timelineLabel: 'Срок',
      stackLabel: 'Технологический стек',
      descriptionLabel: 'Описание проекта',
      outcomeLabel: 'Ожидаемый результат',
      publishedNow: 'Опубликовано только что',
      publishedOn: 'Опубликовано',
      noProjects: 'Пока нет проектов'
    },
    kk: {
      sending: 'Жобаңыз жарияланып жатыр...',
      loading: 'Жарияланған жобалар жүктеліп жатыр...',
      success: 'Жоба сәтті жарияланды.',
      error: 'Қазір жобаны жариялау мүмкін болмады.',
      listError: 'Қазір жобаларды жүктеу мүмкін болмады.',
      networkError: 'Қазір серверге қосылу мүмкін болмады.',
      titleRequired: 'Жоба атауын енгізіңіз.',
      budgetRequired: 'Бюджетті енгізіңіз.',
      timelineRequired: 'Мерзімді енгізіңіз.',
      stackRequired: 'Технологиялық стекті енгізіңіз.',
      descriptionRequired: 'Жоба сипаттамасы кемінде 20 таңбадан тұруы керек.',
      outcomeRequired: 'Күтілетін нәтиже кемінде 10 таңбадан тұруы керек.',
      budgetLabel: 'Бюджет',
      timelineLabel: 'Мерзім',
      stackLabel: 'Технологиялық стек',
      descriptionLabel: 'Жоба сипаттамасы',
      outcomeLabel: 'Күтілетін нәтиже',
      publishedNow: 'Жаңа ғана жарияланды',
      publishedOn: 'Жарияланған уақыты',
      noProjects: 'Әзірге жобалар жоқ'
    }
  };

  return messages[lang] || messages.en;
}

function getContactApiBases(form) {
  const explicitBase = (form.dataset.apiBase || '').trim().replace(/\/$/, '');
  if (explicitBase) return [explicitBase];

  const { protocol, hostname, origin } = window.location;
  const candidates = [];

  function addCandidate(value) {
    const normalized = String(value || '').trim().replace(/\/$/, '');
    if (!normalized || normalized === 'null' || candidates.includes(normalized)) return;
    candidates.push(normalized);
  }

  if (protocol === 'file:') {
    addCandidate('http://localhost:3000');
    addCandidate('http://127.0.0.1:3000');
    return candidates;
  }

  addCandidate(origin);

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    addCandidate(`${window.location.protocol}//${hostname}:3000`);
    addCandidate(hostname === 'localhost' ? 'http://127.0.0.1:3000' : 'http://localhost:3000');
    return candidates;
  }

  addCandidate('http://localhost:3000');
  addCandidate('http://127.0.0.1:3000');
  return candidates;
}

function setFeedbackMessage(feedback, type, message) {
  if (!feedback) return;
  feedback.textContent = message;
  feedback.classList.remove('is-success', 'is-error', 'is-loading');
  if (type) feedback.classList.add(`is-${type}`);
}

function readPublishedProjectPreview() {
  try {
    const raw = localStorage.getItem(PUBLISHED_PROJECT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function storePublishedProjectPreview(project) {
  const preview = readPublishedProjectPreview()
    .filter(item => item && item.id !== project.id)
    .slice(0, 11);
  preview.unshift(project);
  localStorage.setItem(PUBLISHED_PROJECT_STORAGE_KEY, JSON.stringify(preview));
}

function mergeProjects(primary, preview) {
  const seen = new Set();
  const merged = [];

  [...preview, ...primary].forEach(project => {
    if (!project || !project.id || seen.has(project.id)) return;
    seen.add(project.id);
    merged.push(project);
  });

  merged.sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : Number.MAX_SAFE_INTEGER;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : Number.MAX_SAFE_INTEGER;
    return bTime - aTime;
  });

  return merged;
}

function formatPublishedDate(isoValue, lang, messages) {
  if (!isoValue) return messages.publishedNow;
  try {
    return new Intl.DateTimeFormat(lang, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(isoValue));
  } catch (_error) {
    return isoValue;
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createProjectCard(project, lang) {
  const messages = getProjectMessages(lang);
  const article = document.createElement('article');
  article.className = 'project-tile';
  article.innerHTML = `
    <div class="project-tile-top">
      <span class="project-meta-chip">${escapeHtml(project.budget)}</span>
      <span class="project-meta-chip">${escapeHtml(project.timeline)}</span>
    </div>
    <h3>${escapeHtml(project.projectTitle)}</h3>
    <p class="project-tile-stack"><strong>${escapeHtml(messages.stackLabel)}:</strong> ${escapeHtml(project.techStack)}</p>
    <p class="project-tile-copy"><strong>${escapeHtml(messages.descriptionLabel)}:</strong> ${escapeHtml(project.projectDescription)}</p>
    <p class="project-tile-copy"><strong>${escapeHtml(messages.outcomeLabel)}:</strong> ${escapeHtml(project.expectedOutcome)}</p>
    <div class="project-tile-footer">
      <span>${escapeHtml(messages.publishedOn)}: ${escapeHtml(formatPublishedDate(project.createdAt, lang, messages))}</span>
    </div>
  `;
  return article;
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const feedback = document.getElementById('contact-form-feedback');
  const submitButton = document.getElementById('contact-form-submit');
  const apiBases = getContactApiBases(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const messages = getContactMessages(currentLang);
    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get('fullName') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      topic: String(formData.get('topic') || '').trim(),
      message: String(formData.get('message') || '').trim()
    };

    if (!payload.fullName) {
      setFeedbackMessage(feedback, 'error', messages.fullNameRequired);
      return;
    }

    if (!payload.email) {
      setFeedbackMessage(feedback, 'error', messages.emailRequired);
      return;
    }

    if (!payload.topic) {
      setFeedbackMessage(feedback, 'error', messages.topicRequired);
      return;
    }

    if (payload.message.length < 10) {
      setFeedbackMessage(feedback, 'error', messages.messageTooShort);
      return;
    }

    setFeedbackMessage(feedback, 'loading', messages.sending);
    submitButton.disabled = true;

    try {
      let response;
      let networkError = null;

      for (const apiBase of apiBases) {
        try {
          response = await fetch(`${apiBase}/api/contact`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept-Language': currentLang
            },
            body: JSON.stringify(payload)
          });
          networkError = null;
          break;
        } catch (error) {
          networkError = error;
        }
      }

      if (!response) {
        throw networkError || new Error(messages.networkError);
      }

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || messages.error);
      }

      form.reset();
      setFeedbackMessage(feedback, 'success', messages.success);
    } catch (error) {
      const message = error instanceof TypeError ? messages.networkError : (error.message || messages.error);
      setFeedbackMessage(feedback, 'error', message);
    } finally {
      submitButton.disabled = false;
    }
  });
}

async function fetchProjects(apiBase) {
  const response = await fetch(`${apiBase}/api/projects`, {
    headers: {
      'Accept-Language': currentLang
    }
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.message || getProjectMessages(currentLang).listError);
  }
  return result.projects || [];
}

function initProjectsList() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const feedback = document.getElementById('projects-list-feedback');
  const emptyState = document.getElementById('projects-empty-state');
  const apiBases = getContactApiBases(grid);

  function render(projects) {
    const messages = getProjectMessages(currentLang);
    grid.innerHTML = '';
    projects.forEach(project => {
      grid.appendChild(createProjectCard(project, currentLang));
    });
    if (emptyState) emptyState.style.display = projects.length ? 'none' : 'grid';
    if (!projects.length) {
      setFeedbackMessage(feedback, '', messages.noProjects);
    } else {
      setFeedbackMessage(feedback, '', '');
    }
  }

  (async () => {
    const messages = getProjectMessages(currentLang);
    setFeedbackMessage(feedback, 'loading', messages.loading);

    try {
      let projects = [];
      let networkError = null;

      for (const apiBase of apiBases) {
        try {
          projects = await fetchProjects(apiBase);
          networkError = null;
          break;
        } catch (error) {
          networkError = error;
        }
      }

      if (networkError && !projects.length) {
        throw networkError;
      }

      render(mergeProjects(projects, readPublishedProjectPreview()));
    } catch (error) {
      const message = error instanceof TypeError ? messages.networkError : (error.message || messages.listError);
      setFeedbackMessage(feedback, 'error', message);
      if (emptyState) emptyState.style.display = 'grid';
    }
  })();
}

function initProjectForm() {
  const form = document.getElementById('project-form');
  if (!form) return;

  const feedback = document.getElementById('project-form-feedback');
  const submitButton = document.getElementById('project-form-submit');
  const apiBases = getContactApiBases(form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const messages = getProjectMessages(currentLang);
    const formData = new FormData(form);
    const payload = {
      projectTitle: String(formData.get('projectTitle') || '').trim(),
      budget: String(formData.get('budget') || '').trim(),
      timeline: String(formData.get('timeline') || '').trim(),
      techStack: String(formData.get('techStack') || '').trim(),
      projectDescription: String(formData.get('projectDescription') || '').trim(),
      expectedOutcome: String(formData.get('expectedOutcome') || '').trim()
    };

    if (!payload.projectTitle) {
      setFeedbackMessage(feedback, 'error', messages.titleRequired);
      return;
    }

    if (!payload.budget) {
      setFeedbackMessage(feedback, 'error', messages.budgetRequired);
      return;
    }

    if (!payload.timeline) {
      setFeedbackMessage(feedback, 'error', messages.timelineRequired);
      return;
    }

    if (!payload.techStack) {
      setFeedbackMessage(feedback, 'error', messages.stackRequired);
      return;
    }

    if (payload.projectDescription.length < 20) {
      setFeedbackMessage(feedback, 'error', messages.descriptionRequired);
      return;
    }

    if (payload.expectedOutcome.length < 10) {
      setFeedbackMessage(feedback, 'error', messages.outcomeRequired);
      return;
    }

    setFeedbackMessage(feedback, 'loading', messages.sending);
    submitButton.disabled = true;

    try {
      let response;
      let networkError = null;

      for (const apiBase of apiBases) {
        try {
          response = await fetch(`${apiBase}/api/projects`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept-Language': currentLang
            },
            body: JSON.stringify(payload)
          });
          networkError = null;
          break;
        } catch (error) {
          networkError = error;
        }
      }

      if (!response) {
        throw networkError || new Error(messages.networkError);
      }

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || messages.error);
      }

      if (result.project) {
        storePublishedProjectPreview(result.project);
      }

      form.reset();
      setFeedbackMessage(feedback, 'success', result.message || messages.success);
    } catch (error) {
      const message = error instanceof TypeError ? messages.networkError : (error.message || messages.error);
      setFeedbackMessage(feedback, 'error', message);
    } finally {
      submitButton.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initActiveNav();
  initLanguageSwitcher();
  initCursor();
  initReveal();
  initStats();
  initContactForm();
  initProjectForm();
  initProjectsList();
});
