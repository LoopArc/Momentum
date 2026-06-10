import { Router } from 'express';
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  replaceAllCategories,
} from '../controllers/categoryController.js';

const router = Router();

router.get('/', listCategories);
router.post('/', createCategory);
router.put('/', replaceAllCategories);     // bulk replace — used by saveData
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
