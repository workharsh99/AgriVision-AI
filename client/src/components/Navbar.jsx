import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { LanguageContext } from '../context/LanguageContext.jsx';
import { 
  Leaf, Sun, Moon, Globe, Menu, X, LogOut, User, 
  LayoutDashboard, Camera, MessageSquare, Shield 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { lang, changeLanguage, t } = useContext(LanguageContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
    ${isActive(path) 
      ? 'bg-forest text-white dark:bg-forest dark:text-white' 
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}
  `;

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'es', name: 'Español' }
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest text-white">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-forest dark:text-leaf">
                {t('appName')}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className={linkClass('/')}>{t('navHome')}</Link>
            <Link to="/about" className={linkClass('/about')}>{t('navAbout')}</Link>
            <Link to="/features" className={linkClass('/features')}>{t('navFeatures')}</Link>
            <Link to="/contact" className={linkClass('/contact')}>{t('navContact')}</Link>

            {user && (
              <>
                <Link to="/dashboard" className={linkClass('/dashboard')}>
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  {t('navDashboard')}
                </Link>
                <Link to="/upload" className={linkClass('/upload')}>
                  <Camera className="h-4 w-4 mr-1" />
                  {t('navUpload')}
                </Link>
                <Link to="/chat" className={linkClass('/chat')}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {t('navAIChat')}
                </Link>

                {user.role === 'admin' && (
                  <Link to="/admin" className={linkClass('/admin')}>
                    <Shield className="h-4 w-4 mr-1" />
                    {t('navAdmin')}
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Toolbar Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Toggle language menu"
              >
                <Globe className="h-5 w-5" />
                <span className="text-xs uppercase font-semibold">{lang}</span>
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-md border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        changeLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800 ${
                        lang === l.code ? 'font-bold text-forest dark:text-leaf' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle theme mode"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Profile / Auth Actions */}
            {user ? (
              <div className="flex items-center space-x-3 ml-2 border-l border-slate-200 pl-3 dark:border-slate-800">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{user.name}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 capitalize">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 border-l border-slate-200 pl-3 dark:border-slate-800">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-forest dark:text-slate-300 dark:hover:text-leaf px-3 py-2"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-forest px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-forest-dark transition"
                >
                  {t('navRegister')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 px-2 pt-2 pb-4 shadow-lg dark:border-slate-800 dark:bg-slate-900/95 transition-all">
          <div className="space-y-1">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">{t('navHome')}</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">{t('navAbout')}</Link>
            <Link to="/features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">{t('navFeatures')}</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">{t('navContact')}</Link>

            {user && (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">{t('navDashboard')}</Link>
                <Link to="/upload" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">{t('navUpload')}</Link>
                <Link to="/chat" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">{t('navAIChat')}</Link>

                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">{t('navAdmin')}</Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Profile Actions */}
          <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
            {/* Mobile Language Selection */}
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{t('language')}</span>
              <div className="flex space-x-2">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => changeLanguage(l.code)}
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      lang === l.code ? 'bg-forest text-white' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            {user ? (
              <div className="flex items-center justify-between px-3 py-2 mt-2">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-slate-400" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>
                    <span className="text-xs text-slate-500 capitalize">{user.role}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 dark:bg-red-950/20 dark:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 px-3 mt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg border border-slate-200 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg bg-forest py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-forest-dark"
                >
                  {t('navRegister')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
