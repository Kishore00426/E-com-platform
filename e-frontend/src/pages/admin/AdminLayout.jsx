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
    ChevronLeft
} from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

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
            {/* Sidebar */}
            <aside className={`
                ${isCollapsed ? 'w-20' : 'w-72'} 
                bg-gradient-to-b from-black to-slate-950 text-gray-400 
                flex flex-col fixed h-full shadow-2xl transition-all duration-300 z-50
            `}>
                {/* Logo Section */}
                <div className={`
                    flex items-center border-b border-gray-800/50 transition-all duration-300
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

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group
                                ${isActive
                                    ? 'bg-white text-gray-900 shadow-xl shadow-black/20'
                                    : 'hover:bg-white/5 hover:text-white'}
                                ${isCollapsed ? 'justify-center' : ''}
                            `}
                            title={isCollapsed ? item.name : ''}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {!isCollapsed && <span className="text-sm truncate">{item.name}</span>}
                            {!isCollapsed && <ChevronRight className={`ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity`} />}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Section */}
                <div className="p-4 border-t border-gray-800/50">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-400 hover:bg-red-500/40 transition-all duration-200 group ${isCollapsed ? 'justify-center' : ''}`}
                        title={isCollapsed ? 'Logout' : ''}
                    >
                        <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        {!isCollapsed && <span className="text-sm">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`flex-1 ${isCollapsed ? 'ml-20' : 'ml-72'} p-6 md:p-10 min-h-screen transition-all duration-300 bg-gray-50`}>
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
