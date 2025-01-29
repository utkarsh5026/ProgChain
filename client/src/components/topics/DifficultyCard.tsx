import React from "react";
import { motion } from "framer-motion";
import type { Concept } from "@/store/topics/types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface DifficultyCardProps {
  difficulty: string;
  conceptList: Concept[];
  onConceptClick: (concept: Concept) => void;
}

const difficultyColors = {
  beginner: "#4CAF50",
  intermediate: "#2196F3",
  advanced: "#F44336",
};

/**
 * DifficultyCard component displays a card with a list of concepts for a specific difficulty level.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.difficulty - The difficulty level of the concepts (e.g., "beginner", "intermediate", "advanced").
 * @param {Concept[]} props.conceptList - An array of Concept objects to be displayed in the card.
 * @param {function} props.onConceptClick - Callback function to be called when a concept is clicked.
 * @returns {React.ReactElement} A card component displaying concepts for a specific difficulty level.
 */
const DifficultyCard: React.FC<DifficultyCardProps> = ({
  difficulty,
  conceptList,
  onConceptClick,
}) => {
  return (
    <Card className="w-[400px] bg-zinc-800 text-white">
      <CardHeader
        className="bg-zinc-800 border-b-2"
        style={{
          borderColor:
            difficultyColors[difficulty as keyof typeof difficultyColors],
        }}
      >
        <h3
          className="capitalize m-0"
          style={{
            color:
              difficultyColors[difficulty as keyof typeof difficultyColors],
          }}
        >
          {difficulty}
        </h3>
      </CardHeader>
      <CardContent className="p-3">
        <div className="flex flex-col gap-2">
          {conceptList.map((item: Concept, idx) => (
            <motion.div
              key={item.topic}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <div
                onClick={() => onConceptClick(item)}
                className="flex items-center gap-3 cursor-pointer p-2 hover:bg-zinc-700 rounded-md transition-colors"
              >
                <span className="text-xl">{item.emoji}</span>
                <span className="font-thin">{item.topic}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DifficultyCard;
