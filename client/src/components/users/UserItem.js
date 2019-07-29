import React, { Component } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { followUser, unFollowUser } from "../../actions/userActions";

class UserItem extends Component {
  onFollowClick(id, followers) {
    const { auth } = this.props;
    if (
      followers.filter(follower => follower.user === auth.user.id).length > 0
    ) {
      this.props.unFollowUser(id);
    } else {
      this.props.followUser(id);
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
    const { user } = this.props;
    return (
      <div className="card-body pb-2">
        <div className="row">
          <div className="col-2">
            <img
              className="rounded-circle"
              style={{ width: "40px", marginRight: "5px" }}
              src={user.avatar}
              alt=""
            />
          </div>
          <div className="col-5">
            <Link to={`/profile/${user.handle}`} className="text-secondary">
              u/{user.handle}
            </Link>
            <div className="text-muted ">
              <small>{user.followers.length} followers</small>
            </div>
          </div>
          <div className="col-5">
            <button
              className={classnames(
                "btn btn-sm btn-outline-primary float-right",
                {
                  "btn btn-sm btn-primary text-light float-right": this.findUserFollow(
                    user.followers
                  )
                }
              )}
              onClick={this.onFollowClick.bind(this, user._id, user.followers)}
            >
              {this.findUserFollow(user.followers) === true ? (
                <strong>Following</strong>
              ) : (
                <strong>Follow</strong>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

UserItem.propTypes = {
  auth: PropTypes.object.isRequired,
  followUser: PropTypes.func.isRequired,
  unFollowUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { followUser, unFollowUser }
)(UserItem);
