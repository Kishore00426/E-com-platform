import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { API_URL } from '../apiConfig';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, isLoggedIn } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!isLoggedIn || !token) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setWishlist(data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isLoggedIn, fetchWishlist]);

  const toggleWishlist = async (product) => {
    if (!isLoggedIn) {
      alert("Please login to manage your wishlist.");
      return;
    }

    const isInWishlist = wishlist.some(item => item.id === product.id);

    if (isInWishlist) {
      // Remove Optimistically
      setWishlist(prev => prev.filter(item => item.id !== product.id));
      try {
        await fetch(`${API_URL}/api/wishlist/remove/${product.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (error) {
        console.error("Error removing from wishlist:", error);
        fetchWishlist(); // Rollback
      }
    } else {
      // Add Optimistically
      setWishlist(prev => [...prev, product]);
      try {
        const response = await fetch(`${API_URL}/api/wishlist/add`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId: product.id })
        });
        if (!response.ok) throw new Error("Failed to add to wishlist");
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        fetchWishlist(); // Rollback
      }
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, loading, toggleWishlist, isInWishlist: (id) => wishlist.some(item => item.id === id) }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
