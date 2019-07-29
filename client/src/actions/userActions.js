import axios from "axios";
import { getProfileByHandle } from "./profileActions";

import { GET_POPULAR_USERS } from "./types";

// Get current profile
export const getPopularUsers = () => dispatch => {
  axios
    .get("/api/users/topusers")
    .then(res => {
      dispatch({
        type: GET_POPULAR_USERS,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_POPULAR_USERS,
        payload: []
      });
    });
};

// Follow a User
export const followUser = (id, handle) => dispatch => {
  axios
    .post(`/api/users/follow/${id}`)
    .then(res => {
      dispatch(getPopularUsers());
      dispatch(getProfileByHandle(handle));
    })
    .catch(err => {
      dispatch(getPopularUsers());
      dispatch(getProfileByHandle(handle));
    });
};

// Unfollow a User
export const unFollowUser = (id, handle) => dispatch => {
  axios
    .post(`/api/users/unfollow/${id}`)
    .then(res => {
      dispatch(getPopularUsers());
      dispatch(getProfileByHandle(handle));
    })
    .catch(err => {
      dispatch(getPopularUsers());
    });
};
