import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
};

/**
 * Build an optimised Cloudinary URL with standard transformations.
 * w_800, q_auto, f_auto — never serves raw full-resolution images.
 */
export function buildCloudinaryUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    width: 800,
    quality: "auto",
    fetch_format: "auto",
    secure: true,
  });
}

/**
 * Fetch all images from a category folder.
 * Uses resources_by_asset_folder (newer Cloudinary accounts).
 * Folder structure: still-stories/{category}
 */
export async function getPhotosByCategory(
  category: string
): Promise<CloudinaryResource[]> {
  try {
    const result = await cloudinary.api.resources_by_asset_folder(
      `still-stories/${category}`,
      { max_results: 100, resource_type: "image" }
    );

    return (result.resources as CloudinaryResource[]).map((r) => ({
      ...r,
      secure_url: buildCloudinaryUrl(r.public_id),
    }));
  } catch (error) {
    console.error(`Cloudinary error fetching ${category}:`, error);
    return [];
  }
}

export { cloudinary };
