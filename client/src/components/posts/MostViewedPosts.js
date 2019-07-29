import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import PostItem from "./PostItem";
import CreatePostCard from "./CreatePostCard";
import PopularUsers from "../users/PopularUsers";

import { getMostViewedPosts } from "../../actions/postActions";

class MostViewedPosts extends Component {
  componentDidMount() {
    this.props.getMostViewedPosts();
  }

  render() {
    const { posts } = this.props;
    return (
      <div>
        <div className="maincontent row mt-3">
          <div className="col-md-8 mr-sm-auto">
            <div className="py-4">
              <h5 className="text-secondary">MostViewed Posts</h5>
            </div>
            {posts.posts.map(post => (
              <PostItem key={post._id} post={post} />
            ))}
          </div>
          <div role="main" className="col-md-4 mr-sm-auto">
            <div className="mt-5">
              <CreatePostCard />
              <PopularUsers />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MostViewedPosts.propTypes = {
  getMostViewedPosts: PropTypes.func.isRequired,
  posts: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  posts: state.posts
});

export default connect(
  mapStateToProps,
  { getMostViewedPosts }
)(MostViewedPosts);
