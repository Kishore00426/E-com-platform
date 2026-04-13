import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Package, Image as ImageIcon, Tag, Hash, DollarSign, Subtitles, Upload, X } from 'lucide-react';
import { API_URL, UPLOADS_URL } from '../../apiConfig';

export default function ProductManager() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form State
    const [newProd, setNewProd] = useState({
        name: '', description: '', price: '', stock: '', category_id: '', subcategory_id: ''
    });
    const [selectedFiles, setSelectedFiles] = useState([]);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch(`${API_URL}/api/products`).then(res => res.json()),
                fetch(`${API_URL}/api/categories`).then(res => res.json())
            ]);
            setProducts(prodRes);
            setCategories(catRes);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        if (newProd.category_id) {
            const fetchSubs = async () => {
                try {
                    const res = await fetch(`${API_URL}/api/categories/${newProd.category_id}/subcategories`);
                    if (res.ok) {
                        const data = await res.json();
                        setSubcategories(data);
                    }
                } catch (err) { console.error(err); }
            };
            fetchSubs();
        } else {
            setSubcategories([]);
        }
    }, [newProd.category_id]);

    useEffect(() => { fetchData(); }, []);

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            
            // Append text fields
            formData.append('name', newProd.name);
            formData.append('description', newProd.description);
            formData.append('price', newProd.price);
            formData.append('stock', newProd.stock);
            formData.append('category_id', newProd.category_id);
            formData.append('subcategory_id', newProd.subcategory_id);
            
            // Append multiple files
            for (let i = 0; i < selectedFiles.length; i++) {
                formData.append('images', selectedFiles[i]);
            }

            const response = await fetch(`${API_URL}/api/products`, {
                method: 'POST',
                headers: { 
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) throw new Error("Error creating product");
            
            setNewProd({ name: '', description: '', price: '', stock: '', category_id: '', subcategory_id: '' });
            setSelectedFiles([]);
            setIsModalOpen(false);
            fetchData();
        } catch (err) { alert(err.message || "Error creating product"); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Error deleting product");
            fetchData();
        } catch (err) { alert(err.message || "Error deleting product"); }
    };

    return (
        <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-700 pb-10">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="w-full md:w-auto">
                    <h1 className="text-3xl lg:text-4xl text-gray-900 tracking-tighter">Product Inventory</h1>
                    <p className="text-gray-500 mt-1 tracking-tight text-sm lg:text-base">Manage and track your products, stock, and local uploads.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex-1 md:flex-none bg-green-50 border border-green-100 text-green-700 px-4 lg:px-6 py-2.5 lg:py-3 rounded-2xl text-xs lg:text-sm shadow-sm flex items-center justify-center gap-2">
                        <Package className="w-4 h-4 lg:w-5 lg:h-5" /> {products.length} Items Total
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex-1 md:flex-none bg-blue-600 text-white px-6 lg:px-8 py-2.5 lg:py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 flex items-center justify-center gap-2 text-[10px] lg:text-sm font-bold uppercase tracking-widest"
                    >
                        <Plus className="w-4 h-4 lg:w-5 lg:h-5" /> Add Product
                    </button>
                </div>
            </header>

            {/* Create Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsModalOpen(false)}
                    ></div>
                    
                    <section className="relative w-full max-w-4xl bg-white p-6 lg:p-10 rounded-[32px] lg:rounded-[40px] shadow-2xl border border-gray-100 animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto no-scrollbar">
                        <div className="flex justify-between items-center mb-8 lg:mb-10">
                            <h2 className="text-2xl lg:text-3xl text-gray-900 flex items-center gap-3 tracking-tighter">
                                <Plus className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" /> List New Product
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreate} className="space-y-6 lg:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                                <div className="space-y-3 lg:col-span-2">
                                    <label className="text-xs text-gray-500 ml-1 flex items-center gap-1 uppercase tracking-widest"><Package className="w-3 h-3" /> Product Name</label>
                                    <input 
                                        value={newProd.name}
                                        onChange={(e) => setNewProd({...newProd, name: e.target.value})}
                                        className="w-full px-5 py-3.5 lg:px-6 lg:py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                                        placeholder="iPhone 15 Pro Max" required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs text-gray-500 ml-1 flex items-center gap-1 uppercase tracking-widest"><DollarSign className="w-3 h-3" /> Price</label>
                                    <input 
                                        value={newProd.price}
                                        onChange={(e) => setNewProd({...newProd, price: e.target.value})}
                                        className="w-full px-5 py-3.5 lg:px-6 lg:py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                                        type="number" placeholder="99.99" required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs text-gray-500 ml-1 flex items-center gap-1 uppercase tracking-widest"><Hash className="w-3 h-3" /> Stock</label>
                                    <input 
                                        value={newProd.stock}
                                        onChange={(e) => setNewProd({...newProd, stock: e.target.value})}
                                        className="w-full px-5 py-3.5 lg:px-6 lg:py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                                        type="number" placeholder="50" required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                                <div className="space-y-3">
                                    <label className="text-xs text-gray-500 ml-1 flex items-center gap-1 uppercase tracking-widest"><Tag className="w-3 h-3" /> Category</label>
                                    <select 
                                        value={newProd.category_id}
                                        onChange={(e) => setNewProd({...newProd, category_id: e.target.value, subcategory_id: ''})}
                                        className="w-full px-5 py-3.5 lg:px-6 lg:py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs text-gray-500 ml-1 flex items-center gap-1 uppercase tracking-widest"><Subtitles className="w-3 h-3" /> Subcategory</label>
                                    <select 
                                        value={newProd.subcategory_id}
                                        onChange={(e) => setNewProd({...newProd, subcategory_id: e.target.value})}
                                        className={`w-full px-5 py-3.5 lg:px-6 lg:py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm ${!newProd.category_id ? 'opacity-50 cursor-not-allowed text-gray-300' : ''}`}
                                        required
                                        disabled={!newProd.category_id}
                                    >
                                        <option value="">Select Subcategory</option>
                                        {subcategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs text-gray-500 ml-1 flex items-center gap-1 uppercase tracking-widest"><ImageIcon className="w-3 h-3" /> Local Uploads</label>
                                    <label className="w-full flex items-center gap-3 px-5 py-3.5 lg:px-6 lg:py-3.5 bg-blue-50 border border-blue-100 rounded-2xl cursor-pointer hover:bg-blue-100 transition-all border-dashed group">
                                        <Upload className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                                        <span className="text-blue-700 text-sm">{selectedFiles.length > 0 ? `${selectedFiles.length} files` : 'Upload Images'}</span>
                                        <input type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*" />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs text-gray-500 ml-1 flex items-center gap-1 uppercase tracking-widest">Description</label>
                                <textarea 
                                    value={newProd.description}
                                    onChange={(e) => setNewProd({...newProd, description: e.target.value})}
                                    className="w-full px-5 py-3.5 lg:px-6 lg:py-4 bg-gray-50 border border-gray-100 rounded-3xl focus:ring-2 focus:ring-blue-500/20 outline-none min-h-[140px] transition-all shadow-sm leading-relaxed"
                                    placeholder="Detailed description of the product..." required
                                ></textarea>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 lg:gap-4 pt-6 border-t border-gray-50">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full sm:w-auto px-10 py-4 rounded-full text-gray-500 hover:bg-gray-100 transition-all font-bold uppercase tracking-widest text-xs"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-12 py-4 rounded-full hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 font-bold uppercase tracking-widest text-xs">
                                    Add Product
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            {/* Products Mobile Card View */}
            <div className="lg:hidden space-y-4 animate-in slide-in-from-bottom-4 duration-700">
                {products.map((prod) => (
                    <div key={prod.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 flex gap-4">
                            <div className="w-20 h-20 bg-gray-50 rounded-2xl border border-gray-50 overflow-hidden shrink-0">
                                {prod.images?.[0] ? (
                                    <img 
                                        src={prod.images[0].startsWith('http') ? prod.images[0] : `${UPLOADS_URL}/${prod.images[0]}`} 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <ImageIcon className="w-6 h-6 text-gray-200 m-auto mt-6" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1 py-1">
                                <h3 className="text-gray-900 font-bold truncate leading-tight tracking-tight">{prod.name}</h3>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-[8px] text-blue-600 px-2 py-0.5 border border-blue-50 bg-blue-50/30 rounded-full font-black uppercase">
                                        {categories.find(c => c.id === prod.category_id)?.name || 'General'}
                                    </span>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-lg font-black text-gray-900">₹{prod.price}</p>
                                    <div className={`flex items-center gap-1.5 text-[10px] font-bold ${prod.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${prod.stock < 10 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                                        {prod.stock} Units
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50/50 px-5 py-3 border-t border-gray-50 flex justify-end gap-2">
                            <button className="p-2 text-blue-500 hover:bg-blue-100/50 rounded-xl transition-all">
                                <Edit3 className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleDelete(prod.id)} className="p-2 text-red-500 hover:bg-red-100/50 rounded-xl transition-all">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
                {products.length === 0 && (
                    <div className="p-10 text-center text-gray-400 italic text-sm">No products in inventory yet.</div>
                )}
            </div>

            {/* Desktop Products Table */}
            <div className="hidden lg:block bg-white rounded-[32px] lg:rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-1000">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100 uppercase tracking-widest text-[10px] text-gray-400 font-bold">
                            <tr>
                                <th className="px-10 py-6 text-sm text-gray-600 font-bold">Product Details</th>
                                <th className="px-10 py-6 text-sm text-gray-600 font-bold">Price</th>
                                <th className="px-10 py-6 text-sm text-gray-600 font-bold">Stock</th>
                                <th className="px-10 py-6 text-sm text-gray-600 text-right font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((prod) => (
                                <tr key={prod.id} className="hover:bg-blue-50/10 transition-colors group">
                                    <td className="px-10 py-8 font-bold">
                                        <div className="flex items-center gap-8">
                                            <div className="w-24 h-24 bg-white shadow-md rounded-[28px] border border-gray-100 overflow-hidden flex items-center justify-center p-1 shrink-0 group-hover:scale-105 transition-transform duration-500">
                                                {prod.images?.[0] ? (
                                                    <img 
                                                        src={prod.images[0].startsWith('http') ? prod.images[0] : `${UPLOADS_URL}/${prod.images[0]}`} 
                                                        className="w-full h-full object-cover rounded-[22px]" 
                                                    />
                                                ) : (
                                                    <ImageIcon className="w-8 h-8 text-gray-300" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-gray-900 text-2xl tracking-tighter leading-none mb-2 truncate font-bold">{prod.name}</p>
                                                <div className="flex gap-2">
                                                    <span className="text-[10px] text-blue-600 px-3 py-1 border border-blue-50 bg-blue-50/30 rounded-full font-black uppercase tracking-widest">
                                                        {categories.find(c => c.id === prod.category_id)?.name || 'General'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-gray-900 text-xl font-black tracking-tighter leading-none">₹{prod.price}</td>
                                    <td className="px-10 py-8 font-bold">
                                        <div className={`flex items-center gap-2.5 text-base ${prod.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                                            <div className={`w-2.5 h-2.5 rounded-full ${prod.stock < 10 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                                            <span>{prod.stock} <span className="opacity-60 text-sm">Units Available</span></span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right space-x-2">
                                        <button className="p-4 text-blue-500 hover:bg-blue-50 rounded-2xl transition-all border border-transparent hover:border-blue-100 shadow-sm active:scale-95">
                                            <Edit3 className="w-6 h-6" />
                                        </button>
                                        <button onClick={() => handleDelete(prod.id)} className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100 shadow-sm active:scale-95">
                                            <Trash2 className="w-6 h-6" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

    );
}
