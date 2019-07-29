import React, { Component } from "react";
import { Link } from "react-router-dom";

class CreatePostCard extends Component {
  render() {
    return (
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h5 className="card-title">Hey there!</h5>
          <hr />
          <p className="card-text text-muted">
            Have a question? or Want to know about something? or Want to share
            something? just post anything you want here!
          </p>
          <Link to="/new-post" className="btn btn-primary">
            <strong>Create Post</strong>
          </Link>
        </div>
      </div>
    );
  }
}

export default CreatePostCard;
