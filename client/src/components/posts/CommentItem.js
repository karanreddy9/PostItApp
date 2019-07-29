import React, { Component } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { removeCommentFromPost } from "../../actions/postActions";

class CommentItem extends Component {
  onDeleteComment(commentId) {
    this.props.removeCommentFromPost(this.props.postId, commentId);
  }

  render() {
    const { comment } = this.props;
    const { auth } = this.props;

    return (
      <div className="card border-0">
        <div className="card-body mb-2 border border-secondary border-right-0 border-top-0 border-left-0">
          <div>
            <h6 className="text-muted">
              <i className="fas fa-angle-right" />
              <Link to={`/profile/${comment.handle}`} className="ml-2">
                {comment.handle}
              </Link>{" "}
              added a comment -{" "}
              <Moment fromNow withTitle titleFormat="DD MMM YYYY, hh:mm a">
                {comment.commentedOn}
              </Moment>
              {auth.user.id === comment.user ? (
                <button
                  type="button"
                  className="btn btn-light float-right"
                  onClick={this.onDeleteComment.bind(this, comment._id)}
                >
                  <i className="fas fa-trash-alt mr-1 text-danger" />
                </button>
              ) : null}
            </h6>
          </div>
          <div className="ml-3 text-muted">{comment.text}</div>
        </div>
      </div>
    );
  }
}

CommentItem.propTypes = {
  auth: PropTypes.object.isRequired,
  removeCommentFromPost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { removeCommentFromPost }
)(CommentItem);
