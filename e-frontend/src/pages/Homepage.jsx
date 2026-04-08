import React from 'react';
import { Link } from 'react-router-dom';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white text-black font-['Poppins'] flex flex-col items-center pb-20 pt-10">
      
      {/* Hero Text Section */}
      <div className="text-center mb-12 px-4 mt-8">
        <h1 className="text-3xl md:text-[2.2rem] font-medium mb-3 tracking-wide text-black">
          Welcome to Proproducts
        </h1>
        <p className="text-gray-400 text-sm md:text-[0.95rem] leading-relaxed">
          Freshly brewed happiness in every product! <br className="hidden md:block"/>
          <span className="block mt-0.5">Get your favorite products delivered to your doorsteps.</span>
        </p>
      </div>

      {/* Sale Carousel Banner */}
      <div className="relative w-full max-w-5xl px-4 md:px-8 mb-24 group">
        <div className="w-full h-64 md:h-96 bg-red-600 rounded-xl overflow-hidden relative shadow-2xl flex items-center justify-center bg-linear-to-r from-[#ac1f2d] via-[#e52d27] to-[#ac1f2d]">
            {/* The giant SALE text covering the container */}
            <h2 className="text-8xl sm:text-[12rem] md:text-[20rem] font-bold text-white opacity-[0.85] leading-none select-none tracking-tight">
                Sale
            </h2>
        </div>

        {/* Left Arrow */}
        <button className="absolute left-6 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 bg-[#1a1a1a]/80 hover:bg-black rounded-full flex items-center justify-center transition-colors cursor-pointer group-hover:scale-105 shadow-md z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
        {/* Right Arrow */}
        <button className="absolute right-6 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 bg-[#1a1a1a]/80 hover:bg-black rounded-full flex items-center justify-center transition-colors cursor-pointer group-hover:scale-105 shadow-md z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </button>

        {/* Carousel Indicators */}
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2">
            <div className="w-8 h-[2px] bg-white cursor-pointer"></div>
            <div className="w-8 h-[2px] bg-gray-600 cursor-pointer hover:bg-gray-400 transition-colors"></div>
            <div className="w-8 h-[2px] bg-gray-600 cursor-pointer hover:bg-gray-400 transition-colors"></div>
        </div>
      </div>

      {/* Products Section */}
      <div className="w-full max-w-5xl px-4 md:px-8">
        <h2 className="text-2xl md:text-[1.35rem] font-medium mb-12 text-center text-white tracking-wide">
          Sneak peak the best sellers
        </h2>
        <div className="flex justify-end mb-12  ">
          <Link to="/products">
          <button className="w[150px]   h[50px] hover:cursor-pointer">view all 
            <svg  className="inline-block" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="straight" d="M9 5l7 7-7 7" />
            </svg></button></Link>
        </div>
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Product Card Mockup 1 */}
            <div className="bg-white rounded-t-xl overflow-hidden aspect-video relative group cursor-pointer hover:opacity-90 transition-opacity">
                {/* Placeholder Image element using a gradient/color similar to cardboard */}
                <div className="absolute inset-0 bg-[#d1a37a] pt-10">
                    <div className="w-full h-1 border-b-20 border-[#c0916a] opacity-50 transform rotate-12 scale-150"></div>
                </div>
            </div>

            {/* Product Card Mockup 2 */}
            <div className="bg-white rounded-t-xl overflow-hidden aspect-video relative group cursor-pointer hover:opacity-90 transition-opacity">
                 {/* Placeholder Image element similar to a small brown package */}
                <div className="absolute inset-x-0 top-0 bottom-10 bg-[#e7d0ac] flex flex-col items-center justify-center pt-8">
                     <div className="w-32 h-6 bg-[#f4ebd8] border-b-2 border-dashed border-gray-400 flex items-center justify-center">
                        <span className="text-[6px] text-gray-400 tracking-widest uppercase">Proproducts</span>
                     </div>
                </div>
            </div>

            {/* Product Card Mockup 3 */}
            <div className="bg-white rounded-t-xl overflow-hidden aspect-video relative group cursor-pointer hover:opacity-90 transition-opacity">
                 {/* Placeholder Image element similar to crumpled grey bag */}
                <div className="absolute inset-0 bg-[#e4e4e2] pt-4">
                     <div className="w-[70%] mx-auto h-[120%] bg-[#d0cbbd] rounded-t-sm shadow-inner flex flex-col opacity-90">
                         <div className="w-full h-4 border-b border-gray-300 opacity-50"></div>
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
