import React, { useState } from "react";
import { AutoComplete, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { searchProblems } from "../../store/leetcode/api";

const { Search } = Input;

interface ProblemOption {
  value: string;
  label: string;
}

/**
 * ProblemSearch component for searching LeetCode problems.
 *
 * This component provides an autocomplete search functionality for LeetCode problems.
 * It uses the Ant Design AutoComplete and Input components to create a search bar
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

  const onSelect = (value: string) => {
    const selectedOption = options.find((option) => option.value === value);
    if (selectedOption) setSearchText(selectedOption.label);
  };

  return (
    <AutoComplete
      options={options}
      onSelect={onSelect}
      onSearch={handleSearch}
      value={searchText}
      style={{ width: "100%" }}
    >
      <Search
        placeholder="Search LeetCode problems 🫡"
        enterButton={<SearchOutlined />}
        size="large"
        onChange={(e) => setSearchText(e.target.value)}
        onSearch={handleSearch}
      />
    </AutoComplete>
  );
};

export default ProblemSearch;
