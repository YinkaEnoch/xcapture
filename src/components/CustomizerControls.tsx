import React, { useState } from 'react';
import { CardCustomization, TweetTheme, TweetData } from '../lib/types';
import { Palette, Check, Layout, ShieldCheck, Edit3 } from 'lucide-react';

interface CustomizerControlsProps {
  customization: CardCustomization;
  onChange: (updated: CardCustomization) => void;
  tweet: TweetData;
  onUpdateTweet: (updatedTweet: TweetData) => void;
}

export const CustomizerControls: React.FC<CustomizerControlsProps> = ({
  customization,
  onChange,
  tweet,
  onUpdateTweet,
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'content'>('style');

  const [editName, setEditName] = useState(tweet.authorName);
  const [editHandle, setEditHandle] = useState(tweet.authorHandle);
  const [editText, setEditText] = useState(tweet.text);
  const [editDate, setEditDate] = useState(tweet.formattedDate);
  const [editAvatar, setEditAvatar] = useState(tweet.authorAvatar || '');
  const [editMedia, setEditMedia] = useState(tweet.mediaUrl || '');

  const themes: { id: TweetTheme; label: string; color: string }[] = [
    { id: 'dark', label: 'Dark', color: 'bg-black text-white border-neutral-700' },
    { id: 'dim', label: 'Dim', color: 'bg-[#15202b] text-white border-slate-700' },
    { id: 'light', label: 'Light', color: 'bg-white text-slate-900 border-slate-200' },
  ];

  const backgrounds: { id: CardCustomization['customBackground']; label: string; preview: string }[] = [
    { id: 'none', label: 'Transparent', preview: 'bg-slate-800' },
    { id: 'gradient-blue', label: 'Ocean Blue', preview: 'bg-gradient-to-r from-sky-500 to-indigo-600' },
    { id: 'gradient-purple', label: 'Cosmic Purple', preview: 'bg-gradient-to-r from-purple-600 to-rose-600' },
    { id: 'gradient-sunset', label: 'Deep Sunset', preview: 'bg-gradient-to-r from-indigo-900 to-pink-800' },
    { id: 'gradient-emerald', label: 'Emerald Teal', preview: 'bg-gradient-to-r from-emerald-500 to-cyan-600' },
    { id: 'gradient-amber', label: 'Amber Flame', preview: 'bg-gradient-to-r from-amber-500 to-red-600' },
  ];

  const handleSaveEdit = () => {
    onUpdateTweet({
      ...tweet,
      authorName: editName,
      authorHandle: editHandle,
      text: editText,
      formattedDate: editDate,
      authorAvatar: editAvatar || tweet.authorAvatar,
      mediaUrl: editMedia || undefined,
    });
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl font-sans" data-no-screenshot="true">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2 font-semibold text-slate-200 text-sm sm:text-base">
          <Palette className="w-4 h-4 text-sky-400" />
          <span>Customize Screenshot</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('style')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeTab === 'style' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Style
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              activeTab === 'content' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Edit Content
          </button>
        </div>
      </div>

      {activeTab === 'style' ? (
        <div className="space-y-4 text-xs sm:text-sm">
          {/* Theme Selector */}
          <div>
            <label className="block text-slate-400 font-medium mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-sky-400" /> Tweet Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onChange({ ...customization, theme: t.id })}
                  className={`flex items-center justify-between p-2.5 rounded-xl border font-medium transition-all ${t.color} ${
                    customization.theme === t.id ? 'ring-2 ring-sky-500 border-transparent shadow-md' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <span>{t.label}</span>
                  {customization.theme === t.id && <Check className="w-4 h-4 text-sky-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Background Canvas Gradient Selector */}
          <div>
            <label className="block text-slate-400 font-medium mb-2 flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-sky-400" /> Outer Canvas Background
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {backgrounds.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => onChange({ ...customization, customBackground: bg.id })}
                  className={`h-10 rounded-xl border border-slate-700/60 p-1 flex items-center justify-center relative overflow-hidden transition-all ${bg.preview} ${
                    customization.customBackground === bg.id ? 'ring-2 ring-sky-400 border-white' : 'hover:scale-105'
                  }`}
                  title={bg.label}
                >
                  {customization.customBackground === bg.id && (
                    <Check className="w-4 h-4 text-white drop-shadow-md" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Verified Badge Selector */}
          <div>
            <label className="block text-slate-400 font-medium mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Verified Badge
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['blue', 'gold', 'gray', 'none'] as const).map((bType) => (
                <button
                  key={bType}
                  onClick={() => onChange({ ...customization, verifiedType: bType })}
                  className={`p-2 rounded-xl border text-center capitalize font-medium transition-all ${
                    customization.verifiedType === bType
                      ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {bType}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
            <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={customization.showMetrics}
                onChange={(e) => onChange({ ...customization, showMetrics: e.target.checked })}
                className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500/20"
              />
              <span className="text-xs font-medium">Metrics Row</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={customization.showTimestamp}
                onChange={(e) => onChange({ ...customization, showTimestamp: e.target.checked })}
                className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500/20"
              />
              <span className="text-xs font-medium">Timestamp</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={customization.showLogo}
                onChange={(e) => onChange({ ...customization, showLogo: e.target.checked })}
                className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500/20"
              />
              <span className="text-xs font-medium">X Logo</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={customization.showWatermark}
                onChange={(e) => onChange({ ...customization, showWatermark: e.target.checked })}
                className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500/20"
              />
              <span className="text-xs font-medium">Watermark</span>
            </label>
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Author Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Handle (@username)</label>
              <input
                type="text"
                value={editHandle}
                onChange={(e) => setEditHandle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Tweet Text</label>
            <textarea
              rows={3}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Avatar Image URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={editAvatar}
                onChange={(e) => setEditAvatar(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Formatted Timestamp</label>
              <input
                type="text"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:border-sky-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Optional Media Image URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={editMedia}
                onChange={(e) => setEditMedia(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 text-xs focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleSaveEdit}
            className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all mt-2"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Apply Text & Author Edits</span>
          </button>
        </div>
      )}
    </div>
  );
};
