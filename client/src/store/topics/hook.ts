import { useCallback } from "react";
import { fetchGeneratedTopics, setCurrentTopic } from "./slice";
import { useAppSelector, useAppDispatch } from "../hooks";
import type { TopicConcepts } from "./types";

interface TopicsHookResult {
  currentTopic: string | null;
  topicConcepts: Record<string, TopicConcepts>;
  loading: boolean;
  generateConcepts: (mainTopic: string, context: string[]) => void;
  setCurrTopic: (topic: string) => void;
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
 */
const useTopics = (): TopicsHookResult => {
  const dispatch = useAppDispatch();
  const topics = useAppSelector((state) => state.topics);

  const { currentTopic, concepts: topicConcepts, loading } = topics;

  const generateConcepts = useCallback(
    (mainTopic: string, context: string[]) => {
      if (context === undefined || !Array.isArray(context)) context = [];
      const data = { mainTopic, context };
      dispatch(fetchGeneratedTopics(data));
    },
    [dispatch]
  );

  const setCurrTopic = useCallback(
    (topic: string) => {
      dispatch(setCurrentTopic(topic));
    },
    [dispatch]
  );

  return {
    currentTopic,
    topicConcepts,
    loading,
    generateConcepts,
    setCurrTopic,
  };
};

export default useTopics;
