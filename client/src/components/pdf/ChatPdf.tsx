import React, { useState, useMemo } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "../llm/ChatInput";
import PDFViewer from "./PDFViewer";
import { OutlineItem } from "./OutlineViewer";
import OutlineDropdown from "./OutlineDropdown";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "../ui/resizable";
import useChatPdf from "../../store/chat-pdf/use-chat-pdf";

const ChatPdf: React.FC = () => {
  const { pdf } = useChatPdf();

  // Hold the selected outline items as an array to support multiple selections.
  const [selectedOutlines, setSelectedOutlines] = useState<OutlineItem[]>([]);

  // Toggle selection using uniqueness based on the item's unique identifier (path if available, otherwise title).
  const toggleSelection = (item: OutlineItem) => {
    const id = item.path || item.title;
    setSelectedOutlines((prev) => {
      if (prev.some((selected) => (selected.path || selected.title) === id)) {
        // If the item is already selected, remove it.
        return prev.filter(
          (selected) => (selected.path || selected.title) !== id
        );
      }
      // Otherwise, add the item.
      return [...prev, item];
    });
  };

  const outline = useMemo(() => {
    return pdf?.outline && pdf.outline.length > 0 ? pdf.outline : [];
  }, [pdf]);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={60} className="p-4">
        {/* Dropdown for selecting one or multiple outline sections */}
        <div className="mb-4"></div>

        <div className="flex flex-col h-full gap-4">
          <OutlineDropdown
            outline={outline}
            selectedOutlines={selectedOutlines}
            onSelect={toggleSelection}
            onClear={() => setSelectedOutlines([])}
          />
          <div className="flex-grow">
            <ChatMessages />
          </div>
          <ChatInput
            onSubmit={(msg) => {
              console.log("Message:", msg, "with Sections:", selectedOutlines);
            }}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={40}>
        <PDFViewer />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ChatPdf;
