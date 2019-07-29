import React, { Component } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addLike } from "../../actions/postActions";
import { removeLike } from "../../actions/postActions";
import { deletePost } from "../../actions/postActions";

class PostItem extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      text: "",
      likes: [],
      views: [],
      comments: [],
      hashTags: [],
      user: [],
      createdOn: "",
      errors: {},
      userLiked: false,
      likesCount: 0
    };
  }

  componentDidMount() {
    const { post } = this.props;
    this.setState({ userLiked: this.findUserLike(post.likes) });
    this.setState({ likesCount: post.likes.length });
  }

  onLikeClick(id, uL, lC) {
    const { auth } = this.props;
    if (auth.isAuthenticated) {
      if (uL) {
        this.setState({ userLiked: !uL });
        this.setState({ likesCount: lC - 1 });
        this.props.removeLike(id);
      } else {
        this.setState({ userLiked: !uL });
        this.setState({ likesCount: lC + 1 });
        this.props.addLike(id);
      }
    }
  }

  onDeleteClick(id) {
    this.props.deletePost(id);
  }

  findUserLike(likes) {
    const { auth } = this.props;
    if (likes.filter(like => like.user === auth.user.id).length > 0) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { post } = this.props;
    const { auth } = this.props;

    let uL = this.state.userLiked;
    let lC = this.state.likesCount;

    const postUser = post.user.map(u => {
      return u._id;
    });

    const postUserHandle = post.user.map(u => {
      return u.handle;
    });

    return (
      <div className="card mb-3 shadow">
        <div className="card-body ">
          <h5 className="card-title">{post.title}</h5>
          <hr />
          <Link
            className="btn text-left card-text text-secondary"
            to={`/post/${post._id}`}
          >
            {post.text}
          </Link>
          <hr />
          <div>
            <button
              className="btn bg-light mr-1"
              type="button"
              onClick={this.onLikeClick.bind(this, post._id, uL, lC)}
            >
              <i
                className={classnames("fas fa-thumbs-up mr-1", {
                  "text-primary mr-1": uL
                })}
              />
              <span className="text-muted">{lC}</span>
            </button>
            <Link className="btn btn-light mr-1" to={`/post/${post._id}`}>
              <i className="far fa-comment text-primary mr-1" />
              <span className="text-muted">{post.comments.length}</span>
            </Link>
            {postUser.toString() === auth.user.id ? (
              <button
                className="btn btn-light"
                type="button"
                onClick={this.onDeleteClick.bind(this, post._id)}
              >
                <i className="fas fa-trash-alt text-danger mr-1" />
              </button>
            ) : null}

            <span className="text-muted text-right float-right">
              Posted by{" "}
              <Link to={`/profile/${postUserHandle}`}>{postUserHandle}</Link>
              <span className="mr-1">,</span>
              <Moment fromNow withTitle titleFormat="DD MMM YYYY, hh:mm a">
                {post.createdOn}
              </Moment>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

PostItem.propTypes = {
  posts: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  posts: state.posts,
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { addLike, removeLike, deletePost }
)(PostItem);
