import express from 'express';
import { chatWithAI } from '../controllers/aiController.js';

const router = express.Router();

// Public route for now, can be protected later if needed
router.post('/chat', chatWithAI);

export default router;
