import React from "react";
import { List, Typography, Collapse, Card, Divider } from "antd";
import Markdown from "../utils/Markdown";
import useExplore from "../../store/explore/hook";
import { motion } from "framer-motion";
import ParticleAnimation from "../utils/ParticleAnimation";

const { Title } = Typography;

interface ExplanationProps {
  questionID: string;
}

const Explanation: React.FC<ExplanationProps> = ({ questionID }) => {
  const { getQuestion, fetchQuestion } = useExplore();
  const question = getQuestion(questionID);

  if (question === null) return null;

  const { text, explanation, relatedQuestionIDs } = question;

  const handleClick = async (question: string) => {
    await fetchQuestion(question);
  };

  return (
    <Card style={{ marginBottom: "16px", padding: "24px" }}>
      <Title level={1}>{text}</Title>
      <Divider />
      {!explanation ? (
        <ParticleAnimation width="100%" height={200} particleCount={100} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{ marginBottom: "20px", fontWeight: "100", fontSize: "20px" }}
        >
          <Markdown content={explanation} />
          <Collapse>
            <Collapse.Panel header="Related Questions" key="1">
              <List
                size="large"
                bordered
                dataSource={relatedQuestionIDs}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => handleClick(item)}
                  >
                    {item}
                  </List.Item>
                )}
              />
            </Collapse.Panel>
          </Collapse>
        </motion.div>
      )}
    </Card>
  );
};

export default Explanation;
