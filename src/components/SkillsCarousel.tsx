import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { profile } from "@/data/portfolio";

export function SkillsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const categories = profile.skillCategories;

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % categories.length);
      }, 4000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, categories.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-muted/50 hover:bg-muted transition-colors"
        aria-label="Previous skill category"
      >
        <ChevronLeft className="w-4 h-4 text-primary" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-muted/50 hover:bg-muted transition-colors"
        aria-label="Next skill category"
      >
        <ChevronRight className="w-4 h-4 text-primary" />
      </button>

      {/* Carousel Content */}
      <div className="overflow-hidden px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <h3 className="font-heading text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              {categories[currentIndex].category}
            </h3>
            <div className="flex flex-wrap justify-center gap-1.5">
              {categories[currentIndex].items.map((skill) => (
                <span
                  key={skill}
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  className="px-2 py-1 text-[10px] font-medium rounded bg-primary/10 text-primary border border-primary/20 cursor-default transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:border-accent hover:scale-110 hover:shadow-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {categories.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              idx === currentIndex
                ? "bg-primary"
                : "bg-primary/30 hover:bg-primary/50"
            }`}
            aria-label={`Go to skill category ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
