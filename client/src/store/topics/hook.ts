import { useCallback, useMemo } from "react";
import { fetchGeneratedTopics, setCurrentTopic, setSuccess } from "./slice";
import { useAppSelector, useAppDispatch } from "../hooks";
import type { TopicConcepts } from "./types";
import type { Model } from "@/config/config";

interface TopicsHookResult {
  currentTopic: string | null;
  topicConcepts: Record<string, TopicConcepts>;
  loading: boolean;
  generating: boolean;
  error: string | null;
  fetchTopics: (topicPath: string, model: Model) => Promise<void>;
}

/**
 * Custom hook for managing topics in the application.
 *
 * @returns {TopicsHookResult} An object containing:
 *   - currentTopic: The currently selected topic
 *   - topicConcepts: A record of topic concepts organized by difficulty
 *   - loading: A boolean indicating if topics are being fetched
 *   - generateConcepts: A function to generate new concepts for a given topic
 *   - setCurrTopic: A function to set the current topic
 *   - parseTopic: A function to parse a topic string into its main topic and context
 */
const useTopics = (): TopicsHookResult => {
  const dispatch = useAppDispatch();
  const topics = useAppSelector((state) => state.topics);

  const {
    currentTopic,
    topics: topicConcepts,
    loading,
    conversationId,
    generating,
    error,
  } = topics;

  const memoizedTopicConcepts = useMemo(() => topicConcepts, [topicConcepts]);

  const fetchTopics = useCallback(
    async (topicPath: string, model: Model) => {
      if (topicPath in topicConcepts) {
        dispatch(setCurrentTopic(topicPath));
        dispatch(setSuccess());
      }
      const data = { conversationId, topicPath, model };
      dispatch(setCurrentTopic(topicPath));
      await dispatch(fetchGeneratedTopics(data));
    },
    [conversationId]
  );

  return {
    currentTopic,
    topicConcepts: memoizedTopicConcepts,
    loading,
    fetchTopics,
    generating,
    error,
  };
};

export default useTopics;
