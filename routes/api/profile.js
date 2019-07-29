const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//  Load validation
const validateProfileInput = require("../../validation/profile");

// Load Profile Model
const Profile = require("../../models/Profile");
// Load User Model
const User = require("../../models/User");
//  Post model
const Post = require("../../models/Post");

//  @route    GET api/profile
//  @desc     Get current user's profile
//  @access   Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["handle", "avatar", "followers", "following"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

//  @route    GET api/profile/:handle
//  @desc     Get profile by handle
//  @access   Public
router.get("/:handle", (req, res) => {
  const errors = {};

  User.aggregate([
    {
      $match: {
        handle: req.params.handle
      }
    },
    {
      $project: {
        email: 0,
        passWord: 0
      }
    },
    {
      $lookup: {
        from: "profiles",
        localField: "_id",
        foreignField: "user",
        as: "userProfile"
      }
    }
  ])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user.";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

//  @route    GET api/profile/user/:user_id
//  @desc     Get profile by user ID
//  @access   Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id }, { lastUpdatedOn: 0 })
    .populate("user", ["handle", "avatar", "followers", "following"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user.";
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "There is no profile for this user." })
    );
});

//  @route    GET api/profile/posts/:userid
//  @desc     returns posts of the user
//  @access   Public
router.get("/posts/:userid", (req, res) => {
  const ObjectId = mongoose.Types.ObjectId;

  Post.aggregate([
    {
      $match: {
        user: ObjectId(req.params.userid)
      }
    },
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
    .then(posts => {
      res.json(posts);
    })
    .catch(err => res.status(404).json({ nopostsfound: "No posts found" }));
});

//  @route    POST api/profile
//  @desc     Create or Edit user profile
//  @access   Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    //   Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.lastUpdatedOn = Date.now();
    if (req.body.name) profileFields.name = req.body.name;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.birthday) profileFields.birthday = req.body.birthday;

    const updateProfile = () => {
      Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      ).then(profile => {
        return res.json(profile);
      });
    };

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        updateProfile();
      } else {
        //  Create Profile
        new Profile(profileFields).save().then(profile => res.json(profile));
      }
    });
  }
);

//  @route    DELETE api/profile
//  @desc     Delete user and profile
//  @access   Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
