/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from "react";
import { Modal, Input, Button, ModalProps, Form } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useInterviewQuestions } from "../../store/interview/hooks";

const { Item } = Form;

interface InterviewModalProps {
  open: boolean;
  onCancel: () => void;
  extra?: ModalProps;
}

const InterviewModal: React.FC<InterviewModalProps> = ({
  open,
  onCancel,
  extra,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { fetchQuestions } = useInterviewQuestions();

  const handleSubmit = useCallback(
    async (values: any) => {
      setLoading(true);
      try {
        const data = {
          topic: values.topic,
          extraInstructions: values.instructions,
          context: "",
        };
        await fetchQuestions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [fetchQuestions]
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <Modal
          open={open}
          onCancel={onCancel}
          {...extra}
          title="Generate Interview Questions"
          footer={null}
        >
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Item
              name="topic"
              rules={[
                { required: true, message: "Please enter the interview topic" },
              ]}
              label="Interview Topic"
              style={{ marginBottom: "30px" }}
            >
              <Input
                placeholder="Enter the interview topic like 'React'"
                allowClear
              />
            </Item>
            <Item
              name="instructions"
              label="Extra Instructions (Optional)"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input.TextArea placeholder="Enter any extra instructions like 'Be specific to the topic'" />
            </Item>
            <Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlayCircleOutlined />}
                loading={loading}
              >
                Start Interview
              </Button>
            </Item>
          </Form>
        </Modal>
      </motion.div>
    </AnimatePresence>
  );
};

export default InterviewModal;
