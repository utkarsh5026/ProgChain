import { useCallback } from "react";
import html2canvas from "html2canvas";

const useCapture = () => {
  const capture = useCallback(
    async (
      element: HTMLElement,
      imageName: string,
      onSuccess?: () => void,
      onError?: (error: Error) => void
    ) => {
      if (element) {
        try {
          const canvas = await html2canvas(element);
          const image = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = image;
          link.download = `${imageName}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          onSuccess?.();
        } catch (error) {
          onError?.(error as Error);
        }
      }
    },
    []
  );

  return capture;
};

export default useCapture;
