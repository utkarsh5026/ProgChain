export interface Question {
  id: string;
  text: string;
  explanation: string;
  relatedQuestionIDs: string[];
  followUpQuestionIDs: string[];
}

export interface ResponseQuestion {
  explanation: string;
  follow_up_questions: string[];
}
