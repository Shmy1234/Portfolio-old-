"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ContactSection } from "@/components/ContactSection";
import { FallingLeaves } from "@/components/FallingLeaves";
import { FallingRain } from "@/components/FallingRain";
import { FallingSnow } from "@/components/FallingSnow";
import { ScrollRevealIntro } from "@/components/ScrollRevealIntro";
import { useTheme } from "@/contexts/ThemeContext";
import canvasTexture from "@/assets/canvas-texture.jpg";
import { useRef } from "react";

const Index = () => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();

  // Navbar appears after scrolling past intro
  const navbarOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const navbarY = useTransform(scrollYProgress, [0, 0.1], [-100, 0]);

  // Static background style - no theme changes
  const backgroundStyle = {
    backgroundImage: `url(${canvasTexture.src})`,
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    backgroundPosition: "center",
  };

  const renderParticles = () => {
    switch (theme) {
      case "night":
        return <FallingRain />;
      case "winter":
        return <FallingSnow />;
      default:
        return <FallingLeaves />;
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="min-h-screen relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background layer */}
      <div className="absolute inset-0" style={backgroundStyle} />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 pointer-events-none bg-background/70" />

      {/* 3D Particle Animation */}
      {renderParticles()}

      {/* Scroll Reveal Intro */}
      <ScrollRevealIntro />

      {/* Animated Navbar - appears on scroll */}
      <motion.div
        style={{ opacity: navbarOpacity, y: navbarY }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <Navbar />
      </motion.div>

      {/* Content */}
      <div className="relative z-10">
        <main>
          <HeroSection />
          <ExperienceSection />
          <ProjectsSection />
          <ContactSection />
        </main>
      </div>
    </motion.div>
  );
};

export default Index;
