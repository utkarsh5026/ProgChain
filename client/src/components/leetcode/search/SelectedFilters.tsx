import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { X } from "lucide-react";

type Difficulty = "Easy" | "Medium" | "Hard";

type SelectedFilters = {
  difficulties: Difficulty[];
  tags: string[];
  acceptanceRate: {
    min: number;
    max: number;
  };
};

interface SelectedFiltersProps {
  selectedFilters: SelectedFilters;
  onClear: () => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onTagChange: (tag: string) => void;
}

const difficultyStyles = {
  Easy: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Hard: "bg-red-100 text-red-800",
};

const SelectedFilters: React.FC<SelectedFiltersProps> = ({
  selectedFilters,
  onClear,
  onDifficultyChange,
  onTagChange,
}) => {
  return (
    <div>
      {(selectedFilters.difficulties.length > 0 ||
        selectedFilters.tags.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex flex-wrap gap-2"
        >
          {selectedFilters.difficulties.map((difficulty) => (
            <Badge
              key={difficulty}
              variant="secondary"
              className={`cursor-pointer ${difficultyStyles[difficulty]}`}
              onClick={() => onDifficultyChange(difficulty)}
            >
              {difficulty}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          {selectedFilters.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="cursor-pointer"
              onClick={() => onTagChange(tag)}
            >
              {tag}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          {(selectedFilters.difficulties.length > 0 ||
            selectedFilters.tags.length > 0) && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              className="h-6 px-2 text-sm border border-red-500 bg-red-950 text-white rounded-md"
            >
              Clear all
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SelectedFilters;
