let currentLang = localStorage.getItem('language') || 'en';

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
  currentLang = lang;
  localStorage.setItem('language', lang);
  document.querySelectorAll('[data-en], [data-placeholder-en]').forEach(el => {
    const key = el.dataset.placeholderKey ? `placeholder${lang.charAt(0).toUpperCase()+lang.slice(1)}` : lang;
    const attr = el.dataset.placeholderKey ? `data-placeholder-${lang}` : `data-${lang}`;
    const text = el.getAttribute(attr);
    updateElementText(el, text);
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
  document.documentElement.lang = lang;
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

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const feedback = document.getElementById('contact-form-feedback');
  const submitButton = document.getElementById('contact-form-submit');
  const apiBases = getContactApiBases(form);

  function setFeedback(type, message) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.classList.remove('is-success', 'is-error', 'is-loading');
    if (type) feedback.classList.add(`is-${type}`);
  }

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
      setFeedback('error', messages.fullNameRequired);
      return;
    }

    if (!payload.email) {
      setFeedback('error', messages.emailRequired);
      return;
    }

    if (!payload.topic) {
      setFeedback('error', messages.topicRequired);
      return;
    }

    if (payload.message.length < 10) {
      setFeedback('error', messages.messageTooShort);
      return;
    }

    setFeedback('loading', messages.sending);
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
      setFeedback('success', messages.success);
    } catch (error) {
      const message = error instanceof TypeError ? messages.networkError : (error.message || messages.error);
      setFeedback('error', message);
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
});
