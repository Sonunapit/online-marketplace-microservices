const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");

const searchProduct = tool(
  async ({ query, token }) => {
    const response = await axios.get(
      `http://localhost:3001/api/products?q=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const product = response.data.data[0];

    return JSON.stringify({
      productId: product._id,
      title: product.title,
      price: product.price.amount,
    });
  },
  {
    name: "searchProduct",
    description: "Search for products based on a query",
    schema: z.object({
      query: z.string().describe("The search query for products"),
    }),
  },
);

const addProductToCart = tool(
  async ({ productId, qty = 1, token }) => {
    console.log("TOOL TOKEN:", token);
    await axios.post(
      "http://localhost:3002/api/cart/items",
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

    return `Added product ${productId} (qty: ${qty}) to cart`;
  },
  {
    name: "addProductToCart",
    description: "Add a product to the shopping cart",
    schema: z.object({
      productId: z.string(),
      qty: z.number().default(1),
    }),
  },
);

module.exports = {
  searchProduct,
  addProductToCart,
};
