-- Bypass RLS with security definer function to seed data
CREATE OR REPLACE FUNCTION seed_content()
RETURNS void AS $$
DECLARE
  tankiso_id UUID;
  aisha_id UUID;
  tumi_id UUID;
BEGIN
  SELECT id INTO tankiso_id FROM auth.users WHERE email = 'tankiso@tweetfeed.io' LIMIT 1;
  SELECT id INTO aisha_id FROM auth.users WHERE email = 'aisha@tweetfeed.io' LIMIT 1;
  SELECT id INTO tumi_id FROM auth.users WHERE email = 'tumi@tweetfeed.io' LIMIT 1;

  -- Update covers
  UPDATE public.profiles SET cover_url = 'https://images.pexels.com/photos/1181461/pexels-photo-1181461.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop' WHERE id = tankiso_id;
  UPDATE public.profiles SET cover_url = 'https://images.pexels.com/photos/4621573/pexels-photo-4621573.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop' WHERE id = aisha_id;
  UPDATE public.profiles SET cover_url = 'https://images.pexels.com/photos/17489157/pexels-photo-17489157.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop' WHERE id = tumi_id;

  -- Add images to posts (update first 4 posts with images)
  UPDATE public.posts SET image_url = 'https://images.pexels.com/photos/27141307/pexels-photo-27141307.jpeg?auto=compress&cs=tinysrgb&h=350'
    WHERE id IN (SELECT id FROM public.posts ORDER BY created_at ASC LIMIT 1 OFFSET 0);
  UPDATE public.posts SET image_url = 'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&h=350'
    WHERE id IN (SELECT id FROM public.posts ORDER BY created_at ASC LIMIT 1 OFFSET 1);
  UPDATE public.posts SET image_url = 'https://images.pexels.com/photos/37730212/pexels-photo-37730212.jpeg?auto=compress&cs=tinysrgb&h=350'
    WHERE id IN (SELECT id FROM public.posts ORDER BY created_at ASC LIMIT 1 OFFSET 5);
  UPDATE public.posts SET image_url = 'https://images.pexels.com/photos/27141314/pexels-photo-27141314.jpeg?auto=compress&cs=tinysrgb&h=350'
    WHERE id IN (SELECT id FROM public.posts ORDER BY created_at ASC LIMIT 1 OFFSET 7);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

SELECT seed_content();
DROP FUNCTION seed_content();
