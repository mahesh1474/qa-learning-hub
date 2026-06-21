/* ============================================================
   API TESTING LAB LOGIC (api-lab.js)
   ============================================================ */

(function () {
  let activeMethod = 'get';
  let activeStatusFilter = 'all';

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ---------- Method tabs + panel ---------- */
  function renderMethodTabs() {
    const wrap = document.getElementById('method-tabs');
    wrap.innerHTML = API_METHOD_ORDER.map(key => {
      const m = API_METHODS[key];
      return `<button class="method-tab" data-method="${key}">${m.method}</button>`;
    }).join('');
    updateActiveTab();
  }

  function updateActiveTab() {
    document.querySelectorAll('.method-tab').forEach(t => t.classList.toggle('active', t.dataset.method === activeMethod));
  }

  function renderRows(rows) {
    if (!rows.length) return '<p class="muted" style="font-size:0.85rem">None for this request.</p>';
    return `<table class="api-param-table">${rows.map(r => `<tr><td>${r.name}</td><td>${r.value}</td><td>${r.desc}</td></tr>`).join('')}</table>`;
  }

  function renderMethodPanel() {
    const m = API_METHODS[activeMethod];
    const panel = document.getElementById('method-panel');
    const statusClass = m.responseStatus < 300 ? 's2xx' : m.responseStatus < 400 ? 's3xx' : m.responseStatus < 500 ? 's4xx' : 's5xx';

    panel.innerHTML = `
      <div class="method-panel-wrap">
        <div class="api-panel-card reveal is-visible">
          <div class="api-panel-bar">
            <span class="api-method-pill" style="background:${m.color}">${m.method}</span>
            <span class="api-endpoint">${m.endpoint}</span>
          </div>
          <div class="api-panel-body">
            <p class="api-panel-desc">${m.description}</p>

            <div class="api-meta-row">
              <div class="api-meta-label">Headers</div>
              ${renderRows(Object.entries(m.headers).map(([name, value]) => ({ name, value, desc: '' })))}
            </div>

            ${m.pathParams.length ? `<div class="api-meta-row"><div class="api-meta-label">Path Parameters</div>${renderRows(m.pathParams)}</div>` : ''}
            ${m.queryParams.length ? `<div class="api-meta-row"><div class="api-meta-label">Query Parameters</div>${renderRows(m.queryParams)}</div>` : ''}

            ${m.requestBody ? `
              <div class="api-meta-row">
                <div class="api-meta-label">Request Body</div>
                <div class="api-code-box">${escapeHtml(m.requestBody)}</div>
              </div>` : ''}
          </div>
        </div>

        <div class="api-panel-card reveal is-visible">
          <div class="api-panel-bar">
            <span class="muted mono" style="font-size:0.8rem">RESPONSE</span>
          </div>
          <div class="api-panel-body">
            <div class="api-response-status ${statusClass}"><span class="dot"></span>${m.responseStatus} ${m.responseStatus < 300 ? 'OK' : ''}</div>
            <div class="api-code-box">${escapeHtml(m.responseBody)}</div>
          </div>
        </div>
      </div>
    `;
  }

  /* ---------- Status code grid ---------- */
  function renderStatusFilter() {
    const cats = ['all', '2xx', '3xx', '4xx', '5xx'];
    const wrap = document.getElementById('status-filter');
    wrap.innerHTML = cats.map(c => `<button class="status-filter-btn ${c === activeStatusFilter ? 'active' : ''}" data-cat="${c}">${c === 'all' ? 'All' : c.toUpperCase()}</button>`).join('');
  }

  function renderStatusGrid() {
    const grid = document.getElementById('status-grid');
    const filtered = activeStatusFilter === 'all' ? STATUS_CODES : STATUS_CODES.filter(s => s.category === activeStatusFilter);
    grid.innerHTML = filtered.map(s => `
      <div class="status-card cat-${s.category} reveal is-visible">
        <div class="status-code-num">${s.code}</div>
        <div class="status-card-body">
          <h4>${s.name}</h4>
          <p>${s.desc}</p>
        </div>
      </div>
    `).join('');
  }

  /* ---------- Concepts ---------- */
  function renderConcepts() {
    const wrap = document.getElementById('api-concepts');
    wrap.innerHTML = API_CONCEPTS.map(c => `
      <div class="concept-card reveal is-visible"><h4>${c.title}</h4><p>${c.text}</p></div>
    `).join('');
  }

  /* ---------- Interview accordion ---------- */
  function diffBadgeClass(d) {
    return d === 'Beginner' ? 'badge-beginner' : d === 'Advanced' ? 'badge-advanced' : 'badge-intermediate';
  }

  function renderInterview() {
    const wrap = document.getElementById('api-interview');
    wrap.innerHTML = API_INTERVIEW_QUESTIONS.map((q, i) => `
      <div class="mini-accordion-item" data-qid="api-${i}">
        <div class="mini-accordion-q">
          <span>${q.q}</span>
          <span class="flex items-center gap-2" style="flex-shrink:0">
            <span class="badge ${diffBadgeClass(q.level)}">${q.level}</span>
            <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
          </span>
        </div>
        <div class="mini-accordion-a"><div class="mini-accordion-a-inner">${q.a}</div></div>
      </div>
    `).join('');
  }

  function bindEvents() {
    document.getElementById('method-tabs').addEventListener('click', (e) => {
      const tab = e.target.closest('.method-tab');
      if (!tab) return;
      activeMethod = tab.dataset.method;
      updateActiveTab();
      renderMethodPanel();
      QAStore.markApiLabVisited(activeMethod);
    });

    document.getElementById('status-filter').addEventListener('click', (e) => {
      const btn = e.target.closest('.status-filter-btn');
      if (!btn) return;
      activeStatusFilter = btn.dataset.cat;
      renderStatusFilter();
      renderStatusGrid();
    });

    document.getElementById('api-interview').addEventListener('click', (e) => {
      const q = e.target.closest('.mini-accordion-q');
      if (q) q.closest('.mini-accordion-item').classList.toggle('open');
    });
  }

  function init() {
    renderMethodTabs();
    renderMethodPanel();
    renderStatusFilter();
    renderStatusGrid();
    renderConcepts();
    renderInterview();
    bindEvents();
    QAStore.markApiLabVisited('lab-visited');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
