import supabase from './config/supabaseClient.js';

async function testBackendCart() {
    try {
        // Find a user ID (any user from the users table)
        const { data: users, error: userError } = await supabase.from('users').select('id').limit(1);
        if (userError || !users.length) {
            console.error("No users found to test with.");
            return;
        }
        const userId = users[0].id;

        // Find a product ID
        const { data: products, error: productError } = await supabase.from('products').select('id').limit(1);
        if (productError || !products.length) {
            console.error("No products found to test with.");
            return;
        }
        const productId = products[0].id;

        console.log(`Testing with User ID: ${userId} and Product ID: ${productId}`);

        // Try to insert into cart_items
        const { data, error } = await supabase.from('cart_items').insert([
            { user_id: userId, product_id: productId, quantity: 1 }
        ]).select();

        if (error) {
            console.error("Insert failed:", error.message);
        } else {
            console.log("SUCCESS: Backend cart entry created!", data);
            
            // Cleanup
            await supabase.from('cart_items').delete().eq('id', data[0].id);
            console.log("Cleanup: Test entry removed.");
        }
    } catch (err) {
        console.error("Unexpected error:", err.message);
    }
}

testBackendCart();
