import { useEffect, useRef, useState } from "react";
import socket from "../services/aiBuddy.service";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import ProductCard from "../../products/components/ProductCard";

const ChatBox = ({ closeChat }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ CONNECTED:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("❌ CONNECT ERROR:", err.message);
    });

    socket.on("message-response", (data) => {
      console.log("📩 RESPONSE:", data);

      if (data.messages) {
        setMessages((prev) => [...prev, ...data.messages]);
      } else {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("message-response");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMessage = {
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);

    console.log("📤 SENDING:", text);

    socket.emit("message", text);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-slate-100">
      {/* Header */}{" "}
      <div className="bg-indigo-600 text-white p-4 flex items-center justify-between shadow-md">
        {" "}
        <div className="flex items-center gap-3">
          {" "}
          <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center">
            🤖{" "}
          </div>
          <div>
            <h2 className="font-semibold">AI Buddy</h2>

            <p className="text-xs opacity-80">Online</p>
          </div>
        </div>
        <button
          onClick={() => {
            console.log("CLOSE CLICKED");
            console.log("closeChat =>", closeChat);

            closeChat?.();
          }}
        >
          ✕
        </button>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>

              <h2 className="text-xl font-semibold">AI Buddy</h2>

              <p className="text-gray-500 mt-2">
                Ask anything about products, orders and cart.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, index) => {
          // Product Response
          if (msg.type === "product" && msg.product) {
            return (
              <div key={index} className="mb-4">
                <ProductCard product={msg.product} />
              </div>
            );
          }

          // Normal Chat Message
          return <MessageBubble key={index} message={msg} />;
        })}

        <div ref={messagesEndRef} />
      </div>
      {/* Input */}
      <ChatInput onSend={sendMessage} />
    </div>
  );
};

export default ChatBox;
