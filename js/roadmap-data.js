/* ============================================================
   LEARNING PATHS & CAREER ROADMAPS DATA
   Each roadmap has phases (ordered groups of topics/steps).
   recommendedQuizTopics / recommendedChallengeCategories /
   recommendedInterviewTopics reference IDs that already exist
   in quiz-data.js, challenges-data.js, and learning-data.js —
   so this page recommends real content already on the site.
   ============================================================ */

const ROADMAP_DATA = {

  beginnerQA: {
    id: 'beginnerQA',
    name: 'Beginner QA Roadmap',
    glyph: '01',
    audience: 'Freshers and Manual Testers',
    description: 'Start here if you\'re new to QA. Covers testing fundamentals, the basics of how web apps work, and enough SQL to validate data — no automation yet.',
    duration: '0–3 Months',
    color: 'var(--pass)',
    phases: [
      {
        title: 'Phase 1 — Testing Fundamentals',
        steps: ['Software Testing Fundamentals', 'SDLC', 'STLC', 'Bug Life Cycle', 'Test Cases', 'Test Scenarios'],
      },
      {
        title: 'Phase 2 — Web Application Basics',
        steps: ['Web Application Testing', 'Browser Concepts', 'HTML Basics', 'CSS Basics', 'DOM Basics'],
      },
      {
        title: 'Phase 3 — Database Fundamentals',
        steps: ['SQL Fundamentals', 'Joins', 'Queries', 'Database Testing Basics'],
      },
    ],
    recommendedQuizTopics: ['sql'],
    recommendedChallengeCategories: [],
    recommendedInterviewTopics: ['sql'],
  },

  automationEngineer: {
    id: 'automationEngineer',
    name: 'Automation Test Engineer Roadmap',
    glyph: '02',
    audience: 'QA Engineers moving into Automation',
    description: 'The standard path from manual testing into automation — Java fundamentals, Selenium, a testing framework, and version control.',
    duration: '3–12 Months',
    color: 'var(--indigo)',
    phases: [
      {
        title: 'Phase 1 — Java Foundations',
        steps: ['Java Fundamentals', 'OOP Concepts', 'Collections', 'Exception Handling'],
      },
      {
        title: 'Phase 2 — Core Automation',
        steps: ['Selenium', 'TestNG', 'Cucumber'],
      },
      {
        title: 'Phase 3 — Framework & Collaboration',
        steps: ['Automation Framework Design', 'Reporting', 'Git'],
      },
    ],
    recommendedQuizTopics: ['java', 'selenium', 'testng', 'cucumber', 'git'],
    recommendedChallengeCategories: ['selenium', 'xpath', 'cssSelectors'],
    recommendedInterviewTopics: ['java', 'selenium', 'testng', 'cucumber', 'git'],
  },

  playwrightSpecialist: {
    id: 'playwrightSpecialist',
    name: 'Playwright Specialist Roadmap',
    glyph: '03',
    audience: 'Automation Engineers wanting modern automation skills',
    description: 'For engineers who already know automation basics and want to specialize in the modern tool most new test suites are being built with.',
    duration: '2–6 Months',
    color: 'var(--cyan)',
    phases: [
      {
        title: 'Phase 1 — Playwright Core',
        steps: ['Playwright Fundamentals', 'Locators', 'Assertions'],
      },
      {
        title: 'Phase 2 — Test Architecture',
        steps: ['Fixtures', 'Hooks', 'API Testing'],
      },
      {
        title: 'Phase 3 — Scale & Ship',
        steps: ['Parallel Execution', 'CI/CD Integration', 'Advanced Playwright Concepts'],
      },
    ],
    recommendedQuizTopics: ['playwright', 'apiTesting'],
    recommendedChallengeCategories: ['playwright'],
    recommendedInterviewTopics: ['playwright', 'apiTesting'],
  },

  apiTestingSpecialist: {
    id: 'apiTestingSpecialist',
    name: 'API Testing Specialist Roadmap',
    glyph: '04',
    audience: 'Testers who want to specialize in API and backend testing',
    description: 'Go deep on the layer underneath the UI — REST fundamentals, authentication, and the tools used to automate API test suites.',
    duration: '1–4 Months',
    color: 'var(--purple)',
    phases: [
      {
        title: 'Phase 1 — REST Fundamentals',
        steps: ['REST API Fundamentals', 'HTTP Methods', 'Status Codes', 'JSON'],
      },
      {
        title: 'Phase 2 — Auth & Tooling',
        steps: ['Authentication', 'Postman', 'REST Assured'],
      },
      {
        title: 'Phase 3 — Automation & Contracts',
        steps: ['API Automation', 'Contract Testing'],
      },
    ],
    recommendedQuizTopics: ['apiTesting'],
    recommendedChallengeCategories: [],
    recommendedInterviewTopics: ['apiTesting'],
  },

  sdet: {
    id: 'sdet',
    name: 'SDET Roadmap',
    glyph: '05',
    audience: 'Automation Engineers aspiring to become SDETs',
    description: 'The long path — SDETs are expected to write production-quality code, design systems-level test architecture, and own CI/CD end to end.',
    duration: '1–3 Years',
    color: 'var(--warn)',
    phases: [
      {
        title: 'Phase 1 — Advanced Engineering Skills',
        steps: ['Advanced Java', 'Design Patterns', 'DSA Basics'],
      },
      {
        title: 'Phase 2 — Cross-Tool Automation',
        steps: ['Selenium', 'Playwright', 'API Automation'],
      },
      {
        title: 'Phase 3 — Architecture & Infrastructure',
        steps: ['Framework Design', 'CI/CD', 'Jenkins', 'Docker', 'Cloud Fundamentals', 'Test Architecture'],
      },
    ],
    recommendedQuizTopics: ['java', 'selenium', 'playwright', 'apiTesting', 'jenkins', 'git'],
    recommendedChallengeCategories: ['selenium', 'playwright', 'xpath', 'cssSelectors'],
    recommendedInterviewTopics: ['java', 'selenium', 'playwright', 'apiTesting', 'jenkins'],
  },

  qaLead: {
    id: 'qaLead',
    name: 'QA Lead Roadmap',
    glyph: '06',
    audience: 'Senior engineers moving into leadership',
    description: 'Less about new tools, more about strategy and people — this is the path from "I write tests" to "I own quality for the team."',
    duration: 'Career Growth Path',
    color: 'var(--fail)',
    phases: [
      {
        title: 'Phase 1 — Strategy & Planning',
        steps: ['Test Strategy', 'Test Planning', 'Estimation'],
      },
      {
        title: 'Phase 2 — People & Process',
        steps: ['Team Leadership', 'Agile Methodology', 'Risk Management'],
      },
      {
        title: 'Phase 3 — Influence',
        steps: ['Automation Strategy', 'Stakeholder Communication'],
      },
    ],
    recommendedQuizTopics: [],
    recommendedChallengeCategories: [],
    recommendedInterviewTopics: [],
  },
};

const ROADMAP_ORDER = ['beginnerQA', 'automationEngineer', 'playwrightSpecialist', 'apiTestingSpecialist', 'sdet', 'qaLead'];

/* ============================================================
   ROADMAP ADVISOR — rule-based recommendation engine.
   No external AI call (the site has no backend to hold an API
   key safely) — this is transparent if/else logic mapping
   experience + goal to a real roadmap already defined above.
   ============================================================ */

const ADVISOR_GOALS = {
  becomeAutomationEngineer: { label: 'Become an Automation Engineer', roadmapId: 'automationEngineer' },
  becomePlaywrightSpecialist: { label: 'Become a Playwright Specialist', roadmapId: 'playwrightSpecialist' },
  becomeSDET: { label: 'Become an SDET', roadmapId: 'sdet' },
  crackInterviews: { label: 'Crack QA Interviews', roadmapId: null }, // handled specially
  switchCompanies: { label: 'Switch Companies', roadmapId: null },    // handled specially
  becomeQALead: { label: 'Become a QA Lead', roadmapId: 'qaLead' },
};

const ADVISOR_EXPERIENCE_LEVELS = [
  { id: 'fresher', label: 'Fresher / New to QA' },
  { id: 'manual', label: 'Manual Tester' },
  { id: 'automation1to2', label: 'Automation Engineer (1–2 yrs)' },
  { id: 'automation3plus', label: 'Automation Engineer (3+ yrs)' },
];

/**
 * Builds a personalized plan from (experienceLevel, goalId).
 * Pure function, fully rule-based — every branch is readable and
 * traceable, no external call. Returns a plan object the UI renders.
 */
function buildAdvisorPlan(experienceLevelId, goalId) {
  const goal = ADVISOR_GOALS[goalId];
  let roadmapId = goal.roadmapId;
  let note = '';

  // "Crack QA Interviews" and "Switch Companies" aren't tied to one
  // roadmap — pick the most relevant one based on current experience.
  if (goalId === 'crackInterviews') {
    roadmapId = (experienceLevelId === 'fresher' || experienceLevelId === 'manual') ? 'beginnerQA' : 'automationEngineer';
    note = 'Interview prep works best layered on top of solid fundamentals — pair this roadmap with the Interview Preparation and Quiz Center sections.';
  } else if (goalId === 'switchCompanies') {
    roadmapId = experienceLevelId === 'automation3plus' ? 'sdet' : 'automationEngineer';
    note = 'Moving companies usually means proving breadth — this roadmap is paired with mock-interview-style practice in Quiz Center.';
  }

  // Adjust starting phase based on experience — skip fundamentals for
  // people who already have them, rather than forcing everyone through phase 1.
  let startPhaseIndex = 0;
  if (experienceLevelId === 'automation1to2' || experienceLevelId === 'automation3plus') {
    startPhaseIndex = 1;
  }

  // Weekly pacing depends on experience — assume more available learning
  // hours/week the more senior someone already is.
  const hoursPerWeek = {
    fresher: 6,
    manual: 8,
    automation1to2: 5,
    automation3plus: 4,
  }[experienceLevelId] || 6;

  const roadmap = ROADMAP_DATA[roadmapId];
  const allSteps = roadmap.phases.flatMap(p => p.steps);
  const stepsFromStart = roadmap.phases.slice(startPhaseIndex).flatMap(p => p.steps);
  const weeksEstimate = Math.max(2, Math.ceil(stepsFromStart.length / 2));

  // Monthly targets: group steps into ~4-step chunks per month.
  const monthlyTargets = [];
  for (let i = 0; i < stepsFromStart.length; i += 4) {
    monthlyTargets.push(stepsFromStart.slice(i, i + 4));
  }

  return {
    roadmap,
    goalLabel: goal.label,
    note,
    startPhaseIndex,
    hoursPerWeek,
    weeksEstimate,
    monthlyTargets,
    totalSteps: allSteps.length,
    skippedSteps: allSteps.length - stepsFromStart.length,
  };
}
