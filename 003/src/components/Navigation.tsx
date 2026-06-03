import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { BookCover } from './BookCover';
import { BookThumbnail } from './BookThumbnail';
import { 
  BookOpen, 
  Library, 
  BarChart2, 
  Bell, 
  Sun, 
  Moon, 
  LogOut,
  Tag,
  Heart,
  Play
} from 'lucide-react';

interface NavigationProps {
  onOpenAuth: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenAuth }) => {
  const {
    currentTab,
    setCurrentTab,
    isDarkMode,
    setIsDarkMode,
    user,
    logout,
    notifications,
    books,
    toggleSaveBook,
    setSelectedBookId,
    setIsReaderOpen,
    appVersion
  } = useApp();

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const wishlistBooks = books.filter(b => user.savedBookIds.includes(b.id));
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-150 bg-white/90 backdrop-blur-md dark:border-zinc-900 dark:bg-[#141416]/90 transition-colors duration-300">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo - Styled as modern book design with Lucide */}
        <div className="flex items-center gap-1 cursor-pointer select-none" onClick={() => setCurrentTab('showcase')}>
          <BookOpen className="h-10 w-10 text-emerald-700 dark:text-emerald-500 p-2 bg-emerald-50 dark:bg-zinc-900 border border-[#EAE6DF] dark:border-zinc-800" />
          <div className="flex items-baseline gap-1">
            <span className="font-['Arial'] text-[18px] font-extrabold tracking-tight text-gray-900 dark:text-white leading-none">
              LivingPDFs
            </span>
            <span className="font-mono text-[9px] font-bold bg-[#EAE6DF] text-gray-700 dark:bg-zinc-900 dark:text-zinc-400 px-1 py-0.5 rounded-none leading-none select-none">
              {appVersion}
            </span>
          </div>
        </div>

        {/* Tab Selection Navigation Bar - Reduced Font Size & Uncrowded with beautiful gold bar tracking */}
        <nav className="hidden md:flex items-center gap-1 font-sans h-full" role="tablist">
          <button
            role="tab"
            aria-selected={currentTab === 'showcase'}
            className={`relative flex items-center gap-1.5 px-3 h-14 transition-all duration-200 uppercase tracking-widest text-[10px] cursor-pointer ${
              currentTab === 'showcase' || currentTab === 'book-detail'
                ? 'text-[#1D3D33] dark:text-white font-extrabold'
                : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200 font-bold'
            }`}
            onClick={() => setCurrentTab('showcase')}
          >
            <span>Catalog</span>
            {(currentTab === 'showcase' || currentTab === 'book-detail') && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-700 dark:bg-amber-500 animate-fade-in" />
            )}
          </button>

          <button
            role="tab"
            aria-selected={currentTab === 'library'}
            className={`relative flex items-center gap-1.5 px-3 h-14 transition-all duration-200 uppercase tracking-widest text-[10px] cursor-pointer ${
              currentTab === 'library'
                ? 'text-[#1D3D33] dark:text-white font-extrabold'
                : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200 font-bold'
            }`}
            onClick={() => setCurrentTab('library')}
          >
            <span>MY LIBRARY</span>
            {currentTab === 'library' && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-700 dark:bg-amber-500 animate-fade-in" />
            )}
          </button>

          <button
            role="tab"
            aria-selected={currentTab === 'analytics'}
            className={`relative flex items-center gap-1.5 px-3 h-14 transition-all duration-200 uppercase tracking-widest text-[10px] cursor-pointer ${
              currentTab === 'analytics'
                ? 'text-[#1D3D33] dark:text-white font-extrabold'
                : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200 font-bold'
            }`}
            onClick={() => setCurrentTab('analytics')}
          >
            <span>MY ANALYTICS</span>
            {currentTab === 'analytics' && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-700 dark:bg-amber-500 animate-fade-in" />
            )}
          </button>

          <button
            role="tab"
            aria-selected={currentTab === 'notifications'}
            className={`relative flex items-center gap-1.5 px-3 h-14 transition-all duration-200 uppercase tracking-widest text-[10px] cursor-pointer ${
              currentTab === 'notifications'
                ? 'text-[#1D3D33] dark:text-white font-extrabold'
                : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200 font-bold'
            }`}
            onClick={() => setCurrentTab('notifications')}
          >
            <span className="flex items-center gap-1">
              MY UPDATES
              {unreadCount > 0 && (
                <span className="h-2 w-2 rounded-full bg-orange-600 inline-block animate-pulse" />
              )}
            </span>
            {currentTab === 'notifications' && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-700 dark:bg-amber-500 animate-fade-in" />
            )}
          </button>

          <button
            role="tab"
            aria-selected={currentTab === 'pricing'}
            className={`relative flex items-center gap-1.5 px-3 h-14 transition-all duration-200 uppercase tracking-widest text-[10px] cursor-pointer ${
              currentTab === 'pricing'
                ? 'text-[#1D3D33] dark:text-white font-extrabold'
                : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200 font-bold'
            }`}
            onClick={() => setCurrentTab('pricing')}
          >
            <span>Pricing</span>
            {currentTab === 'pricing' && (
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-700 dark:bg-amber-500 animate-fade-in" />
            )}
          </button>
        </nav>

        {/* Action Controls - Online Sync elements removed to keep the interface tidy */}
        <div className="flex items-center gap-2.5">

          {/* Wishlist Toggler & Popover Container */}
          <div className="relative">
            <button
              id="btn-wishlist-header"
              onClick={() => setIsWishlistOpen(!isWishlistOpen)}
              title="My Wishlist"
              className={`px-2.5 py-1 text-gray-700 hover:text-red-500 dark:text-zinc-300 dark:hover:text-red-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-none transition-all duration-150 cursor-pointer flex items-center gap-1 text-xs font-mono font-extrabold tracking-wider ${
                isWishlistOpen 
                  ? 'text-red-500 bg-red-500/5' 
                  : ''
              }`}
            >
              <span>MY</span>
              <div className="relative inline-flex items-center justify-center mr-2">
                <Heart className={`h-3.5 w-3.5 stroke-[2.2] ${wishlistBooks.length > 0 ? 'fill-current text-red-500' : ''}`} />
                <span 
                  className="absolute text-[9px] font-sans font-black text-gray-950 dark:text-white leading-none select-none"
                  style={{ top: '-1px', right: '-10px' }}
                >
                  {wishlistBooks.length}
                </span>
              </div>
            </button>

            {/* Backdrop click closer */}
            {isWishlistOpen && (
              <div 
                className="fixed inset-0 z-40 bg-transparent cursor-default" 
                onClick={() => setIsWishlistOpen(false)}
              />
            )}

            {/* Popover Card */}
            <AnimatePresence>
              {isWishlistOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-xs sm:max-w-none bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-850 shadow-2xl z-50 p-4 rounded-none text-gray-900 dark:text-zinc-100"
                >
                  <div className="flex items-center justify-between border-b border-gray-150 dark:border-zinc-900 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5 text-red-500 fill-current" />
                      <span className="font-sans text-[10px] font-black uppercase tracking-wider text-gray-800 dark:text-zinc-205">
                        Wishlist
                      </span>
                    </div>
                    <span className="font-mono text-[8.5px] font-bold bg-[#EAE6DF] text-gray-700 dark:bg-zinc-900 dark:text-zinc-400 px-1.5 py-0.5 rounded-none select-none">
                      {wishlistBooks.length} FILES
                    </span>
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1 py-1 custom-scrollbar">
                    {wishlistBooks.length === 0 ? (
                      <div className="text-center py-6 px-4">
                        <Heart className="h-8 w-8 text-gray-300 dark:text-zinc-805 mx-auto mb-2" />
                        <p className="font-sans text-xs text-gray-400 dark:text-zinc-500 font-bold leading-normal">
                          Wishlist is empty
                        </p>
                        <p className="font-sans text-[10px] text-gray-400 dark:text-zinc-650 mt-1 leading-normal">
                          Click the heart button on any book inside the Catalog to save it here!
                        </p>
                      </div>
                    ) : (
                      wishlistBooks.map(book => {
                        const owned = user.ownedBookIds.includes(book.id);
                        return (
                          <div 
                            key={book.id}
                            onClick={() => {
                              setIsWishlistOpen(false);
                              setSelectedBookId(book.id);
                              setCurrentTab('book-detail');
                            }}
                            className="flex items-start gap-2.5 p-2 bg-white hover:bg-gray-50 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/75 border border-gray-150 dark:border-zinc-900/50 transition-all group cursor-pointer"
                          >
                            {/* Tiny Portrait Cover Representative */}
                            <div className="h-14 w-10 bg-zinc-950 border border-zinc-200/10 dark:border-zinc-800 shadow relative overflow-hidden flex-shrink-0 select-none rounded-none">
                              <BookThumbnail book={book} showSpine={false} imageClassName="h-full w-full object-cover select-none" />
                            </div>

                            {/* Info and quick actions */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-sans text-[11px] font-bold text-gray-900 dark:text-white truncate leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {book.title}
                              </h4>
                              <p className="font-sans text-[9px] text-gray-400 dark:text-zinc-500 truncate mt-0.5">
                                by {book.author}
                              </p>
                              
                              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsWishlistOpen(false);
                                    setSelectedBookId(book.id);
                                    setIsReaderOpen(true);
                                  }}
                                  className="font-sans text-[9px] font-black text-blue-600 hover:text-blue-500 dark:text-blue-405 dark:hover:text-blue-305 uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
                                >
                                  <Play className="h-2.5 w-2.5 fill-current" />
                                  <span>{owned ? 'Read' : 'Preview'}</span>
                                </button>
                                
                                <span className="text-gray-200 dark:text-zinc-800 text-[9px] font-mono select-none">|</span>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSaveBook(book.id);
                                  }}
                                  className="font-sans text-[9px] font-black text-gray-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 uppercase tracking-wider cursor-pointer"
                                  title="Remove from wishlist"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  
                  <div className="border-t border-gray-150 dark:border-zinc-900 mt-2.5 pt-2.5 text-center flex justify-between gap-2">
                    <button
                      onClick={() => {
                        setIsWishlistOpen(false);
                        setCurrentTab('showcase');
                      }}
                      className="font-sans text-[9px] font-black text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-250 uppercase tracking-widest text-center cursor-pointer w-full"
                    >
                      Browse Catalog
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dynamic Theme Changer */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to late-night Dark Mode"}
            className="p-1.8 text-gray-400 hover:text-gray-900 hover:bg-zinc-50 dark:text-zinc-500 dark:hover:text-zinc-200 dark:hover:bg-zinc-905 rounded-none transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun className="h-4 w-4 stroke-[2]" /> : <Moon className="h-4 w-4 stroke-[2]" />}
          </button>

          <div className="h-5 w-px bg-gray-200 dark:bg-zinc-800" />

          {user.email ? (
            <div className="flex items-center gap-1.5">
              <button 
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 p-1.2 rounded-none text-left transition-colors cursor-pointer"
              >
                <div className="h-7.5 w-7.5 rounded-none bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-mono text-xs font-bold shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:flex flex-col select-none">
                  <span className="font-sans text-[11px] font-black leading-none text-gray-900 dark:text-white truncate max-w-[70px]">
                    {user.name}
                  </span>
                  <span className="font-mono text-[8px] text-blue-600 dark:text-blue-400 font-bold uppercase leading-none mt-0.5">
                    {user.isPremium ? 'Premium' : 'Free'}
                  </span>
                </div>
              </button>
              
              <button 
                onClick={logout}
                title="Sign Out"
                className="p-1.8 text-red-500 hover:text-red-700 hover:bg-red-50/50 dark:hover:bg-red-955/20 rounded-none transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.8 font-sans text-xs font-bold bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-none shadow-sm cursor-pointer transition-all"
            >
              Sign In
            </button>
          )}

        </div>
      </div>

      {/* Mobile Tab Selector Bar - Sticky to bottom on small devices */}
      <div className="md:hidden border-t border-gray-150 bg-white dark:border-zinc-900 dark:bg-zinc-950 flex justify-around py-1.5 text-[10px] font-sans font-bold uppercase tracking-wider">
        <button
          className={`flex flex-col items-center gap-0.5 ${
            currentTab === 'showcase' || currentTab === 'book-detail' ? 'text-zinc-950 dark:text-white' : 'text-gray-400 dark:text-zinc-500'
          }`}
          onClick={() => setCurrentTab('showcase')}
        >
          <BookOpen className="h-4 w-4" />
          <span>Catalog</span>
        </button>

        <button
          className={`flex flex-col items-center gap-0.5 ${
            currentTab === 'library' ? 'text-zinc-950 dark:text-white' : 'text-gray-400 dark:text-zinc-500'
          }`}
          onClick={() => setCurrentTab('library')}
        >
          <Library className="h-4 w-4" />
          <span>MY LIBRARY</span>
        </button>

        <button
          className={`flex flex-col items-center gap-0.5 ${
            currentTab === 'analytics' ? 'text-zinc-950 dark:text-white' : 'text-gray-400 dark:text-zinc-500'
          }`}
          onClick={() => setCurrentTab('analytics')}
        >
          <BarChart2 className="h-4 w-4" />
          <span>MY ANALYTICS</span>
        </button>

        <button
          className={`relative flex flex-col items-center gap-0.5 ${
            currentTab === 'notifications' ? 'text-zinc-950 dark:text-white' : 'text-gray-400 dark:text-zinc-500'
          }`}
          onClick={() => setCurrentTab('notifications')}
        >
          <Bell className="h-4 w-4" />
          <span>MY UPDATES</span>
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[8px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          className={`flex flex-col items-center gap-0.5 ${
            currentTab === 'pricing' ? 'text-zinc-950 dark:text-white' : 'text-gray-400 dark:text-zinc-500'
          }`}
          onClick={() => setCurrentTab('pricing')}
        >
          <Tag className="h-4 w-4" />
          <span>Pricing</span>
        </button>
      </div>
    </header>
  );
};
