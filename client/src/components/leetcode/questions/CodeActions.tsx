import { Button } from "@/components/ui/button";
import { languages } from "@/config/config";
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Wand2,
  RefreshCcw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type Language } from "@/config/config";

interface CodeActionsProps {
  handleCopyCode: () => void;
  handleGenerateCode: (prompt?: string) => void;
  showCopied: boolean;
  isGenerateOpen: boolean;
  setIsGenerateOpen: (value: boolean) => void;
  selectedLanguage: Language;
  setSelectedLanguage: (value: Language) => void;
}

const CodeActions: React.FC<CodeActionsProps> = ({
  handleCopyCode,
  handleGenerateCode,
  showCopied,
  isGenerateOpen,
  setIsGenerateOpen,
  selectedLanguage,
  setSelectedLanguage,
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

        <Select
          value={selectedLanguage}
          onValueChange={(value) => setSelectedLanguage(value as Language)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue
              placeholder="Language"
              className="capitalize text-white"
            />
          </SelectTrigger>
          <SelectContent>
            {languages.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
