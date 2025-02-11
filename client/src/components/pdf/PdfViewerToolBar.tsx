import React, { useCallback, forwardRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  ZoomOut,
  ZoomIn,
  Sun,
  Moon,
  Eye,
} from "lucide-react";
import useChatPdf from "@/store/chat-pdf/use-chat-pdf";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import OutlineViewer from "./OutlineViewer";
import { ScrollArea } from "../ui/scroll-area";

interface PdfViewerToolBarProps {
  onOutlineClick: (dest: any) => void;
}

const PdfViewerToolBar = forwardRef<HTMLInputElement, PdfViewerToolBarProps>(
  ({ onOutlineClick }, fileInputRef) => {
    const { pdf, setPageNumber, darkMode, setIsDarkMode, setScale, scale } =
      useChatPdf();
    const [showOutlineSheet, setShowOutlineSheet] = useState(false);

    const handleZoomIn = useCallback(() => {
      const newScale = Math.min(2, scale + 0.1);
      setScale(newScale);
    }, [scale, setScale]);

    const handleZoomOut = useCallback(() => {
      const newScale = Math.max(0.5, scale - 0.1);
      setScale(newScale);
    }, [scale, setScale]);

    const incrementPageNumber = useCallback(() => {
      if (!pdf) return;
      setPageNumber(pdf.pageNumber + 1);
    }, [pdf, setPageNumber]);

    const decrementPageNumber = useCallback(() => {
      if (!pdf) return;
      setPageNumber(pdf.pageNumber - 1);
    }, [pdf, setPageNumber]);

    return (
      <div>
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex items-center gap-2">
            {pdf ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decrementPageNumber}
                  disabled={pdf.pageNumber <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {pdf.pageNumber} of {pdf.numPages || "--"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={incrementPageNumber}
                  disabled={pdf.pageNumber >= (pdf.numPages || 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  (
                    fileInputRef as React.MutableRefObject<HTMLInputElement | null>
                  )?.current?.click()
                }
              >
                <FileText className="mr-2 h-4 w-4" />
                Select PDF
              </Button>
            )}
          </div>
          {pdf && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOutlineSheet(true)}
              >
                <Eye className="h-4 w-4" />
                <span className="hidden md:inline ml-2">Preview</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm">{Math.round(scale * 100)}%</span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDarkMode(!darkMode)}
              >
                {darkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}

          {pdf && (
            <Sheet open={showOutlineSheet} onOpenChange={setShowOutlineSheet}>
              <SheetContent
                side="right"
                onMouseLeave={() => setShowOutlineSheet(false)}
                className="w-72 p-4"
              >
                <h3 className="text-lg font-semibold mb-2">Chapters</h3>
                <ScrollArea className="max-h-[calc(100vh-10rem)] overflow-auto">
                  <OutlineViewer
                    outline={pdf.outline}
                    onItemClick={(item) => onOutlineClick(item.dest)}
                  />
                </ScrollArea>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    );
  }
);

PdfViewerToolBar.displayName = "PdfViewerToolBar";

export default PdfViewerToolBar;
