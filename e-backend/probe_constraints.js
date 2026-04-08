import supabase from './config/supabaseClient.js';

async function checkConstraints() {
    try {
        // Query to find check constraints on the orders table
        const { data, error } = await supabase.rpc('get_constraint_info', { table_name: 'orders' });
        
        if (error) {
            // Fallback: Just try a few common status names to see which ones fail
            console.log("RPC failed, trying manual probe...");
            const statuses = ['pending', 'shipped', 'delivered', 'cancelled', 'processing', 'completed'];
            for (const s of statuses) {
                const { error: probeError } = await supabase.from('orders').update({ status: s }).eq('id', -1); 
                // Using an ID that doesn't exist just to trigger the constraint check before the row check
                if (probeError && probeError.message.includes('check constraint')) {
                    console.log(`FAIL: ${s} - ${probeError.message}`);
                } else {
                    console.log(`PASS: ${s} (or no constraint error)`);
                }
            }
        } else {
            console.log("Constraint Info:", JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error("Error:", err.message);
    }
    process.exit();
}

checkConstraints();
