import React from "react";
import Message from "../llm/Message";
import { op } from "@/base";

const ChatMessages: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <Message
        userQuestion={""}
        aiResponse={""}
        chatId={1}
        loading={op(null)}
      />
    </div>
  );
};

export default ChatMessages;
