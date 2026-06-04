const express = require("express");
const multer = require("multer");
const productController = require('../controllers/product.controller')
const { createProduct } = require("../controllers/product.controller");
const createAuthMiddleware = require("../middlewares/auth.middleware");
const { createProductValidations } = require("../validators/product.validator");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/",
  createAuthMiddleware(["admin", "seller"]),
  upload.array("images", 5),
  createProductValidations,
  productController.createProduct
);

router.get('/',productController.getProducts)

router.get('/seller', createAuthMiddleware(['seller']), productController.getSellerProducts);



router.patch( '/:id',createAuthMiddleware(['seller']),productController.updateProduct
);

router.delete('/:id', createAuthMiddleware(['seller']), productController.deleteProduct);

router.get('/:id', productController.getProductById);

module.exports = router;
