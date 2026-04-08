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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4  duration-700">
            <header>
                <h1 className="text-3xl text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Real-time statistics for your shop.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.label} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className={`${card.bg} p-3 rounded-2xl`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-gray-500 text-sm">{card.label}</h3>
                            <p className="text-2xl text-gray-900">{loading ? '...' : card.value}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border-gray-100 h-64 flex items-center justify-center border-dashed border">
                <span className="text-gray-400 italic">Sales Chart Data Coming Soon...</span>
            </div>
        </div>
    );
}
