import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  Wand2,
  MessageSquarePlus,
  ChevronDown,
  Check,
  X,
  Pencil,
  ChevronRight,
} from "lucide-react";
import ModelSelect from "@/components/llm/ModelSelect";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const quickTemplates = [
  {
    label: "DSA Focus",
    icon: "🔍",
    instruction: `Generate data structure and algorithm questions that cover...`,
  },
  {
    label: "System Design",
    icon: "🏗️",
    instruction: `Create system design interview questions that...`,
  },
  {
    label: "JavaScript Deep",
    icon: "💻",
    instruction: `Generate JavaScript-specific interview questions covering...`,
  },
  {
    label: "React Expert",
    icon: "⚛️",
    instruction: `Create React interview questions focusing on...`,
  },
];

const InterviewHeader = ({ onModelSelect, onInstructionsChange }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [customInstructions, setCustomInstructions] = useState("");
  const [editingInstructions, setEditingInstructions] = useState(false);
  const [tempInstructions, setTempInstructions] = useState("");
  const [topicInput, setTopicInput] = useState("");

  const handleStartEditing = () => {
    setTempInstructions(customInstructions);
    setEditingInstructions(true);
    setIsOpen(true);
  };

  const handleSaveInstructions = () => {
    setCustomInstructions(tempInstructions);
    onInstructionsChange(tempInstructions);
    setEditingInstructions(false);
    setIsOpen(false);
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-b from-zinc-900/50 to-transparent rounded-lg border border-zinc-800/30 backdrop-blur-sm">
      {/* Header Section */}
      <div className="flex justify-between items-start gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-200 bg-clip-text text-transparent">
              Technical Interview Practice
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="h-8 w-8 hover:bg-zinc-800/80 transition-colors"
            >
              <Home className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-lg text-zinc-400/90">
            Master your technical interview skills with AI-powered practice
          </p>
        </div>

        <div className="flex items-center gap-4">
          <ModelSelect onModelSelect={onModelSelect} />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 bg-zinc-800/50 hover:bg-zinc-700/50 border-zinc-700/50 transition-colors shadow-lg"
              >
                <Wand2 className="h-4 w-4 text-blue-400" />
                Generate Questions
                <ChevronDown className="h-4 w-4 opacity-70" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-4 bg-zinc-900/95 border-zinc-800 shadow-xl backdrop-blur-lg"
              align="end"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Topic or Technology</Label>
                  <Input
                    placeholder="e.g. React Hooks, System Design..."
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    className="bg-zinc-800/50 border-zinc-700"
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500"
                  onClick={() =>
                    navigate(`/generate/${encodeURIComponent(topicInput)}`)
                  }
                  disabled={!topicInput.trim()}
                >
                  Generate Questions
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Instructions Section */}
      <Card className="bg-zinc-900/30 border-zinc-800/30 backdrop-blur-sm shadow-lg">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageSquarePlus className="h-4 w-4 text-blue-400" />
                Custom Instructions
              </CardTitle>
              {!editingInstructions && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 hover:bg-zinc-800/80 transition-colors"
                    onClick={handleStartEditing}
                  >
                    <Pencil className="h-3 w-3" />
                    Edit Instructions
                  </Button>
                  <CollapsibleTrigger className="h-7 px-2 hover:bg-zinc-800/80 rounded transition-colors">
                    <ChevronRight
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                  </CollapsibleTrigger>
                </div>
              )}
            </div>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="py-4">
              {editingInstructions ? (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Add custom instructions for the AI to follow when generating solutions..."
                    value={tempInstructions}
                    onChange={(e) => setTempInstructions(e.target.value)}
                    className="min-h-24 resize-none bg-zinc-800/30 border-zinc-700/50 focus:border-blue-500/50 transition-colors"
                  />

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {quickTemplates.map((template) => (
                        <Button
                          key={template.label}
                          variant="outline"
                          size="sm"
                          className="text-xs h-8 px-3 bg-zinc-800/30 border-zinc-700/50 hover:bg-zinc-700/50 transition-colors whitespace-nowrap"
                          onClick={() =>
                            setTempInstructions(template.instruction)
                          }
                        >
                          <span className="mr-1">{template.icon}</span>
                          {template.label}
                        </Button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 hover:bg-zinc-800/80 transition-colors"
                        onClick={() => {
                          setEditingInstructions(false);
                          setIsOpen(false);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-colors"
                        onClick={handleSaveInstructions}
                        disabled={!tempInstructions.trim()}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-400/90">
                  {customInstructions ||
                    "No custom instructions set. Click Edit to add specific requirements for the AI."}
                </p>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default InterviewHeader;
