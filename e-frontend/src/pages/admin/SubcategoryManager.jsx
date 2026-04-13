import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Subtitles, Layers, Tag, Search, X } from 'lucide-react';
import { API_URL } from '../../apiConfig';

export default function SubcategoryManager() {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newSub, setNewSub] = useState({ name: '', category_id: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Editing State
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ name: '', category_id: '' });

    const fetchData = async () => {
        try {
            const catRes = await fetch(`${API_URL}/api/categories`);
            if (!catRes.ok) throw new Error("Error fetching categories");
            const catData = await catRes.json();
            setCategories(catData);
            
            const allSubs = [];
            for (const cat of catData) {
                const subRes = await fetch(`${API_URL}/api/categories/${cat.id}/subcategories`);
                if (subRes.ok) {
                    const subData = await subRes.json();
                    allSubs.push(...subData.map(s => ({ ...s, category_name: cat.name })));
                }
            }
            setSubcategories(allSubs);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/categories/subcategories`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ name: newSub.name, categoryId: newSub.category_id })
            });

            if (!res.ok) throw new Error("Error creating subcategory");
            setNewSub({ name: '', category_id: '' });
            setIsModalOpen(false);
            fetchData();
        } catch (err) { alert(err.message || "Error creating subcategory"); }
    };

    const handleUpdate = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/categories/subcategories/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ name: editData.name, categoryId: editData.category_id })
            });

            if (!res.ok) throw new Error("Error updating subcategory");
            setEditingId(null);
            fetchData();
        } catch (err) { alert(err.message || "Error updating subcategory"); }
    };

    const handleDelete = async (id, catId) => {
        if (!window.confirm("Delete this subcategory?")) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/categories/subcategories/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Error deleting subcategory");
            fetchData();
        } catch (err) { alert(err.message || "Error deleting subcategory"); }
    };

    const filteredSubs = subcategories.filter(sub => 
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-700 pb-10">
            {/* Header */}
            <header className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                <div>
                    <h1 className="text-3xl lg:text-4xl text-gray-900 tracking-tighter font-bold">Subcategory Management</h1>
                    <p className="text-gray-500 mt-1 text-sm lg:text-base tracking-tight">Refine your catalog taxonomy with detailed sub-items.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 lg:px-6 py-2.5 lg:py-3 rounded-2xl text-[10px] lg:text-sm shadow-sm flex items-center justify-center gap-2 font-bold uppercase tracking-widest shrink-0">
                        <Subtitles className="w-4 h-4 lg:w-5 lg:h-5" /> {subcategories.length} Items Total
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-6 lg:px-8 py-2.5 lg:py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 flex items-center justify-center gap-2 text-[10px] lg:text-sm font-bold uppercase tracking-widest whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4 lg:w-5 lg:h-5" /> Add Sub-Item
                    </button>
                </div>
            </header>

            {/* Create Subcategory Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsModalOpen(false)}
                    ></div>
                    
                    <section className="relative w-full max-w-lg bg-white p-6 lg:p-10 rounded-[32px] lg:rounded-[40px] shadow-2xl border border-gray-100 animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6 lg:mb-10">
                            <h2 className="text-2xl lg:text-3xl text-gray-900 flex items-center gap-3 tracking-tighter leading-none font-bold">
                                <Plus className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" /> New Sub-Item
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreate} className="space-y-6 lg:space-y-8">
                            <div className="space-y-2 lg:space-y-3">
                                <label className="text-[10px] lg:text-xs text-gray-500 ml-1 flex items-center gap-1 uppercase tracking-widest leading-none font-bold">
                                    Parent Category
                                </label>
                                <select 
                                    value={newSub.category_id}
                                    onChange={(e) => setNewSub({...newSub, category_id: e.target.value})}
                                    className="w-full px-5 lg:px-6 py-3 lg:py-4 bg-gray-50 border border-gray-100 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm text-sm"
                                    required
                                >
                                    <option value="">Select a category...</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            
                            <div className="space-y-2 lg:space-y-3">
                                <label className="text-[10px] lg:text-xs text-gray-500 ml-1 flex items-center gap-1 uppercase tracking-widest leading-none font-bold">
                                    Subcategory Name
                                </label>
                                <input 
                                    value={newSub.name}
                                    onChange={(e) => setNewSub({...newSub, name: e.target.value})}
                                    className="w-full px-5 lg:px-6 py-3 lg:py-4 bg-gray-50 border border-gray-100 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm text-sm"
                                    placeholder="e.g. Wireless Earbuds" required
                                />
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-50">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-full sm:w-auto px-8 py-3 rounded-xl lg:rounded-2xl text-gray-500 hover:bg-gray-50 transition-all font-bold uppercase tracking-widest text-[10px]"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-10 py-3 rounded-xl lg:rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 font-bold uppercase tracking-widest text-[10px]">
                                    Create Sub-item
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            {/* List & Search */}
            {/* List & Search */}
            <section className="space-y-6 lg:space-y-8 animate-in slide-in-from-bottom-4 duration-1000">
                <div className="relative w-full lg:max-w-xl group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 lg:w-6 lg:h-6 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
                    <input 
                        type="search"
                        placeholder="Quick filter items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 lg:pl-16 pr-8 py-4 lg:py-5 bg-white border border-gray-100 rounded-2xl lg:rounded-[28px] focus:ring-2 focus:ring-blue-500/10 outline-none shadow-xl shadow-gray-100/50 text-sm lg:text-lg tracking-tight"
                    />
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                    {filteredSubs.map((sub) => (
                        <div key={sub.id} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 border border-blue-100 shrink-0">
                                        <Subtitles className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        {editingId === sub.id ? (
                                            <input 
                                                value={editData.name}
                                                onChange={(e) => setEditData({...editData, name: e.target.value})}
                                                className="px-3 py-1 bg-gray-50 border border-blue-200 rounded-xl outline-none text-sm w-32"
                                                autoFocus
                                            />
                                        ) : (
                                            <h3 className="text-gray-900 font-bold truncate tracking-tight">{sub.name}</h3>
                                        )}
                                        <div className="flex items-center gap-2 mt-1">
                                            {editingId === sub.id ? (
                                                <select 
                                                    value={editData.category_id}
                                                    onChange={(e) => setEditData({...editData, category_id: e.target.value})}
                                                    className="px-2 py-0.5 bg-white border border-blue-200 rounded-lg outline-none text-[10px]"
                                                >
                                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                                </select>
                                            ) : (
                                                <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-full">
                                                    {sub.category_name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                    {editingId === sub.id ? (
                                        <>
                                            <button onClick={() => handleUpdate(sub.id)} className="p-2 text-blue-600 font-bold text-[10px] uppercase">Save</button>
                                            <button onClick={() => setEditingId(null)} className="p-2 text-gray-400 font-bold text-[10px]">X</button>
                                        </>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={() => {
                                                    setEditingId(sub.id);
                                                    setEditData({ name: sub.name, category_id: sub.category_id });
                                                }}
                                                className="p-2 text-blue-500"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(sub.id, sub.category_id)} className="p-2 text-red-500">
                                                <Trash2 size={18} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredSubs.length === 0 && (
                        <div className="py-10 text-center text-gray-400 italic text-sm">No items matching your search.</div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block bg-white rounded-[32px] lg:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-10 py-6 text-sm text-gray-500 uppercase tracking-widest leading-none font-bold">Subcategory</th>
                                    <th className="px-10 py-6 text-sm text-gray-500 uppercase tracking-widest leading-none text-center font-bold">Connected To</th>
                                    <th className="px-10 py-6 text-sm text-gray-500 uppercase tracking-widest leading-none text-right font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredSubs.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-blue-50/10 transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-100 group-hover:scale-110 transition-transform shrink-0">
                                                    <Subtitles className="w-6 h-6" />
                                                </div>
                                                {editingId === sub.id ? (
                                                    <input 
                                                        value={editData.name}
                                                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                                                        className="px-4 py-2 bg-white border border-blue-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 w-full max-w-sm text-xl tracking-tight font-bold"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <span className="text-gray-900 text-2xl tracking-tighter font-bold truncate">{sub.name}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-center font-bold">
                                            {editingId === sub.id ? (
                                                <select 
                                                    value={editData.category_id}
                                                    onChange={(e) => setEditData({...editData, category_id: e.target.value})}
                                                    className="px-4 py-2 bg-white border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 text-sm leading-none"
                                                >
                                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                                </select>
                                            ) : (
                                                <span className="px-6 py-2.5 bg-gray-50 text-gray-400 rounded-full text-[10px] uppercase tracking-widest border border-gray-100 font-bold whitespace-nowrap">
                                                    {sub.category_name}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-10 py-8 text-right space-x-2">
                                            {editingId === sub.id ? (
                                                <div className="flex justify-end gap-1.5 font-bold">
                                                    <button onClick={() => handleUpdate(sub.id)} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs hover:bg-blue-700 transition-all font-bold uppercase tracking-widest shadow-sm">SAVE</button>
                                                    <button onClick={() => setEditingId(null)} className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs hover:bg-gray-200 transition-all font-bold uppercase tracking-widest border border-gray-200">CANCEL</button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end gap-1">
                                                    <button 
                                                        onClick={() => {
                                                            setEditingId(sub.id);
                                                            setEditData({ name: sub.name, category_id: sub.category_id });
                                                        }}
                                                        className="p-4 text-blue-500 hover:bg-blue-50 rounded-2xl transition-all border border-transparent hover:border-blue-100"
                                                    >
                                                        <Edit3 className="w-7 h-7" />
                                                    </button>
                                                    <button onClick={() => handleDelete(sub.id, sub.category_id)} className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100">
                                                        <Trash2 className="w-7 h-7" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

        </div>

    );
}
