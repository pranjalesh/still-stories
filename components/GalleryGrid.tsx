"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { Category } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/supabase";

type GalleryPhoto = {
  id: string | number;
  title: string;
  category: Category;
  cloudinary_url: string;
  cloudinary_public_id: string;
  uploaded_at: string;
};

type Props = {
  photos: GalleryPhoto[];
};

export default function GalleryGrid({ photos }: Props) {
  const [active, setActive] = useState<Category | "all">("all");
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);

  const filtered =
    active === "all" ? photos : photos.filter((p) => p.category === active);

  // Full-res URL — remove w_800 cap so Cloudinary serves the original size
  const fullResUrl = (photo: GalleryPhoto) =>
    photo.cloudinary_url.replace(/,?w_800,?/, "").replace(/,,/, ",");

  const openLightbox = (photo: GalleryPhoto) => setLightbox(photo);
  const closeLightbox = () => setLightbox(null);

  const showPrev = useCallback(() => {
    if (!lightbox) return;
    const idx = filtered.findIndex((p) => p.id === lightbox.id);
    setLightbox(filtered[(idx - 1 + filtered.length) % filtered.length]);
  }, [lightbox, filtered]);

  const showNext = useCallback(() => {
    if (!lightbox) return;
    const idx = filtered.findIndex((p) => p.id === lightbox.id);
    setLightbox(filtered[(idx + 1) % filtered.length]);
  }, [lightbox, filtered]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, showPrev, showNext]);

  // Prevent background scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <>
      {/* Filter bar */}
      <div className="flex items-center gap-4 mb-10 flex-wrap">
        <button
          onClick={() => setActive("all")}
          className={clsx(
            "px-4 py-1.5 text-xs tracking-widest uppercase border transition-colors",
            active === "all"
              ? "border-white text-white"
              : "border-border text-muted hover:border-white hover:text-white"
          )}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={clsx(
              "px-4 py-1.5 text-xs tracking-widest uppercase border transition-colors",
              active === cat
                ? "border-white text-white"
                : "border-border text-muted hover:border-white hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      {filtered.length === 0 ? (
        <p className="text-muted text-sm tracking-wide">No photos found.</p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((photo) => (
            <div
              key={photo.id}
              className="break-inside-avoid group cursor-zoom-in"
              onClick={() => openLightbox(photo)}
            >
              <div className="relative overflow-hidden bg-surface">
                <Image
                  src={photo.cloudinary_url}
                  alt={photo.title || photo.category}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover transition-opacity duration-300 group-hover:opacity-85"
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-6 text-white/60 hover:text-white text-2xl leading-none z-10"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Prev */}
          {filtered.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); showPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-3xl z-10 px-2"
              aria-label="Previous"
            >
              ‹
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={fullResUrl(lightbox)}
              alt={lightbox.title || lightbox.category}
              width={1600}
              height={1200}
              className="object-contain max-w-[90vw] max-h-[90vh] w-auto h-auto"
              sizes="90vw"
              priority
            />
          </div>

          {/* Next */}
          {filtered.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); showNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-3xl z-10 px-2"
              aria-label="Next"
            >
              ›
            </button>
          )}
        </div>
      )}
    </>
  );
}
