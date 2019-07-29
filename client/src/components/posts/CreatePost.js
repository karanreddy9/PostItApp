import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";

import { addPost } from "../../actions/postActions";

class CreatePost extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      text: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const postData = {
      title: this.state.title,
      text: this.state.text
    };

    this.props.addPost(postData, this.props.history);
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="maincontent row mt-3">
        <div className="col-md-8 m-auto bg-light py-5 border rounded shadow">
          <form onSubmit={this.onSubmit}>
            <div>
              <h6>Title</h6>
              <TextFieldGroup
                placeholder="Post Title"
                name="title"
                value={this.state.title}
                onChange={this.onChange}
                error={errors.title}
              />
              <h6>Description</h6>
              <TextAreaFieldGroup
                placeholder="Post Description"
                name="text"
                value={this.state.text}
                onChange={this.onChange}
                error={errors.text}
              />
              <button type="submit" className="btn btn-block btn-primary">
                <strong>Post</strong>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

CreatePost.propTypes = {
  addPost: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { addPost }
)(withRouter(CreatePost));
