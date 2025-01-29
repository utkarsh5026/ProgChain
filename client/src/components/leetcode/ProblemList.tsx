import React, { useEffect } from "react";
import { motion } from "framer-motion";
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
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProblemDifficulty from "./ProblemDifficulty";
import useProblems from "../../store/leetcode/hook";

/**
 * ProblemList component for displaying a list of LeetCode problems.
 *
 * This component fetches and renders a table of LeetCode problems using the Ant Design Table component.
 * It includes columns for the problem name, difficulty (with filtering), and acceptance rate.
 * The component uses Framer Motion for animation effects.
 *
 * @component
 * @returns {JSX.Element} The rendered ProblemList component
 */
const ProblemList: React.FC = () => {
  const { fetchProblems, problems } = useProblems();
  const [difficulty, setDifficulty] = React.useState<string | null>(null);

  useEffect(() => {
    fetchProblems({ page: 1, limit: 20 });
  }, [fetchProblems]);

  if (problems === null) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  const filteredProblems = difficulty
    ? problems.problems.filter((problem) => problem.difficulty === difficulty)
    : problems.problems;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        delay: 0.2,
        type: "spring",
      }}
      className="p-4"
    >
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Problem</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  Difficulty
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuCheckboxItem
                        checked={difficulty === null}
                        onCheckedChange={() => setDifficulty(null)}
                      >
                        All
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
              </TableHead>
              <TableHead>Acceptance Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProblems.map((problem) => (
              <TableRow key={problem.problem}>
                <TableCell>{problem.problem}</TableCell>
                <TableCell>
                  <ProblemDifficulty difficulty={problem.difficulty} />
                </TableCell>
                <TableCell>{problem.acceptance_rate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default ProblemList;
