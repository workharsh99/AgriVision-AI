import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LanguageContext } from '../context/LanguageContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { 
  ShieldCheck, Brain, Leaf, MessageSquare, 
  ArrowRight, Sprout, CloudSun, Target 
} from 'lucide-react';

const Home = () => {
  const { t } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Decorative Background Gradients */}
      <div className="absolute top-0 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5 animate-pulse-slow"></div>
      <div className="absolute top-1/3 right-1/4 h-96 w-96 translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-500/5 animate-pulse-slow"></div>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-28 lg:pb-24">
        <motion.div 
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            variants={itemVariants} 
            className="mx-auto flex max-w-fit items-center justify-center space-x-2 rounded-full bg-emerald-100 px-4 py-1.5 dark:bg-emerald-950/40"
          >
            <Sprout className="h-4.5 w-4.5 text-forest dark:text-leaf" />
            <span className="text-xs font-bold text-forest dark:text-leaf uppercase tracking-wider">
              Empowering Precision Agriculture
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white"
          >
            <span className="block">Protect Your Crops with</span>
            <span className="block bg-gradient-to-r from-forest to-leaf bg-clip-text text-transparent dark:from-leaf dark:to-sky">
              AI-Powered Diagnostics
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400"
          >
            Upload a photo of crop leaves to instantly detect plant diseases, receive Gemini-powered organic/chemical remedies, and consult our agricultural chatbot.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center gap-4"
          >
            {user ? (
              <>
                <Link
                  to="/upload"
                  className="flex items-center justify-center rounded-xl bg-forest px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-forest-dark dark:bg-leaf dark:hover:bg-leaf-dark hover:shadow-xl transition-all duration-150"
                >
                  {t('navUpload')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/dashboard"
                  className="mt-3 sm:mt-0 flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-8 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all duration-150"
                >
                  {t('navDashboard')}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="flex items-center justify-center rounded-xl bg-forest px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-forest-dark hover:shadow-xl transition-all duration-150"
                >
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="mt-3 sm:mt-0 flex items-center justify-center rounded-xl border border-slate-200 bg-white/70 px-8 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-all duration-150"
                >
                  Sign In
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Overview */}
      <section className="bg-white py-16 dark:bg-slate-900 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
              Complete Diagnostic Ecosystem
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
              Modern digital agriculture tools designed specifically to help farmers increase crop yield and make scientific farming decisions.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-forest dark:bg-emerald-950/60 dark:text-leaf">
                <Brain className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Disease Detection</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                AI visual pathologists identify crop infections from mobile photos with high confidence levels.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-forest dark:bg-emerald-950/60 dark:text-leaf">
                <Leaf className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">Chemical & Organic Recommendations</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Receive organic alternatives alongside chemical treatments, including exact fertilizer dosages.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-forest dark:bg-emerald-950/60 dark:text-leaf">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">AI Farm Assistant</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Ask crop questions anytime using voice commands in multiple languages for real-time guidance.
              </p>
            </div>


          </div>
        </div>
      </section>

      {/* Advanced Capabilities banner */}
      <section className="bg-slate-50 py-16 dark:bg-slate-950 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Real-world Agricultural Precision
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Designed to operate under real field conditions. Whether you have small vegetable plots or broad-acre cereal farms, AgriVision AI compiles the localized data to optimize your harvest yields.
              </p>
              
              <div className="mt-8 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-forest dark:bg-emerald-950 dark:text-leaf">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Secure JWT Profile Encryption
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-forest dark:bg-emerald-950 dark:text-leaf">
                    <CloudSun className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Dynamic Weather-Based Precautions
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-forest dark:bg-emerald-950 dark:text-leaf">
                    <Target className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Precision Disease Detection Models
                  </span>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="flex justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-5 w-5 text-forest" />
                  <span className="font-bold text-slate-950 dark:text-white">Active Diagnostics</span>
                </div>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-forest dark:bg-emerald-950/40 dark:text-leaf">98% Accuracy</span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">Crop Diagnosed</span>
                  <span className="text-slate-600 dark:text-slate-400">Tomato (Solanum lycopersicum)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">Disease Detected</span>
                  <span className="font-bold text-red-600">Early Blight</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">Severity</span>
                  <span className="rounded bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-700 dark:bg-orange-950/40 dark:text-orange-400">Medium</span>
                </div>
                <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                  <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                    "Fungal infection detected. Concentric rings forming leaf halos. Treatment: apply organic copper fungicide and prune lower branches to encourage airflow."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
