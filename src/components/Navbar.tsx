import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Linkedin, Github, Mail, Leaf, CloudRain, Snowflake } from "lucide-react";
import { profile } from "@/data/portfolio";
import { useTheme, ThemeMode } from "@/contexts/ThemeContext";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

const themeIcons: Record<ThemeMode, React.ComponentType<{ className?: string }>> = {
  autumn: Leaf,
  night: CloudRain,
  winter: Snowflake,
};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isIconClicked, setIsIconClicked] = useState(false);
  const { theme, cycleTheme } = useTheme();
  
  const ThemeIcon = themeIcons[theme];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`transition-all duration-300 ${
        isScrolled ? "navbar-glass shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Theme Icon */}
        <button
          onClick={() => {
            setIsIconClicked(true);
            cycleTheme();
            setTimeout(() => setIsIconClicked(false), 300);
          }}
          className="flex items-center justify-center p-2 rounded-lg transition-all duration-300 hover:bg-muted group"
          aria-label="Change weather theme"
        >
          <ThemeIcon 
            className={`w-6 h-6 transition-all duration-300 ${
              isIconClicked 
                ? "text-accent drop-shadow-[0_0_12px_hsl(var(--accent))]" 
                : "text-primary group-hover:text-accent group-hover:drop-shadow-[0_0_8px_hsl(var(--accent))]"
            }`} 
          />
        </button>

        {/* Center: Nav Links (Desktop) */}
        <ul className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.name}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="font-body text-sm font-medium text-foreground/80 hover:text-accent transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-paint-gold group-hover:w-full transition-all duration-300" />
              </button>
            </li>
          ))}
        </ul>

        {/* Right: Social Icons */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-card hover:bg-muted transition-colors group"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-paint-navy group-hover:text-paint-teal transition-colors" />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-card hover:bg-muted transition-colors group"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4 text-paint-navy group-hover:text-paint-teal transition-colors" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="p-2 rounded-full bg-card hover:bg-muted transition-colors group"
              aria-label="Email"
            >
              <Mail className="w-4 h-4 text-paint-navy group-hover:text-paint-teal transition-colors" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-card hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden navbar-glass border-t border-border"
          >
            <ul className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleNavClick(link.href)}
                    className="w-full text-left font-body text-base font-medium text-foreground/80 hover:text-accent transition-colors py-2"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
              <li className="flex items-center gap-4 pt-2 border-t border-border">
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-muted hover:bg-card transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-paint-navy" />
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-muted hover:bg-card transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5 text-paint-navy" />
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="p-2 rounded-full bg-muted hover:bg-card transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5 text-paint-navy" />
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
