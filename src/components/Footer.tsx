import React from 'react';
import { ShieldCheck, Zap, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/60 py-10 text-slate-400 text-xs font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <ShieldCheck className="w-4 h-4 text-sky-400" />
          <span>100% Client-Side & Private. No data or links leave your browser.</span>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> No Server
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Instant PNG
          </span>
          <span>•</span>
          <span>Static Web App</span>
        </div>
      </div>
    </footer>
  );
};
