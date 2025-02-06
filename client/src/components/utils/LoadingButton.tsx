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

const LoadingButton: React.FC<LoadingButtonProps> = ({
  buttonText,
  loadingText,
  loading,
  onClick,
  disabled,
}) => {
  return (
    <Button
      variant="default"
      size="lg"
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-6 text-lg font-medium relative overflow-hidden
                      ${
                        loading
                          ? "bg-primary/50"
                          : "bg-primary hover:bg-primary/90"
                      }
                      transition-all duration-300 rounded-xl group
                    `}
    >
      <motion.div
        animate={
          !loading
            ? {
                background: [
                  "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)",
                  "linear-gradient(0deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                  "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)",
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0"
      />

      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Loader2 className="w-6 h-6" /> {loadingText}
        </motion.div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <span>{buttonText}</span>
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
    </Button>
  );
};

export default LoadingButton;
