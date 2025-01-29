import React, { useState } from "react";
import InterviewModal from "./InterviewModal";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useInterviewQuestions } from "../../store/interview/hooks";

const Interview: React.FC = () => {
  const { topicQuestions } = useInterviewQuestions();
  const [isModalVisible, setIsModalVisible] = useState(true);
  return (
    <div
      style={{
        display: "flex",
        border: "1px solid red",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Button
        type="primary"
        size="large"
        onClick={() => setIsModalVisible(true)}
        icon={<PlusOutlined />}
      >
        Generate Interview Questions
      </Button>
      <InterviewModal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default Interview;
