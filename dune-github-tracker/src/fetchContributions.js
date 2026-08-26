// This is the heart of "check the code each person has PRed or committed and
// what each person has worked on their branches" from the brief.
//
// collectContributions() walks EVERY branch (not just main), collects every
// commit and PR, and groups it all by the person who wrote it.

import { octokit } from './githubClient.js';
import { config } from './config.js';

async function getAllBranches() {
  const branches = await octokit.paginate(octokit.repos.listBranches, {
    owner: config.githubOwner,
    repo: config.githubRepo,
    per_page: 100,
  });
  return branches.map((b) => b.name);
}

async function getCommitsForBranch(branch, since) {
  return octokit.paginate(octokit.repos.listCommits, {
    owner: config.githubOwner,
    repo: config.githubRepo,
    sha: branch,
    since,
    per_page: 100,
  });
}

// Full diff/stats for one commit — this is what we hand to the AI later.
async function getCommitDetail(sha) {
  const { data } = await octokit.repos.getCommit({
    owner: config.githubOwner,
    repo: config.githubRepo,
    ref: sha,
  });
  return data;
}

async function getAllPullRequests() {
  return octokit.paginate(octokit.pulls.list, {
    owner: config.githubOwner,
    repo: config.githubRepo,
    state: 'all',
    per_page: 100,
  });
}

/**
 * Returns: { [githubUsername]: { commits: [...], pullRequests: [...] } }
 * Commits are de-duplicated by SHA, since the same commit can appear on
 * more than one branch.
 */
export async function collectContributions({ sinceDays = config.lookbackDays } = {}) {
  const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000).toISOString();

  const branches = await getAllBranches();
  const seenShas = new Set();
  const byAuthor = {};

  const bucketFor = (login) => {
    if (!byAuthor[login]) byAuthor[login] = { commits: [], pullRequests: [] };
    return byAuthor[login];
  };

  for (const branch of branches) {
    const commits = await getCommitsForBranch(branch, since);
    for (const commit of commits) {
      if (seenShas.has(commit.sha)) continue;
      seenShas.add(commit.sha);

      // Prefer the verified GitHub login; fall back to the raw git author name
      // (covers commits made with an email that isn't linked to a GitHub account).
      const login = commit.author?.login || commit.commit.author?.name || 'unknown';
      bucketFor(login).commits.push({
        sha: commit.sha,
        message: commit.commit.message,
        date: commit.commit.author?.date,
        branch,
      });
    }
  }

  const pullRequests = await getAllPullRequests();
  for (const pr of pullRequests) {
    const login = pr.user?.login || 'unknown';
    bucketFor(login).pullRequests.push({
      number: pr.number,
      title: pr.title,
      state: pr.state,
      merged: Boolean(pr.merged_at),
      createdAt: pr.created_at,
    });
  }

  return byAuthor;
}

/**
 * Mutates byAuthor in place, adding line-change stats and a trimmed diff
 * sample to every commit. Kept as a separate pass because it's one extra
 * API call PER COMMIT — you don't always want to pay for it (e.g. a quick
 * "who's committed what" check doesn't need full diffs).
 */
export async function attachCommitStats(byAuthor) {
  for (const login of Object.keys(byAuthor)) {
    for (const commit of byAuthor[login].commits) {
      const detail = await getCommitDetail(commit.sha);
      commit.additions = detail.stats?.additions || 0;
      commit.deletions = detail.stats?.deletions || 0;
      commit.filesChanged = (detail.files || []).map((f) => f.filename);
      // Cap how much diff text we keep — enough for the AI to judge quality,
      // not so much that one huge commit blows the whole request budget.
      commit.patchSample = (detail.files || [])
        .slice(0, 5)
        .map((f) => `--- ${f.filename} ---\n${(f.patch || '(no text diff)').slice(0, 1500)}`)
        .join('\n\n');
    }
  }
  return byAuthor;
}
