import { Button } from "../ui/button";
import React from "react";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

interface SideNavigationButtonProps {
  direction: "left" | "right";
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  loading?: boolean;
}

const SideNavigationButton: React.FC<SideNavigationButtonProps> = ({
  direction,
  onClick,
  disabled,
  children,
  loading,
}) => {
  return (
    <Button
      variant="ghost"
      size="lg"
      style={{
        [direction === "left" ? "left" : "right"]: "2rem",
      }}
      className={`
        flex items-center justify-center
        h-48 w-20 rounded-2xl
        border border-zinc-700/20
        text-zinc-200
        shadow-lg
        transition-all duration-200
        hover:scale-105 hover:bg-zinc-800/50
        disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100
        disabled:hover:bg-transparent
      `}
      onClick={onClick}
      disabled={disabled || loading}
    >
      <div className="relative z-10 flex items-center gap-1">
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <>
            {direction === "left" && (
              <ChevronLeft className="w-6 h-6 text-zinc-300/90" />
            )}
            <span className="font-medium tracking-wide text-sm">
              {children}
            </span>
            {direction === "right" && (
              <ChevronRight className="w-6 h-6 text-zinc-300/90" />
            )}
          </>
        )}
      </div>
    </Button>
  );
};

export default SideNavigationButton;
