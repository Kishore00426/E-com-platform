import express from 'express';
import { registerUser, loginUser, updateProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', verifyToken, updateProfile);

export default router;
