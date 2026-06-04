const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const { uploadImage } = require("../services/imagekit.service");
const productModel = require("../models/product.model");

async function createProduct(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }

  try {
    const { title, description, priceAmount, priceCurrency = "INR" } = req.body;

    const seller = req.user?.id;

    const price = {
      amount: Number(priceAmount),
      currency: priceCurrency,
    };

    const files = req.files || (req.file ? [req.file] : []);

    const images = await Promise.all(
      files.map((file) =>
        uploadImage({
          buffer: file.buffer,
          filename: file.originalname,
        }),
      ),
    );

    const product = await productModel.create({
      title,
      description,
      price,
      seller,
      images,
    });

    return res.status(201).json({
      message: "Product created",
      data: product,
    });
  } catch (error) {
    console.error("Create product error", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function getProducts(req, res) {
  const { q, minprice, maxprice, skip = 0, limit = 20 } = req.query;

  const filter = {};

  if (q) {
    filter.$text = {
      $search: q,
    };
  }

  if (minprice) {
    filter["price.amount"] = {
      ...filter["price.amount"],
      $gte: Number(minprice),
    };
  }

  if (maxprice) {
    filter["price.amount"] = {
      ...filter["price.amount"],
      $lte: Number(maxprice),
    };
  }

  const products = await productModel
    .find(filter)
    .skip(Number(skip))
    .limit(Math.min(Number(limit), 20));

  return res.status(200).json({
    data: products,
  });
}

async function getProductById(req, res) {
  const { id } = req.params;
  const product = await productModel.findById(id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  return res.status(200).json({ product: product });
}

async function updateProduct(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }

  try {

    const product = await productModel.findOne({
      _id: id,
      seller: req.user.id,
    });

    if (!product) {
      return res.status(403).json({
        message: "Forbidden: Cannot update this product",
      });
    }

    if (req.body.title !== undefined) {
      product.title = req.body.title;
    }

    if (req.body.description !== undefined) {
      product.description = req.body.description;
    }

    if (req.body.priceAmount !== undefined) {
      product.price.amount = Number(req.body.priceAmount);
    }

    if (req.body.priceCurrency !== undefined) {
      product.price.currency = req.body.priceCurrency;
    }

    await product.save();

    return res.status(200).json({
      message: "Product updated",
      data: product,
    });

  } catch (error) {

    console.error("Update product error", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid product id",
    });
  }

  try {
    const product = await productModel.findOne({
      _id: id,
      seller: req.user.id,
    });

    if (!product) {
      return res.status(403).json({
        message: "Forbidden: Cannot delete this product",
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      message: "Product deleted",
    });
  } catch (error) {
    console.error("Delete product error", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function getSellerProducts(req, res) {

  try {

    const sellerId = req.user.id;

    const {
      skip = 0,
      limit = 20
    } = req.query;

    const products = await productModel
      .find({
        seller: sellerId
      })
      .skip(Number(skip))
      .limit(Math.min(Number(limit), 20));

    return res.status(200).json({
      data: products,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getSellerProducts,
};
