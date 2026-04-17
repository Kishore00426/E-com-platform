import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import supabase from './config/supabaseClient.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoute.js';
import productRoutes from './routes/productRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import siteRoutes from './routes/siteRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { verifyToken, isAdmin } from './middleware/auth.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/site-settings', siteRoutes);
app.use('/api/ai', aiRoutes);

// --- DB CONNECTION TEST ---
app.get('/api/health', async (req, res) => {
    try {
        const { data, error } = await supabase.from('users').select('count(*)');
        if (error) throw error;
        res.json({ status: "Connected!", table: "users exists" });
    } catch (err) {
        res.status(500).json({ status: "DB Error", error: err.message });
    }
});

app.get('/', (req, res) => {
    res.send(`Backend running on port ${PORT}!`);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is officially running on port ${PORT}`);
});
