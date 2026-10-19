const cartModel = require("../models/cart.model");
const axios = require("axios");
const mongoose = require("mongoose");

function computeTotals(items) {
  const itemsWithPrices = items.map((item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;

    return {
      productId: item.productId,
      quantity: qty, // ✅ fix
      name: item.name,
      image: item.image,
      price,
      lineTotal: price * qty,
    };
  });

  const subtotal = itemsWithPrices.reduce(
    (sum, item) => sum + item.lineTotal,
    0,
  );

  const tax = Number((subtotal * 0.1).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  return {
    itemsWithPrices,
    totals: {
      subtotal,
      tax,
      total,
    },
  };
}

async function getOrCreateCart(userId) {
  let cart = await cartModel.findOne({ user: userId });
  if (!cart) {
    cart = new cartModel({ user: userId, items: [] });
    await cart.save();
  }
  return cart;
}

async function getCart(req, res) {
  try {
    const userId = req.user?._id || "testUser";
    const cart = await getOrCreateCart(userId);
    const { itemsWithPrices, totals } = computeTotals(cart.items);

    res.status(200).json({ items: itemsWithPrices, totals });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch cart", message: error.message });
  }
}

async function addItemToCart(req, res) {
  try {
    const { productId, qty } = req.body;
    const userId = req.user?._id || "testUser";

    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({
        error: "qty must be a positive integer",
      });
    }

    const response = await axios.get(
      `Market-ALB-2034128545.ap-south-1.elb.amazonaws.com/api/products/${productId}`,
    );

    console.log("PRODUCT RESPONSE =>", response.data);

    const product = response.data.product;

    console.log("PRODUCT =>", product);
    console.log("PRODUCT NAME =>", product?.name);
    console.log("PRODUCT TITLE =>", product?.title);
    console.log("PRODUCT PRICE =>", product?.price);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    const productName =
      product.name || product.title || product.productName || "Unknown Product";

    const productPrice = product.price?.amount || product.price || 0;

    const productImage = product.images?.[0]?.url || product.image || "";

    const cart = await getOrCreateCart(userId);

    const existingIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    if (existingIndex >= 0) {
      const newQty = cart.items[existingIndex].quantity + qty;

      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({
        productId,
        quantity: qty,
        name: productName,
        price: productPrice,
        image: productImage,
      });
    }

    console.log("BEFORE SAVE:");
    console.log(JSON.stringify(cart.items, null, 2));

    await cart.save();

    const updatedCart = await cartModel.findById(cart._id);

    console.log("AFTER SAVE:");
    console.log(JSON.stringify(updatedCart.items, null, 2));

    const { itemsWithPrices, totals } = computeTotals(cart.items);

    return res.status(201).json({
      message: "Item added to cart",
      items: itemsWithPrices,
      totals,
    });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);

    return res.status(500).json({
      error: error.name,
      message: error.message,
    });
  }
}

async function updateItemQuantity(req, res) {
  try {
    const { productId } = req.params;
    const { qty } = req.body;
    const userId = req.user?._id || "testUser";

    if (typeof qty !== "number") {
      return res.status(400).json({ error: "qty must be a number" });
    }

    const response = await axios.get(
      `Market-ALB-2034128545.ap-south-1.elb.amazonaws.com/api/products/${productId}`,
    );

    const product = response.data.product;
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    if (itemIndex < 0) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    if (qty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      if (product.stock < qty) {
        return res.status(400).json({
          error: "Insufficient stock for requested quantity",
          available: product.stock,
          requested: qty,
        });
      }
      cart.items[itemIndex].quantity = qty;
    }

    await cart.save();

    const { itemsWithPrices, totals } = computeTotals(cart.items);
    res.status(200).json({
      message: qty <= 0 ? "Item removed from cart" : "Item quantity updated",
      items: itemsWithPrices,
      totals,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to update item quantity",
      message: error.message,
    });
  }
}

async function removeItemFromCart(req, res) {
  try {
    const { productId } = req.params;
    const userId = req.user?._id || "testUser";

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    if (itemIndex < 0) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    const { itemsWithPrices, totals } = computeTotals(cart.items);
    res.status(200).json({
      message: "Item removed from cart",
      items: itemsWithPrices,
      totals,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to remove item", message: error.message });
  }
}

async function clearCart(req, res) {
  try {
    const userId = req.user?._id || "testUser";

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      message: "Cart cleared",
      items: [],
      totals: { subtotal: 0, tax: 0, total: 0 },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to clear cart", message: error.message });
  }
}

module.exports = {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
};
