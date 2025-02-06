import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LearningContentDisplay from "./ThreadContentItem";
import useThreads from "@/store/threads/hook";
import SideNavigationButton from "./SideNavigationButton";
import { loading } from "@/base";
import ProgressIndicator from "./ProgressIndicator";
import ChatInput from "../explore/ChatInput";
import { useToast } from "@/hooks/use-toast";

const LearningFeed: React.FC = () => {
  const { fetchMoreContent, thread, generating } = useThreads();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { toast } = useToast();
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null
  );
  const content = useMemo(() => thread?.content ?? [], [thread]);

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
  }, [thread, fetchMoreContent, activeIndex, generating]);

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
  }, [activeIndex]);

  const handlePrevious = useCallback(() => {
    if (activeIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setSlideDirection("right");
      setActiveIndex((prev) => prev - 1);
      setTimeout(() => {
        setIsTransitioning(false);
        setSlideDirection(null);
      }, 300);
    }
  }, [activeIndex, isTransitioning]);

  const handleNext = useCallback(() => {
    if (activeIndex < content.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setSlideDirection("left");
      setActiveIndex((prev) => prev + 1);
      setTimeout(() => {
        setIsTransitioning(false);
        setSlideDirection(null);
      }, 300);
    }
  }, [activeIndex, content.length, isTransitioning]);

  return (
    <div className="w-full relative bg-gradient-to-b from-zinc-950 to-zinc-900 flex justify-center">
      <div className="flex items-center justify-center px-32">
        <div
          className={`transform transition-all duration-300 ease-in-out
            ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}
            ${slideDirection === "left" ? "-translate-x-4" : ""}
            ${slideDirection === "right" ? "translate-x-4" : ""}`}
        >
          <LearningContentDisplay content={content[activeIndex]} />
        </div>
      </div>
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
      {/* Enhanced progress indicator */}
      <ProgressIndicator
        current={activeIndex}
        total={content.length}
        onItemSelect={(index) => setActiveIndex(index)}
      />
    </div>
  );
};

export default LearningFeed;
