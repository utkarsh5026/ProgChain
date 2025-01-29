import React, { useState } from "react";
import { Search } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

import { searchProblems } from "../../store/leetcode/api";

interface ProblemOption {
  value: string;
  label: string;
}

/**
 * ProblemSearch component for searching LeetCode problems.
 *
 * This component provides a command palette-style search functionality for LeetCode problems.
 * It uses the shadcn/ui Command components to create a modern search experience
 * with autocomplete suggestions.
 *
 * @component
 * @returns {JSX.Element} The rendered ProblemSearch component
 */
const ProblemSearch: React.FC = () => {
  const [options, setOptions] = useState<ProblemOption[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const handleSearch = async (value: string) => {
    if (value.trim() === "") {
      setOptions([]);
      return;
    }

    try {
      const problems = (await searchProblems(value)).problems as string[];
      const problemOptions = problems.map((problem) => ({
        value: `${problem}${Date.now()}`,
        label: problem,
      }));
      setOptions(problemOptions);
    } catch (error) {
      console.error("Error searching problems:", error);
      setOptions([]);
    }
  };

  return (
    <Command className="rounded-lg border shadow-md">
      <div className="flex items-center border-b px-3">
        <Search className="h-4 w-4 shrink-0 opacity-50" />
        <CommandInput
          value={searchText}
          onValueChange={(value) => {
            setSearchText(value);
            handleSearch(value);
          }}
          placeholder="Search LeetCode problems 🫡"
          className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      {options.length > 0 && (
        <CommandGroup className="max-h-60 overflow-auto">
          {options.map((option) => (
            <CommandItem
              key={option.value}
              onSelect={() => {
                setSearchText(option.label);
                setOptions([]);
              }}
              className="cursor-pointer"
            >
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      )}
      <CommandEmpty className="py-6 text-center text-sm">
        No problems found.
      </CommandEmpty>
    </Command>
  );
};

export default ProblemSearch;
