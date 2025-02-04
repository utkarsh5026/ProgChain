import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
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
    <motion.div variants={itemVariants} className="text-center mb-12 space-y-6">
      <motion.div
        className="flex justify-center gap-6 mb-8"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {icons.map((icon, index) => (
          <motion.div
            key={icon?.toString()}
            whileHover={{ scale: 1.1, rotate: index % 2 === 0 ? 10 : -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {icon}
          </motion.div>
        ))}
      </motion.div>

      <h1
        className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent 
              bg-gradient-to-r from-primary via-indigo-400 to-primary animate-gradient"
      >
        {title}
      </h1>
      <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto font-light">
        {description}
        preparation
      </p>
    </motion.div>
  );
};

export default PageHeader;
