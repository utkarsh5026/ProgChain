export type Pdf = {
  previewUrl: string;
  file: File;
  numPages: number;
  pageNumber: number;
  scale: number;
  selectedText: string;
  isDarkMode: boolean;
  outline: OutlineItem[];
};

export type PageNumberSelect = {
  from: number;
  to: number;
};

export type PdfMessage = {
  userQuestion: string;
  assistantAnswer: string;
  pageNumberSelect: PageNumberSelect;
};

export type OutlineItem = {
  title: string;
  dest: any;
  items?: OutlineItem[];
};
