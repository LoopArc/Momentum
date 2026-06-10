import { Router } from 'express';
import { getLog, upsertDayLog, replaceLog } from '../controllers/logController.js';

const router = Router();

router.get('/', getLog);
router.put('/', replaceLog);          // full log replacement
router.put('/:date', upsertDayLog);   // single-day upsert

export default router;
