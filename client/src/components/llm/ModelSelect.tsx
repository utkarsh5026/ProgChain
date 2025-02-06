import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { modelDescriptions, type Model } from "@/config/config";
import { Sparkles } from "lucide-react";
import useChatInput from "@/store/chat-input/hook";

interface ModelSelectProps {
  onModelSelect?: (model: Model) => void;
}

/**
 * ModelSelect Component
 *
 * This component renders a dropdown selection for choosing a model from a list of available models.
 * It allows users to select a model, which will then trigger a callback function to update the selected model.
 *
 * Props:
 * - onModelSelect: A function that is called when a model is selected. It receives the selected model as an argument.
 *
 * State:
 * - selectedModel: The currently selected model, initialized to the first model in the modelDescriptions array.
 *
 * Where handleModelChange is a function defined in the parent component to handle the model selection.
 */
const ModelSelect: React.FC<ModelSelectProps> = ({ onModelSelect }) => {
  const { model, selectModel } = useChatInput();

  const handleModelSelect = (model: Model) => {
    selectModel(model);
    onModelSelect?.(model);
  };

  return (
    <Select value={model} onValueChange={handleModelSelect}>
      <SelectTrigger
        className="h-9 w-[180px] bg-zinc-800/90 border-zinc-700/50 hover:bg-zinc-800 
                          text-zinc-300 hover:text-zinc-200 shadow-lg hover:shadow-xl transition-all
                          hover:border-zinc-700"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary/70" />
          <SelectValue defaultValue={model}>{model}</SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent align="end" className="w-[280px]">
        <SelectGroup>
          <SelectLabel className="text-xs font-medium text-zinc-500">
            Available Models
          </SelectLabel>
          {modelDescriptions.map((model) => (
            <SelectItem
              key={model.name}
              value={model.name}
              className="flex items-center py-2"
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm text-zinc-300">
                  {model.name}
                </span>
                <span className="text-xs text-zinc-400">
                  {model.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ModelSelect;
