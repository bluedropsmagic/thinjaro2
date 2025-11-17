/*
  # Create YouTube Channels Table

  1. New Tables
    - `youtube_channels`
      - `id` (uuid, primary key)
      - `channel_id` (text, unique) - YouTube channel ID
      - `channel_title` (text) - Channel name
      - `channel_author` (text) - Channel author
      - `channel_avatar` (text) - Avatar URL
      - `order_position` (integer) - Display order
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `youtube_channels` table
    - Add policy for public read access (channels are public)
    - Add policy for authenticated users to manage channels
*/

CREATE TABLE IF NOT EXISTS youtube_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id text UNIQUE NOT NULL,
  channel_title text NOT NULL DEFAULT '',
  channel_author text NOT NULL DEFAULT '',
  channel_avatar text NOT NULL DEFAULT '',
  order_position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE youtube_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view channels"
  ON youtube_channels
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert channels"
  ON youtube_channels
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update channels"
  ON youtube_channels
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete channels"
  ON youtube_channels
  FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS youtube_channels_order_idx ON youtube_channels(order_position);

INSERT INTO youtube_channels (channel_id, channel_title, channel_author, order_position)
VALUES ('UCZUUZFex6AaIU4QTopFudYA', 'Thin Jaro', 'Thin Jaro', 1)
ON CONFLICT (channel_id) DO NOTHING;