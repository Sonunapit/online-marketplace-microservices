const express = require("express");
const cartController = require("../controllers/cart.controller");
const {
  validateAddItemToCart,
  validateUpdateItem,
} = require("../middlewares/validation.middleware");
const createAuthMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/",
  createAuthMiddleware(["user"]),
  cartController.getCart,
);

router.post(
  "/items",
  createAuthMiddleware(["user"]),
  validateAddItemToCart,
  cartController.addItemToCart,
);

router.patch(
  "/items/:productId",
  createAuthMiddleware(["user"]),
  validateUpdateItem,
  cartController.updateItemQuantity,
);

router.delete(
  "/items/:productId",
  createAuthMiddleware(["user"]),
  cartController.removeItemFromCart,
);

router.delete(
  "/",
  createAuthMiddleware(["user"]),
  cartController.clearCart,
);

module.exports = router;
