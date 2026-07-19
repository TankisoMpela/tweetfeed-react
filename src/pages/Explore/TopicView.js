import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HomeBox from "../../components/HomeBox/HomeBox";
import Post from "../../components/Feed/Post/Post";
import BottomSidebar from "../../components/BottomSidebar/BottomSidebar";
import SearchInput from "../../components/Widgets/SearchInput/SearchInput";
import Links from "../../components/Widgets/Links/Links";
import BackIcon from "@material-ui/icons/KeyboardBackspace";
import Loading from "../../components/Loading/Loading";
import { supabase } from "../../lib/supabase";

function TopicView() {
  const { hashtag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = `#${hashtag} / Tweetfeed`;
  }, [hashtag]);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hashtag]);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("posts")
      .select("*, likes(count), reposts(count)")
      .ilike("content", `%#${hashtag}%`)
      .or(`content.ilike.%${hashtag}%`)
      .order("created_at", { ascending: false });
    if (data && data.length > 0) {
      const userIds = [...new Set(data.map((p) => p.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, display_name, full_name, avatar_url, bio")
        .in("id", userIds);
      const pmap = {};
      profiles?.forEach((p) => { pmap[p.id] = p; });
      setPosts(
        data.map((p) => ({
          ...p,
          profiles: pmap[p.user_id],
          like_count: p.likes?.[0]?.count || 0,
          repost_count: p.reposts?.[0]?.count || 0,
        }))
      );
    } else {
      setPosts([]);
    }
    setLoading(false);
  };

  return (
    <HomeBox>
      <section className="feed">
        <div className="profileHeader">
          <div onClick={() => window.history.back()}>
            <BackIcon />
          </div>
          <div>
            <span>#{hashtag}</span>
            <span>{posts.length} Tweets</span>
          </div>
        </div>
        {loading ? <Loading /> : posts.length > 0 ? posts.map((post) => <Post key={post.id} post={post} />) : (
          <div style={{ padding: 40, textAlign: "center" }}>
            <h2 style={{ color: "white", fontSize: 19 }}>No Tweets with #{hashtag} yet</h2>
            <p style={{ color: "#8899a6", marginTop: 8 }}>Be the first to Tweet about this topic!</p>
          </div>
        )}
        <BottomSidebar />
      </section>
      <div className="widgets">
        <SearchInput placeholder="Search Tweetfeed" />
        <Links />
      </div>
    </HomeBox>
  );
}

export default TopicView;
