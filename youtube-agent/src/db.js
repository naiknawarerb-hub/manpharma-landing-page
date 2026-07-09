import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { config } from './config.js';

const dataDir = path.join(config.root, 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'agent.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS content (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    topic         TEXT NOT NULL,
    angle         TEXT,
    format        TEXT,
    status        TEXT NOT NULL DEFAULT 'draft',
    hooks_json    TEXT,
    script_json   TEXT,
    seo_json      TEXT,
    thumbnail_json TEXT,
    source        TEXT DEFAULT 'manual',
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS runs (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    kind       TEXT NOT NULL,
    detail     TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

function serialize(row) {
  if (!row) return row;
  return {
    ...row,
    hooks: parse(row.hooks_json),
    script: parse(row.script_json),
    seo: parse(row.seo_json),
    thumbnail: parse(row.thumbnail_json),
  };
}

function parse(json) {
  if (!json) return null;
  try { return JSON.parse(json); } catch { return null; }
}

export const contentRepo = {
  create({ topic, angle = null, format = null, status = 'draft', source = 'manual' }) {
    const stmt = db.prepare(
      `INSERT INTO content (topic, angle, format, status, source) VALUES (?, ?, ?, ?, ?)`
    );
    const info = stmt.run(topic, angle, format, status, source);
    return this.get(info.lastInsertRowid);
  },

  get(id) {
    return serialize(db.prepare(`SELECT * FROM content WHERE id = ?`).get(id));
  },

  list({ limit = 50 } = {}) {
    return db
      .prepare(`SELECT * FROM content ORDER BY created_at DESC LIMIT ?`)
      .all(limit)
      .map(serialize);
  },

  update(id, fields) {
    const map = {
      angle: 'angle',
      format: 'format',
      status: 'status',
      hooks: 'hooks_json',
      script: 'script_json',
      seo: 'seo_json',
      thumbnail: 'thumbnail_json',
    };
    const sets = [];
    const values = [];
    for (const [key, value] of Object.entries(fields)) {
      const col = map[key];
      if (!col) continue;
      sets.push(`${col} = ?`);
      values.push(
        ['hooks', 'script', 'seo', 'thumbnail'].includes(key)
          ? JSON.stringify(value)
          : value
      );
    }
    if (!sets.length) return this.get(id);
    sets.push(`updated_at = datetime('now')`);
    values.push(id);
    db.prepare(`UPDATE content SET ${sets.join(', ')} WHERE id = ?`).run(...values);
    return this.get(id);
  },

  remove(id) {
    return db.prepare(`DELETE FROM content WHERE id = ?`).run(id).changes > 0;
  },

  stats() {
    const total = db.prepare(`SELECT COUNT(*) AS n FROM content`).get().n;
    const byStatus = db
      .prepare(`SELECT status, COUNT(*) AS n FROM content GROUP BY status`)
      .all();
    return { total, byStatus };
  },
};

export const runRepo = {
  log(kind, detail = null) {
    db.prepare(`INSERT INTO runs (kind, detail) VALUES (?, ?)`).run(
      kind,
      detail ? JSON.stringify(detail) : null
    );
  },
  recent(limit = 20) {
    return db
      .prepare(`SELECT * FROM runs ORDER BY created_at DESC LIMIT ?`)
      .all(limit)
      .map((r) => ({ ...r, detail: parse(r.detail) }));
  },
};

export default db;
