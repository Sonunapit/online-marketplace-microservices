const { body, validationResult } = require('express-validator')

const respondwithvalidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


const createOrderValidation = [

  body("shippingAddress.street")
    .isString()
    .withMessage("street must be a string")
    .notEmpty()
    .withMessage("street is required"),

  body("shippingAddress.city")
    .isString()
    .withMessage("city must be a string")
    .notEmpty()
    .withMessage("city is required"),

  body("shippingAddress.state")
    .isString()
    .withMessage("state must be a string")
    .notEmpty()
    .withMessage("state is required"),

  body("shippingAddress.pincode")
    .isString()
    .withMessage("pincode must be string")
    .notEmpty()
    .withMessage("pincode is required")
    .matches(/^[0-9]{6}$/)
    .withMessage("invalid pincode"),

  body("shippingAddress.country")
    .isString()
    .withMessage("country must be a string")
    .notEmpty()
    .withMessage("country is required"),



  respondwithvalidationErrors,

];

const updateAddressValidation = [
  body("shippingAddress.street")
    .optional()
    .isString()
    .withMessage("street must be a string")
    .notEmpty()
    .withMessage("street cannot be empty"),

  body("shippingAddress.city")
    .optional()
    .isString()
    .withMessage("city must be a string")
    .notEmpty()
    .withMessage("city cannot be empty"),

  body("shippingAddress.state")
    .optional()
    .isString()
    .withMessage("state must be a string")
    .notEmpty()
    .withMessage("state cannot be empty"),

  body("shippingAddress.pincode")
    .optional()
    .isString()
    .withMessage("pincode must be a string")
    .matches(/^[0-9]{6}$/)
    .withMessage("invalid pincode"),

  body("shippingAddress.country")
    .optional()
    .isString()
    .withMessage("country must be a string")
    .notEmpty()
    .withMessage("country cannot be empty"),

  respondwithvalidationErrors,
];


module.exports = {
    createOrderValidation,
    updateAddressValidation
}