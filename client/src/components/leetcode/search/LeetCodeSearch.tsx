import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Filter, Clock, Tag, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchTags } from "@/store/leetcode/api";
import SelectedFilters from "./SelectedFilters";

type Difficulty = "Easy" | "Medium" | "Hard";

interface SearchFilters {
  difficulties: Difficulty[];
  tags: string[];
  acceptanceRate: {
    min: number;
    max: number;
  };
}

const LeetCodeSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<SearchFilters>({
    difficulties: [],
    tags: [],
    acceptanceRate: { min: 0, max: 100 },
  });
  const [searchHistory] = useState<string[]>([
    "Dynamic Programming",
    "Binary Search Tree",
    "Array manipulation",
  ]);
  const searchRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTags().then((tags) => {
      setAvailableTags(tags);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedFilters((prev) => {
      const difficulties = prev.difficulties.includes(difficulty)
        ? prev.difficulties.filter((d) => d !== difficulty)
        : [...prev.difficulties, difficulty];
      return { ...prev, difficulties };
    });
  };

  const handleTagChange = (tag: string) => {
    setSelectedFilters((prev) => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags };
    });
  };

  const clearFilters = () => {
    setSelectedFilters({
      difficulties: [],
      tags: [],
      acceptanceRate: { min: 0, max: 100 },
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto" ref={searchRef}>
      {/* Main Search Bar */}
      <div className="relative">
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-12 px-3 w-full">
            <CommandInput
              className="flex-1"
              placeholder="Search problems by name, tag, or difficulty..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              onFocus={() => setIsSearchOpen(true)}
            />
            {selectedFilters.difficulties.length > 0 ||
            selectedFilters.tags.length > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={clearFilters}
              >
                <X className="w-4 h-4" />
              </Button>
            ) : null}
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="px-2">
                  <Filter className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  {/* Difficulty Filters */}
                  <div>
                    <h4 className="font-medium mb-2">Difficulty Level</h4>
                    <div className="flex gap-2">
                      {["Easy", "Medium", "Hard"].map((difficulty) => (
                        <Button
                          key={difficulty}
                          variant={
                            selectedFilters.difficulties.includes(
                              difficulty as Difficulty
                            )
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleDifficultyChange(difficulty as Difficulty)
                          }
                          className={
                            difficulty === "Easy"
                              ? "text-green-600"
                              : difficulty === "Medium"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }
                        >
                          {difficulty}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Tags Filter */}
                  <div>
                    <h4 className="font-medium mb-2">Problem Tags</h4>
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-2">
                        {availableTags.map((tag) => (
                          <div
                            key={tag}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={tag}
                              checked={selectedFilters.tags.includes(tag)}
                              onCheckedChange={() => handleTagChange(tag)}
                            />
                            <label
                              htmlFor={tag}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {tag}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Applied Filters */}
                  <div className="flex flex-wrap gap-2">
                    {selectedFilters.difficulties.map((difficulty) => (
                      <Badge
                        key={difficulty}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleDifficultyChange(difficulty)}
                      >
                        {difficulty}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                    {selectedFilters.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => handleTagChange(tag)}
                      >
                        {tag}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full bg-background border rounded-b-lg shadow-lg z-50"
              >
                <CommandList className="z-10">
                  <CommandEmpty>No results found.</CommandEmpty>

                  <CommandGroup heading="Recent Searches">
                    {searchHistory.map((search) => (
                      <CommandItem
                        key={search}
                        onSelect={() => setSearchQuery(search)}
                        className="flex items-center"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        {search}
                      </CommandItem>
                    ))}
                  </CommandGroup>

                  <CommandGroup heading="Popular Tags">
                    {availableTags.slice(0, 5).map((tag) => (
                      <CommandItem
                        key={tag}
                        onSelect={() => handleTagChange(tag)}
                        className="flex items-center"
                      >
                        <Tag className="w-4 h-4 mr-2" />
                        {tag}
                        {selectedFilters.tags.includes(tag) && (
                          <CheckCircle2 className="w-4 h-4 ml-auto text-green-500" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </motion.div>
            )}
          </AnimatePresence>
        </Command>
      </div>

      <SelectedFilters
        selectedFilters={selectedFilters}
        onClear={clearFilters}
        onDifficultyChange={handleDifficultyChange}
        onTagChange={handleTagChange}
      />
    </div>
  );
};

export default LeetCodeSearch;
