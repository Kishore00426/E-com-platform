import supabase from '../config/supabaseClient.js';

export const getCart = async (req, res) => {
    const userId = req.user.id;
    try {
        const { data, error } = await supabase
            .from('cart_items')
            .select(`
                id,
                product_id,
                quantity,
                products (
                    id,
                    name,
                    price,
                    images
                )
            `)
            .eq('user_id', userId);

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;
    console.log(`Backend Cart: User ${userId} adding product ${productId}...`);

    try {
        // Check if item already exists in cart
        const { data: existingItem, error: fetchError } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

        if (existingItem) {
            console.log(`Backend Cart: Updating quantity for existing item ${existingItem.id}`);
            // Update quantity
            const { data, error } = await supabase
                .from('cart_items')
                .update({ quantity: existingItem.quantity + quantity })
                .eq('id', existingItem.id)
                .select();
            if (error) {
                console.error("Backend Cart Error (Update):", error.message);
                throw error;
            }
            return res.json(data[0]);
        } else {
            console.log(`Backend Cart: Inserting new item for product ${productId}`);
            // Insert new item
            const { data, error } = await supabase
                .from('cart_items')
                .insert([{ user_id: userId, product_id: productId, quantity }])
                .select();
            if (error) {
                console.error("Backend Cart Error (Insert):", error.message);
                throw error;
            }
            return res.status(201).json(data[0]);
        }
    } catch (error) {
        console.error("Backend Cart Fatal Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const updateQuantity = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    try {
        if (quantity <= 0) {
            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('user_id', userId)
                .eq('product_id', productId);
            if (error) throw error;
            return res.json({ message: "Item removed from cart" });
        }

        const { data, error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('user_id', userId)
            .eq('product_id', productId)
            .select();

        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    try {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) throw error;
        res.json({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const clearCart = async (req, res) => {
    const userId = req.user.id;

    try {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId);

        if (error) throw error;
        res.json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
