import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
    LogOut, 
    User, 
    Package, 
    Heart, 
    Settings, 
    ChevronRight, 
    ShoppingBag,
    Clock,
    ChevronDown,
    MapPin,
    Calendar,
    DollarSign,
    Box,
    Trash2,
    FileText,
    Download,
    Phone
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { API_URL, UPLOADS_URL } from '../apiConfig';

export default function Profile() {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const { wishlist, toggleWishlist } = useWishlist();
    const { user, token, logout, updateUser } = useAuth();
    const navigate = useNavigate();

    // Account Settings State
    const [settingsData, setSettingsData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        address: user?.address || '',
        contact: user?.contact || '',
        password: ''
    });
    const [updatingSettings, setUpdatingSettings] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    useEffect(() => {
        if (user && user.role === 'admin') {
            navigate('/admin/dashboard');
        }
    }, [user, navigate]);

    useEffect(() => {
        if (token && activeTab === 'orders') {
            fetchOrders();
        }
    }, [token, activeTab]);

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const response = await fetch(`${API_URL}/api/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (err) {
            console.error("Fetch Orders Error:", err);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setUpdatingSettings(true);
        setStatusMessage(null);

        try {
            const response = await fetch(`${API_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settingsData)
            });

            const data = await response.json();

            if (response.ok) {
                setStatusMessage({ type: 'success', text: data.message });
                updateUser(data.user);
                
                // Keep password field clear after update
                setSettingsData(prev => ({ ...prev, password: '' }));
                
                // If password was changed, force logout for security
                if (settingsData.password) {
                    setTimeout(() => {
                        handleLogout();
                    }, 2000);
                }
            } else {
                throw new Error(data.error || "Failed to update profile");
            }
        } catch (error) {
            setStatusMessage({ type: 'error', text: error.message });
        } finally {
            setUpdatingSettings(false);
        }
    };

    const handleDownloadInvoice = (order) => {
        const invoiceWindow = window.open('', '_blank');
        const itemsHtml = order.order_items?.map(item => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.products?.name}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${parseFloat(item.price).toFixed(2)}</td>
                <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
        `).join('');

        invoiceWindow.document.write(`
            <html>
                <head>
                    <title>Invoice - ${order.id}</title>
                    <style>
                        body { font-family: 'Poppins', sans-serif; color: #333; line-height: 1.6; padding: 40px; }
                        .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
                        .logo { font-size: 24px; font-weight: 800; color: #1e40af; }
                        .invoice-info { text-align: right; }
                        .details { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
                        .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; color: #94a3b8; margin-bottom: 10px; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
                        th { background: #f8fafc; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; color: #64748b; }
                        .total-section { text-align: right; border-top: 2px solid #eee; padding-top: 20px; }
                        .total-row { font-size: 20px; font-weight: 800; color: #1e40af; }
                        @media print { .no-print { display: none; } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">E-Commerce Core</div>
                        <div class="invoice-info">
                            <h1 style="margin:0; font-size: 32px;">INVOICE</h1>
                            <p style="margin:5px 0;">Order ID: #${order.id.slice(0, 8)}</p>
                            <p style="margin:5px 0;">Date: ${formatDate(order.created_at)}</p>
                        </div>
                    </div>
                    
                    <div class="details">
                        <div>
                            <div class="section-title">Billed To</div>
                            <p style="margin:0; font-weight: 700;">${user.name}</p>
                            <p style="margin:0;">${user.email}</p>
                            <p style="margin:0;">${user.contact || 'No contact provided'}</p>
                        </div>
                        <div>
                            <div class="section-title">Shipping Address</div>
                            <p style="margin:0; font-weight: 700;">${user.address || 'Standard Delivery'}</p>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Item Description</th>
                                <th style="text-align: center;">Qty</th>
                                <th style="text-align: right;">Unit Price</th>
                                <th style="text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>

                    <div class="total-section">
                        <p style="margin:0; color: #64748b; font-weight: 700;">GRAND TOTAL</p>
                        <div class="total-row">₹${parseFloat(order.total_amount).toFixed(2)}</div>
                    </div>

                    <div style="margin-top: 80px; text-align: center; color: #94a3b8; font-size: 12px;">
                        Thank you for your purchase! We hope to see you again soon.
                    </div>

                    <div class="no-print" style="margin-top: 40px; text-align: center;">
                        <button onclick="window.print()" style="background: #1e40af; color: white; border: none; padding: 12px 30px; border-radius: 12px; font-weight: 700; cursor: pointer;">Print / Save as PDF</button>
                    </div>
                </body>
            </html>
        `);
        invoiceWindow.document.close();
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Calculate unique purchased products from all orders
    const productsPurchased = orders.reduce((acc, order) => {
        order.order_items?.forEach(item => {
            const product = item.products;
            if (product && !acc.some(p => p.id === item.product_id)) {
                acc.push({
                    id: item.product_id,
                    name: product.name,
                    price: item.price,
                    date: formatDate(order.created_at),
                    image: product.images?.[0] ? `${UPLOADS_URL}/${product.images[0]}` : null
                });
            }
        });
        return acc;
    }, []);

    if (!user) return null;

    const userInfo = {
        name: user.name || "User",
        email: user.email || "No email",
        role: user.role || "user",
        avatar: user.name ? user.name[0].toUpperCase() : "U"
    };

    const menuItems = [
        { id: 'orders', name: 'My Orders', icon: Package, description: 'View your order history' },
        { id: 'products', name: 'Purchases', icon: ShoppingBag, description: 'Items you have bought' },
        { id: 'likes', name: 'Wishlist', icon: Heart, description: 'Products you saved' },
        { id: 'settings', name: 'Settings', icon: Settings, description: 'Manage your profile' },
    ];

    const likes = []; // Keep empty for now as requested or until implemented

    return (
        <div className="min-h-screen bg-white text-gray-900 font-['Poppins']">
            {/* Header / Banner */}
            <div className="bg-gray-100 border-b border-gray-100 py-12 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                            {userInfo.avatar}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-black mb-1">{userInfo.name}</h1>
                            <p className="text-gray-500 font-medium">Member since 2024 • {userInfo.email}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95 shadow-sm"
                    >
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Navigation Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="lg:sticky lg:top-28 space-y-2">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group relative ${
                                        activeTab === item.id 
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 z-10' 
                                        : 'bg-white hover:bg-gray-50 border border-transparent hover:border-gray-100 z-0'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl transition-colors ${
                                            activeTab === item.id ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'
                                        }`}>
                                            <item.icon size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-sm">{item.name}</p>
                                            <p className={`text-[10px] ${activeTab === item.id ? 'text-blue-100' : 'text-gray-400'}`}>
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className={`transition-transform duration-300 ${activeTab === item.id ? 'translate-x-1 text-white' : 'opacity-0 group-hover:opacity-100 text-gray-400'}`} />
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Content Section */}
                    <div className="lg:col-span-3">
                        <div className="bg-white border border-gray-100 rounded-[32px] p-8 md:p-10 shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-700">
                            
                            {/* ORDERS TAB */}
                            {activeTab === 'orders' && (
                                <>
                                    <div className="flex items-center gap-3 mb-10">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                            <Package size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">Order History</h2>
                                            <p className="text-gray-400 text-sm">Detailed tracking of all your purchases</p>
                                        </div>
                                    </div>
                                    
                                    {loadingOrders ? (
                                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                            <p className="text-gray-400 text-sm font-medium">Fetching your orders...</p>
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="text-center py-24 bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
                                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                                <ShoppingBag size={32} className="text-gray-300" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
                                            <p className="text-gray-400 mb-8 max-w-xs mx-auto">Looks like you haven't bought anything yet. Start exploring!</p>
                                            <Link to="/products" className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg active:scale-95">Go Shopping</Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div 
                                                    key={order.id} 
                                                    className={`border border-gray-100 rounded-[24px] overflow-hidden transition-all duration-500 ${
                                                        expandedOrderId === order.id ? 'ring-2 ring-blue-500/10 shadow-xl' : 'hover:border-gray-200'
                                                    }`}
                                                >
                                                    {/* Accordion Header */}
                                                    <button 
                                                        onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                                                        className="w-full text-left p-6 flex flex-wrap items-center gap-6 group hover:bg-gray-50/50 transition-colors"
                                                    >
                                                        <div className="flex-1 min-w-[200px]">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {order.id.slice(0, 8)}...</span>
                                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                                                                    order.status === 'Completed' || order.status === 'pending' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                                                                }`}>{order.status}</span>
                                                            </div>
                                                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                                                Ordered on {formatDate(order.created_at)}
                                                            </h3>
                                                        </div>
                                                        <div className="flex items-center gap-8 pr-4">
                                                            <div className="text-right">
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                                                                <p className="text-xl font-extrabold text-black tracking-tight">₹{parseFloat(order.total_amount).toFixed(2)}</p>
                                                            </div>
                                                            <ChevronDown 
                                                                size={20} 
                                                                className={`text-gray-300 transition-transform duration-500 ${expandedOrderId === order.id ? 'rotate-180 text-blue-500' : 'group-hover:text-gray-500'}`} 
                                                            />
                                                        </div>
                                                    </button>

                                                    {/* Accordion Content */}
                                                    <div className={`overflow-hidden transition-all duration-700 ease-in-out ${expandedOrderId === order.id ? 'max-h-[1000px] border-t border-gray-50' : 'max-h-0'}`}>
                                                        <div className="p-8 bg-gray-50/30">
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                                
                                                                {/* Item List */}
                                                                <div className="md:col-span-2 space-y-4">
                                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                                        <Box size={14} /> Order Items
                                                                    </p>
                                                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                                        {order.order_items?.map((item, idx) => (
                                                                            <div key={idx} className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100/50">
                                                                                <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                                                                    {item.products?.images?.[0] && (
                                                                                        <img 
                                                                                            src={`${UPLOADS_URL}/${item.products.images[0]}`} 
                                                                                            alt={item.products.name} 
                                                                                            className="w-full h-full object-cover" 
                                                                                        />
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex-1">
                                                                                    <h4 className="font-bold text-sm text-gray-900">{item.products?.name}</h4>
                                                                                    <p className="text-gray-400 text-xs mt-1">Quantity: {item.quantity}</p>
                                                                                </div>
                                                                                <div className="text-right">
                                                                                    <p className="font-bold text-sm">₹{parseFloat(item.price).toFixed(2)}</p>
                                                                                    <p className="text-[10px] text-gray-400">per unit</p>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                {/* Delivery Summary */}
                                                                <div className="md:col-span-1 space-y-6">
                                                                    <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-100 flex flex-col h-full">
                                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Delivery Details</p>
                                                                        <div className="space-y-6 flex-1">
                                                                            <div className="flex gap-4">
                                                                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                                                    <MapPin size={16} />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">Shipping Address</p>
                                                                                    <p className="text-xs font-medium text-gray-600 leading-relaxed italic">
                                                                                        {user?.address || "No address provided in profile"}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex gap-4">
                                                                                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                                                                    <DollarSign size={16} />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">Payment info</p>
                                                                                    <p className="text-xs font-medium text-gray-600 leading-relaxed">
                                                                                        Transaction Complete
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="mt-8 space-y-4 pt-6 border-t border-gray-50">
                                                                            <button 
                                                                                onClick={() => handleDownloadInvoice(order)}
                                                                                className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-600 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95 border border-transparent hover:border-blue-100"
                                                                            >
                                                                                <FileText size={14} /> Download Invoice
                                                                            </button>
                                                                            <div className="flex items-center justify-between">
                                                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Total</span>
                                                                                <span className="text-2xl font-extrabold text-blue-600 tracking-tight">₹{parseFloat(order.total_amount).toFixed(2)}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* PURCHASES TAB */}
                            {activeTab === 'products' && (
                                <>
                                    <div className="flex items-center gap-3 mb-10">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                            <ShoppingBag size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">Your Purchases</h2>
                                            <p className="text-gray-400 text-sm">All unique items you've ever bought</p>
                                        </div>
                                    </div>
                                    {productsPurchased.length === 0 ? (
                                        <div className="text-center py-20">
                                            <p className="text-gray-400">No products purchased yet.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {productsPurchased.map((product) => (
                                                <div key={product.id} className="flex gap-5 p-5 border border-gray-100 rounded-[28px] hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-500 group">
                                                    <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-50 flex items-center justify-center p-2 group-hover:bg-white transition-colors">
                                                        {product.image ? (
                                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover:scale-110" />
                                                        ) : (
                                                            <Box size={32} className="text-gray-200" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col justify-center">
                                                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">{product.name}</h4>
                                                        <p className="text-gray-400 text-xs font-medium flex items-center gap-1.5 mb-3">
                                                            <Calendar size={12} /> Last Bought: {product.date}
                                                        </p>
                                                        <div className="flex items-center gap-4">
                                                            <span className="font-extrabold text-black text-lg">₹{parseFloat(product.price).toFixed(2)}</span>
                                                            <Link to="/products" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Buy Again</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* WISHLIST TAB */}
                            {activeTab === 'likes' && (
                                <>
                                    <div className="flex items-center gap-3 mb-10">
                                        <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                                            <Heart size={24} fill="currentColor" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">Your Wishlist</h2>
                                            <p className="text-gray-400 text-sm">Products you've saved for later</p>
                                        </div>
                                    </div>

                                    {wishlist.length === 0 ? (
                                        <div className="text-center py-20 bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
                                            <Heart size={48} className="text-gray-200 mx-auto mb-4" />
                                            <p className="text-gray-400 font-medium">Your wishlist is empty.</p>
                                            <Link to="/products" className="text-blue-600 text-sm font-bold mt-4 inline-block hover:underline">Explore Products</Link>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {wishlist.map((item) => (
                                                <div key={item.id} className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:border-red-200 transition-all duration-500 hover:shadow-xl hover:shadow-red-50/20">
                                                    <div className="aspect-square bg-gray-50 relative overflow-hidden">
                                                        <Link to={`/products/${item.id}`}>
                                                            <img 
                                                                src={item.images?.[0] ? `${UPLOADS_URL}/${item.images[0]}` : ""} 
                                                                alt={item.name} 
                                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                                            />
                                                        </Link>
                                                        <button 
                                                            onClick={() => toggleWishlist(item)}
                                                            className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-md rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-90"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    <div className="p-6">
                                                        <Link to={`/products/${item.id}`}>
                                                            <h4 className="font-bold text-gray-900 text-sm mb-2 truncate group-hover:text-red-500 transition-colors uppercase tracking-tight">{item.name}</h4>
                                                        </Link>
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-gray-900 font-extrabold tracking-tight">₹{parseFloat(item.price).toFixed(2)}</p>
                                                            <button 
                                                                className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline"
                                                                onClick={() => navigate(`/products/${item.id}`)}
                                                            >
                                                                View Item
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'settings' && (
                                <>
                                    <div className="flex items-center gap-3 mb-10">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                                            <Settings size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold">Account Settings</h2>
                                    </div>

                                    {statusMessage && (
                                        <div className={`mb-8 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
                                            statusMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                            {statusMessage.type === 'success' ? <Clock size={16} className="animate-pulse" /> : <Settings size={16} />}
                                            {statusMessage.text}
                                            {statusMessage.type === 'success' && settingsData.password && " Redirecting to login..."}
                                        </div>
                                    )}

                                    <form onSubmit={handleProfileUpdate} className="space-y-8 max-w-2xl">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">Full Name</label>
                                                <input 
                                                    type="text" 
                                                    value={settingsData.name} 
                                                    onChange={(e) => setSettingsData({...settingsData, name: e.target.value})}
                                                    className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-900 font-medium" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">Email Address</label>
                                                <input 
                                                    type="email" 
                                                    value={settingsData.email} 
                                                    onChange={(e) => setSettingsData({...settingsData, email: e.target.value})}
                                                    className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-900 font-medium" 
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1 flex items-center gap-1.5"><MapPin size={10} /> Shipping Address</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter your delivery address"
                                                    value={settingsData.address} 
                                                    onChange={(e) => setSettingsData({...settingsData, address: e.target.value})}
                                                    className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-900 font-medium" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1 flex items-center gap-1.5"><Phone size={10} /> Contact Number</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="+1 (555) 000-0000"
                                                    value={settingsData.contact} 
                                                    onChange={(e) => setSettingsData({...settingsData, contact: e.target.value})}
                                                    className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-900 font-medium" 
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">Update Password</label>
                                            <input 
                                                type="password" 
                                                placeholder="••••••••" 
                                                value={settingsData.password}
                                                onChange={(e) => setSettingsData({...settingsData, password: e.target.value})}
                                                className="w-full bg-gray-50 border border-transparent rounded-2xl p-4 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-900 font-medium" 
                                            />
                                            <p className="text-[10px] text-gray-400 italic ml-1">Leave blank to keep current password</p>
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={updatingSettings}
                                            className={`${updatingSettings ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02]'} text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-3`}
                                        >
                                            {updatingSettings ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Saving...
                                                </>
                                            ) : 'Save Changes'}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
