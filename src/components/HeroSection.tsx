import { motion } from "framer-motion";
import { MapPin, GraduationCap, Mail, Linkedin, Github, Palette, Globe, ArrowRight } from "lucide-react";
import { profile } from "@/data/portfolio";
import profileImage from "@/assets/profile.png";
import { PaintCanvas } from "./PaintCanvas";

export function HeroSection() {
  return (
    <section
      id="about"
      className="min-h-fit pt-24 pb-8 scroll-mt-nav relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-paint-gold/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-paint-teal/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-paint-sienna/10 blur-2xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4">
          {/* About Card - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="painted-card oil-frame p-4 flex flex-col">
              {/* Profile Header - Compact */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden border-2 border-paint-gold/40">
                  <img
                    src={profileImage.src}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="font-heading text-xl md:text-2xl font-bold text-primary leading-tight"
                  >
                    {profile.name}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="font-body text-accent text-sm italic leading-relaxed max-w-xl"
                  >
                    {profile.tagline}
                  </motion.p>
                </div>
              </div>

              {/* Info Row - Horizontal with separators */}
              <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="font-body font-medium text-foreground">{profile.location}</span>
                </div>
                <span className="text-foreground/40">|</span>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="font-body font-medium text-foreground">{profile.citizenship}</span>
                </div>
                <span className="text-foreground/40">|</span>
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="font-body font-medium text-foreground">{profile.university}</span>
                </div>
              </div>

              {/* Contact Links - Inline */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted hover:bg-accent/10 transition-colors text-xs"
                >
                  <Mail className="w-3 h-3 text-accent" />
                  <span className="font-body text-foreground/80">{profile.email}</span>
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted hover:bg-accent/10 transition-colors text-xs"
                >
                  <Linkedin className="w-3 h-3 text-paint-navy" />
                  <span className="font-body text-foreground/80">LinkedIn</span>
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted hover:bg-accent/10 transition-colors text-xs"
                >
                  <Github className="w-3 h-3 text-foreground" />
                  <span className="font-body text-foreground/80">GitHub</span>
                </a>
              </div>

              {/* Intro + About */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-2.5"
              >
                <p className="font-body text-foreground/70 text-sm leading-relaxed">
                  {profile.intro}
                </p>
                {profile.about.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 24)}
                    className="font-body text-foreground/70 text-sm leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
                <p className="font-body text-sm font-medium text-primary">
                  {profile.availability}
                </p>
              </motion.div>

              {/* Calls to action */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95 }}
                className="flex flex-wrap gap-2 mt-4"
              >
                <a
                  href="#projects"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
                >
                  View Projects
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Get in touch
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* Paint Canvas - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="painted-card oil-frame p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Palette className="w-4 h-4 text-paint-sienna" />
                <h2 className="font-heading text-base font-semibold text-primary">
                  Notebook
                </h2>
                <span className="font-body text-xs text-muted-foreground">
                  Sketchpad. Draw, drop in an image, save what you make.
                </span>
              </div>
              <div className="flex-1">
                <PaintCanvas />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
