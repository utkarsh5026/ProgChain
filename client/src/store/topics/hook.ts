import { useCallback, useMemo } from "react";
import {
  fetchGeneratedTopics,
  createTopicKey,
  setCurrentTopic,
  DELIMITER,
} from "./slice";
import { useAppSelector, useAppDispatch } from "../hooks";
import type { TopicConcepts, ConceptsRetrieve } from "./types";

interface TopicsHookResult {
  currentTopic: string | null;
  topicConcepts: Record<string, TopicConcepts>;
  loading: boolean;
  generateConcepts: (
    mainTopic: string,
    context: string[],
    useCache: boolean
  ) => void;
  parseTopic: (topic: string) => ConceptsRetrieve;
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

  const { currentTopic, concepts: topicConcepts, loading } = topics;

  const memoizedTopicConcepts = useMemo(() => topicConcepts, [topicConcepts]);

  const generateConcepts = useCallback(
    (mainTopic: string, context: string[], useCache: boolean) => {
      if (context === undefined || !Array.isArray(context)) context = [];
      const data = { mainTopic, context };
      const topicKey = createTopicKey(mainTopic, context);

      if (useCache && topicKey in memoizedTopicConcepts) {
        dispatch(setCurrentTopic(topicKey));
      } else {
        dispatch(fetchGeneratedTopics(data));
      }
    },
    [dispatch, memoizedTopicConcepts] // Remove topicConcepts from dependencies
  );

  const parseTopic = useCallback((topic: string): ConceptsRetrieve => {
    const pathSegments = topic.split(DELIMITER);
    const mainTopic = pathSegments[0];
    const context = pathSegments.slice(1);
    return { mainTopic, context };
  }, []);

  return {
    currentTopic,
    topicConcepts: memoizedTopicConcepts,
    loading,
    generateConcepts,
    parseTopic,
  };
};

export default useTopics;
