import supabase from '../config/supabaseClient.js';

/**
 * createOrder
 * 1. Get current cart for user
 * 2. Calculate total, check stock
 * 3. Create entry in 'orders' table
 * 4. Create entries in 'order_items' table
 * 5. Update stock levels in 'products' table
 * 6. Clear user cart
 */
export const createOrder = async (req, res) => {
    const userId = req.user.id;
    const { paymentMethod, shippingAddress, totalAmount } = req.body;

    try {
        // 1. Fetch current cart items to be absolutely sure what we're ordering
        const { data: cartItems, error: cartError } = await supabase
            .from('cart_items')
            .select('product_id, quantity, products(id, name, price, stock)')
            .eq('user_id', userId);

        if (cartError || !cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: "Cart is empty or could not be found." });
        }

        // 2. Validate stock for each item
        for (const item of cartItems) {
            const product = Array.isArray(item.products) ? item.products[0] : item.products;
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({ 
                    error: `Insufficient stock for product: ${product?.name || 'Unknown'}` 
                });
            }
        }

        // 3. Create Order Entry
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{
                user_id: userId,
                total_amount: totalAmount,
                status: 'pending' // Only use existing columns
            }])
            .select()
            .single();

        if (orderError) throw orderError;

        // 4. Create Order Items
        const orderItemsPayload = cartItems.map(item => {
            const product = Array.isArray(item.products) ? item.products[0] : item.products;
            return {
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: product.price
            };
        });

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItemsPayload);

        if (itemsError) throw itemsError;

        // 5. Update Product Stock (Sequential for simplicity)
        for (const item of cartItems) {
            const product = Array.isArray(item.products) ? item.products[0] : item.products;
            await supabase
                .from('products')
                .update({ stock: product.stock - item.quantity })
                .eq('id', product.id);
        }

        // 6. Clear User Cart
        await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId);

        res.status(201).json({ 
            message: "Order placed successfully!", 
            orderId: order.id 
        });

    } catch (error) {
        console.error("Order Creation Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * getUserOrders
 * Fetches order history for the authenticated user
 */
export const getUserOrders = async (req, res) => {
    const userId = req.user.id;

    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    product_id,
                    quantity,
                    price,
                    products (name, images)
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * getAllOrders (Admin Only)
 * Fetches ALL orders from ALL users with customer info
 */
export const getAllOrders = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                users (full_name, email, address, contact),
                order_items (
                    product_id,
                    quantity,
                    price,
                    products (name, images)
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * updateOrderStatus (Admin Only)
 * Transitions an order status (Pending, Shipping, Delivered, Cancelled)
 */
export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'completed', 'cancelled'];
    const finalStatus = status.toLowerCase();
    
    if (!allowedStatuses.includes(finalStatus)) {
        return res.status(400).json({ error: "Invalid status provided. Use: completed or cancelled." });
    }

    try {
        const { data, error } = await supabase
            .from('orders')
            .update({ status: finalStatus })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Supabase Error updating status:", error);
            throw error;
        }
        res.json({ message: "Order status updated successfully!", order: data });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
