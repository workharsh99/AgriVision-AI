import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext.jsx';
import { Mail, Phone, MapPin, Send, AlertCircle } from 'lucide-react';

const Contact = () => {
  const { t } = useContext(LanguageContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="bg-slate-50 py-12 dark:bg-slate-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">
            {t('contactSupport')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
            Have questions about AgriVision AI or need technical help with crop scans? Reach out to our agricultural pathologists.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Info Card */}
          <div className="rounded-2xl bg-white p-8 shadow-md border border-slate-100 dark:bg-slate-900 dark:border-slate-800 space-y-6">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Get in Touch</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Our support team is available during standard agricultural business hours. We try to respond to all inquiries within 24 hours.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                <Mail className="h-5 w-5 text-forest dark:text-leaf" />
                <span className="text-sm">support@agrivisionai.com</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                <Phone className="h-5 w-5 text-forest dark:text-leaf" />
                <span className="text-sm">+1 (800) 555-FARM (Toll Free)</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                <MapPin className="h-5 w-5 text-forest dark:text-leaf" />
                <span className="text-sm">100 Sprout Plaza, Suite 400, Chicago, IL</span>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl bg-white p-8 shadow-md border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
            {success && (
              <div className="flex items-center space-x-2 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 mb-6">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>Message received! Our team will contact you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-forest focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:focus:border-leaf"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-forest focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:focus:border-leaf"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="block w-full mt-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-forest focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:focus:border-leaf"
                  placeholder="Write your agricultural query..."
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center space-x-2 rounded-xl bg-forest px-6 py-2.5 text-sm font-semibold text-white hover:bg-forest-dark transition"
              >
                <Send className="h-4 w-4" />
                <span>{t('send')}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
