import { useEffect, useState } from 'react';
import { Save, Info, Shield, Plus, Trash2, Image, Type, Users } from 'lucide-react';
import { API_URL } from '../../apiConfig';

export default function SiteSettings() {
    const [settings, setSettings] = useState({ privacy_policy: '', terms_condition: '' });
    const [aboutPageData, setAboutPageData] = useState({
        title: '', subtitle: '', heroImage: '', sections: [], team: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Fetch public about data to populate the CMS form
                const resAbout = await fetch(`${API_URL}/api/site-settings/about`);
                if (resAbout.ok) {
                    const data = await resAbout.json();
                    setAboutPageData(data);
                }

                // Temporary mock for regular settings
                setSettings({
                    about_us: "Welcome to Proproducts! We provide the best e-commerce experience.",
                    privacy_policy: "Your privacy is our priority. We do not share your data."
                });

            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...settings,
                about_page_data: aboutPageData
            };
            const response = await fetch(`${API_URL}/api/admin/settings`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Error saving settings");
            
            alert("Settings updated successfully!");
        } catch (err) { 
            alert(err.message || "Error saving settings"); 
        } finally {
            setSaving(false);
        }
    };

    // -- Handlers for About Page CMS --
    const handleAddSection = () => {
        setAboutPageData({
            ...aboutPageData,
            sections: [...(aboutPageData.sections || []), { id: Date.now().toString(), title: '', content: '', icon: 'book' }]
        });
    };

    const handleRemoveSection = (id) => {
        setAboutPageData({
            ...aboutPageData,
            sections: aboutPageData.sections.filter(s => s.id !== id)
        });
    };

    const handleSectionChange = (id, field, value) => {
        setAboutPageData({
            ...aboutPageData,
            sections: aboutPageData.sections.map(s => s.id === id ? { ...s, [field]: value } : s)
        });
    };

    const handleAddTeam = () => {
        setAboutPageData({
            ...aboutPageData,
            team: [...(aboutPageData.team || []), { name: '', role: '' }]
        });
    };

    const handleRemoveTeam = (index) => {
        const newTeam = [...aboutPageData.team];
        newTeam.splice(index, 1);
        setAboutPageData({ ...aboutPageData, team: newTeam });
    };

    const handleTeamChange = (index, field, value) => {
        const newTeam = [...aboutPageData.team];
        newTeam[index][field] = value;
        setAboutPageData({ ...aboutPageData, team: newTeam });
    };

    if (loading) return <div className="flex items-center justify-center h-96 text-gray-400 italic">Loading Settings CMS...</div>;

    return (
        <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-700 pb-10">
            <header>
                <h1 className="text-3xl lg:text-4xl text-gray-900 tracking-tight font-bold">Site Settings</h1>
                <p className="text-gray-500 mt-1 text-sm lg:text-base">Customize your website content and policies.</p>
            </header>

            <form onSubmit={handleSave} className="space-y-6 lg:space-y-8">
                
                {/* --- About Page CMS --- */}
                <div className="bg-white p-6 lg:p-8 rounded-[32px] lg:rounded-3xl shadow-sm border border-gray-100 space-y-6 lg:space-y-8">
                    <div className="flex items-center gap-2 text-blue-600 text-lg lg:text-xl font-bold mb-4 lg:mb-6 pb-4 border-b border-gray-100">
                        <Info className="w-5 h-5 lg:w-6 lg:h-6" /> About Page CMS Configuration
                    </div>

                    {/* Hero config */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-widest pl-1 font-bold flex items-center gap-2"><Type className="w-3 h-3"/> Hero Title</label>
                            <input type="text" value={aboutPageData.title || ''} onChange={e => setAboutPageData({...aboutPageData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl lg:rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-widest pl-1 font-bold flex items-center gap-2"><Type className="w-3 h-3"/> Hero Subtitle</label>
                            <input type="text" value={aboutPageData.subtitle || ''} onChange={e => setAboutPageData({...aboutPageData, subtitle: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl lg:rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm" required />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-widest pl-1 font-bold flex items-center gap-2"><Image className="w-3 h-3"/> Hero Background Image URL</label>
                            <input type="url" value={aboutPageData.heroImage || ''} onChange={e => setAboutPageData({...aboutPageData, heroImage: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl lg:rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm" required />
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                            <label className="text-xs lg:text-sm text-gray-900 font-bold uppercase tracking-widest">Dynamic Sections</label>
                            <button type="button" onClick={handleAddSection} className="flex items-center gap-1 text-[10px] lg:text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-bold uppercase tracking-widest shadow-sm"><Plus className="w-3 h-3"/> Add Section</button>
                        </div>
                        <div className="space-y-4">
                            {aboutPageData.sections?.map((section, idx) => (
                                <div key={section.id} className="p-4 lg:p-5 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50 relative group">
                                    <button type="button" onClick={() => handleRemoveSection(section.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-100 lg:opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4"/></button>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pr-8">
                                        <div>
                                            <label className="text-[9px] lg:text-[10px] text-gray-400 uppercase tracking-widest block mb-1 font-bold">Section Title</label>
                                            <input type="text" value={section.title} onChange={e => handleSectionChange(section.id, 'title', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-gray-100 rounded-xl lg:rounded-2xl outline-none focus:border-blue-300" required />
                                        </div>
                                        <div>
                                            <label className="text-[9px] lg:text-[10px] text-gray-400 uppercase tracking-widest block mb-1 font-bold">Icon Style</label>
                                            <select value={section.icon} onChange={e => handleSectionChange(section.id, 'icon', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-gray-100 rounded-xl lg:rounded-2xl outline-none focus:border-blue-300">
                                                <option value="rocket">Rocket</option>
                                                <option value="book">Book</option>
                                                <option value="heart">Heart</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[9px] lg:text-[10px] text-gray-400 uppercase tracking-widest block mb-1 font-bold">Paragraph Content</label>
                                        <textarea value={section.content} onChange={e => handleSectionChange(section.id, 'content', e.target.value)} className="w-full px-3 py-2 text-sm bg-white border border-gray-100 rounded-xl lg:rounded-2xl outline-none focus:border-blue-300 min-h-[80px]" required></textarea>
                                    </div>
                                </div>
                            ))}
                            {(!aboutPageData.sections || aboutPageData.sections.length === 0) && <p className="text-xs text-gray-400 italic">No sections added yet.</p>}
                        </div>
                    </div>

                    {/* Team */}
                    <div className="pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                            <label className="text-xs lg:text-sm text-gray-900 font-bold uppercase tracking-widest flex items-center gap-2"><Users className="w-4 h-4"/> Team Members</label>
                            <button type="button" onClick={handleAddTeam} className="flex items-center gap-1 text-[10px] lg:text-xs bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors font-bold uppercase tracking-widest shadow-sm"><Plus className="w-3 h-3"/> Add Member</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {aboutPageData.team?.map((member, idx) => (
                                <div key={idx} className="p-4 border border-gray-100 rounded-2xl bg-white shadow-sm relative">
                                    <button type="button" onClick={() => handleRemoveTeam(idx)} className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1.5 hover:bg-red-500 hover:text-white transition-all shadow-sm"><Trash2 className="w-3 h-3"/></button>
                                    <div className="space-y-3">
                                        <div>
                                            <input type="text" placeholder="Full Name" value={member.name} onChange={e => handleTeamChange(idx, 'name', e.target.value)} className="w-full px-3 py-2 text-sm bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-purple-300" required />
                                        </div>
                                        <div>
                                            <input type="text" placeholder="Role (e.g. CEO)" value={member.role} onChange={e => handleTeamChange(idx, 'role', e.target.value)} className="w-full px-3 py-2 text-sm bg-gray-50 border border-transparent rounded-xl outline-none focus:bg-white focus:border-purple-300 text-purple-600 font-bold uppercase tracking-widest text-[10px]" required />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!aboutPageData.team || aboutPageData.team.length === 0) && <p className="text-xs text-gray-400 italic col-span-full">No team members added.</p>}
                        </div>
                    </div>
                </div>

                {/* Legacy Policies */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <div className="bg-white p-6 lg:p-8 rounded-[32px] lg:rounded-3xl shadow-sm border border-gray-100 space-y-4">
                        <div className="flex items-center gap-2 text-gray-600 text-lg mb-2 font-bold">
                            <Shield className="w-5 h-5 text-blue-600" /> Privacy Policy
                        </div>
                        <textarea 
                            value={settings.privacy_policy}
                            onChange={(e) => setSettings({...settings, privacy_policy: e.target.value})}
                            className="w-full px-5 py-4 lg:px-6 lg:py-4 bg-gray-50 border border-gray-100 rounded-2xl lg:rounded-3xl min-h-[120px] lg:min-h-[180px] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all leading-relaxed text-sm"
                            placeholder="Enter your privacy policy..."
                        ></textarea>
                    </div>

                    <div className="bg-white p-6 lg:p-8 rounded-[32px] lg:rounded-3xl shadow-sm border border-gray-100 space-y-4">
                        <div className="flex items-center gap-2 text-gray-600 text-lg mb-2 font-bold">
                            <Shield className="w-5 h-5 text-blue-600" /> Terms and Conditions
                        </div>
                        <textarea 
                            value={settings.terms_condition}
                            onChange={(e) => setSettings({...settings, terms_condition: e.target.value})}
                            className="w-full px-5 py-4 lg:px-6 lg:py-4 bg-gray-50 border border-gray-100 rounded-2xl lg:rounded-3xl min-h-[120px] lg:min-h-[180px] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all leading-relaxed text-sm"
                            placeholder="Enter your terms and conditions..."
                        ></textarea>
                    </div>
                </div>

                <div className="flex justify-end pb-10">
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="w-full sm:w-auto bg-blue-600 text-white px-10 lg:px-12 py-4 rounded-2xl lg:rounded-3xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save All Settings'}
                    </button>
                </div>
            </form>
        </div>

    );
}
