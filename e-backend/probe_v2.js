import supabase from './config/supabaseClient.js';

async function findConstraint() {
    try {
        // Query pg_get_constraintdef to get the check constraint logic
        const { data, error } = await supabase.rpc('get_table_constraints', { t_name: 'orders' });
        
        if (error) {
            console.log("RPC Error, trying direct query if allowed...");
            // Most Supabase setups block direct pg_catalog access, so let's just probe more thoroughly
            const probes = ['shipping', 'shipped', 'delivered', 'delivered', 'cancelled', 'canceled', 'completed', 'pending'];
            for (const p of probes) {
                // Try updating a non-existent row, Supabase checks constraints before the row count usually
                const { error: e } = await supabase.from('orders').update({ status: p }).eq('id', '00000000-0000-0000-0000-000000000000');
                if (e && e.message.includes('violates check constraint')) {
                    console.log(`[REJECTED] ${p}`);
                } else {
                    console.log(`[ACCEPTED] ${p}`);
                }
            }
        } else {
            console.log("Constraints:", JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error(err);
    }
    process.exit();
}

findConstraint();
