import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listAvailableModels() {
    console.log("🔍 Checking available models for your API Key...");
    try {
        // This effectively asks Google: "What can I use?"
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
        // We use a dummy model just to access the client, 
        // but really we want to see if we can just list them if the SDK supports it,
        // or easier: just try the most specific latest version.
        
        // Actually, let's try the specific "001" version which often fixes the 404
        console.log("👉 Trying 'gemini-1.5-flash-001'...");
        const specificModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        const result = await specificModel.generateContent("Test");
        console.log("✅ SUCCESS! 'gemini-1.5-flash-001' works.");
        return;
    } catch (error) {
        console.log("❌ 'gemini-1.5-flash-001' failed.");
    }

    try {
        console.log("👉 Trying 'gemini-1.0-pro'...");
        const specificModel = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        const result = await specificModel.generateContent("Test");
        console.log("✅ SUCCESS! 'gemini-1.0-pro' works.");
    } catch (error) {
        console.log("❌ 'gemini-1.0-pro' failed.");
        console.log("🛑 Error details:", error.message);
    }
}

listAvailableModels();