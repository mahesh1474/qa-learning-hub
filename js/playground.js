/* ============================================================
   AUTOMATION PLAYGROUND LOGIC (playground.js)
   Renders category tabs + real working widgets, and the info drawer.
   ============================================================ */

(function () {

  /* ---------------------------------------------------------
     WIDGET BUILDERS — return innerHTML for the .pg-widget-area
     --------------------------------------------------------- */
  const WIDGET_BUILDERS = {

    'text-box': () => `
      <div class="pg-row">
        <label class="pg-label" for="w-textbox">Full Name</label>
        <input class="pg-input" id="w-textbox" type="text" placeholder="e.g. Asha Rao" data-testid="text-box">
        <div class="pg-result-line" data-result="textbox"></div>
      </div>`,

    'password-field': () => `
      <div class="pg-row">
        <label class="pg-label" for="w-password">Password</label>
        <input class="pg-input" id="w-password" type="password" placeholder="••••••••" data-testid="password-field">
        <div class="pg-result-line" data-result="password"></div>
      </div>`,

    'text-area': () => `
      <div class="pg-row">
        <label class="pg-label" for="w-textarea">Comments</label>
        <textarea class="pg-input" id="w-textarea" rows="3" placeholder="Multi-line feedback…" data-testid="text-area"></textarea>
      </div>`,

    'radio-button': () => `
      <div class="pg-row">
        <span class="pg-label">Billing Cycle</span>
        <div class="pg-radio-group" data-testid="radio-group">
          <label class="pg-radio-item"><input type="radio" name="billing" value="monthly" checked> Monthly</label>
          <label class="pg-radio-item"><input type="radio" name="billing" value="yearly"> Yearly</label>
          <label class="pg-radio-item"><input type="radio" name="billing" value="lifetime"> Lifetime</label>
        </div>
        <div class="pg-result-line" data-result="radio"></div>
      </div>`,

    'checkbox': () => `
      <div class="pg-row">
        <span class="pg-label">Preferences</span>
        <div class="pg-checkbox-group" data-testid="checkbox-group">
          <label class="pg-checkbox-item"><input type="checkbox" value="newsletter"> Newsletter</label>
          <label class="pg-checkbox-item"><input type="checkbox" value="updates"> Product Updates</label>
          <label class="pg-checkbox-item"><input type="checkbox" value="terms"> I agree to the terms</label>
        </div>
        <div class="pg-result-line" data-result="checkbox"></div>
      </div>`,

    'dropdown-single': () => `
      <div class="pg-row">
        <label class="pg-label" for="w-country">Country</label>
        <select class="pg-input" id="w-country" data-testid="single-select">
          <option value="">Select…</option>
          <option value="IN">India</option>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="DE">Germany</option>
        </select>
        <div class="pg-result-line" data-result="single-select"></div>
      </div>`,

    'dropdown-multi': () => `
      <div class="pg-row">
        <label class="pg-label" for="w-skills">Skills (Ctrl/Cmd + click)</label>
        <select class="pg-input" id="w-skills" multiple data-testid="multi-select">
          <option value="selenium">Selenium</option>
          <option value="playwright">Playwright</option>
          <option value="sql">SQL</option>
          <option value="java">Java</option>
          <option value="api">API Testing</option>
        </select>
        <div class="pg-result-line" data-result="multi-select"></div>
      </div>`,

    'buttons': () => `
      <div class="pg-row" style="align-items:center">
        <button class="pg-btn-demo" id="w-submit-btn" data-testid="submit-button">Submit Once</button>
        <div class="pg-result-line" data-result="buttons"></div>
      </div>`,

    'alerts': () => `
      <div class="pg-row" style="align-items:center">
        <button class="btn btn-ghost btn-sm" id="w-alert-btn">Trigger Alert</button>
        <div class="pg-result-line" data-result="alert"></div>
      </div>`,

    'confirm-popup': () => `
      <div class="pg-row" style="align-items:center">
        <button class="btn btn-ghost btn-sm" id="w-confirm-btn">Delete Item</button>
        <div class="pg-result-line" data-result="confirm"></div>
      </div>`,

    'prompt-popup': () => `
      <div class="pg-row" style="align-items:center">
        <button class="btn btn-ghost btn-sm" id="w-prompt-btn">Rename Item</button>
        <div class="pg-result-line" data-result="prompt"></div>
      </div>`,

    'dynamic-table': () => `
      <div class="pg-row">
        <table class="pg-table" data-testid="dynamic-table">
          <thead><tr><th>ID</th><th>Tester</th><th>Status</th></tr></thead>
          <tbody id="w-dyn-table-body"></tbody>
        </table>
        <button class="btn btn-ghost btn-sm" id="w-shuffle-table" style="align-self:flex-start">Shuffle Rows</button>
      </div>`,

    'pagination': () => `
      <div class="pg-row">
        <div class="pg-result-line" data-result="pagination">Showing rows 1–3 of 9</div>
        <div class="pg-pagination" id="w-pagination" data-testid="pagination"></div>
      </div>`,

    'date-picker': () => `
      <div class="pg-row">
        <label class="pg-label" for="w-date">Booking Date</label>
        <input class="pg-input" id="w-date" type="date" data-testid="date-picker">
        <div class="pg-result-line" data-result="date"></div>
      </div>`,

    'file-upload': () => `
      <div class="pg-row">
        <label class="pg-label" for="w-file">Upload Resume</label>
        <input class="pg-input" id="w-file" type="file" data-testid="file-upload">
        <div class="pg-result-line" data-result="upload"></div>
      </div>`,

    'file-download': () => `
      <div class="pg-row" style="align-items:center">
        <a class="btn btn-ghost btn-sm" id="w-download-link" download="qa-sample-report.txt" href="data:text/plain,QA%20Learning%20Hub%20-%20Sample%20Report">Download Report</a>
        <div class="pg-result-line" data-result="download"></div>
      </div>`,

    'frames': () => `
      <div class="pg-frame-box" data-testid="frame-outer">
        <div class="pg-frame-label">iframe#payment-frame</div>
        <div class="pg-frame-inner">
          <label class="pg-label" for="w-frame-input">Card Number (inside iframe)</label>
          <input class="pg-input" id="w-frame-input" type="text" placeholder="4242 4242 4242 4242">
          <div class="pg-result-line" data-result="frame"></div>
        </div>
      </div>`,

    'nested-frames': () => `
      <div class="pg-frame-box" data-testid="frame-outer">
        <div class="pg-frame-label">iframe#outer</div>
        <div class="pg-frame-inner">
          <p class="muted" style="font-size:0.85rem">Outer frame content</p>
          <div class="pg-nested-frame" data-testid="frame-inner">
            <div class="pg-frame-label">iframe#inner</div>
            <button class="btn btn-ghost btn-sm" id="w-nested-btn" style="margin-top:0.5rem">Click Inner Button</button>
            <div class="pg-result-line" data-result="nested-frame"></div>
          </div>
        </div>
      </div>`,

    'multiple-windows': () => `
      <div class="pg-row" style="align-items:center">
        <button class="btn btn-ghost btn-sm" id="w-window-btn">Open New Window</button>
        <div class="pg-result-line" data-result="window"></div>
      </div>`,

    'multiple-tabs': () => `
      <div class="pg-row" style="align-items:center">
        <a class="btn btn-ghost btn-sm" id="w-tab-link" href="../index.html" target="_blank" rel="noopener">Open in New Tab</a>
        <div class="pg-result-line" data-result="tab">target="_blank" opens a new tab — switch using window handles.</div>
      </div>`,

    'drag-drop': () => `
      <div class="pg-dnd-area" data-testid="dnd-area">
        <div class="pg-dnd-zone" id="w-zone-a" data-zone="a">
          <div class="pg-drag-item" id="w-drag-item" draggable="true">QA</div>
          <span>Zone A</span>
        </div>
        <div class="pg-dnd-zone" id="w-zone-b" data-zone="b"><span>Zone B</span></div>
      </div>`,

    'sliders': () => `
      <div class="pg-slider-wrap">
        <input type="range" min="0" max="100" value="40" class="pg-slider" id="w-slider" data-testid="price-slider">
        <div class="pg-slider-value" id="w-slider-value">40</div>
      </div>`,

    'tooltips': () => `
      <div class="pg-tooltip-trigger" tabindex="0" data-testid="tooltip-trigger">
        <span class="pg-tooltip-icon">?</span>
        <span class="pg-tooltip-bubble" role="tooltip">This field is required</span>
      </div>`,

    'mouse-hover': () => `
      <div class="pg-hover-menu" data-testid="hover-menu">
        <div class="pg-hover-trigger">Products ▾</div>
        <div class="pg-hover-submenu">
          <a href="#">Selenium</a>
          <a href="#">Playwright</a>
          <a href="#">API Lab</a>
        </div>
      </div>`,

    'dynamic-loading': () => `
      <div class="pg-row" style="align-items:center">
        <button class="btn btn-ghost btn-sm" id="w-load-btn">Load Content</button>
        <div id="w-load-target" style="min-height:30px" data-testid="dynamic-content-target"></div>
      </div>`,

    'infinite-scroll': () => `
      <div class="pg-row">
        <div class="pg-scroll-list" id="w-scroll-list" data-testid="infinite-scroll-list"></div>
        <span class="muted" style="font-size:0.78rem">Scroll to the bottom to load more items.</span>
      </div>`,

    'shadow-dom': () => `
      <div class="shadow-host-visual">
        <div class="shadow-host-label">#shadow-host (open shadow root)</div>
        <div id="w-shadow-host"></div>
      </div>`,

    'dynamic-content': () => `
      <div class="pg-row" style="align-items:center">
        <div id="w-dynamic-banner" data-testid="banner" class="card" style="padding:1rem;width:100%;text-align:center"></div>
        <button class="btn btn-ghost btn-sm" id="w-reload-banner">Reload Content</button>
      </div>`,

    'loading-spinners': () => `
      <div class="pg-row" style="align-items:center">
        <button class="btn btn-ghost btn-sm" id="w-spinner-btn">Simulate Load</button>
        <div id="w-spinner-target" style="min-height:40px;display:flex;align-items:center;justify-content:center"></div>
      </div>`,
  };

  /* ---------------------------------------------------------
     WIDGET BEHAVIOR — attach listeners after HTML is injected
     --------------------------------------------------------- */
  const WIDGET_BEHAVIORS = {
    'text-box': (root) => {
      root.querySelector('#w-textbox').addEventListener('input', (e) => {
        root.querySelector('[data-result="textbox"]').textContent = e.target.value ? `value = "${e.target.value}"` : '';
      });
    },
    'password-field': (root) => {
      root.querySelector('#w-password').addEventListener('input', (e) => {
        root.querySelector('[data-result="password"]').textContent = `length = ${e.target.value.length}`;
      });
    },
    'radio-button': (root) => {
      root.querySelectorAll('input[name="billing"]').forEach(r => r.addEventListener('change', (e) => {
        root.querySelector('[data-result="radio"]').textContent = `selected = "${e.target.value}"`;
      }));
    },
    'checkbox': (root) => {
      root.querySelectorAll('.pg-checkbox-group input').forEach(c => c.addEventListener('change', () => {
        const checked = [...root.querySelectorAll('.pg-checkbox-group input:checked')].map(i => i.value);
        root.querySelector('[data-result="checkbox"]').textContent = `checked = [${checked.join(', ')}]`;
      }));
    },
    'dropdown-single': (root) => {
      root.querySelector('#w-country').addEventListener('change', (e) => {
        root.querySelector('[data-result="single-select"]').textContent = `selected = "${e.target.value}"`;
      });
    },
    'dropdown-multi': (root) => {
      root.querySelector('#w-skills').addEventListener('change', (e) => {
        const selected = [...e.target.selectedOptions].map(o => o.value);
        root.querySelector('[data-result="multi-select"]').textContent = `selected = [${selected.join(', ')}]`;
      });
    },
    'buttons': (root) => {
      const btn = root.querySelector('#w-submit-btn');
      btn.addEventListener('click', () => {
        btn.disabled = true;
        btn.textContent = 'Submitted ✓';
        root.querySelector('[data-result="buttons"]').textContent = 'disabled = true (further clicks have no effect)';
      });
    },
    'alerts': (root) => {
      root.querySelector('#w-alert-btn').addEventListener('click', () => {
        alert('This is a native JS alert — read its text, then accept.');
        root.querySelector('[data-result="alert"]').textContent = 'alert accepted';
      });
    },
    'confirm-popup': (root) => {
      root.querySelector('#w-confirm-btn').addEventListener('click', () => {
        const ok = confirm('Delete this item? This cannot be undone.');
        root.querySelector('[data-result="confirm"]').textContent = ok ? 'OK → item deleted' : 'Cancel → action aborted';
      });
    },
    'prompt-popup': (root) => {
      root.querySelector('#w-prompt-btn').addEventListener('click', () => {
        const name = prompt('Enter a new name for this item:', 'My Test Item');
        root.querySelector('[data-result="prompt"]').textContent = name === null ? 'prompt cancelled' : `renamed to "${name}"`;
      });
    },
    'dynamic-table': (root) => {
      const testers = ['Asha Rao', 'Liam Chen', 'Priya Singh', 'Diego Alves', 'Mei Tanaka'];
      const statuses = ['Active', 'Pending', 'Completed'];
      function render() {
        const rows = [1, 2, 3].map(() => {
          const id = Math.floor(Math.random() * 900 + 100);
          const name = testers[Math.floor(Math.random() * testers.length)];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          return `<tr><td>#${id}</td><td>${name}</td><td>${status}</td></tr>`;
        }).join('');
        root.querySelector('#w-dyn-table-body').innerHTML = rows;
      }
      render();
      root.querySelector('#w-shuffle-table').addEventListener('click', render);
    },
    'pagination': (root) => {
      const wrap = root.querySelector('#w-pagination');
      const resultEl = root.querySelector('[data-result="pagination"]');
      function render(active) {
        wrap.innerHTML = [1, 2, 3].map(p => `<button class="pg-page-btn ${p === active ? 'active' : ''}" data-page="${p}">${p}</button>`).join('');
        resultEl.textContent = `Showing rows ${(active - 1) * 3 + 1}–${active * 3} of 9`;
      }
      wrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.pg-page-btn');
        if (btn) render(parseInt(btn.dataset.page, 10));
      });
      render(1);
    },
    'date-picker': (root) => {
      root.querySelector('#w-date').addEventListener('change', (e) => {
        root.querySelector('[data-result="date"]').textContent = `value = "${e.target.value}"`;
      });
    },
    'file-upload': (root) => {
      root.querySelector('#w-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        root.querySelector('[data-result="upload"]').textContent = file ? `uploaded: ${file.name}` : '';
      });
    },
    'file-download': (root) => {
      root.querySelector('#w-download-link').addEventListener('click', () => {
        root.querySelector('[data-result="download"]').textContent = 'download triggered: qa-sample-report.txt';
      });
    },
    'frames': (root) => {
      root.querySelector('#w-frame-input').addEventListener('input', (e) => {
        root.querySelector('[data-result="frame"]').textContent = `(simulated iframe) value = "${e.target.value}"`;
      });
    },
    'nested-frames': (root) => {
      root.querySelector('#w-nested-btn').addEventListener('click', () => {
        root.querySelector('[data-result="nested-frame"]').textContent = 'clicked from 2 levels deep ✓';
      });
    },
    'multiple-windows': (root) => {
      root.querySelector('#w-window-btn').addEventListener('click', () => {
        const w = window.open('about:blank', '_blank', 'width=420,height=320');
        if (w) {
          w.document.write('<body style="font-family:sans-serif;padding:24px;background:#0B0D14;color:#fff">New window opened by QA Learning Hub.<br><br>Practice driver.switchTo().window(handle) here.</body>');
          root.querySelector('[data-result="window"]').textContent = 'new window opened — switch handles to interact with it';
        } else {
          root.querySelector('[data-result="window"]').textContent = 'popup blocked — allow popups to try this one live';
        }
      });
    },
    'drag-drop': (root) => {
      const item = root.querySelector('#w-drag-item');
      const zoneA = root.querySelector('#w-zone-a');
      const zoneB = root.querySelector('#w-zone-b');
      item.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', 'qa-item'));
      [zoneA, zoneB].forEach(zone => {
        zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
        zone.addEventListener('drop', (e) => {
          e.preventDefault();
          zone.classList.remove('drag-over');
          if (!zone.contains(item)) zone.appendChild(item);
        });
      });
    },
    'sliders': (root) => {
      const slider = root.querySelector('#w-slider');
      const value = root.querySelector('#w-slider-value');
      slider.addEventListener('input', () => value.textContent = slider.value);
    },
    'dynamic-loading': (root) => {
      root.querySelector('#w-load-btn').addEventListener('click', () => {
        const target = root.querySelector('#w-load-target');
        target.innerHTML = `<div class="pg-spinner"></div>`;
        setTimeout(() => {
          target.innerHTML = `<span class="mono" style="color:var(--pass-light)">Content loaded after 1.5s ✓</span>`;
        }, 1500);
      });
    },
    'infinite-scroll': (root) => {
      const list = root.querySelector('#w-scroll-list');
      let count = 0;
      function appendItems(n) {
        for (let i = 0; i < n; i++) {
          count++;
          const el = document.createElement('div');
          el.className = 'pg-scroll-item';
          el.textContent = `Item ${count} — loaded dynamically`;
          list.appendChild(el);
        }
      }
      appendItems(6);
      list.addEventListener('scroll', () => {
        if (list.scrollTop + list.clientHeight >= list.scrollHeight - 10) {
          appendItems(4);
        }
      });
    },
    'shadow-dom': (root) => {
      const host = root.querySelector('#w-shadow-host');
      const shadow = host.attachShadow({ mode: 'open' });
      shadow.innerHTML = `
        <style>
          button { font-family: inherit; padding: 0.6rem 1.1rem; border-radius: 8px; border: none; background: linear-gradient(135deg,#5B5FEF,#22D3EE); color: #fff; font-weight: 600; cursor: pointer; }
          p { font-family: inherit; font-size: 0.8rem; color: #8C90A8; margin-top: 8px; }
        </style>
        <button id="inner-btn">Click Inside Shadow Root</button>
        <p id="inner-result"></p>
      `;
      shadow.getElementById('inner-btn').addEventListener('click', () => {
        shadow.getElementById('inner-result').textContent = 'Clicked — reached via shadowRoot, no iframe needed ✓';
      });
    },
    'dynamic-content': (root) => {
      const messages = [
        'Save 20% on annual plans this week only.',
        'New: Playwright trace viewer walkthrough added.',
        '500+ testers practiced locators today.',
        'Reminder: explicit waits beat Thread.sleep().',
      ];
      function render() {
        const msg = messages[Math.floor(Math.random() * messages.length)];
        root.querySelector('#w-dynamic-banner').textContent = msg;
      }
      render();
      root.querySelector('#w-reload-banner').addEventListener('click', render);
    },
    'loading-spinners': (root) => {
      root.querySelector('#w-spinner-btn').addEventListener('click', () => {
        const target = root.querySelector('#w-spinner-target');
        target.innerHTML = `<div class="pg-spinner"></div>`;
        setTimeout(() => {
          target.innerHTML = `<span class="mono" style="color:var(--pass-light);font-size:0.85rem">Spinner gone — content ready ✓</span>`;
        }, 1800);
      });
    },
  };

  /* ---------------------------------------------------------
     RENDER GRID
     --------------------------------------------------------- */
  let activeCategory = 'basic';

  function renderTabs() {
    const wrap = document.getElementById('pg-category-tabs');
    wrap.innerHTML = PLAYGROUND_CATEGORY_ORDER.map(cat => {
      const count = Object.keys(PLAYGROUND_DATA[cat].items).length;
      return `<button class="pg-category-tab ${cat} ${cat === activeCategory ? 'active' : ''}" data-cat="${cat}">${PLAYGROUND_DATA[cat].label}<span class="count">${count}</span></button>`;
    }).join('');
  }

  function renderGrid() {
    const grid = document.getElementById('pg-grid');
    const data = QAStore.get();
    const items = PLAYGROUND_DATA[activeCategory].items;

    grid.innerHTML = Object.keys(items).map(key => {
      const meta = items[key];
      const visited = !!data.playgroundVisited[key];
      return `
        <div class="pg-card ${visited ? 'visited' : ''}" data-key="${key}">
          <div class="pg-card-head">
            <h3>${meta.name}</h3>
            <span class="pg-visited-badge">✓ practiced</span>
          </div>
          <div class="pg-widget-area" id="widget-${key}"></div>
          <div class="pg-card-foot">
            <button class="btn btn-ghost btn-sm pg-info-btn" data-key="${key}">View Locator Tips</button>
          </div>
        </div>
      `;
    }).join('');

    // Mount each widget + behavior
    Object.keys(items).forEach(key => {
      const container = document.getElementById(`widget-${key}`);
      if (!container || !WIDGET_BUILDERS[key]) return;
      container.innerHTML = WIDGET_BUILDERS[key]();
      if (WIDGET_BEHAVIORS[key]) {
        try { WIDGET_BEHAVIORS[key](container); } catch (e) { console.warn('Widget behavior error:', key, e); }
      }
    });
  }

  function openDrawer(key) {
    const meta = findMeta(key);
    if (!meta) return;
    QAStore.markPlaygroundVisited(key);
    document.querySelector(`.pg-card[data-key="${key}"]`)?.classList.add('visited');

    const drawer = document.getElementById('pg-drawer');
    drawer.innerHTML = `
      <button class="btn-icon pg-drawer-close" id="pg-drawer-close" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <h3>${meta.name}</h3>
      <div class="pg-drawer-section"><h4>Description</h4><p>${meta.description}</p></div>
      <div class="pg-drawer-section"><h4>Common Usage</h4><p>${meta.usage}</p></div>
      <div class="pg-drawer-section"><h4>Selenium Locator Tip</h4><div class="pg-drawer-code">${escapeHtml(meta.seleniumTip)}</div></div>
      <div class="pg-drawer-section"><h4>Playwright Locator Tip</h4><div class="pg-drawer-code">${escapeHtml(meta.playwrightTip)}</div></div>
      <div class="pg-drawer-section"><h4>Automation Challenge</h4><div class="pg-drawer-challenge">${meta.challenge}</div></div>
    `;
    document.getElementById('pg-drawer-overlay').classList.add('open');
    document.getElementById('pg-drawer-close').addEventListener('click', closeDrawer);
  }

  function closeDrawer() {
    document.getElementById('pg-drawer-overlay').classList.remove('open');
  }

  function findMeta(key) {
    for (const cat of PLAYGROUND_CATEGORY_ORDER) {
      if (PLAYGROUND_DATA[cat].items[key]) return PLAYGROUND_DATA[cat].items[key];
    }
    return null;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function bindEvents() {
    document.getElementById('pg-category-tabs').addEventListener('click', (e) => {
      const tab = e.target.closest('.pg-category-tab');
      if (!tab) return;
      activeCategory = tab.dataset.cat;
      renderTabs();
      renderGrid();
    });

    document.getElementById('pg-grid').addEventListener('click', (e) => {
      const btn = e.target.closest('.pg-info-btn');
      if (btn) openDrawer(btn.dataset.key);
    });

    document.getElementById('pg-drawer-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'pg-drawer-overlay') closeDrawer();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderTabs();
    renderGrid();
    bindEvents();
  });
})();
