import React, { useEffect, useRef, useState } from "react";
import Message from "@/components/llm/Message";
import useThreadChat from "@/store/threads/hooks/use-thread-chat";
import LearningContentDisplay from "@/components/thread/ThreadContentItem";
import type { LearningContent } from "@/store/threads/types";
import ChatInput from "@/components/llm/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import QuestionMinimap from "@/components/llm/Minimap";

interface ThreadMessagesProps {
  threadContent: LearningContent;
  exploring: boolean;
}

const ThreadMessages: React.FC<ThreadMessagesProps> = ({
  threadContent,
  exploring,
}) => {
  const { threadChat } = useThreadChat(parseInt(threadContent.id));
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const messageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    console.log(threadChat);
  }, [threadChat]);

  const scrollToMessage = (id: number) => {
    const element = messageRefs.current.get(id);
    if (element) {
      element.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
      setActiveQuestionId(id);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute("data-message-id"));
            setActiveQuestionId(id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -100px 0px",
        threshold: 0.5,
      }
    );

    messageRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [threadChat]);

  return (
    <div className="h-full flex flex-col gap-4">
      <QuestionMinimap
        questions={threadChat?.chats.map(({ chatId, userQuestion }) => ({
          id: chatId,
          text: userQuestion,
        }))}
        onQuestionClick={scrollToMessage}
        activeQuestionId={activeQuestionId ?? undefined}
      />
      <ScrollArea className="h-[calc(100vh-10rem)] p-4">
        <LearningContentDisplay
          content={threadContent}
          onExplore={() => {}}
          isExploring={exploring}
        />
        <div className="flex flex-col gap-4">
          {threadChat?.chats.map(
            ({ chatId, userQuestion, aiResponse, loading }) => (
              <div
                key={chatId}
                ref={(el) => el && messageRefs.current.set(chatId, el)}
                data-message-id={chatId}
              >
                <Message
                  key={chatId}
                  userQuestion={userQuestion}
                  aiResponse={aiResponse}
                  chatId={chatId}
                  loading={loading}
                />
              </div>
            )
          )}
        </div>
      </ScrollArea>
      <div className="fixed bottom-0 left-0 right-0 px-32 z-50 max-w-8xl mx-auto">
        <ChatInput onSubmit={() => {}} />
      </div>
    </div>
  );
};

export default ThreadMessages;
