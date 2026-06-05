import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { LanguageContext } from '../context/LanguageContext.jsx';
import { Leaf, Mail, Lock, User, MapPin, Sprout, ArrowRight, AlertCircle, Scale } from 'lucide-react';

const Register = () => {
  const { register } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [cropInput, setCropInput] = useState('');
  const [localError, setLocalError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLoading(true);

    // Parse preferred crops
    const preferredCrops = cropInput
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);

    try {
      await register({
        name,
        email,
        password,
        location,
        farmSize: Number(farmSize) || 0,
        preferredCrops
      });
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-lg space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-forest text-white">
            <Leaf className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('navRegister')}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-forest hover:text-leaf dark:text-leaf transition-colors">
              Sign in here
            </Link>
          </p>
        </div>

        {localError && (
          <div className="flex items-center space-x-2 rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{localError}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Column 1: Personal Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-forest uppercase tracking-wider dark:text-leaf">
                Personal Credentials
              </h3>
              
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Name</label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-forest focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:focus:border-leaf"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-forest focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:focus:border-leaf"
                    placeholder="john@farm.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-forest focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:focus:border-leaf"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Column 2: Farm Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-forest uppercase tracking-wider dark:text-leaf">
                {t('farmDetails')}
              </h3>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('location')}</label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MapPin className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-forest focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:focus:border-leaf"
                    placeholder="Punjab, India"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('farmSize')}</label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Scale className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    required
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-forest focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:focus:border-leaf"
                    placeholder="15"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('preferredCrops')}</label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Sprout className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={cropInput}
                    onChange={(e) => setCropInput(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-forest focus:bg-white dark:border-slate-800 dark:bg-slate-800 dark:text-white dark:focus:border-leaf"
                    placeholder="Wheat, Rice, Tomato (comma-separated)"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-forest py-3 px-4 text-sm font-semibold text-white shadow-md hover:bg-forest-dark focus:outline-none transition-all duration-150 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <span className="flex items-center">
                  Register Farm <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
