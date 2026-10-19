const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex mb-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div className="flex items-end gap-2 max-w-[80%]">
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
            🤖
          </div>
        )}

        <div
          className={`
            px-4 py-3 rounded-2xl shadow-sm
            break-words
            ${
              isUser
                ? "bg-indigo-600 text-white rounded-br-md"
                : "bg-white text-gray-800 border rounded-bl-md"
            }
          `}
        >
          <p className="text-sm leading-relaxed">
            {message.content}
          </p>
        </div>

        {isUser && (
          <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-bold">
            U
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;