import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;

if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.warn('WARNING: GEMINI_API_KEY is not configured or placeholder. Running in MOCK mode.');
}

// Mock crop data for fallback/offline mode
const MOCK_DISEASES = [
  {
    cropName: "Tomato",
    disease: "Early Blight",
    severity: "Medium",
    confidence: "94%",
    symptoms: [
      "Dark spots with concentric rings (target-like appearance) on older leaves.",
      "Yellowing of surrounding leaf tissue.",
      "Premature leaf drop starting from the bottom of the plant."
    ],
    causes: [
      "Fungal pathogen Alternaria solani.",
      "High humidity and warm temperatures (24-29°C).",
      "Prolonged leaf wetness from overhead watering."
    ],
    treatment: [
      "Prune lower leaves to improve air circulation.",
      "Apply copper-based fungicides or chlorothalonil.",
      "Remove and destroy heavily infected plant parts."
    ],
    prevention: [
      "Use crop rotation (avoid planting solanaceous crops in the same spot for 3 years).",
      "Water at the base of the plant rather than overhead.",
      "Apply mulch to prevent soil splashing onto leaves."
    ],
    recommendations: {
      fertilizers: {
        organic: ["Compost Tea", "Neem Cake Meal"],
        chemical: ["Calcium Nitrate (to prevent blossom end rot combo)", "NPK 10-10-10"],
        dosage: "Apply 20g NPK per plant at the base, water immediately."
      },
      irrigation: {
        waterQuantity: "2.5 liters per plant",
        waterFrequency: "Every 2-3 days in early morning"
      },
      pestControl: {
        pesticides: ["Chlorothalonil fungicide", "Copper soap spray"],
        organicAlternatives: ["Baking soda solution (1 tbsp/gal water + 2 drops liquid soap)", "Bacillus subtilis spray"]
      },
      yieldTips: {
        soilManagement: "Ensure sandy loam soil with pH 6.0-6.8.",
        nutrientManagement: "Balance nitrogen; excess nitrogen promotes leaf growth but increases blight susceptibility.",
        cropRotation: "Rotate with corn, beans, or cover crops.",
        mulching: "Spread 2-3 inches of straw mulch around plants."
      },
      weatherPrecautions: {
        rainfallAlerts: "High rainfall expected. Apply protective bio-fungicide beforehand.",
        temperatureRisks: "Temps above 25°C with rain increase fungal growth rate.",
        humidityRisks: "Morning humidity > 85% requires pruning to ensure leaves dry quickly."
      }
    }
  },
  {
    cropName: "Corn",
    disease: "Common Rust",
    severity: "Low",
    confidence: "88%",
    symptoms: [
      "Elongated golden-brown pustules on both upper and lower leaf surfaces.",
      "Pustules rupture to release powdery red-rust spores.",
      "Leaves may yellow and dry up prematurely under severe infection."
    ],
    causes: [
      "Fungus Puccinia sorghi.",
      "Cool temperatures (16-23°C) and high relative humidity (above 95%).",
      "Wind-blown spores from southern region crops."
    ],
    treatment: [
      "For small plots, pick off infected leaves.",
      "Apply strobilurin or triazole fungicides if infection spreads early in the season.",
      "Apply liquid copper fungicide."
    ],
    prevention: [
      "Plant rust-resistant corn hybrids.",
      "Ensure proper planting density to reduce canopy humidity.",
      "Destroy infected crop residues post-harvest."
    ],
    recommendations: {
      fertilizers: {
        organic: ["Well-rotted poultry manure", "Bone meal"],
        chemical: ["Urea (46-0-0) for nitrogen boost", "NPK 15-15-15"],
        dosage: "Spread 50g NPK per square meter, water thoroughly."
      },
      irrigation: {
        waterQuantity: "15-20 liters per square meter weekly",
        waterFrequency: "Twice weekly if no rain"
      },
      pestControl: {
        pesticides: ["Pyraclostrobin", "Azoxystrobin"],
        organicAlternatives: ["Neem oil spray", "Sulfur-based dusts"]
      },
      yieldTips: {
        soilManagement: "Provide loose, well-draining soil with organic matter.",
        nutrientManagement: "Nitrogen is critical; side-dress when corn is knee-high.",
        cropRotation: "Rotate with soybeans or clover.",
        mulching: "Not typical for broad-acre corn, but useful in small market gardens."
      },
      weatherPrecautions: {
        rainfallAlerts: "Constant light showers will accelerate spore germination.",
        temperatureRisks: "Cool temperatures promote rust; warmer summer weather will slow it down.",
        humidityRisks: "Foggy mornings pose high risk. Avoid working in fields when wet."
      }
    }
  },
  {
    cropName: "Rice",
    disease: "Blast",
    severity: "High",
    confidence: "91%",
    symptoms: [
      "Spindle-shaped (diamond) lesions on leaves with gray centers and reddish-brown borders.",
      "Neck rot: lesions on the neck of the panicle causing it to break.",
      "Empty or partially filled panicles that stand erect instead of drooping."
    ],
    causes: [
      "Fungal pathogen Magnaporthe oryzae.",
      "High nitrogen fertilization.",
      "Extended leaf wetness, overcast skies, and temperatures around 20-28°C."
    ],
    treatment: [
      "Drain fields temporarily to reduce humidity in the micro-climate.",
      "Apply systemic fungicides like Tricyclazole or Edifenphos.",
      "Avoid excess nitrogen fertilizer during infection."
    ],
    prevention: [
      "Use blast-resistant rice varieties.",
      "Avoid excessive nitrogen applications; split application into 3-4 doses.",
      "Rotate crops and burn or deep-plow infected stubble."
    ],
    recommendations: {
      fertilizers: {
        organic: ["Green manure (Sesbania)", "Rice husk ash (rich in Silica for cell wall strength)"],
        chemical: ["Silicon fertilizers", "Split NPK 12-12-17"],
        dosage: "Apply 15kg NPK per acre as top dressing."
      },
      irrigation: {
        waterQuantity: "Maintain 2-5 cm standing water layer normally",
        waterFrequency: "Continuous flooding, drain temporarily if blast is severe"
      },
      pestControl: {
        pesticides: ["Tricyclazole 75% WP", "Kasugamycin"],
        organicAlternatives: ["Pseudomonas fluorescens bio-fungicide", "Garlic extract spray"]
      },
      yieldTips: {
        soilManagement: "Ensure clay loam or clayey soils that hold water well.",
        nutrientManagement: "Silicon is crucial for strengthening cell walls against fungal entry.",
        cropRotation: "Rotate with legumes like mung bean or chickpea.",
        mulching: "Not applicable for flooded paddy."
      },
      weatherPrecautions: {
        rainfallAlerts: "Monsoon rains increase blast risk. Keep fields drained if rain is continuous.",
        temperatureRisks: "Cool nights (20°C) with warm days (28°C) are highly favorable.",
        humidityRisks: "Dew formation on leaves for > 10 hours is critical. Space crops adequately."
      }
    }
  },
  {
    cropName: "Potato",
    disease: "Late Blight",
    severity: "High",
    confidence: "95%",
    symptoms: [
      "Dark, water-soaked lesions on leaves and stems, often starting near leaf tips.",
      "White, downy fungal growth on the undersides of leaves in humid weather.",
      "Tubers develop a brown, dry, leathery rot that spreads inward."
    ],
    causes: [
      "Oomycete pathogen Phytophthora infestans (the Irish Potato Famine pathogen).",
      "Cool, wet weather with high humidity.",
      "Infected seed tubers or volunteer potato plants."
    ],
    treatment: [
      "Remove infected plants immediately to protect surrounding crops.",
      "Apply copper fungicides or contact/systemic oomycide sprays like metalaxyl.",
      "Harvest tubers only in dry weather and store in cool, dry conditions."
    ],
    prevention: [
      "Plant certified disease-free seed tubers.",
      "Choose late-blight resistant cultivars.",
      "Avoid overhead sprinkler irrigation; use drip or furrow instead."
    ],
    recommendations: {
      fertilizers: {
        organic: ["Seaweed extract", "Composted cow manure"],
        chemical: ["High Potassium NPK (e.g. 10-10-20) for tuber bulking", "Muriate of Potash"],
        dosage: "Apply 30g Potassium-rich fertilizer per plant during hilling."
      },
      irrigation: {
        waterQuantity: "4-5 liters per plant weekly",
        waterFrequency: "Every 4-5 days, watering directly to soil"
      },
      pestControl: {
        pesticides: ["Mancozeb", "Metalaxyl-M"],
        organicAlternatives: ["Copper hydroxide spray", "Compost extract spray"]
      },
      yieldTips: {
        soilManagement: "Hilling (mounding soil around plants) protects tubers from spores washed down.",
        nutrientManagement: "Ensure sufficient potassium for strong stems and skin set.",
        cropRotation: "Do not plant after tomatoes, eggplants, or peppers.",
        mulching: "Apply straw mulch to regulate soil temperature and conserve moisture."
      },
      weatherPrecautions: {
        rainfallAlerts: "Severe rain warning. Blight can destroy a crop in 7-10 days. Spray preventive copper.",
        temperatureRisks: "Temps between 15-20°C with 100% humidity are critical.",
        humidityRisks: "Leaf wetness for more than 8 hours is dangerous. Water early so foliage dries."
      }
    }
  },
  {
    cropName: "Wheat",
    disease: "Healthy",
    severity: "Low",
    confidence: "98%",
    symptoms: [
      "Foliage is green, robust, and free of rust pustules, spots, or powdery mildew.",
      "Stems are sturdy and upright.",
      "Heads (spikes) are filling uniformly."
    ],
    causes: [
      "Optimal weather conditions.",
      "Excellent seed quality and balanced soil fertility.",
      "Effective crop management."
    ],
    treatment: [
      "No direct disease treatment required.",
      "Maintain standard agricultural inputs."
    ],
    prevention: [
      "Keep practicing crop rotation.",
      "Continue monitoring for early signs of pests or weeds."
    ],
    recommendations: {
      fertilizers: {
        organic: ["Foliar fish emulsion", "Vermicompost top-dressing"],
        chemical: ["Ammonium Sulfate", "NPK 20-10-10"],
        dosage: "Apply 10kg NPK per acre as mid-season top-dress."
      },
      irrigation: {
        waterQuantity: "25-30 mm of water depth",
        waterFrequency: "Every 10-14 days depending on soil moisture"
      },
      pestControl: {
        pesticides: ["None required"],
        organicAlternatives: ["Neem oil as preventive repellant"]
      },
      yieldTips: {
        soilManagement: "Maintain organic matter through cover crops.",
        nutrientManagement: "Monitor nitrogen during tillering and jointing stages.",
        cropRotation: "Rotate with chickpeas, lentils, or oilseed crops.",
        mulching: "Not standard for broad-acre wheat."
      },
      weatherPrecautions: {
        rainfallAlerts: "Monitor weather; high humidity during flowering can cause head scab.",
        temperatureRisks: "Heat waves during grain filling can reduce yield. Water if dry.",
        humidityRisks: "Warm, humid nights increase risk of rust. Check crops daily."
      }
    }
  }
];

/**
 * Helper to parse base64 for Gemini multimodal input
 */
function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType
    },
  };
}

/**
 * Service to analyze crop image and detect disease
 * @param {Buffer} imageBuffer 
 * @param {string} mimeType 
 * @returns {Promise<object>}
 */
export const analyzeCropImage = async (imageBuffer, mimeType) => {
  if (!genAI) {
    // Return a random mock disease response if no API key is available
    console.log('Gemini AI not initialized. Returning random mock crop analysis.');
    const randomIndex = Math.floor(Math.random() * MOCK_DISEASES.length);
    const mock = MOCK_DISEASES[randomIndex];
    return {
      crop: mock.cropName,
      disease: mock.disease,
      severity: mock.severity,
      confidence: mock.confidence,
      symptoms: mock.symptoms,
      causes: mock.causes,
      treatment: mock.treatment,
      prevention: mock.prevention,
      recommendations: mock.recommendations
    };
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const imagePart = fileToGenerativePart(imageBuffer, mimeType);
    const prompt = `
      You are an elite agricultural pathologist. Analyze the uploaded crop leaf/plant image.
      Provide a diagnosis of the crop disease in strict JSON format. 
      The JSON object must contain EXACTLY the following structure. Do not wrap in markdown \`\`\`json tags, just return the plain JSON string.

      Required JSON format:
      {
        "crop": "Crop Name (e.g. Tomato, Corn, Rice, Wheat, Potato, etc.)",
        "disease": "Disease Name (or 'Healthy' if no disease is found)",
        "severity": "Low or Medium or High",
        "confidence": "Estimation percentage (e.g. 92%)",
        "symptoms": ["array of detected symptoms on leaves/stem/fruit"],
        "causes": ["array of probable biological/environmental causes"],
        "treatment": ["array of immediate corrective treatment actions"],
        "prevention": ["array of long-term prevention strategies"],
        "recommendations": {
          "fertilizers": {
            "organic": ["list of organic fertilizer suggestions"],
            "chemical": ["list of chemical fertilizer suggestions"],
            "dosage": "specific dosage instruction details"
          },
          "irrigation": {
            "waterQuantity": "estimated quantity needed (e.g. liters/plant)",
            "waterFrequency": "frequency details (e.g. twice weekly)"
          },
          "pestControl": {
            "pesticides": ["list of chemical pesticides if applicable"],
            "organicAlternatives": ["list of biological/organic pest controls"]
          },
          "yieldTips": {
            "soilManagement": "soil health/pH suggestion",
            "nutrientManagement": "macronutrient guidance",
            "cropRotation": "crop rotation suggestions",
            "mulching": "mulching advice"
          },
          "weatherPrecautions": {
            "rainfallAlerts": "advice on rainfall impacts",
            "temperatureRisks": "advice on temperature impacts",
            "humidityRisks": "advice on humidity impacts"
          }
        }
      }
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const jsonText = response.text().trim();
    
    // Strip possible markdown json wrappers if Gemini ignored instructions
    let cleanJson = jsonText;
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.substring(7);
    }
    if (cleanJson.endsWith('```')) {
      cleanJson = cleanJson.substring(0, cleanJson.length - 3);
    }
    cleanJson = cleanJson.trim();

    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Error with Gemini API crop analysis:', error);
    // Graceful fallback to mock data on API error
    const randomIndex = Math.floor(Math.random() * MOCK_DISEASES.length);
    const mock = MOCK_DISEASES[randomIndex];
    return {
      crop: mock.cropName,
      disease: mock.disease,
      severity: mock.severity,
      confidence: mock.confidence,
      symptoms: mock.symptoms,
      causes: mock.causes,
      treatment: mock.treatment,
      prevention: mock.prevention,
      recommendations: mock.recommendations
    };
  }
};

/**
 * Service to get chatbot responses
 * @param {Array} history 
 * @param {string} message 
 * @returns {Promise<string>}
 */
export const getChatbotResponse = async (history, message) => {
  if (!genAI) {
    // Mock chatbot responses
    console.log('Gemini AI not initialized. Returning mock chat response.');
    const lowMsg = message.toLowerCase();
    if (lowMsg.includes('yellow') || lowMsg.includes('leaf')) {
      return "Leaves turning yellow (chlorosis) usually indicates a nutrient deficiency, most commonly Nitrogen. It can also be caused by overwatering, poor drainage, or pests like spider mites sucking sap from the leaves. Try adding a balanced fertilizer or compost tea, check soil drainage, and water only when the top 2 inches of soil are dry.";
    }
    if (lowMsg.includes('fertilizer') || lowMsg.includes('wheat')) {
      return "For wheat, the ideal fertilizer regimen is N-P-K in a ratio of about 4:2:1. Nitrogen (Urea) should be applied in split doses: half at sowing, and the rest during the first irrigation (crown root initiation stage). Phosphorus (DAP) and Potassium should be applied fully as a basal dose during land preparation.";
    }
    if (lowMsg.includes('rice') || lowMsg.includes('yield')) {
      return "To increase rice yield: 1) Ensure healthy seed selection and proper seedling transplanting at 20-25 days. 2) Maintain a shallow water layer (2-5cm) instead of deep flooding. 3) Adopt the System of Rice Intensification (SRI) to save water and increase root growth. 4) Apply silica-rich fertilizers (like rice husk ash) to build pest resistance. 5) Keep field weed-free during the first 40 days.";
    }
    return "Thank you for asking! As your AgriVision assistant, I recommend keeping soil organic matter high, testing your soil pH regularly (6.0-7.0 is ideal for most crops), practicing crop rotation with legumes to naturally fix nitrogen, and ensuring drip irrigation to conserve water and prevent foliar fungal diseases. What other crops are you growing on your farm?";
  }

  try {
    const systemInstruction = `
      You are AgriVision AI, an advanced agricultural AI assistant. 
      Your goal is to help farmers diagnose plant diseases, improve crop yields, recommend fertilizers and pest controls, suggest crop management, and answer general agricultural queries. 
      Keep responses clear, professional, practical, action-oriented, and farmer-friendly. 
      If you are asked about non-agricultural topics, gently guide the user back to farming.
      Use bullet points and bold text where appropriate to make information readable.
    `;

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction
    });

    const chat = model.startChat({
      history: history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      })),
      generationConfig: {
        maxOutputTokens: 1000,
      }
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error with Gemini API chatbot:', error);
    return "I apologize, but I am having trouble connecting to my knowledge base right now. Please ensure your soil has adequate moisture and check back in a few moments.";
  }
};
