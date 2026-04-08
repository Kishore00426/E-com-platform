import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Heart, Search, SlidersHorizontal } from "lucide-react";

export default function Productspage() {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); 
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:4200/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Derived Data: Categories & Subcategories
  const categories = useMemo(() => {
    const cats = new Map();
    products.forEach(p => {
      if (p.categories) {
        cats.set(p.categories.id, p.categories.name);
      }
    });
    return ["All", ...Array.from(cats.values())];
  }, [products]);

  const subcategories = useMemo(() => {
    if (selectedCategory === "All") return ["All"];
    
    const subcats = new Map();
    products.forEach(p => {
      if (p.categories && p.categories.name === selectedCategory && p.subcategories) {
        subcats.set(p.subcategories.id, p.subcategories.name);
      }
    });
    return ["All", ...Array.from(subcats.values())];
  }, [products, selectedCategory]);

  // Reset subcategory when Category changes
  useEffect(() => {
    setSelectedSubcategory("All");
  }, [selectedCategory]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = p.name?.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query);
        const matchesCategory = selectedCategory === "All" || (p.categories && p.categories.name === selectedCategory);
        const matchesSubcategory = selectedSubcategory === "All" || (p.subcategories && p.subcategories.name === selectedSubcategory);
        
        return matchesSearch && matchesCategory && matchesSubcategory;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return parseFloat(a.price) - parseFloat(b.price);
        if (sortBy === "price_desc") return parseFloat(b.price) - parseFloat(a.price);
        if (sortBy === "name_asc") return a.name.localeCompare(b.name);
        if (sortBy === "newest") return new Date(b.created_at || 0).getTime() < new Date(a.created_at || 0).getTime() ? -1 : 1;
        return 0;
      });
  }, [products, searchQuery, selectedCategory, selectedSubcategory, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-12 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-5xl font-medium tracking-tighter text-gray-900">Our Collection</h1>
            <p className="text-gray-500 mt-2 tracking-tight">Discover our range of high-quality products.</p>
          </div>
          <div className="flex bg-gray-50 border border-gray-100 rounded-full px-5 py-2 items-center gap-3">
            <span className="text-sm font-medium text-gray-600">
              Showing <span className="text-blue-600 font-bold">{filteredProducts.length}</span> of {products.length} Products
            </span>
          </div>
        </div>

        {/* Sorting and Filtering UI */}
        <div className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 mb-10 space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search products..."
                        className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-900"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {/* Sort */}
                <div className="md:w-64 relative shrink-0">
                    <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <select 
                        className="w-full pl-12 pr-10 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-gray-900 appearance-none cursor-pointer"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="newest">Sort by: Newest Arrivals</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="name_asc">Name: A-Z</option>
                    </select>
                </div>
            </div>

            {/* Category Chips */}
            {categories.length > 1 && (
                <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Categories</p>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 active:scale-95 ${
                                    selectedCategory === cat 
                                    ? 'bg-black text-white shadow-md' 
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400 hover:bg-gray-100'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Subcategory Chips */}
            {selectedCategory !== "All" && subcategories.length > 1 && (
                <div className="space-y-3 pt-4 border-t border-gray-200/60 animate-in fade-in slide-in-from-top-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">{selectedCategory} Subcategories</p>
                    <div className="flex flex-wrap gap-2">
                        {subcategories.map(sub => (
                            <button
                                key={sub}
                                onClick={() => setSelectedSubcategory(sub)}
                                className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all duration-300 active:scale-95 ${
                                    selectedSubcategory === sub 
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400 hover:bg-gray-100'
                                }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
            <p className="text-gray-400 text-lg italic">No products match your current filters. ✨</p>
            <button 
                onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSortBy("newest");
                }}
                className="mt-6 text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline px-6 py-2 bg-blue-50 rounded-full"
            >
                Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Link 
                to={`/products/${product.id}`} 
                key={product.id} 
                className="group bg-gray-200 border border-gray-200 rounded-[32px] overflow-hidden hover:shadow-2xl hover:border-gray-300 hover:shadow-gray-200 transition-all duration-500 block relative"
              >
                <div className="h-72 bg-gray-50 relative overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={`http://localhost:4200/uploads/${product.images[0]}`} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <span>No Image Available</span>
                    </div>
                  )}
                   <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                      }}
                      className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm ${
                        isInWishlist(product.id) 
                        ? "bg-red-500 text-white" 
                        : "bg-white/80 text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <Heart size={16} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                    </button>
                    {(product.categories || product.subcategories) && (
                         <span className="bg-white/80 backdrop-blur-md px-3 py-1.5 flex items-center rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-900 shadow-sm">
                           {product.subcategories?.name || product.categories?.name}
                         </span>
                    )}
                  </div>
                  
                  {/* Stock tag */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${product.stock > 0 ? 'bg-black text-white' : 'bg-red-500 text-white'}`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                  </div>
                </div>

                <div className="p-8 bg-white">
                  <h3 className="text-2xl font-medium mb-2 tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {product.description || "No description provided for this product."}
                  </p>
                  
                  <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                    <div>
                      <span className="text-xs text-gray-400 uppercase tracking-widest font-bold block mb-1">Price</span>
                      <span className="text-2xl font-medium text-gray-900 tracking-tighter">
                        ₹{Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <button 
                      disabled={product.stock <= 0}
                      onClick={async (e) => {
                        e.preventDefault();
                        await addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.images?.[0]
                        });
                        alert(`${product.name} added to cart!`);
                      }}
                      className={`${
                        product.stock > 0 
                        ? "bg-gray-900 text-white hover:bg-blue-600 shadow-lg shadow-gray-200" 
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      } px-8 py-3.5 rounded-2xl transition-all duration-300 font-bold uppercase tracking-widest text-[10px] active:scale-95`}
                    >
                      {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
