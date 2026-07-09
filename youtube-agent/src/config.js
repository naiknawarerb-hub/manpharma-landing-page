import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function bool(value, fallback) {
  if (value === undefined) return fallback;
  return String(value).toLowerCase() !== 'false' && value !== '0';
}

export const config = {
  root: path.resolve(__dirname, '..'),

  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  claudeModel: process.env.CLAUDE_MODEL || 'claude-opus-4-8',

  channel: {
    name: process.env.CHANNEL_NAME || 'My Channel',
    niche: process.env.CHANNEL_NICHE || 'AI tools for creators',
    audience: process.env.TARGET_AUDIENCE || 'solo creators and small teams',
    tone: process.env.CONTENT_TONE || 'energetic, practical, no fluff',
  },

  port: Number(process.env.PORT) || 3456,
  apiKey: process.env.API_KEY || '',

  scheduler: {
    enabled: bool(process.env.ENABLE_SCHEDULER, true),
    dailyCron: process.env.DAILY_CRON || '0 6 * * *',
    dailyIdeaCount: Number(process.env.DAILY_IDEA_COUNT) || 3,
  },
};

export const hasClaude = Boolean(config.anthropicApiKey);
