import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectModel as selectModelAction,
  setText as setTextAction,
  setPastedContents as setPastedContentsAction,
  setPromptType as setPromptTypeAction,
  reset as resetAction,
} from "./slice";
import { useCallback } from "react";
import type { Model } from "@/config/config";
import type { Content } from "./type";
import type { PromptType } from "@/config/prompt";

const useChatInput = () => {
  const dispatch = useAppDispatch();
  const { text, pastedContents, model, promptType } = useAppSelector(
    (state) => state.chatInput
  );

  const selectModel = useCallback(
    (model: Model) => {
      dispatch(selectModelAction(model));
    },
    [dispatch]
  );

  const setText = useCallback(
    (text: string) => {
      dispatch(setTextAction(text));
    },
    [dispatch]
  );

  const setPastedContents = useCallback(
    (pastedContents: Content[]) => {
      dispatch(setPastedContentsAction(pastedContents));
    },
    [dispatch]
  );

  const setPromptType = useCallback(
    (promptType: PromptType) => {
      dispatch(setPromptTypeAction(promptType));
    },
    [dispatch]
  );

  const addPastedContent = useCallback(
    (text: string) => {
      const newContent = {
        id: crypto.randomUUID(),
        content: text,
        timestamp: Date.now(),
      };
      dispatch(setPastedContentsAction([...pastedContents, newContent]));
    },
    [dispatch, pastedContents]
  );

  const removePastedContent = useCallback(
    (id: string) => {
      dispatch(
        setPastedContentsAction(
          pastedContents.filter((content) => content.id !== id)
        )
      );
    },
    [dispatch, pastedContents]
  );

  const clearPastedContents = useCallback(() => {
    dispatch(setPastedContentsAction([]));
  }, [dispatch]);

  const reset = useCallback(() => {
    dispatch(resetAction());
  }, [dispatch]);

  return {
    text,
    pastedContents,
    model,
    promptType,

    selectModel,
    setText,
    setPastedContents,
    setPromptType,

    addPastedContent,
    removePastedContent,
    clearPastedContents,
    reset,
  };
};

export default useChatInput;
