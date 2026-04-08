import supabase from '../config/supabaseClient.js';

/**
 * addToWishlist
 * Adds a product to the user's wishlist
 */
export const addToWishlist = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.body;

    try {
        const { data, error } = await supabase
            .from('wishlist')
            .upsert([{ user_id: userId, product_id: productId }], { onConflict: 'user_id,product_id' })
            .select();

        if (error) throw error;
        res.status(201).json({ message: "Product added to wishlist", data: data[0] });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * removeFromWishlist
 * Removes a product from the user's wishlist
 */
export const removeFromWishlist = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    try {
        const { error } = await supabase
            .from('wishlist')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) throw error;
        res.json({ message: "Product removed from wishlist" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * getWishlist
 * Fetches all products in the user's wishlist
 */
export const getWishlist = async (req, res) => {
    const userId = req.user.id;

    try {
        const { data, error } = await supabase
            .from('wishlist')
            .select(`
                id,
                product_id,
                products (
                    id,
                    name,
                    price,
                    images,
                    description,
                    stock
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Flatten the response for easier frontend usage
        const formattedData = data.map(item => ({
            wishlist_id: item.id,
            ...item.products
        }));

        res.json(formattedData);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
