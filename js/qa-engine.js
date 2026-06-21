/* ============================================================
   ASK THE HUB — rule-based Q&A engine (qa-engine.js)

   This is NOT a live AI/LLM call. The site has no backend to
   hold an API key safely, so this works by indexing every
   concept, interview Q&A, and best practice already written
   for the 10 topics, then scoring them against the learner's
   typed question using keyword overlap. It's transparent,
   inspectable logic — not a black box.
   ============================================================ */

const QAEngine = (() => {
  let index = null;

  const STOPWORDS = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'what', 'when', 'where', 'why', 'how', 'who', 'which', 'does', 'do',
    'did', 'to', 'of', 'in', 'on', 'for', 'and', 'or', 'but', 'with',
    'i', 'you', 'it', 'this', 'that', 'my', 'your', 'can', 'should',
    'would', 'could', 'will', 'as', 'at', 'by', 'from', 'about',
  ]);

  function tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1 && !STOPWORDS.has(w));
  }

  function buildIndex() {
    if (index) return index;
    if (typeof TOPIC_DATA === 'undefined' || typeof TOPIC_ORDER === 'undefined') {
      index = [];
      return index;
    }

    const entries = [];

    TOPIC_ORDER.forEach(topicId => {
      const t = TOPIC_DATA[topicId];

      // Concepts
      t.concepts.forEach(c => {
        entries.push({
          type: 'concept',
          topicId,
          topicName: t.name,
          title: c.title,
          answer: c.text,
          searchText: `${c.title} ${c.text} ${t.name}`,
          tokens: tokenize(`${c.title} ${c.text} ${t.name}`),
        });
      });

      // Interview Q&A
      t.interviewQuestions.forEach(q => {
        entries.push({
          type: 'interview',
          topicId,
          topicName: t.name,
          title: q.q,
          answer: q.a,
          level: q.level,
          searchText: `${q.q} ${q.a} ${t.name}`,
          tokens: tokenize(`${q.q} ${q.a} ${t.name}`),
        });
      });

      // Best practices
      t.bestPractices.forEach(p => {
        entries.push({
          type: 'practice',
          topicId,
          topicName: t.name,
          title: `${t.name} best practice`,
          answer: p,
          searchText: `${p} ${t.name} best practice`,
          tokens: tokenize(`${p} ${t.name} best practice`),
        });
      });
    });

    index = entries;
    return index;
  }

  /**
   * Scores every indexed entry against the query using simple token
   * overlap (count of shared meaningful words), with a small bonus
   * for matches in the title vs. body text. Fully deterministic and
   * inspectable — no external call, no randomness.
   */
  function search(query, limit = 5) {
    const entries = buildIndex();
    const queryTokens = tokenize(query);
    if (!queryTokens.length || !entries.length) return [];

    const queryLower = query.toLowerCase();
    // Detect when 2+ consecutive query tokens might form a compound
    // technical term (e.g. "stale" + "element" -> "staleelement") that
    // appears as one unbroken word in source text like
    // StaleElementReferenceException — plain token matching alone
    // would miss this since the source has no token boundary there.
    const compoundCandidates = [];
    for (let i = 0; i < queryTokens.length - 1; i++) {
      compoundCandidates.push(queryTokens[i] + queryTokens[i + 1]);
    }

    const scored = entries.map(entry => {
      let score = 0;
      const entryTokenSet = new Set(entry.tokens);
      const titleTokens = new Set(tokenize(entry.title));
      const titleLower = entry.title.toLowerCase();
      const searchTextLower = entry.searchText.toLowerCase();

      queryTokens.forEach(qt => {
        if (entryTokenSet.has(qt)) score += 1;
        if (titleTokens.has(qt)) score += 2; // title matches weigh more
      });

      // Compound-term boost: query words that, concatenated, appear as
      // a substring of the title (handles CamelCase technical terms).
      compoundCandidates.forEach(c => {
        if (titleLower.replace(/[^a-z0-9]/g, '').includes(c)) score += 4;
      });

      // Small boost for topic name appearing directly in the query
      // (e.g. "selenium wait" should favor Selenium entries)
      if (queryLower.includes(entry.topicName.toLowerCase())) score += 3;

      // Normalize by query length so short, highly-specific queries
      // ("stale element") aren't out-scored by long ones matching many
      // generic words coincidentally.
      const normalizedScore = score / Math.sqrt(queryTokens.length);

      return { entry, score: normalizedScore, rawScore: score };
    });

    // A minimum raw-score threshold filters out coincidental overlap on
    // genuinely unrelated queries (e.g. common words like "test" or "how"
    // matching dozens of entries weakly) rather than always returning
    // something just because the index is large.
    const MIN_RAW_SCORE = 3;

    return scored
      .filter(s => s.rawScore >= MIN_RAW_SCORE)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.entry);
  }

  return { search, buildIndex };
})();
