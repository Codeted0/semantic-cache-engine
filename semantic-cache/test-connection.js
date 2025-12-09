// test-connection.js
import { index } from './db.js';

async function test() {
    console.log("📡 Connecting to Upstash Vector...");
    
    // 1. Create a fake vector of size 384 (random numbers)
    const fakeVector = Array(384).fill(0).map(() => Math.random());

    // 2. Upload it
    try {
        await index.upsert([
            {
                id: "test-id-1",
                vector: fakeVector,
                metadata: { answer: "This is a test answer from Upstash!" }
            }
        ]);
        console.log("✅ Success! Vector stored in Cloud.");
        
        // 3. Delete it (cleanup)
        await index.delete(["test-id-1"]);
        console.log("🧹 Cleanup done.");
        
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

test();