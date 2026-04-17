import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AIChatbot from "./components/AIChatbot";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage.jsx";
import About from "./pages/About.jsx";
import Productspage from "./pages/Productspage.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import PrivacyPolicy from "./pages/privacy.jsx";
import TermsCondition from "./pages/Terms.jsx";
import Contact from "./pages/Contact.jsx";
import Profile from "./pages/Profile.jsx";
import Checkout from "./pages/Checkout.jsx";
import CartPage from "./pages/Cart.jsx";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserVerification from "./pages/admin/UserVerification";
import CategoryManager from "./pages/admin/CategoryManager";
import SubcategoryManager from "./pages/admin/SubcategoryManager";
import ProductManager from "./pages/admin/ProductManager";
import SiteSettings from "./pages/admin/SiteSettings";
import Reports from "./pages/admin/Reports";
import UserManager from "./pages/admin/UserManager";
import OrderManager from "./pages/admin/OrderManager";

// Minor placeholders for secondary sections
const Privileges = () => <div className="p-8 text-3xl font-extrabold text-gray-900 flex flex-col items-center justify-center h-64 border-dashed border-4 border-gray-200 rounded-3xl">Privileges & Roles <span className="text-sm font-medium text-gray-400 mt-2">Role Management...</span></div>;

// 1. Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  
  if (loading) return null; // Or a loading spinner

  if (!isLoggedIn) {
    // If user is not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Component to handle conditional rendering of Header/Footer
function AppContent() {
  const location = useLocation();
  
  // Define paths where Header and Footer should be hidden
  const hideHeaderFooter = ['/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/admin');

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Productspage />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Dashboard Routes */}
        <Route element={<AdminProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="verify" element={<UserVerification />} />
                <Route path="categories" element={<CategoryManager />} />
                <Route path="subcategories" element={<SubcategoryManager />} />
                <Route path="products" element={<ProductManager />} />
                <Route path="bookings" element={<OrderManager />} />
                <Route path="reports" element={<Reports />} />
                <Route path="users" element={<UserManager />} />
                <Route path="privileges" element={<Privileges />} />
                <Route path="settings" element={<SiteSettings />} />
            </Route>
        </Route>

        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } 
        />
        
        {/* 2. Protect the Profile Page */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/cart" element={<CartPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsCondition />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
      <AIChatbot />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <AppContent />
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
