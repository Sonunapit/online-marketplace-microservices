import { useState } from "react";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <div className="flex gap-2 p-4 border-t">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask AI Buddy..."
        className="flex-1 border rounded-lg px-4 py-2"
      />

      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;