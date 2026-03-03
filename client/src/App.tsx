import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Explore from "@/components/explore/Explore";

import TopicChain from "@/components/topics/TopicChain";
import { Toaster } from "@/components/ui/toaster";
import Thread from "@/components/thread/Thread";
import History from "./components/history/History";

function App() {
  useEffect(() => {
    console.log("App mounted");
    document.body.classList.add("dark");
  }, []);

  return (
    <BrowserRouter>
      <div className="flex scrollbar-none">
        <Sidebar />
        <div className="min-h-screen flex-1">
          <main className="flex flex-col w-full h-full p-4 min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 scrollbar-none">
            <Routes>
              <Route path="/topics" element={<TopicChain />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/threads" element={<Thread />} />
              <Route path="/" element={<Explore />} />
              <Route path="/history" element={<History />} />
            </Routes>
            <Toaster />
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
