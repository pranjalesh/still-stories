-- Still Stories — Seed data
-- 8 placeholder rows spread across 4 categories
-- Replace cloudinary_url and cloudinary_public_id with real values after upload

INSERT INTO photos (title, category, cloudinary_url, cloudinary_public_id) VALUES
  -- candid (2)
  (
    'Crossing in the rain',
    'candid',
    'https://res.cloudinary.com/demo/image/upload/w_800,q_auto,f_auto/still-stories/candid/candid-01',
    'still-stories/candid/candid-01'
  ),
  (
    'Market glance',
    'candid',
    'https://res.cloudinary.com/demo/image/upload/w_800,q_auto,f_auto/still-stories/candid/candid-02',
    'still-stories/candid/candid-02'
  ),

  -- urban (2)
  (
    'Glass towers',
    'urban',
    'https://res.cloudinary.com/demo/image/upload/w_800,q_auto,f_auto/still-stories/urban/urban-01',
    'still-stories/urban/urban-01'
  ),
  (
    'Underpass geometry',
    'urban',
    'https://res.cloudinary.com/demo/image/upload/w_800,q_auto,f_auto/still-stories/urban/urban-02',
    'still-stories/urban/urban-02'
  ),

  -- night (2)
  (
    'Neon spill',
    'night',
    'https://res.cloudinary.com/demo/image/upload/w_800,q_auto,f_auto/still-stories/night/night-01',
    'still-stories/night/night-01'
  ),
  (
    'Last train',
    'night',
    'https://res.cloudinary.com/demo/image/upload/w_800,q_auto,f_auto/still-stories/night/night-02',
    'still-stories/night/night-02'
  ),

  -- cars (2)
  (
    'The vendor',
    'cars',
    'https://res.cloudinary.com/demo/image/upload/w_800,q_auto,f_auto/still-stories/cars/cars-01',
    'still-stories/cars/cars-01'
  ),
  (
    'Waiting for the bus',
    'cars',
    'https://res.cloudinary.com/demo/image/upload/w_800,q_auto,f_auto/still-stories/cars/cars-02',
    'still-stories/cars/cars-02'
  );
