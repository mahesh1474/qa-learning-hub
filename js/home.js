/* ============================================================
   HOME PAGE LOGIC (home.js)
   ============================================================ */

(function () {
  const HERO_LOG = [
    { status: 'PASS', target: 'describe("Selenium")', detail: '→ locator strategy verified' },
    { status: 'PASS', target: 'describe("Playwright")', detail: '→ auto-wait confirmed' },
    { status: 'PASS', target: 'describe("API Testing")', detail: '→ 12/12 status codes covered' },
    { status: 'FAIL', target: 'describe("Old habits")', detail: '→ Thread.sleep(5000) detected' },
    { status: 'PASS', target: 'describe("SQL")', detail: '→ backend validation passed' },
    { status: 'PASS', target: 'describe("You")', detail: '→ ready to start learning' },
  ];

  function renderHeroLog() {
    const el = document.getElementById('hero-assert-log');
    if (!el) return;
    el.innerHTML = HERO_LOG.map((line, i) => `
      <div class="assert-line ${line.status === 'PASS' ? 'pass' : 'fail'}" style="animation-delay:${i * 0.18 + 0.1}s">
        <span class="status mono">${line.status === 'PASS' ? '✓ PASS' : '✗ FAIL'}</span>
        <span class="target mono">${line.target}</span>
        <span class="detail mono">${line.detail}</span>
      </div>
    `).join('');
  }

  function renderTopicCards() {
    const grid = document.getElementById('topic-card-grid');
    if (!grid || typeof TOPIC_DATA === 'undefined') return;
    const data = QAStore.get();

    grid.innerHTML = TOPIC_ORDER.map((id, i) => {
      const t = TOPIC_DATA[id];
      const progress = data.topicProgress[id] || 0;
      const diffClass = t.difficulty === 'Beginner' ? 'badge-beginner' : t.difficulty === 'Advanced' ? 'badge-advanced' : 'badge-intermediate';
      return `
        <a href="pages/learning.html#${t.id}" class="card card-hover topic-card reveal" style="transition-delay:${(i % 4) * 60}ms">
          <div class="topic-card-top">
            <span class="topic-glyph">${t.glyph}</span>
            <span class="badge ${diffClass}">${t.difficulty}</span>
          </div>
          <h3>${t.name}</h3>
          <p>${t.tagline}</p>
          <div class="topic-card-progress">
            <div class="progress-label"><span>Progress</span><span>${progress}%</span></div>
            <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
          </div>
        </a>
      `;
    }).join('');

    initScrollReveal();
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderHeroLog();
    renderTopicCards();
  });
})();
