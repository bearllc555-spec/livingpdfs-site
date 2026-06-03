import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, UserProfile, ReadingProgress, AppNotification } from '../types';
import { mockBooks } from '../data/mockBooks';
import { APP_VERSION } from '../lib/version';

interface AppContextType {
  user: UserProfile;
  books: Book[];
  progress: ReadingProgress[];
  notifications: AppNotification[];
  currentTab: 'showcase' | 'library' | 'analytics' | 'notifications' | 'pricing' | 'book-detail';
  setCurrentTab: (tab: 'showcase' | 'library' | 'analytics' | 'notifications' | 'pricing' | 'book-detail') => void;
  selectedBookId: string | null;
  setSelectedBookId: (id: string | null) => void;
  isReaderOpen: boolean;
  setIsReaderOpen: (open: boolean) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  syncStatus: 'synced' | 'syncing' | 'error';
  triggerSync: () => void;
  login: (email: string, name: string) => void;
  logout: () => void;
  purchaseBook: (bookId: string) => void;
  deleteOwnedBook: (bookId: string) => void;
  toggleSaveBook: (bookId: string) => void;
  toggleCacheBook: (bookId: string) => void;
  updateReadingProgress: (bookId: string, pageNumber: number, secondsSpent: number) => void;
  markNotificationRead: (notifId: string) => void;
  addNotification: (bookId: string, title: string, message: string) => void;
  triggerLivingUpdate: (bookId: string) => void;
  subscribeToBook: (bookId: string, tier: string) => void;
  appVersion: string;
}

const defaultUser: UserProfile = {
  name: 'Anthony',
  email: 'anthony@livingpdfs.com',
  isPremium: false,
  ownedBookIds: ['tailwind-v4', 'react-19-deep-dive', 'typescript-rugged', 'clean-architecture-serverless'], // User owns these initial books!
  savedBookIds: ['typescript-rugged'],
  cachedBookIds: ['tailwind-v4', 'react-19-deep-dive', 'typescript-rugged', 'clean-architecture-serverless'],
  bookSubscriptions: {}
};

const initialProgress: ReadingProgress[] = [
  {
    bookId: 'tailwind-v4',
    currentPage: 3,
    lastReadTime: new Date(Date.now() - 3600000 * 24).toISOString(), // Yesterday
    timeSpentSeconds: 1540,
    completed: false,
    historyLog: [
      { date: '2026-05-24', pagesRead: 1, minutes: 5 },
      { date: '2026-05-25', pagesRead: 2, minutes: 12 },
      { date: '2026-05-26', pagesRead: 3, minutes: 8 }
    ]
  },
  {
    bookId: 'react-19-deep-dive',
    currentPage: 1,
    lastReadTime: new Date(Date.now() - 3600000 * 48).toISOString(),
    timeSpentSeconds: 420,
    completed: false,
    historyLog: [
      { date: '2026-05-25', pagesRead: 1, minutes: 7 }
    ]
  }
];

const initialNotifications: AppNotification[] = [
  {
    id: 'n1',
    bookId: 'tailwind-v4',
    bookTitle: 'Tailwind CSS v4.0 Mastery Guide',
    version: 'v4.2.1',
    date: '2026-05-25',
    title: 'Living PDF Version Upgraded!',
    message: 'Anthony Page updated your owned book: Tailwind CSS v4.0 Mastery Guide to v4.2.1. Dynamic CSS Container Queries documentation has been added to Chapter 6. Download the latest version to read it!',
    read: false
  },
  {
    id: 'n2',
    bookId: 'react-19-deep-dive',
    bookTitle: 'React 19 & Google Gemini Integration',
    version: 'v1.0.4',
    date: '2026-05-24',
    title: 'New Chapter Added by Elena',
    message: 'Author Elena Rostova has completed research on Token Compressions. A preview of the new pages is now live in your recommendations log.',
    read: true
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage, ensure custom migration is run if less than 2 books are owned
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sp_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.savedBookIds) {
          parsed.savedBookIds = [];
        }
        if (!parsed.bookSubscriptions) {
          parsed.bookSubscriptions = {};
        }
        if (!parsed.ownedBookIds || parsed.ownedBookIds.length <= 1) {
          parsed.ownedBookIds = ['tailwind-v4', 'react-19-deep-dive', 'typescript-rugged', 'clean-architecture-serverless'];
          parsed.cachedBookIds = Array.from(new Set([...(parsed.cachedBookIds || []), 'tailwind-v4', 'react-19-deep-dive', 'typescript-rugged', 'clean-architecture-serverless']));
        }
        return parsed;
      } catch (e) {
        return defaultUser;
      }
    }
    return defaultUser;
  });

  const [books, setBooks] = useState<Book[]>(mockBooks);

  const [progress, setProgress] = useState<ReadingProgress[]>(() => {
    const saved = localStorage.getItem('sp_progress');
    return saved ? JSON.parse(saved) : initialProgress;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('sp_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [currentTab, setCurrentTab] = useState<'showcase' | 'library' | 'analytics' | 'notifications' | 'pricing' | 'book-detail'>(() => {
    const saved = localStorage.getItem('sp_current_tab');
    return (saved as any) || 'showcase';
  });
  const [selectedBookId, setSelectedBookId] = useState<string | null>(() => {
    return localStorage.getItem('sp_selected_book_id') || null;
  });
  const [isReaderOpen, setIsReaderOpen] = useState(() => {
    return localStorage.getItem('sp_is_reader_open') === 'true';
  });
  const [isOffline, setIsOffline] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('sp_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [appVersion, setAppVersion] = useState(() => {
    return localStorage.getItem('sp_app_version') || APP_VERSION;
  });

  useEffect(() => {
    localStorage.setItem('sp_app_version', appVersion);
  }, [appVersion]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('sp_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sp_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('sp_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sp_dark_mode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('sp_current_tab', currentTab);
  }, [currentTab]);

  useEffect(() => {
    if (selectedBookId) {
      localStorage.setItem('sp_selected_book_id', selectedBookId);
    } else {
      localStorage.removeItem('sp_selected_book_id');
    }
  }, [selectedBookId]);

  useEffect(() => {
    localStorage.setItem('sp_is_reader_open', String(isReaderOpen));
  }, [isReaderOpen]);

  // Look for bookId in URL query parameters on mount to support opening the dynamic reader in a new tab
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get('bookId');
    if (bookId) {
      setSelectedBookId(bookId);
      setIsReaderOpen(true);
    }
  }, []);

  // Handle cross-device offline/online syncing logic
  const triggerSync = () => {
    if (isOffline) return;
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      setAppVersion(prev => {
        const parts = prev.substring(1).split('.').map(Number);
        if (parts.length >= 3) {
          parts[2] += 1;
        } else if (parts.length === 2) {
          parts[1] += 1;
        } else {
          parts[0] += 1;
        }
        return 'v' + parts.join('.');
      });
    }, 5000);
  };

  // Login handler
  const login = (email: string, name: string) => {
    setUser({
      name: name || 'Anthony',
      email: email || 'anthony@livingpdfs.com',
      isPremium: email.endsWith('@livingpdfs.com') || email.includes('premium'),
      ownedBookIds: ['tailwind-v4', 'react-19-deep-dive', 'typescript-rugged', 'clean-architecture-serverless'],
      savedBookIds: ['typescript-rugged'],
      cachedBookIds: ['tailwind-v4', 'react-19-deep-dive', 'typescript-rugged', 'clean-architecture-serverless']
    });
    triggerSync();
  };

  const logout = () => {
    setUser({
      name: 'Guest Reader',
      email: '',
      isPremium: false,
      ownedBookIds: [],
      savedBookIds: [],
      cachedBookIds: []
    });
    setProgress([]);
    setNotifications([]);
  };

  const purchaseBook = (bookId: string) => {
    setUser(prev => {
      if (prev.ownedBookIds.includes(bookId)) return prev;
      return {
        ...prev,
        ownedBookIds: [...prev.ownedBookIds, bookId],
        // Auto cache on buy
        cachedBookIds: [...prev.cachedBookIds, bookId]
      };
    });
    triggerSync();
  };

  const deleteOwnedBook = (bookId: string) => {
    setUser(prev => {
      return {
        ...prev,
        ownedBookIds: prev.ownedBookIds.filter(id => id !== bookId),
        cachedBookIds: prev.cachedBookIds.filter(id => id !== bookId)
      };
    });
    triggerSync();
  };

  const toggleSaveBook = (bookId: string) => {
    setUser(prev => {
      const savedBookIds = prev.savedBookIds.includes(bookId)
        ? prev.savedBookIds.filter(id => id !== bookId)
        : [...prev.savedBookIds, bookId];
      return { ...prev, savedBookIds };
    });
    triggerSync();
  };

  const subscribeToBook = (bookId: string, tier: string) => {
    setUser(prev => {
      const subs = prev.bookSubscriptions || {};
      const updatedSubs = { ...subs, [bookId]: tier };
      
      // Auto-unlock book if they subscribed:
      const owned = prev.ownedBookIds.includes(bookId) 
        ? prev.ownedBookIds 
        : [...prev.ownedBookIds, bookId];

      const cached = prev.cachedBookIds.includes(bookId)
        ? prev.cachedBookIds
        : [...prev.cachedBookIds, bookId];

      return {
        ...prev,
        bookSubscriptions: updatedSubs,
        ownedBookIds: owned,
        cachedBookIds: cached
      };
    });
    triggerSync();
  };

  const toggleCacheBook = (bookId: string) => {
    setUser(prev => {
      const cachedBookIds = prev.cachedBookIds.includes(bookId)
        ? prev.cachedBookIds.filter(id => id !== bookId)
        : [...prev.cachedBookIds, bookId];
      return { ...prev, cachedBookIds };
    });
  };

  const updateReadingProgress = (bookId: string, pageNumber: number, secondsSpent: number) => {
    setProgress(prev => {
      const existing = prev.find(p => p.bookId === bookId);
      const bookObj = books.find(b => b.id === bookId);
      const totalPages = bookObj ? bookObj.totalPages : 50;
      const completed = pageNumber >= totalPages;

      const dateStr = new Date().toISOString().split('T')[0];

      if (existing) {
        // Update existing record
        const historyLog = [...existing.historyLog];
        const logIndex = historyLog.findIndex(log => log.date === dateStr);
        const pagesReadIncrement = Math.max(0, pageNumber - existing.currentPage);

        if (logIndex >= 0) {
          historyLog[logIndex] = {
            ...historyLog[logIndex],
            pagesRead: historyLog[logIndex].pagesRead + pagesReadIncrement,
            minutes: historyLog[logIndex].minutes + (secondsSpent / 60)
          };
        } else {
          historyLog.push({
            date: dateStr,
            pagesRead: Math.max(1, pagesReadIncrement),
            minutes: Math.max(1, secondsSpent / 60)
          });
        }

        return prev.map(p => {
          if (p.bookId === bookId) {
            return {
              ...p,
              currentPage: pageNumber,
              lastReadTime: new Date().toISOString(),
              timeSpentSeconds: p.timeSpentSeconds + secondsSpent,
              completed: completed || p.completed,
              historyLog
            };
          }
          return p;
        });
      } else {
        // Create new record
        return [
          ...prev,
          {
            bookId,
            currentPage: pageNumber,
            lastReadTime: new Date().toISOString(),
            timeSpentSeconds: secondsSpent,
            completed,
            historyLog: [{ date: dateStr, pagesRead: pageNumber, minutes: Math.max(1, secondsSpent / 60) }]
          }
        ];
      }
    });

    if (!isOffline) {
      // Simulate micro-write incremental sync
      setSyncStatus('syncing');
      setTimeout(() => setSyncStatus('synced'), 800);
    }
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const addNotification = (bookId: string, title: string, message: string) => {
    const bookObj = books.find(b => b.id === bookId);
    const newNotif: AppNotification = {
      id: 'n_' + Math.random().toString(36).substring(2, 9),
      bookId,
      bookTitle: bookObj ? bookObj.title : 'Updated Resource',
      version: bookObj ? bookObj.currentVersion : 'v1.0.0',
      date: new Date().toISOString().split('T')[0],
      title,
      message,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Action helper to simulate authors updating deep guides in real-time
  const triggerLivingUpdate = (bookId: string) => {
    const targetBook = books.find(b => b.id === bookId);
    if (!targetBook) return;

    // Simulate minor version increment
    const currentVerParts = targetBook.currentVersion.substring(1).split('.').map(Number);
    currentVerParts[2] += 1; // Increment patch
    const nextVer = 'v' + currentVerParts.join('.');

    setBooks(prevBooks =>
      prevBooks.map(b => {
        if (b.id === bookId) {
          const updatedHistory = [
            {
              version: nextVer,
              date: new Date().toISOString().split('T')[0],
              changes: [
                'Author Anthony updated dynamic schemas and refined core code snippet formatting.',
                'Completed proof-reading adjustments for Chapter 3.',
                'Refined illustrations and optimized responsive layouts.'
              ]
            },
            ...b.updateHistory
          ];
          return {
            ...b,
            currentVersion: nextVer,
            lastUpdated: new Date().toISOString().split('T')[0],
            updateHistory: updatedHistory
          };
        }
        return b;
      })
    );

    addNotification(
      bookId,
      'Living-PDF Real-Time Update Notice!',
      `Author ${targetBook.author} published version ${nextVer} of ${targetBook.title}. High priority security patterns, typographic styling fixes, and index tables have been refreshed. Click to update your copies.`
    );

    setAppVersion(prev => {
      const parts = prev.substring(1).split('.').map(Number);
      if (parts.length >= 3) {
        parts[2] += 1;
      } else if (parts.length === 2) {
        parts[1] += 1;
      } else {
        parts[0] += 1;
      }
      return 'v' + parts.join('.');
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        books,
        progress,
        notifications,
        currentTab,
        setCurrentTab,
        selectedBookId,
        setSelectedBookId,
        isReaderOpen,
        setIsReaderOpen,
        isOffline,
        setIsOffline,
        isDarkMode,
        setIsDarkMode,
        syncStatus,
        triggerSync,
        login,
        logout,
        purchaseBook,
        deleteOwnedBook,
        toggleSaveBook,
        toggleCacheBook,
        updateReadingProgress,
        markNotificationRead,
        addNotification,
        triggerLivingUpdate,
        subscribeToBook,
        appVersion
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside an AppProvider');
  return context;
};
