import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Book } from '../types';
import { 
  ArrowLeft, 
  Heart, 
  BookOpen, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  Check, 
  Clock, 
  CreditCard, 
  Zap, 
  AlertCircle,
  Play,
  Lock,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BookThumbnail } from './BookThumbnail';

export const BookDetail: React.FC = () => {
  const {
    books,
    user,
    progress,
    updateReadingProgress,
    selectedBookId,
    setSelectedBookId,
    setCurrentTab,
    toggleSaveBook,
    subscribeToBook,
    setIsReaderOpen
  } = useApp();

  // Find book
  const book = books.find(b => b.id === selectedBookId) || books[0];

  const [checkoutTier, setCheckoutTier] = useState<'bronze' | 'silver' | 'gold' | null>(null);
  const [checkoutName, setCheckoutName] = useState(user.name || '');
  const [checkoutEmail, setCheckoutEmail] = useState(user.email || 'anthony@slatepress.co');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!book) {
    return (
      <div className="py-12 text-center font-sans">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Book not found</h3>
        <button 
          onClick={() => setCurrentTab('showcase')}
          className="mt-4 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold uppercase tracking-wider text-xs rounded-full"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const isSaved = user.savedBookIds.includes(book.id);
  const isOwned = user.ownedBookIds.includes(book.id);
  const activeSubscription = user.bookSubscriptions?.[book.id] || null;

  const userProgress = progress.find(p => p.bookId === book.id);

  const getChapterStatus = (pageNumber: number) => {
    if (!userProgress) return 'unread';
    if (userProgress.completed) return 'completed';
    if (pageNumber < userProgress.currentPage) return 'completed';
    if (pageNumber === userProgress.currentPage) return 'in-progress';
    return 'unread';
  };

  const isChapterLocked = (pageNumber: number) => {
    return !isOwned && pageNumber > 6;
  };

  const tiers = [
    {
      id: 'bronze',
      name: 'Bronze Reader',
      price: '$4.99',
      period: 'one-time',
      tagline: 'Core Static Entry',
      features: [
        'Lifetime access to current v4.0 content',
        'Offline standalone application storage',
        'Standard layout formatting engine',
        'Integrated bookmarks & index index logs'
      ],
      color: 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-955',
      icon: <BookOpen className="h-5 w-5 text-zinc-500" />
    },
    {
      id: 'silver',
      name: 'Silver Developer',
      price: '$12.90',
      period: 'quarterly',
      tagline: 'Reactive Upgrades',
      popular: true,
      features: [
        'All Core Bronze features included',
        'Weekly live-code revision updates',
        'Direct sandbox compilation nodes',
        'Interactive code sample playground',
        'Priority offline cache (high bandwidth)'
      ],
      color: 'border-blue-500 dark:border-blue-900 ring-2 ring-blue-500/10 bg-white dark:bg-zinc-955',
      icon: <Layers className="h-5 w-5 text-blue-500" />
    },
    {
      id: 'gold',
      name: 'Gold Infinite Scribe',
      price: '$24.99',
      period: 'annually',
      tagline: 'Full Intelligence Vault',
      features: [
        'All Silver Developer specifications',
        'Instant live authors review logs',
        'Smart Gemini content summaries',
        'Full vector source and PDF exporting',
        '1-on-1 author feedback loop'
      ],
      color: 'border-amber-500 dark:border-amber-900 ring-2 ring-amber-500/10 bg-white dark:bg-zinc-955',
      icon: <Sparkles className="h-5 w-5 text-amber-500" />
    }
  ];

  const handleSubscribeClick = (tierId: 'bronze' | 'silver' | 'gold') => {
    setCheckoutTier(tierId);
    setCheckoutSuccess(false);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutTier) return;
    
    setIsProcessing(true);
    // Simulate transaction delay
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutSuccess(true);
      setTimeout(() => {
        // Apply subscription
        subscribeToBook(book.id, checkoutTier);
        setCheckoutTier(null);
        setCheckoutSuccess(false);
      }, 1500);
    }, 1800);
  };

  const handleReadPreview = () => {
    setSelectedBookId(book.id);
    setIsReaderOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pt-6 text-left selection:bg-blue-100/60">
      
      {/* 1. Header Navigation Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-900 pb-5 text-left">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setCurrentTab('showcase')}
            className="p-1.5 px-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold uppercase"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Catalog</span>
          </button>
          
          <span className="text-zinc-300 dark:text-zinc-800 text-xs">/</span>
          <span className="text-xs uppercase font-mono font-extrabold tracking-widest text-[#1a73e8] dark:text-blue-400">
            {book.category}
          </span>
          <span className="text-zinc-300 dark:text-zinc-800 text-xs">/</span>
          <span className="text-xs font-mono font-semibold text-zinc-900 dark:text-gray-100 truncate max-w-[120px] sm:max-w-none">
            {book.title}
          </span>
        </div>
        
        {/* Actions header bar button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSaveBook(book.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer flex items-center gap-2 ${
              isSaved
                ? 'text-red-500 bg-red-500/5 border-red-300 dark:border-red-950/20'
                : 'text-zinc-650 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-current text-red-500' : ''}`} />
            <span>{isSaved ? 'In Wishlist' : 'Add to Wishlist'}</span>
          </button>

          <button
            onClick={handleReadPreview}
            className="px-5 py-2 bg-zinc-900 hover:bg-zinc-805 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
          >
            <Play className="h-3 w-3 fill-current text-white dark:text-zinc-950" />
            <span>Read book</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Left column - Book presentation card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-zinc-955 p-6 border border-zinc-150 dark:border-zinc-900 shadow-sm transition-all rounded-[28px] flex flex-col items-center">
            
            {/* LARGE PRINTED JACKET DESIGN WITH DEPTH */}
            <div className="relative w-48 sm:w-56 aspect-[3/4] bg-zinc-900 border border-zinc-900/10 shadow-2xl overflow-hidden rounded-[20px] flex-shrink-0 mb-5 group">
              <BookThumbnail book={book} imageClassName="absolute inset-0 w-full h-full object-cover select-none group-hover:scale-[1.03] transition-transform duration-500" />
              {/* Interactive Hover Sheen Overlays */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent translate-y-full group-hover:translate-y-[-100%] transition-transform duration-1000 ease-in-out z-20 pointer-events-none" />
            </div>

            {/* active subscription status banner */}
            {activeSubscription && (
              <div className="w-full bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-[18px] px-4 py-3.5 text-center mb-5 text-left">
                <span className="font-mono text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">
                  Active Subscription: {activeSubscription}
                </span>
                <span className="font-sans text-[11px] text-zinc-500 dark:text-zinc-400">
                  You have full unlimited compiler updates!
                </span>
              </div>
            )}

            {/* specs attributes */}
            <div className="w-full bg-zinc-50 dark:bg-zinc-900/35 p-5 border border-zinc-150 dark:border-zinc-900 text-xs font-mono text-zinc-500 dark:text-zinc-400 space-y-3 text-left rounded-[20px]">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-extrabold tracking-wider uppercase block border-b border-zinc-200 dark:border-zinc-800 pb-2">
                Technical Blueprint Specs
              </span>
              <div className="flex justify-between">
                <span>DOC VOLUMES:</span>
                <span className="text-zinc-900 dark:text-white font-extrabold">{book.totalPages} pages</span>
              </div>
              <div className="flex justify-between">
                <span>BUILD VERSION:</span>
                <span className="text-zinc-900 dark:text-white font-extrabold">{book.currentVersion}</span>
              </div>
              <div className="flex justify-between">
                <span>COMPILED ON:</span>
                <span className="text-zinc-900 dark:text-white font-extrabold">{book.lastUpdated}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>DOC STATUS:</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-sans text-[9px] font-extrabold uppercase rounded-full border border-emerald-500/15">
                  LIVING FILE
                </span>
              </div>
            </div>
            
          </div>
        </div>

        {/* Right column - Main informative page sections */}
        <div className="lg:col-span-8 space-y-8 text-left">
          
          {/* Main Book Title and Author Overview */}
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#1a73e8] dark:bg-blue-950/20 dark:text-blue-300 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-950/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{book.category}</span>
              </span>
              <h1 className="text-2xl md:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-none font-outfit mt-1.5">
                {book.title}
              </h1>
              <p className="font-mono text-xs text-zinc-500 dark:text-zinc-450 border border-transparent">
                Author: <span className="text-zinc-800 dark:text-zinc-300 font-bold">{book.author}</span> • Hash key ID: <span className="text-zinc-650 dark:text-zinc-400 font-bold">{book.id}</span>
              </p>
            </div>
            
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans border-l-2 border-indigo-500/20 pl-4.5">
              {book.description}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {book.tags.map(tag => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 font-sans text-[10px] font-bold uppercase rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* 3. ACTIVE SUBSCRIBABLE TIERS PANEL - DYNAMIC INTERACTION HERE */}
          <div className="space-y-4 text-left">
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-zinc-200 dark:border-zinc-850 pb-2">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>Choose Your Living Update License Tier</span>
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed font-sans">
                Rather than buying static paper PDFs, choose a flexible synchronization tier to receive all dynamic textbook patches, code revisions, and offline features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tiers.map(tier => {
                const isSelected = activeSubscription === tier.id;
                
                return (
                  <div
                    key={tier.id}
                    className={`p-5 border flex flex-col justify-between transition-all relative rounded-3xl ${tier.color} hover:shadow-md text-left`}
                  >
                    {tier.popular && (
                      <span className="absolute top-0 right-5 -translate-y-1/2 bg-blue-600 text-white font-sans text-[9px] font-black uppercase px-2.5 py-0.5 tracking-wider select-none rounded-full">
                        RECOMMENDED
                      </span>
                    )}

                    <div className="space-y-3.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-mono text-[8px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider animate-pulse">
                            {tier.tagline}
                          </p>
                          <h4 className="font-sans text-xs font-bold text-zinc-900 dark:text-white tracking-tight">
                            {tier.name}
                          </h4>
                        </div>
                        <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-xl">
                          {tier.icon}
                        </div>
                      </div>

                      <div className="flex items-baseline gap-1 py-1">
                        <span className="text-xl font-black text-zinc-900 dark:text-white tracking-tight leading-none">
                          {tier.price}
                        </span>
                        <span className="text-[9.5px] text-zinc-400 font-mono">
                          / {tier.period}
                        </span>
                      </div>

                      <ul className="space-y-1.5 font-sans text-[10px] text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-900 pt-3">
                        {tier.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-tight">
                            <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-900">
                      {isSelected ? (
                        <div className="w-full py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-sans text-[10px] font-black uppercase text-center flex items-center justify-center gap-1 border border-emerald-500/20 rounded-full">
                          <Check className="h-3.5 w-3.5" />
                          <span>Active Subscription</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSubscribeClick(tier.id as any)}
                          className={`w-full py-2.5 font-sans text-[10px] font-black uppercase tracking-wider rounded-full cursor-pointer transition-all ${
                            tier.popular
                              ? 'bg-blue-600 hover:bg-blue-500 text-white shadow'
                              : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-905 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800'
                          }`}
                        >
                          Subscribe Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. CHAPTERS PREVIEW SECTION */}
          <div className="space-y-4 text-left">
            <div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-zinc-200 dark:border-zinc-850 pb-2">
                <BookOpen className="h-4 w-4 text-zinc-550" />
                <span>Blueprint Volume Chapter Index ({book.pages?.length} Chapters)</span>
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-normal font-sans">
                Review completed portions below marked in emerald green. Your currently reading progress is flagged in blue. Click any chapter block to jump straight inside your sandbox copy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {book.pages?.map((p, idx) => {
                const status = getChapterStatus(p.pageNumber);
                const isLocked = isChapterLocked(p.pageNumber);
                
                let cardStyle = "bg-white dark:bg-zinc-955 hover:border-zinc-300 dark:hover:border-zinc-750 border-zinc-150 dark:border-zinc-900 rounded-2xl";
                let badgeStyle = "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 rounded-lg";
                let tagElement = null;

                if (status === 'completed') {
                  cardStyle = "bg-emerald-500/5 dark:bg-emerald-950/10 border-emerald-500/30 dark:border-emerald-900/30 border-l-4 border-l-emerald-500 hover:border-emerald-500/40 dark:hover:border-emerald-900/50 rounded-2xl";
                  badgeStyle = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 rounded-lg";
                  tagElement = (
                    <span className="font-sans text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold tracking-wider uppercase flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/15 rounded-full">
                      <CheckCircle2 className="h-3 w-3 stroke-[2.5]" /> Completed
                    </span>
                  );
                } else if (status === 'in-progress') {
                  cardStyle = "bg-blue-500/5 dark:bg-blue-955/10 border-blue-300 dark:border-blue-900/50 border-l-4 border-l-blue-500 hover:border-blue-400 dark:hover:border-blue-800 rounded-2xl";
                  badgeStyle = "bg-blue-500/10 text-[#1a73e8] dark:text-blue-400 border border-blue-500/15 rounded-lg";
                  tagElement = (
                    <span className="font-sans text-[9px] text-blue-600 dark:text-blue-400 font-extrabold tracking-wider uppercase flex items-center gap-1 bg-blue-505/10 px-2 py-0.5 border border-blue-500/15 rounded-full">
                      <Clock className="h-3 w-3 animate-pulse" /> Reading
                    </span>
                  );
                } else if (isLocked) {
                  cardStyle = "bg-zinc-50/50 dark:bg-zinc-955/50 border-zinc-200 dark:border-zinc-900 opacity-75 border-l-4 border-l-amber-500/40 hover:opacity-100 rounded-2xl";
                  badgeStyle = "bg-zinc-200 dark:bg-zinc-900 text-zinc-400 rounded-lg";
                  tagElement = (
                    <span className="font-sans text-[9px] text-amber-600 dark:text-amber-500 font-semibold tracking-wider uppercase flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 border border-amber-500/15 rounded-full">
                      <Lock className="h-2.5 w-2.5" /> Locked Preview
                    </span>
                  );
                } else {
                  tagElement = (
                    <span className="font-sans text-[9px] text-zinc-500 dark:text-zinc-450 font-extrabold tracking-wider uppercase flex items-center gap-1 hover:text-blue-500 transition-colors">
                      <Play className="h-2.5 w-2.5 fill-current text-[#1a73e8]" /> Play Preview
                    </span>
                  );
                }

                const handleChapterClick = () => {
                  updateReadingProgress(book.id, p.pageNumber, 0);
                  setSelectedBookId(book.id);
                  setIsReaderOpen(true);
                };

                return (
                  <div 
                    key={idx}
                    onClick={handleChapterClick}
                    className={`p-3.5 border transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-sm ${cardStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-[9px] p-1.5 min-w-[28px] text-center font-bold block ${badgeStyle}`}>
                        #{p.pageNumber.toString().padStart(2, '0')}
                      </span>
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[180px] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {p.title}
                      </span>
                    </div>
                    {tagElement}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. LIVELY INCREMENT REVISIONS HISTORY STREAM */}
          <div className="space-y-4 text-left">
            <div>
              <h3 className="text-sm font-black text-gray-901 dark:text-white uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-zinc-200 dark:border-zinc-850 pb-2">
                <Clock className="h-4 w-4 text-zinc-550" />
                <span>Dynamic Textbook Updates & Revision History</span>
              </h3>
            </div>

            <div className="relative border-l border-indigo-500/20 dark:border-zinc-800 pl-5 space-y-5 font-sans text-xs ml-3 pt-1 pb-1 text-left">
              {book.updateHistory?.map((update, idx) => (
                <div key={idx} className="relative space-y-2">
                  <div className="absolute -left-[26px] top-1.5 h-3 w-3 rounded-full bg-blue-600 border-2 border-white dark:border-zinc-950" />
                  
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[10px] font-black text-[#1a73e8] dark:text-blue-400">
                      Version {update.version}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {update.date}
                    </span>
                  </div>
                  
                  <ul className="list-disc list-inside text-[11px] text-zinc-650 dark:text-zinc-400 space-y-1.5 pl-1 leading-relaxed">
                    {update.changes.map((change, cidx) => (
                      <li key={cidx}>{change}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Checkout Simulator Modal Popover */}
      <AnimatePresence>
        {checkoutTier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCheckoutTier(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 p-6 md:p-8 shadow-2xl z-10 text-zinc-900 dark:text-zinc-100 text-left rounded-[32px]"
            >
              <button 
                onClick={() => setCheckoutTier(null)}
                className="absolute top-5 right-5 text-[11px] font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white shrink-0 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-full cursor-pointer"
              >
                ✕ CLOSE
              </button>

              <div className="space-y-5">
                <div className="border-b border-zinc-150 dark:border-zinc-900 pb-3.5 pt-2">
                  <span className="font-mono text-[9px] text-[#1a73e8] dark:text-blue-400 font-black uppercase tracking-wider block">
                    SECURED BILLING PORTAL
                  </span>
                  <h3 className="font-outfit text-lg font-extrabold text-zinc-900 dark:text-white uppercase tracking-tight mt-0.5">
                    Upgrade to {tiers.find(t => t.id === checkoutTier)?.name}
                  </h3>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 font-mono">
                    Book Hash Code: {book.id} • Dynamic License Generation
                  </p>
                </div>

                {checkoutSuccess ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
                      <Check className="h-6 w-6 stroke-[3]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-outfit text-sm font-bold text-zinc-900 dark:text-white uppercase block">
                        Upgrade Transacted Successfully!
                      </h4>
                      <p className="font-sans text-xs text-amber-600 dark:text-amber-550">
                        Dynamic licence certificates generated in your local database stack...
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4 font-sans">
                    <div className="space-y-1 bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-zinc-200 dark:border-zinc-850 font-mono text-[10.5px] text-zinc-500 dark:text-zinc-400 rounded-2xl">
                      <div className="flex justify-between font-bold border-b border-zinc-150 dark:border-zinc-850 pb-1.5">
                        <span>SUBSCRIBING FOR:</span>
                        <span className="text-zinc-900 dark:text-white max-w-[150px] truncate">{book.title}</span>
                      </div>
                      <div className="flex justify-between pt-1.5">
                        <span>PLAN METRICS:</span>
                        <span className="font-semibold text-zinc-805 dark:text-zinc-200">Lifetime Upgrades Access</span>
                      </div>
                      <div className="flex justify-between pt-1.5 text-xs text-zinc-900 dark:text-white font-bold">
                        <span>TOTAL CHARGE:</span>
                        <span>{tiers.find(t => t.id === checkoutTier)?.price} / {tiers.find(t => t.id === checkoutTier)?.period}</span>
                      </div>
                    </div>

                    <div className="space-y-3 font-sans text-xs">
                      <div className="space-y-1">
                        <label htmlFor="checkout-name" className="text-[10px] font-mono font-black text-zinc-400 dark:text-zinc-500 uppercase">
                          Subscriber Full Name
                        </label>
                        <input 
                          type="text" 
                          id="checkout-name"
                          required
                          value={checkoutName}
                          onChange={(e) => setCheckoutName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-full font-sans"
                        />
                      </div>

                      <div className="space-y-1 font-sans text-xs">
                        <label htmlFor="checkout-email" className="text-[10px] font-mono font-black text-zinc-405 dark:text-zinc-505 uppercase">
                          Subscriber Email Address
                        </label>
                        <input 
                          type="email" 
                          id="checkout-email"
                          required
                          value={checkoutEmail}
                          onChange={(e) => setCheckoutEmail(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-full font-sans"
                        />
                      </div>

                      {/* Mock Credit Card numbers */}
                      <div className="space-y-1">
                        <label htmlFor="checkout-card" className="text-[10px] font-mono font-black text-zinc-400 dark:text-zinc-500 uppercase">
                          Credit Card Secure Input
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                          <input 
                            type="text" 
                            id="checkout-card"
                            required
                            placeholder="••••  ••••  ••••  4242"
                            pattern="[0-9]*"
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-full"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-[#1a73e8] hover:from-blue-600 hover:to-blue-700 text-white font-sans text-xs font-semibold uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow active:scale-[0.98]"
                    >
                      {isProcessing ? (
                        <>
                          <div className="h-3.5 w-3.5 border-2 border-white/20 border-t-white animate-spin rounded-full" />
                          <span>Generating TLS Licence node keys...</span>
                        </>
                      ) : (
                        <span>Acquire Dynamic License Certificate</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
