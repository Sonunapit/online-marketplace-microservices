import ChatBox from "../components/ChatBox";

const AiBuddyPage = ({ closeChat }) => {
  return (
    <div className="w-full h-full">
      <ChatBox closeChat={closeChat} />
    </div>
  );
};

export default AiBuddyPage;