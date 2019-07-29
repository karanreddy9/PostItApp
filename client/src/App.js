import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";

import { Provider } from "react-redux";
import store from "./store";

import PrivateRoute from "./components/common/PrivateRoute";

import Navbar from "./components/layout/Navbar";
import PostFeed from "./components/posts/PostFeed";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/profile/Profile";
import ProfilePosts from "./components/profile/ProfilePosts";
import UsersProfile from "./components/profile/UsersProfile";
import TrendingPosts from "./components/posts/TrendingPosts";
import PopularPosts from "./components/posts/PopularPosts";
import MostViewedPosts from "./components/posts/MostViewedPosts";
import CreatePost from "./components/posts/CreatePost";
import CreateProfile from "./components/profile/CreateProfile";
import ViewPost from "./components/posts/ViewPost";

import "./App.css";

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current Profile
    store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <div className="container">
              <Route exact path="/" component={PostFeed} />
              <Route exact path="/trending" component={TrendingPosts} />
              <Route exact path="/popular" component={PopularPosts} />
              <Route exact path="/most-viewed" component={MostViewedPosts} />
              <Route exact path="/new-post" component={CreatePost} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Register} />
              <Route exact path="/post/:id" component={ViewPost} />
              <Switch>
                <PrivateRoute exact path="/my-profile" component={Profile} />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/my-posts" component={ProfilePosts} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/create-profile"
                  component={CreateProfile}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/profile/:handle"
                  component={UsersProfile}
                />
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
