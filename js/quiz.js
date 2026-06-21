/* ============================================================
   QUIZ CENTER LOGIC (quiz.js) — topic-first selection.
   One wide card per topic (all 10), each with three level
   buttons. Picking a level starts a quiz using every question
   tagged with that exact topic + level combination (5-6 per
   combination — small enough that no random sampling is needed).
   ============================================================ */

(function () {
  const TIME_PER_QUESTION = 20; // seconds

  let currentTopic = null;
  let currentLevel = null;
  let questions = [];
  let currentIndex = 0;
  let answers = [];
  let timerInterval = null;
  let timeLeft = 0;

  function topicLabel(topicId) {
    return (typeof QUIZ_TOPIC_META !== 'undefined' && QUIZ_TOPIC_META[topicId]) ? QUIZ_TOPIC_META[topicId].name : topicId;
  }

  function questionsFor(topicId, levelId) {
    return QUIZ_LEVELS[levelId].questions.filter(q => q.topic === topicId);
  }

  function bestScoreFor(topicId, levelId) {
    const data = QAStore.get();
    const key = `${topicId}:${levelId}`;
    const attempts = data.quizAttempts.filter(a => a.topic === key);
    return attempts.length ? Math.max(...attempts.map(a => a.percentage)) : null;
  }

  /* ---------- Topic selection screen (wide cards, 3 level buttons each) ---------- */
  function renderTopicGrid() {
    const grid = document.getElementById('quiz-topic-grid');

    grid.innerHTML = QUIZ_TOPIC_ORDER.map(topicId => {
      const iconHtml = renderTopicIconBadge(topicId, 28);

      const levelButtons = QUIZ_LEVEL_ORDER.map(levelId => {
        const count = questionsFor(topicId, levelId).length;
        const best = bestScoreFor(topicId, levelId);
        const levelClass = levelId === 'beginner' ? 'quiz-level-btn-beginner' : levelId === 'advanced' ? 'quiz-level-btn-advanced' : 'quiz-level-btn-intermediate';
        return `
          <button class="quiz-level-btn ${levelClass}" data-topic="${topicId}" data-level="${levelId}">
            <span class="quiz-level-btn-name">${QUIZ_LEVELS[levelId].label}</span>
            <span class="quiz-level-btn-meta">${count} Qs${best !== null ? ` · Best ${best}%` : ''}</span>
          </button>
        `;
      }).join('');

      return `
        <div class="card card-hover quiz-topic-card-wide reveal is-visible" data-topic="${topicId}">
          <div class="quiz-topic-card-head">
            <span class="topic-glyph">${iconHtml}</span>
            <h3>${topicLabel(topicId)}</h3>
          </div>
          <p class="muted quiz-topic-card-sub">Pick a level to start a focused quiz on ${topicLabel(topicId)}.</p>
          <div class="quiz-level-btn-row">${levelButtons}</div>
        </div>
      `;
    }).join('');
  }

  /* ---------- Quiz engine ---------- */
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startQuiz(topicId, levelId) {
    currentTopic = topicId;
    currentLevel = levelId;
    questions = shuffle(questionsFor(topicId, levelId));
    currentIndex = 0;
    answers = new Array(questions.length).fill(-1);

    document.getElementById('quiz-select-screen').style.display = 'none';
    document.getElementById('quiz-results-screen').style.display = 'none';
    document.getElementById('quiz-active-screen').style.display = 'block';

    renderQuestion();
  }

  function renderQuestion() {
    const q = questions[currentIndex];
    const card = document.getElementById('quiz-card');

    card.innerHTML = `
      <div class="quiz-question-text">${q.q}</div>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `
          <button class="quiz-option ${answers[currentIndex] === i ? 'selected' : ''}" data-index="${i}">
            <span class="quiz-option-letter">${String.fromCharCode(65 + i)}</span>
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
    `;

    document.getElementById('quiz-question-count').textContent = `Question ${currentIndex + 1} of ${questions.length} · ${topicLabel(currentTopic)} (${QUIZ_LEVELS[currentLevel].label})`;
    document.getElementById('quiz-progress-fill').style.width = `${(currentIndex / questions.length) * 100}%`;
    document.getElementById('quiz-prev-btn').disabled = currentIndex === 0;
    document.getElementById('quiz-prev-btn').style.opacity = currentIndex === 0 ? 0.4 : 1;
    document.getElementById('quiz-next-btn').textContent = currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next →';

    resetTimer();
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = TIME_PER_QUESTION;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        goNext();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const el = document.getElementById('quiz-timer');
    const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const s = String(timeLeft % 60).padStart(2, '0');
    el.textContent = `${m}:${s}`;
    el.classList.toggle('urgent', timeLeft <= 5);
  }

  function selectAnswer(index) {
    answers[currentIndex] = index;
    document.querySelectorAll('.quiz-option').forEach((opt, i) => opt.classList.toggle('selected', i === index));
  }

  function goNext() {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  }

  function finishQuiz() {
    clearInterval(timerInterval);
    const score = answers.reduce((acc, ans, i) => acc + (ans === questions[i].correct ? 1 : 0), 0);
    const total = questions.length;
    const percentage = Math.round((score / total) * 100);

    // Recorded under a composite "topic:level" key so per-topic-per-level
    // best scores are trackable, and a topicBreakdown of {topic: {correct,total}}
    // is still attached for the Career Dashboard's strong/weak area logic.
    const topicBreakdown = { [currentTopic]: { correct: score, total } };
    QAStore.recordQuiz(`${currentTopic}:${currentLevel}`, score, total, topicBreakdown);

    document.getElementById('quiz-active-screen').style.display = 'none';
    renderResults(score, total, percentage);
  }

  function renderResults(score, total, percentage) {
    const screen = document.getElementById('quiz-results-screen');
    const ringColor = percentage >= 70 ? 'var(--pass)' : percentage >= 40 ? 'var(--warn)' : 'var(--fail)';
    const verdict = percentage >= 70 ? 'Strong work.' : percentage >= 40 ? 'Decent — a bit more practice will help.' : `Worth revisiting ${topicLabel(currentTopic)} in the Learning Hub.`;

    const breakdown = questions.map((q, i) => {
      const userAns = answers[i];
      const correct = userAns === q.correct;
      return `
        <div class="quiz-breakdown-item ${correct ? 'correct' : 'incorrect'}">
          <div class="quiz-breakdown-q">${i + 1}. ${q.q}</div>
          <div class="quiz-breakdown-answer mono">
            <span class="assert-line ${correct ? 'pass' : 'fail'}" style="padding:0;display:inline-flex">
              <span class="status">${correct ? '✓ PASS' : '✗ FAIL'}</span>
            </span>
            — your answer: ${userAns >= 0 ? q.options[userAns] : '(no answer — timed out)'}
            ${!correct ? ` · correct: ${q.options[q.correct]}` : ''}
          </div>
          <div class="quiz-breakdown-explain">${q.explanation}</div>
        </div>
      `;
    }).join('');

    screen.style.display = 'block';
    screen.innerHTML = `
      <div class="quiz-results-card">
        <div class="quiz-score-ring" style="background:conic-gradient(${ringColor} ${percentage * 3.6}deg, var(--bg-2) 0deg)">
          <div style="background:var(--surface);width:108px;height:108px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center">
            <div class="quiz-score-num">${percentage}%</div>
            <div class="quiz-score-sub">${score}/${total} correct</div>
          </div>
        </div>
        <h2>${topicLabel(currentTopic)} — ${QUIZ_LEVELS[currentLevel].label} Quiz Complete</h2>
        <p class="muted">${verdict}</p>
        <div class="quiz-result-actions">
          <button class="btn btn-primary" id="quiz-retry-btn">Retry Quiz</button>
          <button class="btn btn-ghost" id="quiz-back-btn">Choose Another Topic</button>
        </div>
        <div class="quiz-breakdown">${breakdown}</div>
      </div>
    `;

    document.getElementById('quiz-retry-btn').addEventListener('click', () => startQuiz(currentTopic, currentLevel));
    document.getElementById('quiz-back-btn').addEventListener('click', backToSelection);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function backToSelection() {
    document.getElementById('quiz-results-screen').style.display = 'none';
    document.getElementById('quiz-active-screen').style.display = 'none';
    document.getElementById('quiz-select-screen').style.display = 'block';
    renderTopicGrid();
  }

  function bindEvents() {
    document.getElementById('quiz-topic-grid').addEventListener('click', (e) => {
      const btn = e.target.closest('.quiz-level-btn');
      if (btn) startQuiz(btn.dataset.topic, btn.dataset.level);
    });

    document.getElementById('quiz-card').addEventListener('click', (e) => {
      const opt = e.target.closest('.quiz-option');
      if (opt) selectAnswer(parseInt(opt.dataset.index, 10));
    });

    document.getElementById('quiz-next-btn').addEventListener('click', goNext);
    document.getElementById('quiz-prev-btn').addEventListener('click', goPrev);
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderTopicGrid();
    bindEvents();
  });
})();
