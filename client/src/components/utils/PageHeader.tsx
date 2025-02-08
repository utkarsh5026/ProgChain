import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const iconContainerVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

interface PageHeaderProps {
  title: string;
  description: string;
  icons: React.ReactNode[];
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icons,
}) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("text-center mb-12 space-y-8 relative")}
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-32 bg-gradient-to-r from-transparent via-primary/5 to-transparent rotate-3 blur-xl" />
      </div>

      {/* Icons section */}
      <motion.div
        variants={iconContainerVariants}
        animate="animate"
        className={cn("flex justify-center gap-6 mb-8")}
      >
        {icons.map((icon, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{
              scale: 1.4,
              rotate: index % 2 === 0 ? 10 : -10,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 10,
              },
            }}
            className="relative group"
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-0 group-hover:scale-150 transition-transform duration-300" />

            {/* Icon wrapper */}
            <div className="relative transform transition-transform duration-300 hover:drop-shadow-glow">
              {icon}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <h1
        className={cn(
          "text-2xl md:text-4xl font-bold",
          "bg-clip-text text-transparent",
          "bg-gradient-to-r from-primary via-indigo-400 to-primary",
          "animate-gradient tracking-tight"
        )}
      >
        {title}
      </h1>

      <p
        className={cn(
          "text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto",
          "font-light leading-relaxed"
        )}
      >
        {description}
      </p>
    </motion.div>
  );
};

export default PageHeader;
