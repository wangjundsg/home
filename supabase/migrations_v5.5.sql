-- V5.5 Migration: Notifications inbox

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_key TEXT NOT NULL UNIQUE,
  recipient TEXT NOT NULL,
  source_author TEXT NOT NULL DEFAULT '',
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  route TEXT NOT NULL DEFAULT '/',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_created_at
ON notifications(recipient, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient_read_at
ON notifications(recipient, read_at);

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;
