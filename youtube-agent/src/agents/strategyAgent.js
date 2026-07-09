import { completeJSON } from '../ai/claude.js';
import { config } from '../config.js';

/**
 * Content Strategy Agent — proposes fresh video ideas for the channel.
 * Returns an array of { topic, angle, format, why }.
 */
export async function generateIdeas({ count = 3, seedTopic = null } = {}) {
  const { name, niche, audience, tone } = config.channel;

  const system = `You are the Content Strategy Agent for a YouTube channel called "${name}".
Niche: ${niche}. Target audience: ${audience}. Tone: ${tone}.
You plan bingeable, search-friendly video ideas that balance trending appeal with evergreen value.`;

  const prompt = `Propose ${count} distinct YouTube video ideas${
    seedTopic ? ` related to "${seedTopic}"` : ''
  }.
For each idea return an object with:
- "topic": a concrete, specific subject (not a title)
- "angle": the unique spin or promise that makes it click-worthy
- "format": one of "tutorial", "listicle", "story", "case-study", "reaction", "explainer", "short"
- "why": one sentence on why it fits this audience now

Return a JSON array of exactly ${count} such objects.`;

  const { data, source } = await completeJSON({
    system,
    prompt,
    maxTokens: 1500,
    fallback: () => fallbackIdeas({ count, seedTopic, niche }),
  });

  const ideas = Array.isArray(data) ? data : fallbackIdeas({ count, seedTopic, niche });
  return { ideas: ideas.slice(0, count), source };
}

function fallbackIdeas({ count, seedTopic, niche }) {
  const base = seedTopic || niche;
  const templates = [
    { format: 'tutorial', angle: 'the fastest beginner path', why: 'Beginners search this constantly.' },
    { format: 'listicle', angle: '5 tools nobody talks about', why: 'List formats are easy binge fuel.' },
    { format: 'story', angle: 'the expensive mistake I made', why: 'Story hooks drive watch time.' },
    { format: 'case-study', angle: 'a real before/after breakdown', why: 'Proof builds trust and shares.' },
    { format: 'explainer', angle: 'why it actually works', why: 'Mechanism content earns saves.' },
  ];
  return Array.from({ length: count }, (_, i) => {
    const t = templates[i % templates.length];
    return { topic: `${base} — ${t.angle}`, angle: t.angle, format: t.format, why: t.why };
  });
}
