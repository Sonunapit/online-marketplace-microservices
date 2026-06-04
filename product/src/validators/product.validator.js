const { body, validationResult } = require("express-validator");

function handleValidationErrors(req,res,next){
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({message:'validation error',errors})

  }
  next()
}
const createProductValidations = [
  body("title").isString().trim().notEmpty().withMessage("Title is required"),
  body("priceAmount")
    .notEmpty()
    .withMessage("priceAmount is required")
    .bail()
    .isFloat({ gt: 0 })
    .withMessage("priceAmount must be a positive number"),
  body("priceCurrency")
    .optional()
    .isIn(["USD", "INR"])
    .withMessage("priceCurrency must be USD or INR"),
  body("description")
    .optional()
    .trim()
    .isString()
    .withMessage("description must be a string")
    .isLength({ max: 500 })
    .withMessage("desciption max length is 500 characters"),
  handleValidationErrors,
];

module.exports = { createProductValidations, handleValidationErrors };
