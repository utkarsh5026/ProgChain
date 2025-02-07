import { ScrollArea } from "@/components/ui/scroll-area";
import Syntax from "./Syntax";
import { useProblem } from "@/store/leetcode/hook";

interface CodeDisplayProps {
  selectedLanguage: string;
  generatedCode: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({
  selectedLanguage,
  generatedCode,
}) => {
  const { solutionLoading } = useProblem();
  return (
    <ScrollArea className="h-[500px] rounded-lg border">
      <Syntax
        selectedLanguage={selectedLanguage}
        generatedCode={generatedCode}
        isLoading={solutionLoading}
      />
    </ScrollArea>
  );
};

export default CodeDisplay;
