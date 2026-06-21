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

  function isSelectorCategory(cat) {
    return cat === 'xpath' || cat === 'cssSelectors';
  }

  function renderList() {
    const list = document.getElementById('ch-list');
    const data = QAStore.get();
    const items = CHALLENGE_DATA[activeCategory].items;
    const isSelector = isSelectorCategory(activeCategory);
    const mode = activeCategory === 'xpath' ? 'xpath' : 'css';

    list.innerHTML = items.map(ch => {
      const done = !!data.challengesCompleted[ch.id];
      return `
        <div class="ch-card ${done ? 'done' : ''}" data-id="${ch.id}" data-mode="${mode}">
          <div class="ch-card-head">
            <h3>${ch.title}</h3>
            <span class="badge ${diffBadgeClass(ch.difficulty)}">${ch.difficulty}</span>
          </div>
          <div class="ch-card-body">
            <p class="ch-prompt">${ch.prompt}</p>
            <div class="ch-html-preview">${escapeHtml(ch.html)}</div>

            <div class="ch-editor-block">
              <label class="ch-editor-label" for="editor-${ch.id}">
                ${isSelector ? `Write your ${mode === 'xpath' ? 'XPath' : 'CSS selector'} here` : 'Write your code here'}
                <span class="ch-editor-mode-note">${isSelector ? 'Validated for real against the sample HTML above.' : 'Checked heuristically — not a real execution.'}</span>
              </label>
              <textarea class="ch-code-editor" id="editor-${ch.id}" rows="${isSelector ? 2 : 5}" placeholder="${isSelector ? (mode === 'xpath' ? "e.g. //button[text()='Submit']" : 'e.g. #my-id') : 'Write your Java/JS code here…'}"></textarea>
              <div class="ch-editor-actions">
                <button class="btn btn-primary btn-sm ch-validate-btn">Validate</button>
                <button class="btn btn-ghost btn-sm ch-hint-btn">Show Hint</button>
                <button class="btn btn-ghost btn-sm ch-solution-btn">Show Solution</button>
              </div>
              <div class="ch-validation-result" style="display:none"></div>
            </div>

            <div class="ch-reveal-row">
              <button class="btn btn-primary btn-sm ch-mark-done" ${done ? 'style="display:none"' : ''}>Mark Complete</button>
              <button class="btn btn-ghost btn-sm ch-unmark-done" ${done ? '' : 'style="display:none"'}>✓ Completed — Undo</button>
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
        card.querySelector('.ch-mark-done').style.display = 'none';
        card.querySelector('.ch-unmark-done').style.display = '';
        QAToast.show('Challenge marked complete — +25 XP', 'success');
        return;
      }

      if (e.target.closest('.ch-unmark-done')) {
        const id = card.dataset.id;
        QAStore.unmarkChallengeComplete(id);
        card.classList.remove('done');
        card.querySelector('.ch-unmark-done').style.display = 'none';
        card.querySelector('.ch-mark-done').style.display = '';
        QAToast.show('Challenge marked as not complete', 'info');
        return;
      }

      if (e.target.closest('.ch-validate-btn')) {
        runValidation(card);
      }
    });
  }

  function findChallengeById(id) {
    for (const cat of CHALLENGE_CATEGORY_ORDER) {
      const found = CHALLENGE_DATA[cat].items.find(c => c.id === id);
      if (found) return found;
    }
    return null;
  }

  function runValidation(card) {
    const id = card.dataset.id;
    const mode = card.dataset.mode;
    const challenge = findChallengeById(id);
    const editor = card.querySelector('.ch-code-editor');
    const resultBox = card.querySelector('.ch-validation-result');
    const userInput = editor.value;
    const isSelector = isSelectorCategory(activeCategory);

    if (typeof ChallengeValidator === 'undefined') {
      resultBox.style.display = 'block';
      resultBox.className = 'ch-validation-result error';
      resultBox.textContent = 'Validator failed to load — please refresh the page.';
      return;
    }

    let result;
    if (isSelector) {
      result = ChallengeValidator.validateSelector(challenge, userInput, mode);
    } else {
      result = ChallengeValidator.validateCodeHeuristic(challenge, userInput);
    }

    resultBox.style.display = 'block';
    resultBox.className = `ch-validation-result ${result.valid ? 'valid' : 'invalid'}`;
    const icon = result.valid ? '✓' : '✗';
    const approximateNote = result.approximate ? ' <span class="ch-approx-tag">heuristic, not a real run</span>' : '';
    resultBox.innerHTML = `<span class="ch-validation-icon">${icon}</span><span>${result.message}</span>${approximateNote}`;

    // Real (non-heuristic) validation that passes auto-marks the challenge
    // complete — heuristic passes do not, since they're not a true pass/fail.
    if (result.valid && !result.approximate) {
      const data = QAStore.get();
      if (!data.challengesCompleted[id]) {
        QAStore.markChallengeComplete(id);
        card.classList.add('done');
        card.querySelector('.ch-mark-done').style.display = 'none';
        card.querySelector('.ch-unmark-done').style.display = '';
        QAToast.show('Validated correctly — marked complete, +25 XP', 'success');
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderTabs();
    renderList();
    bindEvents();
  });
})();
