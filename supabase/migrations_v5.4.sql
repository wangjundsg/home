-- V5.4 Migration: Shared couple emotion state

CREATE TABLE IF NOT EXISTS couple_emotion_state (
  id TEXT PRIMARY KEY DEFAULT 'shared',
  state_id TEXT NOT NULL DEFAULT 'calm',
  updated_by TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT couple_emotion_state_singleton CHECK (id = 'shared')
);

INSERT INTO couple_emotion_state (id, state_id, updated_by)
VALUES ('shared', 'calm', 'system')
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE couple_emotion_state;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;
