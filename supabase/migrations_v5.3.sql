-- V5.3 Migration: Push delivery dedupe logs

CREATE TABLE IF NOT EXISTS push_delivery_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_key TEXT NOT NULL UNIQUE,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_delivery_logs_author_created_at
ON push_delivery_logs(author, created_at DESC);
