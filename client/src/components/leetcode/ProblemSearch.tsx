import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  Code2,
  Command as CommandIcon,
  XCircle,
} from "lucide-react";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { searchProblems } from "../../store/leetcode/api";
import debounce from "lodash/debounce";

interface ProblemOption {
  value: string;
  label: string;
}

const ProblemSearch: React.FC = () => {
  const [options, setOptions] = useState<ProblemOption[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounced search function to prevent too many API calls
  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      if (value.trim() === "") {
        setOptions([]);
        setIsLoading(false);
        return;
      }

      try {
        const problems = (await searchProblems(value)).problems as string[];
        const problemOptions = problems.map((problem) => ({
          value: `${problem}${Date.now()}`,
          label: problem,
        }));
        setOptions(problemOptions);
        setError(null);
      } catch (error) {
        console.error("Error searching problems:", error);
        setError("Failed to fetch problems. Please try again.");
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  const handleSearch = async (value: string) => {
    setSearchText(value);
    setIsLoading(true);
    setError(null);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setSearchText("");
    setOptions([]);
    setError(null);
    searchInputRef.current?.focus();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="w-full max-w-2xl mx-auto"
    >
      <Command className="rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-xl backdrop-blur-sm">
        <div className="flex items-center border-b border-zinc-800 px-4 py-2">
          <div className="flex items-center flex-1 gap-2">
            <CommandIcon className="h-5 w-5 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-400">Search</span>
          </div>
          <Badge variant="outline" className="bg-zinc-900">
            <Code2 className="w-3 h-3 mr-1" />
            {options.length} results
          </Badge>
        </div>

        <div className="flex items-center border-b border-zinc-800 px-4 relative">
          <Search className="h-4 w-4 shrink-0 text-zinc-400" />
          <CommandInput
            ref={searchInputRef}
            value={searchText}
            onValueChange={handleSearch}
            placeholder="Search LeetCode problems..."
            className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-zinc-500"
          />
          {searchText && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0 hover:bg-zinc-800"
            >
              <XCircle className="h-4 w-4 text-zinc-400" />
            </Button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="py-8 text-center"
            >
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-sm text-zinc-400">
                Searching problems...
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="py-8 text-center text-red-400"
            >
              <p className="text-sm">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSearch(searchText)}
                className="mt-2"
              >
                Try again
              </Button>
            </motion.div>
          ) : options.length > 0 ? (
            <CommandGroup className="max-h-[300px] overflow-auto">
              <AnimatePresence>
                {options.map((option, index) => (
                  <motion.div
                    key={option.value}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ delay: index * 0.05 }}
                  >
                    <CommandItem
                      onSelect={() => {
                        setSearchText(option.label);
                        setOptions([]);
                      }}
                      className="cursor-pointer hover:bg-zinc-800 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-primary" />
                        <span>{option.label}</span>
                      </div>
                    </CommandItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CommandGroup>
          ) : searchText ? (
            <CommandEmpty className="py-8 text-center">
              <p className="text-sm text-zinc-400">
                No problems found for "{searchText}"
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Try searching with different keywords
              </p>
            </CommandEmpty>
          ) : (
            <CommandEmpty className="py-8 text-center">
              <Code2 className="h-8 w-8 mx-auto text-zinc-600 mb-2" />
              <p className="text-sm text-zinc-400">
                Start typing to search problems
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Use problem names or keywords
              </p>
            </CommandEmpty>
          )}
        </AnimatePresence>
      </Command>
    </motion.div>
  );
};

export default ProblemSearch;
