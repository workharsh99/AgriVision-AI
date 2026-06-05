import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

console.log('=== AgriVision AI Connection Test ===');

// Test MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agrivision';
console.log(`Connecting to MongoDB at: ${mongoUri.replace(/:([^:@]+)@/, ':****@')}`);

try {
  await mongoose.connect(mongoUri);
  console.log('✅ MongoDB Connected successfully!');
  await mongoose.disconnect();
} catch (error) {
  console.log(`❌ MongoDB Connection Failed: ${error.message}`);
}

// Test Gemini
const apiKey = process.env.GEMINI_API_KEY;
if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
  console.log('✅ GEMINI_API_KEY is configured.');
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('Testing Gemini API with sample prompt "Say Hello"...');
    const result = await model.generateContent('Say Hello in one word.');
    const response = await result.response;
    console.log(`✅ Gemini Response: "${response.text().trim()}"`);
    console.log('✅ Gemini API Integration fully functional!');
  } catch (error) {
    console.log(`❌ Gemini API Test Failed: ${error.message}`);
    if (error.message.includes('404') || error.message.includes('not found')) {
      console.log('💡 Tip: Model not found. This 404 is commonly thrown when the API key is restricted, invalid, inactive, or has not enabled Generative Language API privileges.');
    }
  }
} else {
  console.log('⚠️  GEMINI_API_KEY not set. Backend will operate in mock/offline mode.');
}

console.log('=== Test Complete ===');
// Allow the event loop to exit naturally to avoid Win32 uv loop assert exceptions

