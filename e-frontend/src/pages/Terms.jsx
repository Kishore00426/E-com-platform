import React, { useState, useEffect } from 'react';
import { API_URL } from '../apiConfig';

export default function TermsCondition() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTermsCondition = async () => {
      try {
        const res = await fetch(`${API_URL}/api/site-settings/terms`);
        if (res.ok) {
          const data = await res.json();
          setContent(data.content);
        }
      } catch (error) {
        console.error("Failed to fetch terms and conditions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTermsCondition();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-100 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-gray-200 border border-stone-800 rounded-3xl p-8 md:p-12">
        <h1 className="text-4xl font-bold mb-8 text-black">Terms and Conditions</h1>
        
        {loading ? (
            <div className="animate-pulse flex flex-col gap-4">
                <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                <div className="h-4 bg-stone-200 rounded w-full"></div>
                <div className="h-4 bg-stone-200 rounded w-5/6"></div>
            </div>
        ) : (
            <div className="space-y-8 text-gray-800 leading-relaxed whitespace-pre-wrap">
              {content || "No terms and conditions configured yet."}
            </div>
        )}
        
        <div className="mt-12 pt-8 border-t border-stone-800 text-sm text-stone-900">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
      </div>
    </div>
  );
}
