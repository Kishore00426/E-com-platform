import { useEffect, useState } from 'react';
import { Users, Package, Layers, TrendingUp } from 'lucide-react';
import { API_URL } from '../../apiConfig';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, products: 0, categories: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                
                const [users, products, categories] = await Promise.all([
                    fetch(`${API_URL}/api/admin/users`, { headers }).then(res => res.json()),
                    fetch(`${API_URL}/api/products`).then(res => res.json()),
                    fetch(`${API_URL}/api/categories`).then(res => res.json())
                ]);

                setStats({
                    users: users.length || 0,
                    products: products.length || 0,
                    categories: categories.length || 0
                });
            } catch (err) {
                console.error("Stats fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Total Products', value: stats.products, icon: Package, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Categories', value: stats.categories, icon: Layers, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Monthly Growth', value: '+12%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl lg:text-4xl text-gray-900 tracking-tight font-bold">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1 text-sm lg:text-base">Real-time statistics for your shop.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
                {cards.map((card) => (
                    <div key={card.label} className="bg-white p-8 lg:p-10 rounded-[40px] lg:rounded-[56px] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500">
                        <div>
                            <div className="flex items-center gap-4 lg:gap-6 mb-8 lg:mb-10">
                                <div className={`${card.bg} p-4 lg:p-6 rounded-[24px] lg:rounded-[32px] ${card.color} shadow-inner group-hover:scale-110 transition-transform`}>
                                    <card.icon className="w-8 h-8 lg:w-10 lg:h-10" />
                                </div>
                                <h3 className="text-gray-400 text-[10px] lg:text-xs font-black uppercase tracking-widest">{card.label}</h3>
                            </div>
                            <p className="text-4xl lg:text-5xl text-gray-900 font-black tracking-tighter">
                                {loading ? '...' : (typeof card.value === 'number' ? card.value.toLocaleString() : card.value)}
                            </p>
                        </div>
                        <div className="mt-8 lg:mt-10 pt-6 lg:pt-8 border-t border-gray-50">
                             <div className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest bg-green-50 self-start px-4 py-1.5 rounded-full border border-green-100 w-fit">
                                <TrendingUp className="w-3.5 h-3.5" /> +12.5% <span className="text-gray-400 font-bold ml-1 italic">/ growth</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="bg-white p-10 lg:p-20 rounded-[48px] lg:rounded-[64px] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center justify-center border-dashed group hover:border-blue-200 transition-colors">
                <div className="w-20 h-20 lg:w-28 lg:h-28 bg-gray-50 rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-700">
                    <TrendingUp className="w-10 h-10 lg:w-14 lg:h-14 text-gray-200" />
                </div>
                <h3 className="text-gray-900 text-xl lg:text-2xl font-black tracking-tighter uppercase mb-2">Visual intelligence portal</h3>
                <p className="text-gray-400 text-xs lg:text-sm font-bold uppercase tracking-[0.2em] italic">Real-time analytical data pipelines incoming...</p>
            </div>

        </div>
    );
}
