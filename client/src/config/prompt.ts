type Prompt = {
  id: string;
  name: string;
  description: string;
  placeholder: string;
};

export const promptTypes: Record<string, Prompt> = {
  teacher: {
    id: "teacher",
    name: "Step-by-Step Guide",
    description: "Detailed explanations broken down into steps",
    placeholder: "Ask for a detailed explanation of any concept...",
  },
  interviewer: {
    id: "interviewer",
    name: "Interview Prep",
    description: "Technical interview preparation and practice",
    placeholder: "Practice interview questions or coding challenges...",
  },
  concept: {
    id: "concept",
    name: "Deep Dive",
    description: "Comprehensive concept exploration",
    placeholder: "Explore complex topics in detail...",
  },
  coding: {
    id: "coding",
    name: "Code Analysis",
    description: "Code review and optimization guidance",
    placeholder: "Share code for review or ask coding questions...",
  },
};

export type PromptType = keyof typeof promptTypes;
