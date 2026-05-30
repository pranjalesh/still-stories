import { createClient, SupabaseClient } from "@supabase/supabase-js";

export type Photo = {
  id: number;
  title: string;
  category: "candid" | "urban" | "night" | "people";
  cloudinary_url: string;
  cloudinary_public_id: string;
  uploaded_at: string;
};

export type Category = "candid" | "urban" | "night" | "people";

export const CATEGORIES: Category[] = ["candid", "urban", "night", "people"];

// Lazy singleton — avoids module-level crash when env vars are absent at build time
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables."
    );
  }

  _client = createClient(url, key);
  return _client;
}

export async function getPhotos(category?: Category): Promise<Photo[]> {
  try {
    const supabase = getClient();

    let query = supabase
      .from("photos")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return [];
    }

    return data as Photo[];
  } catch (err) {
    console.error("Supabase client error:", err);
    return [];
  }
}
