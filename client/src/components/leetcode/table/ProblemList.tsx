import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Filter,
  Code2,
  Loader2,
  ChevronRight,
  Activity,
  Tags,
  ChevronLeft,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import useProblems from "@/store/leetcode/hook";
import type { ProblemFilters } from "@/store/leetcode/type";
import ProblemsTable from "./ProblemsTable";

const ProblemList: React.FC = () => {
  const { fetchProblems, problemList, tags, pageSize, loading, problemCnt } =
    useProblems();
  const [difficulties, setDifficulties] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({
    key: null,
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(() => {
    const filters: ProblemFilters = {
      page: currentPage,
      limit: pageSize,
      difficulty: difficulties,
      tags: selectedTags,
      acceptanceSort:
        sortConfig.key === "acceptance_rate" ? sortConfig.direction : "asc",
      firstQuery: true,
    };

    fetchProblems(filters);
  }, [currentPage, pageSize, difficulties, selectedTags, sortConfig]);

  useEffect(() => {
    handleSearch();
  }, [currentPage]);

  const handleDifficultyChange = (difficulty: string, checked: boolean) => {
    setDifficulties((prev) =>
      checked ? [...prev, difficulty] : prev.filter((d) => d !== difficulty)
    );
  };

  const averageAcceptanceRate = useMemo(() => {
    if (!problemList) return 0;
    return Math.round(
      problemList.problems.reduce(
        (acc, p) => acc + (parseFloat(p.acceptance_rate) || 0),
        0
      ) / problemList.problems.length
    );
  }, [problemList]);

  const problems = useMemo(() => {
    if (!problemList) return [];
    return problemList.problems;
  }, [problemList]);

  if (loading || !problemList) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="sticky top-0 z-50 bg-background pb-6 p-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Code2 className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  LeetCode Problems
                </h2>
                <p className="text-sm text-zinc-400">
                  {problemCnt} problems available
                </p>
              </div>
            </div>

            <Badge variant="outline" className="bg-zinc-900">
              <Activity className="w-4 h-4 mr-1" />
              <span>Average Success Rate: {averageAcceptanceRate}%</span>
            </Badge>
          </div>

          {/* Filters Section */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-900 border-zinc-800"
              />
            </div>

            {/* Difficulty Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  <span>
                    {difficulties.length
                      ? `${difficulties.length} Difficulties`
                      : "All Difficulties"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-zinc-800">
                {["Easy", "Medium", "Hard"].map((diff) => (
                  <DropdownMenuCheckboxItem
                    key={diff}
                    checked={difficulties.includes(diff)}
                    onCheckedChange={(checked) =>
                      handleDifficultyChange(diff, checked)
                    }
                  >
                    {diff}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tags Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Tags className="h-4 w-4" />
                  <span>Tags ({selectedTags.length})</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-zinc-800 max-h-[300px] overflow-y-auto">
                <DropdownMenuLabel>Select Tags</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {tags.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag}
                    checked={selectedTags.includes(tag)}
                    onCheckedChange={(checked) => {
                      setSelectedTags((prev) =>
                        checked ? [...prev, tag] : prev.filter((t) => t !== tag)
                      );
                    }}
                  >
                    {tag}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Selection */}
            <Select
              value={`${sortConfig.key ?? "none"}-${sortConfig.direction}`}
              onValueChange={(value) => {
                const [key, direction] = value.split("-") as [
                  string,
                  "asc" | "desc"
                ];
                setSortConfig({
                  key: key === "none" ? null : key,
                  direction,
                });
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none-asc">No sorting</SelectItem>
                <SelectItem value="acceptance_rate-asc">
                  Success Rate (Low to High)
                </SelectItem>
                <SelectItem value="acceptance_rate-desc">
                  Success Rate (High to Low)
                </SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="default"
              size="sm"
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 gap-2"
            >
              <Search className="h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <ProblemsTable problems={problems} />
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, problemCnt)} of {problemCnt}{" "}
          problems
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Select
            value={currentPage.toString()}
            onValueChange={(value) => setCurrentPage(parseInt(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="Page..." />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: problemList.pageCount }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(problemList.pageCount, prev + 1)
              )
            }
            disabled={currentPage === problemList.pageCount}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProblemList;
