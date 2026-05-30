"use client";

import { useState } from "react";
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

  const filtered =
    active === "all" ? photos : photos.filter((p) => p.category === active);

  return (
    <div>
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
            <div key={photo.id} className="break-inside-avoid group">
              <div className="relative overflow-hidden bg-surface">
                <Image
                  src={photo.cloudinary_url}
                  alt={photo.title || photo.category}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover transition-opacity duration-300 group-hover:opacity-90"
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
