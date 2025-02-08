import React from "react";
import Message from "@/components/llm/Message";
import useThreadChat from "@/store/threads/hooks/use-thread-chat";
import LearningContentDisplay from "@/components/thread/ThreadContentItem";
import type { LearningContent } from "@/store/threads/types";
import ChatInput from "@/components/llm/ChatInput";
import { X } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface ThreadMessagesProps {
  threadContent: LearningContent;
  exploring: boolean;
  closeExploring: () => void;
}

const ThreadMessages: React.FC<ThreadMessagesProps> = ({
  threadContent,
  exploring,
  closeExploring,
}) => {
  const { threadChat } = useThreadChat(parseInt(threadContent.id));

  console.log(threadChat);

  return (
    <div className="h-full flex flex-col gap-4">
      <ScrollArea className="h-[calc(100vh-10rem)] p-4">
        <LearningContentDisplay
          content={threadContent}
          onExplore={() => {}}
          isExploring={exploring}
        />
        <div className="flex flex-col gap-4">
          {threadChat?.chats.map(
            ({ chatId, userQuestion, aiResponse, loading }) => (
              <Message
                key={chatId}
                userQuestion={userQuestion}
                aiResponse={aiResponse}
                chatId={chatId}
                loading={loading}
              />
            )
          )}
        </div>
      </ScrollArea>
      <div className="fixed bottom-0 left-0 right-0 px-32 z-50">
        <div className="flex items-center justify-end bg-zinc-900/50 p-2 rounded-t-xl">
          <X
            className="w-4 h-4 cursor-pointer hover:text-red-500"
            onClick={closeExploring}
          />
        </div>
        <ChatInput onSubmit={() => {}} />
      </div>
    </div>
  );
};

export default ThreadMessages;
