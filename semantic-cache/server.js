import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pipeline } from '@xenova/transformers';
import { index } from './db.js'; // Your Upstash connection
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// --- CONFIGURATION ---
const PORT = 3000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Global variable for the Local AI model
let extractor;

// 1. Initialize Local AI (Runs once when server starts)
async function initLocalAI() {
    console.log("⏳ Loading Local AI Model (This takes 10s)...");
    extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log("✅ Local AI Loaded! Ready to vectorize.");
}

// 2. Helper: Generate Vector from Text (0 Cost)
async function generateVector(text) {
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
}

// --- API ROUTE ---
app.post('/ask', async (req, res) => {
    const { question } = req.body;
    console.log(`\n📝 New Question: "${question}"`);

    try {
        // STEP A: Generate Vector locally
        const vector = await generateVector(question);
        
        // STEP B: Search Upstash (The Cache)
        // We look for vectors that are 90% similar (score >= 0.9)
        const searchResult = await index.query({
            vector: vector,
            topK: 1,
            includeMetadata: true
        });

        // Check if we found a match
        if (searchResult.length > 0 && searchResult[0].score > 0.90) {
            console.log(`⚡ CACHE HIT! (Score: ${searchResult[0].score.toFixed(4)})`);
            return res.json({
                answer: searchResult[0].metadata.answer,
                source: "cache",
                latency: "fast" 
            });
        }

        // STEP C: Cache MISS -> Call Gemini
        console.log("🐢 Cache Miss. Asking Gemini...");
        
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(question);
        const answer = result.response.text();

        // STEP D: Save new answer to Upstash
        console.log("💾 Saving to Cache...");
        await index.upsert([{
            id: Date.now().toString(), // Unique ID
            vector: vector,
            metadata: { answer: answer }
        }]);

        return res.json({
            answer: answer,
            source: "gemini",
            latency: "slow"
        });

    } catch (error) {
        console.error("❌ Error:", error.message);
        
        // FALLBACK: If Gemini fails (429 Error), don't crash!
        res.json({
            answer: "The AI is busy (Rate Limit), but your Backend Logic works perfectly!",
            source: "fallback"
        });
    }
});

// Start Server
app.listen(PORT, async () => {
    await initLocalAI();
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});