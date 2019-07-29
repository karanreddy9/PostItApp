import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import moment from "moment";

import PostItem from "../posts/PostItem";
import FollowersModal from "./FollowersModal";
import FollowingModal from "./FollowingModal";
import { getUserPosts } from "../../actions/postActions";
import { getProfileByHandle } from "../../actions/profileActions";
import { unFollowUser, followUser } from "../../actions/userActions";

class UsersProfile extends Component {
  constructor() {
    super();
    this.state = {
      profileId: "",
      handle: "",
      avatar: "",
      followers: [],
      following: [],
      userProfile: [
        {
          name: "",
          bio: "",
          birthday: "",
          lastUpdatedOn: ""
        }
      ],
      errors: {}
    };
  }

  componentDidMount() {
    if (this.props.match.params.handle) {
      this.props.getProfileByHandle(this.props.match.params.handle);
      setTimeout(() => {
        this.props.getUserPosts(this.state.profileId);
      }, 1000);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile.profile.length === 0) {
      this.props.history.push("/profile-not-found");
    } else if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile;

      // Set component fields state
      profile.map(p => {
        this.setState({
          profileId: p._id,
          handle: p.handle,
          avatar: p.avatar,
          followers: p.followers,
          following: p.following
        });
        if (p.userProfile.length > 0) {
          p.userProfile.map(u => {
            return this.setState({
              name: u.name,
              bio: u.bio,
              birthday: moment(u.birthday).format("DD-MMM-YYYY"),
              lastUpdatedOn: moment(u.lastUpdatedOn).format("DD-MMM-YYYY")
            });
          });
        }
      });
    }
  }

  onFollowClick(id, followers) {
    const { auth } = this.props;
    if (
      followers.filter(follower => follower.user === auth.user.id).length > 0
    ) {
      this.props.unFollowUser(id, this.props.match.params.handle);
    } else {
      this.props.followUser(id, this.props.match.params.handle);
    }
  }

  findUserFollow(followers) {
    const { auth } = this.props;
    if (
      followers.filter(follower => follower.user === auth.user.id).length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { posts } = this.props;

    return (
      <div>
        <div className="maincontent row mt-3">
          <div className="col-md-8">
            <div className="card border-0">
              <div className="card-body">
                <ul className="nav nav-pills card-header-pills">
                  <li
                    className="nav-item"
                    style={{
                      borderBottomWidth: "3px",
                      borderBottomStyle: "solid",
                      borderBottomColor: "rgb(0, 121, 211)"
                    }}
                  >
                    <Link className="nav-link text-dark" to="#">
                      {this.state.name ? (
                        <h6>{this.state.name}'s Profile</h6>
                      ) : (
                        <h6>{this.state.handle}'s Profile</h6>
                      )}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-md-8 mr-sm-auto">
            <div>
              {posts.posts.map(post => (
                <PostItem key={post._id} post={post} />
              ))}
            </div>
          </div>
          <div className="col-md-4 mr-sm-auto">
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <div className="row mb-2">
                  <div className="col-2">
                    <img
                      className="rounded shadow-sm"
                      style={{ width: "50px", marginRight: "5px" }}
                      src={this.state.avatar}
                      alt=""
                    />
                  </div>
                  <div className="col-6">
                    <div>
                      <h5 className="align-center">{this.state.name}</h5>
                      <p className="text-muted">u/{this.state.handle}</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <button
                      className={classnames("btn btn-sm btn-outline-primary", {
                        "btn btn-sm btn-primary text-light": this.findUserFollow(
                          this.state.followers
                        )
                      })}
                      onClick={this.onFollowClick.bind(
                        this,
                        this.state.profileId,
                        this.state.followers
                      )}
                    >
                      {this.findUserFollow(this.state.followers) === true ? (
                        <strong>Following</strong>
                      ) : (
                        <strong>Follow</strong>
                      )}
                    </button>
                  </div>
                </div>
                <br />
                <div className="card-text text-muted">
                  <div>
                    <strong>Bio: </strong>
                    {this.state.bio}
                  </div>
                  <hr />
                  <div>
                    <strong>Followers: </strong>
                    {this.state.followers.length}
                    <button
                      type="button"
                      className="btn btn-sm btn-primary float-right"
                      data-toggle="modal"
                      data-target="#followersModal"
                    >
                      <strong>view</strong>
                    </button>
                    <div
                      className="modal fade"
                      id="followersModal"
                      tabIndex="-1"
                      role="dialog"
                      aria-labelledby="followersModalLabel"
                      aria-hidden="true"
                    >
                      <FollowersModal followers={this.state.followers} />
                    </div>
                  </div>
                  <hr />
                  <div>
                    <strong>Following: </strong>
                    {this.state.following.length}
                    <button
                      type="button"
                      className="btn btn-sm btn-primary float-right"
                      data-toggle="modal"
                      data-target="#followingModal"
                    >
                      <strong>view</strong>
                    </button>
                    <div
                      className="modal fade"
                      id="followingModal"
                      tabIndex="-1"
                      role="dialog"
                      aria-labelledby="followingModalLabel"
                      aria-hidden="true"
                    >
                      <FollowingModal following={this.state.following} />
                    </div>
                  </div>
                  <hr />
                  <div>
                    <strong>Birthday: </strong>
                    {this.state.birthday}
                  </div>
                  <hr />
                  <div>
                    <strong>Last Updated On: </strong>
                    {this.state.lastUpdatedOn}
                  </div>
                  <hr />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UsersProfile.propTypes = {
  getUserPosts: PropTypes.func.isRequired,
  getProfileByHandle: PropTypes.func.isRequired,
  unFollowUser: PropTypes.func.isRequired,
  followUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  posts: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  posts: state.posts,
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getUserPosts, getProfileByHandle, unFollowUser, followUser }
)(UsersProfile);
