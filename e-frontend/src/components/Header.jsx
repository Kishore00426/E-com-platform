import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cart } = useCart();
    const { isLoggedIn, user } = useAuth();
    
    // Calculate total quantity of all items in cart
    const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

    const navLinkClass = ({ isActive }) => 
        `transition-colors hover:text-black ${isActive ? "text-black font-bold border-b-2 border-black" : "text-gray-500"}`;

    const mobileNavLinkClass = ({ isActive }) => 
        `text-lg font-medium transition-colors ${isActive ? "text-black border-l-4 border-black pl-3" : "text-gray-600"}`;

    return (
        <header className="px-6 py-4 flex items-center justify-between bg-white/70 text-zinc-900 sticky top-0 z-50 backdrop-blur-md border-b border-gray-100">
            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                </div>
                <span className="text-xl text-black font-bold tracking-wide">Proproducts</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                <NavLink to="/" className={navLinkClass}>Home</NavLink>
                <NavLink to="/about" className={navLinkClass}>About</NavLink>
                <NavLink to="/products" className={navLinkClass}>Products</NavLink>
                <NavLink to="/cart" className={({ isActive }) => `hover:text-black transition-colors flex items-center relative ${isActive ? "text-black font-bold" : "text-gray-500"}`} aria-label="Cart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="8" cy="21" r="1" />
                        <circle cx="19" cy="21" r="1" />
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                    {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {cartItemCount}
                        </span>
                    )}
                </NavLink>
                {isLoggedIn ? (
                    <NavLink to={user?.role === 'admin' ? '/admin' : '/profile'} className={({ isActive }) => `hover:text-black transition-colors flex items-center ${isActive ? "text-black font-bold" : "text-gray-500"}`} aria-label="Profile">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </NavLink>
                ) : (
                    <NavLink to="/login" className={({ isActive }) => `hover:text-black transition-colors flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-full ${isActive ? "text-black font-bold bg-gray-50" : "text-gray-500"}`} aria-label="Login">
                        <span className="text-sm">Sign In</span>
                    </NavLink>
                )}
            </nav>

            {/* Mobile Icons and Menu Button */}
            <div className="flex md:hidden items-center gap-5 text-black">
                <Link to="/cart" className="hover:text-zinc-600 transition-colors relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="8" cy="21" r="1" />
                        <circle cx="19" cy="21" r="1" />
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                    {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {cartItemCount}
                        </span>
                    )}
                </Link>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-1 focus:outline-none transition-transform duration-200"
                    style={{ transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                    aria-label="Toggle Menu"
                >
                    {isMenuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Mobile Collapsible Menu */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full  border-b 
                 z-50 backdrop-blur-md border-gray-200 py-8 px-8 flex flex-col bg-blur-3xl bg-white gap-6 md:hidden animate-slide-down  rounded-b-3xl ">
                    <NavLink to="/" onClick={() => setIsMenuOpen(false)} className={mobileNavLinkClass}>Home</NavLink>
                    <NavLink to="/about" onClick={() => setIsMenuOpen(false)} className={mobileNavLinkClass}>About</NavLink>
                    <NavLink to="/products" onClick={() => setIsMenuOpen(false)} className={mobileNavLinkClass}>Products</NavLink>
                    {isLoggedIn ? (
                        <NavLink to={user?.role === 'admin' ? '/admin' : '/profile'} onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `text-lg font-medium flex items-center gap-2 transition-colors ${isActive ? "text-black border-l-4 border-black pl-3" : "text-gray-600"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            {user?.role === 'admin' ? 'Admin Panel' : 'Profile'}
                        </NavLink>
                    ) : (
                        <NavLink to="/login" onClick={() => setIsMenuOpen(false)} className={mobileNavLinkClass}>Sign In</NavLink>
                    )}
                </div>
            )}
        </header>
    );
}