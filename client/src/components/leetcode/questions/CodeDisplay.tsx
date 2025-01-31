import { ScrollArea } from "@/components/ui/scroll-area";
import Syntax from "./Syntax";

interface CodeDisplayProps {
  selectedLanguage: string;
  generatedCode: string;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({
  selectedLanguage,
  generatedCode,
}) => {
  return (
    <ScrollArea className="h-[500px] rounded-lg border">
      <Syntax
        selectedLanguage={selectedLanguage}
        generatedCode={generatedCode}
      />
    </ScrollArea>
  );
};

export default CodeDisplay;
