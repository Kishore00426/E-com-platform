import React, { useState, useEffect } from 'react';
import { 
    Package, 
    User, 
    Calendar, 
    Clock, 
    ChevronDown, 
    ChevronUp, 
    ShoppingBag, 
    MapPin, 
    Phone, 
    CheckCircle, 
    AlertCircle,
    TrendingUp,
    Filter
} from 'lucide-react';
import { API_URL, UPLOADS_URL } from '../../apiConfig';

const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(null); // Track which order is updating
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/orders/admin/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (err) {
            console.error("Fetch Orders Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId, newStatus) => {
        setUpdatingStatus(orderId);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/orders/admin/status/${orderId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Update local state for immediate feedback
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            } else {
                const error = await response.json();
                alert(error.error || "Failed to update status");
            }
        } catch (err) {
            console.error("Update Status Error:", err);
            alert("An error occurred while updating status.");
        } finally {
            setUpdatingStatus(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const toggleOrder = (id) => {
        setExpandedOrder(expandedOrder === id ? null : id);
    };

    const filteredOrders = filterStatus === 'all' 
        ? orders 
        : orders.filter(o => o.status === filterStatus);

    const stats = {
        total: orders.length,
        revenue: orders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0),
        pending: orders.filter(o => o.status === 'pending').length
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Live Orders...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-700 pb-10">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Order Management</h1>
                    <p className="text-gray-500 font-medium text-sm lg:text-base">Review and process customer transactions</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button 
                            onClick={fetchOrders}
                            className="bg-white border border-gray-200 p-3 rounded-2xl hover:bg-gray-50 transition-all active:scale-95 shadow-sm shrink-0"
                            title="Refresh Data"
                        >
                            <Clock size={20} className="text-gray-600" />
                        </button>
                        <div className="flex-1 sm:flex-none bg-white border border-gray-200 rounded-2xl flex items-center p-1 shadow-sm overflow-x-auto no-scrollbar">
                            {['all', 'pending', 'completed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] lg:text-xs font-bold uppercase tracking-wider transition-all flex-1 sm:flex-none ${
                                        filterStatus === status 
                                        ? 'bg-black text-white shadow-lg' 
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <div className="bg-white p-5 lg:p-6 rounded-[28px] lg:rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 lg:gap-6">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-50 text-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-[22px] h-[22px] lg:w-[24px] lg:h-[24px]" />
                    </div>
                    <div>
                        <p className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Orders</p>
                        <p className="text-xl lg:text-2xl font-black text-gray-900">{stats.total}</p>
                    </div>
                </div>
                <div className="bg-white p-5 lg:p-6 rounded-[28px] lg:rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 lg:gap-6">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-green-50 text-green-600 rounded-xl lg:rounded-2xl flex items-center justify-center shrink-0">
                        <TrendingUp className="w-[22px] h-[22px] lg:w-[24px] lg:h-[24px]" />
                    </div>
                    <div>
                        <p className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
                        <p className="text-xl lg:text-2xl font-black text-gray-900">₹{stats.revenue.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-5 lg:p-6 rounded-[28px] lg:rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 lg:gap-6 sm:col-span-2 lg:col-span-1">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 bg-orange-50 text-orange-600 rounded-xl lg:rounded-2xl flex items-center justify-center shrink-0">
                        <AlertCircle className="w-[22px] h-[22px] lg:w-[24px] lg:h-[24px]" />
                    </div>
                    <div>
                        <p className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Actions</p>
                        <p className="text-xl lg:text-2xl font-black text-gray-900">{stats.pending}</p>
                    </div>
                </div>
            </div>            {/* Order Table/List */}
            <div className="space-y-4 lg:space-y-6">
                {filteredOrders.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-gray-100 rounded-[32px] lg:rounded-[40px] py-16 lg:py-32 text-center">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Filter className="w-7 h-7 lg:w-8 lg:h-8 text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs lg:text-sm">No orders matching criteria</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div 
                            key={order.id} 
                            className={`bg-white border transition-all duration-300 rounded-[28px] lg:rounded-[40px] overflow-hidden ${
                                expandedOrder === order.id ? 'border-blue-600 shadow-2xl ring-8 ring-blue-50' : 'border-gray-100 hover:border-gray-300 shadow-sm'
                            }`}
                        >
                            {/* Order Row Summary */}
                            <div 
                                onClick={() => toggleOrder(order.id)}
                                className="p-5 lg:p-10 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 lg:gap-8"
                            >
                                <div className="flex items-center gap-4 lg:gap-8">
                                    <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-2xl lg:rounded-3xl flex items-center justify-center shrink-0 border ${
                                        order.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'
                                    }`}>
                                        <Package className="w-6 h-6 lg:w-8 lg:h-8" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 lg:gap-4 mb-1.5 flex-wrap">
                                            <span className="text-[10px] lg:text-xs font-black text-gray-400 uppercase tracking-widest">#{order.id.slice(0, 8)}</span>
                                            <span className={`px-3 py-1 rounded-full text-[8px] lg:text-[10px] font-black uppercase tracking-wider shadow-sm ${
                                                order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 
                                                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>{order.status}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900 truncate text-base lg:text-2xl tracking-tight leading-tight">{order.users?.full_name || 'Anonymous'}</h3>
                                        <p className="text-[11px] lg:text-sm text-gray-400 truncate mt-0.5">{order.users?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-8 lg:gap-16 pl-16 md:pl-0">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[9px] lg:text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-1">Processed On</p>
                                        <p className="text-xs lg:text-base font-bold text-gray-900 tracking-tight">{formatDate(order.created_at)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] lg:text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-1">Total Due</p>
                                        <p className="text-2xl lg:text-4xl font-black text-black tracking-tighter">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                                    </div>
                                    <div className={`w-10 h-10 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all shadow-md group ${expandedOrder === order.id ? 'bg-blue-600 text-white rotate-180' : 'bg-gray-50 text-gray-400 hover:bg-white border border-transparent hover:border-gray-200'}`}>
                                        <ChevronDown size={24} />
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedOrder === order.id && (
                                <div className="border-t border-gray-50 p-6 lg:p-14 bg-gray-50/30 animate-in slide-in-from-top-4 duration-500">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-14">
                                        
                                        {/* Customer Info Card */}
                                        <div className="space-y-6 lg:space-y-10">
                                            <div className="bg-white p-6 lg:p-10 rounded-[28px] lg:rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50">
                                                <h4 className="text-[10px] lg:text-xs font-black text-gray-300 uppercase tracking-widest mb-8 lg:mb-10 border-b border-gray-50 pb-5">Customer Profile</h4>
                                                <div className="space-y-6">
                                                    <div className="flex gap-4 lg:gap-6">
                                                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 border border-gray-100">
                                                            <User size={18} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-tight mb-0.5">Full Name</p>
                                                            <p className="text-sm lg:text-lg font-bold text-gray-900 truncate leading-tight">{order.users?.full_name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4 lg:gap-6">
                                                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 border border-gray-100">
                                                            <Phone size={18} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-tight mb-0.5">Contact Line</p>
                                                            <p className="text-sm lg:text-lg font-bold text-gray-900 truncate leading-tight">{order.users?.contact || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4 lg:gap-6">
                                                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 border border-gray-100">
                                                            <MapPin size={18} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-tight mb-0.5">Delivery Address</p>
                                                            <p className="text-sm lg:text-lg font-bold text-gray-900 leading-tight italic">{order.users?.address || 'Standard Delivery'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-white p-6 lg:p-10 rounded-[28px] lg:rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/50">
                                                <h4 className="text-[10px] lg:text-xs font-black text-gray-300 uppercase tracking-widest mb-8 lg:mb-10 border-b border-gray-50 pb-5">Order Control</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                                                    {[
                                                        { label: 'Mark Completed', status: 'completed', color: 'bg-green-600 shadow-green-200' },
                                                        { label: 'Decline Order', status: 'cancelled', color: 'bg-red-600 shadow-red-200' }
                                                    ].map((action) => (
                                                        <button 
                                                            key={action.status}
                                                            disabled={updatingStatus === order.id || order.status === action.status}
                                                            onClick={() => handleUpdateStatus(order.id, action.status)}
                                                            className={`w-full ${action.color} text-white py-4 lg:py-5 rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-xl active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed`}
                                                        >
                                                            {updatingStatus === order.id ? 'Processing...' : action.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Purchase List */}
                                        <div className="lg:col-span-2 bg-white rounded-[40px] lg:rounded-[56px] border border-gray-100 shadow-2xl shadow-gray-200/50 p-6 lg:p-14 flex flex-col">
                                            <div className="flex items-center justify-between mb-10 lg:mb-14 border-b border-gray-50 pb-6 lg:pb-8">
                                                <h4 className="text-[10px] lg:text-xs font-black text-gray-300 uppercase tracking-widest">Package Manifest</h4>
                                                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] lg:text-xs font-bold uppercase tracking-widest">{order.order_items?.length} Unique Items</span>
                                            </div>

                                            <div className="space-y-6 lg:space-y-10 flex-1 overflow-y-auto max-h-[400px] lg:max-h-[600px] pr-4 lg:pr-8 custom-scrollbar">
                                                {order.order_items?.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-6 lg:gap-10 group">
                                                        <div className="w-16 h-16 lg:w-32 lg:h-32 bg-gray-50 rounded-[28px] lg:rounded-[40px] overflow-hidden border border-gray-50 shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-700">
                                                            {item.products?.images?.[0] && (
                                                                <img 
                                                                    src={`${UPLOADS_URL}/${item.products.images[0]}`} 
                                                                    alt={item.products.name} 
                                                                    className="w-full h-full object-cover" 
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="font-black text-sm lg:text-2xl text-gray-900 group-hover:text-blue-600 transition-colors truncate tracking-tight uppercase leading-tight">{item.products?.name}</h5>
                                                            <div className="flex items-center gap-4 mt-2">
                                                                <p className="text-[10px] lg:text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">Qty: {item.quantity}</p>
                                                                <p className="text-[10px] lg:text-xs font-black text-blue-400 uppercase tracking-widest">₹{parseFloat(item.price).toLocaleString()} / unit</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-black text-gray-900 text-sm lg:text-2xl tracking-tighter leading-none">₹{(parseFloat(item.price) * item.quantity).toLocaleString()}</p>
                                                            <p className="text-[8px] lg:text-[10px] font-black text-gray-300 uppercase mt-1">Item Total</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-10 lg:mt-14 pt-10 lg:pt-14 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                                <div>
                                                    <p className="text-[10px] lg:text-xs font-black text-gray-300 uppercase tracking-widest mb-1">Grand Final Amount</p>
                                                    <p className="text-xs lg:text-sm text-gray-400 italic">Inclusive of all local taxes and shipping fees.</p>
                                                </div>
                                                <p className="text-4xl lg:text-6xl font-black text-blue-600 tracking-tighter leading-none">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>

    );
};

export default OrderManager;
