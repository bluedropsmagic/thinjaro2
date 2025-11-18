/*
  # Add cleanup on user signup

  1. Changes
    - Add function to clean up old data when user signs up
    - Ensure fresh start for each new user
    
  2. Security
    - Function runs with security definer privileges
*/

-- Function to clean up user data (in case of re-signup or cleanup)
CREATE OR REPLACE FUNCTION cleanup_user_data()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete any existing protocols for this user
  DELETE FROM user_protocols WHERE user_id = NEW.id;
  
  -- Delete any existing objectives for this user  
  DELETE FROM user_objectives WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Trigger to clean up data when user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_user_data();