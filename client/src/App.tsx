import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Explore from "@/components/explore/Explore";
import Interview from "@/components/interview/Interview";
import Leetcode from "@/components/leetcode/Leetcode";
import TopicChain from "@/components/topics/TopicChain";
import { Toaster } from "@/components/ui/toaster";

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
              <Route path="/interview" element={<Interview />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/leetcode/*" element={<Leetcode />} />
              <Route path="/" element={<Explore />} />
            </Routes>
            <Toaster />
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
