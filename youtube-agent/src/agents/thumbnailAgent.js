import { completeJSON } from '../ai/claude.js';
import { config } from '../config.js';

/**
 * Thumbnail Designer Agent — produces thumbnail *concepts* (not pixels):
 * short overlay text, visual direction, color/emotion, and a ready-to-use
 * image-generation prompt you can paste into any text-to-image tool.
 */
export async function designThumbnails({ topic, angle = '', count = 3 } = {}) {
  const { niche } = config.channel;

  const system = `You are the Thumbnail Designer Agent. You design high-CTR YouTube thumbnails.
Rules: 3-5 words of overlay text max, one clear focal subject, high contrast, strong emotion, readable on mobile.`;

  const prompt = `Design ${count} distinct thumbnail concepts for a video about "${topic}" (${niche}).
${angle ? `Angle: ${angle}.` : ''}

Return a JSON array of ${count} objects, each:
{
  "overlayText": "3-5 punchy words",
  "visual": "the focal subject and composition",
  "emotion": "the facial expression / feeling to convey",
  "palette": "2-3 dominant colors",
  "imagePrompt": "a detailed prompt for a text-to-image model to render this thumbnail (16:9, no text baked in)"
}`;

  const { data, source } = await completeJSON({
    system,
    prompt,
    maxTokens: 1500,
    temperature: 0.9,
    fallback: () => fallbackThumbs(topic, count),
  });

  const concepts = Array.isArray(data) ? data : fallbackThumbs(topic, count);
  return { concepts: concepts.slice(0, count), source };
}

function fallbackThumbs(topic, count) {
  const bases = [
    { overlayText: 'THE TRUTH', emotion: 'shocked / wide-eyed', palette: 'red, black, white' },
    { overlayText: 'DO THIS INSTEAD', emotion: 'confident, pointing', palette: 'blue, yellow' },
    { overlayText: 'BIG MISTAKE', emotion: 'worried, hand on head', palette: 'orange, dark navy' },
  ];
  return Array.from({ length: count }, (_, i) => {
    const b = bases[i % bases.length];
    return {
      ...b,
      visual: `Close-up of a person reacting to ${topic}, bold arrow pointing to a key element`,
      imagePrompt: `A high-contrast 16:9 YouTube thumbnail background about ${topic}, dramatic lighting, expressive subject, ${b.palette} color scheme, cinematic, no text`,
    };
  });
}
