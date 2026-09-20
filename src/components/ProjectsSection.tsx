import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Globe, ChevronDown, Github } from "lucide-react";
import { useState } from "react";
import { projects, Project } from "@/data/portfolio";

const CATEGORY_LABEL: Record<Project["category"], string> = {
  ai: "AI Engineering",
  ml: "Machine Learning",
  algorithms: "Algorithms",
  game: "Game",
};

export function ProjectsSection() {
  return (
    <section id="projects" className="py-12 scroll-mt-nav relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary section-heading">
            Projects
          </h2>
          <p className="font-body text-muted-foreground mt-4 max-w-2xl mx-auto">
            Built end to end, from model training through to the deployed interface.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="w-full lg:w-[calc(50%-12px)]"
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasHighlights = !!project.highlights?.length;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="painted-card oil-frame h-full flex flex-col"
    >
      <div className="p-5 flex flex-col flex-1">
        {/* Title row */}
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <h3 className="font-heading text-xl font-semibold text-primary">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-paint-teal/15 text-paint-teal font-medium">
              {CATEGORY_LABEL[project.category]}
            </span>
            <span className="text-xs text-muted-foreground">{project.year}</span>
          </div>
        </div>

        {/* Blurb */}
        <p className="font-body text-sm text-accent italic mb-3">
          {project.blurb}
        </p>

        {/* Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {project.metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex-1 min-w-[6.5rem] rounded-md bg-paint-gold/10 border border-paint-gold/25 px-2 py-1.5"
              >
                <div className="font-heading text-base font-bold text-primary leading-none">
                  {metric.value}
                </div>
                <div className="text-[10px] text-muted-foreground leading-tight mt-1">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <div className="space-y-2.5 mb-3">
          {project.description.split("\n\n").map((paragraph) => (
            <p
              key={paragraph.slice(0, 24)}
              className="font-body text-sm text-foreground/70"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Highlights */}
        {hasHighlights && (
          <>
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden space-y-1.5 mb-2"
                >
                  {project.highlights!.map((highlight, i) => (
                    <li
                      key={i}
                      className="font-body text-sm text-foreground/70 flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-paint-sienna mt-[7px] shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              className="self-start mb-3 text-xs text-accent hover:text-paint-sienna flex items-center gap-1 transition-colors"
            >
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                <ChevronDown className="w-3 h-3" />
              </motion.span>
              {isExpanded ? "Hide details" : "How I built it"}
            </button>
          </>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border">
          {project.github ? (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-paint-sienna transition-colors"
            >
              <Github className="w-4 h-4" />
              View Source Code
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <ExternalLink className="w-4 h-4" />
              Private repo, available on request
            </span>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-paint-teal hover:text-paint-sienna transition-colors"
            >
              <Globe className="w-4 h-4" />
              Visit Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
