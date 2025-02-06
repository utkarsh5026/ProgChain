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
