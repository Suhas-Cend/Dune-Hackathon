// This file is the "connect GitHub to the AI" piece from the brief.
// One authenticated Octokit client, shared by every other file.

import { Octokit } from '@octokit/rest';
import { config } from './config.js';

export const octokit = new Octokit({ auth: config.githubToken });

// Call this once at startup so a bad token / wrong repo name fails loudly
// and immediately, instead of quietly returning empty data later.
export async function verifyAccess() {
  try {
    const { data } = await octokit.repos.get({
      owner: config.githubOwner,
      repo: config.githubRepo,
    });
    return data;
  } catch (err) {
    if (err.status === 404) {
      throw new Error(
        `Can't find ${config.githubOwner}/${config.githubRepo}. ` +
        `Check GITHUB_OWNER / GITHUB_REPO in .env, and that the token has access to it.`
      );
    }
    if (err.status === 401) {
      throw new Error('GitHub rejected the token. Check GITHUB_TOKEN in .env.');
    }
    throw err;
  }
}
