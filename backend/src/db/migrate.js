/**
 * Database schema migrations using node:sqlite.
 *
 * Schema (derived from AppContext + routineManager analysis):
 *   profiles    — local user profiles (multi-user ready)
 *   categories  — activity categories with routine + streak info
 *   log_entries — daily activity counts (profile × date × category)
 *   settings    — arbitrary key-value store per profile
 */
import db from './database.js';

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS profiles (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT    NOT NULL DEFAULT 'Default',
    is_first_login INTEGER NOT NULL DEFAULT 1,
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS categories (
    id            TEXT    PRIMARY KEY,
    profile_id    INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    label         TEXT    NOT NULL,
    color         TEXT    NOT NULL DEFAULT '#8b5cf6',
    routine_type  TEXT    NOT NULL DEFAULT 'daily',
    routine_days  TEXT    NOT NULL DEFAULT '[]',
    streak_count  INTEGER NOT NULL DEFAULT 0,
    streak_last   TEXT
  );

  CREATE TABLE IF NOT EXISTS log_entries (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id  INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    date        TEXT    NOT NULL,
    category_id TEXT    NOT NULL,
    count       INTEGER NOT NULL DEFAULT 0,
    UNIQUE(profile_id, date, category_id)
  );

  CREATE TABLE IF NOT EXISTS settings (
    profile_id  INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    key         TEXT    NOT NULL,
    value       TEXT,
    PRIMARY KEY (profile_id, key)
  );

  CREATE INDEX IF NOT EXISTS idx_log_profile_date ON log_entries(profile_id, date);
  CREATE INDEX IF NOT EXISTS idx_categories_profile ON categories(profile_id);
`;

export function runMigrations() {
  db.exec(SCHEMA);

  const count = Object.assign({}, db.prepare('SELECT COUNT(*) AS n FROM profiles').get());
  if (count.n === 0) {
    db.prepare("INSERT INTO profiles (name) VALUES ('Default')").run();
    console.log('✅ Seeded default profile (id=1)');
  }

  console.log('✅ Database migrations complete');
}
