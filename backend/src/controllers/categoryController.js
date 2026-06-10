import db from '../db/database.js';

const PID = 1;

const toPlain = (obj) => Object.assign({}, obj);

function parseCategoryRow(row) {
  return {
    id: row.id,
    label: row.label,
    color: row.color,
    routine: { type: row.routine_type, days: JSON.parse(row.routine_days) },
    streak: { count: row.streak_count, lastCompleted: row.streak_last || null },
  };
}

/** GET /api/categories */
export function listCategories(req, res) {
  const rows = db
    .prepare('SELECT * FROM categories WHERE profile_id = ? ORDER BY rowid ASC')
    .all(PID)
    .map((r) => parseCategoryRow(toPlain(r)));
  res.json(rows);
}

/** POST /api/categories */
export function createCategory(req, res) {
  const { id, label, color, routine } = req.body;
  if (!id || !label) return res.status(400).json({ error: 'id and label required' });

  db.prepare(
    `INSERT INTO categories (id, profile_id, label, color, routine_type, routine_days)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, PID, label, color || '#8b5cf6', routine?.type || 'daily', JSON.stringify(routine?.days || []));

  const created = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  res.status(201).json(parseCategoryRow(toPlain(created)));
}

/** PUT /api/categories/:id */
export function updateCategory(req, res) {
  const { id } = req.params;
  const { label, color, routine, streak } = req.body;

  db.prepare(
    `UPDATE categories
     SET label = ?, color = ?, routine_type = ?, routine_days = ?,
         streak_count = ?, streak_last = ?
     WHERE id = ? AND profile_id = ?`
  ).run(
    label, color,
    routine?.type || 'daily', JSON.stringify(routine?.days || []),
    streak?.count ?? 0, streak?.lastCompleted ?? null,
    id, PID
  );

  const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  if (!updated) return res.status(404).json({ error: 'Category not found' });
  res.json(parseCategoryRow(toPlain(updated)));
}

/** DELETE /api/categories/:id */
export function deleteCategory(req, res) {
  const result = db
    .prepare('DELETE FROM categories WHERE id = ? AND profile_id = ?')
    .run(req.params.id, PID);
  if (result.changes === 0) return res.status(404).json({ error: 'Category not found' });
  res.json({ ok: true });
}

/** PUT /api/categories — bulk upsert + prune */
export function replaceAllCategories(req, res) {
  const categories = req.body;
  if (!Array.isArray(categories)) return res.status(400).json({ error: 'Expected array' });

  const incomingIds = categories.map((c) => c.id);
  const existing = db
    .prepare('SELECT id FROM categories WHERE profile_id = ?')
    .all(PID)
    .map((r) => toPlain(r).id);

  db.exec('BEGIN');
  try {
    for (const exId of existing) {
      if (!incomingIds.includes(exId)) {
        db.prepare('DELETE FROM categories WHERE id = ?').run(exId);
      }
    }

    const upsert = db.prepare(
      `INSERT INTO categories (id, profile_id, label, color, routine_type, routine_days, streak_count, streak_last)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         label = excluded.label, color = excluded.color,
         routine_type = excluded.routine_type, routine_days = excluded.routine_days,
         streak_count = excluded.streak_count, streak_last = excluded.streak_last`
    );

    for (const cat of categories) {
      upsert.run(
        cat.id, PID, cat.label, cat.color || '#8b5cf6',
        cat.routine?.type || 'daily', JSON.stringify(cat.routine?.days || []),
        cat.streak?.count ?? 0, cat.streak?.lastCompleted ?? null
      );
    }

    db.exec('COMMIT');
    res.json({ ok: true, count: categories.length });
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}
