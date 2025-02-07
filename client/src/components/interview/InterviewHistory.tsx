import { Card, CardHeader, CardTitle } from "../ui/card";
import React from "react";

interface InterviewHistoryProps {
  history: {
    name: string;
    icon: React.ElementType;
    color: string;
  }[];
}

const InterviewHistory = ({ history }: InterviewHistoryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {history.map((topic) => (
        <Card
          key={topic.name}
          className="group cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
          onClick={() => {
            console.log(topic);
          }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <topic.icon className={`h-5 w-5 ${topic.color}`} />
              {topic.name}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default InterviewHistory;
