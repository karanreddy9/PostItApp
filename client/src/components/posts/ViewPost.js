import React, { Component } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import PopularUsers from "../users/PopularUsers";
import CommentItem from "./CommentItem";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";

import {
  getPostById,
  deletePost,
  addLike,
  removeLike,
  addCommentToPost,
  removeCommentFromPost
} from "../../actions/postActions";

class ViewPost extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      handle: "",
      likes: [],
      comments: [],
      userLiked: false,
      likesCount: 0,
      text: "",
      title: "",
      displayComment: true,
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    const { posts } = this.props;
    const { auth } = this.props;
    e.preventDefault();
    const commentData = {
      text: this.state.text,
      title: posts.post.title
    };

    if (auth.isAuthenticated) {
      this.props.addCommentToPost(this.props.match.params.id, commentData);
      if (this.state.text.length > 2 && this.state.text.length < 301) {
        this.setState({ text: "" });
        this.setState({ displayComment: false });
      }
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value, errors: "" });
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getPostById(this.props.match.params.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.posts.post) {
      const post = nextProps.posts.post;
      this.setState({
        user: post.user._id,
        handle: post.user.handle,
        likes: post.likes,
        comments: post.comments,
        userLiked: this.findUserLike(post.likes),
        likesCount: post.likes.length
      });
    }
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
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

  onClickComment() {
    this.setState({ displayComment: !this.state.displayComment });
  }

  onDeleteClick(id) {
    this.props.deletePost(id);
    this.props.history.push("/my-posts");
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
    const { posts } = this.props;
    const { auth } = this.props;
    const { errors } = this.state;

    let uL = this.state.userLiked;
    let lC = this.state.likesCount;

    return (
      <div>
        <div className="maincontent row ">
          <div className="col-md-8 mr-sm-auto mt-5">
            <div className="card mb-3 shadow">
              <div className="card-body ">
                <h5 className="card-title">{posts.post.title}</h5>
                <hr />
                <div className="text-left card-text text-secondary">
                  {posts.post.text}
                </div>
                <hr />
                <div>
                  <button
                    className="btn bg-light mr-1"
                    type="button"
                    onClick={this.onLikeClick.bind(
                      this,
                      posts.post._id,
                      uL,
                      lC
                    )}
                  >
                    <i
                      className={classnames("fas fa-thumbs-up mr-1", {
                        "text-primary mr-1": uL
                      })}
                    />
                    <span className="text-muted">{lC}</span>
                  </button>
                  <div className="btn btn-light mr-1">
                    <i className="far fa-comment text-primary mr-1" />
                    <span className="text-muted">
                      {this.state.comments.length}
                    </span>
                  </div>
                  {this.state.user === auth.user.id ? (
                    <button
                      className="btn btn-light"
                      type="button"
                      onClick={this.onDeleteClick.bind(this, posts.post._id)}
                    >
                      <i className="fas fa-trash-alt text-danger mr-1" />
                    </button>
                  ) : null}

                  <span className="text-muted text-right float-right">
                    Posted by{" "}
                    <Link to={`/profile/${this.state.handle}`}>
                      {this.state.handle}
                    </Link>
                    <span className="mr-1">,</span>
                    <Moment
                      fromNow
                      withTitle
                      titleFormat="DD MMM YYYY, hh:mm a"
                    >
                      {posts.post.createdOn}
                    </Moment>
                  </span>
                </div>
              </div>
            </div>
            <div className="card border-0">
              <div className="card-body">
                <hr />
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
                      <h6>Comments</h6>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            {this.state.comments.map(comment => (
              <CommentItem
                key={comment._id}
                comment={comment}
                postId={this.props.match.params.id}
              />
            ))}
            <div>
              <button
                className="btn btn-light mt-2 mb-3 border"
                onClick={this.onClickComment.bind(this)}
              >
                <i className="far fa-comment mr-1" />
                Comment
              </button>
              {this.state.displayComment ? (
                <form noValidate onSubmit={this.onSubmit}>
                  <TextAreaFieldGroup
                    placeholder="Type something..."
                    name="text"
                    value={this.state.text}
                    onChange={this.onChange}
                    error={errors.text}
                  />
                  <button type="submit" className="btn btn-primary mb-3">
                    <strong>Add</strong>
                  </button>
                </form>
              ) : null}
            </div>
            <div />
          </div>
          <div role="main" className="col-md-4 mr-sm-auto">
            <div className="mt-5">
              <div className="card shadow-sm mb-3">
                <div className="card-body">
                  <h5 className="card-title">Hey there!</h5>
                  <hr />
                  <p className="card-text text-muted">
                    Have a question? or Want to know about something? or Want to
                    tell something? then just post it here!
                  </p>
                  <Link to="/new-post" className="btn btn-primary">
                    <strong>Create Post</strong>
                  </Link>
                </div>
              </div>
              <PopularUsers />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ViewPost.propTypes = {
  posts: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getPostById: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  addCommentToPost: PropTypes.func.isRequired,
  removeCommentFromPost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  posts: state.posts,
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  {
    getPostById,
    deletePost,
    addLike,
    removeLike,
    addCommentToPost,
    removeCommentFromPost
  }
)(ViewPost);
