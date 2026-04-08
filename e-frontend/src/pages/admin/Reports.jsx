import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Package, DollarSign, Users } from 'lucide-react';

export default function Reports() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:4200/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (!response.ok) throw new Error("Error fetching reports");
                
                const data = await response.json();
                setStats(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="flex items-center justify-center h-96 text-gray-400">Generating Reports...</div>;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header>
                <h1 className="text-3xl text-gray-900 tracking-tight">Business Reports</h1>
                <p className="text-gray-500 mt-1">Detailed analytics and inventory alerts.</p>
            </header>

            {/* Top Row Stas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-green-100 p-3 rounded-2xl text-green-600"><DollarSign className="w-6 h-6" /></div>
                        <h3 className="text-gray-500">Total Revenue</h3>
                    </div>
                    <p className="text-4xl text-gray-900">₹{stats.total_sales || 0}</p>
                    <div className="mt-4 flex items-center gap-1 text-green-600 text-sm">
                        <TrendingUp className="w-4 h-4" /> +15.5% <span className="text-gray-400">from last month</span>
                    </div>
                </div>
                
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><Users className="w-6 h-6" /></div>
                        <h3 className="text-gray-500">Active Customers</h3>
                    </div>
                    <p className="text-4xl text-gray-900">{stats.users}</p>
                    <p className="mt-4 text-sm text-gray-400 italic">Total registered accounts</p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-purple-100 p-3 rounded-2xl text-purple-600"><Package className="w-6 h-6" /></div>
                        <h3 className="text-gray-500">Total Products</h3>
                    </div>
                    <p className="text-4xl text-gray-900">{stats.products}</p>
                    <p className="mt-4 text-sm text-gray-400 italic">Live in inventory</p>
                </div>
            </div>


            {/* Monthly Sales Dummy Chart */}
            <section className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl text-gray-900 mb-8 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-600" /> Monthly Sales Projection
                </h2>
                <div className="flex items-end gap-3 h-64 border-b border-gray-100 pb-2">
                    {stats.monthly_sales && (() => {
                        const maxSale = Math.max(...stats.monthly_sales, 1);
                        return stats.monthly_sales.map((saleVolume, i) => {
                            const height = (saleVolume / maxSale) * 100;
                            return (
                                <div key={i} className="flex-1 bg-blue-100 hover:bg-blue-600 rounded-t-lg transition-all duration-300 group relative" style={{ height: `${height}%` }}>
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        ₹{saleVolume}
                                    </div>
                                </div>
                            );
                        });
                    })()}
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-400 px-1 uppercase tracking-tighter">
                   <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                </div>
            </section>
        </div>
    );
}
