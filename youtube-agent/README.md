# 🎬 YouTube AI Agent

A "24/7 YouTube employee" — one place that runs your whole content pipeline with AI:

**Strategy → Viral Hooks → Script → SEO → Thumbnail concepts**, on demand or on a daily schedule, with a dashboard and a saved content library.

Powered by **Anthropic Claude**. Inspired by [`darkzOGx/youtube-automation-agent`](https://github.com/darkzOGx/youtube-automation-agent) and fueled by a built-in library of **50 viral hook prompts** across 10 categories.

> Runs fine **without an API key** — every agent falls back to a deterministic template so you can explore the whole system offline, then flip it to real Claude output by adding one key.

---

## What it does

| Agent | Output |
|-------|--------|
| **Strategy** | Fresh, specific video ideas (topic + angle + format + why) |
| **Hooks** | Scroll-stopping hooks using the 50-prompt viral library (per category or a 10-style mix) |
| **Script** | Retention-optimized, structured script (hook, intro, sections, CTA, b-roll) |
| **SEO** | 5 title options, description, tags, hashtags, chapters, pinned comment |
| **Thumbnail** | High-CTR thumbnail *concepts* + ready-to-paste text-to-image prompts |
| **Orchestrator** | Runs all of the above for a topic and saves it to the library |
| **Scheduler** | Ideates + generates a batch of drafts every morning (cron) |

## Quick start

```bash
cd youtube-agent
npm install
cp .env.example .env      # then add your ANTHROPIC_API_KEY (optional)
npm start
```

Open **http://localhost:3456**.

### Configuration (`.env`)

| Var | Purpose |
|-----|---------|
| `ANTHROPIC_API_KEY` | Enables real Claude generation. Omit for template mode. |
| `CLAUDE_MODEL` | Defaults to `claude-opus-4-8`. |
| `CHANNEL_NAME` / `CHANNEL_NICHE` / `TARGET_AUDIENCE` / `CONTENT_TONE` | Steer every agent's voice and targeting. |
| `PORT` | Dashboard/API port (default `3456`). |
| `API_KEY` | Optional. If set, mutating endpoints require an `x-api-key` header. |
| `ENABLE_SCHEDULER` | `true`/`false` for the daily cron. |
| `DAILY_CRON` / `DAILY_IDEA_COUNT` | When the batch runs and how many ideas per run. |

## API

| Method | Endpoint | Body |
|--------|----------|------|
| `GET`  | `/health`, `/api/status` | — |
| `GET`  | `/api/hooks/categories` | — |
| `POST` | `/api/ideas` | `{ count, seedTopic? }` |
| `POST` | `/api/hooks` | `{ topic, categoryId, perPrompt? }` (`categoryId: "mix"` for all 10) |
| `POST` | `/api/script` | `{ topic, angle?, chosenHook?, format?, lengthMinutes? }` |
| `POST` | `/api/seo` | `{ topic, angle?, script? }` |
| `POST` | `/api/thumbnails` | `{ topic, angle?, count? }` |
| `POST` | `/api/generate` | `{ topic, angle?, format?, hookCategory?, lengthMinutes? }` — **full pipeline** |
| `POST` | `/api/daily-batch` | `{ count?, seedTopic? }` |
| `GET`/`PATCH`/`DELETE` | `/api/content/:id` | content CRUD |
| `GET`  | `/api/runs` | recent agent activity |

```bash
curl -X POST localhost:3456/api/generate \
  -H 'Content-Type: application/json' \
  -d '{"topic":"Notion AI for founders","format":"tutorial","hookCategory":"educational"}'
```

## Architecture

```
youtube-agent/
├── index.js                 Express server + dashboard + scheduler boot
├── src/
│   ├── config.js            Env + channel config
│   ├── db.js                SQLite (better-sqlite3): content + runs
│   ├── scheduler.js         node-cron daily batch
│   ├── ai/
│   │   ├── claude.js        Anthropic wrapper (text + JSON) with fallbacks
│   │   └── hooks-library.js The 50 viral hook prompts
│   ├── agents/              strategy · hook · script · seo · thumbnail · orchestrator
│   └── routes/api.js        REST API
└── public/                  Dashboard (vanilla HTML/CSS/JS)
```

## Roadmap (not built yet)

This is the **AI content pipeline**. Media production and publishing are intentionally left as fallbacks/stubs:

- 🔊 TTS voiceover (ElevenLabs / OpenAI TTS)
- 🖼️ Real thumbnail rendering (image model → the `imagePrompt` each concept already produces)
- 🎞️ FFmpeg video assembly
- 📤 YouTube Data API upload + scheduling (OAuth)

The agent architecture is designed so each of these slots in as a new agent behind the orchestrator.

## License

MIT
