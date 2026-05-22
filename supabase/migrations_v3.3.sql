-- V3.3 Migration: Add shared diary, relay story, and doodle tables

CREATE TABLE IF NOT EXISTS shared_diaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  content TEXT NOT NULL DEFAULT '',
  mood TEXT DEFAULT '😊',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS relay_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id TEXT NOT NULL,
  author TEXT NOT NULL,
  sentence TEXT NOT NULL,
  turn_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doodles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  prompt TEXT DEFAULT '',
  image_base64 TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable realtime for all new tables
ALTER PUBLICATION supabase_realtime ADD TABLE shared_diaries;
ALTER PUBLICATION supabase_realtime ADD TABLE relay_stories;
ALTER PUBLICATION supabase_realtime ADD TABLE doodles;
