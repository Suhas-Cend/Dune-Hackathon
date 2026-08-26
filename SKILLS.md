# Git & GitHub Contribution Analysis

A manager or team lead usually wants one thing: to understand what each person on a project actually did, without personally reading every commit, diff, and pull request. That's what this skill produces — a per-developer and team-level contribution analysis grounded in the repository's actual history.

**The rule that governs everything below: repository activity is not the same thing as engineering value.** A 20-line fix to a data-loss bug can matter more than a 500-line mechanical refactor. A developer who reviews and unblocks four teammates' pull requests may contribute more than the person with the most commits. Commit counts, lines changed, and files touched are *inputs* to this analysis — they are never its conclusion.

Every score this skill produces is an **analytical estimate**, built from whatever evidence the repository actually contains. Never present a score, ranking, or conclusion as a precise or complete measurement of a person's effort or value — say plainly where the evidence is thin.

## Operating constraints — read this first

- **This is a read-only analysis skill.** Never run commands that create, modify, or delete commits, branches, tags, pull requests, or history — no `git commit`, `git push`, `git merge`, `git rebase`, `git reset --hard`, `git branch -d`, `git tag -d`, `gh pr merge`, `gh pr close`, force-pushes, or filter-branch/history rewrites — even when a step below would be easier with one. Stick to read operations: `git log`, `git show`, `git diff`, `git blame`, `git shortlog`, `gh pr list` / `gh pr view`, read-only `gh api` calls, and the like.
- If someone separately asks you to act on the repository (merge something, tag a release, clean up branches), treat that as its own explicitly authorized task, confirmed on its own terms — not something this skill does as a side effect of analysis.
- This analysis supports human judgment; it doesn't replace it. It can't see meetings, mentoring, design discussions, incident response, or anything else that never touched the repository. Say so in the output rather than letting a tidy report imply it's the whole picture (see "Responsible use" at the end).

## Step-by-step workflow

1. **Scope the analysis.** If the user hasn't specified a time window, branch, or subset of developers, default to the full history of the default branch and every identifiable human contributor — and say that's what you did. If the history is too large to analyze in full, say so and propose a sensible window (e.g., the last 6–12 months) instead of silently truncating.
2. **Identify contributors and canonicalize identity** — merge the multiple emails/names one person may use, exclude bot accounts, and note anyone you can't confidently identify.
3. **Collect raw data** per contributor: commits, pull requests, reviews, branches, diffs (see "Data collection").
4. **Group commits into contribution units** and avoid double-counting the same work (see "Grouping commits into contribution units").
5. **Classify each unit** by type and separate meaningful engineering work from low-signal activity (see "Classifying and filtering changes").
6. **Assess quality, complexity, and impact** for each unit, then score each contributor across the framework below (see "Assessing quality and complexity" and "Scoring framework").
7. **Run the fairness self-check** before finalizing any score (see "Fairness self-check").
8. **Write the report** using the required output format, with explicit confidence and evidence for every claim (see "Output format").

## Data collection

Adapt these to whatever the execution environment actually provides — a local git checkout, the GitHub CLI (`gh`), or a GitHub REST/GraphQL client. Record in the final output which of these were actually available, since that affects how much confidence the analysis can carry.

```bash
# Canonical contributor list
git shortlog -sne --all

# Full history with per-file stats
git log --all --no-merges --date=iso \
  --pretty=format:'COMMIT|%H|%an|%ae|%ad|%s' --numstat

# Merge commits only — used to find PR boundaries
git log --merges --all --pretty=format:'%H|%P|%an|%s'

# One commit's full diff, for quality/complexity review
git show <sha>

# Detect renames/moves so they aren't miscounted as new content
git log --follow --find-renames=90% -- <path>

# Co-authored / paired commits
git log --all --grep='Co-authored-by' --pretty=format:'%H|%s|%b'
```

```bash
# Pull request and review data, if the GitHub CLI is available
gh pr list --state all --limit 1000 \
  --json number,author,mergedAt,additions,deletions,commits,reviews,files

gh pr view <number> \
  --json reviews,comments,commits,files,additions,deletions,mergedAt
```

Exclude known bot identities (`dependabot[bot]`, `renovate[bot]`, `github-actions[bot]`, and similar) from per-developer scoring. Their volume can still be mentioned in passing ("N automated dependency-update commits excluded from scoring") if it's useful context.

## Grouping commits into contribution units

Score at the level of a **contribution unit** — one coherent piece of work — never at the level of a raw commit. A real feature is often built across many small commits ("wip", "fix typo", "address review comments"); scoring each one separately rewards messy commit hygiene and inflates apparent output for no real reason.

**Default rule:** if pull request data is available, one merged PR is one contribution unit, credited to its author, with any co-authors from commit trailers or explicit PR metadata credited alongside. The commits inside the PR are supporting evidence, not separate units.

**Without PR data**, group commits into one unit when they share the same author and at least one of:
- a shared reference (ticket ID, issue number, a branch name still visible in `git log --all --source` or the reflog),
- overlapping or related files, close together in time (a same-author cluster touching the same files within roughly 48 hours is a reasonable starting heuristic — tighten it for a focused sprint, loosen it for a slow-burn feature with natural gaps),
- commit messages that read as one continuous story ("add X", "wire up X", "fix X bug", "address review feedback on X").

State a grouping assumption explicitly whenever it isn't obvious from PR boundaries — don't silently pick an interpretation and hide the seam. Don't split one logical change into several units just because it touched many files, and don't merge genuinely unrelated same-day work by one author into a single inflated unit just because the timing happens to line up.

**Avoid double-counting the same work:**

| Situation | Rule |
|---|---|
| Merge commit itself | Don't count its diff as new content — it's usually a synthesis (often empty). Attribute the real content to the commits it merges in. |
| Squash-merged PR | The single squashed commit on the target branch *is* the unit. Don't also count the original branch's pre-squash commits if they're still visible — it's the same change. |
| Cherry-pick / backport | If the same change (by content, not commit SHA) appears on multiple branches, count it once and note it was ported to N branches. |
| A change reverted and later reapplied | Credit the original author once; note the revert-and-reapply history factually. |
| Rebased / force-pushed history | Dedupe by diff content, not SHA — a rebase changes SHAs without changing the underlying work. |

## Classifying and filtering changes

Classify each contribution unit: **feature, bug fix, refactor, performance, tests, documentation, infrastructure/CI, formatting-only, generated/vendored, dependency update, or revert.**

Meaningful engineering work — features, real bug fixes, refactors with actual logic changes, tests, thoughtful docs, infra that unblocks other people — is what should drive scores. The following belong in the summary for completeness but should never by themselves inflate a score:

- formatting/lint-only diffs (whitespace, import ordering, no logic-token changes),
- generated or vendored files (lockfiles, `dist/`/`build/` output, compiled protobufs, `vendor/`, minified assets, ORM-autogenerated migrations),
- pure dependency version bumps with no accompanying code change,
- pure renames or moves with no logic change.

Don't discard this activity from the narrative entirely — someone who reliably keeps dependencies current and the build green is doing real, if low-visibility, maintenance work, and it's fine to say so. Just don't let its volume substitute for the scored dimensions below.

**Worked example:**
Input: four commits by the same author over two days, all touching `src/auth/*`, messages "wip oauth," "oauth login working," "fix oauth redirect bug," "address PR feedback on oauth."
Output: one contribution unit — "OAuth login implementation" — classified as a Feature. Not four separate contributions.

Input: a commit that only changes `package-lock.json`.
Output: classified as a Dependency update. Mentioned in the summary if relevant; doesn't move any score.

## Assessing quality and complexity

### Code quality
Look at: readability and naming, structure and consistency with the codebase's *own* existing conventions, error and edge-case handling, whether tests accompany the change, duplication, and any obviously risky patterns (hardcoded secrets, unvalidated input, obvious injection risk) — noted as observations, not a full security audit. Where available, review signals help too: how many review rounds a PR needed, unresolved comment threads, or a revert shortly after merge as a negative signal. Judge quality against the standard the codebase itself already demonstrates, not an abstract external ideal — a data-science notebook repo and a hardened payments service warrant different bars.

### Complexity and technical difficulty
Complexity is not size. A 30-line diff that correctly fixes a hard concurrency bug is more technically difficult than a 3,000-line diff of repetitive CRUD boilerplate — score accordingly and say so explicitly in the evidence. Look at structural complexity (branching and nesting, new abstractions introduced, how many modules or services had to be coordinated), domain complexity (concurrency, performance-sensitive code, security, data migrations, genuinely tricky business logic), and blast radius (how much else touches or depends on this code). If a static-analysis or complexity tool for the relevant language is available in the environment, use it as one input; otherwise reason directly from the diff — either way, note which method you used, since it affects how much weight the judgment should carry.

## Scoring framework

Rate each contributor on the seven dimensions below using this five-tier scale:

| Tier | Label | What it looks like |
|---|---|---|
| 1 | Minimal | Sporadic or trivial activity; no real ownership of any part of the codebase. |
| 2 | Limited | Genuine but narrow — small in scope, low complexity, or mostly supportive. |
| 3 | Moderate | Regular, solid work of normal difficulty; a reliable part of the team's output. |
| 4 | Substantial | Consistently high-value work — meaningful features, real bug fixes, work that unblocks others. |
| 5 | Exceptional | Outsized impact — owns something critical or hard; the project is clearly worse off without this person's specific work. |

**The seven scored dimensions** (mapped from the ten contribution factors a manager typically cares about — complexity and technical sophistication are folded into one dimension since they measure the same thing, and raw volume is handled separately, below):

1. **Code quality** — see above.
2. **Complexity & technical difficulty** — see above; covers both "how hard was this" and "how sophisticated was the solution."
3. **Bug-fixing impact** — weight by severity and blast radius of what was fixed, not count. One fix for a data-loss bug outranks ten typo fixes.
4. **Feature delivery** — features actually shipped, weighted by scope and user/product significance where that's inferable from PR or issue descriptions.
5. **Consistency & reliability** — steady engagement across the analyzed window rather than a single burst, follow-through (work gets merged, not abandoned), and responsiveness to review feedback. Judge this relative to the person's apparent role — an occasional external contributor shouldn't be scored on a full-time-maintainer cadence — and say explicitly what you're comparing them against.
6. **Maintainability contribution** — does the work make the codebase easier or harder to work in afterward: tests added, docs written, complexity reduced versus technical debt introduced.
7. **Project impact** — how central the touched systems are to the project, whether the work unblocked other people, and any user- or business-facing significance visible in the data.

**Volume of activity** — commit count, lines changed, files touched, number of contribution units — is reported as descriptive context (in the summary and evidence), not as one of the seven scored dimensions. That's deliberate: it's the metric most likely to be mistaken for value, so it never gets a tier of its own.

**Overall contribution** is a holistic judgment, not a mechanical average of the seven. A developer with modest volume but a 5 on complexity and project impact can land a high overall score; a developer with high volume but 2s on quality and complexity should not. Always express it as `{Tier label} ({n}/5)` — e.g. "Substantial (4/5)" — and explain in a few sentences which dimensions drove it. Never present it as an unexplained number, and never add false precision (no "73.2/100") unless the requester has an existing scoring system they've explicitly asked you to match.

The seven dimensions feed the report below; they don't each need a matching header in the output. Bug-fixing impact and feature delivery inform "Major features or changes" and "Important bug fixes"; maintainability contribution folds into whichever of "Code-quality assessment" or "Project impact" fits best; volume stays contextual, mentioned in the summary or evidence, never as its own score line.

## Edge cases and known limitations

| Scenario | What to do |
|---|---|
| Squash-merged PRs (individual commits lost) | Treat the squashed commit as the whole unit; credit the PR author plus any trailer co-authors. Note that finer-grained internal history isn't available. |
| Shallow clone / partial history | State the actual window analyzed; don't imply full-history coverage you don't have. |
| Force-pushed / rewritten branches | Work from the current refs; note that pre-rewrite activity (abandoned approaches, etc.) may be invisible. |
| No GitHub/PR API access, git-only | Skip review-based signals explicitly rather than guessing — say review data wasn't available. |
| Bot commits (dependabot, renovate, CI bots) | Exclude from per-developer scoring; summarize separately if useful. |
| Solo-maintainer repo | Team-level comparison isn't meaningful — focus the team section on areas of work rather than forcing a comparison. |
| Monorepo with clear ownership boundaries (e.g. CODEOWNERS) | Consider scoping impact assessment per area rather than one global blast radius. |
| External / one-off contributors | Evaluate what's actually there instead of penalizing for low volume; note the likely occasional nature explicitly. |
| Large one-time "import" commit (e.g. migrating from another system) | Don't credit the importer as if they wrote all of that code from scratch — note it as a migration/import event. |
| Co-authored / paired commits | Credit every listed co-author; note the pairing rather than picking one "primary" author. |
| A commit mixing a real change with an unrelated dependency bump or formatting sweep | Isolate the substantive part for scoring; don't let the incidental part inflate or dilute it. |
| Work with no trace in the repository (design docs, live meetings, incident response, mentoring) | Say plainly that this is outside what Git can show — see "Responsible use." |

## Fairness self-check

Run through this before finalizing any score:

- Have I checked whether a low-commit contributor is doing high-complexity or high-impact work that a naive commit count would hide?
- Have I avoided letting a high-line-count, low-complexity contributor outscore a low-line-count, high-complexity one?
- Have I identified people whose main value is reviewing, unblocking, or mentoring rather than authoring — and are they represented in "Potentially overlooked contributions"?
- Have I excluded or down-weighted generated code, dependency bumps, and formatting-only changes rather than letting them pad a score?
- Have I avoided judging legitimate part-time or occasional contributors against a full-time cadence?
- Can I point to specific evidence for every score, or did any of them come from a general impression rather than something I actually found in the data?

## Communicating uncertainty

Never invent commit details, PR numbers, or specifics you can't verify from the data you actually gathered. If the available history doesn't support a confident claim — about one developer or the repository as a whole — say that plainly instead of filling the gap with something plausible-sounding.

Give every individual analysis a stated confidence, with a specific reason, not boilerplate:

> **Confidence:** Medium — PR review data wasn't available, so grouping relied on commit-timing heuristics rather than explicit PR boundaries.

## Output format

### Individual developer analysis
Produce one of these per developer, using this structure:

```markdown
## {Developer name}

**Overall contribution score/credits:** {Tier label} ({n}/5)
**Confidence:** {High / Medium / Low} — {specific reason}

### Summary of their work
{2-4 sentence narrative}

### Major features or changes
- {contribution unit — what it does and why it mattered}

### Important bug fixes
- {what broke, why the fix mattered, severity if knowable}

### Code-quality assessment
{tier + narrative, grounded in specific examples}

### Complexity assessment
{tier + narrative}

### Consistency assessment
{tier + narrative, stated relative to this person's apparent role}

### Project impact
{tier + narrative}

### Strengths
- {specific, evidenced}

### Potential weaknesses
- {specific, evidenced, framed constructively}

### Evidence supporting the assessment
- {commit SHAs, PR numbers, file paths, or line ranges backing the claims above}
```

### Team-level analysis
Produce exactly one of these after all individual analyses:

```markdown
## Team contribution overview

### Overall team contribution summary
{narrative}

### Contribution comparison
| Developer | Overall contribution | Primary area(s) of work | Notable strength |
|---|---|---|---|
| {name} | {Tier} ({n}/5) | {area} | {strength} |

### Major areas of work
- {area}: {what it involved, who was involved}

### Distribution of contributions
{narrative — concentrated vs. broadly shared, described by area/type of work, not just share of commits}

### Important contributors to different areas
- {area}: {who, and why}

### Potentially overlooked contributions
- {reviewers, mentors, infra/tooling work, documentation, triage — with evidence}

### Areas where contribution data is ambiguous
- {what's unclear and why, tied back to the edge cases and confidence notes above}
```

## Responsible use

This analysis is decision support, not a verdict. It can inform a performance conversation, but it can't see meetings, mentoring, design discussions, incident response, or anything else real that never touched this repository. Present it as an evidence-based estimate for a human to weigh alongside context the repository can't show — not as a ranking to be applied mechanically.