import supabase from '../config/supabaseClient.js';

// GET All Users (Admin Only)
export const getAllUsers = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, full_name, username, email, role, is_approved, contact, created_at')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// TOGGLE User Approval (Admin Only)
export const toggleApproveUser = async (req, res) => {
    const { id } = req.params;
    const { is_approved } = req.body; // Expecting true or false
    
    try {
        const { data, error } = await supabase
            .from('users')
            .update({ is_approved })
            .eq('id', id)
            .select();

        if (error) throw error;
        res.json({ message: `User ${is_approved ? 'approved' : 'unapproved'} successfully`, user: data[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE User Role (Admin Only)
export const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body; // Expecting 'admin' or 'user'
    
    try {
        const { data, error } = await supabase
            .from('users')
            .update({ role })
            .eq('id', id)
            .select();

        if (error) throw error;
        res.json({ message: "User role updated successfully", user: data[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE User (Admin Only)
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) throw error;
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE User Details (Admin Only)
export const updateUserDetails = async (req, res) => {
    const { id } = req.params;
    const { full_name, username, email, contact, address } = req.body;
    try {
        const { data, error } = await supabase
            .from('users')
            .update({ full_name, username, email, contact, address })
            .eq('id', id)
            .select();
        
        if (error) throw error;
        res.json({ message: "User updated successfully", user: data[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- PHASE 4: ANALYTICS & CONTENT ---

// GET Admin Stats (Admin Only)
export const getAdminStats = async (req, res) => {
    try {
        const { data: usersCount } = await supabase.from('users').select('id', { count: 'exact' });
        const { data: prodsCount } = await supabase.from('products').select('id', { count: 'exact' });
        const { data: salesData } = await supabase.from('orders').select('total_amount, created_at');
        const { data: lowStockProds } = await supabase.from('products').select('*').lt('stock', 10);
        
        const totalSales = salesData?.reduce((acc, sale) => acc + sale.total_amount, 0) || 0;
        
        const currentYear = new Date().getFullYear();
        const monthlySales = Array(12).fill(0);

        if (salesData) {
            salesData.forEach(sale => {
                const date = new Date(sale.created_at);
                if (date.getFullYear() === currentYear) {
                    monthlySales[date.getMonth()] += sale.total_amount;
                }
            });
        }
        
        res.json({
            users: usersCount?.length || 0,
            products: prodsCount?.length || 0,
            total_sales: totalSales,
            low_stock: lowStockProds || [],
            monthly_sales: monthlySales
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE Site Settings (Admin Only)
export const updateSiteSettings = async (req, res) => {
    const { about_us, privacy_policy, about_page_data, terms_condition } = req.body;
    try {
        if (about_us) {
            await supabase.from('site_settings').upsert({ key: 'about_us', value: about_us });
        }
        if (privacy_policy) {
            await supabase.from('site_settings').upsert({ key: 'privacy_policy', value: privacy_policy });
        }
        if (terms_condition) {
            await supabase.from('site_settings').upsert({ key: 'terms_condition', value: terms_condition });
        }
        if (about_page_data) {
            await supabase.from('site_settings').upsert({ key: 'about_page_data', value: about_page_data });
        }
        res.json({ message: "Settings updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
