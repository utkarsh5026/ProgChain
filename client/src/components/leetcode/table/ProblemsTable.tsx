import React from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ProblemBasic } from "@/store/leetcode/type";
import { Book, ChevronRight } from "lucide-react";
import ProblemDifficulty from "./ProblemDifficulty";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { parseLeetcodeQuestionName } from "../utils";

interface ProblemsTableProps {
  problems: ProblemBasic[];
}

const ProblemsTable: React.FC<ProblemsTableProps> = ({ problems }) => {
  console.log(problems);
  const navigate = useNavigate();
  return (
    <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-zinc-900">
            <TableHead className="text-zinc-400">Problem</TableHead>
            <TableHead className="text-zinc-400">Tags</TableHead>
            <TableHead className="text-zinc-400">Difficulty</TableHead>
            <TableHead className="text-zinc-400 text-right">
              Acceptance Rate
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="border-zinc-800 text-lg">
          {problems.map((problem, index) => (
            <TableRow
              key={`${problem.name}-${index}`}
              className="group border-zinc-800 hover:bg-zinc-800/50 transition-colors cursor-pointer"
              onClick={() =>
                navigate(`/leetcode/${parseLeetcodeQuestionName(problem.name)}`)
              }
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Book className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>{problem.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(problem.tags) &&
                    problem.tags.map((tag, tagIndex) => (
                      <Badge
                        key={`${tag.name}-${tagIndex}`}
                        variant="secondary"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  {Array.isArray(problem.tags) && problem.tags.length > 3 && (
                    <Badge className="bg-zinc-800 text-xs">
                      <span>+{problem.tags.length - 3}</span>
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <ProblemDifficulty difficulty={problem.difficulty} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <span>{problem.acceptance_rate}%</span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ProblemsTable;
