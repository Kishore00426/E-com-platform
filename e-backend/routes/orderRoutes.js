import express from 'express';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Order Routes (All PROTECTED)
router.use(verifyToken);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/admin/all', isAdmin, getAllOrders);
router.put('/admin/status/:id', isAdmin, updateOrderStatus);

export default router;
