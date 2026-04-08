import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, CheckCircle, Truck, CreditCard, ChevronRight, User, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_URL, UPLOADS_URL } from '../apiConfig';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [shippingAddress, setShippingAddress] = useState('');

  // Sync address if user loads late or updates
  React.useEffect(() => {
    if (user?.address) {
      setShippingAddress(user.address);
    }
  }, [user?.address]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.12; // 12% GST
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      alert("Please provide a shipping address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentMethod,
          shippingAddress,
          totalAmount: total
        })
      });

      if (response.ok) {
        setSuccess(true);
        clearCart(); // Clear cart state for user
      } else {
        const error = await response.json();
        alert(error.error || "Order failed. Please try again.");
      }
    } catch (err) {
      console.error("Order Error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 font-['Poppins']">
        <div className="max-w-md w-full text-center animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Order Placed!</h1>
          <p className="text-gray-500 mb-10 leading-relaxed text-sm">
            Thank you for your purchase, <span className="font-semibold text-black">{user?.name}</span>. 
            Your order has been confirmed successfully.
          </p>
          
          <div className="space-y-4">
            <Link 
              to="/profile"
              className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-2xl font-bold hover:bg-zinc-800 hover:scale-105 transition-all duration-300 shadow-xl"
            >
              View Orders
            </Link>
            <Link 
              to="/products"
              className="w-full flex items-center justify-center gap-2 bg-gray-50 text-gray-900 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all border border-gray-100"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-6 lg:px-20 font-['Poppins']">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Checkout Form */}
          <div className="flex-1 space-y-10">
            <div>
              <Link to="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors">
                <ArrowLeft size={18} /> Back to Cart
              </Link>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Checkout</h1>
            </div>

            {/* Delivery Details */}
            <section className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                  <User size={20} />
                </div>
                <h2 className="text-xl font-bold">Receiver Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                  <div className="w-full bg-gray-50 px-5 py-4 rounded-2xl border border-gray-100 text-gray-800 font-medium opacity-60">
                    {user?.name}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-5 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                    <textarea 
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Street name, City, State, ZIP..."
                      className={`w-full bg-gray-50 pl-14 pr-5 py-4 rounded-2xl border ${!shippingAddress ? 'border-red-100' : 'border-gray-100'} focus:bg-white focus:border-black focus:ring-0 transition-all min-h-[120px] outline-none text-sm font-medium leading-relaxed`}
                    />
                    {!shippingAddress && (
                      <div className="absolute -bottom-6 left-1 text-[10px] text-red-500 font-bold flex items-center gap-1">
                        <ArrowLeft size={10} className="rotate-90" />
                        Please enter or save an address in your <Link to="/profile" className="underline hover:text-black">Profile Settings</Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method Selection */}
            <section className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-xl font-bold">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'Card', label: 'Credit / Debit Card', icon: '💳' },
                  { id: 'UPI', label: 'Google Pay / PhonePe', icon: '📱' },
                  { id: 'COD', label: 'Cash on Delivery', icon: '💵' }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 ${
                      paymentMethod === method.id 
                      ? 'border-black bg-gray-50' 
                      : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{method.icon}</span>
                      <span className="font-bold text-gray-900">{method.label}</span>
                    </div>
                    {paymentMethod === method.id && (
                      <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                        <CheckCircle size={14} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar: Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-white rounded-[40px] p-8 shadow-xl shadow-gray-100 border border-gray-100 sticky top-12 overflow-hidden">
              <h2 className="text-2xl font-bold mb-8">Order Summary</h2>
              
              {/* Item List */}
              <div className="max-h-60 overflow-y-auto mb-8 space-y-4 pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                      <img src={`${UPLOADS_URL}/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 truncate">{item.name}</h4>
                      <p className="text-gray-400 text-xs font-semibold">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-sm text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 py-6 border-y border-gray-50 mb-8 font-medium">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-500" : "text-gray-900"}>
                    {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Estimated Tax (12%)</span>
                  <span className="text-gray-900">₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-10">
                <span className="text-gray-400 text-lg font-medium">Total</span>
                <span className="text-3xl font-extrabold text-black tracking-tight">₹{total.toFixed(2)}</span>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading || cart.length === 0}
                className="w-full flex items-center justify-center gap-3 bg-black text-white py-5 rounded-[24px] font-bold text-lg hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-zinc-200 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Truck size={20} /> Place Order
                  </>
                )}
              </button>
              
              <div className="flex items-center gap-2 justify-center mt-6 text-gray-300 text-xs font-bold uppercase tracking-widest">
                <Truck size={14} /> Guaranteed Delivery in 3-5 days
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
