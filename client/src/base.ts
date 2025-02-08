import type { Model } from "@/config/config";

export type BaseLLMRequest = Partial<{
  question: string;
  model: Model;
  promptInstructions: string;
}>;

export const req = (llm_req: BaseLLMRequest) => {
  return {
    question: llm_req.question,
    model: llm_req.model,
    prompt_instructions: llm_req.promptInstructions,
  };
};

export type LoadingStatus = "pending" | "fulfilled" | "rejected" | null;

export type Operation = {
  loading: LoadingStatus;
  error: string | null;
};

export function op(loading: LoadingStatus, error?: string | null): Operation {
  return { loading, error: error ?? null };
}

export function loading(op: Operation): boolean {
  return op.loading === "pending";
}

export function not(op: Operation): boolean {
  return op.loading === null;
}

export function done(op: Operation): boolean {
  return op.loading === "fulfilled";
}
