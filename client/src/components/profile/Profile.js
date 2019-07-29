import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";

import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { createProfile, getCurrentProfile } from "../../actions/profileActions";
import isEmpty from "../../validation/is-empty";
import FollowersModal from "./FollowersModal";
import FollowingModal from "./FollowingModal";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      bio: "",
      birthday: "",
      lastUpdatedOn: "",
      handle: "",
      followers: [],
      following: [],
      avatar: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentProfile(this.props.history);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile;

      profile.birthday = !isEmpty(profile.birthday)
        ? moment(profile.birthday).format("YYYY-MM-DD")
        : "";

      profile.lastUpdatedOn = !isEmpty(profile.lastUpdatedOn)
        ? moment(profile.lastUpdatedOn).format("DD-MMM-YYYY")
        : "";
      // Set component fields state
      this.setState({
        name: profile.name,
        bio: profile.bio,
        birthday: profile.birthday,
        lastUpdatedOn: profile.lastUpdatedOn
      });

      if (profile.user) {
        this.setState({
          handle: profile.user.handle,
          followers: profile.user.followers,
          following: profile.user.following,
          avatar: profile.user.avatar
        });
      }
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const profileData = {
      name: this.state.name,
      bio: this.state.bio,
      birthday: this.state.birthday
    };

    this.props.createProfile(profileData);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

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
                      <h6>Profile</h6>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-dark" to="/my-posts">
                      <h6>Posts</h6>
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
              <form noValidate onSubmit={this.onSubmit}>
                <div>
                  <h6>Name</h6>
                  <TextFieldGroup
                    placeholder="Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange}
                    error={errors.name}
                  />
                </div>
                <div>
                  <h6>Bio</h6>
                  <TextAreaFieldGroup
                    placeholder="Description"
                    name="bio"
                    value={this.state.bio}
                    onChange={this.onChange}
                    error={errors.bio}
                  />
                </div>
                <div>
                  <h6>Birthday</h6>
                  <TextFieldGroup
                    name="birthday"
                    type="date"
                    value={this.state.birthday}
                    onChange={this.onChange}
                    error={errors.birthday}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  <strong>Save</strong>
                </button>
              </form>
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
                  <div className="col-10">
                    <div>
                      <h5 className="align-center">{this.state.name}</h5>
                      <p className="text-muted">u/{this.state.handle}</p>
                    </div>
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
                    {moment(this.state.birthday).format("DD-MMM-YYYY")}
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

Profile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { createProfile, getCurrentProfile }
)(withRouter(Profile));
