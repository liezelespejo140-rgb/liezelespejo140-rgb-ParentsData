import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Mail, Lock, User, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { accounts, switchAccount, loginUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Please enter your university registered email address.');
      return;
    }
    const success = loginUser(email);
    if (success) {
      onClose();
    } else {
      setError('No registered ISAT U parent or faculty account found with this email. Try selecting one of the demo credentials below.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b2545] to-[#133c70] p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-lg"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-full bg-white mx-auto flex items-center justify-center p-1 shadow-md border-2 border-amber-400 mb-3">
            <img
              src="/src/assets/images/isat_u_crest_symbol_1792048181752.jpg"
              alt="ISAT U Seal"
              className="w-full h-full object-contain rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <h3 className="text-lg font-bold">ISAT U Secure Portal Login</h3>
          <p className="text-xs text-blue-200 mt-1">
            Iloilo Science and Technology University · Parents & Faculty Gateway
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                University Email / Registered Parent Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. liezelespejo140@gmail.com"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b2545]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password / Portal PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0b2545]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0b2545] hover:bg-[#133c70] text-white font-semibold py-2.5 text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Sign In to Dashboard
            </button>
          </form>

          {/* Quick Select Demo Roles */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Instant Demo Credentials (1-Click Switch)
            </span>
            <div className="space-y-1.5">
              {accounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => {
                    switchAccount(acc);
                    onClose();
                  }}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs">
                      {acc.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{acc.name}</div>
                      <div className="text-[10px] text-slate-500">{acc.email}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                    {acc.role === 'parent' ? 'Parent' : acc.title || acc.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
