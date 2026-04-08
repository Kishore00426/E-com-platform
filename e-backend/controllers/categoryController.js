import supabase from '../config/supabaseClient.js';

// --- CATEGORIES ---

// GET All Categories (Open for everyone)
export const getCategories = async (req, res) => {
    try {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CREATE a Category (Admin Only)
export const createCategory = async (req, res) => {
    const { name, slug } = req.body;
    try {
        const { data, error } = await supabase
            .from('categories')
            .insert([{ name, slug }])
            .select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE a Category (Admin Only)
export const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, slug } = req.body;
    try {
        const { data, error } = await supabase
            .from('categories')
            .update({ name, slug })
            .eq('id', id)
            .select();
        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE a Category (Admin Only)
export const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- SUBCATEGORIES ---

// GET Subcategories by Category ID (Open for everyone)
export const getSubcategories = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const { data, error } = await supabase
            .from('subcategories')
            .select('*')
            .eq('category_id', categoryId);
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CREATE a Subcategory (Admin Only)
export const createSubcategory = async (req, res) => {
    const { name, categoryId } = req.body;
    try {
        const { data, error } = await supabase
            .from('subcategories')
            .insert([{ name, category_id: categoryId }])
            .select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE a Subcategory (Admin Only - Name Only)
export const updateSubcategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const { data, error } = await supabase
            .from('subcategories')
            .update({ name })
            .eq('id', id)
            .select();
        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE a Subcategory (Admin Only)
export const deleteSubcategory = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('subcategories').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: "Subcategory deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
