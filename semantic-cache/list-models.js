import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    console.log("🔍 Asking Google for available models...");
    try {
        // This is the specific command to list models
        const modelResponse = await genAI.getGenerativeModel({ model: "gemini-pro" }).apiKey; 
        
        // Actually, the SDK has a specific manager for this.
        // Let's use the raw fetch method to be 100% sure we see everything.
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", data.error.message);
            return;
        }

        console.log("✅ SUCCESS! Here are your available models:");
        console.log("---------------------------------------------");
        
        // Filter for "generateContent" models (the ones we need for chat)
        const chatModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
        
        chatModels.forEach(m => {
            console.log(`👉 Name: ${m.name}`);
        });
        
        console.log("---------------------------------------------");
        console.log("📝 Copy one of the names above (e.g., 'models/gemini-1.5-flash') into your server.js");

    } catch (error) {
        console.error("❌ Script Error:", error);
    }
}

listModels();
