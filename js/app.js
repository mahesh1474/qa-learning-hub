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

  function recordQuiz(topic, score, total) {
    return update(d => {
      const percentage = Math.round((score / total) * 100);
      d.quizAttempts.push({ topic, score, total, percentage, date: new Date().toISOString() });
      d.xp += score * 10;
    });
  }

  function markChallengeComplete(challengeId) {
    return update(d => { d.challengesCompleted[challengeId] = true; d.xp += 25; });
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
    markChallengeComplete, toggleBookmark, markPlaygroundVisited,
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

  // Mobile drawer search button opens the same global search overlay
  const mobileSearchBtn = document.getElementById('mobile-drawer-search-btn');
  if (mobileSearchBtn) {
    mobileSearchBtn.addEventListener('click', () => {
      closeDrawer();
      setTimeout(() => window.openGlobalSearch?.(), 320);
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
   10. GLOBAL SEARCH
   --------------------------------------------------------- */
const SEARCH_INDEX = [
  { title: 'Selenium', cat: 'Learning Hub', url: 'pages/learning.html#selenium', icon: 'SE' },
  { title: 'Playwright', cat: 'Learning Hub', url: 'pages/learning.html#playwright', icon: 'PW' },
  { title: 'API Testing', cat: 'Learning Hub', url: 'pages/learning.html#api-testing', icon: 'API' },
  { title: 'Java Fundamentals', cat: 'Learning Hub', url: 'pages/learning.html#java', icon: 'JV' },
  { title: 'SQL', cat: 'Learning Hub', url: 'pages/learning.html#sql', icon: 'SQL' },
  { title: 'Git', cat: 'Learning Hub', url: 'pages/learning.html#git', icon: 'GIT' },
  { title: 'Jenkins', cat: 'Learning Hub', url: 'pages/learning.html#jenkins', icon: 'JK' },
  { title: 'TestNG', cat: 'Learning Hub', url: 'pages/learning.html#testng', icon: 'TNG' },
  { title: 'JUnit', cat: 'Learning Hub', url: 'pages/learning.html#junit', icon: 'JU' },
  { title: 'Cucumber BDD', cat: 'Learning Hub', url: 'pages/learning.html#cucumber', icon: 'CK' },
  { title: 'Automation Playground', cat: 'Practice', url: 'pages/automation-playground.html', icon: '◈' },
  { title: 'API Testing Lab', cat: 'Practice', url: 'pages/api-testing-lab.html', icon: '◈' },
  { title: 'Quiz Center', cat: 'Practice', url: 'pages/quiz-center.html', icon: '◈' },
  { title: 'Coding Challenges', cat: 'Practice', url: 'pages/coding-challenges.html', icon: '◈' },
  { title: 'Interview Preparation', cat: 'Practice', url: 'pages/interview-preparation.html', icon: '◈' },
  { title: 'Dashboard', cat: 'Account', url: 'pages/dashboard.html', icon: '◇' },
  { title: 'Learning Paths & Career Roadmaps', cat: 'Site', url: 'pages/learning-paths.html', icon: '◆' },
  { title: 'Beginner QA Roadmap', cat: 'Roadmaps', url: 'pages/learning-paths.html#beginnerQA', icon: '01' },
  { title: 'Automation Test Engineer Roadmap', cat: 'Roadmaps', url: 'pages/learning-paths.html#automationEngineer', icon: '02' },
  { title: 'Playwright Specialist Roadmap', cat: 'Roadmaps', url: 'pages/learning-paths.html#playwrightSpecialist', icon: '03' },
  { title: 'API Testing Specialist Roadmap', cat: 'Roadmaps', url: 'pages/learning-paths.html#apiTestingSpecialist', icon: '04' },
  { title: 'SDET Roadmap', cat: 'Roadmaps', url: 'pages/learning-paths.html#sdet', icon: '05' },
  { title: 'QA Lead Roadmap', cat: 'Roadmaps', url: 'pages/learning-paths.html#qaLead', icon: '06' },
  { title: 'Text Box Practice', cat: 'Playground', url: 'pages/automation-playground.html#text-box', icon: '▢' },
  { title: 'Alerts & Popups', cat: 'Playground', url: 'pages/automation-playground.html#alerts', icon: '▢' },
  { title: 'Drag and Drop', cat: 'Playground', url: 'pages/automation-playground.html#drag-drop', icon: '▢' },
  { title: 'Frames & iFrames', cat: 'Playground', url: 'pages/automation-playground.html#frames', icon: '▢' },
  { title: 'Shadow DOM', cat: 'Playground', url: 'pages/automation-playground.html#shadow-dom', icon: '▢' },
  { title: 'GET Request', cat: 'API Lab', url: 'pages/api-testing-lab.html#get', icon: '▢' },
  { title: 'POST Request', cat: 'API Lab', url: 'pages/api-testing-lab.html#post', icon: '▢' },
  { title: 'Status Code Reference', cat: 'API Lab', url: 'pages/api-testing-lab.html#status-codes', icon: '▢' },
  { title: 'XPath Challenges', cat: 'Challenges', url: 'pages/coding-challenges.html#xpath', icon: '▢' },
  { title: 'CSS Selector Challenges', cat: 'Challenges', url: 'pages/coding-challenges.html#css-selectors', icon: '▢' },
  { title: 'About QA Learning Hub', cat: 'Site', url: 'pages/about.html', icon: '○' },
];

function getBasePrefix() {
  return window.location.pathname.includes('/pages/') ? '../' : '';
}

function initSearch() {
  const trigger = document.getElementById('search-trigger');
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('global-search-input');
  const results = document.getElementById('search-results');
  if (!overlay || !input || !results) return;

  const base = getBasePrefix();
  let activeIndex = -1;
  let currentList = [];

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    currentList = q
      ? SEARCH_INDEX.filter(item => item.title.toLowerCase().includes(q) || item.cat.toLowerCase().includes(q))
      : SEARCH_INDEX.slice(0, 8);
    activeIndex = -1;

    if (!currentList.length) {
      results.innerHTML = `<div class="empty-state"><div class="glyph">∅</div><h3>No results</h3><p>Try "Selenium", "API Lab", or "Quiz".</p></div>`;
      return;
    }

    results.innerHTML = currentList.map((item, i) => `
      <a class="search-result-item" data-index="${i}" href="${base}${item.url}">
        <span class="search-result-icon">${item.icon}</span>
        <span class="flex-col">
          <span class="search-result-title">${item.title}</span>
          <span class="search-result-cat">${item.cat}</span>
        </span>
      </a>
    `).join('');
  }

  function open() {
    overlay.classList.add('open');
    renderResults('');
    setTimeout(() => input.focus(), 50);
  }
  function close() {
    overlay.classList.remove('open');
    input.value = '';
  }

  // Exposed so other UI (e.g. the mobile sidebar's search button) can
  // trigger the exact same open behavior, including rendering results.
  window.openGlobalSearch = open;

  if (trigger) trigger.addEventListener('click', open);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  input.addEventListener('input', () => renderResults(input.value));

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      overlay.classList.contains('open') ? close() : open();
    }
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();

    if (overlay.classList.contains('open')) {
      const items = results.querySelectorAll('.search-result-item');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
        items.forEach((it, i) => it.classList.toggle('kbd-active', i === activeIndex));
        items[activeIndex]?.scrollIntoView({ block: 'nearest' });
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        items.forEach((it, i) => it.classList.toggle('kbd-active', i === activeIndex));
        items[activeIndex]?.scrollIntoView({ block: 'nearest' });
      }
      if (e.key === 'Enter' && activeIndex >= 0 && items[activeIndex]) {
        window.location.href = items[activeIndex].getAttribute('href');
      }
    }
  });
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
  initSearch();
  initScrollReveal();
  initCounters();
  injectFabAndToast();
  injectBackToTop();
  initBackToTop();
  initFab();
  QAStore.touchStreak();
});
