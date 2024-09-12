import ProgrammingQAComponent from "./components/interview/InterviewQA";
import "./App.css";

const questions = [
  {
    question:
      "What are the main differences between a list and a tuple in Python?",
    type: "open-ended",
    difficulty: "easy",
    assessment:
      "This question assesses the candidate's understanding of basic Python data structures and their properties.",
  },
  {
    question:
      "Which of the following data structures is best suited for implementing a LIFO (Last In, First Out) system?",
    type: "multiple-choice",
    options: ["List", "Dictionary", "Set", "Queue"],
    difficulty: "easy",
    assessment:
      "This question checks the candidate's theoretical knowledge of data structures and their typical use cases.",
  },
  {
    question:
      "Write a Python function to merge two sorted lists into a single sorted list.",
    type: "coding-challenge",
    difficulty: "medium",
    assessment:
      "This question evaluates the candidate's ability to work with lists and implement algorithms to merge and sort data.",
  },
];

function App() {
  return <ProgrammingQAComponent questions={questions} />;
}

export default App;
