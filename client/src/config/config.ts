export const models = [
  "gpt-4o",
  "gpt-3.5-turbo",
  "claude-3-5-sonnet",
  "gpt-4o-mini",
] as const;

export const languages = [
  "python",
  "javascript",
  "java",
  "c++",
  "c#",
  "go",
  "rust",
  "typescript",
  "c",
] as const;

export type Language = (typeof languages)[number];
export type Model = (typeof models)[number];
