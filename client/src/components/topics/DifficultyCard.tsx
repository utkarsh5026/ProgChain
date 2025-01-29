import React from "react";
import { motion } from "framer-motion";
import type { Concept } from "@/store/topics/types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface DifficultyCardProps {
  difficulty: string;
  conceptList: Concept[];
  onConceptClick: (concept: Concept) => void;
}

const difficultyConfig = {
  beginner: {
    color: "#4CAF50",
    gradient: "from-green-500/10 to-green-500/5",
    badge: "bg-green-500/20 text-green-500",
    icon: "🌱",
  },
  intermediate: {
    color: "#2196F3",
    gradient: "from-blue-500/10 to-blue-500/5",
    badge: "bg-blue-500/20 text-blue-500",
    icon: "⚡",
  },
  advanced: {
    color: "#F44336",
    gradient: "from-red-500/10 to-red-500/5",
    badge: "bg-red-500/20 text-red-500",
    icon: "🔥",
  },
};

const DifficultyCard: React.FC<DifficultyCardProps> = ({
  difficulty,
  conceptList,
  onConceptClick,
}) => {
  const config = difficultyConfig[difficulty as keyof typeof difficultyConfig];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const hoverVariants = {
    hover: {
      scale: 1.02,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-md"
    >
      <Card className="bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden">
        <CardHeader
          className={`bg-gradient-to-br ${config.gradient} p-6 border-b border-zinc-800`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{config.icon}</span>
              <div className="space-y-1">
                <h3
                  className="text-xl font-semibold capitalize m-0"
                  style={{ color: config.color }}
                >
                  {difficulty}
                </h3>
                <p className="text-sm text-zinc-400">
                  {conceptList.length} concepts
                </p>
              </div>
            </div>
            <Badge className={`${config.badge} px-3 py-1`}>
              {difficulty.charAt(0).toUpperCase()}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <motion.div
            className="flex flex-col gap-2"
            variants={containerVariants}
          >
            {conceptList.map((item: Concept, idx) => (
              <motion.div
                key={item.topic}
                variants={itemVariants}
                whileHover="hover"
                custom={idx}
              >
                <motion.div
                  variants={hoverVariants}
                  onClick={() => onConceptClick(item)}
                  className="flex items-center justify-between p-3 rounded-lg cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="font-medium text-zinc-300 group-hover:text-white transition-colors">
                      {item.topic}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DifficultyCard;
