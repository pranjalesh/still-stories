import { NextResponse } from "next/server";
import { getPhotos } from "@/lib/supabase";
import type { Category } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as Category | null;

  const photos = await getPhotos(category ?? undefined);
  return NextResponse.json(photos);
}
