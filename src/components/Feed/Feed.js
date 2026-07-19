import React, { useEffect, useState } from "react";
import "./Feed.css";
import TweetBox from "./TweetBox/TweetBox";
import Post from "./Post/Post";
import HomeStars from "../icons/HomeStars";
import BottomSidebar from "../BottomSidebar/BottomSidebar";
import { Avatar } from "@material-ui/core";
import DrawerBar from "../DrawerBar/DrawerBar";
import Loading from "../Loading/Loading";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

function Feed() {
  const { user, profile, getUserAvatar } = useAuth();
  const [isDrawerBar, setIsDrawerBar] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const { data: postsData, error } = await supabase
      .from("posts")
      .select(`
        *,
        likes(count),
        reposts(count)
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
      return;
    }

    if (postsData && postsData.length > 0) {
      const userIds = [...new Set(postsData.map((p) => p.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, username, display_name, full_name, avatar_url, bio")
        .in("id", userIds);

      const profileMap = {};
      if (profilesData) {
        profilesData.forEach((p) => {
          profileMap[p.id] = p;
        });
      }

      const mappedPosts = postsData.map((post) => ({
        ...post,
        profiles: profileMap[post.user_id] || null,
      }));

      const enrichedPosts = await enrichPostsWithUserData(mappedPosts);
      setPosts(enrichedPosts);
    }
    setLoading(false);
  };

  const enrichPostsWithUserData = async (postsData) => {
    if (!user) return postsData;

    const postIds = postsData.map((p) => p.id);

    const { data: myLikes } = await supabase
      .from("likes")
      .select("post_id")
      .eq("user_id", user.id)
      .in("post_id", postIds);

    const { data: myReposts } = await supabase
      .from("reposts")
      .select("post_id")
      .eq("user_id", user.id)
      .in("post_id", postIds);

    const likedPostIds = new Set(myLikes?.map((l) => l.post_id) || []);
    const repostedPostIds = new Set(myReposts?.map((r) => r.post_id) || []);

    return postsData.map((post) => ({
      ...post,
      like_count: post.likes?.[0]?.count || 0,
      repost_count: post.reposts?.[0]?.count || 0,
      liked_by_me: likedPostIds.has(post.id),
      reposted_by_me: repostedPostIds.has(post.id),
    }));
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("feed-posts")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, (payload) => {
        const newPost = payload.new;
        supabase.from("profiles").select("id, username, display_name, full_name, avatar_url, bio").eq("id", newPost.user_id).single().then(({ data: p }) => {
          setPosts((prev) => [{ ...newPost, profiles: p, like_count: 0, repost_count: 0, liked_by_me: false, reposted_by_me: false }, ...prev]);
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleTweetPosted = (newPost) => {
    enrichPostsWithUserData([{ ...newPost, profiles: null, likes: [], reposts: [] }])
      .then((enriched) => {
        const enrichedPost = enriched[0];
        if (enrichedPost && profile) {
          enrichedPost.profiles = profile;
        }
        setPosts((prev) => [enrichedPost, ...prev]);
      });
  };

  return (
    <section className="feed">
      {isDrawerBar && (
        <div onClick={() => setIsDrawerBar(false)} className="drawerBarPanel" />
      )}
      <DrawerBar active={isDrawerBar} />
      <div className="feed-header">
        <div onClick={() => setIsDrawerBar(true)}>
          <Avatar src={getUserAvatar()} />
        </div>
        <div className="feed-headerText">
          <span>Home</span>
        </div>
        <div className="homeStarsCol">
          <HomeStars className="homeStars" width={22} height={22} />
        </div>
      </div>
      <TweetBox onTweetPosted={handleTweetPosted} />
      {loading ? (
        <Loading />
      ) : (
        <article>
          {posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </article>
      )}
      <BottomSidebar />
    </section>
  );
}

export default Feed;
