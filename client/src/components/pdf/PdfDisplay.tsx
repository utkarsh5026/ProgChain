import React, { useEffect, useState, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import useChatPdf from "@/store/chat-pdf/use-chat-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";

interface PdfDisplayProps {
  onError: (error: string) => void;
  onLoadSuccess: (pdfProxy: PDFDocumentProxy) => void;
}

const PdfDisplay = React.forwardRef<HTMLDivElement, PdfDisplayProps>(
  ({ onError, onLoadSuccess }, forwardedRef) => {
    const { pdf, darkMode, scale, setScale } = useChatPdf();
    const internalContainerRef = useRef<HTMLDivElement>(null);
    const containerRef =
      (forwardedRef as React.RefObject<HTMLDivElement>) || internalContainerRef;

    const [pageWidth, setPageWidth] = useState<number>(0);

    useEffect(() => {
      const updateWidth = () => {
        if (containerRef?.current) {
          setPageWidth(containerRef.current.clientWidth);
        }
      };
      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }, [containerRef]);

    useEffect(() => {
      if (pageWidth && containerRef.current) {
        const pdfCanvas = containerRef.current.querySelector(
          ".react-pdf__Page__canvas"
        ) as HTMLCanvasElement;
        if (pdfCanvas) {
          const newScale = (pageWidth - 40) / pdfCanvas.width;
          setScale(Math.min(1, newScale));
        }
      }
    }, [pageWidth]);

    if (!pdf) return null;

    return (
      <div className="flex-grow relative p-4">
        {/* Add overflow-auto to ensure scrolling if content is larger than the container */}
        <ScrollArea
          ref={containerRef}
          className={`${
            darkMode ? "dark-mode" : ""
          } max-h-[calc(100vh-100px)] overflow-auto`}
        >
          {/* Wrap the Document in a div to allow natural page width (w-max)
              and center it when possible (mx-auto) */}
          <div className="w-max mx-auto rounded-lg">
            <Document
              file={pdf.previewUrl}
              onLoadSuccess={onLoadSuccess}
              className="rounded-lg"
              onLoadError={() =>
                onError("Error loading PDF. Please try again.")
              }
              loading={
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              }
            >
              <Page
                pageNumber={pdf.pageNumber}
                // Multiply the container width by scale to adjust the zoom.
                // If the container width is not yet measured, fallback to 600.
                width={(pageWidth ? pageWidth : 600) * scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="rounded-lg border-2 border-gray-300"
              />
            </Document>
          </div>
        </ScrollArea>
      </div>
    );
  }
);

export default PdfDisplay;
