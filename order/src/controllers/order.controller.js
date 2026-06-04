const orderModel = require("../models/order.model");
const axios = require("axios");

async function createOrder(req, res) {
  try {
    const user = req.user;

    const token =
      req.cookies?.token || req.headers?.authorization?.split(" ")[1];

    // Get Cart
    const cartResponse = await axios.get("http://localhost:3002/api/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const cartItems = cartResponse.data.items || [];

    if (cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // Get Products
    const products = await Promise.all(
      cartItems.map(async (item) => {
        const response = await axios.get(
          `http://localhost:3001/api/products/${item.productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        return response.data.product;
      }),
    );

    let priceAmount = 0;

    const orderItems = cartItems.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString(),
      );

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `${product.title} has only ${product.stock} items left`,
        );
      }

      const itemTotal = product.price.amount * item.quantity;

      priceAmount += itemTotal;

      return {
        product: item.productId,

        quantity: item.quantity,

        price: {
          amount: itemTotal,
          currency: product.price.currency,
        },
      };
    });

    const order = await orderModel.create({
      user: user.id,

      items: orderItems,

      status: "PENDING",

      totalPrice: {
        amount: priceAmount,
        currency: "INR",
      },

      shippingAddress: req.body.shippingAddress,
    });

    return res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getMyOrders(req, res) {
  try {
    const user = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await orderModel
      .find({ user: user.id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalOrders = await orderModel.countDocuments({
      user: user.id,
    });

    return res.status(200).json({
      orders,
      meta: {
        total: totalOrders,
        page,
        limit,
        totalPages: Math.ceil(totalOrders / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function getOrderById(req, res) {
  const user = req.user;
  const orderId = req.params.id;

  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.user.toString() !== user.id) {
      return res.status(403).json({
        message: "Forbidden: You do not have access",
      });
    }

    return res.status(200).json({
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function cancelOrderById(req, res) {
  try {
    const user = req.user;
    const orderId = req.params.id;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.user.toString() !== user.id) {
      return res.status(403).json({
        message: "Forbidden: You do not have access",
      });
    }

    if (order.status !== "PENDING") {
      return res.status(409).json({
        message: "Order cannot be cancelled at this time",
      });
    }

    order.status = "CANCELLED";

    if (!order.timeline) {
      order.timeline = [];
    }

    order.timeline.push({
      type: "CANCELLED",
      at: new Date(),
    });

    await order.save();

    return res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function updateOrderAddress(req, res) {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      message: "Order not found",
    });
  }

  order.shippingAddress = {
    ...order.shippingAddress,
    ...req.body.shippingAddress,
  };

  await order.save();

  return res.status(200).json({
    message: "Address updated successfully",
    order,
  });
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrderById,
  updateOrderAddress
};
