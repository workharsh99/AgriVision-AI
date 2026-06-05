import React, { createContext, useState } from 'react';

export const LanguageContext = createContext();

const translations = {
  en: {
    appName: "AgriVision AI",
    navHome: "Home",
    navAbout: "About",
    navFeatures: "Features",
    navDashboard: "Dashboard",
    navUpload: "Scan Crop",
    navAIChat: "AI Chat",
    navReports: "History",
    navAdmin: "Admin Panel",
    navContact: "Contact",
    navLogin: "Login",
    navRegister: "Register",
    logout: "Logout",
    welcomeFarmer: "Welcome back, Farmer",
    productivityScore: "Farm Productivity Score",
    totalScans: "Total Reports Generated",
    cropsAnalyzed: "Crops Analyzed",
    healthyCrops: "Healthy Crops",
    diseasedCrops: "Diseased Crops",
    recentScans: "Recent Scans",
    weatherAlerts: "Weather Alerts",
    cropCalendar: "Crop Calendar",
    plantSowing: "Optimal Sowing Suggestion",
    plantHarvesting: "Harvest Window Estimate",
    voiceAssistant: "Voice AI Assistant",
    speakNow: "Listening... Speak your crop question.",
    clickToSpeak: "Click to start voice command",
    whyLeavesYellow: "Why are my crop leaves turning yellow?",
    bestFertilizerWheat: "What is the best fertilizer for wheat crops?",
    increaseRiceYield: "How can I increase my rice crop yield?",
    dragDropText: "Drag & drop your crop leaf image here, or click to browse",
    supportedFormats: "Supports JPG, PNG, JPEG, WEBP",
    analyzingImage: "AI is diagnosing your crop... Please wait.",
    severity: "Severity",
    confidence: "Confidence Score",
    symptoms: "Symptoms Detected",
    causes: "Possible Causes",
    treatment: "Immediate Treatment Plan",
    prevention: "Long-term Prevention Strategy",
    fertilizerRecs: "Fertilizer Recommendations",
    irrigationRecs: "Irrigation Scheduling",
    pestControlRecs: "Pest & Disease Control",
    yieldImprovement: "Yield Enhancement Tips",
    downloadPDF: "Download PDF Report",
    emailReport: "Email Report to Me",
    smsReport: "Send SMS Alert",
    contactSupport: "Contact Farm Support",
    send: "Send",
    language: "Language",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    farmDetails: "Farm Details",
    location: "Location",
    farmSize: "Farm Size (Acres)",
    preferredCrops: "Preferred Crops",
  },
  hi: {
    appName: "एग्रीविज़न एआई",
    navHome: "मुख्य पृष्ठ",
    navAbout: "हमारे बारे में",
    navFeatures: "विशेषताएं",
    navDashboard: "डैशबोर्ड",
    navUpload: "फसल स्कैन",
    navAIChat: "एआई चैट",
    navReports: "इतिहास",
    navAdmin: "एडमिन पैनल",
    navContact: "संपर्क",
    navLogin: "लॉगिन",
    navRegister: "पंजीकरण",
    logout: "लॉगआउट",
    welcomeFarmer: "स्वागत है, किसान भाई",
    productivityScore: "फार्म उत्पादकता स्कोर",
    totalScans: "कुल उत्पन्न रिपोर्ट",
    cropsAnalyzed: "विश्लेषण की गई फसलें",
    healthyCrops: "स्वस्थ फसलें",
    diseasedCrops: "रोगग्रस्त फसलें",
    recentScans: "हाल के स्कैन",
    weatherAlerts: "मौसम की चेतावनी",
    cropCalendar: "फसल कैलेंडर",
    plantSowing: "सर्वोत्तम बुवाई सुझाव",
    plantHarvesting: "कटाई का अनुमानित समय",
    voiceAssistant: "वॉयस एआई सहायक",
    speakNow: "सुन रहा हूँ... अपनी फसल का सवाल पूछें।",
    clickToSpeak: "वॉयस कमांड शुरू करने के लिए क्लिक करें",
    whyLeavesYellow: "मेरी फसल की पत्तियां पीली क्यों पड़ रही हैं?",
    bestFertilizerWheat: "गेहूं की फसल के लिए सबसे अच्छा उर्वरक क्या है?",
    increaseRiceYield: "मैं चावल की फसल की पैदावार कैसे बढ़ा सकता हूँ?",
    dragDropText: "अपनी फसल की पत्ती की छवि यहाँ खींचें और छोड़ें, या ब्राउज़ करने के लिए क्लिक करें",
    supportedFormats: "JPG, PNG, JPEG, WEBP का समर्थन करता है",
    analyzingImage: "एआई आपकी फसल का निदान कर रहा है... कृपया प्रतीक्षा करें।",
    severity: "तीव्रता",
    confidence: "विश्वास स्कोर",
    symptoms: "लक्षण पाए गए",
    causes: "संभावित कारण",
    treatment: "तत्काल उपचार योजना",
    prevention: "दीर्घकालिक रोकथाम रणनीति",
    fertilizerRecs: "उर्वरक सिफारिशें",
    irrigationRecs: "सिंचाई निर्धारण",
    pestControlRecs: "कीट और रोग नियंत्रण",
    yieldImprovement: "पैदावार सुधार युक्तियाँ",
    downloadPDF: "पीडीएफ रिपोर्ट डाउनलोड करें",
    emailReport: "मुझे ईमेल रिपोर्ट भेजें",
    smsReport: "एसएमएस अलर्ट भेजें",
    contactSupport: "कृषि सहायता से संपर्क करें",
    send: "भेजें",
    language: "भाषा",
    darkMode: "डार्क मोड",
    lightMode: "लाइट मोड",
    farmDetails: "फार्म का विवरण",
    location: "स्थान",
    farmSize: "फार्म का आकार (एकड़)",
    preferredCrops: "पसंदीदा फसलें",
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('lang') || 'en';
  });

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem('lang', newLang);
    }
  };

  const t = (key) => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
