import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext.jsx';
import { Camera, Bot, FileCheck, Sliders, Smartphone, CloudSun, Calendar, Percent } from 'lucide-react';

const Features = () => {
  const { t } = useContext(LanguageContext);

  const featuresList = [
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Crop Pathology Imaging",
      description: "Supports drag-and-drop, camera snaps, and mobile uploads for JPG, PNG, and WebP, parsing plant surface diseases immediately."
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: "Gemini AI Agricultural Expert",
      description: "Queries high-level LLM pathology knowledge base to specify crop disease, severity percentage, and biological causes."
    },
    {
      icon: <Sliders className="h-6 w-6" />,
      title: "Dual-Treatment Recommendation Engine",
      description: "Provides both certified chemical sprays and biological organic alternatives, detailing exact dosages."
    },
    {
      icon: <FileCheck className="h-6 w-6" />,
      title: "Vector-grade PDF Reports",
      description: "Generates high-fidelity PDF documents detailing diagnosis, farmer profile, custom logo mark, and verification QR code."
    },
    {
      icon: <CloudSun className="h-6 w-6" />,
      title: "Weather Precautions Alert",
      description: "Tracks local temperature, humidity, and rainfall to trigger immediate spray schedules or rain warning recommendations."
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Interactive Crop Calendars",
      description: "Provides timelines for planting, fertilizing, and harvesting tailored specifically to your farm profile crops."
    },
    {
      icon: <Percent className="h-6 w-6" />,
      title: "Farm Productivity Scorecard",
      description: "Maintains health tracking percentages, displaying overall acreage productivity values to analyze historic improvements."
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Multi-language & Voice Commands",
      description: "Enables speech recognition queries and reads out diagnoses using SpeechSynthesis. Localization in English, Hindi, and Spanish."
    }
  ];

  return (
    <div className="bg-slate-50 py-12 dark:bg-slate-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Precision Agricultural Features
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
            A comprehensive suite of digital tools designed to increase farming profits, manage soil nutrients, and protect crops from blight.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuresList.map((f, idx) => (
            <div 
              key={idx} 
              className="rounded-2xl bg-white p-6 shadow-md border border-slate-100 hover:shadow-lg dark:bg-slate-900 dark:border-slate-800 transition"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-forest dark:bg-emerald-950/60 dark:text-leaf">
                {f.icon}
              </div>
              <h2 className="mt-6 text-lg font-bold text-slate-950 dark:text-white">{f.title}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
