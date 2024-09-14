import React, { useState } from "react";
import {
  Modal,
  Input,
  Button,
  Form,
  Select,
  message,
  Slider,
  ModalProps,
} from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import type { QuizSetupValues, Level } from "../../store/quiz/type";
import useQuiz from "../../store/quiz/hook";

interface QuizSetupModalProps {
  visible: boolean;
  extraProps?: ModalProps;
}

const difficultyLevels: Level[] = ["easy", "medium", "hard"];

const difficultyColors = {
  easy: "green",
  medium: "orange",
  hard: "red",
};

/**
 * Modal component for setting up a new quiz.
 * Allows users to specify topic, difficulty levels, and additional instructions.
 */
const QuizSetupModal: React.FC<QuizSetupModalProps> = ({
  visible,
  extraProps,
}) => {
  const [form] = Form.useForm();
  const { fecthQuiz } = useQuiz();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: QuizSetupValues) => {
    console.log(values);
    setLoading(true);

    try {
      await fecthQuiz(values);
    } catch (error) {
      console.log(error + "564847");
      message.error("Failed to generate quiz 📞📞📞");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Quiz Setup"
      open={visible}
      footer={null}
      closable={false}
      {...extraProps}
    >
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
              label: level.charAt(0).toUpperCase() + level.slice(1),
              style: { color: difficultyColors[level] },
            }))}
          />
        </Form.Item>
        <Form.Item name="instructions" label="Additional Instructions">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="count"
          label="Number of Questions"
          rules={[
            {
              required: true,
              message: "Please select the number of questions",
            },
          ]}
          initialValue={10}
        >
          <Slider
            min={5}
            max={30}
            step={1}
            tooltip={{ formatter: (value) => `${value} questions` }}
          />
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
