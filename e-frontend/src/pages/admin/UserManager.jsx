import React, { useEffect, useState } from 'react';
import { Trash2, Edit3, User, Mail, Shield, Smartphone, MapPin, Search, X } from 'lucide-react';
import { API_URL } from '../../apiConfig';

export default function UserManager() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ full_name: '', username: '', email: '', contact: '', address: '' });

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/users/${editingUser.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(editForm)
            });
            if (!res.ok) throw new Error("Error updating user");
            
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            alert(err.message || "Error updating user");
        }
    };

    const handleUpdateRole = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (!window.confirm(`Change user role to ${newRole}?`)) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/users/${id}/role`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ role: newRole })
            });

            if (!res.ok) throw new Error("Error updating role");
            fetchUsers();
        } catch (err) { 
            alert(err.message || "Error updating role"); 
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Delete this user permanently? This action cannot be undone.")) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Error deleting user");
            fetchUsers();
        } catch (err) { 
            alert(err.message || "Error deleting user"); 
        }
    };

    const filteredUsers = users.filter(u => 
        u.role !== 'admin' && (
            u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.username?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    if (loading) return <div className="flex items-center justify-center h-96 text-gray-400 italic">Loading User Database...</div>;

    return (
        <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-700 pb-10">
            <header className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                <div>
                    <h1 className="text-3xl lg:text-4xl text-gray-900 tracking-tighter font-bold">User Management</h1>
                    <p className="text-gray-500 mt-1 text-sm lg:text-base">Comprehensive control over registered accounts.</p>
                </div>
                <div className="relative w-full lg:w-72 group flex items-center">
                    <Search className="absolute left-4 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search profiles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/10 outline-none text-sm"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                {filteredUsers.map(user => (
                    <div key={user.id} className="bg-white p-6 lg:p-10 rounded-[32px] lg:rounded-[48px] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-between hover:shadow-blue-200/40 transition-all duration-500 group hover:-translate-y-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-blue-50/50 to-transparent -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                        
                        <div className="relative z-10 flex items-start justify-between">
                            <div className="flex items-center gap-4 lg:gap-8">
                                <div className="w-14 h-14 lg:w-20 lg:h-20 bg-linear-to-br from-blue-600 to-indigo-600 rounded-2xl lg:rounded-[32px] flex items-center justify-center text-white shadow-xl shadow-blue-200 group-hover:rotate-6 transition-all shrink-0">
                                    <User className="w-7 h-7 lg:w-10 lg:h-10" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-xl lg:text-3xl text-gray-900 tracking-tight leading-none mb-2 truncate font-black">{user.full_name}</h3>
                                    <p className="text-[10px] lg:text-xs text-gray-400 uppercase tracking-widest font-bold truncate">@{user.username}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleUpdateRole(user.id, user.role)}
                                className={`px-4 lg:px-6 py-2 lg:py-3 rounded-2xl lg:rounded-3xl text-[9px] lg:text-[11px] font-black uppercase tracking-widest border transition-all shrink-0 shadow-sm ${user.role === 'admin' ? 'bg-purple-600 text-white border-purple-500 shadow-purple-200' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:border-gray-200'}`}
                            >
                                <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> {user.role}</span>
                            </button>
                        </div>

                        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10 mt-8 lg:mt-12 py-8 lg:py-10 border-y border-gray-50">
                            <div className="space-y-2 min-w-0">
                                <p className="text-[10px] lg:text-xs text-gray-300 font-black uppercase tracking-widest flex items-center gap-2"><Mail className="w-3.5 h-3.5 shrink-0 text-blue-400" /> Secure Email</p>
                                <p className="text-sm lg:text-lg text-gray-700 font-bold truncate">{user.email}</p>
                            </div>
                            <div className="space-y-2 min-w-0">
                                <p className="text-[10px] lg:text-xs text-gray-300 font-black uppercase tracking-widest flex items-center gap-2"><Smartphone className="w-3.5 h-3.5 shrink-0 text-green-400" /> Phone Link</p>
                                <p className="text-sm lg:text-lg text-gray-700 font-bold truncate">{user.contact || 'Not linked'}</p>
                            </div>
                            <div className="space-y-2 sm:col-span-2 min-w-0">
                                <p className="text-[10px] lg:text-xs text-gray-300 font-black uppercase tracking-widest flex items-center gap-2"><MapPin className="w-3.5 h-3.5 shrink-0 text-red-400" /> Primary Residence</p>
                                <p className="text-sm lg:text-lg text-gray-700 font-bold italic truncate leading-tight">{user.address || 'No residential data provided'}</p>
                            </div>
                        </div>

                        <div className="relative z-10 mt-8 lg:mt-10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full shadow-sm ${user.is_approved ? 'bg-green-500' : 'bg-red-500 animate-pulse ring-4 ring-red-50'}`} />
                                <span className={`text-[10px] lg:text-xs uppercase tracking-widest font-black ${user.is_approved ? 'text-green-600' : 'text-red-500'}`}>{user.is_approved ? 'Identity Verified' : 'Compliance Pending'}</span>
                            </div>
                            <div className="flex items-center gap-2 lg:gap-4">
                                <button onClick={() => { setEditingUser(user); setEditForm(user); }} className="p-3 lg:p-5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-2xl lg:rounded-3xl transition-all shadow-sm">
                                    <Edit3 className="w-5 h-5 lg:w-7 lg:h-7" />
                                </button>
                                <button onClick={() => handleDeleteUser(user.id)} className="p-3 lg:p-5 text-red-500 bg-red-50 hover:bg-red-600 hover:text-white rounded-2xl lg:rounded-3xl transition-all shadow-sm border border-transparent">
                                    <Trash2 className="w-5 h-5 lg:w-7 lg:h-7" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            {editingUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] lg:rounded-[40px] p-6 lg:p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6 lg:mb-8">
                            <h2 className="text-xl lg:text-2xl text-gray-900 tracking-tight font-bold">Edit Profile</h2>
                            <button onClick={() => setEditingUser(null)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="space-y-4 lg:space-y-5">
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest pl-1 font-bold">Full Name</label>
                                <input type="text" value={editForm.full_name || ''} onChange={e => setEditForm({...editForm, full_name: e.target.value})} className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl lg:rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm" required />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-gray-500 uppercase tracking-widest pl-1 font-bold">Username</label>
                                    <input type="text" value={editForm.username || ''} onChange={e => setEditForm({...editForm, username: e.target.value})} className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl lg:rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm" required />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 uppercase tracking-widest pl-1 font-bold">Contact</label>
                                    <input type="text" value={editForm.contact || ''} onChange={e => setEditForm({...editForm, contact: e.target.value})} className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl lg:rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest pl-1 font-bold">Email Address</label>
                                <input type="email" value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl lg:rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm" required />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 uppercase tracking-widest pl-1 font-bold">Address Location</label>
                                <input type="text" value={editForm.address || ''} onChange={e => setEditForm({...editForm, address: e.target.value})} className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl lg:rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm" />
                            </div>
                            
                            <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
                                <button type="button" onClick={() => setEditingUser(null)} className="w-full sm:w-auto px-6 py-3 rounded-xl lg:rounded-2xl text-sm text-gray-500 hover:bg-gray-50 transition-colors uppercase font-bold tracking-widest text-[10px]">Cancel</button>
                                <button type="submit" className="w-full sm:w-auto px-8 py-3 rounded-xl lg:rounded-2xl text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 transition-all font-bold uppercase tracking-widest text-[10px]">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>


    );
}
