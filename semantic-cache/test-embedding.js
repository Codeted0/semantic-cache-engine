// test-embedding.js
import { pipeline } from '@xenova/transformers';

async function generateVector() {
    console.log("⏳ Loading AI model locally (this happens only once)...");
    
    // This downloads a small, free AI model to your laptop
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    
    const text = "Who is the CEO of Tesla?";
    console.log(`🔤 Converting text: "${text}"`);

    // Convert text to Vector
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    
    // The result is a big array of numbers like [0.01, -0.23, ...]
    const vector = Array.from(output.data);

    console.log("✅ Success! Generated Vector of length:", vector.length);
    console.log("📊 First 5 numbers:", vector.slice(0, 5));
}

generateVector();