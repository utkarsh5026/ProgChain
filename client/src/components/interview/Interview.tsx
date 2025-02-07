import React, { useState } from "react";
import InterviewModal from "./InterviewForm";
import { useInterviewQuestions } from "../../store/interview/hooks";
import ProgrammingQAComponent from "./InterviewQA";
import { DifficultyMap } from "@/store/interview/type";

const sampleQuestions: DifficultyMap = new Map([
  [
    "Beginner",
    [
      {
        id: 1,
        question: "What is the output of console.log(typeof null)?",
        type: "multiple-choice",
        difficulty: "Beginner",
        assessment: "Tests knowledge of JavaScript type system quirks",
        options: ["object", "null", "undefined", "number"],
      },
    ],
  ],
  [
    "Intermediate",
    [
      {
        id: 2,
        question:
          "Write a function that reverses a string without using the built-in reverse() method.",
        type: "coding-challenge",
        difficulty: "medium",
        assessment: "Tests problem-solving skills and string manipulation",
      },
      {
        id: 3,
        question:
          "Explain the concept of closures in JavaScript and provide a real-world use case.",
        type: "open-ended",
        difficulty: "medium",
        assessment: "Tests understanding of advanced JavaScript concepts",
      },
    ],
  ],
  [
    "Advanced",
    [
      {
        id: 4,
        question:
          "A user reports that your web application is slow to load. Walk through your approach to investigating and resolving this issue.",
        type: "scenario-based",
        difficulty: "hard",
        assessment:
          "Tests problem-solving approach and technical debugging skills",
      },
    ],
  ],
]);

const Interview: React.FC = () => {
  const { topicQuestions, currentTopic } = useInterviewQuestions();
  const [isModalVisible, setIsModalVisible] = useState(true);

  // if (!currentTopic) return <InterviewModal />;
  return (
    <div className="flex h-full p-2 border border-border">
      <ProgrammingQAComponent questions={sampleQuestions} />
      {/* <InterviewModal onSubmit={() => {}} /> */}
    </div>
  );
};

export default Interview;
