// Turns raw GitHub data + AI quality scores into one "credit score" per
// person — the actual "give out credits based on code quality and amount
// of raw contribution" idea from the brief.
//
// The math is deliberately simple and easy to explain to the team:
//   1. QUANTITY: commits + merged PRs + lines changed, compared against
//      the top contributor so it's a relative 0-100 score.
//   2. QUALITY: the AI's 1-10 score, scaled to 0-100 (defaults to a neutral
//      70 if AI analysis was skipped/unavailable, so quantity still counts).
//   3. Combine the two with adjustable weights (50/50 by default).

export function computeCredits(byAuthor, aiResults, { quantityWeight = 0.5, qualityWeight = 0.5 } = {}) {
  const logins = Object.keys(byAuthor);

  // --- Quantity signal ---
  const rawScores = {};
  let maxRaw = 0;
  for (const login of logins) {
    const { commits, pullRequests } = byAuthor[login];
    const mergedPRs = pullRequests.filter((pr) => pr.merged).length;
    const linesChanged = commits.reduce((sum, c) => sum + (c.additions || 0) + (c.deletions || 0), 0);

    // sqrt() on lines-changed so one giant commit (e.g. a dependency bump)
    // doesn't drown out everyone else's smaller, more deliberate commits.
    const score = commits.length * 3 + mergedPRs * 5 + Math.sqrt(linesChanged);
    rawScores[login] = score;
    maxRaw = Math.max(maxRaw, score);
  }

  // --- Combine with quality ---
  const credits = {};
  for (const login of logins) {
    const quantityScore = maxRaw > 0 ? Math.round((rawScores[login] / maxRaw) * 100) : 0;

    const ai = aiResults[login];
    const qualityScore = ai?.qualityScore != null ? ai.qualityScore * 10 : 70;

    const creditScore = Math.round(quantityScore * quantityWeight + qualityScore * qualityWeight);

    credits[login] = {
      creditScore,
      quantityScore,
      qualityScore,
      commits: byAuthor[login].commits.length,
      mergedPRs: byAuthor[login].pullRequests.filter((pr) => pr.merged).length,
      linesChanged: byAuthor[login].commits.reduce((s, c) => s + (c.additions || 0) + (c.deletions || 0), 0),
      summary: ai?.summary || '',
      notes: ai?.notes || '',
    };
  }

  return credits;
}
