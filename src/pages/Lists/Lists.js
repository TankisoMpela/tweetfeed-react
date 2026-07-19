import React, { useState } from "react";
import HomeBox from "../../components/HomeBox/HomeBox";
import SearchInput from "../../components/Widgets/SearchInput/SearchInput";
import FriendSuggestions from "../../components/Widgets/FriendSuggestions/FriendSuggestions";
import Topics from "../../components/Widgets/Topics/Topics";
import Links from "../../components/Widgets/Links/Links";
import BottomSidebar from "../../components/BottomSidebar/BottomSidebar";
import BackIcon from "@material-ui/icons/KeyboardBackspace";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { TextField } from "@material-ui/core";
import "./Lists.css";

const Lists = () => {
  const { getUserDisplayName, user } = useAuth();
  const history = useHistory();
  const [creating, setCreating] = useState(false);
  const [listName, setListName] = useState("");
  const [listDesc, setListDesc] = useState("");
  const [lists, setLists] = useState([]);

  React.useEffect(() => {
    if (user) {
      supabase.from("bookmarks").select("*").eq("user_id", user.id).limit(5).then(({ data }) => {
        if (data && data.length > 0) setLists([{ id: "pinned", name: "Pinned Bookmarks", description: `${data.length} saved tweets` }]);
      });
    }
  }, [user]);

  const handleCreateList = async () => {
    if (!listName.trim()) return;
    setCreating(false);
    setLists([...lists, { id: Date.now().toString(), name: listName, description: listDesc || "No description" }]);
    setListName("");
    setListDesc("");
  };

  return (
    <HomeBox>
      <section className="feed">
        <div className="listsHeader">
          <div onClick={() => history.goBack()}>
            <BackIcon />
          </div>
          <div>
            <span>Lists</span>
            <span>{getUserDisplayName()}</span>
          </div>
        </div>

        {creating && (
          <div className="listsCreate">
            <TextField
              label="List name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "#8899a6" } }}
              style={{ marginBottom: 8, background: "#192734", borderRadius: 4 }}
            />
            <TextField
              label="Description (optional)"
              value={listDesc}
              onChange={(e) => setListDesc(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "#8899a6" } }}
              style={{ marginBottom: 8, background: "#192734", borderRadius: 4 }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleCreateList} style={{ background: "#1da1f2", border: "none", color: "white", borderRadius: 9999, padding: "8px 20px", cursor: "pointer", fontWeight: 700 }}>Create</button>
              <button onClick={() => setCreating(false)} style={{ background: "transparent", border: "1px solid #38444d", color: "#1da1f2", borderRadius: 9999, padding: "8px 20px", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        {lists.length > 0 ? (
          lists.map((l) => (
            <div key={l.id} style={{ padding: 16, borderBottom: "0.5px solid #38444d", cursor: "pointer" }}>
              <span style={{ color: "white", fontWeight: 700, fontSize: 15 }}>{l.name}</span>
              <br />
              <span style={{ color: "#8899a6", fontSize: 13 }}>{l.description}</span>
            </div>
          ))
        ) : (
          <div className="emptyState">
            <h2>You haven't created any Lists</h2>
            <p>When you create a List, it will show up here.</p>
          </div>
        )}

        {!creating && (
          <div style={{ padding: 12 }}>
            <button onClick={() => setCreating(true)} style={{ background: "#1da1f2", border: "none", color: "white", borderRadius: 9999, padding: "10px 20px", cursor: "pointer", fontWeight: 700, width: "100%" }}>+ Create new List</button>
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

export default Lists;
