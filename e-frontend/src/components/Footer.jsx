import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-stone-950 text-gray-400 py-12 border-t border-gray-800">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                    {/* Left Column */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold text-lg mb-2">Navigation</h4>
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <Link to="/about" className="hover:text-white transition-colors">About</Link>
                    </div>

                    {/* Middle Column */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold text-lg mb-2">Legal</h4>
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms and Conditions</Link>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-bold text-lg mb-2">Contact Address</h4>
                        <p>Get in Touch!

                            220 popup Street, National City, India-45896

                            (555) 123-4567

                            hello@producthouse.com</p>
                    </div>
                </div>

                {/* Bottom Copyright */}
                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Proproducts. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
