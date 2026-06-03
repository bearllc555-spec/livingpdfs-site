import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Showcase } from './components/Showcase';
import { Library } from './components/Library';
import { BookDetail } from './components/BookDetail';
import { Analytics } from './components/Analytics';
import { Notifications } from './components/Notifications';
import { Pricing } from './components/Pricing';
import { Reader } from './components/Reader';
import { AuthModal } from './components/AuthModal';
import { 
  WifiOff, 
  HelpCircle, 
  BookOpen, 
  X,
  Keyboard,
  Info
} from 'lucide-react';

function DashboardContent() {
  const { 
    currentTab, 
    isReaderOpen, 
    isOffline, 
    user 
  } = useApp();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showKeyboardGuide, setShowKeyboardGuide] = useState(false);

  // Keyboard accessibility listen loops
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // General exit triggers
      if (e.key === 'Escape') {
        setIsAuthModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#f8f8f7] via-white to-[#f1eff6] dark:from-[#131315] dark:via-[#161619] dark:to-[#101011] text-gray-900 dark:text-zinc-100 transition-colors duration-300 relative overflow-hidden">
      {/* Ambient aesthetic glow grids to create deep dimensional visual space */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 h-[500px] w-[500px] rounded-full bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08] blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 h-[500px] w-[500px] rounded-full bg-blue-500/[0.04] dark:bg-blue-500/[0.08] blur-3xl pointer-events-none z-0" />
      
      {/* Top Navigation */}
      <Navigation onOpenAuth={() => setIsAuthModalOpen(true)} />

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-0 pb-20 relative z-10">
        
        {/* Offline simulated banner indicator */}
        {isOffline && (
          <div className="mb-6 flex items-center justify-between gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 p-3.5 rounded-none animate-pulse">
            <div className="flex items-center gap-2">
              <WifiOff className="h-4.5 w-4.5 flex-shrink-0" />
              <span className="font-sans text-xs font-semibold">
                Offline Standalone Mode Activated. You can only read books downloaded to cache in &apos;My Library&apos;.
              </span>
            </div>
          </div>
        )}

        {/* Dynamic Inner Tab Router */}
        {currentTab === 'showcase' && <Showcase />}
        {currentTab === 'library' && <Library />}
        {currentTab === 'pricing' && <Pricing />}
        {currentTab === 'analytics' && <Analytics />}
        {currentTab === 'notifications' && <Notifications />}
        {currentTab === 'book-detail' && <BookDetail />}

      </main>

      {/* Embedded Floating Keyboard Guide Indicator (Accessibility Element) */}
      <div className="fixed bottom-4 left-4 z-30 select-none hidden sm:block text-left">
        {showKeyboardGuide ? (
          <div className="bg-zinc-90 w-auto bg-zinc-900 text-white border border-zinc-800 p-3.5 rounded-none shadow-2xl max-w-xs space-y-2 text-xs font-sans">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 font-bold">
              <span className="flex items-center gap-1"><Keyboard className="h-3.5 w-3.5 text-blue-400" /> Key Controls</span>
              <button onClick={() => setShowKeyboardGuide(false)} className="text-zinc-400 hover:text-white">
                <X className="h-3 w-3" />
              </button>
            </div>
            <ul className="space-y-1 font-mono text-[10px] text-zinc-450">
              <li className="flex justify-between"><span>Esc</span> <span className="text-white font-bold">Exit sheet / reader</span></li>
              <li className="flex justify-between"><span>← / →</span> <span className="text-white font-bold">Next or Previous Page</span></li>
              <li className="flex justify-between"><span>Tab</span> <span className="text-white font-bold">Focus next component</span></li>
            </ul>
          </div>
        ) : (
          <button
            onClick={() => setShowKeyboardGuide(true)}
            id="btn-accessibility-help"
            title="Read Keyboard Access Help Guide"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-90 w-auto bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-none text-xs font-medium cursor-pointer transition-all shadow-md"
          >
            <Keyboard className="h-3.5 w-3.5 text-blue-400" />
            <span>Key Guide</span>
          </button>
        )}
      </div>

      {/* Reader overlay sheet (Takes client viewport fully for maximum focus focus focus) */}
      {isReaderOpen && <Reader />}

      {/* Auth overlay modular modal */}
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}

