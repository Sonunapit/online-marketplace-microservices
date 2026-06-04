const { body, validationResult } = require("express-validator");

const respondwithvalidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerUserValidations = [
  body("username")
    .isString()
    .withMessage("username must be String")
    .isLength({ min: 3 })
    .withMessage("username must be at least 3 characters long"),
  body("email").isEmail().withMessage("Invalid email addres"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),
  body("fullName.firstName")
    .isString("first name must be string")
    .notEmpty()
    .withMessage("first name re required"),
  body("fullName.firstName")
    .isString()
    .withMessage("last name must be a string")
    .notEmpty()
    .withMessage("last name is required"),
    body('role')
    .optional()
    .isIn(['user','seller'])
    .withMessage("Role must be either 'user' or 'seller'"),

  respondwithvalidationErrors,
];

const loginUserValidations = [

  body("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address"),

  body("username")
    .optional()
    .isString()
    .withMessage("Username must be string"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  (req, res, next) => {

    if (!req.body.email && !req.body.username) {

      return res.status(400).json({
        errors: [
          {
            msg: "Either email or username is required",
          },
        ],
      });

    }

    respondwithvalidationErrors(req, res, next);

  },

];

const addUserAddressValidation = [

  body("street")
    .isString()
    .withMessage("street must be a string")
    .notEmpty()
    .withMessage("street is required"),

  body("city")
    .isString()
    .withMessage("city must be a string")
    .notEmpty()
    .withMessage("city is required"),

  body("state")
    .isString()
    .withMessage("state must be a string")
    .notEmpty()
    .withMessage("state is required"),

  body("pincode")
    .isString()
    .withMessage("pincode must be string")
    .notEmpty()
    .withMessage("pincode is required")
    .matches(/^[0-9]{6}$/)
    .withMessage("invalid pincode"),

  body("country")
    .isString()
    .withMessage("country must be a string")
    .notEmpty()
    .withMessage("country is required"),

  body("default")
    .optional()
    .isBoolean()
    .withMessage("default must be a boolean"),

  respondwithvalidationErrors,

];

module.exports = {
  registerUserValidations,
  loginUserValidations,
  addUserAddressValidation
};
