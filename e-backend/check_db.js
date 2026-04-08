import supabase from './config/supabaseClient.js';

async function checkTable() {
    try {
        const { data, error } = await supabase.from('cart_items').select('*').limit(1);
        if (error) {
            console.error("Error accessing cart_items:", error.message);
            if (error.message.includes("does not exist")) {
                console.log("CRITICAL: The 'cart_items' table is missing from your database.");
            }
        } else {
            console.log("Success: 'cart_items' table is accessible.");
        }
    } catch (err) {
        console.error("Connection error:", err.message);
    }
}

checkTable();
