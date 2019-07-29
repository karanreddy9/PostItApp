const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.bio = !isEmpty(data.bio) ? data.bio : "";
  data.birthday = !isEmpty(data.birthday) ? data.birthday : "";

  if (!Validator.isLength(data.name, { min: 1, max: 30 })) {
    errors.name = "Name needs to be between 1 and 30";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Profile Name is required";
  }

  if (!Validator.isLength(data.bio, { min: 3, max: 100 })) {
    errors.bio = "Bio needs to be between 3 and 100";
  }

  if (Validator.isEmpty(data.bio)) {
    errors.bio = "Profile bio is required";
  }

  if (Validator.isEmpty(data.birthday)) {
    errors.birthday = "Profile birthday is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
