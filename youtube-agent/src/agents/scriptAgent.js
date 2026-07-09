import { completeJSON } from '../ai/claude.js';
import { config } from '../config.js';

/**
 * Script Writer Agent — produces a full, structured video script from a topic
 * and (optionally) a chosen hook. Returns { hook, intro, sections[], cta, broll[], estimatedMinutes }.
 */
export async function writeScript({ topic, angle = '', chosenHook = '', format = 'explainer', lengthMinutes = 6 } = {}) {
  const { name, niche, audience, tone } = config.channel;

  const system = `You are the Script Writer Agent for the YouTube channel "${name}" (${niche}).
Audience: ${audience}. Tone: ${tone}.
You write retention-optimized scripts: a punchy hook in the first 5 seconds, an open loop, clear value delivery, pattern interrupts, and a strong call-to-action. Write for the ear, not the page.`;

  const prompt = `Write a ${lengthMinutes}-minute ${format} video script about: "${topic}".
${angle ? `Angle: ${angle}.` : ''}
${chosenHook ? `Open with this hook (adapt if needed): "${chosenHook}".` : ''}

Return JSON with this exact shape:
{
  "hook": "the spoken first line(s), 1-2 sentences",
  "intro": "2-4 sentences that set up the value and open a curiosity loop",
  "sections": [
    { "heading": "short section label", "talkingPoints": ["spoken beat", "spoken beat"], "onScreen": "text/visual cue" }
  ],
  "cta": "the closing call-to-action (subscribe / comment / next video)",
  "broll": ["b-roll or visual idea", "..."],
  "estimatedMinutes": ${lengthMinutes}
}
Aim for ${Math.max(3, Math.round(lengthMinutes / 1.5))} sections.`;

  const { data, source } = await completeJSON({
    system,
    prompt,
    maxTokens: 2500,
    temperature: 0.85,
    fallback: () => fallbackScript(topic, chosenHook, lengthMinutes),
  });

  return { script: normalize(data, topic, lengthMinutes), source };
}

function normalize(data, topic, lengthMinutes) {
  if (!data || typeof data !== 'object') return fallbackScript(topic, '', lengthMinutes);
  return {
    hook: data.hook || '',
    intro: data.intro || '',
    sections: Array.isArray(data.sections) ? data.sections : [],
    cta: data.cta || '',
    broll: Array.isArray(data.broll) ? data.broll : [],
    estimatedMinutes: data.estimatedMinutes || lengthMinutes,
  };
}

function fallbackScript(topic, chosenHook, lengthMinutes) {
  return {
    hook: chosenHook || `Here's what nobody tells you about ${topic}.`,
    intro: `In the next few minutes you'll get the exact breakdown of ${topic} — no fluff, just the stuff that actually moves the needle. Stick around, because the third point surprises most people.`,
    sections: [
      { heading: 'The core idea', talkingPoints: [`What ${topic} really means`, 'Why the common approach fails'], onScreen: `Title card: ${topic}` },
      { heading: 'The method', talkingPoints: ['Step-by-step walkthrough', 'A concrete example'], onScreen: 'Screen recording / diagram' },
      { heading: 'The mistake to avoid', talkingPoints: ['The trap most people fall into', 'The fix'], onScreen: 'Before/after comparison' },
    ],
    cta: 'If this helped, subscribe — the next video goes even deeper. Drop a comment with your biggest question.',
    broll: ['Establishing shot', 'Close-up of the key step', 'Result / payoff shot'],
    estimatedMinutes: lengthMinutes,
  };
}
