import React, { useState, useRef, useEffect } from "react";
import OutlineViewer, { OutlineItem } from "./OutlineViewer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface OutlineDropdownProps {
  outline: OutlineItem[];
  selectedOutlines: OutlineItem[];
  onSelect: (item: OutlineItem) => void;
  onClear: () => void;
}

const OutlineDropdown: React.FC<OutlineDropdownProps> = ({
  outline,
  selectedOutlines,
  onSelect,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle selection when an outline item is clicked.
  // Note: We no longer auto-close the dropdown so that multiple selections can be made.
  const handleItemClick = (item: OutlineItem) => {
    onSelect(item);
  };

  // Display text based on the selected items.
  const displayText = "Select Sections";

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Dropdown button with dark theme styling */}
      <button
        className="px-4 py-2 rounded flex items-center gap-2 bg-gray-800 text-gray-100 hover:bg-gray-700 transition-colors w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex-grow">{displayText}</span>
        <svg
          className={`w-4 h-4 transition-transform text-gray-100 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 border border-gray-700 shadow-lg z-10 max-h-80 overflow-auto bg-gray-800 text-gray-100 rounded-lg">
          <OutlineViewer outline={outline} onItemClick={handleItemClick} />
        </div>
      )}

      {selectedOutlines.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedOutlines.map((item) => {
            const content = item.path ? item.path : item.title;
            return (
              <TooltipProvider key={content}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-flex items-center bg-gray-900 text-gray-200 rounded-full px-2 py-1 w-32 hover:opacity-80">
                      <span className="flex-grow text-sm truncate whitespace-nowrap">
                        {content}
                      </span>
                      <button
                        onClick={() => onSelect(item)}
                        className="ml-1 text-xs text-red-400 hover:text-red-600"
                      >
                        &times;
                      </button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 text-gray-200 text-xs">
                    {content}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
          <button
            onClick={onClear}
            className="inline-flex items-center bg-red-700 text-gray-100 px-2 py-1 rounded-full text-xs hover:bg-red-600 focus:outline-none"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default OutlineDropdown;
