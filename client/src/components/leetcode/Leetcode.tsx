import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProblemDetail from "./questions/ProblemDetail";
import LeetCodeSearch from "./search/LeetCodeSearch";
import { Button } from "@/components/ui/button";
import Problems from "./table/Problems";
import useProblems from "@/store/leetcode/hook";
import { useLocation } from "react-router-dom";

const Leetcode: React.FC = () => {
  const { fetchInfo } = useProblems();
  const location = useLocation();

  const problemName = useMemo(() => {
    const parts = location.pathname.split("/");
    return parts.length > 2 ? parts[parts.length - 1] : "";
  }, [location.pathname]);

  const [showProblems, setShowProblems] = useState<boolean>(!problemName);

  useEffect(() => {
    setShowProblems(!problemName);
  }, [problemName]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
    >
      <div className="flex items-center justify-center my-4 scrollbar-none">
        <Button onClick={() => setShowProblems(true)}>Problems</Button>
        <LeetCodeSearch />
      </div>
      {!showProblems && problemName && (
        <ProblemDetail problemName={problemName} />
      )}
      {showProblems && <Problems />}
    </motion.div>
  );
};

export default Leetcode;
