import supabase from './config/supabaseClient.js';

async function getSchema() {
    try {
        // This is a common way to see check constraints in Postgres if RPC is available
        // If not, we will try to update a REAL order with different strings and catch the error
        console.log("Fetching real orders to test...");
        const { data: orders } = await supabase.from('orders').select('id, status').limit(1);
        
        if (!orders || orders.length === 0) {
            console.log("No orders found to test with.");
            return;
        }
        
        const testId = orders[0].id;
        const originalStatus = orders[0].status;
        const testStatuses = ['shipping', 'shipped', 'delivered', 'cancelled', 'canceled', 'completed', 'processing'];
        
        console.log(`Testing on Order ID: ${testId} (Original: ${originalStatus})`);
        
        for (const s of testStatuses) {
            const { error } = await supabase.from('orders').update({ status: s }).eq('id', testId);
            if (error) {
                console.log(`❌ ${s}: ${error.message}`);
            } else {
                console.log(`✅ ${s}: Success!`);
                // Reset back to original
                await supabase.from('orders').update({ status: originalStatus }).eq('id', testId);
            }
        }
    } catch (err) {
        console.error(err);
    }
    process.exit();
}

getSchema();
