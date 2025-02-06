import React from "react";
import StartThread from "./StartThread";
import useThreads from "@/store/threads/hook";
import LearningFeed from "./LearningFeed";
import LoadingAnimation from "../utils/LoadingAnimation";
import { loading, not } from "@/base";

const Thread: React.FC = () => {
  const { thread, creating } = useThreads();
  if (!thread && not(creating)) return <StartThread />;

  if (loading(creating)) {
    return <LoadingAnimation message="Creating thread..." />;
  }

  return <LearningFeed />;
};

export default Thread;
