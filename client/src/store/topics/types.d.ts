export interface Concept {
  emoji: string;
  topic: string;
}

export interface TopicConcepts {
  beginner: Concept[];
  intermediate: Concept[];
  advanced: Concept[];
}

export interface ConceptsRetrieve {
  mainTopic: string;
  context: string[];
}
