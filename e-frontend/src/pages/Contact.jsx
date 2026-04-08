import React from 'react';

export default function Contact() {
    return (
        <div className="min-h-screen bg-black text-white font-['Poppins'] flex flex-col items-center py-20 px-6">
            <h1 className="text-3xl font-bold mb-20 text-center tracking-wide">Contact Us</h1>

            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
                {/* Left Column: Get in Touch */}
                <div className="space-y-10">
                    <h2 className="text-xl font-bold mb-8">Get in Touch!</h2>
                    
                    <div className="flex items-start gap-4">
                        <div className="mt-1 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 7v5l3 3"/></svg>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-[200px]">
                                220 popup Street, National City, India-45896
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        </div>
                        <p className="text-gray-400 text-sm">(555) 123-4567</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        </div>
                        <p className="text-gray-400 text-sm">hello@producthouse.com</p>
                    </div>
                </div>

                {/* Right Column: Message Form */}
                <div className="space-y-8 flex flex-col items-center md:items-start">
                    <h2 className="text-xl font-bold mb-4 w-full">Send us a Message</h2>
                    
                    <form className="w-full space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 ml-1">Name</label>
                            <input 
                                type="text" 
                                className="w-full bg-[#1c1c1f] border border-gray-800 rounded-lg p-3.5 focus:outline-none focus:border-gray-500 transition-colors"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 ml-1">Email</label>
                            <input 
                                type="email" 
                                className="w-full bg-[#1c1c1f] border border-gray-800 rounded-lg p-3.5 focus:outline-none focus:border-gray-500 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 ml-1">Message</label>
                            <textarea 
                                rows="5"
                                className="w-full bg-[#1c1c1f] border border-gray-800 rounded-lg p-3.5 focus:outline-none focus:border-gray-500 transition-colors resize-none shadow-inner"
                            ></textarea>
                        </div>

                        <div className="pt-4 flex justify-center md:justify-start">
                            <button className="text-white hover:text-gray-300 hover:bg-zinc-800 transition-colors font-medium text-lg flex border border-gray-800 rounded-lg p-3.5  items-center gap-2">
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
