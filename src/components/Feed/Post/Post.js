import React from "react";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./Post.css";
import FavoriteIcon from "../../icons/FavoriteIcon";
import CommentIcon from "../../icons/CommentIcon";
import RetweetIcon from "../../icons/RetweetIcon";
import BookmarkIcon from "../../icons/BookmarkIcon";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { MillToDate } from "../../../utils/MillToDate";
import ProfileCard from "../../ProfileCard/ProfileCard";
import { useAuth } from "../../../contexts/AuthContext";
import { supabase } from "../../../lib/supabase";

function Post({ post, onLikeToggle }) {
  const { user } = useAuth();
  const [isVisibleProfileCard, setIsVisibleProfileCard] = React.useState(false);
  const [liked, setLiked] = React.useState(post.liked_by_me || false);
  const [reposted, setReposted] = React.useState(post.reposted_by_me || false);
  const [bookmarked, setBookmarked] = React.useState(false);
  const [likeCount, setLikeCount] = React.useState(post.like_count || 0);
  const [repostCount, setRepostCount] = React.useState(post.repost_count || 0);
  const [showComment, setShowComment] = React.useState(false);
  const [commentText, setCommentText] = React.useState("");
  const [comments, setComments] = React.useState([]);

  const profile = post.profiles;
  const displayName = profile?.display_name || profile?.full_name || "User";
  const username = profile?.username || "user";
  const avatar = profile?.avatar_url;
  const date = post.created_at ? new Date(post.created_at).getTime() : Date.now();

  const handleLike = async () => {
    if (!user) return;
    if (liked) {
      setLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
      await supabase.from("likes").delete().eq("user_id", user.id).eq("post_id", post.id);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
      await supabase.from("likes").insert([{ user_id: user.id, post_id: post.id }]);
    }
    if (onLikeToggle) onLikeToggle(post.id, !liked);
  };

  const handleRepost = async () => {
    if (!user) return;
    if (reposted) {
      setReposted(false);
      setRepostCount((c) => Math.max(0, c - 1));
      await supabase.from("reposts").delete().eq("user_id", user.id).eq("post_id", post.id);
    } else {
      setReposted(true);
      setRepostCount((c) => c + 1);
      await supabase.from("reposts").insert([{ user_id: user.id, post_id: post.id }]);
    }
  };

  const handleBookmark = async () => {
    if (!user) return;
    try {
      if (bookmarked) {
        setBookmarked(false);
        await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("post_id", post.id);
      } else {
        setBookmarked(true);
        const { error } = await supabase.from("bookmarks").upsert([{ user_id: user.id, post_id: post.id }], { onConflict: "user_id,post_id" });
        if (error) {
          setBookmarked(false);
        }
      }
    } catch (e) {
      setBookmarked(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    const reply = {
      user_id: user.id,
      content: commentText.trim(),
      reply_to: post.id,
    };
    const { data, error } = await supabase.from("posts").insert([reply]).select("*, profiles(id, username, display_name, full_name, avatar_url)").single();
    if (!error && data) {
      setComments([...comments, data]);
      setCommentText("");
    }
  };

  return (
    <div className="post" onMouseLeave={() => setIsVisibleProfileCard(false)}>
      {profile && <ProfileCard profile={profile} active={isVisibleProfileCard && true} />}
      <div>
        <Link to={`/profile/${post.user_id}`}>
          <Avatar src={avatar} />
        </Link>
      </div>
      <div className="post-content-col">
        <div className="post-header">
          <Link to={`/profile/${post.user_id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <span
              className="post-header-displayname"
              onMouseEnter={() => setIsVisibleProfileCard(true)}
              onMouseLeave={() => { setTimeout(() => setIsVisibleProfileCard(false), 1000); }}
            >
              {displayName}
            </span>
          </Link>
          <span className="post-header-username">{"@" + username}</span>
          <span className="post-header-date">{MillToDate(date)}</span>
          <MoreHorizIcon className="postMoreIcon" />
        </div>
        <div className="post-content">{post.content}</div>
        {post.image_url && (
          <div className="post-image">
            <img src={post.image_url} alt="post" />
          </div>
        )}
        <div className="post-event">
          <div onClick={() => setShowComment(!showComment)} style={{ cursor: "pointer" }}>
            <CommentIcon className="postIcon" />
            <span>{comments.length || post.reply_count || 0}</span>
          </div>
          <div onClick={handleLike} style={{ cursor: "pointer", ...(liked ? { color: "#e0245e" } : {}) }}>
            <FavoriteIcon className="postIcon" active={liked} />
            <span>{likeCount > 0 ? likeCount : ""}</span>
          </div>
          <div onClick={handleRepost} style={{ cursor: "pointer", ...(reposted ? { color: "#17bf63" } : {}) }}>
            <RetweetIcon className="postIcon" active={reposted} />
            <span>{repostCount > 0 ? repostCount : ""}</span>
          </div>
          <div onClick={handleBookmark} style={{ cursor: "pointer", ...(bookmarked ? { color: "#1da1f2" } : {}) }}>
            <BookmarkIcon className="postIcon" active={bookmarked} />
          </div>
        </div>
        {showComment && (
          <div style={{ borderTop: "0.5px solid #38444d", paddingTop: 10, marginTop: 5 }}>
            <form onSubmit={handleCommentSubmit} style={{ display: "flex", gap: 8 }}>
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a reply..."
                style={{ flex: 1, background: "#253341", border: "none", borderRadius: 8, padding: "8px 12px", color: "white", fontSize: 14 }}
              />
              <button type="submit" disabled={!commentText.trim()} style={{ background: commentText.trim() ? "#1da1f2" : "#1da1f280", border: "none", borderRadius: 9999, padding: "6px 16px", color: "white", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Reply</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
