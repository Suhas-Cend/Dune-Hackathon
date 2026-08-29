import { Octokit } from '@octokit/rest';
import { config } from './config.js';

export const octokit = new Octokit({ auth: config.githubToken });

export async function verifyAccess({ owner = config.githubOwner, repo = config.githubRepo } = {}) {
  try {
    const { data } = await octokit.repos.get({ owner, repo });
    return data;
  } catch (err) {
    if (err.status === 404) {
      throw new Error(
        `Can't find ${owner}/${repo}. ` +
        `Check GITHUB_OWNER / GITHUB_REPO in .env, and that the token has access to it.`
      );
    }
    if (err.status === 401) {
      throw new Error('GitHub rejected the token. Check GITHUB_TOKEN in .env.');
    }
    throw err;
  }
}