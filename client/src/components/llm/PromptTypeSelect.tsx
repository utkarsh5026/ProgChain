import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import { BookOpen } from "lucide-react";

interface PromptType {
  id: string;
  name: string;
  description: string;
  placeholder: string;
}

const promptTypes: PromptType[] = [
  {
    id: "teacher",
    name: "Step-by-Step Guide",
    description: "Detailed explanations broken down into steps",
    placeholder: "Ask for a detailed explanation of any concept...",
  },
  {
    id: "interviewer",
    name: "Interview Prep",
    description: "Technical interview preparation and practice",
    placeholder: "Practice interview questions or coding challenges...",
  },
  {
    id: "concept",
    name: "Deep Dive",
    description: "Comprehensive concept exploration",
    placeholder: "Explore complex topics in detail...",
  },
  {
    id: "coding",
    name: "Code Analysis",
    description: "Code review and optimization guidance",
    placeholder: "Share code for review or ask coding questions...",
  },
];

const PromptTypeSelect: React.FC = () => {
  const [selectedPromptType, setSelectedPromptType] = useState<string>(
    promptTypes[0].id
  );

  const currentPrompt = promptTypes.find(
    (type) => type.id === selectedPromptType
  );

  return (
    <Select value={selectedPromptType} onValueChange={setSelectedPromptType}>
      <SelectTrigger
        className="h-10 w-[200px] bg-zinc-800/90 border-zinc-700/50 
                   hover:bg-zinc-800 text-zinc-300 hover:text-zinc-200 
                   shadow-lg hover:shadow-xl transition-all duration-200
                   hover:border-zinc-700 rounded-lg"
      >
        <div className="flex items-center gap-2 px-1">
          <BookOpen className="h-4 w-4 text-indigo-400/70" />
          <SelectValue defaultValue={selectedPromptType}>
            <span className="truncate">{currentPrompt?.name}</span>
          </SelectValue>
        </div>
      </SelectTrigger>

      <SelectContent
        align="end"
        className="w-[320px] bg-zinc-900 border-zinc-800"
      >
        <SelectGroup>
          <SelectLabel className="text-xs font-medium text-zinc-500 px-2 pb-2 border-b border-zinc-800">
            Learning Modes
          </SelectLabel>

          {promptTypes.map((type) => (
            <SelectItem
              key={type.id}
              value={type.id}
              className="relative flex items-start py-3 px-2 cursor-pointer
                         hover:bg-zinc-800/50 focus:bg-zinc-800/50 transition-colors
                         duration-200 rounded-md my-1 group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center mb-1">
                  <span className="text-sm font-medium text-zinc-200 group-hover:text-indigo-400 transition-colors duration-200">
                    {type.name}
                  </span>
                </div>
                <div className="flex items-center">
                  <p className="text-xs text-zinc-400 line-clamp-2 group-hover:text-zinc-300 transition-colors duration-200">
                    {type.description}
                  </p>
                </div>
              </div>

              {selectedPromptType === type.id && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                </div>
              )}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default PromptTypeSelect;
