import { Avatar, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router";
import BottomSidebar from "../../components/BottomSidebar/BottomSidebar";
import Chat from "../../components/Chat/Chat";
import DrawerBar from "../../components/DrawerBar/DrawerBar";
import HomeBox from "../../components/HomeBox/HomeBox";
import { MessagesIcon } from "../../components/icons";
import LastChat from "../../components/LastChat/LastChat";
import NotSelectedMessage from "../../components/NotSelectedMessage/NotSelectedMessage";
import SearchInput from "../../components/Widgets/SearchInput/SearchInput";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import "./Messages.css";

const Messages = () => {
  const { user, getUserAvatar } = useAuth();
  const history = useHistory();
  const [isDrawerBar, setIsDrawerBar] = React.useState(false);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  let path = useLocation().pathname;

  useEffect(() => {
    document.title = "Messages / Tweetfeed";
  }, []);

  useEffect(() => {
    if (user) fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchConversations = async () => {
    const { data: sent } = await supabase
      .from("messages")
      .select("receiver_id, content, created_at")
      .eq("sender_id", user.id)
      .order("created_at", { ascending: false });

    const { data: received } = await supabase
      .from("messages")
      .select("sender_id, content, created_at")
      .eq("receiver_id", user.id)
      .order("created_at", { ascending: false });

    const conversationMap = {};

    if (sent) {
      for (const msg of sent) {
        if (!conversationMap[msg.receiver_id] || new Date(msg.created_at) > new Date(conversationMap[msg.receiver_id].created_at)) {
          conversationMap[msg.receiver_id] = {
            userId: msg.receiver_id,
            lastMessage: msg.content,
            createdAt: msg.created_at,
          };
        }
      }
    }

    if (received) {
      for (const msg of received) {
        if (!conversationMap[msg.sender_id] || new Date(msg.created_at) > new Date(conversationMap[msg.sender_id].created_at)) {
          conversationMap[msg.sender_id] = {
            userId: msg.sender_id,
            lastMessage: msg.content,
            createdAt: msg.created_at,
          };
        }
      }
    }

    const userIds = Object.keys(conversationMap);
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, display_name, full_name, avatar_url")
        .in("id", userIds);

      const profileMap = {};
      if (profiles) {
        profiles.forEach((p) => { profileMap[p.id] = p; });
      }

      const conversationList = Object.values(conversationMap)
        .map((conv) => ({
          ...conv,
          profile: profileMap[conv.userId] || null,
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setConversations(conversationList);
    } else {
      setConversations([]);
    }

    setLoading(false);
  };

  const isInConversation = path !== "/Messages";
  const conversationId = isInConversation ? path.split("/")[2] : null;

  return (
    <HomeBox>
      <div className={`messages ${isInConversation && "messagesNone"}`}>
        {isDrawerBar && (
          <div onClick={() => setIsDrawerBar(false)} className="drawerBarPanel" />
        )}
        <DrawerBar active={isDrawerBar} />
        <div className="messagesHeader">
          <div onClick={() => setIsDrawerBar(true)}>
            <Avatar src={getUserAvatar()} />
          </div>
          <span>Messages</span>
          <MessagesIcon />
        </div>
        <div className="messagesSearchInput">
          <SearchInput placeholder="Search for people and groups" />
        </div>
        <div style={{ padding: 12 }}>
          <button onClick={() => setShowNewMessage(true)} style={{ background: "#1da1f2", border: "none", color: "white", borderRadius: 9999, padding: "10px 20px", cursor: "pointer", fontWeight: 700, width: "100%" }}>
            ✉ New Message
          </button>
        </div>

        {showNewMessage && (
          <div style={{ padding: "0 12px 12px", borderBottom: "0.5px solid #38444d" }}>
            <TextField
              label="Search users by username"
              value={searchUser}
              onChange={(e) => {
                setSearchUser(e.target.value);
                if (e.target.value.length > 0) {
                  supabase.from("profiles").select("id, username, display_name, full_name, avatar_url")
                    .ilike("username", `%${e.target.value}%`)
                    .neq("id", user?.id)
                    .limit(5)
                    .then(({ data }) => setSearchResults(data || []));
                } else setSearchResults([]);
              }}
              fullWidth variant="outlined" size="small"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "#8899a6" } }}
              style={{ marginBottom: 8, background: "#192734", borderRadius: 4 }}
            />
            {searchResults.map((u) => (
              <div key={u.id} style={{ padding: "8px 0", borderBottom: "0.5px solid #38444d", cursor: "pointer" }}
                onClick={() => { setShowNewMessage(false); history.push(`/Messages/${u.id}`); }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar src={u.avatar_url} />
                  <div>
                    <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>{u.display_name || u.full_name}</span>
                    <span style={{ color: "#8899a6", fontSize: 13, marginLeft: 8 }}>@{u.username}</span>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setShowNewMessage(false)} style={{ background: "transparent", border: "none", color: "#1da1f2", cursor: "pointer", marginTop: 8 }}>Cancel</button>
          </div>
        )}

        <div className="lastMessages">
          {conversations.map((conv) => (
            <LastChat
              key={conv.userId}
              userId={conv.userId}
              displayName={conv.profile?.display_name || conv.profile?.full_name || "User"}
              username={conv.profile?.username || "user"}
              userimage={conv.profile?.avatar_url}
              lastMessage={conv.lastMessage}
              createdAt={conv.createdAt}
            />
          ))}
          {conversations.length === 0 && !loading && (
            <div className="noMessages">
              <h2>Welcome to your inbox!</h2>
              <p>Send a message to start a conversation.</p>
            </div>
          )}
        </div>
        <BottomSidebar />
      </div>
      {isInConversation && conversationId ? (
        <Chat conversationId={conversationId} />
      ) : (
        <NotSelectedMessage />
      )}
    </HomeBox>
  );
};

export default Messages;
