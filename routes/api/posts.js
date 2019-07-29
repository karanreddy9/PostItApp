const express = require("express");
const router = express.Router();
const passport = require("passport");

// Post model
const Post = require("../../models/Post");
const User = require("../../models/User");

// Validation
const validatePostInput = require("../../validation/post");

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get("/", (req, res) => {
  Post.aggregate([
    {
      $sort: {
        createdOn: -1
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user"
      }
    }
  ])
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: "No posts found" }));
});

// @route   GET api/posts/post/:id
// @desc    Get post by id
// @access  Public
router.get("/post/:id", (req, res) => {
  Post.findById(req.params.id)
    .populate("user", ["handle", "avatar"])
    .then(post => {
      if (post) {
        res.json(post);
      } else {
        res.status(404).json({ nopostfound: "No post found with that ID" });
      }
    })
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that ID" })
    );
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const postFields = {};
    postFields.user = req.user.id;
    if (req.body.title) postFields.title = req.body.title;
    if (req.body.text) postFields.text = req.body.text;
    if (typeof req.body.hashTags !== "undefined") {
      postFields.hashTags = req.body.hashTags.split(",");
    }

    new Post(postFields).save().then(post => res.json(post));
  }
);

// @route   DELETE api/posts/post/:id
// @desc    Delete post
// @access  Private
router.delete(
  "/post/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check for post owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "User not authorized" });
        }

        // Delete
        post.remove().then(() => res.json({ success: true }));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// @route   POST api/posts/views/:id
// @desc    add a view to the post
// @access  Private
router.post(
  "/views/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.views.filter(view => view.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyviewed: "User already viewed this post" });
        }

        // Add user id to likes array
        post.views.unshift({ user: req.user.id });

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyliked: "User already liked this post" });
        }

        // Add user id to likes array
        post.likes.unshift({ user: req.user.id });

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0
        ) {
          return res
            .status(400)
            .json({ notliked: "You have not yet liked this post" });
        }

        // Get remove index
        const removeIndex = post.likes
          .map(item => item.user.toString())
          .indexOf(req.user.id);

        // Splice out of array
        post.likes.splice(removeIndex, 1);

        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          handle: req.user.handle,
          avatar: req.user.avatar,
          user: req.user.id
        };

        // Add to comments array
        post.comments.push(newComment);

        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

//  @route    GET api/posts/:hashtag
//  @desc     return posts which matches the hashtag
//  @access   Public
router.get("/hashtag/:hashtag", (req, res) => {
  Post.find({ hashTags: req.params.hashtag })
    .sort({ createdOn: -1 })
    .then(posts => {
      if (posts.length === 0) {
        return res
          .status(404)
          .json({ nopostsfound: "No posts found with the hashtag" });
      }
      res.status(200).json(posts);
    })
    .catch(err =>
      res.status(404).json({ nopostsfound: "No posts found with the hashtag" })
    );
});

//  @route    GET api/posts/popular
//  @desc     return most liked posts
//  @access   Public
router.get("/popular", (req, res) => {
  Post.aggregate([
    {
      $addFields: {
        noOfLikes: {
          $size: "$likes"
        }
      }
    },
    {
      $sort: {
        noOfLikes: -1
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user"
      }
    }
  ])
    .then(posts => {
      res.json(posts);
    })
    .catch(err => res.status(404).json({ postsnotfound: "No posts found" }));
});

//  @route    GET api/posts/mostviewed
//  @desc     return most viewed posts
//  @access   Public
router.get("/mostviewed", (req, res) => {
  Post.aggregate([
    {
      $addFields: {
        noOfViews: {
          $size: "$views"
        }
      }
    },
    {
      $sort: {
        noOfViews: -1
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user"
      }
    }
  ])
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({ postsnotfound: "No posts  asd found" })
    );
});

//  @route    GET api/posts/trending
//  @desc     return last 24 hours posts ordered by most likes
//  @access   Public
router.get("/trending", (req, res) => {
  Post.aggregate([
    {
      $match: {
        createdOn: {
          $lt: new Date(),
          $gte: new Date(new Date().setDate(new Date().getDate() - 30))
        }
      }
    },
    {
      $addFields: {
        noOfLikes: {
          $size: "$likes"
        }
      }
    },
    {
      $sort: {
        noOfLikes: -1
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user"
      }
    }
  ])
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ postsnotfound: "No posts found" }));
});

module.exports = router;
