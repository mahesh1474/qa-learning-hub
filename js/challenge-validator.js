/* ============================================================
   CHALLENGE VALIDATOR (challenge-validator.js)

   Two validation modes:
   1. XPath/CSS — REAL validation. The challenge's sample HTML is
      rendered into a hidden container in the actual DOM, and the
      user's expression is evaluated with native browser APIs
      (document.evaluate for XPath, querySelectorAll for CSS).
      Correctness is judged by comparing the actual DOM node(s)
      selected against the node(s) the documented solution selects
      — not by string-comparing expressions, since many different
      valid expressions can select the same element.
   2. Selenium/Playwright code — heuristic only. There is no real
      browser-automation backend here, so this checks for expected
      method calls / structural keywords against the solution and
      is clearly labeled as approximate, not a real test run.
   ============================================================ */

const ChallengeValidator = (() => {

  let sandbox = null;
  function getSandbox() {
    if (!sandbox) {
      sandbox = document.createElement('div');
      sandbox.id = 'challenge-validator-sandbox';
      sandbox.style.position = 'absolute';
      sandbox.style.left = '-9999px';
      sandbox.style.top = '-9999px';
      sandbox.setAttribute('aria-hidden', 'true');
      document.body.appendChild(sandbox);
    }
    return sandbox;
  }

  function evalXPath(expression, contextNode) {
    try {
      const result = document.evaluate(expression, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const nodes = [];
      for (let i = 0; i < result.snapshotLength; i++) nodes.push(result.snapshotItem(i));
      return { nodes, error: null };
    } catch (e) {
      return { nodes: [], error: e.message };
    }
  }

  function evalCSS(expression, contextNode) {
    try {
      const nodes = Array.from(contextNode.querySelectorAll(expression));
      return { nodes, error: null };
    } catch (e) {
      return { nodes: [], error: e.message };
    }
  }

  function sameNodeSet(a, b) {
    if (a.length === 0 || a.length !== b.length) return false;
    const setB = new Set(b);
    return a.every(node => setB.has(node));
  }

  /**
   * Validates a user's XPath or CSS expression against a challenge.
   * The sandbox element itself is used as the XPath/CSS context node,
   * so relative expressions (the kind taught throughout this site,
   * e.g. //button[...]) resolve against the challenge's sample markup
   * rather than the real page.
   */
  function validateSelector(challenge, userExpression, mode) {
    const box = getSandbox();
    box.innerHTML = challenge.html;

    const trimmedUser = userExpression.trim();
    const trimmedSolution = challenge.solution.trim();

    if (!trimmedUser) {
      return { valid: false, message: 'Type an expression before validating.', userNodeCount: 0, solutionNodeCount: 0 };
    }

    const evaluator = mode === 'xpath' ? evalXPath : evalCSS;
    const userResult = evaluator(trimmedUser, box);
    const solutionResult = evaluator(trimmedSolution, box);

    if (userResult.error) {
      const label = mode === 'xpath' ? 'XPath' : 'CSS selector';
      return { valid: false, message: `Invalid ${label}: ${userResult.error}`, userNodeCount: 0, solutionNodeCount: solutionResult.nodes.length };
    }
    if (userResult.nodes.length === 0) {
      return { valid: false, message: 'Your expression matched 0 elements in the sample HTML.', userNodeCount: 0, solutionNodeCount: solutionResult.nodes.length };
    }

    const matches = sameNodeSet(userResult.nodes, solutionResult.nodes);
    return {
      valid: matches,
      message: matches
        ? `Correct — your expression selects the same element(s) as the reference solution (${userResult.nodes.length} matched).`
        : `Your expression matched ${userResult.nodes.length} element(s), but not the one(s) this challenge expects (expected ${solutionResult.nodes.length}).`,
      userNodeCount: userResult.nodes.length,
      solutionNodeCount: solutionResult.nodes.length,
    };
  }

  /**
   * Heuristic-only check for Selenium/Playwright code challenges, since
   * there's no real browser-automation backend to actually execute this
   * code. Compares normalized tokens (method calls, key identifiers)
   * between the user's code and the solution, returning a similarity-based
   * verdict rather than a pass/fail from real execution.
   *
   * Limitation acknowledged: pure overlap can't distinguish semantically
   * opposite calls that share most surrounding structure (e.g. .accept()
   * vs .dismiss()) — this is inherent to keyword-based heuristics without
   * real execution, which is exactly why this mode is labeled approximate
   * everywhere it's shown to the user.
   */
  function validateCodeHeuristic(challenge, userCode) {
    function extractSignals(code) {
      const calls = [...code.matchAll(/\.?([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g)].map(m => m[1].toLowerCase());
      const identifiers = [...code.matchAll(/\b([A-Z][a-zA-Z0-9_]*\.[a-zA-Z0-9_]+)\b/g)].map(m => m[1].toLowerCase());
      return new Set([...calls, ...identifiers]);
    }

    if (userCode.trim().length < 10) {
      return { valid: false, approximate: true, message: 'Write some code first — this looks too short to be a real attempt.', overlapPct: 0 };
    }

    const userSignals = extractSignals(userCode);
    const solutionSignals = extractSignals(challenge.solution);

    let overlap = 0;
    const missing = [];
    solutionSignals.forEach(sig => {
      if (userSignals.has(sig)) overlap++;
      else missing.push(sig);
    });
    const overlapPct = solutionSignals.size ? Math.round((overlap / solutionSignals.size) * 100) : 0;

    // Require BOTH a high overlap AND no missing signals — a single
    // missing call (like the correct alert method) should fail this even
    // if everything else lines up, since that\'s often the entire point
    // of the exercise.
    const valid = overlapPct >= 60 && missing.length === 0;

    return {
      valid,
      approximate: true,
      overlapPct,
      message: valid
        ? `Looks consistent with the expected approach (${overlapPct}% of key method calls/identifiers matched). This is a heuristic check, not a real execution — compare against the full solution to be sure.`
        : missing.length
          ? `Your code is missing some expected calls (${missing.slice(0, 3).join(', ')}${missing.length > 3 ? ', …' : ''}). This is a heuristic check, not a real execution.`
          : `Your code shares ${overlapPct}% of the expected method calls/identifiers with the reference solution — it may be missing key steps. This is a heuristic check, not a real execution.`,
    };
  }

  return { validateSelector, validateCodeHeuristic };
})();
