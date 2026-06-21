/* ============================================================
   QUIZ CENTER LOGIC (quiz.js) — level-first selection.
   Each level (Beginner/Intermediate/Advanced) draws a random
   20-question sample from its full bank (50+ questions spanning
   all 10 topics) for each attempt.
   ============================================================ */

(function () {
  const TIME_PER_QUESTION = 20; // seconds
  const QUESTIONS_PER_ATTEMPT = 20;

  let currentLevel = null;
  let questions = [];
  let currentIndex = 0;
  let answers = []; // index per question, -1 if unanswered
  let timerInterval = null;
  let timeLeft = 0;

  function topicLabel(topicId) {
    return (typeof QUIZ_TOPIC_META !== 'undefined' && QUIZ_TOPIC_META[topicId]) ? QUIZ_TOPIC_META[topicId].name : topicId;
  }

  /* ---------- Level selection screen ---------- */
  function renderTopicGrid() {
    const grid = document.getElementById('quiz-topic-grid');
    const data = QAStore.get();

    grid.innerHTML = QUIZ_LEVEL_ORDER.map(levelId => {
      const level = QUIZ_LEVELS[levelId];
      const attempts = data.quizAttempts.filter(a => a.topic === levelId);
      const best = attempts.length ? Math.max(...attempts.map(a => a.percentage)) : null;
      const levelClass = levelId === 'beginner' ? 'badge-beginner' : levelId === 'advanced' ? 'badge-advanced' : 'badge-intermediate';
      return `
        <div class="card card-hover quiz-topic-card reveal is-visible" data-level="${levelId}">
          <div class="topic-card-top">
            <span class="badge ${levelClass}">${level.label}</span>
            <span class="badge badge-info">${level.questions.length} Qs in bank</span>
          </div>
          <h3>${level.label} Quiz</h3>
          <p class="muted" style="font-size:0.85rem">${level.description}</p>
          <p class="muted" style="font-size:0.8rem">${QUESTIONS_PER_ATTEMPT} random questions per attempt, covering all 10 topics, ${TIME_PER_QUESTION}s per question.</p>
          <div class="best-score">${best !== null ? `Best score: <strong>${best}%</strong>` : 'Not attempted yet'}</div>
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

  function startQuiz(levelId) {
    currentLevel = levelId;
    const fullBank = QUIZ_LEVELS[levelId].questions;
    questions = shuffle(fullBank).slice(0, Math.min(QUESTIONS_PER_ATTEMPT, fullBank.length));
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
      <span class="badge badge-info quiz-topic-tag">${topicLabel(q.topic)}</span>
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

    document.getElementById('quiz-question-count').textContent = `Question ${currentIndex + 1} of ${questions.length} · ${QUIZ_LEVELS[currentLevel].label}`;
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
        goNext(); // auto-advance on timeout
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

    // Build a per-topic breakdown since one level attempt spans many topics —
    // the Career Dashboard's strong/weak areas need this to mean anything.
    const topicBreakdown = {};
    questions.forEach((q, i) => {
      if (!topicBreakdown[q.topic]) topicBreakdown[q.topic] = { correct: 0, total: 0 };
      topicBreakdown[q.topic].total++;
      if (answers[i] === q.correct) topicBreakdown[q.topic].correct++;
    });

    // Recorded under the level id so per-level best-score tracking works;
    // topicBreakdown preserves the per-topic detail for the Career Dashboard.
    QAStore.recordQuiz(currentLevel, score, total, topicBreakdown);

    document.getElementById('quiz-active-screen').style.display = 'none';
    renderResults(score, total, percentage);
  }

  function renderResults(score, total, percentage) {
    const screen = document.getElementById('quiz-results-screen');
    const ringColor = percentage >= 70 ? 'var(--pass)' : percentage >= 40 ? 'var(--warn)' : 'var(--fail)';
    const verdict = percentage >= 70 ? 'Strong work.' : percentage >= 40 ? 'Decent — a bit more practice will help.' : 'Worth revisiting this level\'s topics in the Learning Hub.';

    // Per-topic mini breakdown so users see which topics need more work
    const topicScores = {};
    questions.forEach((q, i) => {
      if (!topicScores[q.topic]) topicScores[q.topic] = { correct: 0, total: 0 };
      topicScores[q.topic].total++;
      if (answers[i] === q.correct) topicScores[q.topic].correct++;
    });
    const topicSummary = Object.keys(topicScores).map(t => {
      const s = topicScores[t];
      return `<span class="career-tag ${s.correct === s.total ? 'strong' : s.correct === 0 ? 'weak' : ''}">${topicLabel(t)}: ${s.correct}/${s.total}</span>`;
    }).join('');

    const breakdown = questions.map((q, i) => {
      const userAns = answers[i];
      const correct = userAns === q.correct;
      return `
        <div class="quiz-breakdown-item ${correct ? 'correct' : 'incorrect'}">
          <div class="quiz-breakdown-q"><span class="badge badge-info" style="margin-right:0.5rem">${topicLabel(q.topic)}</span>${i + 1}. ${q.q}</div>
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
        <h2>${QUIZ_LEVELS[currentLevel].label} Quiz Complete</h2>
        <p class="muted">${verdict}</p>
        <div class="career-tag-list" style="justify-content:center;margin-bottom:var(--sp-6)">${topicSummary}</div>
        <div class="quiz-result-actions">
          <button class="btn btn-primary" id="quiz-retry-btn">Retry Quiz</button>
          <button class="btn btn-ghost" id="quiz-back-btn">Choose Another Level</button>
        </div>
        <div class="quiz-breakdown">${breakdown}</div>
      </div>
    `;

    document.getElementById('quiz-retry-btn').addEventListener('click', () => startQuiz(currentLevel));
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
      const card = e.target.closest('.quiz-topic-card');
      if (card) startQuiz(card.dataset.level);
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
