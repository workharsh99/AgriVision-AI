import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext.jsx';
import { Sprout, Users, Eye, Target } from 'lucide-react';

const About = () => {
  const { t } = useContext(LanguageContext);

  return (
    <div className="bg-slate-50 py-12 dark:bg-slate-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Empowering Agriculture Worldwide
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            AgriVision AI is committed to delivering smart technology to small and commercial farmers, increasing yields while reducing agricultural carbon footprints.
          </p>
        </div>

        {/* Info Grid */}
        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-8 shadow-md border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-forest dark:bg-emerald-950/60 dark:text-leaf">
              <Eye className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-xl font-bold text-slate-950 dark:text-white">Our Vision</h2>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed dark:text-slate-400">
              To build a resilient, pesticide-smart, and high-yield ecosystem where every farmer has access to a pocket-sized visual crop pathologist.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-md border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-forest dark:bg-emerald-950/60 dark:text-leaf">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-xl font-bold text-slate-950 dark:text-white">Our Mission</h2>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed dark:text-slate-400">
              Utilize neural multimodal networks like Gemini to democratize agronomy, and make organic crop health methods easily applicable globally.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-md border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-forest dark:bg-emerald-950/60 dark:text-leaf">
              <Users className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-xl font-bold text-slate-950 dark:text-white">Farming Community</h2>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed dark:text-slate-400">
              Connecting rural farmers with voice-activated tools and multi-lingual interfaces that work regardless of technological background.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
