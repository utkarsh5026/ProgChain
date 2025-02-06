import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Home, ChevronLeft, ChevronRight } from "lucide-react";
import LearningContentDisplay from "./ThreadContentItem";
import useThreads from "@/store/threads/hook";
import SideNavigationButton from "./SideNavigationButton";
import { loading } from "@/base";
import ProgressIndicator from "./ProgressIndicator";
import { useToast } from "@/hooks/use-toast";

const NavigationHeader = ({
  onNavigateHome,
}: {
  onNavigateHome: () => void;
}) => (
  <div className="fixed top-0 left-0 right-0 p-4 z-50 bg-gradient-to-b from-zinc-950/80 to-transparent">
    <Button
      variant="ghost"
      size="sm"
      className="bg-zinc-900/90 border border-zinc-700/50 backdrop-blur-xl
        text-zinc-300 hover:text-white hover:bg-zinc-800/90 transition-all
        duration-300 shadow-lg shadow-zinc-950/20 hover:shadow-xl
        hover:shadow-zinc-950/30 hover:border-zinc-600/50"
      onClick={onNavigateHome}
    >
      <Home className="w-4 h-4 mr-2" />
      Back to Home
    </Button>
  </div>
);

const LearningFeed: React.FC = () => {
  const { fetchMoreContent, thread, reset, generating } = useThreads();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { toast } = useToast();
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null
  );
  const content = useMemo(() => thread?.content ?? [], [thread]);

  console.log(activeIndex);

  useEffect(() => {
    if (!thread) return;
    if (activeIndex === content.length - 2 && !loading(generating)) {
      console.log("Fetching more content");
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
    <div className="w-full relative bg-gradient-to-b from-zinc-950 to-zinc-900">
      <NavigationHeader onNavigateHome={reset} />
      wh
      {/* Enhanced content area with slide transitions */}
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
