import { octokit } from './githubClient.js';
import { config } from './config.js';

async function getAllBranches(owner, repo) {
  const branches = await octokit.paginate(octokit.repos.listBranches, {
    owner,
    repo,
    per_page: 100,
  });
  return branches.map((b) => b.name);
}

async function getCommitsForBranch(owner, repo, branch, since) {
  return octokit.paginate(octokit.repos.listCommits, {
    owner,
    repo,
    sha: branch,
    since,
    per_page: 100,
  });
}

async function getCommitDetail(owner, repo, sha) {
  const { data } = await octokit.repos.getCommit({
    owner,
    repo,
    ref: sha,
  });
  return data;
}

async function getAllPullRequests(owner, repo) {
  return octokit.paginate(octokit.pulls.list, {
    owner,
    repo,
    state: 'all',
    per_page: 100,
  });
}

export async function collectContributions({
  owner = config.githubOwner,
  repo = config.githubRepo,
  sinceDays = config.lookbackDays,
} = {}) {
  const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000).toISOString();

  const branches = await getAllBranches(owner, repo);
  const seenShas = new Set();
  const byAuthor = {};

  const bucketFor = (login) => {
    if (!byAuthor[login]) byAuthor[login] = { commits: [], pullRequests: [] };
    return byAuthor[login];
  };

  for (const branch of branches) {
    const commits = await getCommitsForBranch(owner, repo, branch, since);
    for (const commit of commits) {
      if (seenShas.has(commit.sha)) continue;
      seenShas.add(commit.sha);

      const login = commit.author?.login || commit.commit.author?.name || 'unknown';
      bucketFor(login).commits.push({
        sha: commit.sha,
        message: commit.commit.message,
        date: commit.commit.author?.date,
        branch,
      });
    }
  }

  const pullRequests = await getAllPullRequests(owner, repo);
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

export async function attachCommitStats(byAuthor, { owner = config.githubOwner, repo = config.githubRepo } = {}) {
  for (const login of Object.keys(byAuthor)) {
    for (const commit of byAuthor[login].commits) {
      const detail = await getCommitDetail(owner, repo, commit.sha);
      commit.additions = detail.stats?.additions || 0;
      commit.deletions = detail.stats?.deletions || 0;
      commit.filesChanged = (detail.files || []).map((f) => f.filename);

      commit.patchSample = (detail.files || [])
        .slice(0, 5)
        .map((f) => `--- ${f.filename} ---\n${(f.patch || '(no text diff)').slice(0, 1500)}`)
        .join('\n\n');
    }
  }
  return byAuthor;
}