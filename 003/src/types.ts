export interface BookUpdateLog {
  version: string;
  date: string;
  changes: string[];
}

export interface BookPage {
  pageNumber: number;
  title: string;
  content: string; // HTML-like or clean-text format for highly styled reader pages
  hasIllustration?: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  thumbnailColor: string; // Tailwinds colors or gradient classes for gorgeous book covers
  iconName: string; // Lucide icon name placeholder for cover art
  price: number;
  totalPages: number;
  lastUpdated: string;
  currentVersion: string;
  updateHistory: BookUpdateLog[];
  pages: BookPage[];
  isNew?: boolean;
  isPopular?: boolean;
  tags: string[];
  coverUrl?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  isPremium: boolean;
  ownedBookIds: string[];
  savedBookIds: string[];
  cachedBookIds: string[];
  bookSubscriptions?: Record<string, string>; // Maps bookId -> subscription tier (e.g., 'bronze' | 'silver' | 'gold')
}

export interface ReadingProgress {
  bookId: string;
  currentPage: number;
  lastReadTime: string;
  timeSpentSeconds: number;
  completed: boolean;
  historyLog: { date: string; pagesRead: number; minutes: number }[];
}

export interface AppNotification {
  id: string;
  bookId: string;
  bookTitle: string;
  version: string;
  date: string;
  title: string;
  message: string;
  read: boolean;
}
