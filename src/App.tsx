import { useState } from 'react';
import { AppState, TweetData } from './lib/types';
import { getTweetFromUrl } from './lib/tweet-fetcher';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { PostPreview } from './components/PostPreview';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { Footer } from './components/Footer';
import { Sparkles, Image as ImageIcon, ShieldCheck, Zap } from 'lucide-react';

export function App() {
  const [appState, setAppState] = useState<AppState>('empty');
  const [activeTweet, setActiveTweet] = useState<TweetData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  const handleGenerate = async (url: string) => {
    setAppState('loading');
    setErrorMessage(null);

    try {
      const tweetData = await getTweetFromUrl(url);
      setActiveTweet(tweetData);
      setAppState('preview');
    } catch (err) {
      console.error('Error fetching post:', err);
      const msg = err instanceof Error ? err.message : "We couldn't load this post. Make sure the URL points to a public X post and try again.";
      setErrorMessage(msg);
      setAppState('error');
    }
  };

  const handleReset = () => {
    setAppState('empty');
    setActiveTweet(null);
    setErrorMessage(null);
  };

  const handleUseSample = () => {
    handleGenerate('https://x.com/jack/status/20');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
        {/* Empty / Landing Hero Section */}
        {appState === 'empty' && (
          <div className="w-full flex flex-col items-center text-center space-y-6 my-6 sm:my-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Client-Side X Screenshot Generator
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight">
              Turn any X post into a{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400">
                beautiful screenshot
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-xl font-normal leading-relaxed">
              Paste an X post link and instantly turn it into a clean, shareable high-resolution image directly in your browser.
            </p>

            {/* Prominent URL Input Component */}
            <UrlInput onGenerate={handleGenerate} isLoading={false} errorMessage={errorMessage} />

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full pt-10 text-left">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-200">Instant PNG Generation</h3>
                <p className="text-xs text-slate-400">
                  Renders high-dpi images directly in your browser canvas in seconds.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-200">Custom Styling & Themes</h3>
                <p className="text-xs text-slate-400">
                  Switch between Dark, Dim, Light themes, custom gradients & badge types.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-200">100% Private & Serverless</h3>
                <p className="text-xs text-slate-400">
                  Zero backend API servers or databases. Executed entirely client-side.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {appState === 'loading' && (
          <div className="w-full flex flex-col items-center">
            <UrlInput onGenerate={handleGenerate} isLoading={true} />
            <LoadingState />
          </div>
        )}

        {/* Error State */}
        {appState === 'error' && (
          <div className="w-full flex flex-col items-center">
            <UrlInput onGenerate={handleGenerate} isLoading={false} errorMessage={errorMessage} />
            <ErrorState
              message={errorMessage || 'An error occurred while fetching the X post.'}
              onRetry={() => setAppState('empty')}
              onUseSample={handleUseSample}
            />
          </div>
        )}

        {/* Preview State */}
        {appState === 'preview' && activeTweet && (
          <div className="w-full">
            <PostPreview
              tweet={activeTweet}
              onUpdateTweet={(updated) => setActiveTweet(updated)}
              onReset={handleReset}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
