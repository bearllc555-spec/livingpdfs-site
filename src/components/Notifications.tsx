import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Clock, 
  Download, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Inbox,
  RefreshCw,
  Award,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  ArrowRightLeft,
  FileText,
  Lock,
  Plus,
  Minus,
  Info
} from 'lucide-react';
import { BookThumbnail } from './BookThumbnail';
import { motion, AnimatePresence } from 'motion/react';

export const Notifications: React.FC = () => {
  const { 
    notifications, 
    markNotificationRead, 
    triggerLivingUpdate,
    books,
    user,
    setCurrentTab,
    setSelectedBookId
  } = useApp();

  const [downloadingNotifId, setDownloadingNotifId] = useState<string | null>(null);
  const [completeLogNotifs, setCompleteLogNotifs] = useState<string[]>([]);
  const [simulatingBookId, setSimulatingBookId] = useState<string>('tailwind-v4');

  const handleDownloadLatestInNotice = (notifId: string, bookId: string) => {
    setDownloadingNotifId(notifId);
    
    // Simulate high-speed TLS byte syncing
    setTimeout(() => {
      setCompleteLogNotifs(prev => [...prev, notifId]);
      setDownloadingNotifId(null);
      markNotificationRead(notifId);
    }, 1200);
  };

  const handleAddCustomSimulation = () => {
    triggerLivingUpdate(simulatingBookId);
  };

  // Helper stats for notification layout header
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="animate-fade-in font-sans selection:bg-blue-205/55 space-y-8 max-w-7xl mx-auto px-1">
      
      {/* 1. HERO HEADER AREA IN OUTFIT FONT (Matching visual quality of Pricing tab) */}
      <div className="text-center py-10 md:py-14 max-w-4xl mx-auto space-y-4">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15] font-outfit">
          Stay synchronized with <br className="hidden md:inline" />
          live author upgrades.
        </h2>
        <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-outfit font-normal">
          Receive and compile the latest chapter releases, code corrections, and revision drafts instantly.
        </p>
      </div>

      {/* 2. SPECIFIC CONCEPT SPOTLIGHT (Translating standard obsolete book copy beautifully) */}
      <div className="bg-gradient-to-br from-indigo-50/40 via-blue-50/10 to-transparent dark:from-zinc-950 dark:to-blue-950/10 border border-zinc-200 dark:border-zinc-850 rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center justify-between text-left">
        <div className="space-y-4 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#1a73e8] dark:text-blue-400">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Understanding Living PDFs
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold font-outfit text-zinc-900 dark:text-white tracking-tight leading-tight">
            Traditional books grow obsolete in months. Ours are live.
          </h3>
          <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed font-sans">
            Technology moves fast. Standard guides go obsolete the second an API changes or a package major version launches. 
            <strong> LivingPDFs.com</strong> volumes are natively modular and active. Authors Elena and Anthony constantly revise, restructure, 
            and upgrade pages directly inside the integrated sandbox context. As a validated owner, you receive instant, secure TLS 
            version updates to download and explore.
          </p>
          <div className="flex flex-wrap gap-4 pt-1.5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-650 dark:text-zinc-350">
              <Check className="h-4 w-4 text-emerald-500 stroke-[3]" /> Zero upgrade markup fees
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#1a73e8] dark:text-blue-400">
              <ShieldCheck className="h-4 w-4 stroke-[2]" /> Digitally signed by authors
            </div>
          </div>
        </div>

        {/* 3. SIMULATOR PANEL (Google Workspace control hub style) */}
        <div className="w-full md:w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-md flex flex-col justify-between gap-5 shrink-0">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 block/warning">
              Developer Tooling
            </span>
            <h4 className="text-sm font-bold text-zinc-800 dark:text-white font-outfit">
              Simulate Active Drafts
            </h4>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Trigger a simulated author revision to test how the browser client automatically coordinates the TLS update stream.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <label htmlFor="sim-book-select" className="sr-only">Choose Book to Update</label>
            <select
              id="sim-book-select"
              value={simulatingBookId}
              onChange={(e) => setSimulatingBookId(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 bg-white text-zinc-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
            >
              {books.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title.length > 32 ? `${b.title.substring(0, 32)}...` : b.title}
                </option>
              ))}
            </select>

            <button
              onClick={handleAddCustomSimulation}
              className="w-full py-3 bg-gradient-to-r from-blue-650 to-[#1a73e8] hover:from-blue-650 hover:to-blue-700 text-white text-xs font-semibold rounded-full shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Trigger Revision Alert
            </button>
          </div>
        </div>
      </div>

      {/* 4. REVISION ALERTS FEED SECTION */}
      <div className="space-y-6 text-left py-4">
        
        <div className="flex items-center justify-between border-b pb-4 border-zinc-200 dark:border-zinc-850">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                rotate: unreadCount > 0 ? [0, -18, 16, -12, 10, -5, 0] : 0
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2.5,
                ease: "easeInOut"
              }}
              style={{ transformOrigin: 'top center' }}
              className="inline-block"
            >
              <Bell className="h-5 w-5 text-zinc-800 dark:text-zinc-350 fill-zinc-800/10 dark:fill-zinc-300/10" />
            </motion.div>
            <h3 className="text-xl font-bold font-outfit text-zinc-900 dark:text-white">
              Revision Alerts Log
              <span className="ml-2 text-xs bg-zinc-100 dark:bg-zinc-900 text-zinc-500 font-normal px-2.5 py-1 rounded-full">
                {notifications.length} alerts
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 ? (
              <span className="text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-200/40 animate-pulse">
                {unreadCount} Unread Revision{unreadCount !== 1 && 's'}
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-200/40">
                All Synced Up
              </span>
            )}
          </div>
        </div>

        {/* FEED GRID */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-stone-50/50 dark:bg-zinc-950/30 border border-dashed rounded-[32px] border-zinc-200 dark:border-zinc-850 text-center space-y-4 max-w-4xl mx-auto">
            <div className="p-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 rounded-full">
              <Inbox className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <span className="font-outfit text-lg font-bold text-zinc-900 dark:text-white">Your notifications feed is clear</span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed font-sans">
                No new revision alerts detected. Try choosing a title and clicking &quot;Trigger Revision Alert&quot; in the control panel to feed simulation logs!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-5xl mx-auto">
            <AnimatePresence initial={false}>
              {notifications.map(notif => {
                const owned = user.ownedBookIds.includes(notif.bookId);
                const hasDownloaded = completeLogNotifs.includes(notif.id);
                const isDownloadingThis = downloadingNotifId === notif.id;
                const correlatedBook = books.find(b => b.id === notif.bookId);

                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`group relative p-6 md:p-8 rounded-[28px] border-[2px] transition-all duration-300 flex flex-col md:flex-row gap-6 items-start justify-between cursor-pointer select-none ${
                      notif.read 
                        ? 'bg-white/40 dark:bg-[#1c1c1f]/25 border-zinc-200/40 dark:border-zinc-850/40 hover:border-[#1a73e8] dark:hover:border-blue-500 hover:shadow-blue-500/5 shadow-sm hover:shadow-md hover:bg-white/60 dark:hover:bg-[#202024]/40 opacity-80 hover:opacity-100' 
                        : 'bg-white dark:bg-[#1c1c1f]/50 border-zinc-200/80 dark:border-zinc-850 hover:border-[#1a73e8] dark:hover:border-blue-500 hover:shadow-blue-500/5 shadow-lg hover:shadow-xl hover:bg-white/95 dark:hover:bg-[#202024]/85'
                    }`}
                  >
                    {/* Unread ribbon/dot identifier */}
                    {!notif.read && (
                      <span className="absolute left-6 top-6 h-2 w-2 bg-[#1a73e8] dark:bg-blue-500 rounded-full animate-ping z-30" />
                    )}

                    <div className="flex flex-col sm:flex-row gap-5 flex-1 min-w-0 pl-1">
                      
                      {/* Book Thumbnail container inside the notification card */}
                      {correlatedBook && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBookId(notif.bookId);
                            setCurrentTab('book-detail');
                          }}
                          className="h-24 w-16 sm:h-28 sm:w-20 bg-zinc-955 overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 rounded-[16px] border border-zinc-900/10 flex-shrink-0 cursor-pointer select-none relative group/thumb"
                        >
                          <BookThumbnail 
                            book={correlatedBook} 
                            showSpine={false} 
                            className="w-full h-full" 
                            imageClassName="absolute inset-0 w-full h-full object-cover select-none group-hover/thumb:scale-[1.03] transition-transform duration-500" 
                          />
                        </div>
                      )}

                      <div className="space-y-3 flex-1 min-w-0">
                        {/* Meta context info */}
                        <div className="flex items-center gap-2 flex-wrap text-[11px] font-sans">
                          <span className="bg-blue-50 text-[#1a73e8] dark:bg-blue-950/40 dark:text-blue-300 font-extrabold px-2.5 py-0.5 rounded-full text-[10px] tracking-wide font-mono uppercase">
                            {notif.version}
                          </span>
                          
                          <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500 font-mono text-[10.5px]">
                            <Clock className="h-3 w-3" /> {notif.date}
                          </div>

                          {notif.title.includes('Real-Time') && (
                            <span className="text-[9px] bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                              System Generated
                            </span>
                          )}
                          
                          {!notif.read && (
                            <span className="bg-amber-100 text-amber-850 dark:bg-amber-950/50 dark:text-amber-400 px-2 py-0.5 rounded-full text-[9px] font-bold">
                              Unread Revision
                            </span>
                          )}
                        </div>

                        {/* Header metadata */}
                        <div className="space-y-1">
                          <h4 className="text-base font-bold font-outfit text-zinc-900 dark:text-white leading-snug">
                            {notif.title}
                          </h4>
                          <p className="text-xs text-[#1a73e8] dark:text-blue-300 font-medium font-outfit flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5" /> {notif.bookTitle}
                          </p>
                        </div>

                        {/* Body Message */}
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans max-w-3xl">
                          {notif.message}
                        </p>
                      </div>

                    </div>

                    {/* ACTIONS SIDE COLUMN BAR */}
                    <div className="shrink-0 flex items-center gap-2 self-end md:self-center pt-2 md:pt-0">
                      
                      {hasDownloaded ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-bold font-sans border border-emerald-200/40">
                          <Check className="h-4 w-4 stroke-[3]" /> Unlocked & Cached
                        </span>
                      ) : isDownloadingThis ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-zinc-650 dark:bg-zinc-900 dark:text-zinc-300 text-xs font-mono border border-zinc-250 dark:border-zinc-800">
                          <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#1a73e8]" />
                          <span>TLS Code Synced</span>
                        </div>
                      ) : owned ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadLatestInNotice(notif.id, notif.bookId);
                          }}
                          className="px-5 py-2.5 bg-[#1a73e8] hover:bg-blue-700 text-white text-xs font-semibold rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download Live PDF
                        </button>
                      ) : (
                        <div className="flex flex-col items-end gap-1.5 align-middle">
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono flex items-center gap-1 bg-stone-50 border border-zinc-200 rounded-full px-3 py-1.5 dark:bg-zinc-900 dark:border-zinc-850">
                            <Lock className="h-3 w-3 text-zinc-450" /> Buy copy to unleash
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentTab('pricing');
                            }}
                            className="text-[11px] font-bold text-[#1a73e8] dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            Upgrade Plan <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 5. SYSTEM STABILITY FOOTER INSIGHT (Workspace aligned informational bar) */}
      <div className="bg-gradient-to-br from-stone-50 to-amber-50/20 dark:from-zinc-950 dark:to-stone-900/10 border border-zinc-200 dark:border-zinc-900 rounded-[32px] p-6 max-w-5xl mx-auto my-12 flex items-start gap-4 text-left">
        <div className="p-3 bg-amber-50 dark:bg-amber-955/20 text-amber-600 rounded-2xl">
          <Info className="h-5 w-5" />
        </div>
        <div className="space-y-1.5">
          <h4 className="text-sm font-bold font-outfit text-zinc-900 dark:text-white">
            Revision Consistency Guarantee
          </h4>
          <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed font-sans">
            Author updates do not overwrite your personal highlight logs, bookmark offsets, or interactive playground revisions. Our revision compiler uses split-key TLS indexing to safely merge fresh authors' files while maintaining all of your customized data state intact in the local application buffer. Keep reading with convenience!
          </p>
        </div>
      </div>

    </div>
  );
};
