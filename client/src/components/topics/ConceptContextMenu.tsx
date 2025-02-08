import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Compass, BookOpen, BrainCircuit, GitFork } from "lucide-react";
import useExplore from "@/store/explore/hooks/use-explore";
import { useNavigate } from "react-router-dom";

interface ConceptContextMenuProps {
  topicName: string;
  children: React.ReactNode;
  topicDescription: string;
}

const ConceptContextMenu: React.FC<ConceptContextMenuProps> = ({
  topicName,
  children,
  topicDescription,
}) => {
  const { fetchQuestion } = useExplore();
  const navigate = useNavigate();

  const handleExploreTopic = () => {
    const topicQuestion = `
    Topic: ${topicName}
    Description: ${topicDescription}
    `;
    fetchQuestion(topicQuestion, "gpt-4o-mini");
    navigate("/explore");
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64 p-2">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground mb-2 border-b">
          {topicName}
        </div>
        <ContextMenuItem
          className="flex items-center gap-2 cursor-pointer px-2 py-1.5 focus:bg-accent focus:text-accent-foreground"
          onClick={handleExploreTopic}
        >
          <Compass className="w-4 h-4" />
          <span>Explore Topic</span>
        </ContextMenuItem>
        <ContextMenuItem className="flex items-center gap-2 cursor-pointer px-2 py-1.5 focus:bg-accent focus:text-accent-foreground">
          <BookOpen className="w-4 h-4" />
          <span>Interview Preparation</span>
        </ContextMenuItem>
        <ContextMenuItem className="flex items-center gap-2 cursor-pointer px-2 py-1.5 focus:bg-accent focus:text-accent-foreground">
          <BrainCircuit className="w-4 h-4" />
          <span>Take Quiz</span>
        </ContextMenuItem>
        <ContextMenuItem className="flex items-center gap-2 cursor-pointer px-2 py-1.5 focus:bg-accent focus:text-accent-foreground">
          <GitFork className="w-4 h-4" />
          <span>View Flow Chart</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ConceptContextMenu;
