import { Avatar } from "@material-ui/core";
import React from "react";
import { supabase } from "../../../../lib/supabase";
import { useAuth } from "../../../../contexts/AuthContext";
import "./FriendSuggestionItem.css";

function FriendSuggestionItem({ id, image, displayName, username }) {
  const { user } = useAuth();
  const [following, setFollowing] = React.useState(false);

  const handleFollow = async () => {
    if (!user || !id) return;
    if (following) {
      setFollowing(false);
      await supabase.from("follows").delete().eq("follower_id", user.id).eq("following_id", id);
    } else {
      setFollowing(true);
      await supabase.from("follows").insert([{ follower_id: user.id, following_id: id }]);
    }
  };

  return (
    <div className="friendSuggestionsItem">
      <div className="friendSuggestionImage">
        <Avatar src={image} />
      </div>
      <div className="profileCardNameCol">
        <div className="profileCardNameColName">
          <span>{displayName}</span>
        </div>
        <div className="profileCardNameColuserName">
          <span>@{username}</span>
        </div>
      </div>
      <div className="friendFollowButton" onClick={handleFollow}>
        <span>{following ? "Following" : "Follow"}</span>
      </div>
    </div>
  );
}

export default FriendSuggestionItem;
