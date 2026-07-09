import { generateIdeas } from './strategyAgent.js';
import { generateHooks } from './hookAgent.js';
import { writeScript } from './scriptAgent.js';
import { optimizeSEO } from './seoAgent.js';
import { designThumbnails } from './thumbnailAgent.js';
import { contentRepo, runRepo } from '../db.js';

/**
 * Run the full content pipeline for a single topic and persist the result.
 * strategy(optional) → hooks → script → SEO → thumbnails.
 * Returns the saved content row (with all agent outputs attached).
 */
export async function runPipeline({
  topic,
  angle = '',
  format = 'explainer',
  hookCategory = 'curiosity',
  lengthMinutes = 6,
  source = 'manual',
  contentId = null,
} = {}) {
  if (!topic) throw new Error('runPipeline requires a topic');

  const sources = {};

  const hookRes = await generateHooks({ topic, categoryId: hookCategory });
  sources.hooks = hookRes.source;
  const chosenHook = hookRes.groups?.[0]?.hooks?.[0] || '';

  const scriptRes = await writeScript({ topic, angle, chosenHook, format, lengthMinutes });
  sources.script = scriptRes.source;

  const seoRes = await optimizeSEO({ topic, angle, script: scriptRes.script });
  sources.seo = seoRes.source;

  const thumbRes = await designThumbnails({ topic, angle });
  sources.thumbnail = thumbRes.source;

  const record = contentId
    ? contentRepo.get(contentId)
    : contentRepo.create({ topic, angle, format, status: 'draft', source });

  const saved = contentRepo.update(record.id, {
    angle,
    format,
    status: 'ready',
    hooks: hookRes,
    script: scriptRes.script,
    seo: seoRes.seo,
    thumbnail: thumbRes.concepts,
  });

  runRepo.log('pipeline', { contentId: saved.id, topic, sources });
  return { content: saved, sources };
}

/**
 * The scheduled daily batch: ideate N topics, then run the full pipeline for each.
 * Returns a summary array.
 */
export async function runDailyBatch({ count = 3, seedTopic = null } = {}) {
  const { ideas, source } = await generateIdeas({ count, seedTopic });
  runRepo.log('daily_ideas', { count: ideas.length, source });

  const results = [];
  for (const idea of ideas) {
    try {
      const { content } = await runPipeline({
        topic: idea.topic,
        angle: idea.angle || '',
        format: idea.format || 'explainer',
        source: 'scheduler',
      });
      results.push({ id: content.id, topic: content.topic, status: content.status });
    } catch (err) {
      console.error('[orchestrator] pipeline failed for', idea.topic, err.message);
      results.push({ topic: idea.topic, status: 'error', error: err.message });
    }
  }
  runRepo.log('daily_batch', { generated: results.length });
  return results;
}
