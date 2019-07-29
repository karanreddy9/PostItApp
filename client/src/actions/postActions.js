import axios from "axios";

import {
  GET_POST,
  GET_POSTS,
  DELETE_POST,
  GET_ERRORS,
  CLEAR_ERRORS
} from "./types";

// Get all posts
export const getPosts = () => dispatch => {
  axios
    .get("/api/posts")
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

// Get trending posts
export const getTrendingPosts = () => dispatch => {
  axios
    .get("/api/posts/trending")
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

// Get popular posts
export const getPopularPosts = () => dispatch => {
  axios
    .get("/api/posts/popular")
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

// Get mostviewed posts
export const getMostViewedPosts = () => dispatch => {
  axios
    .get("/api/posts/mostviewed")
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

// Get posts by userid
export const getUserPosts = id => dispatch => {
  axios
    .get(`/api/profile/posts/${id}`)
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

// Get post by postid
export const getPostById = id => dispatch => {
  axios
    .get(`/api/posts/post/${id}`)
    .then(res => {
      addViewToPost(id);
      dispatch({
        type: GET_POST,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_POST,
        payload: {}
      })
    );
};

// Add a post
export const addPost = (postData, history) => dispatch => {
  axios
    .post("/api/posts", postData)
    .then(res => history.push("/"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Like
export const addLike = id => dispatch => {
  axios
    .post(`/api/posts/like/${id}`)
    .then(res => {})
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: {}
      })
    );
};

// Add Like
export const addViewToPost = id => {
  axios
    .post(`/api/posts/views/${id}`)
    .then(res => {})
    .catch(err => {});
};

// Add Comment to Post
export const addCommentToPost = (id, commentData) => dispatch => {
  axios
    .post(`/api/posts/comment/${id}`, commentData)
    .then(res => {
      dispatch(clearErrors());
      dispatch(getPostById(id));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Remove Comment from Post
export const removeCommentFromPost = (id, commentId) => dispatch => {
  axios
    .delete(`/api/posts/comment/${id}/${commentId}`)
    .then(res => {
      dispatch(getPostById(id));
    })
    .catch(err => {
      dispatch(getPostById(id));
    });
};

// Delete Post
export const deletePost = id => dispatch => {
  axios
    .delete(`/api/posts/post/${id}`)
    .then(res => {
      dispatch({
        type: DELETE_POST,
        payload: id
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Remove Like
export const removeLike = id => dispatch => {
  axios
    .post(`/api/posts/unlike/${id}`)
    .then(res => {})
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: {}
      })
    );
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
