import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { API_URL, UPLOADS_URL } from "../apiConfig";
import { Heart } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
    } catch (err) {
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-6">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <Link to="/products" className="text-blue-600 hover:underline">Back to All Products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white  text-gray-800 px-6 py-12 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        <Link to="/products" className="inline-flex items-center text-gray-500 hover:text-black mb-10 group transition-all">
          <div className="p-2 bg-gray-50 rounded-full group-hover:bg-gray-100 mr-3 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </div>
          <span className="font-medium tracking-tight">Back to Products</span>
        </Link>
        
        <div className="flex flex-col md:flex-row gap-16">
          {/* Image Gallery */}
          <div className="md:w-1/2 flex flex-col gap-6">
            <div className="w-full aspect-square bg-gray-50 border border-gray-100 rounded-[40px] flex items-center justify-center overflow-hidden group shadow-2xl shadow-gray-100">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={`${UPLOADS_URL}/${product.images[selectedImage]}`} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <span className="text-gray-400 text-lg">No image available</span>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {product.images.map((img, index) => (
                  <button 
                    key={index} 
                    onClick={() => setSelectedImage(index)}
                    className={`min-w-[100px] h-24 border-2 rounded-2xl overflow-hidden transition-all duration-300 ${
                      selectedImage === index ? 'border-gray-900 scale-105 shadow-lg' : 'border-gray-50 hover:border-gray-200'
                    }`}
                  >
                    <img 
                      src={`${UPLOADS_URL}/${img}`} 
                      alt={`${product.name} thumb ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="md:w-1/2 flex flex-col pt-4">
            <div className="mb-8">
              <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                In Stock ({product.stock})
              </div>
              <h1 className="text-5xl md:text-6xl font-medium tracking-tighter text-gray-900 leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="mb-10">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest block mb-2">Price</span>
              <p className="text-5xl font-medium text-gray-900 tracking-tighter">
                ₹{Number(product.price).toLocaleString()}
              </p>
            </div>
            
            <div className="mb-10 p-8 bg-gray-50 rounded-[32px] border border-gray-100">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Description</h3>
              <p className="text-gray-600 leading-relaxed text-lg tracking-tight">
                {product.description || "No description available for this item."}
              </p>
            </div>
            
            <div className="mt-auto space-y-6">
              <div className="flex gap-4">
                <button 
                  onClick={async () => {
                    await addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.images?.[0]
                    });
                    alert(`${product.name} added to cart!`);
                  }}
                  className="flex-1 bg-gray-900 text-white py-5 rounded-[24px] font-bold text-lg hover:bg-blue-600 transition-all duration-300 active:scale-95 shadow-xl shadow-gray-200"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`px-6 border border-gray-100 rounded-[24px] hover:bg-gray-50 hover:border-gray-200 transition-all group ${
                    isInWishlist(product.id) ? "text-red-500 bg-red-50/10" : "text-gray-400 hover:text-red-500"
                  }`}
                >
                  <Heart 
                    size={24} 
                    fill={isInWishlist(product.id) ? "currentColor" : "none"} 
                    className="transition-colors" 
                  />
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 italic">
                Free shipping on all orders over ₹500. Secure checkout guaranteed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
