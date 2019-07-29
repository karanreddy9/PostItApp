import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { createProfile, getCurrentProfile } from "../../actions/profileActions";

class CreateProfile extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      bio: "",
      birthday: "",
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
      this.props.history.push("/my-profile");
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
                      <h6>Create Profile</h6>
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
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
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
)(withRouter(CreateProfile));
