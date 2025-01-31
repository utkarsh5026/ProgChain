import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";

interface SyntaxProps {
  selectedLanguage: string;
  generatedCode: string;
}

const Syntax = ({ selectedLanguage, generatedCode }: SyntaxProps) => {
  return (
    <SyntaxHighlighter
      language={selectedLanguage.toLowerCase()}
      style={vs2015}
      showLineNumbers
      wrapLines
      wrapLongLines
      customStyle={{
        margin: 0,
        borderRadius: "0.5rem",
        fontSize: "16px",
        fontFamily: "Cascadia Code",
        padding: "1.5rem",
        minHeight: "500px",
      }}
    >
      {generatedCode}
    </SyntaxHighlighter>
  );
};

export default Syntax;
