import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../apiConfig';

export default function About() {
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const res = await fetch(`${API_URL}/api/site-settings/about`);
                if (!res.ok) throw new Error("Failed to fetch about data");
                const data = await res.json();
                setAboutData(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAboutData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-white text-gray-900 font-['Poppins'] flex items-center justify-center">
                <p className="text-xl text-gray-400 italic animate-pulse">Loading About Us...</p>
            </div>
        );
    }
    
    if (!aboutData) {
        return <div className="min-h-screen bg-white text-gray-900 font-['Poppins'] flex items-center justify-center text-red-500">Could not load content.</div>;
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 font-['Poppins']">
            {/* Hero Section */}
            <div className="relative h-96 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src={aboutData.heroImage} 
                        alt="Retail Storefront" 
                        className="w-full h-full object-cover opacity-60 grayscale"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/40 to-white"></div>
                </div>
                
                <div className="relative z-10 text-center px-4 max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-black">
                        {aboutData.title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 font-light italic">
                        "{aboutData.subtitle}"
                    </p>
                </div>
            </div>

            {/* Dynamic Sections from CMS */}
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {aboutData.sections.map((section) => (
                        <div key={section.id} className="space-y-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                                {section.icon === 'rocket' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.95.12-3.5-1.5-4.5z"/><path d="m12 15-3-3m1.35-4.35L11.7 6.3m5.4 7.2L18.45 15M21 3l-6 6"/><path d="M7.02 7.35a3.5 3.5 0 1 1 5.25 4.91L5.35 20.25a2 2 0 0 1-2.82-2.82l7.92-7.92a3.5 3.5 0 1 1 4.91 5.25"/></svg>
                                )}
                                {section.icon === 'book' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                                )}
                                {section.icon === 'heart' && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 tracking-wide">
                                {section.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-[0.95rem]">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Team Section */}
                <div className="mt-32 text-center">
                    <h2 className="text-3xl font-bold mb-16 text-gray-900 tracking-wide">Meet the Visionaries</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {aboutData.team.map((member, index) => (
                            <div key={index} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all duration-300">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                                    {member.name.charAt(0)}
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h4>
                                <p className="text-blue-600 text-sm font-medium uppercase tracking-widest">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-200 py-20 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-black mb-6">Want to be part of the journey?</h2>
                    <p className="text-gray-600 mb-10 text-lg">We're always looking for new partnerships and passionate people.</p>
                   <Link to="/contact">
                     <button className="bg-black text-white px-10 py-4 rounded-full font-bold hover:scale-105 active:scale-95 transition-all duration-200">
                        Contact Us
                    </button></Link>
                </div>
            </div>
        </div>
    );
}
