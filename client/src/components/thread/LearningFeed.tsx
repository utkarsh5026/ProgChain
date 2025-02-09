import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import { Button } from "../ui/button";
import LearningContentDisplay from "./ThreadContentItem";
import useThreads from "@/store/threads/hook";
import SideNavigationButton from "./SideNavigationButton";
import { loading } from "@/base";
import { useToast } from "@/hooks/use-toast";
import ThreadMessages from "./ThreadMessages";
import ProgressIndicator from "./ProgressIndicator";

const LearningFeed: React.FC = () => {
  const { fetchMoreContent, thread, generating } = useThreads();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { toast } = useToast();
  const [isExploring, setIsExploring] = useState(false);

  const content = useMemo(() => thread?.content ?? [], [thread]);
  const handlePrevious = useCallback(() => {
    if (activeIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setActiveIndex((prev) => prev - 1);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  }, [activeIndex, isTransitioning]);

  const handleNext = useCallback(() => {
    if (activeIndex < content.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setActiveIndex((prev) => prev + 1);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  }, [activeIndex, content.length, isTransitioning]);

  useEffect(() => {
    if (!thread) return;
    if (activeIndex === content.length - 2 && !loading(generating)) {
      try {
        fetchMoreContent({});
      } catch (error) {
        toast({
          title: "Error fetching more content",
          description: generating.error,
          variant: "destructive",
        });
      }
    }
  }, [
    thread,
    fetchMoreContent,
    activeIndex,
    generating,
    content.length,
    toast,
  ]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        console.log("ArrowLeft");
        handlePrevious();
      } else if (event.key === "ArrowRight") {
        console.log("ArrowRight");
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [activeIndex, handlePrevious, handleNext]);

  const handleExplore = useCallback(() => {
    setIsExploring(true);
  }, []);

  return (
    <div className="w-full relative flex justify-center items-center">
      <TooltipProvider>
        <div className="fixed top-0 right-0 p-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsExploring((prev) => !prev)}
                className={`rounded-full border-2 ${
                  isExploring ? "border-red-800" : "border-green-800"
                }`}
              >
                {isExploring ? (
                  <X className="text-red-500" />
                ) : (
                  <Sparkles className="text-green-500" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs dark:text-white dark:bg-black">
              {isExploring
                ? "Close Exploration"
                : "Explore the current content"}
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {!isExploring && (
        <SideNavigationButton
          direction="left"
          onClick={handlePrevious}
          disabled={activeIndex === 0}
        >
          <ChevronLeft
            className="w-8 h-8 transition-transform duration-300 
          group-hover:-translate-x-1 group-hover:scale-110"
          />
        </SideNavigationButton>
      )}
      <div className="flex items-center justify-center">
        {isExploring ? (
          <ThreadMessages
            threadContent={content[activeIndex]}
            exploring={isExploring}
          />
        ) : (
          <LearningContentDisplay
            content={content[activeIndex]}
            onExplore={handleExplore}
            isExploring={isExploring}
          />
        )}
      </div>

      {!isExploring && (
        <SideNavigationButton
          direction="right"
          onClick={handleNext}
          disabled={activeIndex === content.length - 1}
          loading={loading(generating)}
        >
          <ChevronRight
            className="w-8 h-8 transition-transform duration-300 
            group-hover:translate-x-1 group-hover:scale-110"
          />
        </SideNavigationButton>
      )}
      {!isExploring && (
        <ProgressIndicator
          current={activeIndex}
          total={content.length}
          onItemSelect={setActiveIndex}
        />
      )}
    </div>
  );
};

export default LearningFeed;
