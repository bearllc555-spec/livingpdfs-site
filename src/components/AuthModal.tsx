import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight,
  Info,
  Check,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { login, user } = useApp();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Password integrity checkers
  const getPasswordStrength = () => {
    if (!password) return { percent: 0, label: 'Empty', color: 'bg-zinc-800' };
    let score = 0;
    if (password.length >= 6) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;

    if (score < 50) return { percent: 25, label: 'Weak', color: 'bg-red-500' };
    if (score < 100) return { percent: 60, label: 'Good', color: 'bg-yellow-500' };
    return { percent: 100, label: 'Robust Secure', color: 'bg-blue-500' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('Please input a valid email coordinate.');
      return;
    }

    if (password.length < 5) {
      setErrorMsg('Password should be robust (at least 5 characters).');
      return;
    }

    // Normalizing names
    const resolvedName = name || email.split('@')[0];
    login(email, resolvedName);
    onClose();
  };

  const handleQuickLoginPreset = (emailPreset: string, namePreset: string) => {
    login(emailPreset, namePreset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Sheet Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-gray-150 dark:border-zinc-850 rounded-none shadow-2xl p-6 md:p-8 text-left"
      >
        {/* Close trigger */}
        <button 
          onClick={onClose}
          id="btn-close-auth"
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 rounded-none transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6 text-left">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 mb-3">
            <ShieldCheck className="h-5.5 w-5.5" />
          </div>
          <h2 className="font-sans text-xl font-bold text-gray-955 dark:text-white leading-none font-serif uppercase tracking-tight">
            {isRegistering ? 'Create Reader Profile' : 'Access Cloud Library'}
          </h2>
          <p className="font-sans text-xs text-gray-400 dark:text-zinc-500 mt-1.5 leading-relaxed">
            Single credentials synchronize bookmarks, reading progress and alerts securely.
          </p>
        </div>

        {/* Action presets card for ease-of-use vetting */}
        <section className="bg-slate-50 dark:bg-zinc-900 border border-gray-150 dark:border-zinc-805 p-3 rounded-none mb-5 text-xs text-gray-655 dark:text-zinc-400 text-left">
          <span className="font-bold text-gray-900 dark:text-white block mb-1.5">Quick Testing Profiles:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLoginPreset('anthony@livingpdfs.com', 'Anthony')}
              id="btn-quick-login-premium"
              className="py-1 px-2.5 bg-white text-zinc-900 hover:bg-zinc-100 border rounded-none font-sans cursor-pointer text-center text-[10px] font-semibold flex items-center justify-center gap-1 dark:bg-zinc-950 dark:text-zinc-250 dark:border-zinc-800"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Anthony (Premium)</span>
            </button>
            <button
              onClick={() => handleQuickLoginPreset('clara@reader.com', 'Clara')}
              id="btn-quick-login-free"
              className="py-1 px-2.5 bg-white text-zinc-900 hover:bg-zinc-100 border rounded-none font-sans cursor-pointer text-[10px] text-center font-semibold flex items-center justify-center gap-1 dark:bg-zinc-950 dark:text-zinc-250 dark:border-zinc-800"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              <span>Clara (Free Account)</span>
            </button>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {errorMsg && (
            <div className="flex items-center gap-2 p-2.5 bg-red-50 text-red-600 border border-red-105 rounded-none font-sans text-xs">
              <AlertCircle className="h-4 w-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isRegistering && (
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-gray-405 block" htmlFor="auth-name-input">
                HUMAN NAME
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-440" />
                <input
                  type="text"
                  placeholder="e.g. Elena Rostova"
                  id="auth-name-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-250 bg-white dark:border-zinc-805 dark:bg-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 rounded-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-gray-405 block" htmlFor="auth-email-input">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-440" />
              <input
                type="email"
                placeholder="e.g. anthony@livingpdfs.com"
                id="auth-email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-250 bg-white dark:border-zinc-805 dark:bg-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 rounded-none"
                required
              />
            </div>
            {!isRegistering && (
              <span className="font-mono text-[9px] text-gray-400 block leading-tight mt-1">
                Hint: emails ending in <span className="text-blue-500">@livingpdfs.com</span> bypass paywalls directly for testing!
              </span>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-gray-455 block" htmlFor="auth-password-input">
              SECURE PASSWORD
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-440" />
              <input
                type="password"
                placeholder="••••••••••••"
                id="auth-password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-250 bg-white dark:border-zinc-805 dark:bg-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 rounded-none"
                required
              />
            </div>

            {/* Password strength meter representation for robust auth */}
            {password.length > 0 && (
              <div className="space-y-1 pt-1 select-none text-left">
                <div className="flex items-center justify-between text-[9px] font-mono font-medium text-gray-400">
                  <span>STRENGTH INDICATOR:</span>
                  <span className={`font-bold uppercase ${strength.percent === 100 ? 'text-blue-500' : 'text-gray-500'}`}>
                    {strength.label}
                  </span>
                </div>
                {/* Visual bar */}
                <div className="h-1 bg-gray-150 rounded-none overflow-hidden dark:bg-zinc-850">
                  <div 
                    className={`h-full rounded-none transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strength.percent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            id="btn-auth-submit"
            className="w-full py-2.5 font-sans text-xs font-bold bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 rounded-none shadow transition-all duration-200 flex items-center justify-center gap-1"
          >
            <span>{isRegistering ? 'Register Cloud Vault' : 'Secure Authenticate'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

        </form>

        {/* Modal Toggle Selector */}
        <div className="mt-5 border-t border-gray-100 dark:border-zinc-900 pt-3.5 text-center text-xs font-sans">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setErrorMsg('');
            }}
            id="btn-toggle-auth-mode"
            className="text-gray-500 hover:text-gray-950 dark:text-zinc-400 dark:hover:text-white hover:underline transition-colors"
          >
            {isRegistering ? 'Already hold a profile? Access here.' : 'First time? Create a free cloud profile instead.'}
          </button>
        </div>

      </motion.div>
    </div>
  );
};
