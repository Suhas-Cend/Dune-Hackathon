// Turns the credits object into something a human actually wants to look at:
// a sorted console table for local runs, and a markdown export the UI/README
// side of the project (Harshit/Bhavamanyu's ui.md) can point people to.

export function printReport(credits) {
  const sorted = Object.entries(credits).sort((a, b) => b[1].creditScore - a[1].creditScore);

  const rows = sorted.map(([login, c]) => ({
    Contributor: login,
    'Credit Score': c.creditScore,
    Quality: c.qualityScore,
    Quantity: c.quantityScore,
    Commits: c.commits,
    'Merged PRs': c.mergedPRs,
    'Lines Changed': c.linesChanged,
  }));

  console.log('\nDune — Contribution Report');
  console.log('='.repeat(27) + '\n');
  console.table(rows);

  for (const [login, c] of sorted) {
    if (c.summary) console.log(`\n${login}: ${c.summary}`);
    if (c.notes) console.log(`  ⚠ ${c.notes}`);
  }
  console.log('');
}

export function toMarkdown(credits) {
  const sorted = Object.entries(credits).sort((a, b) => b[1].creditScore - a[1].creditScore);

  let md = `# Dune Contribution Report\n\n_Generated: ${new Date().toISOString()}_\n\n`;
  md += `| Contributor | Credit Score | Quality | Quantity | Commits | Merged PRs | Lines Changed |\n`;
  md += `|---|---|---|---|---|---|---|\n`;
  for (const [login, c] of sorted) {
    md += `| ${login} | **${c.creditScore}** | ${c.qualityScore} | ${c.quantityScore} | ${c.commits} | ${c.mergedPRs} | ${c.linesChanged} |\n`;
  }

  md += `\n## Summaries\n\n`;
  for (const [login, c] of sorted) {
    if (c.summary) md += `**${login}** — ${c.summary}${c.notes ? `\n\n> ⚠ ${c.notes}` : ''}\n\n`;
  }

  return md;
}
