import { getPhotos } from "@/lib/supabase";
import GalleryGrid from "@/components/GalleryGrid";

export const revalidate = 60; // ISR — revalidate every 60 seconds

export default async function GalleryPage() {
  const photos = await getPhotos();

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

      <GalleryGrid photos={photos} />
    </div>
  );
}
