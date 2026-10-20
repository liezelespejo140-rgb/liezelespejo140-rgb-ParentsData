import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, X, CheckCircle, Mail, ArrowRight } from 'lucide-react';

export const PushNotificationToast: React.FC = () => {
  const { latestPushBanner, clearLatestPushBanner, setActiveView } = useApp();

  useEffect(() => {
    if (!latestPushBanner) return;
    const timer = setTimeout(() => {
      clearLatestPushBanner();
    }, 7500);
    return () => clearTimeout(timer);
  }, [latestPushBanner, clearLatestPushBanner]);

  if (!latestPushBanner) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden ring-1 ring-black/5">
        <div className="bg-gradient-to-r from-[#0b2545] to-[#133c70] px-4 py-2.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Bell className="w-3 h-3" />
            </div>
            <span className="text-xs font-semibold tracking-wide uppercase text-amber-300">
              ISAT U Alert Dispatch
            </span>
            <span className="text-[10px] text-slate-300 bg-white/10 px-1.5 py-0.5 rounded">
              {latestPushBanner.channel === 'both' ? 'Push & Email' : latestPushBanner.channel.toUpperCase()}
            </span>
          </div>
          <button
            onClick={clearLatestPushBanner}
            className="text-slate-300 hover:text-white transition-colors p-0.5 rounded"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-[#0b2545] shrink-0 mt-0.5">
              {latestPushBanner.channel === 'email' ? (
                <Mail className="w-5 h-5 text-blue-600" />
              ) : (
                <Bell className="w-5 h-5 text-[#0b2545]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                {latestPushBanner.title}
              </h4>
              <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                {latestPushBanner.body}
              </p>
              
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-500" /> Automated Delivery
                </span>
                <button
                  onClick={() => {
                    clearLatestPushBanner();
                    setActiveView('notifications');
                  }}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 transition-colors"
                >
                  View Details <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
