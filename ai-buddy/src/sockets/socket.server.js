const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const agent = require("../agent/agent");




function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

 io.use((socket, next) => {
  console.log(
    "HANDSHAKE COOKIE =>",
    socket.handshake.headers.cookie
  );

  try {
    const cookies = socket.handshake.headers.cookie;

    if (!cookies) {
      return next(new Error("No cookies found"));
    }

    const { token } = cookie.parse(cookies);

    if (!token) {
      return next(new Error("Token not found"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    socket.user = decoded;
    socket.token = token;

    next();
  } catch (error) {
    next(error);
  }
});

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);
    console.log("User:", socket.user);

    socket.emit("message-response", {
      role: "assistant",
      content: "AI Buddy Connected Successfully 🚀",
    });

    socket.on("message", async (data) => {
      try {
        console.log("Received:", data);

        const response = await agent.invoke(
          {
            messages: [
              {
                role: "user",
                content: data,
              },
            ],
          },
          {
            
              token: socket.token,
            
          },
        );

        console.log("Agent Response:", JSON.stringify(response, null, 2));

        console.log("Sending Response...");

        socket.emit("message-response", response);

        console.log("Response Sent Successfully");
      } catch (error) {
        console.error("Agent Error:", error);

        socket.emit("message-response", {
          role: "assistant",
          content: `Error: ${error.message}`,
        });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`Socket ${socket.id} disconnected:`, reason);
    });
  });

  return io;
}

module.exports = { initSocketServer };
