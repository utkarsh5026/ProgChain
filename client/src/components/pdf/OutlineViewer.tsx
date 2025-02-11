import React, { useState } from "react";
import {
  Folder,
  FolderOpen,
  File,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export interface OutlineItem {
  title: string;
  dest: any;
  items?: OutlineItem[];
}

interface OutlineViewerProps {
  outline: OutlineItem[];
  onItemClick?: (item: OutlineItem) => void;
}

const TreeItem: React.FC<{
  item: OutlineItem;
  onItemClick?: (item: OutlineItem) => void;
}> = ({ item, onItemClick }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = item.items && item.items.length > 0;

  // Extract nested ternary into an independent variable
  const icon = hasChildren ? (
    expanded ? (
      <FolderOpen className="w-4 h-4 text-blue-500" />
    ) : (
      <Folder className="w-4 h-4 text-blue-500" />
    )
  ) : (
    <File className="w-4 h-4 text-gray-500" />
  );

  return (
    <li>
      <button
        type="button"
        className="flex items-center space-x-1 px-2 py-1 hover:bg-gray-200 cursor-pointer rounded"
        onClick={() => onItemClick && onItemClick(item)}
      >
        {icon}
        <span className="text-sm text-gray-500">{item.title}</span>
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="focus:outline-none"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}
      </button>
      {hasChildren && expanded && (
        <ul className="ml-4 border-l border-gray-200">
          {item.items!.map((child, idx) => (
            <TreeItem key={idx} item={child} onItemClick={onItemClick} />
          ))}
        </ul>
      )}
    </li>
  );
};

const OutlineViewer: React.FC<OutlineViewerProps> = ({
  outline,
  onItemClick,
}) => {
  return (
    <div className="p-4 shadow-sm rounded">
      <ul className="list-none">
        {outline.map((item, idx) => (
          <TreeItem key={idx} item={item} onItemClick={onItemClick} />
        ))}
      </ul>
    </div>
  );
};

export default OutlineViewer;
