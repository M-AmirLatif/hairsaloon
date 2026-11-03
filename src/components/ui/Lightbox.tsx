import React, { useEffect, useRef, useCallback } from 'react';
import type { GalleryImage } from '../../config/schema';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < images.length;
  useBodyScrollLock(isOpen);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const touchStartXRef = useRef<number | null>(null);

  const currentImage = isOpen ? images[currentIndex!] : null;

  const handleNext = useCallback(() => {
    if (currentIndex === null) return;
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const handlePrev = useCallback(() => {
    if (currentIndex === null) return;
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      closeButtonRef.current?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // Keyboard navigation & trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Tab' && dialogRef.current) {
        // Focus trap
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Touch Swipe Handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartXRef.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
  };

  if (!isOpen || !currentImage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-caption"
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top action bar: counter + close button */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between text-[#F5F0E8] z-20">
        <span className="text-xs md:text-sm font-medium tracking-wide bg-[#161618]/80 px-3 py-1.5 rounded-full border border-white/10">
          {currentIndex! + 1} of {images.length}
        </span>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close preview"
          className="p-2.5 rounded-full bg-[#161618]/80 text-[#F5F0E8] hover:text-[#C9A96E] hover:bg-[#2A2A2D] transition-colors border border-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Prev button */}
      <button
        onClick={handlePrev}
        aria-label="Previous image"
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#161618]/80 text-[#F5F0E8] hover:text-[#C9A96E] hover:bg-[#2A2A2D] transition-all border border-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center z-20 shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Main Image Stage */}
      <div
        className="relative max-w-5xl max-h-[80vh] mx-auto p-4 flex flex-col items-center justify-center select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="max-h-[65vh] w-auto max-w-full rounded-lg object-contain shadow-2xl border border-white/10"
        />

        {/* Caption & Attribution info */}
        <div className="mt-4 text-center max-w-xl px-4">
          <p id="lightbox-caption" className="text-sm md:text-base text-[#F5F0E8] font-medium leading-snug">
            {currentImage.alt}
          </p>
          <p className="text-xs text-[#A8A39D] mt-1.5 flex items-center justify-center gap-1.5 flex-wrap">
            <span>Illustrative stock photo by</span>
            <a
              href={currentImage.credit.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A96E] hover:underline inline-flex items-center gap-0.5"
            >
              {currentImage.credit.photographer} ({currentImage.credit.source})
            </a>
          </p>
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        aria-label="Next image"
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#161618]/80 text-[#F5F0E8] hover:text-[#C9A96E] hover:bg-[#2A2A2D] transition-all border border-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center z-20 shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
