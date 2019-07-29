const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";
  data.title = !isEmpty(data.title) ? data.title : "";

  let hashTags = [];
  if (data.hashTags) hashTags = data.hashTags.split(",");

  if (!Validator.isLength(data.title, { min: 3, max: 30 })) {
    errors.title = "Title must be between 3 and 30 characters";
  }

  if (!Validator.isLength(data.text, { min: 3, max: 300 })) {
    errors.text = "Text must be between 3 and 300 characters";
  }

  if (Validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }

  hashTags.map(hashTag => {

    if (!Validator.isLength(hashTag, { min: 3, max: 20 })) {
      errors.hashTag = "Hashtag needs to be between 3 and 20";
    }
    if (!Validator.isAlphanumeric(hashTag)) {
      errors.hashTag = "Hashtag should be alphanumeric";
    }
    if (Validator.isEmpty(hashTag)) {
      errors.hashTag = "Hashtag cannot be empty";
    }
  });

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
