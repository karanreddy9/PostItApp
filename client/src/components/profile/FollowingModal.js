import React, { Component } from "react";
import { Link } from "react-router-dom";

class FollowingModal extends Component {
  render() {
    const { following } = this.props;
    return (
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="followingModalLabel">
              Following
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {following.map(follower => (
              <div key={follower._id} className="mb-2">
                <img
                  className="rounded shadow-sm"
                  style={{ width: "50px", marginRight: "5px" }}
                  src={follower.avatar}
                  alt=""
                />
                <Link to={`/profile/${follower.handle}`} target="#">
                  {follower.handle}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

// FollowingModal.propTypes = {
//   auth: PropTypes.object.isRequired,
//   followUser: PropTypes.func.isRequired,
//   unFollowUser: PropTypes.func.isRequired
// };

// const mapStateToProps = state => ({
//   auth: state.auth
// });

export default FollowingModal;
