import express from 'express';
import { createCategory, getCategories, getCategoryById, deleteCategory, updateCategory} from '../controllers/CategoryController.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategory);
router.delete('/:id', deleteCategory);
router.put('/:id', updateCategory);

export default router;
