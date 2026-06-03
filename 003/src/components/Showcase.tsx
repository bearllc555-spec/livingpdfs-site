import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Book } from '../types';
import { 
  Search, 
  ArrowRight, 
  BookOpen, 
  History, 
  Flame, 
  Sparkles, 
  Heart,
  Check,
  RefreshCw,
  Clock,
  Lock,
  Compass,
  Download,
  CheckCircle,
  ExternalLink,
  Laptop,
  Globe,
  Database,
  ShieldCheck,
  AlertTriangle,
  Play,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BookCover } from './BookCover';
import { BookThumbnail } from './BookThumbnail';

export const Showcase: React.FC = () => {
  const {
    books,
    user,
    toggleSaveBook,
    setSelectedBookId,
    setIsReaderOpen,
    purchaseBook,
    setCurrentTab
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBookDetail, setSelectedBookDetail] = useState<Book | null>(null);
  
  // Showcase Version Alert/Notification States
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadPercent, setDownloadPercent] = useState(0);
  const [showLargeUpdatedCover, setShowLargeUpdatedCover] = useState(false);

  // Categories extracted dynamically from books list
  const categories = useMemo(() => {
    const list = new Set(books.map(b => b.category));
    return ['All', ...Array.from(list)];
  }, [books]);

  // Main flagship featured book for the top banner (Tailwind CSS v4.0 Mastery Guide)
  const flagshipBook = useMemo(() => {
    return books.find(b => b.id === 'tailwind-v4') || books[0];
  }, [books]);

  const activeBook = useMemo(() => {
    return selectedBookDetail || (showLargeUpdatedCover ? flagshipBook : null);
  }, [selectedBookDetail, showLargeUpdatedCover, flagshipBook]);

  // Filtering implementation for the bottom catalog
  const filteredBooks = useMemo(() => {
    return books.filter(b => {
      const matchSearch = 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = selectedCategory === 'All' || b.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [books, searchQuery, selectedCategory]);

  // Simulate Version Update download flow
  const handleDownloadLatestVersion = () => {
    setIsDownloading(true);
    setDownloadPercent(0);

    const interval = setInterval(() => {
      setDownloadPercent(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDownloading(false);
            setShowUpdateAlert(false);
            setShowLargeUpdatedCover(true); // Bring up the beautiful high-fidelity modal display
          }, 350);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  const handleReadPreview = (bookId: string) => {
    setSelectedBookId(bookId);
    setIsReaderOpen(true);
  };

  const isSaved = (bookId: string) => user.savedBookIds.includes(bookId);
  const isOwned = (bookId: string) => user.ownedBookIds.includes(bookId);

  return (
    <div className="animate-fade-in space-y-6 text-left">

      {/* ==================== 1. BRAND HERO HERO BANNER & SPOTLIGHTS ==================== */}
      <div className="relative z-10 w-full">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Hero text descriptor */}
          <div className="lg:col-span-7 space-y-6 relative z-10">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-[1.1] font-outfit">
                Handcrafted textbooks <br />
                that live on your screen.
              </h1>
              <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-450 leading-relaxed font-sans max-w-xl">
                We believe software manuals shouldn’t be dead PDFs the day they are printed. 
                Our living specs sync dynamically with the developer ecosystem, featuring built-in sandboxes, compiler nodes, and real-time authors' logs.
              </p>
            </div>

            {/* Ingest or support bullet indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-150 dark:border-zinc-900/60">
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[11px] font-mono font-black text-zinc-800 dark:text-zinc-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  Code Sandbox
                </span>
                <p className="text-[10.5px] text-zinc-450 dark:text-zinc-500 font-sans leading-snug">
                  Edit & run code directly inside the book chapters.
                </p>
              </div>
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[11px] font-mono font-black text-zinc-800 dark:text-zinc-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Patches
                </span>
                <p className="text-[10.5px] text-zinc-450 dark:text-zinc-500 font-sans leading-snug">
                  Receive hotfixes as framework guidelines shift.
                </p>
              </div>
              <div className="space-y-1">
                <span className="flex items-center gap-1.5 text-[11px] font-mono font-black text-zinc-800 dark:text-zinc-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Offline Cache
                </span>
                <p className="text-[10.5px] text-zinc-450 dark:text-zinc-500 font-sans leading-snug">
                  Offline-first persistence allows learning anywhere.
                </p>
              </div>
            </div>
          </div>

          {/* Flagship Featured book spotlight */}
          <div className="lg:col-span-5 bg-white dark:bg-[#1c1c1f]/50 border border-zinc-200/80 dark:border-zinc-850 p-6 rounded-[28px] shadow-lg flex flex-col sm:flex-row items-center gap-6 relative group select-none z-10">
            
            {/* Absolute indicator */}
            <span className="absolute -top-3 left-6 bg-gradient-to-r from-blue-600 to-[#1a73e8] text-white font-mono text-[8px] font-black uppercase px-2.5 py-1 tracking-widest rounded-full shadow-sm z-30 select-none">
              FLAGSHIP MANUAL
            </span>

            {/* Quick action cover portal */}
            <div 
              onClick={() => {
                setSelectedBookId(flagshipBook.id);
                setCurrentTab('book-detail');
              }}
              className="relative w-28 sm:w-32 aspect-[3/4] bg-zinc-900 border border-zinc-900/10 shadow-xl overflow-hidden rounded-[16px] flex-shrink-0 cursor-pointer group-hover:scale-[1.03] transition-transform duration-500"
            >
              <BookThumbnail book={flagshipBook} imageClassName="absolute inset-0 w-full h-full object-cover select-none" />
              {/* Sheen Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-1000 ease-in-out z-20 pointer-events-none" />
            </div>

            {/* Content info wrapper */}
            <div className="flex-1 space-y-3.5 text-center sm:text-left min-w-0">
              <div>
                <span className="font-[Arial] font-bold text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-widest block">
                  {flagshipBook.category}
                </span>
                <h3 
                  onClick={() => {
                    setSelectedBookId(flagshipBook.id);
                    setCurrentTab('book-detail');
                  }}
                  className="font-[Arial] font-bold text-xs text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase leading-tight tracking-tight mt-1 cursor-pointer line-clamp-2"
                >
                  {flagshipBook.title}
                </h3>
                <p className="font-sans text-[11px] text-zinc-450 dark:text-zinc-500 mt-1">
                  Revisioned by <strong className="font-semibold text-zinc-700 dark:text-zinc-300">{flagshipBook.author}</strong>
                </p>
              </div>

              {/* Version pill indicators */}
              <div className="flex items-center justify-center sm:justify-start gap-1 text-[10px] font-mono select-none">
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-605 dark:text-emerald-400 font-extrabold uppercase rounded border border-emerald-500/15">
                  {flagshipBook.currentVersion}
                </span>
                <span className="text-zinc-300 dark:text-zinc-800">/</span>
                <span className="text-zinc-450 dark:text-zinc-500 font-bold">{flagshipBook.totalPages} PP</span>
              </div>

              {/* Action trigger button */}
              <button
                onClick={() => {
                  setSelectedBookId(flagshipBook.id);
                  setCurrentTab('book-detail');
                }}
                className="w-full sm:w-auto px-4 py-2 bg-zinc-950 hover:bg-zinc-850 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow cursor-pointer"
              >
                <Play className="h-2.5 w-2.5 fill-current" />
                <span>Examine Blueprint</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* ==================== 2. MAIN CATALOG CONTAINER ==================== */}
      <div className="relative z-10 pt-2 space-y-6">
        
        {/* Action Required Alert Banner */}
        <AnimatePresence>
          {showUpdateAlert && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="relative z-20 border-b border-blue-500/20 bg-blue-500/5 dark:bg-blue-950/20 p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 w-full sm:w-auto text-left relative pl-12">
                <div className="absolute -top-1 left-0 h-9 w-9 rounded-none bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-[Arial] font-bold text-xs text-gray-911 dark:text-white leading-snug">
                    Action Required: Flagship PDF Guide Has An Active Version!
                  </h4>
                  <p className="font-sans text-[11px] text-gray-500 dark:text-zinc-400">
                    Living PDFs get synced improvements dynamically. Standard updates sync structural formatting and accessibility enhancements.
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-auto flex-shrink-0 flex justify-end">
                {isDownloading ? (
                  <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-805 rounded-none p-2 px-3 w-48 space-y-1 shadow-sm text-left">
                    <div className="flex items-center justify-between text-[9px] font-mono leading-none">
                      <span className="text-gray-450 dark:text-zinc-505">SYNCING COPY...</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{downloadPercent}%</span>
                    </div>
                    <div className="h-1 w-full bg-gray-100 dark:bg-zinc-800 rounded-none overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-none transition-all duration-100" style={{ width: `${downloadPercent}%` }} />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleDownloadLatestVersion}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-505 text-white rounded-none font-sans text-[11px] font-bold transition-all shadow cursor-pointer uppercase flex items-center justify-center gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Latest version</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Viewport content */}
        <div className="space-y-8">

          {/* Subheader Toolbar controllers */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-105 dark:border-zinc-900 pb-5 text-left">

            {/* Filter toolbar inputs */}
            <div className="relative w-full flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Filter showcase..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 text-xs bg-white dark:bg-[#1c1c1f]/50 border-[2px] border-zinc-200/80 dark:border-zinc-850 rounded-full focus:outline-none focus:border-[#1a73e8] focus:bg-white dark:focus:bg-[#202024]/85 dark:focus:border-blue-500 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all font-sans font-medium text-zinc-900 dark:text-white shadow-sm hover:border-zinc-300 dark:hover:border-zinc-750"
              />
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 text-[10.5px] font-[Arial] rounded-full uppercase tracking-wider transition-all cursor-pointer border-[2px] ${
                    selectedCategory === cat
                      ? 'bg-[#1a73e8] border-[#1a73e8] text-white shadow-md shadow-blue-500/10'
                      : 'bg-white dark:bg-[#1c1c1f]/50 text-zinc-500 dark:text-zinc-400 border-zinc-200/80 dark:border-zinc-850 hover:border-[#1a73e8] hover:text-[#1a73e8] dark:hover:border-blue-500 dark:hover:text-blue-400 hover:shadow-blue-500/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>          {/* 
            ==================== 3. DOCUMENT COVERS GRID WITH ROUNDED EDGE DESIGN ==================== 
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-6">
            {filteredBooks.map(book => {
              const owned = isOwned(book.id);

              return (
                <div
                  key={book.id}
                  onClick={() => {
                    setSelectedBookId(book.id);
                    setCurrentTab('book-detail');
                  }}
                  className="group relative bg-white dark:bg-[#1c1c1f]/50 border-[2px] border-zinc-200/80 dark:border-zinc-850 p-6 hover:border-[#1a73e8] dark:hover:border-blue-500 hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer flex flex-col justify-between rounded-[28px] shadow-lg hover:shadow-xl hover:bg-white/95 dark:hover:bg-[#202024]/85 text-left select-none"
                >
                  <div className="space-y-4">
                    {/* Portrait Artwork Spine Wrapper with smooth inner backdrop frame */}
                    <div className="relative w-full aspect-[3/4] bg-zinc-950 overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 rounded-[20px] border border-zinc-900/10">
                      <BookThumbnail book={book} className="w-full h-full" imageClassName="absolute inset-0 w-full h-full object-cover select-none group-hover:scale-[1.03] transition-transform duration-500" />
                      
                      {/* Floating New/Popular badge highlights */}
                      {book.isNew && (
                        <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-blue-600 to-[#1a73e8] text-white font-mono text-[7px] font-black uppercase px-2 py-0.5 tracking-wider rounded-full shadow-sm z-30 select-none">
                          NEW
                        </span>
                      )}
                      
                      {book.isPopular && (
                        <span className="absolute top-2.5 right-2.5 bg-amber-500 text-black font-mono text-[7px] font-black uppercase px-2 py-0.5 tracking-wider rounded-full shadow-sm z-30 select-none">
                          POPULAR
                        </span>
                      )}

                      {/* Interactive Hover Sheen Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-1000 ease-in-out z-25 pointer-events-none" />
                    </div>

                    {/* Metadata indicators below cover */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-[9px] font-mono font-extrabold">
                        <span className="uppercase font-[Arial] font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                          {book.category}
                        </span>
                        
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[8px] text-zinc-450 dark:text-zinc-500 tracking-widest uppercase">
                            LIVE SPEC
                          </span>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <h4 className="text-sm font-[Arial] font-bold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-405 transition-colors uppercase tracking-tight leading-snug">
                          {book.title}
                        </h4>
                        <p className="text-[10.5px] text-zinc-400 dark:text-zinc-500 truncate font-sans">
                          Manual specs by <strong className="font-semibold text-zinc-650 dark:text-zinc-400">{book.author}</strong>
                        </p>
                      </div>

                      {/* Info mini indicators specs mapping */}
                      <div className="flex flex-wrap gap-1.5 pb-0.5 select-none text-[8px] font-mono text-zinc-500 dark:text-zinc-400">
                        <span className="border border-zinc-150 dark:border-zinc-900 px-2 py-0.5 rounded-[6px] bg-zinc-50/50 dark:bg-zinc-900/30">
                          {book.totalPages} BOUND PP
                        </span>
                        <span className="border border-zinc-150 dark:border-zinc-900 px-2 py-0.5 rounded-[6px] bg-zinc-50/50 dark:bg-zinc-900/30">
                          VERS {book.currentVersion}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between gap-2 flex-shrink-0">
                    <div className="text-left flex flex-col justify-center select-none">
                      <span className="text-[8px] font-mono font-bold text-zinc-400 dark:text-zinc-505 uppercase tracking-wide leading-none">
                        License Node
                      </span>
                      {owned ? (
                        <span className="text-emerald-600 dark:text-emerald-450 font-[Arial] text-[10.5px] font-bold uppercase tracking-widest block mt-1 leading-none">
                          ACTIVE OWN
                        </span>
                      ) : (
                        <span className="text-[#1a73e8] dark:text-blue-400 font-[Arial] text-[11px] font-bold block mt-1 leading-none">
                          ${book.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveBook(book.id);
                        }}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                          isSaved(book.id)
                            ? 'text-red-500 bg-red-500/5 border-red-200 dark:border-red-950/20'
                            : 'text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/60'
                        }`}
                        title={isSaved(book.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        <Heart className={`h-3 w-3 ${isSaved(book.id) ? 'fill-current text-red-500' : ''}`} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBookId(book.id);
                          setCurrentTab('book-detail');
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-zinc-950 hover:bg-zinc-850 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 text-[9px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-1 cursor-pointer font-outfit"
                      >
                        <Play className="h-2.5 w-2.5 fill-current" />
                        <span>Inspect Spec</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Re-sync logs for verification */}
          {!showUpdateAlert && (
            <div className="pt-4 border-t border-gray-100 dark:border-zinc-900 text-center">
              <button
                onClick={() => {
                  setShowUpdateAlert(true);
                  setDownloadPercent(0);
                }}
                className="font-mono text-[10px] text-blue-500 hover:text-blue-600 hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" /> Re-prime flagship update alerts
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ==================== 4. MASSIVE HIGH-FIDELITY DETAILED DISPLAY MODAL ==================== */}
      <AnimatePresence>
        {activeBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop with elegant blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedBookDetail(null);
                setShowLargeUpdatedCover(false);
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            {/* Pristine white card modal container */}
            <motion.div 
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-850 rounded-none p-6 md:p-8 shadow-2xl overflow-hidden text-gray-900 dark:text-zinc-100 z-10 text-left"
            >
              {/* Visual soft background glow circles */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-none bg-emerald-500/5 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-48 w-48 rounded-none bg-blue-500/5 dark:bg-blue-500/10 blur-3xl pointer-events-none" />

              {/* Close standard button */}
              <button 
                onClick={() => {
                  setSelectedBookDetail(null);
                  setShowLargeUpdatedCover(false);
                }}
                className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white bg-gray-50 dark:bg-zinc-905 border border-gray-200 dark:border-zinc-800 rounded-none transition-colors cursor-pointer text-xs uppercase font-mono font-bold"
              >
                ✕ Close
              </button>

              <div className="space-y-6">
                {/* Header Information */}
                <div className="border-b border-gray-105 dark:border-zinc-900 pb-4 pr-16 text-left">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="inline-flex gap-1 items-center px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-[9px] font-mono text-zinc-650 dark:text-zinc-400 font-bold uppercase tracking-widest border border-zinc-200 dark:border-zinc-800">
                      <ShieldCheck className="h-3 w-3 text-emerald-500" />
                      <span>{activeBook.category}</span>
                    </span>
                    {showLargeUpdatedCover && (
                      <span className="px-1.5 py-0.5 bg-amber-500 text-black font-mono text-[8px] font-black uppercase tracking-wider">
                        NEW LIVE UPDATE
                      </span>
                    )}
                  </div>
                  <h3 className="font-sans text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                    {activeBook.title}
                  </h3>
                  <p className="font-mono text-[10px] text-gray-400 dark:text-zinc-500">
                    by {activeBook.author} • Document ID: <span className="text-gray-600 dark:text-zinc-400 font-bold">{activeBook.id}</span>
                  </p>
                </div>

                {/* Two Column Layout: Left and Right */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Portrait Book Cover & Specs */}
                  <div className="md:col-span-4 flex flex-col items-center md:items-stretch gap-4">
                    <div className="relative w-40 md:w-full aspect-[3/4] bg-zinc-900 border border-zinc-200 shadow-xl overflow-hidden rounded-none flex-shrink-0 group">
                      <BookThumbnail book={activeBook} imageClassName="absolute inset-0 w-full h-full object-cover select-none group-hover:scale-102 transition-transform duration-500" />
                      {/* Interactive Hover Sheen Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-1000 ease-in-out z-20 pointer-events-none" />
                    </div>

                    {/* Meta Specifications list */}
                    <div className="w-full bg-gray-50 dark:bg-zinc-900/40 p-3 border border-gray-150 dark:border-zinc-900 font-mono text-[10px] text-gray-505 dark:text-zinc-400 space-y-2 text-left">
                      <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-805/50 pb-1">
                        <span>PAGES:</span>
                        <span className="text-gray-850 dark:text-zinc-200 font-bold">{activeBook.totalPages} pp</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-805/50 pb-1">
                        <span>VERSION:</span>
                        <span className="text-gray-850 dark:text-zinc-200 font-bold">{activeBook.currentVersion}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-805/50 pb-1">
                        <span>UPDATED:</span>
                        <span className="text-gray-850 dark:text-zinc-200 font-bold">{activeBook.lastUpdated}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>LICENSE:</span>
                        <span className="text-gray-850 dark:text-zinc-200 font-bold">
                          {isOwned(activeBook.id) ? 'PERSISTENT' : 'UNLICENSED'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Description, TOC, and Purchase Panel */}
                  <div className="md:col-span-8 space-y-4 text-left">
                    <div>
                      <span className="font-mono text-[9px] text-gray-400 dark:text-zinc-500 font-extrabold tracking-wider block uppercase mb-1">
                        Manual Overview
                      </span>
                      <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed font-sans">
                        {activeBook.description}
                      </p>
                    </div>

                    {/* Table of Contents Section (More details) */}
                    <div>
                      <span className="font-mono text-[9px] text-gray-400 dark:text-zinc-500 font-extrabold tracking-wider block uppercase mb-1">
                        Blueprint Chapters Preview
                      </span>
                      <div className="border border-gray-150 dark:border-zinc-900 bg-gray-50 dark:bg-zinc-950 p-2.5 space-y-1.5 font-mono text-[10px] text-gray-650 dark:text-zinc-400">
                        {activeBook.pages?.slice(0, 4).map((p, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-2 border-b border-gray-105 dark:border-zinc-900/30 pb-1 last:border-0 last:pb-0">
                            <span className="truncate">Page {p.pageNumber}: {p.title}</span>
                            <span className="text-emerald-500 dark:text-emerald-400 text-[8px] font-bold">PREVIEW OK</span>
                          </div>
                        ))}
                        {activeBook.pages && activeBook.pages.length > 4 && (
                          <div className="text-[8.5px] text-gray-400 dark:text-zinc-500 text-center italic mt-1">
                            + {activeBook.pages.length - 4} deeper production stages locked
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Revision highlights */}
                    <div>
                      <span className="font-mono text-[9px] text-gray-400 dark:text-zinc-500 font-extrabold tracking-wider block uppercase mb-1">
                        Active Revision Increments
                      </span>
                      <ul className="list-disc list-inside text-[10.5px] text-gray-505 dark:text-zinc-400 space-y-1 font-sans">
                        <li>Dynamic client-side PDF compiler formatting.</li>
                        <li>Fully reactive layouts optimized inside viewport streams.</li>
                        <li>Integrated offline data synchronization pipelines.</li>
                      </ul>
                    </div>

                    {/* Purchase & Action panel */}
                    <div className="pt-2">
                      {isOwned(activeBook.id) ? (
                        <div className="bg-emerald-500/5 dark:bg-emerald-950/10 border border-emerald-500/20 p-3 flex flex-col gap-2">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-[10px] text-emerald-800 dark:text-emerald-400 uppercase tracking-wide block">
                                Dynamic License Active
                              </span>
                              <p className="text-[10px] text-emerald-650 dark:text-emerald-505 leading-snug">
                                You own lifetime update synchronizations for this living document.
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-1">
                            <button
                              onClick={() => {
                                setSelectedBookDetail(null);
                                setShowLargeUpdatedCover(false);
                                handleReadPreview(activeBook.id);
                              }}
                              className="py-2 px-3 bg-zinc-950 hover:bg-zinc-900 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-[10.5px] font-bold font-sans uppercase tracking-wider rounded-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <BookOpen className="h-3.5 w-3.5" />
                              <span>Read In App</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedBookDetail(null);
                                setShowLargeUpdatedCover(false);
                              }}
                              className="py-2 px-3 bg-transparent text-gray-500 border border-gray-200 hover:border-gray-300 dark:text-zinc-350 dark:border-zinc-800 dark:hover:border-zinc-700 text-[10.5px] font-bold font-sans uppercase tracking-wider rounded-none transition-all cursor-pointer"
                            >
                              Close Detail
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-blue-500/5 dark:bg-blue-950/10 border border-blue-500/20 p-3.5 flex flex-col gap-2">
                          <div className="space-y-0.5 mb-1.5">
                            <span className="font-bold text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-wide block">
                              PDF License: Unpurchased
                            </span>
                            <p className="text-[10px] text-gray-550 dark:text-zinc-400 leading-snug">
                              Instantly unlock all {activeBook.totalPages} adaptive pages, full text syncing, and offline standalone features.
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <button
                              onClick={() => {
                                purchaseBook(activeBook.id);
                              }}
                              className="py-2.5 px-3 bg-blue-600 hover:bg-blue-505 text-white text-[11px] font-black font-sans uppercase tracking-wider rounded-none transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 shadow"
                            >
                              <span>Purchase PDF (${activeBook.price.toFixed(2)})</span>
                            </button>
                            
                            <button
                              onClick={() => {
                                setSelectedBookDetail(null);
                                setShowLargeUpdatedCover(false);
                                handleReadPreview(activeBook.id);
                              }}
                              className="py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-gray-800 dark:text-zinc-205 text-[10.5px] font-black font-sans uppercase tracking-wider rounded-none border border-gray-200 dark:border-zinc-800 transition-all cursor-pointer flex items-center justify-center"
                            >
                              <span>Preview Free Pages</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
