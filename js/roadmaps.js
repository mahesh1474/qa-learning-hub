/* ============================================================
   LEARNING PATHS & CAREER ROADMAPS LOGIC (roadmaps.js)
   ============================================================ */

(function () {

  /* ---------------------------------------------------------
     Helpers shared across sections
     --------------------------------------------------------- */
  function getRoadmapProgress(roadmapId) {
    const data = QAStore.get();
    const roadmap = ROADMAP_DATA[roadmapId];
    const allSteps = roadmap.phases.flatMap(p => p.steps);
    const completedCount = allSteps.filter((_, i) => data.roadmapStepsCompleted[`${roadmapId}:${i}`]).length;
    return { completedCount, total: allSteps.length, pct: Math.round((completedCount / allSteps.length) * 100) };
  }

  // Maps a roadmap's flat step index back to its (phaseIndex, stepIndexInPhase)
  function flattenStepsWithIndex(roadmap) {
    let flatIndex = 0;
    return roadmap.phases.map((phase, phaseIdx) => ({
      phase,
      phaseIdx,
      steps: phase.steps.map(name => ({ name, flatIndex: flatIndex++ })),
    }));
  }

  function topicNameFromId(id) {
    return (typeof TOPIC_DATA !== 'undefined' && TOPIC_DATA[id]) ? TOPIC_DATA[id].name : id;
  }

  function challengeCategoryLabel(catId) {
    if (typeof CHALLENGE_DATA !== 'undefined' && CHALLENGE_DATA[catId]) return CHALLENGE_DATA[catId].label;
    return catId;
  }

  /* ---------------------------------------------------------
     SECTION 1 — Roadmap cards grid
     --------------------------------------------------------- */
  function renderRoadmapCards() {
    const grid = document.getElementById('roadmap-card-grid');
    grid.innerHTML = ROADMAP_ORDER.map(id => {
      const r = ROADMAP_DATA[id];
      const progress = getRoadmapProgress(id);
      return `
        <div class="card card-hover roadmap-card reveal is-visible" data-roadmap="${id}">
          <div class="roadmap-card-accent" style="background:${r.color}"></div>
          <div class="roadmap-card-top">
            <span class="roadmap-glyph">${r.glyph}</span>
          </div>
          <h3>${r.name}</h3>
          <span class="audience">${r.audience}</span>
          <p class="description">${r.description}</p>
          <div class="roadmap-card-meta">
            <span>${r.duration}</span>
            <span>${r.phases.length} phases · ${progress.total} steps</span>
          </div>
          <div class="roadmap-card-progress-track">
            <div class="roadmap-card-progress-label"><span>Progress</span><span>${progress.pct}%</span></div>
            <div class="progress-track"><div class="progress-fill" style="width:${progress.pct}%;background:${r.color}"></div></div>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ---------------------------------------------------------
     SECTION 1b — Roadmap detail view
     --------------------------------------------------------- */
  function renderRecommendations(roadmap) {
    const quizLinks = roadmap.recommendedQuizTopics.length
      ? roadmap.recommendedQuizTopics.map(t => `<a href="quiz-center.html">${topicNameFromId(t)} Quiz</a>`).join('')
      : `<span class="none">No quizzes mapped to this roadmap yet.</span>`;

    const challengeLinks = roadmap.recommendedChallengeCategories.length
      ? roadmap.recommendedChallengeCategories.map(c => `<a href="coding-challenges.html">${challengeCategoryLabel(c)}</a>`).join('')
      : `<span class="none">No challenges mapped to this roadmap yet.</span>`;

    const interviewLinks = roadmap.recommendedInterviewTopics.length
      ? roadmap.recommendedInterviewTopics.map(t => `<a href="interview-preparation.html">${topicNameFromId(t)} Questions</a>`).join('')
      : `<span class="none">No interview questions mapped yet.</span>`;

    return `
      <div class="roadmap-recommend-grid">
        <div class="roadmap-recommend-card"><h5>Recommended Quizzes</h5>${quizLinks}</div>
        <div class="roadmap-recommend-card"><h5>Recommended Challenges</h5>${challengeLinks}</div>
        <div class="roadmap-recommend-card"><h5>Recommended Interview Qs</h5>${interviewLinks}</div>
      </div>
    `;
  }

  function renderRoadmapDetail(roadmapId) {
    const roadmap = ROADMAP_DATA[roadmapId];
    const progress = getRoadmapProgress(roadmapId);
    const phasesWithIndex = flattenStepsWithIndex(roadmap);
    const data = QAStore.get();

    const phasesHtml = phasesWithIndex.map(({ phase, steps }) => {
      const completedInPhase = steps.filter(s => data.roadmapStepsCompleted[`${roadmapId}:${s.flatIndex}`]).length;
      return `
        <div class="roadmap-phase">
          <div class="roadmap-phase-title">
            <span>${phase.title}</span>
            <span class="phase-progress">${completedInPhase}/${steps.length}</span>
          </div>
          <div class="roadmap-step-list">
            ${steps.map(s => {
              const completed = !!data.roadmapStepsCompleted[`${roadmapId}:${s.flatIndex}`];
              return `
                <button class="roadmap-step ${completed ? 'completed' : ''}" data-roadmap="${roadmapId}" data-step="${s.flatIndex}">
                  <span class="roadmap-step-checkbox">${completed ? '✓' : ''}</span>
                  <span class="roadmap-step-name">${s.name}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');

    document.getElementById('roadmap-detail-content').innerHTML = `
      <div class="roadmap-detail-head">
        <div>
          <span class="badge badge-info">${roadmap.duration}</span>
          <h2>${roadmap.name}</h2>
          <div class="audience">${roadmap.audience}</div>
          <p class="description">${roadmap.description}</p>
        </div>
        <div class="roadmap-detail-progress-card">
          <div class="progress-label"><span>Overall progress</span><span>${progress.pct}%</span></div>
          <div class="progress-track"><div class="progress-fill" style="width:${progress.pct}%;background:${roadmap.color}"></div></div>
          <button class="btn btn-ghost btn-sm roadmap-reset-btn" data-roadmap="${roadmapId}">Reset Progress</button>
        </div>
      </div>
      ${phasesHtml}
      ${renderRecommendations(roadmap)}
    `;
  }

  function openRoadmapDetail(roadmapId) {
    document.getElementById('roadmaps-section').style.display = 'none';
    document.getElementById('advisor-section').style.display = 'none';
    document.getElementById('career-dashboard-section').style.display = 'none';
    document.getElementById('roadmap-detail-section').style.display = 'block';
    renderRoadmapDetail(roadmapId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', `#${roadmapId}`);
  }

  function closeRoadmapDetail() {
    document.getElementById('roadmap-detail-section').style.display = 'none';
    document.getElementById('roadmaps-section').style.display = 'block';
    document.getElementById('advisor-section').style.display = 'block';
    document.getElementById('career-dashboard-section').style.display = 'block';
    renderRoadmapCards();
    renderCareerDashboard();
    history.replaceState(null, '', window.location.pathname);
  }

  /* ---------------------------------------------------------
     SECTION 2 — Roadmap Advisor
     --------------------------------------------------------- */
  function renderAdvisorForm() {
    const expSelect = document.getElementById('advisor-experience');
    expSelect.innerHTML = ADVISOR_EXPERIENCE_LEVELS.map(l => `<option value="${l.id}">${l.label}</option>`).join('');

    const goalSelect = document.getElementById('advisor-goal');
    goalSelect.innerHTML = Object.keys(ADVISOR_GOALS).map(gid => `<option value="${gid}">${ADVISOR_GOALS[gid].label}</option>`).join('');
  }

  function renderAdvisorResult(plan) {
    const resultEl = document.getElementById('advisor-result');
    const skippedNote = plan.skippedSteps > 0
      ? `<p style="font-size:0.85rem;color:var(--text-3);margin-top:var(--sp-2)">Skipping ${plan.skippedSteps} foundational step${plan.skippedSteps === 1 ? '' : 's'} you likely already know — view the full roadmap to revisit them anytime.</p>`
      : '';

    resultEl.innerHTML = `
      <div class="advisor-result-wrap reveal is-visible">
        <div class="advisor-result-head">
          <span class="badge badge-info">${plan.goalLabel}</span>
        </div>
        <h3>Your plan: ${plan.roadmap.name}</h3>
        ${plan.note ? `<div class="advisor-note">${plan.note}</div>` : ''}
        ${skippedNote}

        <div class="advisor-meta-row">
          <div class="advisor-meta-item"><div class="num">${plan.weeksEstimate}</div><div class="label">Estimated weeks</div></div>
          <div class="advisor-meta-item"><div class="num">${plan.hoursPerWeek}</div><div class="label">Hours / week suggested</div></div>
          <div class="advisor-meta-item"><div class="num">${plan.monthlyTargets.length}</div><div class="label">Monthly milestones</div></div>
        </div>

        <h4 style="font-size:0.95rem;margin-bottom:var(--sp-3)">Monthly targets</h4>
        ${plan.monthlyTargets.map((steps, i) => `
          <div class="advisor-month-block">
            <h5>Month ${i + 1}</h5>
            <ul>${steps.map(s => `<li>${s}</li>`).join('')}</ul>
          </div>
        `).join('')}

        <button class="btn btn-primary advisor-view-roadmap-btn" data-roadmap="${plan.roadmap.id}">View Full Roadmap</button>
      </div>
    `;
  }

  /* ---------------------------------------------------------
     SECTION 3 — Career Dashboard
     --------------------------------------------------------- */
  function renderCareerStatCards() {
    const data = QAStore.get();
    const topicsCompleted = Object.values(data.topicsCompleted).filter(Boolean).length;
    const totalRoadmapSteps = ROADMAP_ORDER.reduce((sum, id) => sum + ROADMAP_DATA[id].phases.flatMap(p => p.steps).length, 0);
    const completedRoadmapSteps = Object.values(data.roadmapStepsCompleted).filter(Boolean).length;
    const quizzesTaken = data.quizAttempts.length;
    const avgScore = quizzesTaken ? Math.round(data.quizAttempts.reduce((s, a) => s + a.percentage, 0) / quizzesTaken) : 0;

    const cards = [
      { label: 'Current Learning Stage', value: stageLabel(topicsCompleted, completedRoadmapSteps) },
      { label: 'Topics Completed', value: `${topicsCompleted}/10` },
      { label: 'Roadmap Steps Done', value: `${completedRoadmapSteps}/${totalRoadmapSteps}` },
      { label: 'Avg Quiz Score', value: quizzesTaken ? `${avgScore}%` : '—' },
    ];

    document.getElementById('career-stat-cards').innerHTML = cards.map(c => `
      <div class="card dash-stat-card reveal is-visible">
        <span class="stat-value" style="font-size:1.3rem">${c.value}</span>
        <span class="stat-caption">${c.label}</span>
      </div>
    `).join('');
  }

  function stageLabel(topicsCompleted, roadmapSteps) {
    if (topicsCompleted === 0 && roadmapSteps === 0) return 'Just Getting Started';
    if (topicsCompleted < 3) return 'Building Foundations';
    if (topicsCompleted < 7) return 'Core Skills Developing';
    return 'Advanced Practitioner';
  }

  function renderCareerRoadmapProgress() {
    const wrap = document.getElementById('career-roadmap-progress');
    wrap.innerHTML = ROADMAP_ORDER.map(id => {
      const r = ROADMAP_DATA[id];
      const progress = getRoadmapProgress(id);
      return `
        <div class="career-roadmap-row">
          <span class="name">${r.name.replace(' Roadmap', '')}</span>
          <div class="progress-track"><div class="progress-fill" style="width:${progress.pct}%;background:${r.color}"></div></div>
          <span class="pct">${progress.pct}%</span>
        </div>
      `;
    }).join('');
  }

  // Strong/weak areas are derived from quiz performance per topic —
  // a topic needs at least one attempt to be judged either way.
  function computeAreas() {
    const data = QAStore.get();
    const byTopic = {};
    data.quizAttempts.forEach(a => {
      if (!byTopic[a.topic]) byTopic[a.topic] = [];
      byTopic[a.topic].push(a.percentage);
    });

    const strong = [];
    const weak = [];
    Object.keys(byTopic).forEach(topicId => {
      const scores = byTopic[topicId];
      const avg = scores.reduce((s, v) => s + v, 0) / scores.length;
      if (avg >= 70) strong.push(topicId);
      else weak.push(topicId);
    });

    return { strong, weak, attempted: Object.keys(byTopic) };
  }

  function renderCareerAreas() {
    const { strong, weak, attempted } = computeAreas();

    const strongEl = document.getElementById('career-strong-areas');
    const weakEl = document.getElementById('career-weak-areas');

    strongEl.innerHTML = strong.length
      ? `<div class="career-tag-list">${strong.map(t => `<span class="career-tag strong">${topicNameFromId(t)}</span>`).join('')}</div>`
      : `<div class="empty-state"><div class="glyph">∅</div><h3>Not enough data yet</h3><p>Score 70%+ on a topic quiz to see it appear here.</p></div>`;

    weakEl.innerHTML = weak.length
      ? `<div class="career-tag-list">${weak.map(t => `<span class="career-tag weak">${topicNameFromId(t)}</span>`).join('')}</div>`
      : (attempted.length
          ? `<div class="empty-state"><div class="glyph">∅</div><h3>No weak areas detected</h3><p>Every attempted topic is scoring 70%+.</p></div>`
          : `<div class="empty-state"><div class="glyph">∅</div><h3>Not enough data yet</h3><p>Take a quiz in the Quiz Center to see this populate.</p></div>`);
  }

  function renderCareerNextSteps() {
    const data = QAStore.get();
    const { weak } = computeAreas();
    const steps = [];

    if (weak.length) {
      steps.push(`Revisit <strong>${topicNameFromId(weak[0])}</strong> in the Learning Hub, then retake its quiz.`);
    }

    const topicsCompleted = Object.values(data.topicsCompleted).filter(Boolean).length;
    if (topicsCompleted < 10) {
      const nextTopic = TOPIC_ORDER.find(id => !data.topicsCompleted[id]);
      if (nextTopic) steps.push(`Start the next unfinished topic: <strong>${topicNameFromId(nextTopic)}</strong>.`);
    }

    const inProgressRoadmap = ROADMAP_ORDER.find(id => {
      const p = getRoadmapProgress(id);
      return p.completedCount > 0 && p.pct < 100;
    });
    if (inProgressRoadmap) {
      steps.push(`Continue your in-progress roadmap: <strong>${ROADMAP_DATA[inProgressRoadmap].name}</strong>.`);
    } else {
      steps.push(`Pick a roadmap above to get a structured next step instead of guessing.`);
    }

    if (Object.keys(data.challengesCompleted).filter(k => data.challengesCompleted[k]).length === 0) {
      steps.push(`Try your first Coding Challenge — XPath challenges are a good starting point.`);
    }

    document.getElementById('career-next-steps').innerHTML = steps.slice(0, 4).map(s => `
      <div class="career-next-step-item"><span class="arrow mono">→</span><span>${s}</span></div>
    `).join('');
  }

  function renderCareerDashboard() {
    renderCareerStatCards();
    renderCareerRoadmapProgress();
    renderCareerAreas();
    renderCareerNextSteps();
  }

  /* ---------------------------------------------------------
     Event binding
     --------------------------------------------------------- */
  function bindEvents() {
    document.getElementById('roadmap-card-grid').addEventListener('click', (e) => {
      const card = e.target.closest('.roadmap-card');
      if (card) openRoadmapDetail(card.dataset.roadmap);
    });

    document.getElementById('roadmap-back-btn').addEventListener('click', closeRoadmapDetail);

    document.getElementById('roadmap-detail-content').addEventListener('click', (e) => {
      const stepBtn = e.target.closest('.roadmap-step');
      if (stepBtn) {
        const roadmapId = stepBtn.dataset.roadmap;
        const stepIndex = parseInt(stepBtn.dataset.step, 10);
        const isCompleted = stepBtn.classList.contains('completed');
        if (isCompleted) {
          QAStore.unmarkRoadmapStep(roadmapId, stepIndex);
        } else {
          QAStore.markRoadmapStep(roadmapId, stepIndex);
          QAToast.show('Step marked complete — +15 XP', 'success');
        }
        renderRoadmapDetail(roadmapId);
        return;
      }

      const resetBtn = e.target.closest('.roadmap-reset-btn');
      if (resetBtn) {
        const roadmapId = resetBtn.dataset.roadmap;
        if (confirm('Reset all progress on this roadmap?')) {
          QAStore.resetRoadmap(roadmapId);
          QAToast.show('Roadmap progress reset', 'info');
          renderRoadmapDetail(roadmapId);
        }
      }
    });

    document.getElementById('advisor-submit-btn').addEventListener('click', () => {
      const experience = document.getElementById('advisor-experience').value;
      const goal = document.getElementById('advisor-goal').value;
      const plan = buildAdvisorPlan(experience, goal);
      renderAdvisorResult(plan);
      document.getElementById('advisor-result').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    document.getElementById('advisor-result').addEventListener('click', (e) => {
      const btn = e.target.closest('.advisor-view-roadmap-btn');
      if (btn) openRoadmapDetail(btn.dataset.roadmap);
    });

    document.addEventListener('qa-data-changed', () => {
      // Keep cards/dashboard fresh if data changes while this page is open
      if (document.getElementById('roadmap-detail-section').style.display === 'none') {
        renderRoadmapCards();
        renderCareerDashboard();
      }
    });
  }

  function init() {
    renderRoadmapCards();
    renderAdvisorForm();
    renderCareerDashboard();
    bindEvents();

    const hash = window.location.hash.replace('#', '');
    if (ROADMAP_ORDER.includes(hash)) {
      openRoadmapDetail(hash);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
