import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import UserItem from "./UserItem";

import { getPopularUsers } from "../../actions/userActions";

class PopularUsers extends Component {
  componentDidMount() {
    this.props.getPopularUsers();
  }

  render() {
    const { users } = this.props;
    return (
      <div className="card shadow-sm ">
        <h5 className="card-header">Popular Users</h5>
        {users.popularUsers.map(user => (
          <UserItem key={user._id} user={user} />
        ))}
      </div>
    );
  }
}

PopularUsers.propTypes = {
  users: PropTypes.object.isRequired,
  getPopularUsers: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  users: state.users
});

export default connect(
  mapStateToProps,
  { getPopularUsers }
)(PopularUsers);
