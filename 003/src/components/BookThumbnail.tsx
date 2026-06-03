import React, { useState } from 'react';
import { Book } from '../types';
import { BookCover } from './BookCover';

interface BookThumbnailProps {
  book: Book;
  className?: string;
  imageClassName?: string;
  showSpine?: boolean;
}

export const BookThumbnail: React.FC<BookThumbnailProps> = ({
  book,
  className = "w-full h-full",
  imageClassName = "absolute inset-0 w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-103",
  showSpine = true,
}) => {
  const [hasError, setHasError] = useState(false);

  // Strip leading query parameter for clean look or use standard relative pathing
  const coverUrl = book.coverUrl;

  if (coverUrl && !coverUrl.startsWith('http') && !hasError) {
    // Standard relative prefix logic if path doesn't start with /
    const cleanUrl = coverUrl.startsWith('/') ? coverUrl : `/${coverUrl}`;

    return (
      <div className={`relative ${className} w-full h-full bg-zinc-950 overflow-hidden`}>
        <img
          src={cleanUrl}
          alt={book.title}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className={imageClassName}
        />
        
        {/* Real 3D Physical Spine relief and textured page edge shadow overlay */}
        {showSpine && (
          <>
            <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/45 via-black/10 to-transparent border-r border-white/5 pointer-events-none z-10" />
            <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:3px_3px] pointer-events-none z-10 mix-blend-overlay" />
          </>
        )}
      </div>
    );
  }

  return <BookCover book={book} className={className} showSpine={showSpine} />;
};
