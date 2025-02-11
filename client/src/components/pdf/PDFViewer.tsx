import React, { useState, useRef, useEffect } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { useToast } from "@/hooks/use-toast";
import useChatPdf from "../../store/chat-pdf/use-chat-pdf";
import { op } from "@/base";
import PdfViewerToolBar from "./PdfViewerToolBar";
import PdfDisplay from "./PdfDisplay";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PDFViewer: React.FC = () => {
  const {
    pdf,
    darkMode,
    pdfLoading,
    setPdfLoading,
    setPdf,
    setPageNumber,
    setOutline,
    setScale,
  } = useChatPdf();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (pdfLoading.error !== null) {
      toast({
        title: "Error",
        description: pdfLoading.error,
        variant: "destructive",
      });
    }
  }, [pdfLoading]);

  useEffect(() => {
    if (containerWidth && containerRef.current) {
      const pdfCanvas = containerRef.current.querySelector(
        ".react-pdf__Page__canvas"
      ) as HTMLCanvasElement;
      if (pdfCanvas) {
        const newScale = (containerWidth - 40) / pdfCanvas.width;
        setScale(Math.min(1, newScale));
      }
    }
  }, [containerWidth]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setPdfLoading(op("rejected", "File is not a PDF"));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setPdfLoading(op("rejected", "File size should be less than 10MB"));
        return;
      }
      const fileUrl = URL.createObjectURL(file);

      setPdf({
        previewUrl: fileUrl,
        file: file,
        numPages: 0,
        pageNumber: 1,
        scale: 1.0,
        selectedText: "",
        isDarkMode: darkMode,
        outline: [],
      });
      setPdfLoading(op("pending", "Loading PDF..."));
    }
  };

  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() ?? "";
    };
    document.addEventListener("mouseup", handleTextSelection);
    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
    };
  }, []);

  // Called when the PDF document has been successfully loaded.
  const onDocumentLoadSuccess = async (pdfProxy: PDFDocumentProxy) => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      setContainerWidth(width);
    }
    setPdfDoc(pdfProxy);
    try {
      const outlineData = await pdfProxy.getOutline();
      console.log("outlineData", outlineData);
      if (pdf) {
        setPdf({
          ...pdf,
          numPages: pdfProxy.numPages,
          outline: outlineData || [],
        });
      }
    } catch (outlineError) {
      console.error("Failed to get PDF outline:", outlineError);
      setOutline([]);
    }
  };

  // Navigate to a page when an outline (chapter) item is clicked.
  const handleOutlineClick = async (dest: any) => {
    if (!pdfDoc || !dest) return;
    if (Array.isArray(dest)) {
      try {
        const pageIndex = await pdfDoc.getPageIndex(dest[0]);
        setPageNumber(pageIndex + 1);
      } catch (e) {
        console.error("Failed to navigate to page:", e);
      }
    } else if (typeof dest === "string") {
      try {
        const explicitDest = await pdfDoc.getDestination(dest);
        if (Array.isArray(explicitDest)) {
          const pageIndex = await pdfDoc.getPageIndex(explicitDest[0]);
          setPageNumber(pageIndex + 1);
        }
      } catch (e) {
        console.error("Failed to navigate to named destination:", e);
      }
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      <PdfViewerToolBar
        ref={fileInputRef}
        onOutlineClick={handleOutlineClick}
      />

      <PdfDisplay
        onError={() => {}}
        onLoadSuccess={onDocumentLoadSuccess}
        ref={containerRef}
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
        aria-label="Select PDF file"
      />

      {/* Global CSS for Dark Mode PDF Inversion */}
      <style global>{`
        .dark-mode .react-pdf__Page__canvas {
          filter: invert(1) hue-rotate(180deg);
        }
        .dark-mode .react-pdf__Page__textContent {
          filter: none;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default PDFViewer;
