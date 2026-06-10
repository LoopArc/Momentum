import db from '../db/database.js';

const PID = 1;
const toPlain = (obj) => Object.assign({}, obj);

/** GET /api/settings */
export function getSettings(req, res) {
  const rows = db
    .prepare('SELECT key, value FROM settings WHERE profile_id = ?')
    .all(PID)
    .map(toPlain);
  res.json(buildSettingsObject(rows));
}

/** PATCH /api/settings — upsert arbitrary key-value pairs */
export function patchSettings(req, res) {
  const updates = req.body;
  if (typeof updates !== 'object' || Array.isArray(updates)) {
    return res.status(400).json({ error: 'Expected an object' });
  }

  const upsert = db.prepare(
    `INSERT INTO settings (profile_id, key, value)
     VALUES (?, ?, ?)
     ON CONFLICT(profile_id, key) DO UPDATE SET value = excluded.value`
  );

  db.exec('BEGIN');
  try {
    for (const [key, value] of Object.entries(updates)) {
      upsert.run(PID, key, JSON.stringify(value));
    }
    db.exec('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function buildSettingsObject(rows) {
  const out = {};
  for (const row of rows) {
    try { out[row.key] = JSON.parse(row.value); }
    catch { out[row.key] = row.value; }
  }
  return out;
}
