import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

interface AnimatedProfileRingProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function AnimatedProfileRing({ children, className = "", onClick }: AnimatedProfileRingProps) {
  const { theme, cycleTheme } = useTheme();

  const handleClick = () => {
    cycleTheme();
    onClick?.();
  };

  // Define ring colors based on theme
  const ringColors = {
    autumn: ["#8B4513", "#1a365d", "#0a0a0a", "#8B4513"],
    night: ["#1a365d", "#4a1a6b", "#0a0a0a", "#1a365d"],
    winter: ["#6b7280", "#374151", "#1f2937", "#6b7280"],
  };

  const currentColors = ringColors[theme];

  return (
    <motion.div
      className={`relative cursor-pointer ${className}`}
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Animated ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          padding: "3px",
          background: `linear-gradient(135deg, ${currentColors[0]}, ${currentColors[1]}, ${currentColors[2]}, ${currentColors[3]})`,
          backgroundSize: "300% 300%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="w-full h-full rounded-full bg-background" />
      </motion.div>
      
      {/* Content */}
      <div className="relative z-10 p-1">
        {children}
      </div>
    </motion.div>
  );
}
