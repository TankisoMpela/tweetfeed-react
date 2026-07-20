-- Add 20 diverse posts with Pexels images, Giphy GIFs, and text-only posts
-- Mix of tech topics a hiring manager would find impressive
DO $$
DECLARE
  tankiso_id UUID;
  aisha_id UUID;
  tumi_id UUID;
BEGIN
  SELECT id INTO tankiso_id FROM auth.users WHERE email = 'tankiso@tweetfeed.io' LIMIT 1;
  SELECT id INTO aisha_id FROM auth.users WHERE email = 'aisha@tweetfeed.io' LIMIT 1;
  SELECT id INTO tumi_id FROM auth.users WHERE email = 'tumi@tweetfeed.io' LIMIT 1;

  -- Post 1: Tankiso - Image (code on monitor)
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (tankiso_id, 'Just merged a PR that reduced our API response time by 60%. The key? Database query optimization and edge caching with Supabase. Always profile before you optimize! 🚀 #Supabase #Performance', 'https://images.pexels.com/photos/6424583/pexels-photo-6424583.jpeg?auto=compress&cs=tinysrgb&h=350');

  -- Post 2: Aisha - GIF
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (aisha_id, 'That feeling when your CSS Grid layout finally works across all browsers on the first try... I don''t trust it 👀 #CSS #Frontend', 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif');

  -- Post 3: Tumi - Image (man coding)
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (tumi_id, 'Migrated our entire CI/CD pipeline to GitHub Actions this weekend. Faster builds, zero-downtime deploys, and the team can''t believe how smooth it is. Automate everything. #DevOps #GitHubActions', 'https://images.pexels.com/photos/340152/pexels-photo-340152.jpeg?auto=compress&cs=tinysrgb&h=350');

  -- Post 4: Tankiso - Text only
  INSERT INTO public.posts (user_id, content) VALUES
    (tankiso_id, 'Hot take: The best way to learn a new framework is to rebuild something you''ve already built. You understand the domain, so all cognitive load goes to the new tool. Built TweetFeed in React this way. #React #Learning');

  -- Post 5: Aisha - Image (women collaborating)
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (aisha_id, 'Accessibility audit complete! Added ARIA labels, keyboard navigation, and screen-reader-friendly markup to our entire component library. Your users will thank you. WCAG 2.1 AA compliant ✅ #a11y #React', 'https://images.pexels.com/photos/1181585/pexels-photo-1181585.jpeg?auto=compress&cs=tinysrgb&h=350');

  -- Post 6: Tumi - GIF
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (tumi_id, 'When the intern asks why we can''t just use "root" for everything in production... 😅 Time for a security talk! #DevOps #Security', 'https://media.giphy.com/media/14kqI3Y4urS3rG/giphy.gif');

  -- Post 7: Tankiso - Image (coding workspace)
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (tankiso_id, 'Built a real-time notification system for TweetFeed using Supabase Realtime + PostgreSQL triggers. Under 50ms latency. The future is serverless + real-time ⚡ #Supabase #Realtime', 'https://images.pexels.com/photos/169573/pexels-photo-169573.jpeg?auto=compress&cs=tinysrgb&h=350');

  -- Post 8: Aisha - Text only
  INSERT INTO public.posts (user_id, content) VALUES
    (aisha_id, 'Design tip: Stop using pure black (#000) on white backgrounds. It causes eye strain. Try #1a1a1a or your brand''s darkest grey instead. Small change, big UX impact. #UXDesign #CSS');

  -- Post 9: Tumi - Image (african tech worker)
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (tumi_id, 'Just gave a talk at the local dev meetup about container orchestration with Docker Compose vs Kubernetes. The room was packed! African tech community is growing fast 🌍 #DevOps #AfricaTech', 'https://images.pexels.com/photos/33176070/pexels-photo-33176070.jpeg?auto=compress&cs=tinysrgb&h=350');

  -- Post 10: Tankiso - GIF
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (tankiso_id, 'Me explaining to my non-tech friends what I actually do all day... "I make the buttons work" 😂 #DeveloperLife #React', 'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif');

  -- Post 11: Aisha - Image (smiling african man in office)
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (aisha_id, 'Our design system now has 87 components, all documented in Storybook with interactive examples. Design-to-dev handoff went from 2 weeks to 2 days. This is how you scale 🎨 #DesignSystems #React', 'https://images.pexels.com/photos/9301743/pexels-photo-9301743.jpeg?auto=compress&cs=tinysrgb&h=350');

  -- Post 12: Tumi - Text only
  INSERT INTO public.posts (user_id, content) VALUES
    (tumi_id, 'Unpopular opinion: YAML is fine. You''re just not using a linter. Fight me. #DevOps #Kubernetes');

  -- Post 13: Tankiso - Image (remote working)
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (tankiso_id, 'Friday night deploy? Not anymore. We set up feature flags with LaunchDarkly so we can ship any day, any time. Safe deployments = happy engineers = better product. #DevOps #FeatureFlags', 'https://images.pexels.com/photos/6744352/pexels-photo-6744352.jpeg?auto=compress&cs=tinysrgb&h=350');

  -- Post 14: Aisha - GIF
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (aisha_id, 'When the product manager says "it''s just a small UI change" and there are 47 edge cases hiding in the requirements... 🫠 #UXDesign #ProductDev', 'https://media.giphy.com/media/l2Sq2GZ1jQUmKkgd2/giphy.gif');

  -- Post 15: Tumi - Image (programming code close-up)
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (tumi_id, 'Spent the weekend setting up observability with Grafana + Prometheus + Loki. Now we can see exactly where latency spikes happen. Data-driven debugging > guessing. #DevOps #Observability', 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&h=350');

  -- Post 16: Tankiso - Text only
  INSERT INTO public.posts (user_id, content) VALUES
    (tankiso_id, 'TweetFeed hit 500 users today! What started as a learning project is now a real app with real users. Build in public, ship fast, iterate based on feedback. The compound effect is real 📈 #StartupAfrica #IndieDev');

  -- Post 17: Aisha - Image (laptop with coffee mug)
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (aisha_id, 'Dark mode isn''t just an aesthetic choice — it reduces battery drain on OLED screens by up to 30%. That''s why every component in our library ships with light and dark variants ⚫⚪ #CSS #Performance', 'https://images.pexels.com/photos/34803973/pexels-photo-34803973.jpeg?auto=compress&cs=tinysrgb&h=350');

  -- Post 18: Tumi - GIF
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (tumi_id, 'That moment when you SSH into the wrong server and almost run "rm -rf" in /etc... my heart stopped for a solid 3 seconds 💀 #DevOps #SysAdmin', 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExam9wZnJvb2VzMzBnYzI2cDRqbDlkaGk3a2xqY3l2dnFhZDhpbjg4NyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/13HgwGsXF0aiGY/giphy.gif');

  -- Post 19: Tankiso - Image (code reflection)
  INSERT INTO public.posts (user_id, content, image_url) VALUES
    (tankiso_id, 'One thing I wish I knew earlier: you don''t need a CS degree to be a great developer. Curiosity, consistency, and shipping projects beats credentials every time. Keep building! 💪 #WebDev #SelfTaught', 'https://images.pexels.com/photos/574069/pexels-photo-574069.jpeg?auto=compress&cs=tinysrgb&h=350');

  -- Post 20: Aisha - Text only
  INSERT INTO public.posts (user_id, content) VALUES
    (aisha_id, 'The most underrated skill in tech? Writing good documentation. Your code will be read 10x more than it''s written. Make it clear, add examples, explain the "why". Future you will thank present you 📝 #BestPractices #React');

END $$;
