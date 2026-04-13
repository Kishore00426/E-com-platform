import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Package, DollarSign, Users } from 'lucide-react';
import { API_URL } from '../../apiConfig';

export default function Reports() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/admin/stats`, {
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
        <div className="space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            <header>
                <h1 className="text-3xl lg:text-4xl text-gray-900 tracking-tight font-bold">Business Reports</h1>
                <p className="text-gray-500 mt-1 text-sm lg:text-base">Detailed analytics and inventory alerts.</p>
            </header>

            {/* Top Row Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
                <div className="bg-white p-8 lg:p-12 rounded-[40px] lg:rounded-[56px] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500">
                    <div>
                        <div className="flex items-center gap-4 lg:gap-6 mb-8 lg:mb-10">
                            <div className="bg-green-100 p-4 lg:p-6 rounded-[24px] lg:rounded-[32px] text-green-600 shadow-inner group-hover:scale-110 transition-transform"><DollarSign className="w-8 h-8 lg:w-10 lg:h-10" /></div>
                            <h3 className="text-gray-400 text-xs lg:text-sm font-black uppercase tracking-widest">Revenue Flow</h3>
                        </div>
                        <p className="text-4xl lg:text-6xl text-gray-900 font-black tracking-tighter">₹{stats.total_sales?.toLocaleString() || 0}</p>
                    </div>
                    <div className="mt-8 lg:mt-10 flex items-center gap-2 text-green-600 text-[10px] lg:text-xs font-black uppercase tracking-widest bg-green-50 self-start px-4 py-1.5 rounded-full border border-green-100">
                        <TrendingUp className="w-4 h-4" /> +15.5% <span className="text-gray-400 font-bold ml-1 italic">/ this month</span>
                    </div>
                </div>
                
                <div className="bg-white p-8 lg:p-12 rounded-[40px] lg:rounded-[56px] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500">
                    <div>
                        <div className="flex items-center gap-4 lg:gap-6 mb-8 lg:mb-10">
                            <div className="bg-blue-100 p-4 lg:p-6 rounded-[24px] lg:rounded-[32px] text-blue-600 shadow-inner group-hover:scale-110 transition-transform"><Users className="w-8 h-8 lg:w-10 lg:h-10" /></div>
                            <h3 className="text-gray-400 text-xs lg:text-sm font-black uppercase tracking-widest">Customer Base</h3>
                        </div>
                        <p className="text-4xl lg:text-6xl text-gray-900 font-black tracking-tighter">{stats.users}</p>
                    </div>
                    <p className="mt-8 lg:mt-10 text-[10px] lg:text-xs text-gray-400 font-black uppercase tracking-widest bg-gray-50 self-start px-4 py-1.5 rounded-full border border-gray-100">Across verified users</p>
                </div>

                <div className="bg-white p-8 lg:p-12 rounded-[40px] lg:rounded-[56px] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between group hover:-translate-y-2 transition-all duration-500 sm:col-span-2 lg:col-span-1">
                    <div>
                        <div className="flex items-center gap-4 lg:gap-6 mb-8 lg:mb-10">
                            <div className="bg-purple-100 p-4 lg:p-6 rounded-[24px] lg:rounded-[32px] text-purple-600 shadow-inner group-hover:scale-110 transition-transform"><Package className="w-8 h-8 lg:w-10 lg:h-10" /></div>
                            <h3 className="text-gray-400 text-xs lg:text-sm font-black uppercase tracking-widest">Global Asset Count</h3>
                        </div>
                        <p className="text-4xl lg:text-6xl text-gray-900 font-black tracking-tighter">{stats.products}</p>
                    </div>
                    <p className="mt-8 lg:mt-10 text-[10px] lg:text-xs text-gray-400 font-black uppercase tracking-widest bg-gray-50 self-start px-4 py-1.5 rounded-full border border-gray-100">Live inventory units</p>
                </div>
            </div>


            {/* Monthly Sales Projection Chart */}
            <section className="bg-white p-8 lg:p-16 rounded-[48px] lg:rounded-[64px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 lg:mb-20">
                    <div>
                        <h2 className="text-2xl lg:text-4xl text-gray-900 flex items-center gap-4 font-black tracking-tighter uppercase">
                            <BarChart3 className="w-8 h-8 lg:w-10 lg:h-10 text-blue-600" /> Revenue Forecast
                        </h2>
                        <p className="text-gray-400 text-xs lg:text-sm mt-1 lg:mt-2 font-bold uppercase tracking-widest">Predictive business cycle analysis.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-blue-600 rounded-full shadow-lg shadow-blue-200"></span>
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Projected Growth</span>
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar scroll-smooth">
                    <div className="min-w-[700px] lg:min-w-0">
                        <div className="flex items-end gap-3 lg:gap-6 h-64 lg:h-80 border-b-2 border-gray-50 pb-4 relative">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                                <div className="border-t border-gray-200 w-full h-0"></div>
                                <div className="border-t border-gray-200 w-full h-0"></div>
                                <div className="border-t border-gray-200 w-full h-0"></div>
                            </div>

                            {stats.monthly_sales && (() => {
                                const maxSale = Math.max(...stats.monthly_sales, 1);
                                return stats.monthly_sales.map((saleVolume, i) => {
                                    const height = (saleVolume / maxSale) * 100;
                                    return (
                                        <div key={i} className="flex-1 bg-linear-to-t from-blue-50 to-blue-200 hover:from-blue-600 hover:to-indigo-600 rounded-2xl lg:rounded-3xl transition-all duration-700 group relative shadow-inner" style={{ height: `${height}%` }}>
                                            <div className="absolute -top-12 lg:-top-16 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] lg:text-xs px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 font-black shadow-2xl scale-50 group-hover:scale-100 whitespace-nowrap">
                                                ₹{saleVolume.toLocaleString()}
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                        <div className="flex justify-between mt-8 text-[10px] lg:text-xs text-gray-300 px-2 lg:px-4 uppercase tracking-widest font-black">
                           <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                        </div>
                    </div>
                </div>
                
                <div className="mt-12 lg:mt-16 text-center">
                    <p className="text-[10px] lg:text-xs text-gray-300 font-bold uppercase tracking-[0.2em] italic">Swipe horizontally to view full annual cycle.</p>
                </div>
            </section>

        </div>

    );
}
