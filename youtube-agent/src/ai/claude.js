import Anthropic from '@anthropic-ai/sdk';
import { config, hasClaude } from '../config.js';

let client = null;
if (hasClaude) {
  client = new Anthropic({ apiKey: config.anthropicApiKey });
}

/**
 * Ask Claude for a plain-text completion.
 * Returns { text, source } where source is 'claude' or 'fallback'.
 * If no API key is configured (or the call fails), `fallback()` supplies a
 * deterministic template so the whole pipeline still runs offline.
 */
export async function complete({ system, prompt, maxTokens = 1500, temperature = 0.9, fallback }) {
  if (!client) {
    return { text: fallback ? fallback() : '', source: 'fallback' };
  }
  try {
    const msg = await client.messages.create({
      model: config.claudeModel,
      max_tokens: maxTokens,
      temperature,
      system,
      messages: [{ role: 'user', content: prompt }],
    });
    const text = msg.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n')
      .trim();
    return { text, source: 'claude' };
  } catch (err) {
    console.error('[claude] request failed, using fallback:', err.message);
    return { text: fallback ? fallback() : '', source: 'fallback', error: err.message };
  }
}

/**
 * Ask Claude for JSON matching a described shape. Robustly extracts the first
 * JSON object/array in the response. Falls back to `fallback()` on any failure.
 */
export async function completeJSON({ system, prompt, maxTokens = 2000, temperature = 0.7, fallback }) {
  const jsonSystem =
    (system ? system + '\n\n' : '') +
    'Respond with ONLY valid JSON. No markdown fences, no commentary before or after.';

  if (!client) {
    return { data: fallback ? fallback() : null, source: 'fallback' };
  }
  try {
    const msg = await client.messages.create({
      model: config.claudeModel,
      max_tokens: maxTokens,
      temperature,
      system: jsonSystem,
      messages: [{ role: 'user', content: prompt }],
    });
    const raw = msg.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n');
    const data = extractJSON(raw);
    if (data === null) throw new Error('no JSON found in response');
    return { data, source: 'claude' };
  } catch (err) {
    console.error('[claude] JSON request failed, using fallback:', err.message);
    return { data: fallback ? fallback() : null, source: 'fallback', error: err.message };
  }
}

/** Pull the first balanced JSON object or array out of a string. */
export function extractJSON(text) {
  if (!text) return null;
  const trimmed = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // Fall through to bracket scanning.
  }
  const start = trimmed.search(/[[{]/);
  if (start === -1) return null;
  const open = trimmed[start];
  const close = open === '{' ? '}' : ']';
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = start; i < trimmed.length; i++) {
    const ch = trimmed[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\') { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(trimmed.slice(start, i + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

export { hasClaude };
