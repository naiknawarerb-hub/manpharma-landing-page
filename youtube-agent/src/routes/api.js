import express from 'express';
import { config, hasClaude } from '../config.js';
import { contentRepo, runRepo } from '../db.js';
import { HOOK_CATEGORIES } from '../ai/hooks-library.js';
import { generateIdeas } from '../agents/strategyAgent.js';
import { generateHooks } from '../agents/hookAgent.js';
import { writeScript } from '../agents/scriptAgent.js';
import { optimizeSEO } from '../agents/seoAgent.js';
import { designThumbnails } from '../agents/thumbnailAgent.js';
import { runPipeline, runDailyBatch } from '../agents/orchestrator.js';

export const router = express.Router();

// Protect mutating endpoints with an optional shared secret.
function requireKey(req, res, next) {
  if (!config.apiKey) return next();
  if (req.get('x-api-key') === config.apiKey) return next();
  return res.status(401).json({ error: 'invalid or missing x-api-key header' });
}

const wrap = (fn) => (req, res) =>
  Promise.resolve(fn(req, res)).catch((err) => {
    console.error('[api]', err);
    res.status(500).json({ error: err.message });
  });

// ── Meta ───────────────────────────────────────────────────────────────────
router.get('/status', (req, res) => {
  res.json({
    ok: true,
    claude: hasClaude ? 'configured' : 'fallback-mode',
    model: config.claudeModel,
    channel: config.channel,
    scheduler: config.scheduler,
    stats: contentRepo.stats(),
  });
});

router.get('/hooks/categories', (req, res) => {
  res.json(
    HOOK_CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
      tagline: c.tagline,
      prompts: c.prompts.map((p) => ({ id: p.id, name: p.name })),
    }))
  );
});

router.get('/runs', (req, res) => res.json(runRepo.recent(30)));

// ── Individual agents ────────────────────────────────────────────────────────
router.post('/ideas', requireKey, wrap(async (req, res) => {
  const { count = 3, seedTopic = null } = req.body || {};
  res.json(await generateIdeas({ count: Number(count), seedTopic }));
}));

router.post('/hooks', requireKey, wrap(async (req, res) => {
  const { topic, categoryId = 'curiosity', perPrompt = false } = req.body || {};
  if (!topic) return res.status(400).json({ error: 'topic is required' });
  res.json(await generateHooks({ topic, categoryId, perPrompt }));
}));

router.post('/script', requireKey, wrap(async (req, res) => {
  const { topic, angle, chosenHook, format, lengthMinutes } = req.body || {};
  if (!topic) return res.status(400).json({ error: 'topic is required' });
  res.json(await writeScript({ topic, angle, chosenHook, format, lengthMinutes: Number(lengthMinutes) || 6 }));
}));

router.post('/seo', requireKey, wrap(async (req, res) => {
  const { topic, angle, script } = req.body || {};
  if (!topic) return res.status(400).json({ error: 'topic is required' });
  res.json(await optimizeSEO({ topic, angle, script }));
}));

router.post('/thumbnails', requireKey, wrap(async (req, res) => {
  const { topic, angle, count = 3 } = req.body || {};
  if (!topic) return res.status(400).json({ error: 'topic is required' });
  res.json(await designThumbnails({ topic, angle, count: Number(count) }));
}));

// ── Full pipeline ────────────────────────────────────────────────────────────
router.post('/generate', requireKey, wrap(async (req, res) => {
  const { topic, angle, format, hookCategory, lengthMinutes } = req.body || {};
  if (!topic) return res.status(400).json({ error: 'topic is required' });
  const result = await runPipeline({
    topic,
    angle,
    format,
    hookCategory,
    lengthMinutes: Number(lengthMinutes) || 6,
  });
  res.json(result);
}));

router.post('/daily-batch', requireKey, wrap(async (req, res) => {
  const { count, seedTopic } = req.body || {};
  const results = await runDailyBatch({ count: Number(count) || config.scheduler.dailyIdeaCount, seedTopic });
  res.json({ results });
}));

// ── Content library (CRUD) ───────────────────────────────────────────────────
router.get('/content', (req, res) => res.json(contentRepo.list({ limit: 100 })));

router.get('/content/:id', (req, res) => {
  const row = contentRepo.get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'not found' });
  res.json(row);
});

router.patch('/content/:id', requireKey, wrap(async (req, res) => {
  const row = contentRepo.get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'not found' });
  res.json(contentRepo.update(row.id, req.body || {}));
}));

router.delete('/content/:id', requireKey, (req, res) => {
  const ok = contentRepo.remove(Number(req.params.id));
  res.json({ deleted: ok });
});
