import React, { useState, useEffect } from "react";
import HomeBox from "../../components/HomeBox/HomeBox";
import Post from "../../components/Feed/Post/Post";
import SearchInput from "../../components/Widgets/SearchInput/SearchInput";
import FriendSuggestions from "../../components/Widgets/FriendSuggestions/FriendSuggestions";
import Topics from "../../components/Widgets/Topics/Topics";
import Links from "../../components/Widgets/Links/Links";
import BottomSidebar from "../../components/BottomSidebar/BottomSidebar";
import Loading from "../../components/Loading/Loading";
import BackIcon from "@material-ui/icons/KeyboardBackspace";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { useHistory } from "react-router-dom";
import "./Bookmarks.css";

const Bookmarks = () => {
  const { user } = useAuth();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);

  useEffect(() => {
    fetchBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchBookmarks = async () => {
    if (!user) return;
    setLoading(true);

    const { data: bookmarkData, error } = await supabase
      .from("bookmarks")
      .select(`
        post_id,
        posts!inner(
          *,
          likes(count),
          reposts(count)
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && bookmarkData) {
      const postsData = bookmarkData.map((b) => b.posts);
      const userIds = [...new Set(postsData.map((p) => p.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, username, display_name, full_name, avatar_url, bio")
        .in("id", userIds);

      const profileMap = {};
      if (profilesData) {
        profilesData.forEach((p) => { profileMap[p.id] = p; });
      }

      const postIds = postsData.map((p) => p.id);
      const { data: myLikes } = await supabase
        .from("likes")
        .select("post_id")
        .eq("user_id", user.id)
        .in("post_id", postIds);

      const likedPostIds = new Set(myLikes?.map((l) => l.post_id) || []);

      const mappedPosts = postsData.map((post) => ({
        ...post,
        profiles: profileMap[post.user_id],
        like_count: post.likes?.[0]?.count || 0,
        repost_count: post.reposts?.[0]?.count || 0,
        liked_by_me: likedPostIds.has(post.id),
      }));

      setBookmarkedPosts(mappedPosts);
    }
    setLoading(false);
  };

  return (
    <HomeBox>
      <section className="feed">
        <div className="bookmarksHeader">
          <div onClick={() => history.goBack()}>
            <BackIcon />
          </div>
          <div>
            <span>Bookmarks</span>
            <span>@{user?.email?.split("@")[0]}</span>
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : bookmarkedPosts.length > 0 ? (
          bookmarkedPosts.map((post) => <Post key={post.id} post={post} />)
        ) : (
          <div className="emptyState">
            <h2>Save Tweets for later</h2>
            <p>Bookmark posts to easily find them again in the future.</p>
          </div>
        )}
        <BottomSidebar />
      </section>
      <div className="widgets">
        <SearchInput placeholder="Search Tweetfeed" />
        <FriendSuggestions />
        <Topics />
        <Links />
      </div>
    </HomeBox>
  );
};

export default Bookmarks;
