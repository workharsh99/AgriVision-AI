import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext.jsx';

const Footer = () => {
  const { t } = useContext(LanguageContext);

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest text-white">
                <Leaf className="h-4.5 w-4.5" />
              </div>
              <span className="text-lg font-bold text-forest dark:text-leaf">{t('appName')}</span>
            </Link>
            <p className="text-sm max-w-sm">
              Empowering farmers around the globe with AI-powered crop diagnostics, smart recommendations, climate cautions, and sustainability-centric farming methods.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              Platform
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-forest dark:hover:text-leaf transition">
                  {t('navHome')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-forest dark:hover:text-leaf transition">
                  {t('navAbout')}
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-forest dark:hover:text-leaf transition">
                  {t('navFeatures')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-forest dark:hover:text-leaf transition">
                  {t('navContact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              Contact
            </h3>
            <p className="text-sm">
              Email: support@agrivisionai.com<br />
              Toll-Free support: +1 (800) 555-FARM
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-500">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All systems operational</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs dark:border-slate-800">
          <p>&copy; {new Date().getFullYear()} AgriVision AI. All rights reserved. Supporting sustainable agriculture worldwide.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
