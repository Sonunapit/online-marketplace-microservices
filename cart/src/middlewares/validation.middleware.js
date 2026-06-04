const { body, param, validationResult } = require('express-validator')
const mongoose = require('mongoose');

function validateResult(req,res,next){
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }
    next()
}



const validateAddItemToCart = [
    body('productId')
    .isString()
    .withMessage("Product Id must be a string")
    .custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid Product Id format'),
    body('qty')
    .isInt({ gt:0})
    .withMessage("Quantity must be a positive integer"),
    validateResult,
]

const validateUpdateItem = [
  param('productId')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('productId is required in params'),
  body('qty')
    .isInt()
    .withMessage('qty must be an integer'),
  validateResult,
];

module.exports = {
    validateAddItemToCart,
    validateUpdateItem
}