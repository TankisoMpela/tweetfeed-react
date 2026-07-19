import { Avatar } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { VerifiedIcon } from "../icons";
import "./LastChat.css";

const LastChat = ({ userId, displayName, username, userimage, lastMessage, createdAt }) => {
  const date = createdAt ? new Date(createdAt).toLocaleDateString() : "";
  return (
    <Link className="lastChat" to={`/Messages/${userId}`}>
      <div>
        <Avatar src={userimage} />
      </div>
      <div>
        <div>
          <span>
            {displayName}
            <VerifiedIcon />
          </span>
          <span>@{username}</span>
          <span>{date}</span>
        </div>
        <span>{lastMessage}</span>
      </div>
    </Link>
  );
};

export default LastChat;
