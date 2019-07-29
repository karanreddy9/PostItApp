const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//  Load Input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

//  Load User model
const User = require("../../models/User");

//  @route    POST api/users/register
//  @desc     Register user
//  @access   Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //  Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.find({
    $or: [{ email: req.body.email }, { handle: req.body.handle }]
  }).then(user => {
    if (user.length > 0) {
      user.map(u =>
        u.email === req.body.email
          ? (errors.email = "Email already exists")
          : (errors.handle = "Handle already exists")
      );
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //  Size
        r: "pg", // Rating
        d: "mm" //  Default
      });

      const newUser = new User({
        handle: req.body.handle,
        email: req.body.email,
        avatar,
        passWord: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.passWord, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          newUser.passWord = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//  @route    GET api/users/login
//  @desc     Login user / Returning JWT Token
//  @access   Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //  Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find User by email
  User.findOne({ email }).then(user => {
    //Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    //  Check password
    bcrypt.compare(password, user.passWord).then(isMatch => {
      if (isMatch) {
        //  User matched

        const payload = {
          id: user.id,
          handle: user.handle,
          avatar: user.avatar
        }; //Create JWT payload
        //  Sign token
        jwt.sign(
          payload,
          keys.secretOrkey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

//  @route    POST api/users/follow/:id
//  @desc     Like post
//  @access   Private
router.post(
  "/follow/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.id === req.params.id) {
      return res
        .status(400)
        .json({ cannotFollowYourself: "You cannot follow yourself" });
    }
    User.findById(req.params.id)
      .then(user => {
        if (
          user.followers.filter(
            follower => follower.user.toString() === req.user.id
          ).length > 0
        ) {
          return res.status(400).json({
            alreadyFollowing: "You are already following this user"
          });
        }
        const paramsUser = {
          handle: user.handle,
          avatar: user.avatar,
          user: req.params.id
        };
        //  Add user id to followers array
        const addUser = {
          handle: req.user.handle,
          avatar: req.user.avatar,
          user: req.user.id
        };
        user.followers.unshift(addUser);
        user.save().then(user => {
          return res.json(user);
        });

        User.findById(req.user.id).then(user => {
          if (
            user.following.filter(
              following => following.user.toString() === req.params.id
            ).length > 0
          ) {
            return res.status(400).json({
              alreadyFollowing: "User already in the following array"
            });
          }

          //  Add params user id to the following array
          user.following.unshift(paramsUser);
          user.save();
        });
      })
      .catch(err =>
        res
          .status(404)
          .json({ usernotfound: "No User found with the param id" })
      );
  }
);

// @route   POST api/users/unfollow/:id
// @desc    Unfollow a user
// @access  Private
router.post(
  "/unfollow/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.params.id)
      .then(user => {
        if (
          user.followers.filter(
            follower => follower.user.toString() === req.user.id
          ).length === 0
        ) {
          return res
            .status(400)
            .json({ notfollowed: "You have not yet followed this user" });
        }

        // Get remove index
        const removeIndex = user.followers
          .map(item => item.user.toString())
          .indexOf(req.user.id);

        // Splice out of array
        user.followers.splice(removeIndex, 1);

        // Save
        user.save().then(user => res.json(user));

        User.findById(req.user.id).then(user => {
          if (
            user.following.filter(
              following => following.user.toString() === req.params.id
            ).length === 0
          ) {
            return res.status(400).json({
              notFollowing: "You are not following this user"
            });
          }

          // Get remove index
          const removeIndex = user.following
            .map(item => item.user.toString())
            .indexOf(req.params.id);

          // Splice out of array
          user.following.splice(removeIndex, 1);

          // Save
          user.save();
        });
      })
      .catch(err => res.status(404).json({ usernotfound: "No user found" }));
  }
);

//  @route    GET api/users/topusers
//  @desc     return users with most followers
//  @access   Public
router.get("/topusers", (req, res) => {
  User.aggregate([
    {
      $addFields: {
        noOfFollowers: {
          $size: "$followers"
        }
      }
    },
    {
      $sort: {
        noOfFollowers: -1
      }
    },
    {
      $limit: 10
    }
  ])
    .then(users => res.json(users))
    .catch(err => res.status(404).json({ usersnotfound: "No users found" }));
});

module.exports = router;
