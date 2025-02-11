import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import {
  setPdf as setPdfAction,
  setIsDarkMode as setIsDarkModeAction,
  resetPdfState as resetPdfStateAction,
  setPdfLoading as setPdfLoadingAction,
  setScale as setScaleAction,
} from "./slice";
import type { OutlineItem, Pdf } from "./types";
import { Operation } from "@/base";

const useChatPdf = () => {
  const dispatch = useAppDispatch();
  const { pdf, pdfLoading, darkMode, scale } = useAppSelector(
    (state) => state.chatPdf
  );

  const setPdf = useCallback(
    (pdf: Pdf) => dispatch(setPdfAction(pdf)),
    [dispatch]
  );

  const setIsDarkMode = useCallback(
    (darkMode: boolean) => dispatch(setIsDarkModeAction(darkMode)),
    [dispatch]
  );

  const resetPdfState = useCallback(
    () => dispatch(resetPdfStateAction()),
    [dispatch]
  );

  const setPageNumber = useCallback(
    (pageNumber: number) => {
      if (!pdf) return;

      const validPage = Math.max(1, Math.min(pageNumber, pdf.numPages));
      dispatch(setPdf({ ...pdf, pageNumber: validPage }));
    },
    [dispatch, pdf]
  );

  const setOutline = useCallback(
    (outline: OutlineItem[]) => {
      if (pdf) dispatch(setPdf({ ...pdf, outline }));
    },
    [dispatch, pdf]
  );

  const setPdfLoading = useCallback(
    (pdfLoading: Operation) => dispatch(setPdfLoadingAction(pdfLoading)),
    [dispatch]
  );

  const setScale = useCallback(
    (scale: number) => dispatch(setScaleAction(scale)),
    [dispatch]
  );

  return {
    pdf,
    pdfLoading,
    darkMode,
    scale,
    setPdf,
    setIsDarkMode,
    resetPdfState,
    setPageNumber,
    setOutline,
    setPdfLoading,
    setScale,
  };
};

export default useChatPdf;
