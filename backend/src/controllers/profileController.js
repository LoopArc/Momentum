import db from '../db/database.js';
import { EMPTY_USER_DATA } from '../constants.js';

const PID = 1; // default profile id

/** GET /api/profile */
export function getProfile(req, res) {
  const raw = db.prepare('SELECT * FROM profiles WHERE id = ?').get(PID);
  if (!raw) return res.status(404).json({ error: 'Profile not found' });
  const profile = toPlain(raw);

  const categories = db
    .prepare('SELECT * FROM categories WHERE profile_id = ? ORDER BY rowid ASC')
    .all(PID)
    .map((r) => parseCategoryRow(toPlain(r)));

  const logRows = db
    .prepare('SELECT date, category_id, count FROM log_entries WHERE profile_id = ?')
    .all(PID)
    .map(toPlain);

  const log = buildLogObject(logRows);

  const settingsRows = db
    .prepare('SELECT key, value FROM settings WHERE profile_id = ?')
    .all(PID)
    .map(toPlain);
  const rawSettings = buildSettingsObject(settingsRows);

  const settings = {
    ...EMPTY_USER_DATA.settings,
    ...rawSettings,
    categories,
  };

  res.json({
    id: profile.id,
    name: profile.name,
    isFirstLogin: Boolean(profile.is_first_login),
    userData: { settings, log },
  });
}

/** PATCH /api/profile/onboarding */
export function completeOnboarding(req, res) {
  db.prepare('UPDATE profiles SET is_first_login = 0 WHERE id = ?').run(PID);
  res.json({ ok: true });
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** node:sqlite returns null-prototype objects — convert to plain objects */
function toPlain(obj) {
  return Object.assign({}, obj);
}

function parseCategoryRow(row) {
  return {
    id: row.id,
    label: row.label,
    color: row.color,
    routine: { type: row.routine_type, days: JSON.parse(row.routine_days) },
    streak: { count: row.streak_count, lastCompleted: row.streak_last || null },
  };
}

function buildLogObject(rows) {
  const log = {};
  for (const row of rows) {
    if (!log[row.date]) log[row.date] = {};
    log[row.date][row.category_id] = row.count;
  }
  return log;
}

function buildSettingsObject(rows) {
  const out = {};
  for (const row of rows) {
    try { out[row.key] = JSON.parse(row.value); } catch { out[row.key] = row.value; }
  }
  return out;
}
