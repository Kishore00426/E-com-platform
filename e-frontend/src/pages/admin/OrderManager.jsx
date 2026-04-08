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
            const response = await fetch('http://localhost:4200/api/orders/admin/all', {
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
            const response = await fetch(`http://localhost:4200/api/orders/admin/status/${orderId}`, {
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
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Order Management</h1>
                    <p className="text-gray-500 font-medium">Review and process customer transactions</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchOrders}
                        className="bg-white border border-gray-200 p-3 rounded-2xl hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
                        title="Refresh Data"
                    >
                        <Clock size={20} className="text-gray-600" />
                    </button>
                    <div className="bg-white border border-gray-200 rounded-2xl flex items-center p-1 shadow-sm">
                        {['all', 'pending', 'Completed'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
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

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                        <ShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Orders</p>
                        <p className="text-2xl font-black text-gray-900">{stats.total}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
                        <p className="text-2xl font-black text-gray-900">₹{stats.revenue.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Actions</p>
                        <p className="text-2xl font-black text-gray-900">{stats.pending}</p>
                    </div>
                </div>
            </div>

            {/* Order Table/List */}
            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-gray-100 rounded-[40px] py-32 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Filter size={32} className="text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No orders matching criteria</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div 
                            key={order.id} 
                            className={`bg-white border transition-all duration-300 rounded-[32px] overflow-hidden ${
                                expandedOrder === order.id ? 'border-black shadow-2xl ring-4 ring-black/5' : 'border-gray-100 hover:border-gray-300 shadow-sm'
                            }`}
                        >
                            {/* Order Row Summary */}
                            <div 
                                onClick={() => toggleOrder(order.id)}
                                className="p-6 md:p-8 cursor-pointer flex flex-wrap items-center justify-between gap-6"
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                        order.status === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                                    }`}>
                                        <Package size={22} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{order.id.slice(0, 8)}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                                                order.status === 'pending' ? 'bg-orange-100 text-orange-700' : 
                                                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>{order.status}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-900">{order.users?.full_name || 'Anonymous'}</h3>
                                        <p className="text-xs text-gray-400">{order.users?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Date</p>
                                        <p className="text-sm font-bold text-gray-900">{formatDate(order.created_at)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                                        <p className="text-2xl font-black text-black tracking-tight">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                                    </div>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${expandedOrder === order.id ? 'bg-black text-white rotate-180' : 'bg-gray-50 text-gray-400'}`}>
                                        <ChevronDown size={18} />
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedOrder === order.id && (
                                <div className="border-t border-gray-50 p-8 md:p-10 bg-gray-50/50 animate-in slide-in-from-top-4 duration-500">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                        
                                        {/* Customer Info Card */}
                                        <div className="space-y-6">
                                            <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
                                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Customer Details</h4>
                                                <div className="space-y-4">
                                                    <div className="flex gap-4">
                                                        <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
                                                            <User size={14} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Full Name</p>
                                                            <p className="text-xs font-bold text-gray-900 truncate">{order.users?.full_name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
                                                            <Phone size={14} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Contact</p>
                                                            <p className="text-xs font-bold text-gray-900 truncate">{order.users?.contact || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center shrink-0">
                                                            <MapPin size={14} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Shipping Address</p>
                                                            <p className="text-xs font-bold text-gray-900 leading-relaxed italic">{order.users?.address || 'Standard Delivery'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
                                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Actions</h4>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {[
                                                        { label: 'Mark as Completed', status: 'completed', color: 'bg-green-600' },
                                                        { label: 'Cancel Order', status: 'cancelled', color: 'bg-red-600' }
                                                    ].map((action) => (
                                                        <button 
                                                            key={action.status}
                                                            disabled={updatingStatus === order.id || order.status === action.status}
                                                            onClick={() => handleUpdateStatus(order.id, action.status)}
                                                            className={`w-full ${action.color} text-white py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed`}
                                                        >
                                                            {updatingStatus === order.id ? 'Updating...' : action.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Purchase List */}
                                        <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 flex flex-col">
                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-50 pb-4">Package Contents</h4>
                                            <div className="space-y-6 flex-1 overflow-y-auto max-h-[300px] pr-4 custom-scrollbar">
                                                {order.order_items?.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-6 group">
                                                        <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden border border-gray-50 shrink-0">
                                                            {item.products?.images?.[0] && (
                                                                <img 
                                                                    src={`http://localhost:4200/uploads/${item.products.images[0]}`} 
                                                                    alt={item.products.name} 
                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">{item.products?.name}</h5>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Quantity: {item.quantity}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-gray-900 text-sm">${parseFloat(item.price).toLocaleString()}</p>
                                                            <p className="text-[10px] font-bold text-gray-400">per unit</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Expected Revenue</p>
                                                <p className="text-3xl font-black text-blue-600 tracking-tight">${parseFloat(order.total_amount).toLocaleString()}</p>
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
