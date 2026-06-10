import db from '../db/database.js';

const PID = 1;
const toPlain = (obj) => Object.assign({}, obj);

/** GET /api/log */
export function getLog(req, res) {
  const rows = db
    .prepare('SELECT date, category_id, count FROM log_entries WHERE profile_id = ?')
    .all(PID)
    .map(toPlain);
  res.json(buildLogObject(rows));
}

/** PUT /api/log/:date — upsert a single day */
export function upsertDayLog(req, res) {
  const { date } = req.params;
  const entries = req.body;
  if (!date || typeof entries !== 'object' || Array.isArray(entries)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const existing = db
    .prepare('SELECT category_id FROM log_entries WHERE profile_id = ? AND date = ?')
    .all(PID, date)
    .map((r) => toPlain(r).category_id);

  const upsert = db.prepare(
    `INSERT INTO log_entries (profile_id, date, category_id, count)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(profile_id, date, category_id) DO UPDATE SET count = excluded.count`
  );

  db.exec('BEGIN');
  try {
    for (const catId of existing) {
      if (!(catId in entries)) {
        db.prepare('DELETE FROM log_entries WHERE profile_id = ? AND date = ? AND category_id = ?')
          .run(PID, date, catId);
      }
    }
    for (const [catId, count] of Object.entries(entries)) {
      upsert.run(PID, date, catId, Number(count));
    }
    db.exec('COMMIT');
    res.json({ ok: true, date });
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

/** PUT /api/log — full replacement of all log data */
export function replaceLog(req, res) {
  const log = req.body;
  if (typeof log !== 'object' || Array.isArray(log)) {
    return res.status(400).json({ error: 'Expected a log object' });
  }

  const upsert = db.prepare(
    `INSERT INTO log_entries (profile_id, date, category_id, count)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(profile_id, date, category_id) DO UPDATE SET count = excluded.count`
  );

  db.exec('BEGIN');
  try {
    db.prepare('DELETE FROM log_entries WHERE profile_id = ?').run(PID);
    for (const [date, entries] of Object.entries(log)) {
      for (const [catId, count] of Object.entries(entries)) {
        upsert.run(PID, date, catId, Number(count));
      }
    }
    db.exec('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function buildLogObject(rows) {
  const log = {};
  for (const row of rows) {
    if (!log[row.date]) log[row.date] = {};
    log[row.date][row.category_id] = row.count;
  }
  return log;
}
