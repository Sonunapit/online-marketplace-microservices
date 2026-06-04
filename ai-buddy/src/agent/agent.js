const { ChatGroq } = require("@langchain/groq");
const { ToolMessage } = require("@langchain/core/messages");
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
    const messages = input.messages;

    try {
      console.log("CONFIG:", config);

      let response = await llmWithTools.invoke(messages);

      while (response.tool_calls && response.tool_calls.length > 0) {
        const toolMessages = [];

        for (const toolCall of response.tool_calls) {
          console.log("Tool Call:", toolCall);

          const tool = tools[toolCall.name];

          if (!tool) {
            throw new Error(`Tool ${toolCall.name} not found`);
          }

          const result = await tool.invoke({
            ...toolCall.args,
            token: config?.token,
          });

          console.log("Tool Result:", result);

          toolMessages.push(
            new ToolMessage({
              content: String(result),
              tool_call_id: toolCall.id,
            }),
          );
        }

        response = await llmWithTools.invoke([
          ...messages,
          response,
          ...toolMessages,
        ]);
      }

      return {
        messages: [
          {
            role: "assistant",
            content: response.content,
          },
        ],
      };
    } catch (error) {
      console.error("Agent Error:", error);

      return {
        messages: [
          {
            role: "assistant",
            content: error.message,
          },
        ],
      };
    }
  },
};

module.exports = agent;
