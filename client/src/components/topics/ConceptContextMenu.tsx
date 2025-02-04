import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Compass, BookOpen, BrainCircuit, GitFork } from "lucide-react";

interface ConceptContextMenuProps {
  topicName: string;
  children: React.ReactNode;
}

const ConceptContextMenu: React.FC<ConceptContextMenuProps> = ({
  topicName,
  children,
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64 p-2">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground mb-2 border-b">
          {topicName}
        </div>
        <ContextMenuItem className="flex items-center gap-2 cursor-pointer px-2 py-1.5 focus:bg-accent focus:text-accent-foreground">
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
