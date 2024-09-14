import React, { useMemo } from "react";
import { Modal, Statistic, Card, Row, Col, Space, Typography } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import type { Question } from "../../store/quiz/type";

const { Title } = Typography;

interface SubmitModalProps {
  visible: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  questions: Question[];
}

interface StatisticWithIconProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
}
const StatisticWithIcon: React.FC<StatisticWithIconProps> = ({
  icon,
  title,
  value,
  color,
}): React.ReactElement => (
  <Statistic
    title={
      <Space>
        {icon} {title}
      </Space>
    }
    value={value}
    valueStyle={{ color }}
  />
);

const SubmitModal: React.FC<SubmitModalProps> = ({
  visible,
  onSubmit,
  onCancel,
  questions,
}) => {
  const [completed, skipped, remaining] = useMemo(
    () => filterQuestionsByCategory(questions),
    [questions]
  );

  return (
    <Modal
      title="Submit Quiz"
      open={visible}
      onOk={onSubmit}
      onCancel={onCancel}
    >
      <Title level={5}>Are you sure you want to submit the quiz? 🤔</Title>
      <Card>
        <Row gutter={16}>
          <Col span={8}>
            <StatisticWithIcon
              icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              title="Completed"
              value={completed}
              color="#52c41a"
            />
          </Col>
          <Col span={8}>
            <StatisticWithIcon
              icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
              title="Skipped"
              value={skipped}
              color="#ff4d4f"
            />
          </Col>
          <Col span={8}>
            <StatisticWithIcon
              icon={<QuestionCircleOutlined style={{ color: "#1890ff" }} />}
              title="Remaining"
              value={remaining}
              color="#1890ff"
            />
          </Col>
        </Row>
      </Card>
    </Modal>
  );
};

const filterQuestionsByCategory = (questions: Question[]) => {
  const completed = questions.filter((q) => q.status === "completed").length;
  const skipped = questions.filter((q) => q.status === "skip").length;
  const remaining = questions.length - completed - skipped;
  return [completed, skipped, remaining];
};

export default SubmitModal;
