import { complete } from '../ai/claude.js';
import { config } from '../config.js';
import {
  HOOK_CATEGORIES,
  getCategory,
  fillHookPrompt,
} from '../ai/hooks-library.js';

/**
 * Hook Agent — turns a topic into scroll-stopping hooks using the
 * 50-prompt viral hook library. Generates hooks for one category (or a
 * curated mix across categories when categoryId is 'mix').
 */
export async function generateHooks({ topic, categoryId = 'curiosity', perPrompt = false } = {}) {
  const { niche, audience } = config.channel;
  const ctx = { topic, audience, niche };

  const categories =
    categoryId === 'mix'
      ? HOOK_CATEGORIES.map((c) => ({ cat: c, prompt: c.prompts[0] }))
      : (() => {
          const cat = getCategory(categoryId);
          const prompts = perPrompt ? cat.prompts : [cat.prompts[0]];
          return prompts.map((p) => ({ cat, prompt: p }));
        })();

  const results = [];
  let source = 'claude';

  for (const { cat, prompt } of categories) {
    const filled = fillHookPrompt(prompt.text, ctx);
    const system = `You are a world-class viral hook writer. You write hooks that stop the scroll and get clicks on YouTube titles, thumbnails and Shorts. Never use hashtags. Output only the numbered hooks, nothing else.`;

    const { text, source: src } = await complete({
      system,
      prompt: filled,
      maxTokens: 700,
      temperature: 1.0,
      fallback: () => fallbackHooks(topic, cat.name),
    });
    if (src === 'fallback') source = 'fallback';

    results.push({
      category: cat.name,
      categoryId: cat.id,
      promptName: prompt.name,
      hooks: parseNumberedList(text),
    });
  }

  return { topic, groups: results, source };
}

/** Parse "1. foo\n2. bar" (and dash bullets) into a clean string array. */
export function parseNumberedList(text) {
  if (!text) return [];
  return text
    .split('\n')
    .map((line) => line.replace(/^\s*(?:\d+[.)]|[-*•])\s*/, '').trim())
    .filter((line) => line.length > 0 && !/^here are|^sure[,!]/i.test(line));
}

function fallbackHooks(topic, categoryName) {
  return [
    `1. The ${categoryName} truth about ${topic} nobody tells you`,
    `2. I tried ${topic} so you don't have to — here's what happened`,
    `3. Stop doing ${topic} like this (do this instead)`,
    `4. The 30-second ${topic} trick that changed everything`,
    `5. Why 90% get ${topic} wrong`,
  ].join('\n');
}
