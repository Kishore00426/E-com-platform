import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { API_URL } from '../apiConfig';
import { useCart } from '../context/CartContext';

export default function AIChatbot() {
    const navigate = useNavigate();
    const { addToCart, clearCart } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi there! I\'m your AI assistant. How can I help you shop today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const processActions = async (text) => {
        // 1. ADD TO CART: [[ADD_TO_CART:id]]
        const addMatch = text.match(/\[\[ADD_TO_CART:([a-f\d-]+)\]\]/);
        if (addMatch) {
            const productId = addMatch[1];
            try {
                const res = await fetch(`${API_URL}/api/products/${productId}`);
                const product = await res.json();
                if (product) {
                    await addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.images?.[0]
                    });
                    console.log(`AI Action: Added ${product.name} to cart.`);
                }
            } catch (err) {
                console.error("Failed to execute AI Add To Cart:", err);
            }
        }

        // 2. CLEAR CART: [[CLEAR_CART]]
        if (text.includes('[[CLEAR_CART]]')) {
            await clearCart();
        }

        // 3. CHECKOUT: [[GO_TO_CHECKOUT]]
        if (text.includes('[[GO_TO_CHECKOUT]]')) {
            navigate('/checkout');
        }

        // Return cleaned text without tags
        return text.replace(/\[\[.*?\]\]/g, '').trim();
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: messages.concat(userMessage).slice(-10)
                })
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            // Process any actions and clean the message
            const cleanedMessage = await processActions(data.message);
            setMessages(prev => [...prev, { role: 'assistant', content: cleanedMessage }]);
        } catch (err) {
            console.error("Chat Error:", err);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: "I'm having trouble connecting to my brain right now. Please try again in a moment." 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-[9999] font-sans">
            {/* Chat Bubble Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 active:scale-90 ${
                    isOpen ? 'bg-red-500 rotate-90' : 'bg-black hover:bg-blue-600'
                }`}
            >
                {isOpen ? <X className="text-white" size={24} /> : <MessageSquare className="text-white" size={24} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                    </span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 sm:bottom-20 right-0 w-[calc(100vw-2rem)] sm:w-[400px] h-[calc(100vh-6rem)] sm:h-[600px] bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header */}
                    <div className="p-4 sm:p-6 bg-black text-white flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Bot size={18} className="text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm tracking-tight">Shopping Assistant</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Powered by Gemini 1.5 Flash</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                        {messages.map((msg, i) => (
                            <div 
                                key={i} 
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                            >
                                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                                        msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-100'
                                    }`}>
                                        {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                                    </div>
                                    <div className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-blue-600 text-white rounded-tr-none' 
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start animate-in fade-in duration-300">
                                <div className="flex gap-3 max-w-[85%]">
                                    <div className="w-8 h-8 rounded-xl bg-white text-gray-600 border border-gray-100 flex items-center justify-center shrink-0">
                                        <Bot size={14} />
                                    </div>
                                    <div className="bg-white border border-gray-100 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin text-blue-600" />
                                        <span className="text-xs font-bold text-gray-400  tracking-widest">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 sm:p-6 bg-white border-t border-gray-100">
                        <form onSubmit={handleSend} className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-4 sm:pl-6 pr-12 sm:pr-14 py-3 sm:py-4 text-xs sm:text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="absolute right-2 p-2.5 bg-black text-white rounded-xl hover:bg-blue-600 disabled:opacity-30 disabled:hover:bg-black transition-all active:scale-95"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                        <div className="mt-3 flex items-center justify-center gap-1.5 opacity-40">
                            <Sparkles size={10} className="text-blue-600" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">We ensure your data stays private</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
