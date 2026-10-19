const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");

const searchProduct = tool(
  async ({ query, token }) => {
    console.log("SEARCH TOKEN:", token);

    const response = await axios.get(
      `Market-ALB-2034128545.ap-south-1.elb.amazonaws.com/api/products?q=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const product = response.data.data[0];

    if (!product) {
      throw new Error("Product not found");
    }

    return JSON.stringify({
      productId: product._id.toString(),
      title: product.title,
      price: product.price?.amount || 0,
      description: product.description || "",
      image: product.images?.[0]?.url || product.image || "",
      category: product.category?.name || "",
      stock: product.stock || 0,
      productUrl: `http://localhost:5173/product/${product._id}`,
    });
  },
  {
    name: "searchProduct",
    description: "Search a product and return product details",
    schema: z.object({
      query: z.string(),
      token: z.string().optional(),
    }),
  },
);

const addProductToCart = tool(
  async ({ productId, qty = 1, token }) => {
    console.log("PRODUCT ID RECEIVED:", productId);
    console.log("CART TOKEN:", token);

    const response = await axios.post(
      `Market-ALB-2034128545.ap-south-1.elb.amazonaws.com/api/cart/items`,
      {
        productId,
        qty,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  },
  {
    name: "addProductToCart",
    description: "Add product to cart",
    schema: z.object({
      productId: z.string(),
      qty: z.number().default(1),
      token: z.string().optional(),
    }),
  },
);

module.exports = {
  searchProduct,
  addProductToCart,
};
