/* ============================================================
   LEARNING HUB PAGE LOGIC (learning.js)
   ============================================================ */

(function () {
  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'examples', label: 'Code Examples' },
    { id: 'practices', label: 'Best Practices' },
    { id: 'interview', label: 'Interview Questions' },
    { id: 'roadmap', label: 'Roadmap' },
  ];

  function diffBadgeClass(d) {
    return d === 'Beginner' ? 'badge-beginner' : d === 'Advanced' ? 'badge-advanced' : 'badge-intermediate';
  }

  function renderSidebar() {
    const sidebar = document.getElementById('topic-sidebar');
    const data = QAStore.get();
    sidebar.innerHTML = TOPIC_ORDER.map(id => {
      const t = TOPIC_DATA[id];
      const completed = !!data.topicsCompleted[id];
      return `
        <button class="sidebar-item ${completed ? 'completed' : ''}" data-topic="${id}">
          <span class="topic-glyph">${t.glyph}</span>
          <span class="sidebar-item-name">${t.name}</span>
          <span class="sidebar-item-check">✓</span>
        </button>
      `;
    }).join('');
  }

  function renderExamples(examples) {
    return examples.map(ex => `
      <div class="example-block">
        <div class="example-title">${ex.title}</div>
        <div class="code-block">
          <div class="code-block-bar"><button class="copy-btn" data-code="${encodeURIComponent(ex.code)}">Copy</button></div>
          <pre>${escapeHtml(ex.code)}</pre>
        </div>
      </div>
    `).join('');
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderInterviewQs(questions, topicId) {
    return `<div class="mini-accordion">` + questions.map((q, i) => `
      <div class="mini-accordion-item" data-qid="${topicId}-${i}">
        <div class="mini-accordion-q">
          <span>${q.q}</span>
          <span class="flex items-center gap-2" style="flex-shrink:0">
            <span class="badge ${diffBadgeClass(q.level)}">${q.level}</span>
            <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
          </span>
        </div>
        <div class="mini-accordion-a"><div class="mini-accordion-a-inner">${q.a}</div></div>
      </div>
    `).join('') + `</div>`;
  }

  function renderRoadmap(steps) {
    return `<div class="mini-roadmap">` + steps.map((step, i) => `
      <div class="mini-roadmap-item">
        <span class="mini-roadmap-num">${i + 1}</span>
        <span>${step}</span>
      </div>
    `).join('') + `</div>`;
  }

  function renderPanel(id) {
    const t = TOPIC_DATA[id];
    const data = QAStore.get();
    const progress = data.topicProgress[id] || 0;

    return `
      <div class="topic-panel" id="panel-${id}" data-topic="${id}">
        <div class="topic-panel-head">
          <div>
            <span class="badge ${diffBadgeClass(t.difficulty)}">${t.difficulty}</span>
            <h2>${t.name}</h2>
            <p class="tagline">${t.tagline}</p>
          </div>
          <div class="topic-panel-progress">
            <div class="progress-label"><span>Your progress</span><span class="progress-pct">${progress}%</span></div>
            <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
            <div class="topic-progress-actions">
              <button class="btn btn-primary btn-sm topic-mark-complete" data-topic="${id}" ${progress >= 100 ? 'style="display:none"' : ''}>
                Mark as Complete
              </button>
              <button class="btn btn-ghost btn-sm topic-unmark-complete" data-topic="${id}" ${progress >= 100 ? '' : 'style="display:none"'}>
                ✓ Completed — Undo
              </button>
            </div>
          </div>
        </div>

        <div class="topic-tabs" role="tablist">
          ${TABS.map((tab, i) => `<button class="topic-tab ${i === 0 ? 'active' : ''}" data-tab="${tab.id}" role="tab">${tab.label}</button>`).join('')}
        </div>

        <div class="topic-section active" data-section="overview">
          <p class="intro-text">${t.intro}</p>
          <div class="concept-grid">
            ${t.concepts.map(c => `<div class="concept-card"><h4>${c.title}</h4><p>${c.text}</p></div>`).join('')}
          </div>
        </div>

        <div class="topic-section" data-section="examples">
          ${renderExamples(t.examples)}
        </div>

        <div class="topic-section" data-section="practices">
          <div class="practice-list">
            ${t.bestPractices.map(p => `<div class="practice-item"><span class="check mono">✓</span><span>${p}</span></div>`).join('')}
          </div>
        </div>

        <div class="topic-section" data-section="interview">
          ${renderInterviewQs(t.interviewQuestions, id)}
        </div>

        <div class="topic-section" data-section="roadmap">
          ${renderRoadmap(t.roadmap)}
        </div>
      </div>
    `;
  }

  function renderAllPanels() {
    const container = document.getElementById('topic-panels');
    container.innerHTML = TOPIC_ORDER.map(id => renderPanel(id)).join('');
  }

  function activateTopic(id) {
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.toggle('active', item.dataset.topic === id);
    });
    document.querySelectorAll('.topic-panel').forEach(panel => {
      panel.classList.toggle('active', panel.dataset.topic === id);
    });
    history.replaceState(null, '', `#${id}`);
  }

  function activateTab(panel, tabId) {
    panel.querySelectorAll('.topic-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
    panel.querySelectorAll('.topic-section').forEach(s => s.classList.toggle('active', s.dataset.section === tabId));
  }

  function bindEvents() {
    document.getElementById('topic-sidebar').addEventListener('click', (e) => {
      const item = e.target.closest('.sidebar-item');
      if (item) {
        activateTopic(item.dataset.topic);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    const panels = document.getElementById('topic-panels');

    panels.addEventListener('click', (e) => {
      const tab = e.target.closest('.topic-tab');
      if (tab) {
        activateTab(tab.closest('.topic-panel'), tab.dataset.tab);
        return;
      }

      const accordionQ = e.target.closest('.mini-accordion-q');
      if (accordionQ) {
        accordionQ.closest('.mini-accordion-item').classList.toggle('open');
        return;
      }

      const copyBtn = e.target.closest('.copy-btn');
      if (copyBtn) {
        const code = decodeURIComponent(copyBtn.dataset.code);
        navigator.clipboard?.writeText(code).then(() => {
          QAToast.show('Code copied to clipboard', 'success');
        }).catch(() => QAToast.show('Could not copy — select manually', 'error'));
        return;
      }

      const markBtn = e.target.closest('.topic-mark-complete');
      if (markBtn) {
        const id = markBtn.dataset.topic;
        QAStore.markTopicComplete(id);
        QAToast.show(`${TOPIC_DATA[id].name} marked complete — +50 XP`, 'success');
        refreshProgressUI(id);
        renderSidebar();
        rebindSidebarActive(id);
        return;
      }

      const unmarkBtn = e.target.closest('.topic-unmark-complete');
      if (unmarkBtn) {
        const id = unmarkBtn.dataset.topic;
        QAStore.unmarkTopicComplete(id);
        QAToast.show(`${TOPIC_DATA[id].name} marked as not complete`, 'info');
        refreshProgressUI(id);
        renderSidebar();
        rebindSidebarActive(id);
      }
    });
  }

  function refreshProgressUI(id) {
    const data = QAStore.get();
    const progress = data.topicProgress[id] || 0;
    const panel = document.getElementById(`panel-${id}`);
    if (!panel) return;
    panel.querySelector('.progress-pct').textContent = `${progress}%`;
    panel.querySelector('.progress-fill').style.width = `${progress}%`;
    const markBtn = panel.querySelector('.topic-mark-complete');
    const unmarkBtn = panel.querySelector('.topic-unmark-complete');
    const isComplete = progress >= 100;
    markBtn.style.display = isComplete ? 'none' : '';
    unmarkBtn.style.display = isComplete ? '' : 'none';
  }

  function rebindSidebarActive(activeId) {
    document.querySelectorAll('.sidebar-item').forEach(item => {
      item.classList.toggle('active', item.dataset.topic === activeId);
    });
  }

  /* ---------------------------------------------------------
     ASK THE HUB — rule-based Q&A widget
     --------------------------------------------------------- */
  function renderAskHubResults(query) {
    const wrap = document.getElementById('ask-hub-results');
    if (typeof QAEngine === 'undefined') {
      wrap.innerHTML = `<div class="empty-state"><div class="glyph">∅</div><h3>Search unavailable</h3><p>The Q&amp;A engine didn't load correctly.</p></div>`;
      return;
    }

    const results = QAEngine.search(query, 4);

    if (!results.length) {
      wrap.innerHTML = `
        <div class="empty-state ask-hub-empty">
          <div class="glyph">∅</div>
          <h3>No close match found</h3>
          <p>Try rephrasing, or browse the topic directly in the sidebar — this searches existing concepts and interview questions, not the open web.</p>
        </div>
      `;
      return;
    }

    wrap.innerHTML = `<div class="ask-hub-result-list">` + results.map((r, i) => `
      <div class="ask-hub-result-card" data-topic="${r.topicId}" style="animation-delay:${i * 0.06}s">
        <div class="ask-hub-result-head">
          <span class="badge badge-info">${r.topicName}</span>
          <span class="ask-hub-result-type">${r.type === 'interview' ? 'Interview Q&A' : r.type === 'practice' ? 'Best Practice' : 'Concept'}</span>
        </div>
        <h4>${r.title}</h4>
        <p>${r.answer}</p>
        <button class="btn btn-ghost btn-sm ask-hub-jump-btn" data-topic="${r.topicId}">Open ${r.topicName} in Learning Hub →</button>
      </div>
    `).join('') + `</div>`;
  }

  function bindAskHub() {
    const input = document.getElementById('ask-hub-input');
    const submitBtn = document.getElementById('ask-hub-submit');
    const resultsWrap = document.getElementById('ask-hub-results');
    if (!input || !submitBtn) return;

    function runSearch() {
      const query = input.value.trim();
      if (!query) return;
      renderAskHubResults(query);
    }

    submitBtn.addEventListener('click', runSearch);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') runSearch();
    });

    resultsWrap.addEventListener('click', (e) => {
      const jumpBtn = e.target.closest('.ask-hub-jump-btn');
      if (jumpBtn) {
        activateTopic(jumpBtn.dataset.topic);
        document.getElementById('topic-panels').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  function init() {
    renderSidebar();
    renderAllPanels();
    bindEvents();
    bindAskHub();

    const hash = window.location.hash.replace('#', '');
    const initial = TOPIC_ORDER.includes(hash) ? hash : TOPIC_ORDER[0];
    activateTopic(initial);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
