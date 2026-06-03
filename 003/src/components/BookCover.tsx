import React from 'react';
import * as Icons from 'lucide-react';
import { Book } from '../types';

interface BookCoverProps {
  book: Book;
  className?: string;
  showSpine?: boolean;
}

// Map the string icon Names to actual Lucide component types
const iconMap: Record<string, React.ComponentType<any>> = {
  Database: Icons.Database,
  Cpu: Icons.Cpu,
  Compass: Icons.Compass,
  Zap: Icons.Zap,
  Sparkles: Icons.Sparkles,
  Globe: Icons.Globe,
  ShieldAlert: Icons.ShieldAlert,
  Server: Icons.Server,
  Shield: Icons.Shield,
  Layers: Icons.Layers,
  Share2: Icons.Share2,
  Brain: Icons.Brain,
  Cloud: Icons.Cloud,
  BookOpen: Icons.BookOpen,
  Terminal: Icons.Terminal,
};

export const BookCover: React.FC<BookCoverProps> = ({ 
  book, 
  className = "w-full h-full", 
  showSpine = true 
}) => {
  // Resolve Icon
  const IconComponent = iconMap[book.iconName] || Icons.BookOpen;

  // Determine an elegant secondary accent color based on thumbColor or id
  const isPostgres = book.id.includes('postgres');
  const isKube = book.id.includes('kubernetes');
  const isSvelte = book.id.includes('svelte');
  const isCSS = book.id.includes('css');
  const isCopilot = book.id.includes('copilot');
  const isRedis = book.id.includes('redis');
  const isAstro = book.id.includes('astro');
  const isSec = book.id.includes('web-security');
  const isUx = book.id.includes('ux');
  const isGo = book.id.includes('go-grpc');

  // Specific accent rings and style patterns for that "signature" tech-jacket feel
  const accentBorder = isSvelte 
    ? "border-orange-500/30" 
    : isGo 
    ? "border-cyan-400/30" 
    : isCSS 
    ? "border-yellow-400/30" 
    : "border-white/20";

  const glowColor = isSvelte 
    ? "shadow-orange-500/20" 
    : isGo 
    ? "shadow-cyan-400/20" 
    : isPostgres 
    ? "shadow-indigo-500/20" 
    : "shadow-violet-500/20";

  return (
    <div className={`relative ${className} bg-zinc-950 overflow-hidden select-none flex flex-col justify-between text-white rounded-none border border-zinc-900 shadow-md transition-all duration-300`}>
      
      {/* Dynamic Ambient Color Gradient in the Background (No mix-blend-multiply so colors are rich and vibrant!) */}
      <div className={`absolute inset-0 bg-gradient-to-br ${book.thumbnailColor} opacity-90`} />

      {/* Premium dark radial-gradient vignette for incredible tactile visual depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.75)_100%)] pointer-events-none" />
      
      {/* Decorative Technical Vector Background Grid */}
      <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:10px_10px] mix-blend-overlay" />
      
      {/* Watermarked giant background icon */}
      <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none transform scale-150 rotate-12">
        <IconComponent size={140} className="stroke-[1.5]" />
      </div>

      {/* Decorative circuit/blueprint line across the top */}
      <div className="absolute top-10 left-0 right-0 h-[1px] bg-white/10" />
      <div className="absolute top-[39px] right-6 w-2 h-2 rounded-full border border-white/20" />

      {/* 1. Header Metadata Area */}
      <div className="relative z-10 p-3.5 pb-2 flex items-center justify-between border-b border-white/10 font-mono text-[7px] md:text-[8px] font-bold tracking-wider text-white/70">
        <span className="flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-white animate-pulse" />
          LIVING BOOK ARCHIVE
        </span>
        <span className="bg-white/15 px-1.5 py-0.5 rounded text-[6px] text-white">
          {book.currentVersion || 'v1.0'}
        </span>
      </div>

      {/* 2. Central Structural Emblem / Art Frame */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-3">
        <div className={`p-3 relative bg-black/30 rounded-full border ${accentBorder} shadow-2xl backdrop-blur-sm ${glowColor} group-hover:scale-105 transition-transform duration-500`}>
          
          <IconComponent className="w-7 h-7 text-white stroke-[1.25]" />
          
          {/* Animated decorative orbit ring */}
          <div className="absolute inset-0 border border-dashed border-white/25 rounded-full animate-spin [animation-duration:16s] -m-1" />
          <div className="absolute inset-0 border border-dotted border-white/10 rounded-full animate-spin [animation-duration:30s] -m-2" />
        </div>
      </div>

      {/* 3. Typography & Information Area */}
      <div className="relative z-10 p-3.5 pt-2 flex flex-col gap-1.5 bg-gradient-to-t from-black/60 via-black/30 to-transparent mt-auto">
        <div>
          {/* Category Tag */}
          <span className="font-mono text-[6px] md:text-[7px] text-white/50 tracking-widest uppercase font-black block">
            {book.category}
          </span>
          {/* Book Title */}
          <h3 className="font-sans text-[10px] sm:text-xs font-extrabold tracking-tight leading-snug uppercase text-white block mt-0.5 mt-1 line-clamp-3">
            {book.title}
          </h3>
          {/* Author */}
          <span className="font-mono text-[6px] md:text-[7.5px] text-zinc-300 block mt-1 tracking-wide uppercase font-semibold">
            {book.author}
          </span>
        </div>

        {/* 4. Elegant Footer Area */}
        <div className="flex justify-between items-center text-[6px] md:text-[7.5px] font-mono border-t border-white/10 pt-2 text-white/65 mt-1">
          <span className="tracking-wider">{book.totalPages} PAGES</span>
          
          {/* Fictional barcode layout */}
          <div className="flex gap-[1px] h-3 items-end opacity-45">
            <div className="w-[1.5px] bg-white h-full" />
            <div className="w-[0.5px] bg-white h-4/5" />
            <div className="w-[0.5px] bg-white h-full" />
            <div className="w-[2px] bg-white h-3/5" />
            <div className="w-[0.5px] bg-white h-5/6" />
            <div className="w-[1px] bg-white h-2/5" />
            <div className="w-[1.5px] bg-white h-full" />
          </div>
        </div>
      </div>

      {/* Spine visual relief (the 3D book leaf shadowing on left) */}
      {showSpine && (
        <div className="absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-r from-black/35 via-black/5 to-transparent border-r border-white/5 pointer-events-none z-20" />
      )}
      
      {/* High-quality reflection gleam */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white-[0.02] to-transparent translate-y-full hover:translate-y-[-100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
    </div>
  );
};
