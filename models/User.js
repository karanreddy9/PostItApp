const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  handle: {
    type: String,
    required: true,
    max: 10
  },
  email: {
    type: String,
    required: true
  },
  passWord: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  followers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      handle: {
        type: String
      },
      avatar: {
        type: String
      }
    }
  ],
  following: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      handle: {
        type: String
      },
      avatar: {
        type: String
      }
    }
  ],
  joinedOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("users", UserSchema);
