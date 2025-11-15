const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("EmailId is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  const data = req.body;

  if (!validator.isURL(data?.photoUrl)) {
    throw new Error("Photo Url is Invalid!!");
  }

  const allowedEditsFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "photoUrl",
    "coverPhotoUrl",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((fields) =>
    allowedEditsFields.includes(fields)
  );
  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
