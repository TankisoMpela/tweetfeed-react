-- Add GIF posts via security definer
DO $$
DECLARE
  tankiso_id UUID;
  aisha_id UUID;
  tumi_id UUID;
BEGIN
  SELECT id INTO tankiso_id FROM auth.users WHERE email = 'tankiso@tweetfeed.io' LIMIT 1;
  SELECT id INTO aisha_id FROM auth.users WHERE email = 'aisha@tweetfeed.io' LIMIT 1;
  SELECT id INTO tumi_id FROM auth.users WHERE email = 'tumi@tweetfeed.io' LIMIT 1;

  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (tankiso_id, 'When you finally fix that bug after 4 hours of debugging... 😂 #JavaScript', 'https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif'),
    (aisha_id, 'Me explaining my design choices to the dev team... 🎨 #UXDesign #React', 'https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif'),
    (tumi_id, 'When your CI/CD pipeline passes all tests on the first run... it''s suspicious 🤔 #DevOps', 'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif'),
    (tankiso_id, 'Me: I''ll just quickly refactor this one component. Also me 6 hours later: #React #TypeScript', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExam9wZnJvb2VzMzBnYzI2cDRqbDlkaGk3a2xqY3l2dnFhZDhpbjg4NyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/13HgwGsXF0aiGY/giphy.gif'),
    (aisha_id, 'Client: Can you make the logo bigger? Me: #UXDesign', 'https://media.giphy.com/media/l2Sq2GZ1jQUmKkgd2/giphy.gif'),
    (tumi_id, 'Production on a Friday afternoon... 🫣 #DevOps', 'https://media.giphy.com/media/14kqI3Y4urS3rG/giphy.gif');

  -- Also add a few more text posts  
  INSERT INTO public.posts (user_id, content) VALUES
    (tankiso_id, 'Building in public is the best way to grow as a developer. Share your journey, even the messy parts. #StartupAfrica'),
    (aisha_id, 'Design systems are not just component libraries. They''re a shared language between design and engineering. #React #CSS'),
    (tumi_id, 'Pro tip: alias kubectl to k. Your fingers will thank you. #DevOps #Kubernetes'),
    (tankiso_id, 'The difference between a junior and senior dev? Knowing which problems are worth solving. #TypeScript #AI'),
    (aisha_id, 'My design toolkit: Figma, a whiteboard, and way too much coffee ☕ #UXDesign'),
    (tumi_id, 'If your infrastructure isn''t in code, does it really exist? Terraform all the things. #DevOps');
END $$;
