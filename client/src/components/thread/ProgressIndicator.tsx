import React from "react";

interface ProgressIndicatorProps {
  current: number;
  total: number;
  onItemSelect: (index: number) => void;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  current,
  total,
  onItemSelect,
}) => (
  <div className="fixed bottom-0 left-0 right-0 p-4 z-40 bg-gradient-to-t from-zinc-950/80 to-transparent">
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1 items-center">
        <div className="flex gap-1 items-center">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              onClick={() => onItemSelect(i)}
              className={`h-1 rounded-full transition-all cursor-pointer duration-300 ${
                i === current
                  ? "w-8 bg-indigo-500"
                  : i < current
                  ? "w-4 bg-zinc-600"
                  : "w-4 bg-zinc-800"
              }`}
            />
          ))}
        </div>
        <span className="text-zinc-400 text-sm font-medium">
          {current + 1} of {total}
        </span>
      </div>
    </div>
  </div>
);

export default ProgressIndicator;
