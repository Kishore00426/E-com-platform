import supabase from '../config/supabaseClient.js';

// GET All Products
export const getProducts = async (req, res) => {
    try {
        const { data, error } = await supabase.from('products').select('*, categories(id, name), subcategories(id, name)');
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET Single Product by ID
export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase.from('products').select('*, categories(id, name), subcategories(id, name)').eq('id', id).single();
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CREATE Product (Admin Only - Supports Multiple Local Uploads)
export const createProduct = async (req, res) => {
    const { name, description, price, stock, category_id, subcategory_id } = req.body;
    
    try {
        // Extract filenames from req.files (added by multer)
        const imageFiles = req.files ? req.files.map(file => file.filename) : [];

        const { data, error } = await supabase.from('products').insert([{
            name, 
            description, 
            price, 
            images: imageFiles, // Array of filenames: ["1711884000-123.jpg", ...]
            stock, 
            category_id, 
            subcategory_id
        }]).select();
        
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE Product (Admin Only)
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const { data, error } = await supabase.from('products').update(updateData).eq('id', id).select();
        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE Product (Admin Only)
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
