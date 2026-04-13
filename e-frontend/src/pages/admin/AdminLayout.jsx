import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    UserCheck,
    Layers,
    Package,
    Calendar,
    BarChart3,
    Users,
    ShieldCheck,
    Settings,
    LogOut,
    ChevronRight,
    Subtitles,
    Menu,
    ChevronLeft,
    X
} from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const menuItems = [
        { name: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
        { name: 'User approval', icon: UserCheck, path: '/admin/verify' },
        { name: 'Category', icon: Layers, path: '/admin/categories' },
        { name: 'Subcategories', icon: Subtitles, path: '/admin/subcategories' },
        { name: 'Products', icon: Package, path: '/admin/products' },
        { name: 'Orders', icon: Calendar, path: '/admin/bookings' },
        { name: 'Reports', icon: BarChart3, path: '/admin/reports' },
        { name: 'Users', icon: Users, path: '/admin/users' },
        { name: 'Settings', icon: Settings, path: '/admin/settings' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
            {/* Sidebar Overlay */}
            {isMobileOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[55] animate-in fade-in duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                ${isCollapsed ? 'lg:w-20' : 'lg:w-72'} 
                ${isMobileOpen ? 'translate-x-0 w-full' : '-translate-x-full lg:translate-x-0 w-72'}
                bg-gradient-to-b from-black to-slate-950 text-gray-400 
                flex flex-col fixed h-full shadow-2xl transition-all duration-300 z-[60] lg:z-50
            `}>
                {/* Logo Section */}
                <div className={`
                    hidden lg:flex items-center border-b border-gray-800/50 transition-all duration-300
                    ${isCollapsed ? 'flex-col py-4 gap-4 px-2' : 'p-6 justify-between'}
                `}>
                    {!isCollapsed && (
                        <div className="flex items-center">
                            <span className="text-white text-2xl tracking-tight transition-all duration-300">Admin Panel</span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={`p-2 hover:bg-white/10 rounded-xl text-white transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
                    >
                        {isCollapsed ? <Menu size={25} /> : <ChevronLeft size={25} className="border border-grey-800 bg-white/50 hover:bg-white/80 text-black rounded-full" />}
                    </button>
                </div>

                {/* Mobile Logo Section (Visible only on mobile sidebar) */}
                <div className="lg:hidden p-8 border-b border-gray-800/50 flex items-center justify-between">
                    <span className="text-white text-2xl font-bold tracking-tight">Admin Console</span>
                    <button 
                        onClick={() => setIsMobileOpen(false)}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-8 lg:py-6 space-y-1 overflow-y-auto no-scrollbar">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsMobileOpen(false)}
                            className={({ isActive }) => `
                                flex items-center gap-4 px-4 py-4 lg:py-3.5 rounded-2xl transition-all duration-200 group
                                ${isActive
                                    ? 'bg-white text-gray-900 shadow-xl shadow-black/20 font-bold'
                                    : 'hover:bg-white/5 hover:text-white'}
                                ${isCollapsed ? 'lg:justify-center' : ''}
                            `}
                            title={isCollapsed ? item.name : ''}
                        >
                            <item.icon className={`w-5 h-5 shrink-0 ${isCollapsed ? '' : ''}`} />
                            <span className={`text-sm lg:text-sm truncate ${isCollapsed ? 'lg:hidden' : 'block'}`}>{item.name}</span>
                            {!isCollapsed && <ChevronRight className={`ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block`} />}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Section */}
                <div className="p-4 border-t border-gray-800/50">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all duration-200 group ${isCollapsed ? 'lg:justify-center' : ''}`}
                        title={isCollapsed ? 'Logout' : ''}
                    >
                        <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        <span className={`text-sm ${isCollapsed ? 'lg:hidden' : 'block'}`}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`
                flex-1 
                ${isCollapsed ? 'lg:ml-20' : 'lg:ml-72'} 
                ml-0
                p-4 md:p-6 lg:p-10 min-h-screen transition-all duration-300 bg-gray-50
            `}>
                {/* Mobile Top Bar (Only visible on mobile) */}
                <div className="lg:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="font-bold text-gray-900 tracking-tight">Admin Panel</span>
                    </div>
                    <button 
                        onClick={() => setIsMobileOpen(true)}
                        className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 border border-gray-100 shadow-sm"
                    >
                        <Menu size={24} />
                    </button>
                </div>
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;

