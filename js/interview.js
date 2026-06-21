/* ============================================================
   INTERVIEW PREPARATION LOGIC (interview.js)
   ============================================================ */

(function () {
  let allQuestions = [];
  let searchTerm = '';
  let topicFilter = 'all';
  let difficultyFilter = 'all';
  let bookmarksOnly = false;

  function diffBadgeClass(d) {
    return d === 'Beginner' ? 'badge-beginner' : d === 'Advanced' ? 'badge-advanced' : 'badge-intermediate';
  }

  function buildQuestionIndex() {
    const list = [];
    TOPIC_ORDER.forEach(id => {
      const t = TOPIC_DATA[id];
      t.interviewQuestions.forEach((q, i) => {
        list.push({ qid: `${id}-${i}`, topicId: id, topicName: t.name, q: q.q, a: q.a, level: q.level });
      });
    });
    if (typeof API_INTERVIEW_QUESTIONS !== 'undefined') {
      API_INTERVIEW_QUESTIONS.forEach((q, i) => {
        list.push({ qid: `apiTesting-${i}`, topicId: 'apiTesting', topicName: 'API Testing', q: q.q, a: q.a, level: q.level });
      });
    }
    return list;
  }

  function renderTopicFilterOptions() {
    const select = document.getElementById('iv-topic-filter');
    const topics = [...new Set(allQuestions.map(q => q.topicId))];
    select.innerHTML = `<option value="all">All Topics</option>` + topics.map(id => {
      const name = allQuestions.find(q => q.topicId === id).topicName;
      return `<option value="${id}">${name}</option>`;
    }).join('');
  }

  function getFiltered() {
    const data = QAStore.get();
    return allQuestions.filter(item => {
      if (topicFilter !== 'all' && item.topicId !== topicFilter) return false;
      if (difficultyFilter !== 'all' && item.level !== difficultyFilter) return false;
      if (bookmarksOnly && !data.interviewBookmarks[item.qid]) return false;
      if (searchTerm) {
        const haystack = (item.q + ' ' + item.a).toLowerCase();
        if (!haystack.includes(searchTerm.toLowerCase())) return false;
      }
      return true;
    });
  }

  function renderList() {
    const filtered = getFiltered();
    const data = QAStore.get();
    document.getElementById('iv-count').textContent = `${filtered.length} question${filtered.length === 1 ? '' : 's'} found`;

    const list = document.getElementById('iv-question-list');
    if (!filtered.length) {
      list.innerHTML = `<div class="empty-state"><div class="glyph">∅</div><h3>No matching questions</h3><p>Try a different search term or clear your filters.</p></div>`;
      return;
    }

    list.innerHTML = filtered.map(item => {
      const bookmarked = !!data.interviewBookmarks[item.qid];
      return `
        <div class="mini-accordion-item" data-qid="${item.qid}">
          <div class="mini-accordion-q">
            <span class="flex-col gap-2">
              <span>${item.q}</span>
              <span class="iv-topic-tag">${item.topicName}</span>
            </span>
            <span class="flex items-center gap-2" style="flex-shrink:0">
              <span class="badge ${diffBadgeClass(item.level)}">${item.level}</span>
              <button class="iv-bookmark-btn ${bookmarked ? 'active' : ''}" data-bookmark="${item.qid}" aria-label="Bookmark">★</button>
              <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
            </span>
          </div>
          <div class="mini-accordion-a"><div class="mini-accordion-a-inner">${item.a}</div></div>
        </div>
      `;
    }).join('');
  }

  function bindEvents() {
    document.getElementById('iv-search-input').addEventListener('input', (e) => {
      searchTerm = e.target.value;
      renderList();
    });

    document.getElementById('iv-topic-filter').addEventListener('change', (e) => {
      topicFilter = e.target.value;
      renderList();
    });

    document.getElementById('iv-difficulty-filter').addEventListener('change', (e) => {
      difficultyFilter = e.target.value;
      renderList();
    });

    document.getElementById('iv-bookmarks-toggle').addEventListener('click', (e) => {
      bookmarksOnly = !bookmarksOnly;
      e.target.classList.toggle('active', bookmarksOnly);
      renderList();
    });

    document.getElementById('iv-question-list').addEventListener('click', (e) => {
      const bookmarkBtn = e.target.closest('.iv-bookmark-btn');
      if (bookmarkBtn) {
        e.stopPropagation();
        QAStore.toggleBookmark(bookmarkBtn.dataset.bookmark);
        bookmarkBtn.classList.toggle('active');
        if (bookmarksOnly) renderList();
        return;
      }
      const q = e.target.closest('.mini-accordion-q');
      if (q) q.closest('.mini-accordion-item').classList.toggle('open');
    });
  }

  function init() {
    allQuestions = buildQuestionIndex();
    renderTopicFilterOptions();
    renderList();
    bindEvents();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
