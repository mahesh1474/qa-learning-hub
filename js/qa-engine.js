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

      // Intro/definition — answers "what is X" style questions directly.
      // This was previously missing entirely, which is why basic
      // definitional questions returned unrelated best-practice entries
      // instead of the actual intro paragraph written for exactly this.
      entries.push({
        type: 'intro',
        topicId,
        topicName: t.name,
        title: `What is ${t.name}?`,
        answer: t.intro,
        searchText: `what is ${t.name} ${t.intro}`,
        tokens: tokenize(`what is ${t.name} ${t.intro}`),
      });

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

      // Best practices — each gets its own distinct title derived from a
      // short snippet of its actual content, instead of all sharing the
      // same generic "<Topic> best practice" title. The shared-title
      // version meant every practice entry scored identically on the
      // topic-name boost, so searches surfaced 2-3 indistinguishable
      // "X best practice" results instead of the most relevant one.
      t.bestPractices.forEach(p => {
        const snippet = p.split(/[—,.]/)[0].trim();
        entries.push({
          type: 'practice',
          topicId,
          topicName: t.name,
          title: `${t.name} tip: ${snippet}`,
          answer: p,
          searchText: `${p} ${t.name} best practice tip`,
          tokens: tokenize(`${p} ${t.name} best practice tip`),
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

      queryTokens.forEach(qt => {
        if (entryTokenSet.has(qt)) score += 1;
        if (titleTokens.has(qt)) score += 2; // title matches weigh more
      });

      // Compound-term boost: query words that, concatenated, appear as
      // a substring of the title (handles CamelCase technical terms).
      compoundCandidates.forEach(c => {
        if (titleLower.replace(/[^a-z0-9]/g, '').includes(c)) score += 4;
      });

      // Definitional-question boost: "what is X" / "what's X" should
      // strongly prefer the topic's intro entry over best-practices or
      // unrelated interview questions that happen to mention the topic
      // name. Without this, "what is Selenium" had no way to distinguish
      // the actual definition from three same-topic entries.
      const isDefinitionalQuery = /^(what is|what's|whats|define|explain)\b/.test(queryLower);
      if (isDefinitionalQuery && entry.type === 'intro' && queryLower.includes(entry.topicName.toLowerCase())) {
        score += 8;
      }

      // Small tiebreaker boost for topic name appearing directly in the
      // query (e.g. "selenium wait" should lean toward Selenium entries)
      // — kept low so it nudges ranking without flooding results with
      // every entry from one topic regardless of actual relevance.
      if (queryLower.includes(entry.topicName.toLowerCase())) score += 1;

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
    const MAX_PER_TOPIC = 2; // avoid one topic's entries crowding out other relevant matches

    const ranked = scored
      .filter(s => s.rawScore >= MIN_RAW_SCORE)
      .sort((a, b) => b.score - a.score);

    const topicCounts = {};
    const finalResults = [];
    for (const s of ranked) {
      const count = topicCounts[s.entry.topicId] || 0;
      if (count >= MAX_PER_TOPIC) continue;
      topicCounts[s.entry.topicId] = count + 1;
      finalResults.push(s.entry);
      if (finalResults.length >= limit) break;
    }

    return finalResults;
  }

  return { search, buildIndex };
})();
