import { Button } from "@/components/ui/button";
import { SendHorizontal, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingButtonProps {
  buttonText: string;
  loading: boolean;
  onClick: () => void;
  disabled: boolean;
  loadingText?: string;
}

const MotionButton = motion(Button);

const LoadingButton: React.FC<LoadingButtonProps> = ({
  buttonText,
  loadingText,
  loading,
  onClick,
  disabled,
}) => {
  return (
    <MotionButton
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      variant="default"
      size="lg"
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full p-6 text-lg font-medium relative overflow-hidden
                ${loading ? "bg-primary/50" : "bg-primary hover:bg-primary/90"}
                transition-all duration-300 rounded-xl group shadow-md`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {loading ? (
        <div className="flex items-center justify-center gap-2 relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Loader2 className="w-6 h-6" />
          </motion.div>
          <span className="align-middle">{loadingText ?? "Loading..."}</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 relative z-10">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {buttonText}
          </motion.span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <SendHorizontal className="w-5 h-5" />
          </motion.div>
        </div>
      )}
    </MotionButton>
  );
};

export default LoadingButton;
