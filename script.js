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

document.addEventListener('DOMContentLoaded', () => {
  initActiveNav();
  initLanguageSwitcher();
  initCursor();
  initReveal();
  initStats();
});
