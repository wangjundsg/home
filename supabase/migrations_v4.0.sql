-- V4.0 Migration: Monthly redlines + reward redemptions + push subscriptions

CREATE TABLE IF NOT EXISTS monthly_redlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  month_start DATE NOT NULL,
  cleared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(author, month_start)
);

CREATE TABLE IF NOT EXISTS reward_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  tier TEXT NOT NULL,
  reward_name TEXT NOT NULL,
  cost INTEGER NOT NULL,
  detail TEXT,
  target TEXT NOT NULL,
  fulfilled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER PUBLICATION supabase_realtime ADD TABLE monthly_redlines;
ALTER PUBLICATION supabase_realtime ADD TABLE reward_redemptions;
ALTER PUBLICATION supabase_realtime ADD TABLE push_subscriptions;
