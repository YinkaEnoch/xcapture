import React from 'react';
import { XLogo } from './icons/XLogo';
import { Camera, Sparkles, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, onToggleDarkMode }) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 p-0.5 shadow-lg shadow-sky-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <XLogo className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight font-sans">
                XSnap
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 uppercase">
                <Sparkles className="w-2.5 h-2.5" /> Client-Side
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Turn any X post into a clean screenshot
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? "Switch to light UI" : "Switch to dark UI"}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
          </button>
          
          <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-900/60 border border-slate-800/60 rounded-lg px-3 py-1.5 font-mono">
            <Camera className="w-3.5 h-3.5 text-sky-400" />
            <span>High-Res PNG</span>
          </div>
        </div>
      </div>
    </header>
  );
};
