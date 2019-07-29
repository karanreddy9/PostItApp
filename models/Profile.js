const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  name: {
    type: String,
    required: true,
    max: 30
  },
  bio: {
    type: String,
    max: 300
  },
  birthday: {
    type: Date
  },
  lastUpdatedOn: {
    type: Date,
    default: Date.now,
    required: true
  }
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
