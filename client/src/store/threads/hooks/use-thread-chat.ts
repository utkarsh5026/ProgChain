import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadThreadChatsThunk, streamAiAnswerThunk } from "../threadChatSlice";
import { useEffect, useCallback, useMemo } from "react";
import { stopChat } from "../api";

const useThreadChat = (threadContentId: number) => {
  const dispatch = useAppDispatch();
  const { chats, loading } = useAppSelector((state) => state.threadChat);

  const currentChat = useMemo(() => {
    return chats[threadContentId];
  }, [chats, threadContentId]);

  useEffect(() => {
    dispatch(loadThreadChatsThunk(threadContentId));
  }, [dispatch, threadContentId]);

  const fetchAnswer = useCallback(
    (question: string) => {
      dispatch(streamAiAnswerThunk({ threadContentId, question }));
    },
    [dispatch, threadContentId]
  );

  const stopStream = useCallback(async () => {
    await stopChat(threadContentId);
  }, [threadContentId]);

  const getMessageFromChat = (messageId: number) => {
    return currentChat?.chats.find((chat) => chat.chatId === messageId);
  };

  return {
    threadChat: currentChat,
    loading: loading[threadContentId],
    fetchAnswer,
    stopStream,
    getMessageFromChat,
  };
};

export default useThreadChat;
