import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Infinity } from "lucide-react";
import { cn } from "@/lib/utils";
import { menuItems } from "./menuItems";

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

/**
 * Sidebar component for navigation.
 *
 * This component renders a sidebar with navigation items. It uses motion from 'framer-motion' for animations.
 * It also uses 'react-router-dom' for navigation and 'lucide-react' for icons.
 *
 * @returns The Sidebar component.
 */
const Sidebar: React.FC = () => {
  /**
   * Hook to get the current location from 'react-router-dom'.
   */
  const location = useLocation();
  /**
   * Hook to navigate to a new location from 'react-router-dom'.
   */
  const navigate = useNavigate();

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
                          "transition-colors duration-200 relative",
                          location.pathname === item.key
                            ? "text-primary"
                            : "text-zinc-400"
                        )}
                      >
                        {location.pathname === item.key && (
                          <motion.div
                            className={cn(
                              "absolute inset-0 -z-10 rounded-full blur-md opacity-70 bg-gradient-to-r",
                              item.gradient
                            )}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                              opacity: 0.7,
                              scale: 1.2,
                              rotate: [0, 5, 0, -5, 0],
                            }}
                            transition={{
                              rotate: {
                                repeat: Infinity,
                                duration: 5,
                                ease: "easeInOut",
                              },
                            }}
                          />
                        )}

                        <motion.div
                          className={cn(
                            "absolute inset-0 -z-10 rounded-full blur-md opacity-0 bg-gradient-to-r",
                            item.gradient
                          )}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileHover={{
                            opacity: 0.4,
                            scale: 1.2,
                            transition: { duration: 0.3 },
                          }}
                          transition={{ duration: 0.3 }}
                        />

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
