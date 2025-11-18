/*
  # Create User Protocols and Objectives Tables

  1. New Tables
    - `user_protocols`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `protocol_data` (jsonb) - stores the complete protocol data
      - `quiz_answers` (jsonb) - stores the user's quiz responses
      - `created_at` (timestamptz) - when protocol was generated
      - `last_regenerated_at` (timestamptz) - when protocol was last regenerated
      - `expires_at` (timestamptz) - when protocol can be regenerated (30 days after creation)
      - `overall_completion` (integer, default 0)
      - `day_streak` (integer, default 0)
      - `current_day` (integer, default 1)
    
    - `user_objectives`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `protocol_id` (uuid, references user_protocols)
      - `day_number` (integer)
      - `objective_type` (text) - hydration, exercise, nutrition, sleep, mindfulness
      - `title` (text)
      - `description` (text)
      - `completed` (boolean, default false)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    
  3. Indexes
    - Index on user_id for fast lookups
    - Index on protocol_id and day_number for objectives
*/

-- Create user_protocols table
CREATE TABLE IF NOT EXISTS user_protocols (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  protocol_data jsonb NOT NULL DEFAULT '{}',
  quiz_answers jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now() NOT NULL,
  last_regenerated_at timestamptz DEFAULT now() NOT NULL,
  expires_at timestamptz DEFAULT (now() + interval '30 days') NOT NULL,
  overall_completion integer DEFAULT 0 NOT NULL,
  day_streak integer DEFAULT 0 NOT NULL,
  current_day integer DEFAULT 1 NOT NULL,
  UNIQUE(user_id)
);

-- Create user_objectives table
CREATE TABLE IF NOT EXISTS user_objectives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  protocol_id uuid REFERENCES user_protocols(id) ON DELETE CASCADE NOT NULL,
  day_number integer NOT NULL,
  objective_type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  completed boolean DEFAULT false NOT NULL,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_objective_type CHECK (objective_type IN ('hydration', 'exercise', 'nutrition', 'sleep', 'mindfulness')),
  CONSTRAINT valid_day_number CHECK (day_number >= 1 AND day_number <= 30)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_protocols_user_id ON user_protocols(user_id);
CREATE INDEX IF NOT EXISTS idx_user_objectives_user_id ON user_objectives(user_id);
CREATE INDEX IF NOT EXISTS idx_user_objectives_protocol_id ON user_objectives(protocol_id);
CREATE INDEX IF NOT EXISTS idx_user_objectives_day_number ON user_objectives(protocol_id, day_number);

-- Enable RLS
ALTER TABLE user_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_objectives ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_protocols
CREATE POLICY "Users can view their own protocol"
  ON user_protocols FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own protocol"
  ON user_protocols FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own protocol"
  ON user_protocols FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own protocol"
  ON user_protocols FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_objectives
CREATE POLICY "Users can view their own objectives"
  ON user_objectives FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own objectives"
  ON user_objectives FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own objectives"
  ON user_objectives FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own objectives"
  ON user_objectives FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);