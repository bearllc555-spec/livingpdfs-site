import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Book } from '../types';
import { 
  Library as LibraryIcon,
  Search, 
  Trash2, 
  Globe, 
  Database, 
  AlertCircle,
  Clock,
  CheckCircle,
  FileDown,
  RefreshCw,
  Play,
  BookOpen,
  Sparkles,
  Layers,
  Heart,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BookThumbnail } from './BookThumbnail';

export const Library: React.FC = () => {
  const {
    books,
    user,
    progress,
    toggleSaveBook,
    deleteOwnedBook,
    toggleCacheBook,
    isOffline,
    syncStatus,
    triggerSync,
    setSelectedBookId,
    setIsReaderOpen,
    setCurrentTab
  } = useApp();

  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [confirmText, setConfirmText] = useState('');

  // Find the book with maximum lastReadTime or fallback to first progress/book
  const activeReadingBook = useMemo(() => {
    if (progress && progress.length > 0) {
      const sortedProgress = [...progress].sort((a, b) => new Date(b.lastReadTime).getTime() - new Date(a.lastReadTime).getTime());
      const activeId = sortedProgress[0].bookId;
      return books.find(b => b.id === activeId) || books[0];
    }
    return books[0];
  }, [books, progress]);

  const activeProgressPage = useMemo(() => {
    const p = progress.find(item => item.bookId === activeReadingBook.id);
    return p ? p.currentPage : 4;
  }, [progress, activeReadingBook]);

  const [activeTab, setActiveTab] = useState<'all' | 'owned' | 'saved' | 'cached'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingBookId, setDownloadingBookId] = useState<string | null>(null);
  const [downloadPercent, setDownloadPercent] = useState(0);

  // Manage library filtering logic based on state tags
  const libraryBooks = useMemo(() => {
    return books.filter(b => {
      const owned = user.ownedBookIds.includes(b.id);
      const saved = user.savedBookIds.includes(b.id);
      const cached = user.cachedBookIds.includes(b.id);

      // Match category-selection tabs
      if (activeTab === 'owned' && !owned) return false;
      if (activeTab === 'saved' && !saved) return false;
      if (activeTab === 'cached' && !cached) return false;
      
      // Match query terms
      const matchSearch = 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase());

      // If they don't own it or haven't explicitly saved/bookmarked it, it shouldn't show in library initially unless tab is 'all'
      const inLibraryRange = owned || saved || cached;

      return matchSearch && inLibraryRange;
    });
  }, [books, user, activeTab, searchQuery]);

  const handleDownloadOfflineSimulate = (bookId: string) => {
    if (isOffline) return;
    setDownloadingBookId(bookId);
    setDownloadPercent(0);

    const interval = setInterval(() => {
      setDownloadPercent(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            toggleCacheBook(bookId);
            setDownloadingBookId(null);
          }, 300);
          return 100;
        }
        return prev + 25; // Slower progress step for visual realism
      });
    }, 200);
  };

  const handleReadBook = (bookId: string) => {
    setSelectedBookId(bookId);
    setIsReaderOpen(true);
  };

  const isSaved = (bookId: string) => user.savedBookIds.includes(bookId);

  return (
    <div className="space-y-8 animate-fade-in py-6 selection:bg-[#1a73e8]/10 text-left">
      
      {/* 1. HERO HEADER AREA IN OUTFIT FONT */}
      <div className="text-center py-10 md:py-14 max-w-4xl mx-auto space-y-4">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15] font-outfit">
          Your Living Library Vault.
        </h2>
        <p className="text-base text-zinc-500 dark:text-zinc-450 max-w-xl mx-auto font-outfit font-normal">
          Manage your persistent manuals, trigger standalone offline caches, and oversee active reading progress checkpoints.
        </p>
      </div>

      {/* 2. SPECIFIC CONCEPT SPOTLIGHT */}
      <div className="bg-gradient-to-br from-indigo-50/40 via-blue-50/10 to-transparent dark:from-zinc-950 dark:to-blue-950/10 border border-zinc-200 dark:border-zinc-850 rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center justify-between text-left">
        <div className="space-y-4 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#1a73e8] dark:text-blue-400">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Understanding the Vault Sandbox
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold font-outfit text-zinc-900 dark:text-white tracking-tight leading-tight">
            Natively compiled. Buffered offline. Fully decoupled.
          </h3>
          <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed font-sans">
            Your personal catalog is dynamic. Traditional PDF formats fossilize, but <strong>LivingPDFs.com</strong> guides synchronize 
            delta code changes automatically into a local isolated sandbox. Access files anytime offline, secure your progress variables, and 
            never worry about broken external resources or redundant subscription renewals.
          </p>
          <div className="flex flex-wrap gap-4 pt-1.5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-650 dark:text-zinc-355">
              <CheckCircle className="h-4 w-4 text-emerald-500" /> Sandboxed browser compilation (offline safe)
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#1a73e8] dark:text-blue-400">
              <Layers className="h-4 w-4" /> Seamless revision merge algorithms
            </div>
          </div>
        </div>

        {/* Sync Controls Bento Part */}
        <div className="w-full md:w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[28px] p-6 shadow-md flex flex-col justify-between gap-5 shrink-0">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 block">
              SECURE CRYPTO TUNNEL
            </span>
            <div className="flex items-center gap-1.5 pt-1">
              <span className={`h-2.5 w-2.5 rounded-full ${isOffline ? 'bg-amber-500' : 'bg-[#1a73e8] animate-pulse'}`} />
              <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wide font-sans">
                {isOffline ? 'Offline Standalone' : 'TLS 1.3 Synced'}
              </h4>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed pt-1 font-sans">
              {isOffline 
                ? 'Progression data cached inside memory buffers. Synchronization starts once you are online.' 
                : 'Your reading milestones, owned copies, and annotations are synchronized in real-time.'}
            </p>
          </div>

          <div className="space-y-2.5 border-t border-zinc-100 dark:border-zinc-805/50 pt-3">
            <div className="flex justify-between text-[10px] font-mono text-zinc-450 uppercase">
              <span>SYNC CIPHER:</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-300">AES-256-GCM</span>
            </div>
            <button
              onClick={triggerSync}
              disabled={isOffline || syncStatus === 'syncing'}
              className={`w-full py-2.5 border rounded-full font-sans text-xs font-semibold tracking-wide transition-all uppercase flex items-center justify-center gap-1.5 ${
                isOffline
                  ? 'border-zinc-100 text-zinc-300 dark:border-zinc-850 dark:text-zinc-650 cursor-not-allowed bg-transparent'
                  : syncStatus === 'syncing'
                    ? 'bg-white text-black border-zinc-200 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 cursor-wait'
                    : 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 cursor-pointer'
              }`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncStatus === 'syncing' ? 'animate-spin text-blue-600 dark:text-blue-400' : ''}`} />
              <span>{syncStatus === 'syncing' ? 'Synchronizing Data...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. BENTO 2-COLUMN: HIGHLIGHT TARGET & SECURE METADATA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Bento Left: Focus Tracker */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center text-left hover:shadow-lg transition-all duration-300">
          <div className="relative h-40 w-28 shrink-0 shadow-lg bg-zinc-900 rounded-2xl overflow-hidden select-none border border-zinc-100 dark:border-zinc-800 group">
            <BookThumbnail book={activeReadingBook} showSpine={false} />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-1000 z-10 pointer-events-none" />
          </div>
          
          <div className="space-y-4 flex-1 w-full flex flex-col justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#1a73e8] dark:text-blue-400 font-sans">
                <Clock className="h-3.5 w-3.5" /> PERSONAL FOCUS TRACKER
              </span>
              <h4 className="font-[Arial] font-bold text-lg md:text-xl text-zinc-900 dark:text-white tracking-tight leading-tight">
                {activeReadingBook.title}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-none pb-1">
                by {activeReadingBook.author} • <span className="font-[Arial] font-bold text-[10px] text-zinc-400 uppercase">{activeReadingBook.category}</span>
              </p>
            </div>

            {/* Reading progress slider */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-105 dark:border-zinc-900/60">
              <div className="flex items-center justify-between text-[11px] font-mono leading-none">
                <span className="text-zinc-405">Pages Read Progress</span>
                <span className="font-bold text-[#1a73e8] dark:text-blue-400">
                  Page {activeProgressPage} / {activeReadingBook.totalPages}
                </span>
              </div>
              <div className="h-1.5 bg-zinc-100 dark:bg-zinc-850 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(activeProgressPage / activeReadingBook.totalPages) * 100}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => handleReadBook(activeReadingBook.id)}
              className="py-2.5 px-4 bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-semibold text-xs rounded-full uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow active:scale-[0.98]"
            >
              <Play className="h-3 w-3 fill-current text-white dark:text-zinc-950" />
              <span>Resume Reading Copy</span>
            </button>
          </div>
        </div>

        {/* Bento Right: Vault Stats or Metadata */}
        <div className="lg:col-span-5 bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-905 p-6 md:p-8 rounded-[32px] flex flex-col justify-between text-left space-y-4 md:space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#1a73e8] dark:text-blue-400">
              <Database className="h-3.5 w-3.5" /> TUNNEL TELEMETRY
            </span>
            <h4 className="text-base font-bold font-outfit text-zinc-900 dark:text-white">
              Encryption Metadata Status
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-405 leading-relaxed font-sans">
              Verify communication buffers, device sync mappings, and local sandboxed IndexedDB storage footprints in real-time.
            </p>
          </div>

          <div className="space-y-2.5 text-xs font-mono border-t border-zinc-150 dark:border-zinc-800/60 pt-4 flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-850/50 pb-2">
              <span className="text-zinc-450">CLIENT NODE:</span>
              <span className="font-bold text-zinc-700 dark:text-zinc-300">Living_Reader_Main</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-850/50 pb-2">
              <span className="text-zinc-455">CONNECTED DEVICES:</span>
              <span className="font-bold text-zinc-700 dark:text-zinc-300 text-[10.5px]">2 Active (Edge Studio)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-455">SANDBOX CACHE:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 rounded-full text-[10px]">
                Secured Integrity
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. SELECTION CONTROLS TAB ROUTER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 text-left pt-4">
        <div className="space-y-1">
          <h3 className="text-2xl font-extrabold font-outfit text-zinc-900 dark:text-white tracking-tight">
            Vault Collections
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-450 font-sans">
            Filter catalog indices by license state or physical caches stored in standalone sandbox memory.
          </p>
        </div>

        {/* Modern Rounded Puls Tabs */}
        <div className="flex flex-wrap gap-1.5 font-sans text-xs">
          {(['all', 'owned', 'saved', 'cached'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full font-semibold capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow'
                  : 'bg-zinc-100 text-zinc-650 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-850'
              }`}
            >
              {tab === 'all' ? 'All Volumes' : tab === 'owned' ? 'Owned Guides' : tab === 'saved' ? 'Saved Wishlist' : 'Offline Cached'}
            </button>
          ))}
        </div>
      </div>

      {/* 5. SEARCH FILTER INTEGRATION */}
      <div className="relative">
        <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Filter volumes inside your vault catalog index (by title, author, or keywords)..."
          id="library-filter-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-5 py-3 rounded-full border border-zinc-200 bg-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-550 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:ring-zinc-700 transition-all font-sans placeholder-zinc-400"
        />
      </div>

      {/* 6. LIST LOGIC */}
      {libraryBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed rounded-[32px] border-zinc-200 dark:border-zinc-850 text-center max-w-4xl mx-auto space-y-4">
          <div className="p-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 rounded-full">
            <LibraryIcon className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h4 className="font-outfit text-base font-bold text-zinc-900 dark:text-white">
              Vault filter index empty
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed font-sans">
              No matching manuals found. Any volumes you catalog, lifetime sync licenses, or caches downloaded locally reside here. Choose Showcase to explore new releases.
            </p>
          </div>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2">
          <AnimatePresence mode="popLayout">
            {libraryBooks.map(book => {
              const owned = user.ownedBookIds.includes(book.id);
              const saved = user.savedBookIds.includes(book.id);
              const cached = user.cachedBookIds.includes(book.id);

              // Reading progress
              const progressRef = progress.find(p => p.bookId === book.id);
              const percentage = progressRef 
                ? Math.floor((progressRef.currentPage / book.totalPages) * 100)
                : 0;

              const isDownloadingThis = downloadingBookId === book.id;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 32 }}
                  key={book.id}
                  id={`library-row-${book.id}`}
                  className="group relative bg-white dark:bg-[#1c1c1f]/50 border-[2px] border-zinc-200/80 dark:border-zinc-850 p-6 hover:border-[#1a73e8] dark:hover:border-blue-500 hover:shadow-blue-500/5 transition-all duration-300 rounded-[28px] shadow-lg hover:shadow-xl hover:bg-white/95 dark:hover:bg-[#202024]/85 text-left select-none flex flex-col justify-between gap-5"
                >
                  <div className="flex gap-4 items-start pb-1">
                    {/* Cover Art layout */}
                    <div 
                      onClick={() => {
                        setSelectedBookId(book.id);
                        setCurrentTab('book-detail');
                      }}
                      className="h-28 w-20 bg-zinc-955 overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 rounded-[16px] border border-zinc-900/10 flex-shrink-0 cursor-pointer select-none group"
                    >
                      <BookThumbnail book={book} showSpine={false} className="w-full h-full" imageClassName="absolute inset-0 w-full h-full object-cover select-none group-hover:scale-[1.03] transition-transform duration-500" />
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-[Arial] font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                          {book.category}
                        </span>
                        {owned && (
                          <span className="text-[8px] font-black tracking-widest text-[#10b981] bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded uppercase font-mono">
                            Licensed
                          </span>
                        )}
                      </div>
                      
                      <h3 
                        onClick={() => {
                          setSelectedBookId(book.id);
                          setCurrentTab('book-detail');
                        }}
                        className="font-[Arial] font-bold text-sm md:text-base text-zinc-900 dark:text-white uppercase tracking-tight leading-snug truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {book.title}
                      </h3>
                      
                      <p className="font-sans text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
                        Manual specs by <strong className="font-semibold text-zinc-650 dark:text-zinc-400">{book.author}</strong> — <span className="font-mono text-[9px] text-zinc-450 dark:text-zinc-550 font-bold">{book.currentVersion}</span>
                      </p>

                      {/* Read progress bar */}
                      {owned && (
                        <div className="space-y-1 pt-2.5 max-w-xs">
                          <div className="flex items-center justify-between text-[10px] font-mono leading-none text-zinc-400">
                            <span>READ PERCENTAGE:</span>
                            <span className="font-bold text-zinc-800 dark:text-zinc-200">{percentage}%</span>
                          </div>
                          <div className="h-1 bg-zinc-100 dark:bg-zinc-850 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-600 h-full rounded-full transition-all" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Operational Toolbar */}
                  <div className="pt-3.5 border-t border-zinc-100 dark:border-zinc-900/80 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      
                      {/* Download Cache State Controls */}
                      {isDownloadingThis ? (
                        <button disabled className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-xs font-mono rounded-full border border-gray-200 cursor-default">
                          <div className="h-3.5 w-3.5 border-2 border-black/20 border-t-black animate-spin rounded-full" />
                          <span className="text-[10px] font-bold">{downloadPercent}% Syncing</span>
                        </button>
                      ) : cached ? (
                        <button
                          onClick={() => toggleCacheBook(book.id)}
                          title="Buffered inside sandboxed IndexedDB memory. Click to delete offline copy."
                          className="px-3.5 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 text-[10.5px] font-mono font-bold flex items-center gap-1 border border-blue-600 transition-all cursor-pointer"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Cached Copy</span>
                        </button>
                      ) : (
                        <button
                          disabled={isOffline || !owned}
                          onClick={() => handleDownloadOfflineSimulate(book.id)}
                          id={`btn-cache-library-${book.id}`}
                          title={!owned ? "Buy guide to compile offline standalone" : isOffline ? "Go online to cache files" : "Download files offline"}
                          className={`px-3.5 py-1.5 rounded-full text-[10.5px] font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                            !owned 
                              ? 'border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:border-zinc-700'
                              : isOffline 
                                ? 'border-zinc-200 bg-zinc-100 text-zinc-400 cursor-not-allowed dark:bg-zinc-800 dark:border-zinc-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600 hover:border-blue-700 active:scale-95'
                          }`}
                        >
                          <FileDown className="h-3.5 w-3.5" />
                          <span>Cache Offline</span>
                        </button>
                      )}

                      {/* Deletes owned copy trigger confirmation */}
                      {owned && (
                        <button
                          onClick={() => {
                            setBookToDelete(book);
                            setConfirmText('');
                          }}
                          id={`btn-delete-owned-book-${book.id}`}
                          title="Permanently write-off copy from Cloud catalog"
                          className="p-2 rounded-full border border-red-100 hover:bg-red-50 text-red-500 hover:text-red-600 dark:border-red-955/20 dark:hover:bg-red-955/15 cursor-pointer active:scale-95 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}

                      {/* wishlist remover */}
                      {saved && !owned && (
                        <button
                          onClick={() => {
                            setBookToDelete(book);
                            setConfirmText('');
                          }}
                          id={`btn-remove-bookmark-${book.id}`}
                          title="Remove bookmark from Wishlist"
                          className="p-1.5 rounded-full border border-red-100 hover:bg-red-50 text-red-500 dark:border-red-955/20 dark:hover:bg-red-955/15 cursor-pointer active:scale-95 transition-all"
                        >
                          <Heart className="h-4 w-4 fill-current text-red-500" />
                        </button>
                      )}
                    </div>

                    {/* Primary trigger */}
                    <button
                      onClick={() => handleReadBook(book.id)}
                      id={`btn-read-library-${book.id}`}
                      className="px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 text-xs font-semibold flex items-center gap-1 cursor-pointer active:scale-95 shadow transition-all"
                    >
                      <Play className="h-3 w-3 fill-current text-white dark:text-zinc-950" />
                      <span>{percentage > 0 ? 'Resume Reading' : 'Start Reading'}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* 7. SYSTEM REVISION CONSISTENCY STATS INSIGHT */}
      <div className="bg-gradient-to-br from-stone-50 to-amber-50/20 dark:from-zinc-955 dark:to-stone-900/10 border border-zinc-200 dark:border-zinc-900 rounded-[32px] p-6 max-w-5xl mx-auto my-6 flex items-start gap-4 text-left">
        <div className="p-3 bg-amber-50 dark:bg-amber-955/20 text-amber-600 rounded-2xl">
          <Info className="h-5 w-5" />
        </div>
        <div className="space-y-1.5 flex-1 font-sans">
          <h4 className="text-sm font-bold font-outfit text-zinc-900 dark:text-white">
            Revision Consistency Guarantee
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed leading-relaxed">
            Delta upgrades published by authors Elena and Anthony never clear your highlighted text selections, personal scratchpad templates, 
            or reader progress offsets. Our synchronization server uses split-key TLS indexing to safely merge fresh contents 
            while retaining all client parameters intact. Keep reading with convenience!
          </p>
        </div>
      </div>

      {/* ==================== DOUBLE CONFIRMATION DELETE DEPRECATION MODAL ==================== */}
      <AnimatePresence>
        {bookToDelete && (() => {
          const isWishlistDelete = user.savedBookIds.includes(bookToDelete.id) && !user.ownedBookIds.includes(bookToDelete.id);
          return (
            <div 
              onClick={() => setBookToDelete(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-default bg-black/60 backdrop-blur-md"
            >
              {/* Modal Sheet Container with rounded styling */}
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded-[32px] shadow-2xl p-6 md:p-8 z-10 font-sans cursor-default text-left"
              >
                {/* Alert heading */}
                <div className="flex items-center gap-3 border-b border-red-100 dark:border-red-955/20 pb-4 mb-4 text-left">
                  <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-2xl">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-outfit text-zinc-900 dark:text-white uppercase tracking-wide leading-none pt-0.5">
                      {isWishlistDelete ? 'Remove Bookmark' : 'Confirm Deletion'}
                    </h3>
                    <p className="text-[10px] text-zinc-450 dark:text-zinc-500 font-mono mt-1">
                      Manual ID: {bookToDelete.id}
                    </p>
                  </div>
                </div>

                {/* Warnings copy */}
                <div className="space-y-4 text-left">
                  <p className="text-xs text-zinc-650 dark:text-zinc-300 leading-relaxed font-sans">
                    {isWishlistDelete ? (
                      <span>
                        Are you sure you want to remove <span className="font-extrabold text-zinc-900 dark:text-white">&quot;{bookToDelete.title}&quot;</span> from your wishlist?
                      </span>
                    ) : (
                      <span>
                        You are initiating the removal of <span className="font-extrabold text-zinc-900 dark:text-white">&quot;{bookToDelete.title}&quot;</span> from your vault indices.
                      </span>
                    )}
                  </p>

                  {!isWishlistDelete && (
                    <div className="bg-amber-50 dark:bg-amber-955/15 border border-amber-200/40 dark:border-amber-900/10 p-3.5 text-xs text-amber-800 dark:text-amber-450 leading-relaxed rounded-2xl select-none font-sans">
                      <span className="font-extrabold uppercase block text-[10px] tracking-wider mb-1 text-amber-900 dark:text-amber-450 font-sans">
                        CRITICAL AUDIT:
                      </span>
                      Removing this title strips your Lifetime Sync update credentials. To re-catalog the guide, you must re-verify the active license token or subscribe to infinite plans.
                    </div>
                  )}

                  {/* Secure verification input box */}
                  {!isWishlistDelete && (
                    <div className="space-y-1.5 font-sans">
                      <label htmlFor="delete-confirm-input" className="block text-[10px] font-mono font-extrabold text-zinc-450 uppercase tracking-widest leading-none font-sans">
                        Type the verification word <span className="text-red-500 select-all font-mono font-black">&quot;delete&quot;</span>:
                      </label>
                      <input
                        type="text"
                        id="delete-confirm-input"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Type delete..."
                        className="w-full px-4 py-2.5 border border-zinc-200 bg-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white transition-all rounded-full"
                        autoFocus
                      />
                    </div>
                  )}

                  {/* Dialog Controls */}
                  <div className="flex items-center gap-2 pt-2 text-xs font-semibold">
                    <button
                      onClick={() => setBookToDelete(null)}
                      id="btn-confirm-delete-cancel"
                      className="flex-1 py-3 border border-zinc-200 bg-transparent hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded-full cursor-pointer active:scale-95 transition-all text-center"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!isWishlistDelete && confirmText.trim().toLowerCase() !== 'delete'}
                      onClick={() => {
                        if (isWishlistDelete) {
                          toggleSaveBook(bookToDelete.id);
                          setBookToDelete(null);
                        } else if (confirmText.trim().toLowerCase() === 'delete') {
                          deleteOwnedBook(bookToDelete.id);
                          setBookToDelete(null);
                        }
                      }}
                      id="btn-confirm-delete-action"
                      className={`flex-1 py-3 rounded-full border transition-all cursor-pointer flex items-center justify-center gap-1.5 font-bold ${
                        isWishlistDelete || confirmText.trim().toLowerCase() === 'delete'
                          ? 'bg-red-650 border-red-600 bg-red-600 hover:bg-red-700 text-white shadow shadow-red-500/20 active:scale-95'
                          : 'bg-zinc-150 hover:bg-zinc-150 border-transparent text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600 cursor-not-allowed'
                      }`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>{isWishlistDelete ? 'Remove Copy' : 'Confirm Delete'}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
};
