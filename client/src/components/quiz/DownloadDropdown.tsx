import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileSpreadsheet, Code2, FileText, Download } from "lucide-react";
import {
  downloadAsXLSX,
  downloadAsJSON,
  downloadAsPdf,
} from "../../store/quiz/file";
import type { Quiz } from "../../store/quiz/type";

interface DownloadDropdownProps {
  quiz: Quiz;
}

/**
 * DownloadDropdown component provides a dropdown menu for downloading quiz content in various formats.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Quiz} props.quiz - The quiz object containing questions to be downloaded
 * @returns {React.ReactElement} Rendered DownloadDropdown component
 */
const DownloadDropdown: React.FC<DownloadDropdownProps> = ({ quiz }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => downloadAsXLSX(quiz.questions)}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Download as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => downloadAsJSON(quiz.questions)}>
          <Code2 className="mr-2 h-4 w-4" />
          Download as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => downloadAsPdf(quiz.questions)}>
          <FileText className="mr-2 h-4 w-4" />
          Download as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DownloadDropdown;
