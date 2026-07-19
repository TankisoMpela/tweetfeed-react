import React from "react";
import "./App.css";
import SignIndex from "./pages/SignIndex/SignIndex";
import Login from "./pages/Login/Login";
import { Route, Switch, Redirect } from "react-router-dom";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
import Explore from "./pages/Explore/Explore";
import Notifications from "./pages/Notifications/Notifications";
import Profile from "./pages/Profile/Profile";
import Bookmarks from "./pages/Bookmarks/Bookmarks";
import Messages from "./pages/Messages/Messages";
import Lists from "./pages/Lists/Lists";
import { useAuth } from "./contexts/AuthContext";
import Loading from "./components/Loading/Loading";
import TopicView from "./pages/Explore/TopicView";

function ProtectedRoute({ component: Component, ...rest }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="fullPageLoading"><Loading /></div>;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

function AuthRoute({ component: Component, ...rest }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="fullPageLoading"><Loading /></div>;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Redirect to="/home" /> : <Component {...props} />
      }
    />
  );
}

function App() {
  return (
    <Switch>
      <Route path="/" component={SignIndex} exact />
      <AuthRoute path="/login" component={Login} />
      <AuthRoute path="/signup" component={Signup} />
      <ProtectedRoute path="/home" component={Home} />
      <ProtectedRoute path="/Explore" component={Explore} />
      <ProtectedRoute path="/Notifications" component={Notifications} />
      <ProtectedRoute path="/Messages" component={Messages} />
      <ProtectedRoute path="/Bookmarks" component={Bookmarks} />
      <ProtectedRoute path="/Lists" component={Lists} />
      <ProtectedRoute path="/profile/:id" component={Profile} />
      <ProtectedRoute path="/Profile" component={Profile} />
      <ProtectedRoute path="/topic/:hashtag" component={TopicView} />
    </Switch>
  );
}

export default App;
