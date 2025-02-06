import { PromptType } from "@/store/chat-input/type";

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

export const modelDescriptions: { name: Model; description: string }[] = [
  {
    name: "gpt-4o-mini",
    description: "Smallest model for quick learning tasks",
  },
  {
    name: "gpt-4o",
    description: "Advanced model for complex learning tasks",
  },
  {
    name: "gpt-3.5-turbo",
    description: "Fast and efficient for practice",
  },
  {
    name: "claude-3-5-sonnet",
    description:
      "Advanced model for complex learning tasks provided by Anthropic",
  },
];

export const promptTypes: PromptType[] = [
  {
    id: "teacher",
    name: "Step-by-Step Guide",
    description: "Detailed explanations broken down into steps",
    placeholder: "Ask for a detailed explanation of any concept...",
  },
  {
    id: "interviewer",
    name: "Interview Prep",
    description: "Technical interview preparation and practice",
    placeholder: "Practice interview questions or coding challenges...",
  },
  {
    id: "concept",
    name: "Deep Dive",
    description: "Comprehensive concept exploration",
    placeholder: "Explore complex topics in detail...",
  },
  {
    id: "coding",
    name: "Code Analysis",
    description: "Code review and optimization guidance",
    placeholder: "Share code for review or ask coding questions...",
  },
];

export type Language = (typeof languages)[number];
export type Model = (typeof models)[number];
