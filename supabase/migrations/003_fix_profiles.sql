-- Drop and recreate the handle_new_user trigger properly
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INT := 0;
  avatar TEXT;
BEGIN
  avatar := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'avatar_url', ''),
    NULLIF(NEW.raw_user_meta_data->>'picture', ''),
    NULLIF(NEW.raw_user_meta_data->>'photo_url', ''),
    ''
  );

  base_username := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'preferred_username', ''),
    NULLIF(NEW.raw_user_meta_data->>'user_name', ''),
    SPLIT_PART(NEW.email, '@', 1),
    'user_' || SUBSTRING(NEW.id::text, 1, 8)
  );

  final_username := base_username;
  
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::text;
  END LOOP;

  INSERT INTO public.profiles (
    id, email, full_name, username, display_name, avatar_url
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    final_username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    avatar
  )
  ON CONFLICT (id) DO UPDATE SET
    avatar_url = COALESCE(NULLIF(EXCLUDED.avatar_url, ''), profiles.avatar_url),
    display_name = COALESCE(NULLIF(EXCLUDED.display_name, ''), profiles.display_name),
    username = COALESCE(NULLIF(EXCLUDED.username, ''), profiles.username);
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user failed: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Manually backfill profiles for existing users
INSERT INTO public.profiles (id, email, full_name, username, display_name, avatar_url, bio, website, location)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', SPLIT_PART(u.email, '@', 1)),
  COALESCE(NULLIF(u.raw_user_meta_data->>'preferred_username', ''), NULLIF(u.raw_user_meta_data->>'user_name', ''), SPLIT_PART(u.email, '@', 1)),
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', SPLIT_PART(u.email, '@', 1)),
  COALESCE(NULLIF(u.raw_user_meta_data->>'avatar_url', ''), u.raw_user_meta_data->>'picture', '', 'https://ui-avatars.com/api/?name=' || SPLIT_PART(u.email, '@', 1) || '&size=200&background=1da1f2&color=fff'),
  '',
  '',
  ''
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id);
