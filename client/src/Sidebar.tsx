import { useLocation, useNavigate } from "react-router-dom";
import { Book, Users, FormInput, GitPullRequest, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "/topics",
      icon: <Book className="h-5 w-5" />,
      title: "Topics",
    },
    {
      key: "/interview",
      icon: <Users className="h-5 w-5" />,
      title: "Interview",
    },
    {
      key: "/quiz",
      icon: <FormInput className="h-5 w-5" />,
      title: "Quiz",
    },
    {
      key: "/flow",
      icon: <GitPullRequest className="h-5 w-5" />,
      title: "Flow",
    },
    {
      key: "/explore",
      icon: <Compass className="h-5 w-5" />,
      title: "Explore",
    },
    {
      key: "/leetcode",
      icon: <img src="/leetcode.png" alt="Leetcode" className="h-5 w-5" />,
      title: "Leetcode",
    },
  ];

  return (
    <div className="h-screen w-16 bg-gradient-to-br from-slate-950 via-slate-800 to-slate-950 animate-gradient">
      <NavigationMenu orientation="vertical" className="h-full">
        <NavigationMenuList className="flex flex-col gap-2 p-2">
          {menuItems.map((item) => (
            <NavigationMenuItem key={item.key}>
              <button
                onClick={() => navigate(item.key)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-slate-800/50 hover:backdrop-blur-sm",
                  location.pathname === item.key &&
                    "bg-slate-800/50 backdrop-blur-sm"
                )}
                title={item.title}
              >
                {item.icon}
              </button>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default Sidebar;
