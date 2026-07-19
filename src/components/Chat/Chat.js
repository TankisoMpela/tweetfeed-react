import { Avatar } from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import ChatInputs from "../ChatInputs/ChatInputs";
import FromMessage from "../FromMessage/FromMessage";
import { InfoIcon, CalenderIcon } from "../icons";
import BackIcon from "@material-ui/icons/KeyboardBackspace";
import MyMessage from "../MyMessage/MyMessage";
import "./Chat.css";
import Loading from "../Loading/Loading";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";

const Chat = ({ conversationId }) => {
  const { user } = useAuth();
  const history = useHistory();
  const [chatUser, setChatUser] = React.useState(null);
  const [messagesData, setMessagesData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversationId && user) {
      fetchMessages();
      fetchChatUser();
      const cleanup = setupRealtime();
      return () => cleanup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData]);

  const setupRealtime = () => {
    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${user.id},receiver_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessagesData((prev) => [...prev, { ...payload.new, from_me: true }]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `sender_id=eq.${conversationId},receiver_id=eq.${user.id}`,
        },
        (payload) => {
          setMessagesData((prev) => [...prev, { ...payload.new, from_me: false }]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  const fetchChatUser = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, username, display_name, full_name, avatar_url, bio, created_at")
      .eq("id", conversationId)
      .single();

    if (data) setChatUser(data);
  };

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .or(`sender_id.eq.${conversationId},receiver_id.eq.${conversationId}`)
      .order("created_at", { ascending: true });

    if (!error && data) {
      const filtered = data.filter(
        (msg) =>
          (msg.sender_id === user.id && msg.receiver_id === conversationId) ||
          (msg.sender_id === conversationId && msg.receiver_id === user.id)
      );
      setMessagesData(
        filtered.map((msg) => ({
          ...msg,
          from_me: msg.sender_id === user.id,
        }))
      );
    }
    setLoading(false);
  };

  const handleMessageSent = (newMsg) => {
    setMessagesData((prev) => [...prev, { ...newMsg, from_me: true }]);
  };

  return (
    <div className="chat">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="chatHeader">
            <div onClick={() => history.push("/Messages")}>
              <BackIcon />
            </div>
            <Avatar src={chatUser?.avatar_url} />
            <div>
              <span>{chatUser?.display_name || chatUser?.full_name || "User"}</span>
              <span>@{chatUser?.username || "user"}</span>
            </div>
            <InfoIcon />
          </div>
          <div className="chatRoom">
            <div className="chatInfo">
              <div>
                <Avatar src={chatUser?.avatar_url} style={{ width: 48, height: 48 }} />
                <div>
                  <span>{chatUser?.display_name || chatUser?.full_name}</span>
                  <span>@{chatUser?.username}</span>
                </div>
              </div>
              {chatUser?.bio && <span>{chatUser.bio}</span>}
              {chatUser?.created_at && (
                <span>
                  <CalenderIcon />
                  Joined {new Date(chatUser.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
            <div className="chatMessages">
              {messagesData.map((message) =>
                message.from_me ? (
                  <MyMessage key={message.id} message={message.content} />
                ) : (
                  <FromMessage
                    key={message.id}
                    message={message.content}
                    userimage={chatUser?.avatar_url}
                  />
                )
              )}
              <div ref={messagesEndRef} />
            </div>
            <ChatInputs conversationId={conversationId} onMessageSent={handleMessageSent} />
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
