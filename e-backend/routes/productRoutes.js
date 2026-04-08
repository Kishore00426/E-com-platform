import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

// --- PUBLIC ROUTE ---
router.get('/', getProducts);
router.get('/:id', getProductById);

// --- ADMIN ONLY ROUTES ---
router.post('/', [verifyToken, isAdmin, upload.array('images', 10)], createProduct);
router.put('/:id', [verifyToken, isAdmin], updateProduct);
router.delete('/:id', [verifyToken, isAdmin], deleteProduct);

export default router;
