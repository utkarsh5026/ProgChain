import React from "react";
import {
  CircleDot,
  PanelRightClose,
  PanelRightOpen,
  RefreshCw,
  Home,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const truncateText = (text: string, maxLength: number = 30) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

const MinimapItem: React.FC<{
  text: string;
  isActive: boolean;
  isFirst: boolean;
  onClick: () => void;
  index: number;
}> = ({ text, isActive, isFirst, onClick, index }) => {
  return (
    <div className="relative">
      {!isFirst && (
        <div className="absolute -top-2 left-2 h-4 w-px bg-gradient-to-b from-zinc-800 to-primary/20" />
      )}
      <div
        className={`
          relative group flex items-center gap-2 p-2 rounded-lg transition-all duration-200 cursor-pointer
          ${isActive ? "bg-primary/20" : "hover:bg-zinc-800/50"}
        `}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="relative flex-shrink-0">
          <CircleDot
            className={`h-4 w-4 ${
              isActive
                ? "text-primary"
                : "text-zinc-400 group-hover:text-zinc-300"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-zinc-400 mb-0.5">
            Question {index + 1}
          </div>
          <div
            className={`text-sm truncate ${
              isActive
                ? "text-primary"
                : "text-zinc-400 group-hover:text-zinc-300"
            }`}
          >
            {truncateText(text)}
          </div>
        </div>
      </div>
    </div>
  );
};

const drawerVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    x: "100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

const MinimapDrawer: React.FC<{
  isOpen: boolean;
  onToggle: () => void;
  currentPath: string[];
  activeQuestion: string | null;
  onQuestionClick: (id: string) => void;
  getQuestion: (id: string) => any;
  onReset: () => void;
  isResetting: boolean;
}> = ({
  isOpen,
  onToggle,
  currentPath,
  activeQuestion,
  onQuestionClick,
  getQuestion,
  onReset,
  isResetting,
}) => {
  const toggleButtonVariants = {
    open: { x: 0 },
    closed: { x: -10 },
  };

  return (
    <div className="fixed right-0 top-6 bottom-32 z-20 flex items-start">
      {/* Toggle Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial="closed"
              animate={isOpen ? "open" : "closed"}
              variants={toggleButtonVariants}
              className="mr-2"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={onToggle}
                className="bg-zinc-900/80 border-zinc-800 backdrop-blur-sm shadow-xl"
              >
                {isOpen ? (
                  <PanelRightClose className="h-4 w-4" />
                ) : (
                  <PanelRightOpen className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{isOpen ? "Hide minimap" : "Show minimap"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Minimap Drawer */}
      <motion.div
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={drawerVariants}
        className="w-72"
      >
        <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur-sm shadow-xl h-full overflow-hidden flex flex-col">
          <CardContent className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onReset}
                    disabled={isResetting}
                    className="text-zinc-400 hover:text-white"
                  >
                    {isResetting ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Home className="h-4 w-4" />
                    )}
                  </Button>
                  <span className="text-sm font-medium text-zinc-400">
                    Learning Path
                  </span>
                </div>
                <span className="text-xs text-zinc-500">
                  {currentPath.length} questions
                </span>
              </div>

              <div className="flex flex-col gap-1">
                {currentPath.map((id, index) => {
                  const question = getQuestion(id);
                  return (
                    question && (
                      <MinimapItem
                        key={id}
                        text={question.text}
                        isActive={activeQuestion === id}
                        isFirst={index === 0}
                        onClick={() => onQuestionClick(id)}
                        index={index}
                      />
                    )
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MinimapDrawer;
