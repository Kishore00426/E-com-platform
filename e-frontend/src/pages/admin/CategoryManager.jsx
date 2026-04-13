import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Layers, ChevronDown, ChevronUp, Subtitles, X } from 'lucide-react';
import { API_URL } from '../../apiConfig';

export default function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCat, setNewCat] = useState({ name: '', slug: '' });
    const [expandedCat, setExpandedCat] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [newSub, setNewSub] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Editing State
    const [editingCatId, setEditingCatId] = useState(null);
    const [editCatData, setEditCatData] = useState({ name: '', slug: '' });
    const [editingSubId, setEditingSubId] = useState(null);
    const [editSubData, setEditSubData] = useState('');

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/api/categories`);
            const data = await res.json();
            setCategories(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchSubcategories = async (categoryId) => {
        try {
            const res = await fetch(`${API_URL}/api/categories/${categoryId}/subcategories`);
            const data = await res.json();
            setSubcategories(data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/categories`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(newCat)
            });
            if (!res.ok) throw new Error("Error creating category");
            setNewCat({ name: '', slug: '' });
            setIsModalOpen(false);
            fetchCategories();
        } catch (err) { alert(err.message || "Error creating category"); }
    };

    const handleCreateSubcategory = async (categoryId) => {
        if (!newSub) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/categories/subcategories`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ name: newSub, categoryId })
            });
            if (!res.ok) throw new Error("Error creating subcategory");
            setNewSub('');
            fetchSubcategories(categoryId);
        } catch (err) { alert(err.message || "Error creating subcategory"); }
    };

    const handleUpdateCategory = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/categories/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(editCatData)
            });
            if (!res.ok) throw new Error("Error updating category");
            setEditingCatId(null);
            fetchCategories();
        } catch (err) { alert(err.message || "Error updating category"); }
    };

    const handleUpdateSubcategory = async (id, categoryId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/categories/subcategories/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ name: editSubData, categoryId })
            });
            if (!res.ok) throw new Error("Error updating subcategory");
            setEditingSubId(null);
            fetchSubcategories(categoryId);
        } catch (err) { alert(err.message || "Error updating subcategory"); }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Delete this category? This will delete all subcategories!")) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/categories/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Error deleting category");
            fetchCategories();
        } catch (err) { alert(err.message || "Error deleting category"); }
    };

    const handleDeleteSubcategory = async (id, categoryId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/categories/subcategories/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Error deleting subcategory");
            fetchSubcategories(categoryId);
        } catch (err) { alert(err.message || "Error deleting subcategory"); }
    };

    const toggleExpand = (catId) => {
        if (expandedCat === catId) {
            setExpandedCat(null);
            setSubcategories([]);
        } else {
            setExpandedCat(catId);
            fetchSubcategories(catId);
        }
    };

    return (
        <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-700 pb-10">
            {/* Header */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-3xl lg:text-4xl text-gray-900 tracking-tighter font-medium">Category Management</h1>
                    <p className="text-gray-500 mt-1 tracking-tight text-sm lg:text-base">Organize your catalog with categories and sub-items.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="flex-1 lg:flex-none justify-center bg-blue-50 border border-blue-100 text-blue-700 px-4 lg:px-6 py-2.5 lg:py-3 rounded-2xl text-xs lg:text-sm shadow-sm flex items-center gap-2">
                        <Layers className="w-4 h-4 lg:w-5 lg:h-5" /> {categories.length} Categories
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex-1 lg:flex-none justify-center bg-blue-600 text-white px-6 lg:px-8 py-2.5 lg:py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 flex items-center gap-2 text-[10px] lg:text-sm font-bold uppercase tracking-widest"
                    >
                        <Plus className="w-4 h-4 lg:w-5 lg:h-5" /> Add Category
                    </button>
                </div>
            </header>

            {/* Create Category Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsModalOpen(false)}
                    ></div>
                    
                    <section className="relative w-full max-w-2xl bg-white p-6 lg:p-10 rounded-[32px] lg:rounded-[40px] shadow-2xl border border-gray-100 animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-8 lg:mb-10">
                            <h2 className="text-2xl lg:text-3xl text-gray-900 flex items-center gap-3 tracking-tighter">
                                <Plus className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" /> New Category
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleCreateCategory} className="space-y-6 lg:space-y-8">
                            <div className="space-y-3">
                                <label className="text-xs text-gray-500 ml-1 flex items-center gap-1 uppercase tracking-widest">Category Name</label>
                                <input 
                                    value={newCat.name}
                                    onChange={(e) => setNewCat({...newCat, name: e.target.value})}
                                    className="w-full px-5 py-3.5 lg:px-6 lg:py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                                    placeholder="e.g. Electronics" required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs text-gray-500 ml-1 flex items-center gap-1 uppercase tracking-widest">Slug (URL Friendly)</label>
                                <input 
                                    value={newCat.slug}
                                    onChange={(e) => setNewCat({...newCat, slug: e.target.value})}
                                    className="w-full px-5 py-3.5 lg:px-6 lg:py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                                    placeholder="e.g. electronics" required
                                />
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
                                    Create Category
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            {/* Categories Mobile Card View */}
            <section className="lg:hidden space-y-4 animate-in slide-in-from-bottom-4 duration-700">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 border border-blue-100 shrink-0">
                                        <Layers className="w-5 h-5" />
                                    </div>
                                    <div>
                                        {editingCatId === cat.id ? (
                                            <input 
                                                value={editCatData.name}
                                                onChange={(e) => setEditCatData({...editCatData, name: e.target.value})}
                                                className="px-3 py-1.5 bg-gray-50 border border-blue-200 rounded-xl outline-none text-sm w-32"
                                                autoFocus
                                            />
                                        ) : (
                                            <h3 className="text-gray-900 font-bold tracking-tight">{cat.name}</h3>
                                        )}
                                        <p className="text-[10px] text-gray-400 italic">/{cat.slug}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {editingCatId === cat.id ? (
                                        <>
                                            <button onClick={() => handleUpdateCategory(cat.id)} className="p-2 text-blue-600 font-bold text-[10px] uppercase underline">Save</button>
                                            <button onClick={() => setEditingCatId(null)} className="p-2 text-gray-400 font-medium text-[10px] uppercase">X</button>
                                        </>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={() => {
                                                    setEditingCatId(cat.id);
                                                    setEditCatData({ name: cat.name, slug: cat.slug });
                                                }} 
                                                className="p-2 text-blue-500"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => toggleExpand(cat.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all text-[10px] font-bold uppercase tracking-widest ${expandedCat === cat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'}`}
                            >
                                {expandedCat === cat.id ? 'Hide Sub-items' : 'View Sub-items'}
                                {expandedCat === cat.id ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                            </button>
                        </div>

                        {expandedCat === cat.id && (
                            <div className="bg-blue-50/20 border-t border-blue-50/50 p-5 space-y-4">
                                <div className="flex flex-col gap-3">
                                    <h4 className="text-[10px] font-bold text-blue-900 uppercase tracking-widest flex items-center gap-2">
                                        <Subtitles className="w-4 h-4 text-blue-500" /> New Sub-item
                                    </h4>
                                    <div className="flex gap-2">
                                        <input 
                                            value={newSub}
                                            onChange={(e) => setNewSub(e.target.value)}
                                            className="flex-1 px-4 py-2 bg-white border border-blue-100 rounded-xl outline-none shadow-sm text-xs"
                                            placeholder="Name..."
                                        />
                                        <button 
                                            onClick={() => handleCreateSubcategory(cat.id)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 shadow-md text-[10px] font-bold uppercase tracking-widest"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {subcategories.map(sub => (
                                        <div key={sub.id} className="bg-white border border-blue-50 px-3 py-2 rounded-xl shadow-sm flex items-center gap-2">
                                            {editingSubId === sub.id ? (
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        value={editSubData}
                                                        onChange={(e) => setEditSubData(e.target.value)}
                                                        className="px-2 py-1 bg-gray-50 border border-blue-200 rounded-lg outline-none text-[10px] w-20"
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleUpdateSubcategory(sub.id, cat.id)} className="text-blue-600 font-bold text-[10px] uppercase">OK</button>
                                                    <button onClick={() => setEditingSubId(null)} className="text-gray-400 font-bold text-[10px]">X</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-blue-900 text-xs font-medium">{sub.name}</span>
                                                    <div className="flex items-center gap-1">
                                                        <button 
                                                            onClick={() => {
                                                                setEditingSubId(sub.id);
                                                                setEditSubData(sub.name);
                                                            }}
                                                            className="p-1 text-blue-400"
                                                        >
                                                            <Edit3 className="w-3 h-3" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteSubcategory(sub.id, cat.id)}
                                                            className="p-1 text-red-300"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                    {subcategories.length === 0 && (
                                        <p className="w-full text-center text-blue-300/60 italic text-xs py-2">No sub-items yet.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </section>

            {/* Desktop Categories Table */}
            <section className="hidden lg:block bg-white rounded-[32px] lg:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-1000">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-10 py-6 text-sm text-gray-500 uppercase tracking-widest leading-none font-bold">Main Category</th>
                                <th className="px-10 py-6 text-sm text-gray-500 uppercase tracking-widest leading-none text-center font-bold">Slug</th>
                                <th className="px-10 py-6 text-sm text-gray-500 uppercase tracking-widest leading-none text-right font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {categories.map((cat) => (
                                <React.Fragment key={cat.id}>
                                    <tr className="hover:bg-blue-50/10 transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <button 
                                                    onClick={() => toggleExpand(cat.id)}
                                                    className={`p-2 rounded-xl transition-all ${expandedCat === cat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                                >
                                                    {expandedCat === cat.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                                                </button>
                                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-100 shrink-0">
                                                    <Layers className="w-6 h-6" />
                                                </div>
                                                {editingCatId === cat.id ? (
                                                    <input 
                                                        value={editCatData.name}
                                                        onChange={(e) => setEditCatData({...editCatData, name: e.target.value})}
                                                        className="px-4 py-2 bg-white border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 text-lg"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <span className="text-gray-900 text-xl tracking-tight leading-none truncate font-bold">{cat.name}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-center text-base">
                                            {editingCatId === cat.id ? (
                                                <input 
                                                    value={editCatData.slug}
                                                    onChange={(e) => setEditCatData({...editCatData, slug: e.target.value})}
                                                    className="px-4 py-2 bg-white border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 text-sm italic text-gray-400 mx-auto"
                                                />
                                            ) : (
                                                <span className="text-gray-400 italic">/{cat.slug}</span>
                                            )}
                                        </td>
                                        <td className="px-10 py-8 text-right space-x-2">
                                            {editingCatId === cat.id ? (
                                                <>
                                                    <button onClick={() => handleUpdateCategory(cat.id)} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs hover:bg-blue-700 transition-all font-bold uppercase tracking-widest">SAVE</button>
                                                    <button onClick={() => setEditingCatId(null)} className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs hover:bg-gray-200 transition-all font-bold uppercase tracking-widest">CANCEL</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => {
                                                            setEditingCatId(cat.id);
                                                            setEditCatData({ name: cat.name, slug: cat.slug });
                                                        }} 
                                                        className="p-4 text-blue-500 hover:bg-blue-50 rounded-2xl transition-all border border-transparent hover:border-blue-100 shadow-sm"
                                                    >
                                                        <Edit3 className="w-6 h-6" />
                                                    </button>
                                                    <button onClick={() => handleDeleteCategory(cat.id)} className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100 shadow-sm">
                                                        <Trash2 className="w-6 h-6" />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                    
                                    {expandedCat === cat.id && (
                                        <tr className="bg-blue-50/20 border-b border-blue-50/50 italic animate-in slide-in-from-top-2 duration-500">
                                            <td colSpan="3" className="px-14 py-12">
                                                <div className="space-y-8">
                                                    <div className="flex justify-between items-end border-b border-blue-100 pb-6">
                                                        <div>
                                                            <h3 className="text-2xl text-blue-900 tracking-tighter flex items-center gap-3 font-bold">
                                                                <Subtitles className="w-6 h-6 text-blue-500" /> Sub-categories
                                                            </h3>
                                                            <p className="text-blue-600/70 text-sm mt-1">Manage sub-items for the "{cat.name}" category.</p>
                                                        </div>
                                                        
                                                        <div className="flex gap-3 max-w-sm w-full">
                                                            <input 
                                                                value={newSub}
                                                                onChange={(e) => setNewSub(e.target.value)}
                                                                className="flex-1 px-6 py-3.5 bg-white border border-blue-100 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm text-sm"
                                                                placeholder="New sub-item name..."
                                                            />
                                                            <button 
                                                                onClick={() => handleCreateSubcategory(cat.id)}
                                                                className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all text-xs font-bold uppercase tracking-widest shrink-0"
                                                            >
                                                                Add Item
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4">
                                                        {subcategories.map(sub => (
                                                            <div key={sub.id} className="bg-white border border-blue-50 px-6 py-4 rounded-[24px] shadow-sm flex items-center gap-4 animate-in zoom-in-95 group/sub hover:border-blue-200 transition-all">
                                                                {editingSubId === sub.id ? (
                                                                    <div className="flex items-center gap-3">
                                                                        <input 
                                                                            value={editSubData}
                                                                            onChange={(e) => setEditSubData(e.target.value)}
                                                                            className="px-3 py-1.5 bg-gray-50 border border-blue-200 rounded-lg outline-none text-sm w-40"
                                                                            autoFocus
                                                                        />
                                                                        <button onClick={() => handleUpdateSubcategory(sub.id, cat.id)} className="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase tracking-widest">SAVE</button>
                                                                        <button onClick={() => setEditingSubId(null)} className="text-gray-400 text-xs font-bold uppercase tracking-widest">CANCEL</button>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <span className="text-blue-900 text-lg tracking-tight font-bold">{sub.name}</span>
                                                                        <div className="flex items-center gap-2 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                                                                            <button 
                                                                                onClick={() => {
                                                                                    setEditingSubId(sub.id);
                                                                                    setEditSubData(sub.name);
                                                                                }}
                                                                                className="p-1.5 text-blue-400 hover:bg-blue-50 rounded-lg transition-all"
                                                                            >
                                                                                <Edit3 className="w-4 h-4" />
                                                                            </button>
                                                                            <button 
                                                                                onClick={() => handleDeleteSubcategory(sub.id, cat.id)}
                                                                                className="p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {subcategories.length === 0 && (
                                                            <div className="w-full py-8 text-center text-blue-300/60 italic text-lg font-medium">No subcategories yet. Launch one above! ✨</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>

    );
}
