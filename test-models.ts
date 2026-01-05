
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("No API KEY found!");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log(`✅ ${modelName} SUCCESS:`, response.text().slice(0, 50));
        return true;
    } catch (error) {
        console.log(`❌ ${modelName} FAILED: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log("Diagnosing Gemini Models...");
    await testModel('gemini-1.5-flash');
    await testModel('gemini-1.5-flash-001');
    await testModel('gemini-1.5-pro');
    await testModel('gemini-pro');
}

main();
