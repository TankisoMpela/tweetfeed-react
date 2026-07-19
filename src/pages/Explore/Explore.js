import React from "react";
import "./Explore.css";
import FriendSuggestions from "../../components/Widgets/FriendSuggestions/FriendSuggestions";
import SearchInput from "../../components/Widgets/SearchInput/SearchInput";
import { SettingsIcon } from "../../components/icons";
import Topics from "../../components/Widgets/Topics/Topics";
import BottomSidebar from "../../components/BottomSidebar/BottomSidebar";
import Links from "../../components/Widgets/Links/Links";
import DrawerBar from "../../components/DrawerBar/DrawerBar";
import { Avatar } from "@material-ui/core";
import HomeBox from "../../components/HomeBox/HomeBox";
import Loading from "../../components/Loading/Loading";
import { useAuth } from "../../contexts/AuthContext";

function Explore() {
  const { getUserAvatar } = useAuth();
  const [isDrawerBar, setIsDrawerBar] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    document.title = "Explore / Tweetfeed";
    return () => clearTimeout(timer);
  }, []);

  return (
    <HomeBox>
      <div className="feed">
        {isDrawerBar && (
          <div
            onClick={() => setIsDrawerBar(false)}
            className="drawerBarPanel"
          />
        )}
        <DrawerBar active={isDrawerBar} />
        <div className="explore-header">
          <div onClick={() => setIsDrawerBar(true)}>
            <Avatar src={getUserAvatar()} />
          </div>
          <SearchInput placeholder="Search Tweetfeed" />
          <SettingsIcon />
        </div>
        <div className="exploreContent">
          {loading ? <Loading /> : <Topics />}
        </div>
        <BottomSidebar />
      </div>
      <div className="widgets">
        <FriendSuggestions />
        <Links />
      </div>
    </HomeBox>
  );
}

export default Explore;
