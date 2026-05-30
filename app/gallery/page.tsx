import GalleryGrid from "@/components/GalleryGrid";
import { getPhotosByCategory } from "@/lib/cloudinary";
import type { Category } from "@/lib/supabase";

export const revalidate = 60;

const CATEGORIES: Category[] = ["candid", "urban", "night", "cars"];

export default async function GalleryPage() {
  // Fetch all categories in parallel from Cloudinary
  const results = await Promise.all(
    CATEGORIES.map(async (cat) => {
      const photos = await getPhotosByCategory(cat);
      return photos.map((p) => ({
        id: p.public_id,
        title: p.public_id.split("/").pop() ?? "",
        category: cat,
        cloudinary_url: p.secure_url,
        cloudinary_public_id: p.public_id,
        uploaded_at: "",
      }));
    })
  );

  const photos = results.flat();

  return (
    <div className="pt-28 pb-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <div className="mb-12">
        <p className="text-xs tracking-widest uppercase text-muted mb-3">
          Portfolio
        </p>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
          Gallery
        </h1>
      </div>

      {photos.length === 0 ? (
        <p className="text-muted text-sm tracking-wide">
          No photos yet — upload images to your Cloudinary folders to get started.
        </p>
      ) : (
        <GalleryGrid photos={photos} />
      )}
    </div>
  );
}
