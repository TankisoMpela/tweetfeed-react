import React, { useState } from "react";
import "./TweetBox.css";
import { Avatar } from "@material-ui/core";
import PhotoIcon from "../../icons/PhotoIcon";
import GifIcon from "../../icons/GifIcon";
import SurveyIcon from "../../icons/SurveyIcon";
import EmojiIcon from "../../icons/EmojiIcon";
import PlanIcon from "../../icons/PlanIcon";
import { useAuth } from "../../../contexts/AuthContext";
import { supabase } from "../../../lib/supabase";

function TweetBox({ onTweetPosted }) {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [submitting, setSubmitting] = useState(false);
  const { user, getUserAvatar } = useAuth();

  const tweetSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);

    let content = text.trim();
    if (showPoll && pollOptions[0].trim()) {
      content += "\n\n📊 Poll: " + pollOptions.filter(o => o.trim()).join(" vs ");
    }

    const newPost = {
      user_id: user.id,
      content,
      image_url: imageUrl.trim() || null,
    };

    const { data, error } = await supabase
      .from("posts")
      .insert([newPost])
      .select("*")
      .single();

    setSubmitting(false);
    if (error) {
      console.error("Error posting tweet:", error);
      return;
    }

    setText("");
    setImageUrl("");
    setShowImageInput(false);
    setShowPoll(false);
    setPollOptions(["", ""]);
    if (onTweetPosted && data) {
      onTweetPosted(data);
    }
  };

  return (
    <>
      <form className="tweetbox" onSubmit={tweetSubmit}>
        <div className="tweetboxRow">
          <div className="tweetboxUserIcon">
            <Avatar src={getUserAvatar()} />
          </div>
          <div className="tweetbox-input-row">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="tweetbox-input"
              placeholder="What is happening?!"
              type="text"
              disabled={submitting}
            />
          </div>
        </div>
        {showImageInput && (
          <div style={{ padding: "0 15px 8px 65px" }}>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL (Pexels, Imgur, etc.)"
              style={{ width: "100%", background: "#253341", border: "1px solid #38444d", borderRadius: 8, padding: "8px 12px", color: "white", fontSize: 14 }}
            />
            <button type="button" onClick={() => setShowImageInput(false)} style={{ background: "none", border: "none", color: "#1da1f2", fontSize: 12, cursor: "pointer", marginTop: 4 }}>Remove</button>
          </div>
        )}
        {showPoll && (
          <div style={{ padding: "0 15px 8px 65px" }}>
            {pollOptions.map((opt, i) => (
              <input
                key={i}
                value={opt}
                onChange={(e) => {
                  const opts = [...pollOptions];
                  opts[i] = e.target.value;
                  if (i === pollOptions.length - 1 && opt.trim()) opts.push("");
                  setPollOptions(opts);
                }}
                placeholder={`Option ${i + 1}`}
                style={{ width: "100%", background: "#253341", border: "1px solid #38444d", borderRadius: 8, padding: "8px 12px", color: "white", fontSize: 14, marginBottom: 4 }}
              />
            ))}
            <button type="button" onClick={() => setShowPoll(false)} style={{ background: "none", border: "none", color: "#1da1f2", fontSize: 12, cursor: "pointer" }}>Remove poll</button>
          </div>
        )}
        <div className="tweetboxRow">
          <div style={{ flex: 0.1 }}></div>
          <div className="tweetboxOptions">
            <div onClick={() => setShowImageInput(!showImageInput)} style={{ cursor: "pointer" }}>
              <PhotoIcon className="tweetboxOptionIcon" width={22} height={22} />
            </div>
            <div onClick={() => setShowImageInput(!showImageInput)} style={{ cursor: "pointer" }}>
              <GifIcon className="tweetboxOptionIcon" width={22} height={22} />
            </div>
            <div onClick={() => setShowPoll(!showPoll)} style={{ cursor: "pointer" }}>
              <SurveyIcon className="tweetboxOptionIcon" width={22} height={22} />
            </div>
            <EmojiIcon className="tweetboxOptionIcon" width={22} height={22} />
            <PlanIcon className="tweetboxOptionIcon" width={22} height={22} />
            <button type="submit" className="tweetbox-button" disabled={submitting || !text.trim()}>
              {submitting ? "Posting..." : "Tweet"}
            </button>
          </div>
        </div>
      </form>
      <div className="bottomBorder"></div>
    </>
  );
}

export default TweetBox;
