-- Add 10 more posts with images, GIFs, and proper hashtag tags
DO $$
DECLARE
  tankiso_id UUID;
  aisha_id UUID;
  tumi_id UUID;
BEGIN
  SELECT id INTO tankiso_id FROM auth.users WHERE email = 'tankiso@tweetfeed.io' LIMIT 1;
  SELECT id INTO aisha_id FROM auth.users WHERE email = 'aisha@tweetfeed.io' LIMIT 1;
  SELECT id INTO tumi_id FROM auth.users WHERE email = 'tumi@tweetfeed.io' LIMIT 1;

  -- Post 1: Tankiso with image
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (tankiso_id, 'Just shipped Tweetfeed v2 to production! The new reply threading is buttery smooth 🚀 #React #Supabase #StartupAfrica', 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&h=350');

  -- Post 2: Aisha with GIF
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (aisha_id, 'When the dark mode palette finally clicks... chef''s kiss 👩‍💻 #CSS #TypeScript', 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif');

  -- Post 3: Tumi with image
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (tumi_id, 'Just cut our cloud bill by 40% by right-sizing instances. The finance team threw me a party 😅 #DevOps #Supabase', 'https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&h=350');

  -- Post 4: Tankiso with GIF
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (tankiso_id, 'Me watching the CI pipeline after pushing to main at 4:59pm on a Friday... #DevOps #JavaScript', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnN3NjQ4M2w2eWV3YTh1aXJ5amQ0cTM1ejl3NTRpcXIyMmk4Z3oyYiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/13HgwGsXF0aiGY/giphy.gif');

  -- Post 5: Aisha with image
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (aisha_id, 'New component library just dropped! 47 accessible components, 0 external dependencies. Built for speed ⚡ #React #TypeScript #CSS', 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&h=350');

  -- Post 6: Tankiso with GIF
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (tankiso_id, 'African tech is having its moment. From Lagos to Nairobi to Cape Town — the talent is undeniable. Let''s build! 🌍 #StartupAfrica #AI', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHZpZnV5ZHo2eTNzYmpiYnpnanA2MjlqbTg4c3QydzZmZjVoemVybyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohjV1HxY8HfxwAJkQ/giphy.gif');

  -- Post 7: Tumi with GIF
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (tumi_id, 'That moment when you realize the ''temporary'' cron job has been running in production for 18 months... 😬 #DevOps #Supabase', 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif');

  -- Post 8: Tankiso with image
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (tankiso_id, 'Three months ago I quit my job to build full-time. Scary? Yes. Worth it? Every single day. Ship fast, learn faster. #StartupAfrica #React', 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&h=350');

  -- Post 9: Aisha with GIF
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (aisha_id, 'Accessibility is not a feature. It''s the foundation. Every component I design starts with keyboard navigation and screen reader support. #CSS #React', 'https://media.giphy.com/media/3o7aCTfyhYawdOXcFW/giphy.gif');

  -- Post 10: Tumi with image
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (tumi_id, 'Infrastructure as Code is great until you accidentally Terraform destroy the production database. Ask me how I know 🤡 #DevOps #TypeScript', 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&h=350');

END $$;
