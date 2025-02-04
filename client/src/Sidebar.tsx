import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Book, Users, Compass, GraduationCap, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "/topics",
      icon: <Book className="h-5 w-5" />,
      title: "Topics",
      description: "Explore programming topics",
    },
    {
      key: "/interview",
      icon: <Users className="h-5 w-5" />,
      title: "Interview",
      description: "Practice interview questions",
    },
    {
      key: "/explore",
      icon: <Compass className="h-5 w-5" />,
      title: "Explore",
      description: "Discover new concepts",
    },
    {
      key: "/leetcode",
      icon: (
        <img
          src="https://www.svgrepo.com/show/306328/leetcode.svg"
          alt="Leetcode"
          className={cn(
            "h-5 w-5",
            location.pathname === "/leetcode"
              ? "text-primary [&]:brightness-100 [&]:invert-[0.85]"
              : "text-zinc-400 [&]:brightness-100 [&]:invert-[0.6]"
          )}
        />
      ),
      title: "LeetCode",
      description: "Practice coding problems",
    },
    {
      key: "/projects",
      icon: <Code className="h-5 w-5" />,
      title: "Projects",
      description: "Showcase your projects",
    },
  ];

  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="relative h-screen w-16 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 backdrop-blur-lg shadow-xl"
    >
      <div className="flex items-start justify-center h-16 border-b border-zinc-800/50">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4"
        >
          <GraduationCap className="h-8 w-8 text-primary" />
        </motion.div>
      </div>

      <NavigationMenu
        orientation="vertical"
        className="h-[calc(100%-4rem)] pt-2"
      >
        <NavigationMenuList className="flex flex-col gap-2 p-2 items-start">
          <TooltipProvider>
            {menuItems.map((item) => (
              <NavigationMenuItem key={item.key}>
                <Tooltip>
                  <TooltipTrigger>
                    <motion.button
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(item.key)}
                      className={cn(
                        "relative flex h-10 w-12 items-center justify-start pl-3 rounded-xl transition-all duration-200",
                        "hover:bg-zinc-800/80 hover:shadow-lg hover:shadow-zinc-900/20",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-zinc-900",
                        location.pathname === item.key && [
                          "bg-primary/10 text-primary",
                          "before:absolute before:inset-0 before:rounded-xl",
                          "before:bg-primary/10 before:blur-lg before:-z-10",
                        ]
                      )}
                    >
                      <motion.div
                        animate={{
                          scale: location.pathname === item.key ? 1.1 : 1,
                        }}
                        className={cn(
                          "transition-colors duration-200",
                          location.pathname === item.key
                            ? "text-primary"
                            : "text-zinc-400"
                        )}
                      >
                        {item.icon}
                      </motion.div>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    sideOffset={10}
                    className="dark:bg-zinc-900"
                  >
                    <div className="text-sm">
                      <p className="font-medium dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {item.description}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </NavigationMenuItem>
            ))}
          </TooltipProvider>
        </NavigationMenuList>
      </NavigationMenu>

      <motion.div
        className="absolute right-0 w-1 h-10 bg-primary rounded-l-full"
        animate={{
          top: `${
            4 +
            menuItems.findIndex((item) => item.key === location.pathname) * 3
          }rem`,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      />
    </motion.div>
  );
};

export default Sidebar;
