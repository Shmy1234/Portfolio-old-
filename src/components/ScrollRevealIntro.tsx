import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

interface ScrollRevealIntroProps {
  onScrollComplete?: () => void;
}

export function ScrollRevealIntro({ onScrollComplete }: ScrollRevealIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Transform values based on scroll
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const blur = useTransform(scrollYProgress, [0, 0.5], [0, 10]);

  return (
    <div ref={containerRef} className="h-screen relative">
      <motion.div
        style={{ opacity, scale, y }}
        className="fixed inset-0 flex flex-col items-center justify-center z-40 pointer-events-none"
      >
        <motion.div
          style={{ 
            filter: useTransform(blur, (v) => `blur(${v}px)`)
          }}
          className="text-center px-4"
        >
          {/* Main name with paint effect */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 100 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-6"
          >
            <span className="relative">
              Sahil Regonda
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-paint-gold via-paint-sienna to-paint-teal origin-left"
              />
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="font-body text-base md:text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed"
          >
            Software engineer building dependable full-stack and AI products. My
            work spans product interfaces, backend services, data contracts,
            testing, and ML deployment across five engineering internships.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="mt-12"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 text-foreground/50"
            >
              <span className="font-body text-sm">Scroll to explore</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Background paint splatters */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-paint-gold blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-paint-teal blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.08, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.7 }}
            className="absolute top-1/3 right-1/3 w-32 h-32 rounded-full bg-paint-sienna blur-2xl"
          />
        </div>
      </motion.div>
    </div>
  );
}
