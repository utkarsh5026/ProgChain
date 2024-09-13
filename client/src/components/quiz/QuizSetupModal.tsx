import React, { useState } from "react";
import { Modal, Input, Button, Form, Select } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";

interface QuizSetupModalProps {
  visible: boolean;
}

export interface QuizSetupValues {
  topic: string;
  levels: string[];
  instructions?: string;
}

const difficultyLevels = ["Easy", "Medium", "Hard"];

/**
 * Modal component for setting up a new quiz.
 * Allows users to specify topic, difficulty levels, and additional instructions.
 */
const QuizSetupModal: React.FC<QuizSetupModalProps> = ({ visible }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: QuizSetupValues) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    console.log(values);
  };

  return (
    <Modal title="Quiz Setup" open={visible} footer={null} closable={false}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          name="topic"
          label="Topic"
          rules={[{ required: true, message: "Please enter a topic" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="levels"
          label="Difficulty Levels"
          rules={[
            { required: true, message: "Please select at least one level" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select difficulty levels"
            options={difficultyLevels.map((level) => ({
              value: level,
              label: level,
            }))}
          />
        </Form.Item>
        <Form.Item name="instructions" label="Additional Instructions">
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            htmlType="submit"
            loading={loading}
            // disabled={
            //   !form.isFieldsTouched(true) ||
            //   !!form.getFieldsError().filter(({ errors }) => errors.length)
            //     .length
            // }
          >
            Start Quiz
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuizSetupModal;
