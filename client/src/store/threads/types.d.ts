type LearningContent = {
  id: string;
  content: string;
};

export type Thread = {
  mainTopic: string;
  currentIdx: number;
  content: LearningContent[];
};

export type ThreadTopicRequest = {
  topic: string;
  currentIdx: number;
};
