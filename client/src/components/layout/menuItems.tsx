import {
  Book,
  Compass,
  Dna,
  History,
} from "lucide-react";

export const menuItems = [
  {
    key: "/topics",
    icon: <Book className="h-5 w-5" />,
    title: "Topics",
    description: "Explore programming topics",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    key: "/explore",
    icon: <Compass className="h-5 w-5" />,
    title: "Explore",
    description: "Discover new concepts",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    key: "/threads",
    icon: <Dna className="h-5 w-5" />,
    title: "Threads",
    description: "Share your thoughts",
    gradient: "from-purple-500 to-fuchsia-500",
  },
  {
    key: "/history",
    icon: <History className="h-5 w-5" />,
    title: "History",
    description: "View your chat history",
    gradient: "from-sky-500 to-blue-500",
  },
];
