import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UPLOADS_URL } from "../apiConfig";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, loading } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (loading && cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-12 lg:py-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black">Your Cart</h1>
            <p className="text-gray-500 mt-2 text-lg">
              {cart.length} {cart.length === 1 ? 'item' : 'items'} in your bag
            </p>
          </div>
          {cart.length > 0 && (
            <button 
              onClick={clearCart}
              className="text-sm font-semibold text-red-500 hover:text-red-600 flex items-center gap-2 transition-colors mb-2"
            >
              <Trash2 size={16} /> Clear Bag
            </button>
          )}
        </div>
        
        {cart.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-[40px] border border-gray-100 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <ShoppingBag size={40} className="text-gray-300" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-black">Your shopping bag is empty</h2>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto">
              Looks like you haven't added anything to your bag yet. Start exploring our latest products!
            </p>
            <Link to="/products" className="inline-block bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-zinc-800 hover:scale-105 transition-all duration-300 shadow-xl shadow-zinc-200">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div key={item.id} className="p-6 md:p-8 flex gap-6 md:gap-8 items-center group transition-all">
                      {/* Product Image */}
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100 relative group-hover:shadow-md transition-all duration-500">
                        {item.image ? (
                          <img 
                            src={`${UPLOADS_URL}/${item.image}`} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs text-center px-4 font-medium uppercase tracking-widest">
                            {item.name}
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg md:text-xl font-bold text-black truncate pr-4">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                        <p className="text-gray-500 font-medium text-lg mb-6">₹{parseFloat(item.price).toFixed(2)}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-black hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-50"
                              disabled={loading}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-6 text-center font-bold text-black tabular-nums">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-xl bg-white text-black hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-50"
                              disabled={loading}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <p className="text-lg md:text-xl font-bold text-black tabular-nums">
                            ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-900 text-white rounded-[40px] p-8 md:p-10 sticky top-32 shadow-2xl shadow-zinc-200 animate-in slide-in-from-right-4 duration-500">
                <h2 className="text-2xl font-bold mb-8">Summary</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="font-medium text-white tabular-nums">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span className="font-medium text-white">Calculated at next step</span>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-zinc-800 flex justify-between items-center mb-10">
                  <span className="text-xl font-medium text-zinc-400">Total</span>
                  <span className="text-4xl font-bold tabular-nums">₹{total.toFixed(2)}</span>
                </div>
                
                <button 
                  id="proceed-to-checkout"
                  onClick={handleCheckout}
                  className="w-full bg-white text-black py-5 rounded-[24px] font-bold text-lg hover:bg-gray-100 transition-all active:scale-[0.98] shadow-xl"
                >
                  Proceed to Checkout
                </button>
                
                <p className="text-center text-zinc-500 text-xs mt-6 px-4">
                  Tax and shipping included at checkout. By proceeding you agree to our Terms of Service.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
