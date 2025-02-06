import React from "react";
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
import useChatInput from "@/store/chat-input/hook";
import { promptTypes, type PromptType } from "@/config/prompt";

interface PromptTypeSelectProps {
  onPromptTypeChange?: (promptType: PromptType) => void;
}

const PromptTypeSelect: React.FC<PromptTypeSelectProps> = ({
  onPromptTypeChange,
}) => {
  const { promptType, setPromptType } = useChatInput();
  const currentPrompt = promptTypes[promptType];

  const handlePromptTypeChange = (promptType: string) => {
    setPromptType(promptType);
    onPromptTypeChange?.(promptType);
  };

  return (
    <Select value={promptType} onValueChange={handlePromptTypeChange}>
      <SelectTrigger
        className="h-10 w-[200px] bg-zinc-800/90 border-zinc-700/50 
                   hover:bg-zinc-800 text-zinc-300 hover:text-zinc-200 
                   shadow-lg hover:shadow-xl transition-all duration-200

                   hover:border-zinc-700 rounded-lg"
      >
        <div className="flex items-center gap-2 px-1">
          <BookOpen className="h-4 w-4 text-indigo-400/70" />
          <SelectValue defaultValue={promptType}>
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

          {Object.values(promptTypes).map(({ id, name, description }) => (
            <SelectItem
              key={id}
              value={id}
              className="relative flex items-start py-3 px-2 cursor-pointer


                         hover:bg-zinc-800/50 focus:bg-zinc-800/50 transition-colors
                         duration-200 rounded-md my-1 group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center mb-1">
                  <span className="text-sm font-medium text-zinc-200 group-hover:text-indigo-400 transition-colors duration-200">
                    {name}
                  </span>
                </div>

                <div className="flex items-center">
                  <p className="text-xs text-zinc-400 line-clamp-2 group-hover:text-zinc-300 transition-colors duration-200">
                    {description}
                  </p>
                </div>
              </div>

              {promptType === id && (
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
