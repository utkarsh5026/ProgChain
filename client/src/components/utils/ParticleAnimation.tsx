import React from "react";
import { motion } from "framer-motion";

interface ParticleAnimationProps {
  width?: string;
  height?: number;
  particleCount?: number;
  minDuration?: number;
  maxDuration?: number;
}

/**
 * ParticleAnimation Component
 *
 * This component creates an animated particle effect using Framer Motion.
 * It renders a container with multiple colored particles moving across the screen.
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} [props.width="100%"] - The width of the animation container
 * @param {number} [props.height=200] - The height of the animation container in pixels
 * @param {number} [props.particleCount=20] - The number of particles to render
 * @param {number} [props.minDuration=8] - The minimum duration of a particle's animation in seconds
 * @param {number} [props.maxDuration=12] - The maximum duration of a particle's animation in seconds
 * @returns {React.ReactElement} The rendered ParticleAnimation component
 */
const ParticleAnimation: React.FC<ParticleAnimationProps> = ({
  width = "100%",
  height = 200,
  particleCount = 20,
  minDuration = 8,
  maxDuration = 12,
}) => {
  return (
    <motion.div
      style={{
        width: width,
        height: height,
        background: "#f0f0f0",
        borderRadius: 8,
        overflow: "hidden",
        position: "relative",
        margin: "20px 0",
      }}
      animate={{
        boxShadow: [
          "0 0 0 rgba(0,0,0,0.1)",
          "0 0 10px rgba(0,0,0,0.2)",
          "0 0 0 rgba(0,0,0,0.1)",
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {[...Array(particleCount)].map((_, index) => (
        <motion.div
          key={index}
          style={{
            position: "absolute",
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: `hsl(${index * (360 / particleCount)}, 100%, 50%)`,
            top: `${Math.random() * 100}%`,
            left: "-10px",
          }}
          animate={{
            x: ["0%", "calc(100vw + 10px)"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: minDuration + Math.random() * (maxDuration - minDuration),
            repeat: Infinity,
            delay: Math.random() * maxDuration,
            ease: "linear",
          }}
        />
      ))}
      <motion.div
        style={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 14,
          color: "#666",
          fontWeight: "bold",
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      ></motion.div>
    </motion.div>
  );
};

export default ParticleAnimation;
