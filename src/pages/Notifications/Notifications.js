import React from "react";
import "./Notifications.css";
import Widgets from "../../components/Widgets/Widgets";
import SettingsIcon from "@material-ui/icons/Settings";
import BottomSidebar from "../../components/BottomSidebar/BottomSidebar";
import { Avatar } from "@material-ui/core";
import DrawerBar from "../../components/DrawerBar/DrawerBar";
import HomeBox from "../../components/HomeBox/HomeBox";
import Loading from "../../components/Loading/Loading";
import { useAuth } from "../../contexts/AuthContext";

function Notifications() {
  const { getUserAvatar } = useAuth();
  const [isAll, setIsAll] = React.useState(true);
  const [isDrawerBar, setIsDrawerBar] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    document.title = "Notifications / Tweetfeed";
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
        <div className="notificationsHeader">
          <div className="notificationsTitle">
            <div onClick={() => setIsDrawerBar(true)}>
              <Avatar src={getUserAvatar()} />
            </div>
            <span>Notifications</span>
            <SettingsIcon />
          </div>
          <div className="notificationsCategory">
            <div
              className={isAll ? "notificationActive" : ""}
              onClick={() => setIsAll(true)}
            >
              <span>All</span>
            </div>
            <div
              className={!isAll ? "notificationActive" : ""}
              onClick={() => setIsAll(false)}
            >
              <span>Mentions</span>
            </div>
          </div>
        </div>
        <article>
          {!loading ? (
            <div className="emptyState">
              <h2>Nothing to see here — yet</h2>
              <p>When someone interacts with you, you'll see it here.</p>
            </div>
          ) : (
            <Loading />
          )}
        </article>
        <BottomSidebar />
      </div>
      <Widgets />
    </HomeBox>
  );
}

export default Notifications;
