/* ============================================================
   DASHBOARD LOGIC (dashboard.js)
   ============================================================ */

(function () {

  function renderStatCards() {
    const data = QAStore.get();
    const topicsCompleted = Object.values(data.topicsCompleted).filter(Boolean).length;
    const quizzesTaken = data.quizAttempts.length;
    const avgScore = quizzesTaken
      ? Math.round(data.quizAttempts.reduce((sum, a) => sum + a.percentage, 0) / quizzesTaken)
      : 0;
    const challengesDone = Object.values(data.challengesCompleted).filter(Boolean).length;

    const cards = [
      { icon: 'TOPICS', value: `${topicsCompleted}/10`, caption: 'Topics completed' },
      { icon: 'QUIZZES', value: quizzesTaken, caption: 'Quizzes attempted' },
      { icon: 'AVG SCORE', value: `${avgScore}%`, caption: 'Average quiz score' },
      { icon: 'XP', value: data.xp, caption: 'Total experience points' },
    ];

    document.getElementById('dash-stat-cards').innerHTML = cards.map(c => `
      <div class="card dash-stat-card reveal is-visible">
        <span class="stat-icon mono">${c.icon}</span>
        <span class="stat-value">${c.value}</span>
        <span class="stat-caption">${c.caption}</span>
      </div>
    `).join('');
  }

  function renderTopicProgress() {
    const data = QAStore.get();
    const wrap = document.getElementById('dash-topic-progress');
    if (typeof TOPIC_ORDER === 'undefined') { wrap.innerHTML = ''; return; }

    wrap.innerHTML = TOPIC_ORDER.map(id => {
      const t = TOPIC_DATA[id];
      const pct = data.topicProgress[id] || 0;
      return `
        <div class="dash-topic-row">
          <span class="name">${t.name}</span>
          <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
          <span class="pct">${pct}%</span>
        </div>
      `;
    }).join('');
  }

  function renderStreak() {
    const data = QAStore.get();
    const wrap = document.getElementById('dash-streak');
    wrap.innerHTML = `
      <div class="dash-streak-display">
        <div class="dash-streak-num">${data.streak.count}</div>
        <div class="dash-streak-label">
          day${data.streak.count === 1 ? '' : 's'} in a row<br>
          ${data.streak.lastVisit ? `Last visit: ${new Date(data.streak.lastVisit).toLocaleDateString()}` : 'Visit daily to build a streak'}
        </div>
      </div>
    `;
  }

  function renderQuizHistory() {
    const data = QAStore.get();
    const wrap = document.getElementById('dash-quiz-history');
    const recent = [...data.quizAttempts].reverse().slice(0, 8);

    if (!recent.length) {
      wrap.innerHTML = `<div class="empty-state"><div class="glyph">∅</div><h3>No quizzes yet</h3><p>Head to the Quiz Center to take your first one.</p></div>`;
      return;
    }

    wrap.innerHTML = recent.map(a => {
      let label = a.topic;
      const parts = String(a.topic).split(':');
      if (parts.length === 2 && typeof QUIZ_LEVELS !== 'undefined' && QUIZ_LEVELS[parts[1]]) {
        const topicName = (typeof QUIZ_TOPIC_META !== 'undefined' && QUIZ_TOPIC_META[parts[0]]) ? QUIZ_TOPIC_META[parts[0]].name : parts[0];
        label = `${topicName} — ${QUIZ_LEVELS[parts[1]].label}`;
      } else if (typeof QUIZ_LEVELS !== 'undefined' && QUIZ_LEVELS[a.topic]) {
        label = `${QUIZ_LEVELS[a.topic].label} Quiz`; // backward-compat with older level-only attempts
      }
      const scoreClass = a.percentage >= 70 ? 'good' : a.percentage < 40 ? 'bad' : '';
      return `
        <div class="dash-quiz-row">
          <span class="topic">${label}</span>
          <span class="date">${new Date(a.date).toLocaleDateString()}</span>
          <span class="score ${scoreClass}">${a.score}/${a.total} (${a.percentage}%)</span>
        </div>
      `;
    }).join('');
  }

  function renderChallenges() {
    const data = QAStore.get();
    const wrap = document.getElementById('dash-challenges');
    const ids = Object.keys(data.challengesCompleted).filter(k => data.challengesCompleted[k]);

    if (!ids.length) {
      wrap.innerHTML = `<div class="empty-state"><div class="glyph">∅</div><h3>None yet</h3><p>Visit Coding Challenges to start practicing.</p></div>`;
      return;
    }
    wrap.innerHTML = `<div class="dash-mini-list">` + ids.map(id => `<div class="dash-mini-item"><span>${id}</span><span class="mono" style="color:var(--pass-light)">✓ done</span></div>`).join('') + `</div>`;
  }

  function renderBookmarks() {
    const data = QAStore.get();
    const wrap = document.getElementById('dash-bookmarks');
    const ids = Object.keys(data.interviewBookmarks).filter(k => data.interviewBookmarks[k]);

    if (!ids.length) {
      wrap.innerHTML = `<div class="empty-state"><div class="glyph">∅</div><h3>None yet</h3><p>Star questions in Interview Prep to save them here.</p></div>`;
      return;
    }
    wrap.innerHTML = `<div class="dash-mini-list">` + ids.map(qid => {
      const [topicId] = qid.split('-');
      const topicName = typeof TOPIC_DATA !== 'undefined' && TOPIC_DATA[topicId] ? TOPIC_DATA[topicId].name : topicId;
      return `<div class="dash-mini-item"><span>${topicName} — ${qid}</span><span class="mono" style="color:var(--warn)">★</span></div>`;
    }).join('') + `</div>`;
  }

  function renderAll() {
    renderStatCards();
    renderTopicProgress();
    renderStreak();
    renderQuizHistory();
    renderChallenges();
    renderBookmarks();
  }

  function bindEvents() {
    document.getElementById('dash-reset-btn').addEventListener('click', () => {
      if (confirm('Reset all progress? This cannot be undone.')) {
        QAStore.reset();
        QAToast.show('Progress reset', 'info');
        renderAll();
      }
    });

    document.addEventListener('qa-data-changed', renderAll);
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderAll();
    bindEvents();
  });
})();
