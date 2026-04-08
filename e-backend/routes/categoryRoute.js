import express from 'express';
import { 
    getCategories, createCategory, updateCategory, deleteCategory,
    getSubcategories, createSubcategory, updateSubcategory, deleteSubcategory 
} from '../controllers/categoryController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:categoryId/subcategories', getSubcategories);
router.post('/', [verifyToken, isAdmin], createCategory);
router.post('/subcategories', [verifyToken, isAdmin], createSubcategory);
router.put('/subcategories/:id', [verifyToken, isAdmin], updateSubcategory);
router.delete('/subcategories/:id', [verifyToken, isAdmin], deleteSubcategory);
router.put('/:id', [verifyToken, isAdmin], updateCategory);
router.delete('/:id', [verifyToken, isAdmin], deleteCategory);

export default router;
