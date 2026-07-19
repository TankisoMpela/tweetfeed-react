import React from "react";
import "./Sidebar.css";
import SidebarItem from "./SidebarItem/SidebarItem";
import {
  HomeIcon,
  MessagesIcon,
  ListIcon,
  UserIcon,
  ExploreIcon,
  SetTweetIcon,
  NotificationsIcon,
  BookmarkIcon,
  LogoutIcon,
} from "../icons/index";
import TwitterIcon from "@material-ui/icons/Twitter";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { Avatar } from "@material-ui/core";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Sidebar() {
  const location = useLocation().pathname;
  const { getUserDisplayName, getUserHandle, getUserAvatar, signOut } = useAuth();
  const history = useHistory();

  const handleLogout = async () => {
    await signOut();
    history.push("/login");
  };

  const displayName = getUserDisplayName();
  const handle = getUserHandle();
  const avatar = getUserAvatar();

  return (
    <div className="sidebar">
      <Link to="/home">
        <TwitterIcon className="twitter-icon" />
      </Link>
      <Link to="/home" style={{ textDecoration: "none" }}>
        <SidebarItem text="Home" Icon={HomeIcon} active={location === "/home"} />
      </Link>
      <Link to="/Explore" style={{ textDecoration: "none" }}>
        <SidebarItem text="Explore" Icon={ExploreIcon} active={location === "/Explore"} />
      </Link>
      <Link to="/Notifications" style={{ textDecoration: "none" }}>
        <SidebarItem text="Notifications" Icon={NotificationsIcon} active={location === "/Notifications"} />
      </Link>
      <Link to="/Messages" style={{ textDecoration: "none" }}>
        <SidebarItem text="Messages" Icon={MessagesIcon} active={location === "/Messages"} />
      </Link>
      <Link to="/Bookmarks" style={{ textDecoration: "none" }}>
        <SidebarItem text="Bookmarks" Icon={BookmarkIcon} active={location === "/Bookmarks"} />
      </Link>
      <Link to="/Lists" style={{ textDecoration: "none" }}>
        <SidebarItem text="Lists" Icon={ListIcon} active={location === "/Lists"} />
      </Link>
      <Link to="/Profile" style={{ textDecoration: "none" }}>
        <SidebarItem text="Profile" Icon={UserIcon} active={location === "/Profile"} />
      </Link>
      <div onClick={handleLogout} style={{ cursor: "pointer", textDecoration: "none" }}>
        <SidebarItem text="Log out" Icon={LogoutIcon} />
      </div>
      <div className="tweetButton">
        <SetTweetIcon className="setTweetIcon" />
        <span>Tweet</span>
      </div>
      <div className="profileCard">
        <Link to="/Profile" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flex: 1 }}>
          <div className="profileCardImage">
            <Avatar src={avatar} />
          </div>
          <div className="profileCardNameCol">
            <div className="profileCardNameColName">
              <span>{displayName}</span>
            </div>
            <div className="profileCardNameColuserName">
              <span>@{handle}</span>
            </div>
          </div>
        </Link>
        <div className="profileCardIcon" style={{ cursor: "pointer" }}>
          <MoreHorizIcon />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
