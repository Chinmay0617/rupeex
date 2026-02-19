import express from 'express';
import axios from 'axios';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { Transaction, CATEGORIES, AdvisorMessage } from "../src/types.js";
import auth from '../middleware/auth.js';

const router = express.Router();

const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenerativeAI(apiKey);
};

// --- Groq Helper ---
// --- Groq Helper ---
const callGroqAPI = async (systemPrompt: string, userPrompt: string) => {
    const apiKey = process.env.GROQ_API_KEY?.trim();
    if (!apiKey) throw new Error("No Groq API Key");

    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: "llama-3.3-70b-versatile", // Using the latest supported model
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.choices[0].message.content;
    } catch (error: any) {
        if (error.response) {
            console.error("Groq API Error Details:", JSON.stringify(error.response.data, null, 2));
        }
        throw error;
    }
};

router.post('/parse-transaction', auth, async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const systemPrompt = `You are an expert at parsing financial transactions from natural language. From the user's text, extract the amount, description, category, and type (income or expense). The possible categories are: ${CATEGORIES.join(', ')}. Return ONLY raw JSON data. No markdown.`;

    try {
        let jsonString = "";

        // Priority 1: Groq (Llama 3) - Fast & Free
        if (process.env.GROQ_API_KEY) {
            console.log('Using AI Provider: Groq (Llama 3)');
            jsonString = await callGroqAPI(systemPrompt, text);
        }
        // Priority 2: Google Gemini (1.5 Flash)
        else if (process.env.GEMINI_API_KEY) {
            console.log('Using AI Provider: Gemini 1.5 Flash');
            const genAI = getGenAI();
            if (genAI) {
                const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: systemPrompt });
                const result = await model.generateContent(text);
                jsonString = result.response.text();
            }
        } else {
            throw new Error("No AI API Keys found");
        }

        // Clean and Parse
        jsonString = jsonString.replace(/```json\n?|\n?```/g, '').trim();
        const jsonResponse = JSON.parse(jsonString);

        // Add source tag
        res.json({ ...jsonResponse, source: process.env.GROQ_API_KEY ? 'AI_LLAMA3' : 'AI_GEMINI' });

    } catch (error: any) {
        console.log(`AI Provider Failed: ${error.message || 'Unknown'}. Switching to Offline Mode.`);

        // Fallback: Local Regex Parsing
        const amountMatch = text.match(/[\d,]+\.?\d{0,2}/);
        const amount = amountMatch ? parseFloat(amountMatch[0].replace(/,/g, '')) : 0;

        let category = 'Misc';
        const lowerText = text.toLowerCase();
        for (const cat of CATEGORIES) {
            if (lowerText.includes(cat.toLowerCase()) ||
                (cat === 'Food & Dining' && (lowerText.includes('food') || lowerText.includes('eat') || lowerText.includes('dinner'))) ||
                (cat === 'Transport' && (lowerText.includes('cab') || lowerText.includes('uber') || lowerText.includes('fuel')))
            ) {
                category = cat;
                break;
            }
        }

        res.json({
            amount,
            description: text,
            category,
            type: 'EXPENSE',
            confidence: 0.5,
            source: 'OFFLINE_NLP'
        });
    }
});

router.post('/ask-advisor', auth, async (req, res) => {
    const { query, history, messages } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });

    const systemPrompt = "You are the RupeeX AI Financial Advisor. Your goal is to provide insightful, concise, and actionable financial advice based on the user's transaction history and their questions. Be sharp, professional, and helpful.";
    const data = (history as Transaction[]).slice(-30).map(t => `${t.date}: ${t.description} ${t.amount} (${t.category})`).join('\n');
    const chatHistory = (messages as AdvisorMessage[]).slice(-5).map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
    const userPrompt = `Recent Transactions:\n${data}\n\nChat History:\n${chatHistory}\n\nUser Query: "${query}"\n\nProvide your analysis and advice:`;

    try {
        let responseText = "";

        if (process.env.GROQ_API_KEY) {
            responseText = await callGroqAPI(systemPrompt, userPrompt);
        } else if (process.env.GEMINI_API_KEY) {
            const genAI = getGenAI();
            if (genAI) {
                const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash', systemInstruction: systemPrompt });
                const result = await model.generateContent(userPrompt);
                responseText = result.response.text();
            }
        } else {
            throw new Error("No AI API Keys found");
        }

        res.send(responseText);
    } catch (error: any) {
        console.log(`Advisor Error: ${error.message}. Returning offline message.`);
        res.send("I am currently operating in Offline Mode. I can't access live AI analysis right now, but your local transaction data is secure. Please configure a valid API key (Groq or Gemini) in your settings to enable full advisory capabilities.");
    }
});

router.post('/scan-receipt', auth, async (req, res) => {
    const { image, mimeType } = req.body;
    if (!image || !mimeType) {
        return res.status(400).json({ error: 'Image and mimeType are required' });
    }

    try {
        console.log('Step 1: Sending image to OCR.space...');

        // Sanitize base64 string: Ensure we don't double-header or send raw without header
        let base64Payload = image;
        if (!image.startsWith('data:')) {
            base64Payload = `data:${mimeType};base64,${image}`;
        }

        const formData = new URLSearchParams();
        formData.append('base64Image', base64Payload);
        formData.append('apikey', 'K89326646388957');
        formData.append('language', 'eng');
        formData.append('isTable', 'true');

        const ocrResponse = await axios.post('https://api.ocr.space/parse/image', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 25000 // 25s timeout
        });

        if (ocrResponse.data.IsErroredOnProcessing) {
            console.error('OCR.space Error:', ocrResponse.data.ErrorMessage);
            const msg = ocrResponse.data.ErrorMessage?.[0] || '';
            if (msg.includes('valid base64')) {
                throw new Error('Invalid image format. Please properly crop and upload a clear valid image file (JPG/PNG).');
            }
            throw new Error('Unable to read receipt. Please ensure the image is clear and text is visible.');
        }

        const parsedResults = ocrResponse.data.ParsedResults;
        if (!parsedResults || parsedResults.length === 0 || !parsedResults[0].ParsedText) {
            throw new Error('No text found in the image by OCR.space');
        }

        const ocrText = parsedResults[0].ParsedText;
        // Regex-based smart extraction
        console.log('Step 2: Parsing text manually (Deep Scan)...');

        const lines = ocrText.split(/\r?\n/).map((l: string) => l.trim()).filter((l: string) => l.length > 0);

        // Debug: Log lines to help diagnose extraction issues
        console.log('--- OCR Lines Trace ---');
        lines.forEach((l: string, i: number) => console.log(`[${i}] ${l}`));
        console.log('-----------------------');

        // 1. Extract Amount (Prioritize "Total" or "Balance" lines)
        let detectedAmount = 0;
        const amountRegex = /[\d,]+\.?\d{0,2}/g;

        const totalKeywords = ['total', 'grand total', 'balance due', 'amount due', 'net amount', 'payable', 'final amount', 'invoice value'];

        for (let i = lines.length - 1; i >= 0; i--) {
            const lowerLine = lines[i].toLowerCase();

            if (lowerLine.includes('%') || lowerLine.includes('tax') || lowerLine.includes('gst')) continue;

            // Check for Total keywords
            if (totalKeywords.some(k => lowerLine.includes(k))) {

                // Strategy A: Amount is on the SAME line
                let matches = lines[i].match(amountRegex);
                if (matches) {
                    const validNumbers = matches
                        .map(m => parseFloat(m.replace(/,/g, '')))
                        .filter(n => !isNaN(n) && n > 10 && n < 1000000); // Strict filter: Amounts usually > 10 for bills to avoid Qty/Items

                    if (validNumbers.length > 0) {
                        detectedAmount = validNumbers[validNumbers.length - 1];
                        console.log(`Found amount on same line [${i}]: ${detectedAmount}`);
                        break;
                    }
                }

                // Strategy B: Amount is on the NEXT line (common in some formats)
                if (i + 1 < lines.length) {
                    const nextLine = lines[i + 1];
                    matches = nextLine.match(amountRegex);
                    if (matches) {
                        const validNumbers = matches
                            .map(m => parseFloat(m.replace(/,/g, '')))
                            .filter(n => !isNaN(n) && n > 10 && n < 1000000);

                        if (validNumbers.length > 0) {
                            detectedAmount = validNumbers[0]; // Take first number on next line
                            console.log(`Found amount on next line [${i + 1}]: ${detectedAmount}`);
                            break;
                        }
                    }
                }
            }
        }

        // Fallback: Max Number in text (if no total found)
        if (detectedAmount === 0) {
            const allMatches = ocrText.match(/[\d,]+\.?\d{1,2}/g);
            if (allMatches) {
                const numbers = allMatches
                    .map(n => parseFloat(n.replace(/,/g, '')))
                    .filter(n => !isNaN(n) && n > 5 && n < 1000000); // Lower threshold for fallback

                if (numbers.length > 0) {
                    detectedAmount = Math.max(...numbers);
                    console.log(`Fallback Max Amount: ${detectedAmount}`);
                }
            }
        }


        // 2. Extract Merchant (Skip generic headers)
        let merchant = "Unknown Merchant";
        const skipHeaders = ['tax invoice', 'bill of supply', 'sample bill', 'invoice', 'receipt', 'cash memo'];

        for (let i = 0; i < Math.min(lines.length, 5); i++) {
            const line = lines[i];
            // If the line is NOT a generic header and has enough length
            if (!skipHeaders.some(h => line.toLowerCase().includes(h)) && line.length > 3) {
                merchant = line.substring(0, 30);
                break;
            }
        }

        // 3. Extract Date (YYYY-MM-DD, DD/MM/YYYY, etc)
        const dateMatch = ocrText.match(/\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}-\d{2}-\d{4}/);

        // Default to TODAY in IST (India Standard Time) to verify correct day
        // UTC is often yesterday during early morning in India
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000; // +5.5 hours
        const istDate = new Date(now.getTime() + istOffset);
        let date = istDate.toISOString().split('T')[0];

        if (dateMatch) {
            let d = dateMatch[0];
            // Normalize DD-MM-YYYY to YYYY-MM-DD if needed
            if (d.includes('/')) {
                const parts = d.split('/');
                if (parts.length === 3) date = `${parts[2]}-${parts[1]}-${parts[0]}`;
            } else if (d.includes('-') && d.split('-')[0].length === 2) {
                const parts = d.split('-');
                if (parts.length === 3) date = `${parts[2]}-${parts[1]}-${parts[0]}`;
            } else {
                date = d;
            }
        }

        // 4. Heuristic Category Detection
        const KEYWORD_MAP: Record<string, string[]> = {
            'Food & Dining': ['restaurant', 'cafe', 'coffee', 'bar', 'food', 'bistro', 'pizza', 'burger', 'dining', 'lunch', 'dinner', 'swiggy', 'zomato', 'bakery', 'tea', 'starbucks', 'mcdonalds'],
            'Shopping': ['store', 'mart', 'supermarket', 'mall', 'amazon', 'flipkart', 'myntra', 'retail', 'shop', 'fashion', 'clothing', 'apparel', 'ikea', 'decathlon'],
            'Transportation': ['uber', 'ola', 'taxi', 'cab', 'fuel', 'petrol', 'diesel', 'shell', 'hp', 'indian oil', 'station', 'railway', 'train', 'bus', 'flight', 'airline', 'ticket'],
            'Bills & Utilities': ['bill', 'electricity', 'water', 'gas', 'internet', 'wifi', 'broadband', 'mobile', 'recharge', 'tel', 'phone', 'jio', 'airtel', 'vodafone'],
            'Entertainment': ['movie', 'cinema', 'theater', 'netflix', 'prime', 'hotstar', 'spotify', 'subscription', 'event', 'bookmyshow', 'pvr', 'inox'],
            'Health & Fitness': ['pharmacy', 'med', 'hospital', 'clinic', 'doctor', 'apollo', '1mg', 'gym', 'fitness', 'health'],
            'Education': ['book', 'course', 'udemy', 'coursera', 'school', 'college', 'university', 'tuition', 'fee', 'learning']
        };

        let category = 'Misc';
        const lowerText = ocrText.toLowerCase();

        for (const [cat, keywords] of Object.entries(KEYWORD_MAP)) {
            if (keywords.some(k => lowerText.includes(k))) {
                category = cat;
                break;
            }
        }

        res.json({
            merchant,
            amount: detectedAmount || 0,
            date,
            category
        });
    } catch (error: any) {
        console.error('Error scanning receipt:', error.message || error);
        res.status(500).json({ error: 'Failed to scan receipt: ' + (error.message || 'Unknown error') });
    }
});

export default router;
