import React, { useEffect, useState, useCallback, memo } from "react";

type Node = {
  id: number;
  x: number;
  y: number;
  size: number;
  pulseDelay: number;
};

type Link = {
  id: string;
  source: number;
  target: number;
  strength: number;
};

const AILoadingAnimationComponent: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const [wave, setWave] = useState(0);

  const generateWavePoints = useCallback((offset: number) => {
    const points = [];
    for (let i = 0; i <= 100; i += 2) {
      const x = i;
      const y = 50 + Math.sin((i / 100) * Math.PI * 2 + offset) * 15;
      points.push({ x, y });
    }
    return points;
  }, []);

  useEffect(() => {
    const nodeCount = 20;
    const newNodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      x: 15 + (70 * i) / (nodeCount - 1),
      y: 30 + Math.sin(i * 0.5) * 20 + Math.random() * 10,
      size: 2 + Math.random(),
      pulseDelay: i * 0.15,
    }));

    const newLinks: Link[] = [];
    newNodes.forEach((_node, i) => {
      if (i < newNodes.length - 1) {
        newLinks.push({
          id: `link-${i}`,
          source: i,
          target: i + 1,
          strength: Math.random() * 0.5 + 0.5,
        });
      }
      if (i < newNodes.length - 2 && Math.random() > 0.5) {
        newLinks.push({
          id: `cross-${i}`,
          source: i,
          target: i + 2,
          strength: Math.random() * 0.3 + 0.2,
        });
      }
    });

    setNodes(newNodes);
    setLinks(newLinks);
  }, []);

  useEffect(() => {
    const waveInterval = setInterval(() => {
      setWave((prev) => (prev + 0.08) % (Math.PI * 2));
    }, 200);

    const nodeInterval = setInterval(() => {
      setActiveNodeIndex((prev) => (prev + 1) % nodes.length);
    }, 650);

    return () => {
      clearInterval(waveInterval);
      clearInterval(nodeInterval);
    };
  }, [nodes.length]);

  generateWavePoints(wave);

  return (
    <div className="w-full h-64 relative overflow-hidden rounded-lg">
      {/* Rich gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-primary/10 to-cyan-500/5 animate-pulse duration-[4000ms]" />

      <svg className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Radial gradient for nodes */}
          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="1" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.6" />
          </radialGradient>

          {/* Enhanced glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 15 -4"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Animated wave patterns */}
        {[0, 1, 2].map((offset) => (
          <path
            key={offset}
            d={`M ${generateWavePoints(wave + offset * 0.5)
              .map((p) => `${p.x} ${p.y + offset * 10}`)
              .join(" L ")}`}
            fill="none"
            stroke="url(#flowGradient)"
            strokeWidth="1"
            className="opacity-30"
            strokeLinecap="round"
          />
        ))}

        {/* Network links with gradient effect */}
        {links.map((link) => {
          const source = nodes[link.source];
          const target = nodes[link.target];
          if (!source || !target) return null;

          return (
            <line
              key={link.id}
              x1={`${source.x}%`}
              y1={`${source.y}%`}
              x2={`${target.x}%`}
              y2={`${target.y}%`}
              className="stroke-indigo-400"
              strokeWidth={link.strength}
              strokeOpacity={0.3}
              strokeLinecap="round"
            >
              <animate
                attributeName="strokeOpacity"
                values="0.2;0.4;0.2"
                dur="3s"
                repeatCount="indefinite"
              />
            </line>
          );
        })}

        {/* Enhanced network nodes */}
        {nodes.map((node, i) => (
          <g key={node.id} filter="url(#glow)">
            <circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r={node.size}
              fill="url(#nodeGradient)"
              className={`
                transition-all duration-700 ease-in-out
                ${
                  i === activeNodeIndex
                    ? "opacity-100 scale-150"
                    : "opacity-40 scale-100"
                }
              `}
            >
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur="2s"
                begin={`${node.pulseDelay}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
      </svg>

      {/* Enhanced loading indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-primary/20 to-purple-500/10 border border-indigo-500/20 backdrop-blur-md">
          <div className="flex gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-primary animate-bounce"
                style={{
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: "1s",
                }}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-indigo-100">
            Processing response...
          </span>
        </div>
      </div>
    </div>
  );
};

const AILoadingAnimation = memo(AILoadingAnimationComponent);
export default AILoadingAnimation;
