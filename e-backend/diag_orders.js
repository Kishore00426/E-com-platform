import supabase from './config/supabaseClient.js';

async function checkOrders() {
    try {
        const { data, error } = await supabase.from('orders').select('*').limit(5);
        if (error) throw error;
        console.log("Samples:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("DB Error:", err.message);
    }
    process.exit();
}

checkOrders();
