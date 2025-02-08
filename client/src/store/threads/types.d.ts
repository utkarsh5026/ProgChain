import { Operation } from "@/base";

type LearningContent = {
  id: string;
  topic: string;
  content: string;
};

export type Thread = {
  threadID: number;
  mainTopic: string;
  currentIdx: number;
  content: LearningContent[];
};

type ThreadMessage = {
  chatId: number;
  userQuestion: string;
  aiResponse: string;
  createdAt?: string;
  updatedAt?: string;
  loading: Operation;
};

export type ThreadChatContent = {
  threadContentId: number;
  chats: ThreadMessage[];
};
