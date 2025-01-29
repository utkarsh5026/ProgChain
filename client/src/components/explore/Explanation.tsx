import React from "react";
import Markdown from "@/components/utils/Markdown";
import useExplore from "@/store/explore/hook";
import { motion } from "framer-motion";
import ParticleAnimation from "@/components/utils/ParticleAnimation";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface ExplanationProps {
  questionID: string;
}

/**
 * Explanation Component
 *
 * This component renders an explanation card for a given programming question.
 * It displays the question text, explanation (if available), and related questions.
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} props.questionID - The ID of the question to display
 * @returns {React.ReactElement|null} The rendered Explanation component or null if question is not found
 */
const Explanation: React.FC<ExplanationProps> = ({ questionID }) => {
  const { getQuestion, fetchQuestion } = useExplore();
  const question = getQuestion(questionID);

  if (question === null) return null;

  const { text, explanation, relatedQuestionIDs } = question;

  const handleClick = async (question: string) => {
    await fetchQuestion(question);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold">{text}</h1>
        <Separator className="my-4" />
        {!explanation ? (
          <ParticleAnimation width="100%" height={200} particleCount={100} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="mb-5 font-light text-xl"
          >
            <Markdown content={explanation} />
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 w-full p-4 hover:bg-accent rounded-lg">
                Related Questions
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ul className="divide-y">
                  {relatedQuestionIDs.map((item) => (
                    <li
                      key={item}
                      onClick={() => handleClick(item)}
                      className="p-4 hover:bg-accent cursor-pointer"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default Explanation;
