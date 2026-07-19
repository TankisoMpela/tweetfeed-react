import { Avatar } from "@material-ui/core";
import React from "react";
import {
  AddIcon,
  BookmarkIcon,
  DisplayIcon,
  ListIcon,
  UserIcon,
} from "../icons";
import MoreMenuItem from "../MoreMenu/MoreMenuItem/MoreMenuItem";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import "./DrawerBar.css";

const DrawerBar = ({ active }) => {
  const { getUserDisplayName, getUserHandle, getUserAvatar, signOut } = useAuth();
  const history = useHistory();

  const displayName = getUserDisplayName();
  const handle = getUserHandle();
  const avatar = getUserAvatar();

  const handleLogout = async () => {
    await signOut();
    history.push("/login");
  };

  return (
    <div className={`drawerBar ${active && "active"}`}>
      <div className="drawerBarHeader">
        <span>Account Info</span>
        <span>X</span>
      </div>
      <div className="draweBarScroll">
        <div className="drawerBarProfile">
          <div>
            <Avatar src={avatar} />
            <AddIcon />
          </div>
          <span>{displayName}</span>
          <span>@{handle}</span>
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
        <MoreMenuItem title="Profile" Icon={UserIcon} link="/Profile" />
        <MoreMenuItem title="Lists" Icon={ListIcon} link="/Lists" />
        <MoreMenuItem title="Bookmarks" Icon={BookmarkIcon} link="/Bookmarks" />
        <div onClick={handleLogout} style={{ cursor: "pointer" }}>
          <MoreMenuItem title="Log out" Icon={DisplayIcon} />
        </div>
      </div>
    </div>
  );
};

export default DrawerBar;
