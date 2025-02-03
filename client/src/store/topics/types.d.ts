export type Concept = {
  topic: string;
  description: string;
};

export type TopicConcepts = {
  beginner: Concept[];
  intermediate: Concept[];
  advanced: Concept[];
};

export type TopicsRequest = {
  conversationId: string | null;
  topicPath: string;
  model: Model;
};

export type TopicsResponse = {
  conversationId: string | null;
  topicPath: string;
  topics: TopicConcepts;
};
