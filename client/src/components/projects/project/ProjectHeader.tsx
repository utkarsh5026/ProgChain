import { Card, CardContent } from "@/components/ui/card";
import { Rocket, Calendar, Clock, MessageCircle } from "lucide-react";
import React from "react";

interface ProjectDetails {
  title: string;
  description: string;
  createdAt: string;
  lastActive: string;
  totalConversations: number;
}

const projectDetails: ProjectDetails = {
  title: "System Design Interview Prep",
  description:
    "A comprehensive preparation guide for system design interviews, covering architectural patterns, scalability, and best practices.",
  createdAt: "2024-02-01",
  lastActive: "2024-02-05",
  totalConversations: 12,
};

const ProjectHeader: React.FC = () => {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-black/40 via-black/30 to-black/40 border-zinc-800/50 backdrop-blur-xl">
      {/* Subtle background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-purple-500/5" />

      {/* Corner decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent transform rotate-45 translate-x-16 -translate-y-16" />

      <CardContent className="relative p-6">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="relative group">
              {/* Icon background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 rounded-xl blur-xl group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-purple-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative size-14 rounded-xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex items-center justify-center border border-zinc-700/50 group-hover:border-zinc-600/50 shadow-lg shadow-primary/10 group-hover:shadow-primary/20 transition-all duration-300">
                <Rocket className="size-7 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-clip-text">
                <h1 className="text-2xl font-bold text-transparent">
                  {projectDetails.title}
                </h1>
              </div>
              <p className="text-sm text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                {projectDetails.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-2 border-t border-zinc-800/50">
            {/* Project metadata with hover effects */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800/30 transition-colors duration-200">
              <div className="relative size-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 flex items-center justify-center">
                <Calendar className="size-4 text-blue-400" />
              </div>
              <span className="text-sm text-zinc-400">
                Created {projectDetails.createdAt}
              </span>
            </div>

            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800/30 transition-colors duration-200">
              <div className="relative size-8 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 flex items-center justify-center">
                <Clock className="size-4 text-green-400" />
              </div>
              <span className="text-sm text-zinc-400">
                Last active {projectDetails.lastActive}
              </span>
            </div>

            <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800/30 transition-colors duration-200">
              <div className="relative size-8 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 flex items-center justify-center">
                <MessageCircle className="size-4 text-purple-400" />
              </div>
              <span className="text-sm text-zinc-400">
                {projectDetails.totalConversations} conversations
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectHeader;
