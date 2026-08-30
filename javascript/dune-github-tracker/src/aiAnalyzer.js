// This is the "ask AI to check the code and report on quality" piece.
// One call to Claude per contributor: give it that person's commit messages
// + diffs, get back a quality score and a short plain-English summary.

import Anthropic from '@anthropic-ai/sdk';
import { config } from './config.js';

const anthropic = config.anthropicApiKey
  ? new Anthropic({ apiKey: config.anthropicApiKey })
  : null;

const SYSTEM_PROMPT = `You are a senior engineering reviewer for Dune, a tool that summarizes
each team member's GitHub contributions fairly and constructively.
Given one person's recent commits (messages + diffs), respond with ONLY JSON, no other text:
{
  "qualityScore": <integer 1-10>,
  "summary": "<2-3 sentence summary of what this person actually worked on>",
  "strengths": ["short phrase", "..."],
  "notes": "<one sentence flagging anything a human reviewer should double check, or an empty string>"
}
Be specific and fair. Base everything only on what's in the diffs/messages — never invent details.`;

export async function analyzeContributor(login, commits) {
  if (!anthropic) {
    return {
      qualityScore: null,
      summary: 'AI analysis skipped — no ANTHROPIC_API_KEY set in .env.',
      strengths: [],
      notes: '',
    };
  }
  if (!commits.length) {
    return { qualityScore: null, summary: 'No commits in this period.', strengths: [], notes: '' };
  }

  const commitText = commits
    .map((c, i) => {
      const files = c.filesChanged?.join(', ') || 'unknown files';
      return `Commit ${i + 1}: ${c.message}\nFiles: ${files}\n${c.patchSample || ''}`;
    })
    .join('\n\n---\n\n')
    .slice(0, 15000); // keep each request a sane size

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `Contributor: ${login}\n\n${commitText}` }],
    });

    const text = response.content.find((block) => block.type === 'text')?.text || '{}';
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (err) {
    return {
      qualityScore: null,
      summary: `AI analysis failed for ${login}: ${err.message}`,
      strengths: [],
      notes: '',
    };
  }
}
