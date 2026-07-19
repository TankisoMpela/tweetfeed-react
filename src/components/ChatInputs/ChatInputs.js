import React from "react";
import { EmojiIcon, GifIcon, PhotoIcon, SendIcon } from "../icons";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import "./ChatInputs.css";

const ChatInputs = ({ conversationId, onMessageSent }) => {
  const { user } = useAuth();
  const [isFocus, setIsFocus] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const sendMessage = async () => {
    if (!message.trim() || !conversationId || !user) return;

    const newMsg = {
      sender_id: user.id,
      receiver_id: conversationId,
      content: message.trim(),
    };

    const { data, error } = await supabase
      .from("messages")
      .insert([newMsg])
      .select("*")
      .single();

    if (!error && data) {
      onMessageSent(data);
      setMessage("");
    }
  };

  return (
    <div className="chatInputs">
      <PhotoIcon />
      <GifIcon />
      <div
        className={isFocus ? "chatTextInput chatTextInputFocus" : "chatTextInput"}
      >
        <input
          type="text"
          placeholder="Start a new message"
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onKeyDown={(e) => {
            e.key === "Enter" && sendMessage();
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <EmojiIcon />
      </div>
      <div onClick={sendMessage}>
        <SendIcon />
      </div>
    </div>
  );
};

export default ChatInputs;
