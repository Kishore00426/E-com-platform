import supabase from './config/supabaseClient.js';

async function finalProbe() {
    try {
        const { data: orders } = await supabase.from('orders').select('id, status').limit(1);
        if (!orders || orders.length === 0) return;
        
        const testId = orders[0].id;
        const originalStatus = orders[0].status;
        const testStatuses = [
            'pending', 'processing', 'shipped', 'shipping', 
            'delivered', 'completed', 'cancelled', 'canceled', 
            'returned', 'refunded'
        ];
        
        const results = [];
        for (const s of testStatuses) {
            const { error } = await supabase.from('orders').update({ status: s }).eq('id', testId);
            if (error) {
                results.push(`❌ ${s}`);
            } else {
                results.push(`✅ ${s}`);
                await supabase.from('orders').update({ status: originalStatus }).eq('id', testId);
            }
        }
        console.log("PROBE RESULTS:");
        console.log(results.join('\n'));
    } catch (err) {
        console.error(err);
    }
    process.exit();
}

finalProbe();
