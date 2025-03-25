import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useCallback } from "react";
import {
  fetchChatHistoryThunk,
  deleteChat as deleteChatAction,
} from "../chatsSlice";
import { deleteChat as deleteChatApi } from "../api";

const useExploreChats = () => {
  const dispatch = useAppDispatch();
  const { chats, loading, error } = useAppSelector(
    (state) => state.exploreChats
  );

  const fetchChatHistory = useCallback(
    async (limit: number, page: number) => {
      await dispatch(fetchChatHistoryThunk({ limit, page }));
    },
    [dispatch]
  );

  const deleteChat = useCallback(
    async (chatId: string) => {
      dispatch(deleteChatAction(chatId));
      await deleteChatApi(chatId);
    },
    [dispatch]
  );

  return {
    chats,
    loading,
    error,
    fetchChatHistory,
    deleteChat,
  };
};

export default useExploreChats;
