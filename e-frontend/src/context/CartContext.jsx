import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, isLoggedIn, logout } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn || !token) return;
    setLoading(true);
    try {
      console.log("CartContext: Fetching cart for user...");
      const response = await fetch('http://localhost:4200/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("CartContext: Fetch Cart Failed:", response.status, errorData);
        
        // If token is invalid or expired, logout user immediately to fix the session
        if (response.status === 401 || response.status === 400) {
          console.warn("CartContext: Session invalid. Logging out...");
          logout();
          return;
        }

        throw new Error(errorData.error || `Failed to fetch cart: ${response.status}`);
      }

      const data = await response.json();
      console.log("CartContext: Received cart data:", data);

      if (response.ok) {
        const formattedCart = data.map(item => {
          const product = Array.isArray(item.products) ? item.products[0] : item.products;
          return {
            id: String(item.product_id), // Ensure string for consistent mapping
            name: product?.name || 'Unknown Product',
            price: parseFloat(product?.price) || 0,
            quantity: item.quantity,
            image: product?.images?.[0] || null
          };
        });
        console.log("CartContext: Formatted Cart:", formattedCart);
        setCart(formattedCart);
      }
    } catch (error) {
      console.error("CartContext: Error fetching cart:", error.message);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    } else {
      // Load guest cart from localStorage
      const guestCart = localStorage.getItem('guest_cart');
      if (guestCart) {
        setCart(JSON.parse(guestCart));
      } else {
        setCart([]);
      }
    }
  }, [isLoggedIn, fetchCart]);

  // Sync guest cart to localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.setItem('guest_cart', JSON.stringify(cart));
    }
  }, [cart, isLoggedIn]);

  const addToCart = async (product) => {
    if (isLoggedIn) {
      // Optimistic update
      setCart((prevCart) => {
        const existingProduct = prevCart.find(item => item.id === product.id);
        if (existingProduct) {
          return prevCart.map(item => 
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prevCart, { ...product, quantity: 1 }];
      });

      try {
        console.log("CartContext: Adding to backend cart:", { productId: product.id });
        const response = await fetch('http://localhost:4200/api/cart/add', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId: String(product.id), quantity: 1 }) // Ensure string ID
        });

        if (!response.ok) {
          const data = await response.json();
          console.error("CartContext: Add to Cart API Failed:", response.status, data);
          throw new Error(data.error || `Failed to add to cart: ${response.status}`);
        }
        
        console.log("CartContext: Successfully added to backend. Re-syncing...");
        await fetchCart(); // AWAIT the sync!
      } catch (error) {
        console.error("CartContext: Final Error adding to cart:", error.message);
        // Fallback: Re-sync to remove optimistic item if backend failed
        await fetchCart();
      }
    } else {
      setCart((prevCart) => {
        const existingProduct = prevCart.find(item => item.id === product.id);
        if (existingProduct) {
          return prevCart.map(item => 
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prevCart, { ...product, quantity: 1 }];
      });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (isLoggedIn) {
      // Optimistic update
      const previousCart = [...cart];
      setCart((prevCart) => {
        if (quantity <= 0) return prevCart.filter(item => item.id !== productId);
        return prevCart.map(item => 
          item.id === productId ? { ...item, quantity } : item
        );
      });

      try {
        const response = await fetch('http://localhost:4200/api/cart/update', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId, quantity })
        });

        if (!response.ok) {
          const data = await response.json();
          console.error("CartContext: Update Quantity API Failed:", response.status, data);
          throw new Error(data.error || `Failed to update quantity: ${response.status}`);
        }
        
        await fetchCart();
      } catch (error) {
        console.error("CartContext: Error updating quantity:", error.message);
        setCart(previousCart); // Rollback
        await fetchCart();
      }
    } else {
      setCart((prevCart) => {
        if (quantity <= 0) return prevCart.filter(item => item.id !== productId);
        return prevCart.map(item => 
          item.id === productId ? { ...item, quantity } : item
        );
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (isLoggedIn) {
      const previousCart = [...cart];
      setCart((prevCart) => prevCart.filter(item => item.id !== productId));

      try {
        const response = await fetch(`http://localhost:4200/api/cart/remove/${productId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          const data = await response.json();
          console.error("CartContext: Remove from Cart API Failed:", response.status, data);
          throw new Error(data.error || `Failed to remove from cart: ${response.status}`);
        }

        await fetchCart();
      } catch (error) {
        console.error("CartContext: Error removing from cart:", error.message);
        setCart(previousCart); // Rollback
        await fetchCart();
      }
    } else {
      setCart((prevCart) => prevCart.filter(item => item.id !== productId));
    }
  };

  const clearCart = async () => {
    if (isLoggedIn) {
      try {
        const response = await fetch('http://localhost:4200/api/cart/clear', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) setCart([]);
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    } else {
      setCart([]);
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
