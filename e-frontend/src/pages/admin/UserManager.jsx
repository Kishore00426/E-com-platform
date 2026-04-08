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
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl text-gray-900 tracking-tighter">User Management</h1>
                    <p className="text-gray-500 mt-1">Comprehensive control over all registered accounts.</p>
                </div>
                <div className="relative w-64 group flex items-center">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredUsers.map(user => (
                    <div key={user.id} className="bg-white p-8 rounded-[40px] shadow-xl border border-gray-50 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-linear-to-br from-blue-50 to-indigo-50 rounded-3xl flex items-center justify-center text-blue-600 border border-blue-100 shadow-inner group-hover:scale-110 transition-transform">
                                    <User className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl text-gray-900 tracking-tight leading-none mb-1">{user.full_name}</h3>
                                    <p className="text-xs text-gray-400 uppercase tracking-widest">{user.username}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleUpdateRole(user.id, user.role)}
                                className={`px-4 py-2 rounded-2xl text-[10px] uppercase tracking-widest border transition-all ${user.role === 'admin' ? 'bg-purple-600 text-white border-purple-500' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'}`}
                            >
                                <span className="flex items-center gap-1.5"><Shield className="w-3 h-3" /> {user.role}</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 py-6 border-y border-gray-50">
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-300 uppercase tracking-widest flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email Address</p>
                                <p className="text-sm text-gray-700 truncate">{user.email}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-300 uppercase tracking-widest flex items-center gap-1.5"><Smartphone className="w-3 h-3" /> Contact</p>
                                <p className="text-sm text-gray-700">{user.contact || 'Not provided'}</p>
                            </div>
                            <div className="space-y-1 sm:col-span-2">
                                <p className="text-[10px] text-gray-300 uppercase tracking-widest flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Location</p>
                                <p className="text-sm text-gray-700 italic underline decoration-blue-100">{user.address || 'No residential data'}</p>
                            </div>
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${user.is_approved ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
                                <span className={`text-[10px] uppercase tracking-widest ${user.is_approved ? 'text-green-500' : 'text-red-500'}`}>{user.is_approved ? 'Verified' : 'Pending Approval'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => { setEditingUser(user); setEditForm(user); }} className="p-3.5 text-blue-500 hover:bg-blue-50 rounded-2xl transition-all">
                                    <Edit3 className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDeleteUser(user.id)} className="p-3.5 text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm hover:shadow-red-100 border border-transparent hover:border-red-100">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {editingUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[40px] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl text-gray-900 tracking-tight">Edit Profile</h2>
                            <button onClick={() => setEditingUser(null)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="space-y-5">
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-widest pl-1">Full Name</label>
                                <input type="text" value={editForm.full_name || ''} onChange={e => setEditForm({...editForm, full_name: e.target.value})} className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-widest pl-1">Username</label>
                                    <input type="text" value={editForm.username || ''} onChange={e => setEditForm({...editForm, username: e.target.value})} className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" required />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase tracking-widest pl-1">Contact</label>
                                    <input type="text" value={editForm.contact || ''} onChange={e => setEditForm({...editForm, contact: e.target.value})} className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
                                <input type="email" value={editForm.email || ''} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" required />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase tracking-widest pl-1">Address Location</label>
                                <input type="text" value={editForm.address || ''} onChange={e => setEditForm({...editForm, address: e.target.value})} className="w-full mt-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
                            </div>
                            
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setEditingUser(null)} className="px-6 py-3 rounded-2xl text-sm text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-3 rounded-2xl text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 transition-all font-medium">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>

    );
}
