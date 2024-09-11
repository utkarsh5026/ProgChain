import TopicDisplay from "./components/topics/TopicExplorer";
import "./App.css";

function App() {
  const topics = {
    beginner: [
      { emoji: "🌱", topic: "React Basics" },
      { emoji: "🏗️", topic: "JSX Syntax" },
      { emoji: "🔄", topic: "Component Lifecycle" },
    ],
    intermediate: [
      { emoji: "🎣", topic: "React Hooks" },
      { emoji: "🔍", topic: "Context API" },
      { emoji: "🚦", topic: "State Management" },
    ],
    advanced: [
      { emoji: "🧪", topic: "Testing with Jest" },
      { emoji: "🔧", topic: "Performance Optimization" },
      { emoji: "🔐", topic: "Security Best Practices" },
    ],
  };

  return (
    <>
      <TopicDisplay topic="React" topics={topics} isLoading={false} />
    </>
  );
}

export default App;
