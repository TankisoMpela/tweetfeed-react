import React, { useEffect, useState } from "react";
import "./FriendSuggestions.css";
import FriendSuggestionItem from "./FriendSuggestionItem/FriendSuggestionItem";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../contexts/AuthContext";

function FriendSuggestions() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (user) fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchSuggestions = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, username, display_name, full_name, avatar_url")
      .neq("id", user.id)
      .limit(3);

    if (data) setSuggestions(data);
  };

  if (suggestions.length === 0) return null;

  return (
    <div className="friendSuggestions">
      <div className="friendSuggestionsHeader">
        <span>Who to follow</span>
      </div>
      {suggestions.map((s) => (
        <FriendSuggestionItem
          key={s.id}
          id={s.id}
          username={s.username}
          displayName={s.display_name || s.full_name}
          image={s.avatar_url}
        />
      ))}
      <div className="widgetsTopicMore">
        <span>Show more</span>
      </div>
    </div>
  );
}

export default FriendSuggestions;
