import { createBrowserRouter } from "react-router-dom";
import ProgrammingQAComponent from "./components/interview/InterviewQA";
import TopicChain from "./components/topics/TopicChain";
import Quiz from "./components/quiz/Quiz";
import Layout from "./components/home/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "topics",
        element: <TopicChain />,
      },
      {
        path: "interview",
        element: <ProgrammingQAComponent />,
      },
      {
        path: "quiz",
        element: <Quiz />,
      },
    ],
  },
]);

export default router;
