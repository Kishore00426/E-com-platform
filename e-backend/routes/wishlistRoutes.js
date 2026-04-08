import express from 'express';
import { addToWishlist, removeFromWishlist, getWishlist } from '../controllers/wishlistController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Wishlist Routes (All PROTECTED)
router.use(verifyToken);

router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.delete('/remove/:productId', removeFromWishlist);

export default router;
