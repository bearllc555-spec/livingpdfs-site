import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Type, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  Download, 
  Lock, 
  CheckCircle, 
  ShieldCheck,
  AlertTriangle,
  Flame,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Reader: React.FC = () => {
  const {
    books,
    selectedBookId,
    setSelectedBookId,
    setIsReaderOpen,
    user,
    progress,
    purchaseBook,
    updateReadingProgress,
    isOffline
  } = useApp();

  const book = books.find(b => b.id === selectedBookId);

  if (!book) return null;

  const userProgress = progress.find(p => p.bookId === book.id);
  const startPage = userProgress ? userProgress.currentPage : 1;

  // Reader Local Custom Styling
  const [currentPageNum, setCurrentPageNum] = useState(startPage);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [fontSize, setFontSize] = useState<'xs' | 'sm' | 'base' | 'lg' | 'xl'>('base');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'mono'>('sans');
  const [themeMode, setThemeMode] = useState<'light' | 'sepia' | 'night'>('sepia');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTtsActive, setIsTtsActive] = useState(false);
  const [ttsIndex, setTtsIndex] = useState(0);

  // Core reading metric timers
  const timeSpentRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Setup reading duration tracking
  useEffect(() => {
    timeSpentRef.current = 0;
    timerRef.current = setInterval(() => {
      timeSpentRef.current += 1;
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        // Persist reading logs on unmount/page change
        if (timeSpentRef.current > 2) {
          updateReadingProgress(book.id, currentPageNum, timeSpentRef.current);
        }
      }
    };
  }, [selectedBookId]);

  // Handle updates when the page number changes
  const handlePageChange = (newPageNum: number) => {
    if (newPageNum < 1 || newPageNum > book.totalPages) return;

    const dir = newPageNum > currentPageNum ? 1 : -1;
    setDirection(dir);

    // Save progress accumulated so far before shifting and record new page instantly
    updateReadingProgress(book.id, newPageNum, timeSpentRef.current);
    timeSpentRef.current = 0; // Reset timer for the new page page-view session

    // Speech control reset
    setIsTtsActive(false);
    setTtsIndex(0);

    setCurrentPageNum(newPageNum);
  };

  const isPageLocked = (pageNumber: number) => {
    // Free accounts can only read pages 1 to 6. Pages 7+ are paywalled.
    const hasOwned = user.ownedBookIds.includes(book.id);
    return !hasOwned && pageNumber > 6;
  };

  const activePageData = book.pages.find(p => p.pageNumber === currentPageNum) || 
    (currentPageNum > 6 ? { pageNumber: currentPageNum, title: 'Locked Chapter Premium Content', content: 'Locked' } : book.pages[0]);

  // Accessibility speech-synthesizer readout
  const speechParagraphs = activePageData.content.split('\n\n').filter(p => p.trim().length > 0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTtsActive) {
      interval = setInterval(() => {
        setTtsIndex(prev => {
          if (prev >= speechParagraphs.length - 1) {
            setIsTtsActive(false);
            return 0;
          }
          return prev + 1;
        });
      }, 5000); // Read a paragraph every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isTtsActive, speechParagraphs.length]);

  // Keyboard page controls for immersion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing if any input or textarea is active where browser defaults/typing apply
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'ArrowLeft') {
        handlePageChange(currentPageNum - 1);
      } else if (e.key === 'ArrowRight') {
        handlePageChange(currentPageNum + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPageNum, book.totalPages]);

  const handleCloseReader = () => {
    if (timeSpentRef.current > 2) {
      updateReadingProgress(book.id, currentPageNum, timeSpentRef.current);
    }
    setIsReaderOpen(false);
    setSelectedBookId(null);
    
    // Clean up query string on exit so refreshing does not force-open the reader again
    if (window.location.search.includes('bookId')) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  };

  // UI styling class selectors
  const themeClasses = {
    light: 'bg-[#fafafa] text-zinc-900 border-zinc-200',
    sepia: 'bg-[#f6f0e2] text-[#433422] border-[#e8dfc7]',
    night: 'bg-[#0f0f12] text-zinc-200 border-zinc-900'
  }[themeMode];

  const fontClasses = {
    sans: 'font-sans tracking-normal leading-relaxed text-left',
    serif: 'font-serif tracking-wide leading-loose text-left',
    mono: 'font-mono text-xs tracking-tight leading-normal text-left'
  }[fontFamily];

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }[fontSize];

  const completionPercentage = Math.min(100, Math.max(0, Math.round((currentPageNum / book.totalPages) * 100)));
  const radius = 12;
  const strokeWidth = 2.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 text-white select-none overflow-hidden font-sans text-left">
      
      {/* Reader Superior Header Bar */}
      <div className="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleCloseReader}
            id="btn-back-to-home"
            className="mr-1 py-1.5 px-2.5 rounded-none bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer border border-zinc-750 font-sans text-xs font-bold shadow-sm"
            title="Back to Home Gallery"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Exit Reader</span>
          </button>
          
          <div className={`h-8 w-6 rounded-none bg-gradient-to-br ${book.thumbnailColor} flex items-center justify-center text-[7px] font-bold font-mono shadow`}>
            PDF
          </div>
          <div className="text-left">
            <h3 className="font-sans text-xs sm:text-sm font-black text-white leading-none">
              {book.title}
            </h3>
            <p className="font-mono text-[9px] text-blue-400 font-semibold uppercase tracking-wider mt-1 flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              Living Version {book.currentVersion}
            </p>
          </div>
        </div>

        {/* Reader Global Sync Mode Status Notification */}
        {isOffline && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-none text-[10px] text-amber-500 font-mono">
            <AlertTriangle className="h-3 w-3" />
            <span>Progress updates cached locally in sandbox offline</span>
          </div>
        )}

        {/* Controls block */}
        <div className="flex items-center gap-3">
          
          {/* Circular SVG Completion Progress */}
          <div 
            id="reader-header-progress"
            className="flex items-center gap-2"
            title={`Completed: ${completionPercentage}% (${currentPageNum} of ${book.totalPages} pages)`}
          >
            <div className="relative flex items-center justify-center h-9 w-9">
              <svg className="h-9 w-9 -rotate-90 transform">
                {/* Background Circle */}
                <circle
                  cx="18"
                  cy="18"
                  r={radius}
                  className="stroke-zinc-800"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                {/* Animated Foreground Circle */}
                <motion.circle
                  cx="18"
                  cy="18"
                  r={radius}
                  className="stroke-blue-500"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset }}
                  transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
                  strokeLinecap="round"
                />
              </svg>
              {/* Center percentage label */}
              <span className="absolute font-mono text-[8px] font-bold text-zinc-300">
                {completionPercentage}%
              </span>
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="font-mono text-[8px] text-zinc-505 uppercase tracking-widest font-bold">Progress</span>
              <span className="font-mono text-[10px] font-extrabold text-zinc-300 mt-0.5">
                {currentPageNum}<span className="text-zinc-600 mx-0.5">/</span>{book.totalPages} <span className="text-[8px] text-zinc-500 font-normal">pp</span>
              </span>
            </div>
          </div>

          <div className="hidden sm:block h-6 w-px bg-zinc-800 m-1" />

          {/* Text Settings Widget Drawer Selector */}
          <div className="relative text-left">
            <button
              id="btn-reader-styling"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-none transition-colors cursor-pointer"
              title="Typography Controls"
            >
              <Type className="h-4.5 w-4.5" />
            </button>

            {/* Typography Dropdown Bubble with proper overlay index */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-none shadow-2xl p-4 z-50 space-y-4 text-xs text-left"
                >
                  <div className="flex items-center justify-between font-bold border-b border-zinc-805 pb-2">
                    <span>Reading Appearance</span>
                    <button onClick={() => setIsMenuOpen(false)} className="text-zinc-505 hover:text-white">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Themes choice */}
                  <div>
                    <span className="font-mono text-[10px] text-zinc-500 block mb-1.5">BACKGROUND PALETTE</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['light', 'sepia', 'night'] as const).map(th => (
                        <button
                          key={th}
                          onClick={() => setThemeMode(th)}
                          id={`theme-btn-${th}`}
                          className={`py-1.5 px-2 rounded-none font-sans border text-center font-bold capitalize transition-all cursor-pointer ${
                            themeMode === th 
                              ? 'border-blue-500 text-blue-405 bg-zinc-800' 
                              : 'border-zinc-800 text-zinc-400 bg-zinc-950/40 hover:bg-zinc-800/50'
                          }`}
                        >
                          {th}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Selection */}
                  <div>
                    <span className="font-mono text-[10px] text-zinc-505 block mb-1.5">TYPOGRAPHY FACE</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['sans', 'serif', 'mono'] as const).map(fn => (
                        <button
                          key={fn}
                          onClick={() => setFontFamily(fn)}
                          className={`py-1 px-2 rounded-none border font-mono capitalize text-center transition-all cursor-pointer ${
                            fontFamily === fn
                              ? 'border-blue-505 text-blue-400 bg-zinc-800'
                              : 'border-zinc-800 text-zinc-400 bg-zinc-950/40'
                          }`}
                        >
                          {fn}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Sizing scaling buttons */}
                  <div>
                    <span className="font-mono text-[10px] text-zinc-505 block mb-1.5">SCALE PREVIEW SIZE</span>
                    <div className="flex items-center justify-between gap-1">
                      {(['xs', 'sm', 'base', 'lg', 'xl'] as const).map(sz => (
                        <button
                          key={sz}
                          onClick={() => setFontSize(sz)}
                          className={`flex-1 py-1 rounded-none border font-mono uppercase text-center text-[10px] transition-all cursor-pointer ${
                            fontSize === sz
                              ? 'border-blue-500 text-blue-400 bg-zinc-800'
                              : 'border-zinc-805 text-zinc-400 bg-zinc-950/40'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Accessible Read Aloud (TTS Synthesis Simulation) Toggle */}
          <button
            onClick={() => setIsTtsActive(!isTtsActive)}
            id="btn-reader-speech"
            className={`p-2 rounded-none transition-colors cursor-pointer ${
              isTtsActive ? 'text-blue-400 bg-zinc-850' : 'text-zinc-400 hover:text-white'
            }`}
            title="Screen Reader - Read Aloud Assist"
          >
            {isTtsActive ? <Volume2 className="h-4.5 w-4.5 animate-pulse" /> : <VolumeX className="h-4.5 w-4.5" />}
          </button>

          <div className="h-6 w-px bg-zinc-800" />

          {/* Close trigger handles metadata */}
          <button
            onClick={handleCloseReader}
            id="btn-close-reader"
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-none transition-colors cursor-pointer active:scale-95"
            title="Exit Reader Grid"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Reader Main Content Block */}
      <div className={`flex-1 overflow-y-auto px-4 py-8 sm:px-6 md:px-8 transition-colors duration-300 ${themeClasses} text-left`}>
        <div className="mx-auto max-w-2xl relative text-left">
          
          <AnimatePresence mode="wait text-left">
            {isPageLocked(currentPageNum) ? (
              
              /* HIGH-FIDELITY LUXURY PAYWALL CONTAINER */
              <motion.div
                key="paywall-lock"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="my-12 p-8 md:p-12 bg-white/5 dark:bg-black/40 border border-orange-500/20 rounded-none text-center backdrop-blur-md shadow-2xl relative overflow-hidden"
              >
                {/* Decorative absolute components */}
                <div className="absolute right-0 top-0 -mr-16 -mt-16 h-36 w-36 rounded-full bg-orange-600/10 blur-2xl font-serif" />
                <div className="absolute left-0 bottom-0 -ml-16 -mb-16 h-36 w-36 rounded-full bg-blue-600/10 blur-2xl font-serif" />

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-none bg-orange-500/10 text-orange-600">
                  <Lock className="h-7 w-7 animate-bounce" />
                </div>

                <h2 className="font-sans text-xl md:text-3xl font-extrabold tracking-tight text-gray-955 dark:text-white leading-tight">
                  Preview Limit Reached
                </h2>
                <p className="font-sans text-sm text-gray-500 dark:text-zinc-400 mt-2 max-w-md mx-auto">
                  An elegant free account provides instant access to page 1-6. Purchase the full living book to unlock all <span className="font-bold text-gray-901 dark:text-white">{book.totalPages} pages</span> and capture lifetime revision notifications!
                </p>

                {/* Grid details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 text-left max-w-md mx-auto">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-sans text-xs font-bold text-gray-900 dark:text-white">Living Sync and Alerts</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Prompt actions whenever the author updates schemas or text blocks.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-sans text-xs font-bold text-gray-900 dark:text-white">Offline Storage Mode</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-sans">Full local caching allows late-night flights or tube reading without cells.</p>
                    </div>
                  </div>
                </div>

                {/* Buy button interface */}
                <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col justify-center items-center gap-3">
                  <div className="text-center">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">LIFETIME ACCESS AND UPDATES</span>
                    <span className="block font-sans text-3xl font-black text-gray-950 dark:text-white mt-0.5">
                      ${book.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={() => {
                        purchaseBook(book.id);
                      }}
                      id="btn-paywall-unlock"
                      className="w-full sm:w-auto px-10 py-3 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-none shadow-xl shadow-blue-700/10 hover:shadow-blue-600/20 hover:scale-[1.01] transition-all cursor-pointer animate-pulse hover:animate-none"
                    >
                      Unlock Living Copy Now
                    </button>

                    <button
                      onClick={handleCloseReader}
                      id="btn-paywall-close"
                      className="w-full sm:w-auto px-6 py-3 text-sm font-bold bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-none transition-all cursor-pointer"
                    >
                      Return to catalog
                    </button>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-500">Secure AES-256 cloud checkout via LivingPDFs.com</p>
                </div>

              </motion.div>
            ) : (
              
              /* STYLED TEXT CONTAINER */
              <motion.article
                key={`page-${currentPageNum}`}
                initial={{ opacity: 0, x: direction * 150 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 150 }}
                transition={{ 
                  type: "spring",
                  stiffness: 280,
                  damping: 28,
                  mass: 0.8
                }}
                className={`${fontClasses} ${sizeClasses} space-y-6 pb-20 select-text text-left`}
              >
                
                {/* Micro Headers */}
                <div className="flex items-center justify-between border-b border-dashed pb-3 text-[10px] tracking-widest uppercase font-mono text-zinc-500">
                  <span>CHAPTER {Math.ceil(currentPageNum / 2)}</span>
                  <span>PAGE {currentPageNum} OF {book.totalPages}</span>
                </div>

                <h1 className="font-sans font-black text-2xl md:text-3xl tracking-tight leading-tight mt-6 dark:text-white text-left font-serif text-[#1D3D33] dark:text-stone-100">
                  {activePageData.title}
                </h1>

                {/* Audio Screen Reader subtitler bar */}
                {isTtsActive && (
                  <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-none flex items-start gap-2 text-xs font-mono text-blue-600 select-none text-left">
                    <Volume2 className="h-4 w-4 text-blue-500 animate-bounce flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Text-to-Speech active:</span>
                      <p className="italic text-gray-900 dark:text-stone-200 mt-1">&ldquo;{speechParagraphs[ttsIndex]}&rdquo;</p>
                    </div>
                  </div>
                )}

                {/* Substantive text paragraph loops */}
                <div className="space-y-4 text-left">
                  {speechParagraphs.map((para, i) => {
                    const isCode = para.trim().startsWith('```');
                    const isReadingTtsParagraph = isTtsActive && i === ttsIndex;

                    if (isCode) {
                      // Format code segments beautifully in JetBrains Mono
                      const codeContent = para.replace(/```[a-z]*/g, '').trim();
                      return (
                        <pre 
                          key={i} 
                          className={`p-4 rounded-none border font-mono text-xs overflow-x-auto select-all text-left ${
                            themeMode === 'night' 
                              ? 'bg-zinc-950 text-sky-305 border-zinc-900' 
                              : 'bg-zinc-50 text-sky-800 border-zinc-200'
                          }`}
                        >
                          <code>{codeContent}</code>
                        </pre>
                      );
                    }

                    return (
                      <p 
                        key={i} 
                        className={`transition-all duration-300 text-left ${
                          isReadingTtsParagraph 
                            ? 'bg-blue-500/10 border-l-2 border-blue-500 pl-3 py-1 font-semibold' 
                            : ''
                        }`}
                      >
                        {para}
                      </p>
                    );
                  })}
                </div>

                {/* Visual illustration slot representational card */}
                {currentPageNum === 3 && (
                  <div className="bg-zinc-900/10 border border-zinc-900/15 dark:bg-zinc-900/40 dark:border-zinc-800 p-6 rounded-none flex flex-col items-center justify-center text-center select-none font-sans mt-4">
                    <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                    <span className="font-mono text-[9px] text-zinc-500 dark:text-zinc-500 uppercase tracking-widest font-semibold block">FIGURE 1.2: CLUSTER CONFIGURATION</span>
                    <p className="text-[11px] text-gray-550 dark:text-zinc-400 max-w-sm mt-1 leading-snug">
                      Schematic diagram detailing low latency microservice proxies mapping Gemini endpoints down to local Sandboxes.
                    </p>
                  </div>
                )}

              </motion.article>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Reader Bottom Controls Shelf */}
      <div className="flex h-16 items-center justify-between border-t border-zinc-800 bg-zinc-900 px-4 sm:px-6 select-none">
        
        {/* Previous page navigation */}
        <button
          onClick={() => handlePageChange(currentPageNum - 1)}
          disabled={currentPageNum <= 1}
          id="btn-prev-page"
          className="flex items-center gap-1.5 py-2 px-3 text-xs bg-zinc-800 hover:bg-zinc-750 text-white rounded-none transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        {/* Range Slider for rapid browsing with keyboard navigation guidelines */}
        <div className="flex items-center gap-3 w-5/12 max-w-xs md:max-w-md">
          <input
            type="range"
            min="1"
            max={book.totalPages}
            value={currentPageNum}
            id="reader-page-slider"
            aria-label={`Page Scroller, current ${currentPageNum} of ${book.totalPages}`}
            onChange={(e) => handlePageChange(Number(e.target.value))}
            className="w-full h-1 bg-zinc-805 rounded-none appearance-none cursor-pointer accent-blue-500 focus:outline-none"
          />
          <span className="font-mono text-xs text-zinc-400 min-w-max hidden sm:inline">
            Page {currentPageNum} / {book.totalPages}
          </span>
        </div>

        {/* Fast Page Forward button */}
        <button
          onClick={() => handlePageChange(currentPageNum + 1)}
          disabled={currentPageNum >= book.totalPages}
          id="btn-next-page"
          className="flex items-center gap-1.5 py-2 px-3 text-xs bg-zinc-800 hover:bg-zinc-750 text-white rounded-none transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>

      </div>
    </div>
  );
};
