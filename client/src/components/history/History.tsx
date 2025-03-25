import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const History: React.FC = () => {
  return (
    <div className="p-4 w-1/2 mx-auto">
      <Tabs defaultValue="topic" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="topic">Topic Chats</TabsTrigger>
          <TabsTrigger value="explore">Explore History</TabsTrigger>
          <TabsTrigger value="progchain">Progchain History</TabsTrigger>
        </TabsList>

        <TabsContent value="topic">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Topic Chats</h3>
              {/* Add your Topic Chats content here */}
              <div className="text-muted-foreground">
                Your topic-based chat history will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="explore">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Explore History</h3>
              {/* Add your Explore History content here */}
              <div className="text-muted-foreground">
                Your exploration chat history will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progchain">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Progchain History</h3>
              {/* Add your Progchain History content here */}
              <div className="text-muted-foreground">
                Your progchain history will appear here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default History;
