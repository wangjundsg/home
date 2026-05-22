-- V5.2 Migration: Track meeting wishlist completion time

ALTER TABLE wishes
ADD COLUMN IF NOT EXISTS fulfilled_at TIMESTAMPTZ;
