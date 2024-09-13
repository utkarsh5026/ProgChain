import { createBrowserRouter } from "react-router-dom";
import { Layout as AntLayout } from "antd";
import { Outlet } from "react-router-dom";
import ProgrammingQAComponent from "./components/interview/InterviewQA";
import TopicChain from "./components/topics/TopicChain";
import Sidebar from "./components/home/Sidebar";
import Quiz from "./components/quiz/Quiz";
const { Content } = AntLayout;

const Layout: React.FC = () => {
  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <AntLayout>
        <Content style={{ margin: "24px 16px", padding: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

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
