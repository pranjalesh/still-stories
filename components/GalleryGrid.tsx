"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

export default function GalleryGrid({ photos }: Props) {
  const [active, setActive] = useState<Category | "all">("all");
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  const filtered =
    active === "all" ? photos : photos.filter((p) => p.category === active);

  const fullResUrl = (photo: GalleryPhoto) =>
    photo.cloudinary_url.replace(/,?w_800,?/, "").replace(/,,/, ",");

  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const openLightbox = (photo: GalleryPhoto) => {
    setLightbox(photo);
    resetZoom();
  };

  const closeLightbox = () => {
    setLightbox(null);
    resetZoom();
  };

  const zoomIn = () => setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM));
  const zoomOut = () => {
    setZoom((z) => {
      const next = Math.max(z - ZOOM_STEP, MIN_ZOOM);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  };

  const showPrev = useCallback(() => {
    if (!lightbox) return;
    const idx = filtered.findIndex((p) => p.id === lightbox.id);
    setLightbox(filtered[(idx - 1 + filtered.length) % filtered.length]);
    resetZoom();
  }, [lightbox, filtered]);

  const showNext = useCallback(() => {
    if (!lightbox) return;
    const idx = filtered.findIndex((p) => p.id === lightbox.id);
    setLightbox(filtered[(idx + 1) % filtered.length]);
    resetZoom();
  }, [lightbox, filtered]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
      if (e.key === "0") resetZoom();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, showPrev, showNext]);

  // Scroll to zoom
  useEffect(() => {
    if (!lightbox) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [lightbox]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  // Drag to pan when zoomed
  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    dragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...pan };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    setPan({
      x: panStart.current.x + (e.clientX - dragStart.current.x),
      y: panStart.current.y + (e.clientY - dragStart.current.y),
    });
  };
  const onMouseUp = () => { dragging.current = false; };

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
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center overflow-hidden"
          onClick={zoom === 1 ? closeLightbox : undefined}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {/* Top controls */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
            {/* Zoom out */}
            <button
              onClick={(e) => { e.stopPropagation(); zoomOut(); }}
              disabled={zoom <= MIN_ZOOM}
              className="w-8 h-8 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-white/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg leading-none"
              aria-label="Zoom out"
            >
              −
            </button>

            {/* Zoom level */}
            <span className="text-white/40 text-xs tracking-widest w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>

            {/* Zoom in */}
            <button
              onClick={(e) => { e.stopPropagation(); zoomIn(); }}
              disabled={zoom >= MAX_ZOOM}
              className="w-8 h-8 flex items-center justify-center border border-white/20 text-white/60 hover:text-white hover:border-white/60 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-lg leading-none"
              aria-label="Zoom in"
            >
              +
            </button>

            {/* Reset */}
            {zoom > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); resetZoom(); }}
                className="text-xs tracking-widest uppercase text-white/40 hover:text-white transition-colors"
                aria-label="Reset zoom"
              >
                Reset
              </button>
            )}
          </div>

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

          {/* Image — pannable when zoomed */}
          <div
            className="relative"
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transition: dragging.current ? "none" : "transform 0.15s ease",
              cursor: zoom > 1 ? "grab" : "default",
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={onMouseDown}
          >
            <Image
              src={fullResUrl(lightbox)}
              alt={lightbox.title || lightbox.category}
              width={1600}
              height={1200}
              className="object-contain max-w-[90vw] max-h-[90vh] w-auto h-auto select-none"
              sizes="90vw"
              priority
              draggable={false}
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

          {/* Hint */}
          {zoom === 1 && (
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/20 text-xs tracking-widest">
              scroll to zoom · click outside to close
            </p>
          )}
        </div>
      )}
    </>
  );
}
