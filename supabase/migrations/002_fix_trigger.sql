-- Fix the handle_new_user trigger to handle all edge cases
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INT := 0;
BEGIN
  -- Generate a safe username
  base_username := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'preferred_username', ''),
    NULLIF(NEW.raw_user_meta_data->>'user_name', ''),
    SPLIT_PART(NEW.email, '@', 1)
  );
  
  -- Ensure username is not null
  IF base_username IS NULL OR base_username = '' THEN
    base_username := 'user_' || SUBSTRING(NEW.id::text, 1, 8);
  END IF;
  
  final_username := base_username;
  
  -- Handle unique constraint by appending counter
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::text;
  END LOOP;

  INSERT INTO public.profiles (
    id, email, full_name, username, display_name, avatar_url,
    bio, cover_url, website, location
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    final_username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(
      NULLIF(NEW.raw_user_meta_data->>'avatar_url', ''),
      NEW.raw_user_meta_data->>'picture',
      NEW.raw_user_meta_data->>'photo_url',
      ''
    ),
    '', '', '', ''
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'handle_new_user error: %', SQLERRM;
  RETURN NEW;
END;
$$ language 'plpgsql';
