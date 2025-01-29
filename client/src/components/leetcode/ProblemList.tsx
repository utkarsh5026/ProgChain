import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Filter,
  Code2,
  Loader2,
  Book,
  ChevronRight,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProblemDifficulty from "./ProblemDifficulty";
import useProblems from "../../store/leetcode/hook";

const ProblemList: React.FC = () => {
  const { fetchProblems, problems } = useProblems();
  const [difficulty, setDifficulty] = React.useState<string | null>(null);

  useEffect(() => {
    fetchProblems({ page: 1, limit: 20 });
  }, [fetchProblems]);

  // Enhanced table row animation variants
  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
    exit: { opacity: 0, x: 20 },
  };

  if (problems === null) {
    return (
      <Card className="w-full h-[400px] bg-zinc-900/50 border-zinc-800">
        <CardContent className="h-full flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-zinc-400 animate-pulse">
            Loading coding challenges...
          </p>
        </CardContent>
      </Card>
    );
  }

  const filteredProblems = difficulty
    ? problems.problems.filter((problem) => problem.difficulty === difficulty)
    : problems.problems;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Code2 className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-semibold text-white">
              LeetCode Problems
            </h2>
            <p className="text-sm text-zinc-400">
              {filteredProblems.length} problems available
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-zinc-900">
            <Activity className="w-4 h-4 mr-1" />
            Success Rate:{" "}
            {Math.round(
              problems.problems.reduce(
                (acc, p) => acc + parseFloat(p.acceptance_rate),
                0
              ) / problems.problems.length
            )}
            %
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                {difficulty || "All Difficulties"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
              <DropdownMenuCheckboxItem
                checked={difficulty === null}
                onCheckedChange={() => setDifficulty(null)}
              >
                All Difficulties
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={difficulty === "Easy"}
                onCheckedChange={() => setDifficulty("Easy")}
              >
                Easy
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={difficulty === "Medium"}
                onCheckedChange={() => setDifficulty("Medium")}
              >
                Medium
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={difficulty === "Hard"}
                onCheckedChange={() => setDifficulty("Hard")}
              >
                Hard
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-900">
              <TableHead className="text-zinc-400">Problem</TableHead>
              <TableHead className="text-zinc-400">Difficulty</TableHead>
              <TableHead className="text-zinc-400">Acceptance Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="wait">
              {filteredProblems.map((problem, index) => (
                <motion.tr
                  key={problem.problem}
                  variants={tableRowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={index}
                  className="group border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Book className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      {problem.problem}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ProblemDifficulty difficulty={problem.difficulty} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <span>{problem.acceptance_rate}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </Card>
    </motion.div>
  );
};

export default ProblemList;
