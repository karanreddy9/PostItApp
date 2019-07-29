import axios from "axios";

import {
  GET_PROFILE,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  CLEAR_ERRORS
} from "./types";

// Get current profile
export const getCurrentProfile = history => dispatch => {
  axios
    .get("/api/profile")
    .then(res => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    })
    .catch(err => history.push("/create-profile"));
};

// Get profile by handle
export const getProfileByHandle = handle => dispatch => {
  axios
    .get(`/api/profile/${handle}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: null
      })
    );
};

// Create Profile
export const createProfile = profileData => dispatch => {
  dispatch(clearErrors());
  axios
    .post("/api/profile", profileData)
    .then(res => {
      dispatch(getCurrentProfile());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
