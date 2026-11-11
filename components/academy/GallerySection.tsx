"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { GALLERY_DATA, GalleryImage } from "@/lib/academy-content";

interface GallerySectionProps {
  images?: GalleryImage[];
  posts?: GalleryImage[];
}

export function GallerySection({ images, posts }: GallerySectionProps) {
  // Support either images or posts prop for backwards-compatibility
  const rawList: GalleryImage[] = images || posts || GALLERY_DATA;
  const visibleImages = rawList.filter((img) => img.visible !== false);
  const count = visibleImages.length;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const isOpen = lightboxIndex !== null && count > 0;
  const currentImage = isOpen ? visibleImages[lightboxIndex] : null;

  const openLightbox = (index: number) => {
    triggerRef.current = document.activeElement as HTMLElement;
    setLightboxIndex(index);
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    setTimeout(() => {
      triggerRef.current?.focus();
    }, 50);
  }, []);

  const showNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % count : 0));
  }, [count]);

  const showPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + count) % count : count - 1));
  }, [count]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      closeBtnRef.current?.focus();

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Keyboard navigation & Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        showNext();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        showPrev();
        return;
      }

      // Simple focus trap inside lightbox
      if (e.key === "Tab" && lightboxRef.current) {
        const focusables = lightboxRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length > 0) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeLightbox, showNext, showPrev]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        showNext();
      } else {
        showPrev();
      }
    }
  };

  return (
    <section
      id="gallery"
      className="w-full py-20 px-4 lg:px-12 border-b border-outline-subtle bg-surface scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Section Header */}
        <div className="flex flex-col gap-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Academy Moments</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-on-surface">
            Gallery
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
            Inside our interactive cohorts, online simul arenas, and student tactical analysis sessions.
          </p>
        </div>

        {/* Gallery Grid */}
        {count === 0 ? (
          <div className="py-16 text-center border border-dashed border-outline-subtle rounded-2xl bg-surface-low/30 max-w-md mx-auto w-full">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/60 mb-2">
              photo_library
            </span>
            <p className="font-mono text-sm text-on-surface-variant">Photos coming soon.</p>
          </div>
        ) : (
          <div
            className={`grid gap-4 sm:gap-6 ${
              count === 1
                ? "grid-cols-1 max-w-md mx-auto w-full"
                : count === 2
                ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto w-full"
                : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {visibleImages.map((img, idx) => {
              const alt =
                img.imageAlt || `Rahman Chess Academy online chess class – photo ${idx + 1}`;

              return (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => openLightbox(idx)}
                  aria-label={`View photo ${idx + 1} of ${count}`}
                  className="group relative aspect-[4/3] rounded-xl border border-outline-subtle bg-surface-low overflow-hidden hover:border-primary transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface text-left"
                >
                  <Image
                    src={img.imageUrl}
                    alt={alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="material-symbols-outlined text-white text-lg drop-shadow">
                      zoom_in
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Accessible Lightbox Modal */}
      {isOpen && currentImage && (
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery lightbox"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar: Counter & Close Button */}
          <div className="w-full max-w-6xl flex items-center justify-between text-on-surface z-10 py-2">
            <span className="font-mono text-xs sm:text-sm text-on-surface-variant font-bold tracking-wider">
              {lightboxIndex + 1} / {count}
            </span>
            <button
              ref={closeBtnRef}
              type="button"
              aria-label="Close lightbox"
              onClick={closeLightbox}
              className="p-2 rounded-lg bg-surface-high hover:bg-surface-highest text-on-surface hover:text-primary transition-colors cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          {/* Central Image with Navigation */}
          <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center py-2 min-h-0">
            {/* Prev Button */}
            {count > 1 && (
              <button
                type="button"
                aria-label="Previous image"
                onClick={showPrev}
                className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full bg-surface-lowest/80 hover:bg-surface border border-outline-subtle text-on-surface hover:text-primary transition-all cursor-pointer shadow-xl backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="material-symbols-outlined text-2xl sm:text-3xl">
                  chevron_left
                </span>
              </button>
            )}

            {/* Next/Image Render with Cloudinary Width/Height */}
            <div className="relative max-h-full max-w-full flex items-center justify-center">
              <Image
                src={currentImage.imageUrl}
                alt={
                  currentImage.imageAlt ||
                  `Rahman Chess Academy online chess class – photo ${lightboxIndex + 1}`
                }
                width={currentImage.width || 1200}
                height={currentImage.height || 900}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                loading="lazy"
                priority={false}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-outline-subtle/40"
              />
            </div>

            {/* Next Button */}
            {count > 1 && (
              <button
                type="button"
                aria-label="Next image"
                onClick={showNext}
                className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-surface-lowest/80 hover:bg-surface border border-outline-subtle text-on-surface hover:text-primary transition-all cursor-pointer shadow-xl backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="material-symbols-outlined text-2xl sm:text-3xl">
                  chevron_right
                </span>
              </button>
            )}
          </div>

          {/* Bottom Caption / Alt Text */}
          <div className="w-full max-w-3xl text-center py-2 z-10">
            <p className="text-xs sm:text-sm text-on-surface-variant font-mono truncate px-4">
              {currentImage.imageAlt ||
                `Rahman Chess Academy online chess class – photo ${lightboxIndex + 1}`}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
