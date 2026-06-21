/* ============================================================
   QA LEARNING HUB — APP CORE (app.js)
   Shared across every page: storage, theme, nav, search, toasts.
   ============================================================ */

/* ---------------------------------------------------------
   1. STORAGE LAYER — single source of truth for progress data
   --------------------------------------------------------- */
const QAStore = (() => {
  const KEY = 'qa_hub_data_v1';

  const defaultData = () => ({
    topicsCompleted: {},      // { selenium: true, ... }
    topicProgress: {},        // { selenium: 0-100 }
    quizAttempts: [],         // [{topic, score, total, date, percentage}]
    challengesCompleted: {},  // { 'xpath-1': true, ... }
    interviewBookmarks: {},   // { 'q-id': true }
    streak: { count: 0, lastVisit: null },
    playgroundVisited: {},    // { 'text-box': true, ... }
    apiLabVisited: {},
    xp: 0,
    roadmapStepsCompleted: {}, // { 'beginner-qa:0': true, 'beginner-qa:1': true, ... }
  });

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultData();
      const parsed = JSON.parse(raw);
      return { ...defaultData(), ...parsed };
    } catch (e) {
      console.warn('QAStore: failed to load, resetting', e);
      return defaultData();
    }
  }

  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('QAStore: failed to save', e);
      return false;
    }
  }

  function get() { return load(); }

  function update(mutator) {
    const data = load();
    mutator(data);
    save(data);
    document.dispatchEvent(new CustomEvent('qa-data-changed', { detail: data }));
    return data;
  }

  function markTopicComplete(topicId) {
    return update(d => { d.topicsCompleted[topicId] = true; d.topicProgress[topicId] = 100; d.xp += 50; });
  }

  function unmarkTopicComplete(topicId) {
    return update(d => {
      d.topicsCompleted[topicId] = false;
      d.topicProgress[topicId] = 0;
      d.xp = Math.max(0, d.xp - 50);
    });
  }

  function setTopicProgress(topicId, pct) {
    return update(d => {
      d.topicProgress[topicId] = pct;
      if (pct >= 100) d.topicsCompleted[topicId] = true;
    });
  }

  function recordQuiz(topic, score, total, topicBreakdown) {
    return update(d => {
      const percentage = Math.round((score / total) * 100);
      const attempt = { topic, score, total, percentage, date: new Date().toISOString() };
      if (topicBreakdown) attempt.topicBreakdown = topicBreakdown;
      d.quizAttempts.push(attempt);
      d.xp += score * 10;
    });
  }

  function markChallengeComplete(challengeId) {
    return update(d => { d.challengesCompleted[challengeId] = true; d.xp += 25; });
  }

  function unmarkChallengeComplete(challengeId) {
    return update(d => {
      d.challengesCompleted[challengeId] = false;
      d.xp = Math.max(0, d.xp - 25);
    });
  }

  function markRoadmapStep(roadmapId, stepIndex) {
    return update(d => {
      d.roadmapStepsCompleted[`${roadmapId}:${stepIndex}`] = true;
      d.xp += 15;
    });
  }

  function unmarkRoadmapStep(roadmapId, stepIndex) {
    return update(d => {
      d.roadmapStepsCompleted[`${roadmapId}:${stepIndex}`] = false;
      d.xp = Math.max(0, d.xp - 15);
    });
  }

  function resetRoadmap(roadmapId) {
    return update(d => {
      Object.keys(d.roadmapStepsCompleted).forEach(key => {
        if (key.startsWith(`${roadmapId}:`)) delete d.roadmapStepsCompleted[key];
      });
    });
  }

  function toggleBookmark(qId) {
    return update(d => { d.interviewBookmarks[qId] = !d.interviewBookmarks[qId]; });
  }

  function markPlaygroundVisited(elId) {
    return update(d => { d.playgroundVisited[elId] = true; });
  }

  function markApiLabVisited(id) {
    return update(d => { d.apiLabVisited[id] = true; });
  }

  function touchStreak() {
    return update(d => {
      const today = new Date().toDateString();
      if (d.streak.lastVisit === today) return;
      const last = d.streak.lastVisit ? new Date(d.streak.lastVisit) : null;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (last && last.toDateString() === yesterday.toDateString()) {
        d.streak.count += 1;
      } else if (!last) {
        d.streak.count = 1;
      } else if (last.toDateString() !== today) {
        d.streak.count = 1;
      }
      d.streak.lastVisit = today;
    });
  }

  function reset() {
    localStorage.removeItem(KEY);
    document.dispatchEvent(new CustomEvent('qa-data-changed', { detail: defaultData() }));
  }

  return {
    get, update, markTopicComplete, unmarkTopicComplete, setTopicProgress, recordQuiz,
    markChallengeComplete, unmarkChallengeComplete, toggleBookmark, markPlaygroundVisited,
    markApiLabVisited, touchStreak, reset,
    markRoadmapStep, unmarkRoadmapStep, resetRoadmap,
  };
})();

/* ---------------------------------------------------------
   2. THEME
   --------------------------------------------------------- */
const QATheme = (() => {
  const KEY = 'qa_hub_theme';
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
  }
  function init() {
    const saved = localStorage.getItem(KEY);
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    apply(saved || (prefersLight ? 'light' : 'dark'));
  }
  function toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    apply(current === 'light' ? 'dark' : 'light');
  }
  return { init, toggle, apply };
})();
QATheme.init();

/* ---------------------------------------------------------
   3. TOASTS
   --------------------------------------------------------- */
const QAToast = (() => {
  let stack;
  function ensureStack() {
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      stack.setAttribute('aria-live', 'polite');
      document.body.appendChild(stack);
    }
    return stack;
  }
  const icons = { success: '✓', error: '✗', warn: '!', info: 'i' };
  function show(message, type = 'info', duration = 3200) {
    const el = ensureStack();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon mono">${icons[type] || icons.info}</span><span class="toast-msg">${message}</span>`;
    el.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
  return { show };
})();

/* ---------------------------------------------------------
   4. SCROLL REVEAL
   --------------------------------------------------------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(item => obs.observe(item));
}

/* ---------------------------------------------------------
   5. ANIMATED COUNTERS
   --------------------------------------------------------- */
function animateCounter(el, target, duration = 1200, suffix = '') {
  const start = 0;
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(start + (target - start) * eased);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-counter'), 10);
        const suffix = el.getAttribute('data-counter-suffix') || '';
        animateCounter(el, target, 1300, suffix);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => obs.observe(c));
}

/* ---------------------------------------------------------
   6. MOBILE NAV + ACTIVE LINK
   --------------------------------------------------------- */
function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  const closeBtn = document.getElementById('mobile-drawer-close');

  function openDrawer() {
    drawer?.classList.add('open');
    backdrop?.classList.add('open');
    toggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer?.classList.remove('open');
    backdrop?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (toggle && drawer) {
    toggle.addEventListener('click', openDrawer);
    closeBtn?.addEventListener('click', closeDrawer);
    backdrop?.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });
  }

  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-drawer a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) a.classList.add('active');
  });
}

/* ---------------------------------------------------------
   7. THEME TOGGLE BUTTON BINDING
   --------------------------------------------------------- */
function initThemeToggleButtons() {
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => QATheme.toggle());
  });

  document.querySelectorAll('.theme-switch').forEach(btn => {
    // aria-checked reflects "light mode is on" to match the switch's
    // visual sun/moon convention, kept in sync on every toggle.
    const syncAria = () => btn.setAttribute('aria-checked', document.documentElement.getAttribute('data-theme') === 'light' ? 'true' : 'false');
    syncAria();
    btn.addEventListener('click', () => {
      QATheme.toggle();
      syncAria();
    });
  });
}

/* ---------------------------------------------------------
   8. BACK TO TOP
   --------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 480);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------------------------------------------------------
   9. FLOATING ACTION BUTTON
   --------------------------------------------------------- */
function initFab() {
  const fab = document.getElementById('site-fab');
  if (!fab) return;
  const main = fab.querySelector('.fab-main');
  main.addEventListener('click', () => fab.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!fab.contains(e.target)) fab.classList.remove('open');
  });
}

/* ---------------------------------------------------------
   10. BASE PATH HELPER (still used by the FAB menu links)
   --------------------------------------------------------- */
function getBasePrefix() {
  return window.location.pathname.includes('/pages/') ? '../' : '';
}

/**
 * Renders a topic's icon badge — a real brand logo (via DevIcon CDN) with
 * a brand-colored glow when available, falling back to this project's own
 * custom SVG icon (assets/icons/tech/tech-icons-sprite.svg) for topics
 * without a confirmed real logo, or automatically if the real logo image
 * fails to load for any reason (e.g. no network access).
 */
function renderTopicIconBadge(topicId, sizePx) {
  const size = sizePx || 26;
  const base = getBasePrefix();
  const real = (typeof TOPIC_REAL_LOGO !== 'undefined') ? TOPIC_REAL_LOGO[topicId] : null;
  const fallbackIconId = (typeof TOPIC_ICON_MAP !== 'undefined') ? TOPIC_ICON_MAP[topicId] : null;
  const fallbackSvg = fallbackIconId
    ? `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><use href="${base}assets/icons/tech/tech-icons-sprite.svg#icon-${fallbackIconId}"></use></svg>`
    : '';

  if (real) {
    // onerror swaps in the fallback SVG and removes itself, so a CDN
    // hiccup never shows a broken-image icon to the person using the site.
    const fallbackEscaped = fallbackSvg.replace(/"/g, '&quot;');
    return `<img src="${real.src}" alt="${topicId}" width="${size}" height="${size}" style="filter:drop-shadow(0 0 6px ${real.color}66)" onerror="this.outerHTML='${fallbackEscaped}'">`;
  }
  return fallbackSvg;
}

/* ---------------------------------------------------------
   11. LOADING SCREEN
   --------------------------------------------------------- */
function initLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;
  window.addEventListener('load', () => {
    setTimeout(() => screen.classList.add('loaded'), 350);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => screen.classList.add('loaded'), 1800);
}

/* ---------------------------------------------------------
   12. STREAK + INIT
   --------------------------------------------------------- */
function injectFabAndToast() {
  if (document.getElementById('site-fab')) return;
  const base = getBasePrefix();
  const fab = document.createElement('div');
  fab.className = 'fab';
  fab.id = 'site-fab';
  fab.innerHTML = `
    <div class="fab-menu">
      <a class="fab-item" href="${base}pages/quiz-center.html"><span class="fab-item-icon">Q</span>Take a Quiz</a>
      <a class="fab-item" href="${base}pages/automation-playground.html"><span class="fab-item-icon">▢</span>Playground</a>
      <a class="fab-item" href="${base}pages/dashboard.html"><span class="fab-item-icon">◇</span>Dashboard</a>
    </div>
    <button class="fab-main" aria-label="Quick actions">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
    </button>
  `;
  document.body.appendChild(fab);
}

function injectBackToTop() {
  if (document.getElementById('back-to-top')) return;
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  document.body.appendChild(btn);
}

document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initNav();
  initThemeToggleButtons();
  initScrollReveal();
  initCounters();
  injectFabAndToast();
  injectBackToTop();
  initBackToTop();
  initFab();
  QAStore.touchStreak();
});
