import { createBrowserRouter } from "react-router-dom";
import Interview from "./components/interview/Interview";
import TopicChain from "./components/topics/TopicChain";
import Quiz from "./components/quiz/Quiz";
import Layout from "./components/home/Layout";
import FlowChart from "./components/flow/FlowChart";
import Explore from "./components/explore/Explore";

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
        element: <Interview />,
      },
      {
        path: "quiz",
        element: <Quiz />,
      },
      {
        path: "flow",
        element: <FlowChart />,
      },
      {
        path: "explore",
        element: <Explore />,
      },
    ],
  },
]);

export default router;
