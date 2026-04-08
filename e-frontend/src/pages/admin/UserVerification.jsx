import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Mail, User, ShieldCheck } from 'lucide-react';

export default function UserVerification() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:4200/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error("User fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const toggleApproval = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:4200/api/admin/users/${id}/approve`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ is_approved: !currentStatus })
            });
            
            if (!res.ok) throw new Error("Error updating status");
            
            fetchUsers();
        } catch (err) {
            alert(err.message || "Error updating status");
        }
    };

    if (loading) return <div className="flex items-center justify-center h-96 text-gray-500 italic">Checking Approvals...</div>;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl text-gray-900 tracking-tighter">User Approval</h1>
                    <p className="text-gray-500 mt-1">Instantly approve or revoke platform access.</p>
                </div>
                <div className="bg-purple-50 border border-purple-100 text-purple-700 px-6 py-2.5 rounded-2xl text-sm shadow-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Approval Queue
                </div>
            </header>

            <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100 uppercase tracking-widest text-[10px] text-gray-400">
                        <tr>
                            <th className="px-10 py-6">IDENTIFIER</th>
                            <th className="px-10 py-6 text-center">CURRENT STATUS</th>
                            <th className="px-10 py-6 text-right">SYSTEM ACTION</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.filter(u => u.role !== 'admin').map((user) => (
                            <tr key={user.id} className="hover:bg-blue-50/10 transition-all duration-300 group">
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400 border border-gray-100 group-hover:bg-white group-hover:shadow-md transition-all">
                                            <User className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <p className="text-gray-900 text-xl tracking-tight leading-none">{user.full_name}</p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-2">
                                                <Mail className="w-3.5 h-3.5 text-blue-400" /> {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider mb-1 ${user.is_approved ? 'bg-green-100 text-green-700 shadow-sm border border-green-200' : 'bg-red-100 text-red-700 shadow-sm border border-red-200'}`}>
                                            {user.is_approved ? 'Verified' : 'Access Denied'}
                                        </div>
                                        <p className={`text-[10px] ${user.is_approved ? 'text-green-500' : 'text-red-400'}`}>
                                            {user.is_approved ? 'Active in System' : 'Awaiting admin'}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-10 py-8 text-right">
                                    <button 
                                        onClick={() => toggleApproval(user.id, user.is_approved)}
                                        className={`flex items-center gap-2 ml-auto px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md group-hover:shadow-lg active:scale-95
                                            ${user.is_approved 
                                                ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100' 
                                                : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'}`}
                                    >
                                        {user.is_approved ? <XCircle className="w-4 h-4"/> : <CheckCircle className="w-4 h-4"/>}
                                        {user.is_approved ? 'Unverify' : 'Approve Now'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <p className="text-center text-xs text-gray-400 mt-6 tracking-widest uppercase italic">
                Manage full user accounts, roles, and deletions inside the "Users" tab.
            </p>
        </div>
    );
}
