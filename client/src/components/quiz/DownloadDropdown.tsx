import React from "react";
import { Dropdown, Button } from "antd";
import {
  FileExcelFilled,
  CodepenOutlined,
  FilePdfFilled,
  DownloadOutlined,
} from "@ant-design/icons";
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
    <Dropdown
      menu={{
        items: [
          {
            key: "download_excel",
            label: "Download as Excel",
            icon: <FileExcelFilled />,
            onClick: () => downloadAsXLSX(quiz.questions),
          },
          {
            key: "download_json",
            label: "Download as JSON",
            icon: <CodepenOutlined />,
            onClick: () => downloadAsJSON(quiz.questions),
          },
          {
            key: "download_pdf",
            label: "Download as PDF",
            icon: <FilePdfFilled />,
            onClick: () => downloadAsPdf(quiz.questions),
          },
        ],
      }}
    >
      <Button icon={<DownloadOutlined />} type="primary">
        Download
      </Button>
    </Dropdown>
  );
};

export default DownloadDropdown;
