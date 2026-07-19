import { Avatar } from "@material-ui/core";
import React from "react";
import { VerifiedIcon } from "../icons";
import "./ProfileCard.css";

const ProfileCard = ({ profile, active }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  if (!profile) return null;

  const displayName = profile.display_name || profile.full_name || "User";
  const handle = profile.username || "user";
  const bio = profile.bio || "";
  const avatar = profile.avatar_url;

  return (
    <div
      className={
        active || isVisible ? "profileDetailCard" : "profileDetailCardActive"
      }
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div>
        <Avatar src={avatar} />
        <div>
          <span>Follow</span>
        </div>
      </div>
      <div>
        <span>{displayName}</span>
        <VerifiedIcon />
      </div>
      <div>
        <span>@{handle}</span>
      </div>
      {bio && (
        <div>
          <span>{bio}</span>
        </div>
      )}
      <div>
        <span>
          <span>0</span>
          <span>Following</span>
        </span>
        <span>
          <span>0</span>
          <span>Followers</span>
        </span>
      </div>
    </div>
  );
};

export default ProfileCard;
