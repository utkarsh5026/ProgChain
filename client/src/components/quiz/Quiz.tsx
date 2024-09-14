import React, { useEffect } from "react";
import { Space, Dropdown, Button } from "antd";
import {
  DownloadOutlined,
  FileExcelFilled,
  CodepenOutlined,
  FilePdfFilled,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import QuizSetupModal from "./QuizSetupModal";
import type { QuizSetupValues } from "../../store/quiz/type";
import useQuiz from "../../store/quiz/hook";
import QuizContent from "./QuizContent";
import {
  downloadAsXLSX,
  downloadAsJSON,
  downloadAsPdf,
} from "../../store/quiz/file";

const Quiz: React.FC = () => {
  const { quiz, fecthQuiz } = useQuiz();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as QuizSetupValues | null;
    if (state) {
      fecthQuiz(state);
    }
  }, [location, fecthQuiz]);

  if (!quiz) return <QuizSetupModal visible={quiz === null} />;

  return (
    <Space direction="vertical" size="large" style={{ width: "70vw" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Dropdown
          menu={{
            items: [
              {
                key: "download_excel",
                label: "Download Questions as Excel",
                icon: <FileExcelFilled />,
                onClick: () => downloadAsXLSX(quiz.questions),
              },
              {
                key: "download_json",
                label: "Download Questions as JSON",
                icon: <CodepenOutlined />,
                onClick: () => downloadAsJSON(quiz.questions),
              },
              {
                key: "download_pdf",
                label: "Download Questions as PDF",
                icon: <FilePdfFilled />,
                onClick: () => downloadAsPdf(quiz.questions),
              },
            ],
          }}
        >
          <Button icon={<DownloadOutlined />}>Download Questions</Button>
        </Dropdown>
      </div>
      {quiz.instructions && <p>Additional Instructions: {quiz.instructions}</p>}
      <QuizContent questions={quiz.questions} onAnswerChange={() => {}} />
    </Space>
  );
};

export default Quiz;
