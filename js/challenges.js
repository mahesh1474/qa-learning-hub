/* ============================================================
   CODING CHALLENGES LOGIC (challenges.js)
   ============================================================ */

(function () {
  let activeCategory = 'xpath';

  function diffBadgeClass(d) {
    return d === 'Beginner' ? 'badge-beginner' : d === 'Advanced' ? 'badge-advanced' : 'badge-intermediate';
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderTabs() {
    const wrap = document.getElementById('ch-category-tabs');
    wrap.innerHTML = CHALLENGE_CATEGORY_ORDER.map(cat => {
      const data = CHALLENGE_DATA[cat];
      return `<button class="ch-category-tab ${cat === activeCategory ? 'active' : ''}" data-cat="${cat}"><span class="glyph-pill">${data.glyph}</span>${data.label}</button>`;
    }).join('');
  }

  function renderList() {
    const list = document.getElementById('ch-list');
    const data = QAStore.get();
    const items = CHALLENGE_DATA[activeCategory].items;

    list.innerHTML = items.map(ch => {
      const done = !!data.challengesCompleted[ch.id];
      return `
        <div class="ch-card ${done ? 'done' : ''}" data-id="${ch.id}">
          <div class="ch-card-head">
            <h3>${ch.title}</h3>
            <span class="badge ${diffBadgeClass(ch.difficulty)}">${ch.difficulty}</span>
          </div>
          <div class="ch-card-body">
            <p class="ch-prompt">${ch.prompt}</p>
            <div class="ch-html-preview">${escapeHtml(ch.html)}</div>
            <div class="ch-reveal-row">
              <button class="btn btn-ghost btn-sm ch-hint-btn">Show Hint</button>
              <button class="btn btn-ghost btn-sm ch-solution-btn">Show Solution</button>
              <button class="btn btn-primary btn-sm ch-mark-done">${done ? '✓ Completed' : 'Mark Complete'}</button>
            </div>
            <div class="ch-reveal-panel hint"><h5>Hint</h5><p>${ch.hint}</p></div>
            <div class="ch-reveal-panel solution"><h5>Solution</h5><div class="code-text">${escapeHtml(ch.solution)}</div></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function bindEvents() {
    document.getElementById('ch-category-tabs').addEventListener('click', (e) => {
      const tab = e.target.closest('.ch-category-tab');
      if (!tab) return;
      activeCategory = tab.dataset.cat;
      renderTabs();
      renderList();
    });

    document.getElementById('ch-list').addEventListener('click', (e) => {
      const card = e.target.closest('.ch-card');
      if (!card) return;

      if (e.target.closest('.ch-hint-btn')) {
        card.querySelector('.ch-reveal-panel.hint').classList.toggle('open');
      }
      if (e.target.closest('.ch-solution-btn')) {
        card.querySelector('.ch-reveal-panel.solution').classList.toggle('open');
      }
      if (e.target.closest('.ch-mark-done')) {
        const id = card.dataset.id;
        QAStore.markChallengeComplete(id);
        card.classList.add('done');
        e.target.closest('.ch-mark-done').textContent = '✓ Completed';
        QAToast.show('Challenge marked complete — +25 XP', 'success');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderTabs();
    renderList();
    bindEvents();
  });
})();
