import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Wand2,
  RefreshCcw,
} from "lucide-react";

interface CodeActionsProps {
  handleCopyCode: () => void;
  handleGenerateCode: (prompt?: string) => void;
  showCopied: boolean;
  isGenerateOpen: boolean;
  setIsGenerateOpen: (value: boolean) => void;
}

const CodeActions: React.FC<CodeActionsProps> = ({
  handleCopyCode,
  handleGenerateCode,
  showCopied,
  isGenerateOpen,
  setIsGenerateOpen,
}) => {
  const defaultPrompt =
    "Generate an efficient and well-commented solution with explanation of approach";

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyCode}
          className="flex items-center gap-2 hover:bg-secondary"
        >
          {showCopied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Code</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleGenerateCode(defaultPrompt)}
          className="flex items-center gap-2 hover:bg-secondary"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Regenerate</span>
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsGenerateOpen(!isGenerateOpen)}
        className="flex items-center gap-2 hover:bg-secondary"
      >
        <Wand2 className="w-4 h-4" />
        <span>Customize Generation</span>
        {isGenerateOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

export default CodeActions;
