import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/profileActions";

class Navbar extends Component {
  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
    this.props.history.push("/login");
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authorized = (
      <ul className="navbar-nav">
        <li className="nav-item mr-2">
          <Link className="nav-link" to="/new-post">
            <i className="fas fa-pen mr-2" />
            New Post
          </Link>
        </li>

        <li className="nav-item mr-2">
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-light dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <img
                className="rounded-circle"
                style={{ width: "25px", marginRight: "5px" }}
                src={user.avatar}
                alt={user.handle}
                title="You must have a Gravatar connected to your email to display an image"
              />
            </button>
            <div className="dropdown-menu dropdown-menu-right">
              <Link className="dropdown-item" to="/my-profile">
                <i className="far fa-user mr-2" />
                My Profile
              </Link>
              <div className="dropdown-divider" />
              <Link
                className="dropdown-item"
                to=""
                onClick={this.onLogoutClick.bind(this)}
              >
                <i className="fas fa-sign-out-alt mr-2" />
                Logout
              </Link>
            </div>
          </div>
        </li>
      </ul>
    );

    const unauthorized = (
      <ul className="navbar-nav">
        <li className="nav-item mr-2">
          <Link className="btn btn-outline-primary" to="/login">
            <strong>Log In</strong>
          </Link>
        </li>
        <li className="nav-item mr-2">
          <Link className="btn btn-primary my-2 my-lg-0" to="/signup">
            <strong>Sign Up</strong>
          </Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light container-fluid fixed-top shadow-sm">
        <Link className="navbar-brand ml-5" to="/">
          <i className="far fa-clipboard mr-2" />
          Post It
        </Link>
        <button
          className="navbar-toggler ml-auto"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item mr-2">
              <Link className="nav-link" to="/trending">
                <i className="fas fa-chart-line mr-2" />
                Trending
              </Link>
            </li>
            <li className="nav-item mr-2">
              <Link className="nav-link" to="/popular">
                <i className="fas fa-fire-alt mr-2" />
                Popular
              </Link>
            </li>
            <li className="nav-item mr-2">
              <Link className="nav-link" to="/most-viewed">
                <i className="far fa-eye mr-2" />
                Most Viewed
              </Link>
            </li>
          </ul>
          {isAuthenticated ? authorized : unauthorized}
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  clearCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, clearCurrentProfile }
)(withRouter(Navbar));
