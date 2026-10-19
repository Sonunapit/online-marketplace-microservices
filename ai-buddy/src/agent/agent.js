const { ChatGroq } = require("@langchain/groq");
const tools = require("./tools");

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0,
});

const llmWithTools = model.bindTools([
  tools.searchProduct,
  tools.addProductToCart,
]);

const agent = {
  async invoke(input, config) {
    try {
      console.log("CONFIG:", config);

      const userMessage =
        input.messages[input.messages.length - 1].content.toLowerCase();

      const response = await llmWithTools.invoke(input.messages);

      // Normal chat response
      if (!response.tool_calls?.length) {
        return {
          messages: [
            {
              role: "assistant",
              content: response.content,
            },
          ],
        };
      }

      const firstToolCall = response.tool_calls[0];

      console.log("FIRST TOOL CALL:", firstToolCall);

      // Handle Product Search
      if (firstToolCall.name === "searchProduct") {
        const searchResult = await tools.searchProduct.invoke({
          ...firstToolCall.args,
          token: config?.token,
        });

        console.log("SEARCH RESULT RAW:", searchResult);

        const product = JSON.parse(searchResult);

        console.log("PARSED PRODUCT:", product);

        const wantsCart =
          userMessage.includes("add to cart") ||
          userMessage.includes("add my cart") ||
          userMessage.includes("cart");

        // Only search request
        if (!wantsCart) {
          return {
            messages: [
              {
                role: "assistant",
                type: "product",
                product: {
                  _id: product.productId,
                  name: product.title,
                  description: product.description,
                  images: [
                    {
                      url: product.image,
                    },
                  ],
                  price: {
                    amount: product.price,
                  },
                },
              },
            ],
          };
        }

        console.log("ADDING TO CART:", {
          productId: product.productId,
          qty: 1,
        });

        const cartResult = await tools.addProductToCart.invoke({
          productId: product.productId,
          qty: 1,
          token: config?.token,
        });

        console.log("CART RESULT:", cartResult);

        return {
          messages: [
            {
              role: "assistant",
              content: `${product.title} added to cart successfully ✅`,
            },
          ],
        };
      }

      return {
        messages: [
          {
            role: "assistant",
            content: "Unable to process request",
          },
        ],
      };
    } catch (error) {
      console.error("Agent Error:", error);

      if (error.response?.data) {
        console.error("API ERROR:", error.response.data);
      }

      return {
        messages: [
          {
            role: "assistant",
            content:
              error.response?.data?.message ||
              error.message ||
              "Something went wrong",
          },
        ],
      };
    }
  },
};

module.exports = agent;
