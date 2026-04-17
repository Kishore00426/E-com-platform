import supabase from '../config/supabaseClient.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Controller to handle AI Chat using Gemini (Primary) or local Ollama (Fallback)
export const chatWithAI = async (req, res) => {
    const { messages } = req.body; // Array of { role: 'user', content: '...' }

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format. Expected an array." });
    }

    try {
        // 1. Fetch current product data for context
        const { data: products, error } = await supabase
            .from('products')
            .select('id, name, description, price, stock, categories(name), subcategories(name)');

        if (error) throw error;

        // 2. Prepare the context string
        const productContext = products.map(p => 
            `- ${p.name} (ID: ${p.id}): ₹${p.price}. ${p.description || "No description"}. Category: ${p.categories?.name || 'N/A'}. Stock: ${p.stock > 0 ? 'In Stock' : 'Out of Stock'}`
        ).join('\n');

        // 3. Construct System Prompt
        const systemPrompt = `You are a helpful AI Shopping Assistant for an e-commerce store. 
Your goal is to help users find products, answer questions about inventory, and provide a great shopping experience.

Here is the current product list in our store:
${productContext}

STRICT ACTION RULES:
You can ONLY perform actions by using these exact tags:
- Add to cart: [[ADD_TO_CART:product_id]]
- Clear cart: [[CLEAR_CART]]
- Open checkout page: [[GO_TO_CHECKOUT]]

CRITICAL CONSTRAINTS:
1. NEVER hallucinate order IDs (e.g., #1234), shipping dates, or successful payment. You CANNOT process orders yourself.
2. If a user wants to buy something, you must first [[ADD_TO_CART:id]] and then suggest [[GO_TO_CHECKOUT]]. 
3. You can only "take the user to the checkout page" using the tag. You cannot complete the checkout for them.
4. Do not lie about the cart status. If you use the [[ADD_TO_CART:id]] tag, tell the user "I've added that to your cart."
5. Be concise. Do not talk about shipping or delivery unless specifically asked about store policies.
6. Reference prices in INR (₹) only.
7. Only use the IDs provided in the list above.`;

        // 4. Determine which AI service to use
        const GEMINI_KEY = process.env.GEMINI_API_KEY;

        if (GEMINI_KEY) {
            console.log("Using Google Gemini API for Chat...");
            const genAI = new GoogleGenerativeAI(GEMINI_KEY);
            
            // Convert OpenAI-style messages to Gemini-style history
            let firstUserIndex = messages.findIndex(msg => msg.role === 'user');
            if (firstUserIndex === -1) firstUserIndex = 0;

            const history = messages.slice(firstUserIndex, -1).map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }));

            const filteredHistory = history.filter((msg, index) => {
                if (index === 0) return msg.role === 'user';
                return msg.role !== history[index - 1].role;
            });

            const lastMessage = messages[messages.length - 1].content;

            // Try different models in case one is not available
            const modelsToTry = [
                "gemini-1.5-flash", 
                "gemini-1.5-flash-8b", 
                "gemini-1.5-flash-latest",
                "gemini-1.5-pro",
                "gemini-pro"
            ];
            let lastErr = null;

            for (const modelName of modelsToTry) {
                try {
                    console.log(`Attempting chat with model: ${modelName}`);
                    
                    const config = { model: modelName };
                    // Only 1.5 versions support systemInstruction directly
                    if (modelName.includes("1.5")) {
                        config.systemInstruction = systemPrompt;
                    }

                    const model = genAI.getGenerativeModel(config);
                    
                    // For gemini-pro (1.0), we need to prepend the system prompt to the first message
                    let activeHistory = [...filteredHistory];
                    let activeLastMessage = lastMessage;

                    if (!modelName.includes("1.5")) {
                        activeLastMessage = `System Instructions: ${systemPrompt}\n\nUser Question: ${lastMessage}`;
                    }

                    const chat = model.startChat({ history: activeHistory });
                    const result = await chat.sendMessage(activeLastMessage);
                    const response = await result.response;
                    const text = response.text();

                    return res.json({ message: text });

                } catch (err) {
                    console.error(`Failed with ${modelName}:`, err.message);
                    lastErr = err;
                    // If we get an auth error, we should stop immediately
                    if (err.message.includes("401") || err.message.includes("403") || err.message.includes("API_KEY_INVALID")) {
                        throw new Error("Invalid API Key. Please check your Gemini API key in Google AI Studio.");
                    }
                    if (err.message.includes("404")) continue; // Try next model
                    throw err; 
                }
            }
            throw lastErr;

        } else {
            // FALLBACK: Local Ollama
            console.warn("GEMINI_API_KEY not found. Falling back to local Ollama...");
            
            const response = await fetch('http://127.0.0.1:11434/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama3:latest',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...messages
                    ],
                    stream: false
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(`Ollama API Error: ${errData.error || response.statusText}`);
            }

            const data = await response.json();
            return res.json({ message: data.message.content });
        }

    } catch (err) {
        console.error("AI Chat Error:", err);
        const isGemini = !!process.env.GEMINI_API_KEY;
        res.status(500).json({ 
            error: isGemini 
                ? "Failed to connect to Gemini API. Check your internet or API key." 
                : "Failed to connect to local AI service. Make sure Ollama is running and has 'llama3' pulled." 
        });
    }
};
