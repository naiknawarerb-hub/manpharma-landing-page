import { completeJSON } from '../ai/claude.js';
import { config } from '../config.js';

/**
 * SEO Optimizer Agent — generates click-worthy, search-friendly metadata:
 * titles (A/B options), description, tags, hashtags, chapters and pinned comment.
 */
export async function optimizeSEO({ topic, angle = '', script = null } = {}) {
  const { name, niche, audience } = config.channel;

  const scriptSummary = script
    ? `Script hook: ${script.hook}\nSections: ${(script.sections || [])
        .map((s) => s.heading)
        .join(', ')}`
    : '';

  const system = `You are the SEO Optimizer Agent for the YouTube channel "${name}" (${niche}).
Audience: ${audience}. You maximize click-through-rate and searchability without clickbait that under-delivers.`;

  const prompt = `Create YouTube metadata for a video about "${topic}".
${angle ? `Angle: ${angle}.` : ''}
${scriptSummary}

Return JSON with this exact shape:
{
  "titles": ["5 distinct title options, each <= 60 chars, front-load keywords"],
  "description": "3-5 short paragraphs; first 2 lines must hook + contain the main keyword",
  "tags": ["12-18 search tags, no # symbol"],
  "hashtags": ["3-5 hashtags with # for the description"],
  "chapters": [{ "time": "0:00", "label": "Intro" }],
  "pinnedComment": "an engagement-driving pinned comment ending in a question"
}`;

  const { data, source } = await completeJSON({
    system,
    prompt,
    maxTokens: 1800,
    temperature: 0.7,
    fallback: () => fallbackSEO(topic),
  });

  return { seo: normalize(data, topic), source };
}

function normalize(data, topic) {
  if (!data || typeof data !== 'object') return fallbackSEO(topic);
  return {
    titles: arr(data.titles),
    description: data.description || '',
    tags: arr(data.tags),
    hashtags: arr(data.hashtags),
    chapters: Array.isArray(data.chapters) ? data.chapters : [],
    pinnedComment: data.pinnedComment || '',
  };
}

const arr = (v) => (Array.isArray(v) ? v : []);

function fallbackSEO(topic) {
  return {
    titles: [
      `${topic}: The Complete Guide`,
      `How ${topic} Actually Works`,
      `${topic} — 5 Things You're Doing Wrong`,
      `The Truth About ${topic}`,
      `${topic} Explained in Minutes`,
    ],
    description: `Everything you need to know about ${topic}, broken down step by step.\n\nIn this video we cover the core idea, the exact method, and the mistakes to avoid.\n\nSubscribe for more.`,
    tags: [topic, `${topic} tutorial`, `${topic} guide`, `how to ${topic}`, 'beginner', 'tips', 'explained'],
    hashtags: ['#tutorial', '#howto', '#tips'],
    chapters: [
      { time: '0:00', label: 'Intro' },
      { time: '0:30', label: 'The core idea' },
      { time: '2:00', label: 'The method' },
      { time: '4:00', label: 'Mistakes to avoid' },
    ],
    pinnedComment: `What part of ${topic} do you want a full video on next? 👇`,
  };
}
