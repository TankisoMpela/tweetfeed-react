import React, { useEffect, useState } from "react";
import "./Profile.css";
import BottomSidebar from "../../components/BottomSidebar/BottomSidebar";
import FriendSuggestions from "../../components/Widgets/FriendSuggestions/FriendSuggestions";
import Topics from "../../components/Widgets/Topics/Topics";
import SearchInput from "../../components/Widgets/SearchInput/SearchInput";
import Post from "../../components/Feed/Post/Post";
import BackIcon from "@material-ui/icons/KeyboardBackspace";
import ScheduleIcon from "@material-ui/icons/CalendarToday";
import { Avatar, TextField } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import Links from "../../components/Widgets/Links/Links";
import HomeBox from "../../components/HomeBox/HomeBox";
import Loading from "../../components/Loading/Loading";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

const Profile = () => {
  const { user: authUser, profile: authProfile, fetchProfile } = useAuth();
  const params = useParams();
  const idFromUrl = params?.id;
  let history = useHistory();

  const viewingId = idFromUrl || authUser?.id;
  const isOwn = !idFromUrl || idFromUrl === authUser?.id;

  const [viewProfile, setViewProfile] = useState(null);
  const [category, setCategory] = useState(1);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [following, setFollowing] = useState(false);
  const [editData, setEditData] = useState({ display_name: "", username: "", bio: "", website: "", location: "", cover_url: "" });

  const displayName = viewProfile?.display_name || viewProfile?.full_name || "User";
  const handle = viewProfile?.username || "user";
  const avatar = viewProfile?.avatar_url;

  useEffect(() => {
    if (!viewingId) return;
    if (isOwn && authProfile) {
      setViewProfile(authProfile);
    } else {
      supabase.from("profiles").select("*").eq("id", viewingId).single().then(({ data }) => setViewProfile(data));
    }
  }, [viewingId, authProfile, isOwn]);

  useEffect(() => {
    if (!viewingId || !viewProfile) return;
    document.title = `${viewProfile?.display_name || viewProfile?.full_name || "User"} (@${viewProfile?.username || "user"}) / Tweetfeed`;
    const fetchProfilePosts = async () => {
      setLoading(true);
      if (category === 4) {
        const { data: liked } = await supabase.from("likes").select("post_id").eq("user_id", viewingId).order("created_at", { ascending: false });
        if (liked && liked.length > 0) {
          const postIds = liked.map((l) => l.post_id);
          const { data: postsData } = await supabase.from("posts").select("*, likes(count), reposts(count)").in("id", postIds).order("created_at", { ascending: false });
          if (postsData) {
            const userIds = [...new Set(postsData.map((p) => p.user_id))];
            const { data: profilesData } = await supabase.from("profiles").select("id, username, display_name, full_name, avatar_url").in("id", userIds);
            const pmap = {};
            profilesData?.forEach((p) => { pmap[p.id] = p; });
            setPosts(postsData.map((p) => ({ ...p, profiles: pmap[p.user_id], like_count: p.likes?.[0]?.count || 0, repost_count: p.reposts?.[0]?.count || 0, liked_by_me: true })));
          }
        } else setPosts([]);
      } else {
        let query = supabase.from("posts").select("*, likes(count), reposts(count)").eq("user_id", viewingId).order("created_at", { ascending: false });
        if (category === 3) query = query.not("image_url", "is", null);
        const { data: postsData } = await query;
        if (postsData && postsData.length > 0) {
          const userIds = [...new Set(postsData.map((p) => p.user_id))];
          const { data: profilesData } = await supabase.from("profiles").select("id, username, display_name, full_name, avatar_url").in("id", userIds);
          const pmap = {};
          profilesData?.forEach((p) => { pmap[p.id] = p; });
          let mapped = postsData.map((p) => ({ ...p, profiles: pmap[p.user_id], like_count: p.likes?.[0]?.count || 0, repost_count: p.reposts?.[0]?.count || 0 }));
          if (authUser) {
            const postIds = mapped.map((p) => p.id);
            const { data: myLikes } = await supabase.from("likes").select("post_id").eq("user_id", authUser.id).in("post_id", postIds);
            const likedIds = new Set((myLikes || []).map((l) => l.post_id));
            mapped = mapped.map((p) => ({ ...p, liked_by_me: likedIds.has(p.id) }));
          }
          setPosts(mapped);
        } else setPosts([]);
      }
      setLoading(false);
    };
    fetchProfilePosts();
  }, [viewingId, viewProfile, category, authUser]);

  useEffect(() => {
    if (viewProfile && isOwn) {
      setEditData({ display_name: viewProfile.display_name || viewProfile.full_name || "", username: viewProfile.username || "", bio: viewProfile.bio || "", website: viewProfile.website || "", location: viewProfile.location || "", cover_url: viewProfile.cover_url || "" });
    }
  }, [viewProfile, isOwn]);

  useEffect(() => {
    if (!viewingId || isOwn) return;
    const checkFollow = async () => {
      const { data } = await supabase.from("follows").select("id").eq("follower_id", authUser?.id).eq("following_id", viewingId).maybeSingle();
      setFollowing(!!data);
    };
    checkFollow();
  }, [viewingId, authUser, isOwn]);

  const handleFollow = async () => {
    if (!authUser || isOwn) return;
    if (following) {
      setFollowing(false);
      await supabase.from("follows").delete().eq("follower_id", authUser.id).eq("following_id", viewingId);
    } else {
      setFollowing(true);
      await supabase.from("follows").insert([{ follower_id: authUser.id, following_id: viewingId }]);
    }
  };

  const handleSaveProfile = async () => {
    if (!authUser) return;
    const { error } = await supabase.from("profiles").update({ display_name: editData.display_name, username: editData.username, bio: editData.bio, website: editData.website, location: editData.location, cover_url: editData.cover_url || null }).eq("id", authUser.id);
    if (!error) {
      await fetchProfile(authUser.id);
      const { data } = await supabase.from("profiles").select("*").eq("id", authUser.id).single();
      setViewProfile(data);
    }
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    if (viewProfile) setEditData({ display_name: viewProfile.display_name || viewProfile.full_name || "", username: viewProfile.username || "", bio: viewProfile.bio || "", website: viewProfile.website || "", location: viewProfile.location || "", cover_url: viewProfile.cover_url || "" });
  };

  const joinedDate = viewProfile?.created_at ? new Date(viewProfile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";

  if (!viewProfile) return <HomeBox><section className="feed"><Loading /></section></HomeBox>;

  return (
    <HomeBox>
      <section className="feed">
        <div className="profileHeader">
          <div onClick={() => history.goBack()}>
            <BackIcon />
          </div>
          <div>
            <span>{displayName}</span>
            <span>{posts.length} Tweets</span>
          </div>
        </div>
        <div className="profile">
          {viewProfile?.cover_url ? (
            <div className="backgroundImage" style={{ backgroundImage: `url(${viewProfile.cover_url})`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
          ) : (
            <div className="backgroundImage" style={{ backgroundColor: "#3d5466" }}></div>
          )}
          <div className="profileTitle">
            <div className="profileImage">
              <Avatar src={avatar} style={{ width: 133, height: 133 }} />
            </div>
            {isOwn ? (
              <div className="editProfile" onClick={editing ? handleSaveProfile : () => setEditing(true)}>
                <span>{editing ? "Save" : "Edit Profile"}</span>
              </div>
            ) : (
              <div className="editProfile" onClick={handleFollow} style={{ backgroundColor: following ? "transparent" : "#1da1f2", color: following ? "#1da1f2" : "white" }}>
                <span>{following ? "Following" : "Follow"}</span>
              </div>
            )}
          </div>

          {editing && isOwn ? (
            <div className="profileEditForm">
              {[
                { label: "Display Name", key: "display_name" },
                { label: "Username", key: "username" },
                { label: "Bio", key: "bio" },
                { label: "Website", key: "website" },
                { label: "Cover Photo URL", key: "cover_url" },
                { label: "Location", key: "location" },
              ].map((f) => (
                <TextField key={f.key} label={f.label} value={editData[f.key]}
                  onChange={(e) => setEditData({ ...editData, [f.key]: e.target.value })}
                  fullWidth variant="outlined" size="small" multiline={f.key === "bio"} rows={f.key === "bio" ? 3 : 1}
                  InputProps={{ style: { color: "white" } }} InputLabelProps={{ style: { color: "#8899a6" } }}
                  style={{ marginBottom: 10, background: "#192734", borderRadius: 4 }}
                />
              ))}
              <div className="editProfileBtns">
                <button onClick={handleCancelEdit} className="cancelBtn">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="profileBiography">
                <span>{displayName}</span><span>@{handle}</span>
                {viewProfile?.bio && <span>{viewProfile.bio}</span>}
                {joinedDate && <span><ScheduleIcon />Joined {joinedDate}</span>}
                {viewProfile?.website && <span><a href={viewProfile.website.startsWith("http") ? viewProfile.website : `https://${viewProfile.website}`} target="_blank" rel="noreferrer" style={{ color: "#1b95e0" }}>{viewProfile.website}</a></span>}
                {viewProfile?.location && <span>{viewProfile.location}</span>}
              </div>
              <div><span><span>0</span><span>Following</span></span><span><span>0</span><span>Followers</span></span></div>
            </>
          )}
          <div className="profileCategory">
            {["Tweets", "Tweets & replies", "Media", "Likes"].map((tab, i) => (
              <div key={i} className={category === i + 1 ? "profileCategoryActive" : ""} onClick={() => setCategory(i + 1)}>
                <span>{tab}</span>
              </div>
            ))}
          </div>
        </div>
        <article className="profilePosts">
          {!loading ? (posts.length > 0 ? posts.map((post) => <Post key={post.id} post={post} />) : (
            <div className="noPosts"><span>No {["Tweets", "Tweets", "Media", "Liked Tweets"][category - 1]} yet</span><span>When you {category === 4 ? "like" : "post"} something, it will show up here.</span></div>
          )) : <Loading />}
        </article>
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

export default Profile;
