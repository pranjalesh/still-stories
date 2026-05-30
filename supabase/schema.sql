-- Still Stories — Supabase schema
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  category VARCHAR(100) NOT NULL CHECK (category IN ('candid', 'urban', 'night', 'people')),
  cloudinary_url TEXT NOT NULL,
  cloudinary_public_id TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (read-only for anon)
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access"
  ON photos FOR SELECT
  USING (true);

-- Index for category filtering
CREATE INDEX idx_photos_category ON photos (category);
CREATE INDEX idx_photos_uploaded_at ON photos (uploaded_at DESC);
