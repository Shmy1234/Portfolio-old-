import { motion } from "framer-motion";
import { Briefcase, ChevronDown, ChevronUp } from "lucide-react";
import { experiences } from "@/data/portfolio";
import { useState } from "react";

export function ExperienceSection() {
  return (
    <section id="experience" className="py-12 scroll-mt-nav relative">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 rounded-full bg-paint-teal/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-48 h-48 rounded-full bg-paint-sienna/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary section-heading">
            Experience
          </h2>
          <p className="font-body text-muted-foreground mt-4 max-w-2xl mx-auto">
            Where I've worked and what I shipped.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line - Hidden on mobile */}
          <div className="hidden md:block timeline-line" />

          {/* Experience Cards */}
          <div className="space-y-8 md:space-y-12">
            {experiences.map((exp, index) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                index={index}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface ExperienceCardProps {
  experience: (typeof experiences)[0];
  index: number;
  isLeft: boolean;
}

function ExperienceCard({ experience, index, isLeft }: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative flex flex-col md:flex-row items-center gap-4 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Timeline Node - Hidden on mobile */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 z-10">
        <div className="timeline-node" />
      </div>

      {/* Card */}
      <div
        className={`w-full md:w-[calc(50%-2rem)] ${
          isLeft ? "md:pr-4" : "md:pl-4"
        }`}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="painted-card oil-frame p-5"
        >
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 rounded-lg bg-accent/10 shrink-0">
              <Briefcase className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-lg font-semibold text-primary leading-tight">
                {experience.title}
              </h3>
              <p className="font-body text-sm text-accent font-medium">
                {experience.company}
              </p>
              {experience.location && (
                <p className="font-body text-xs text-muted-foreground">
                  {experience.location}
                </p>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-paint-gold/20 text-paint-navy">
              {experience.startDate} - {experience.endDate}
            </span>
          </div>

          {/* Headline - the one-sentence "why this mattered" */}
          <p className="font-body text-sm text-accent italic mb-3 leading-relaxed">
            {experience.headline}
          </p>

          {/* Sub-roles if any */}
          {experience.subRoles && experience.subRoles.length > 0 && (
            <div className="mb-4 pl-3 border-l-2 border-paint-gold/40 space-y-2">
              {experience.subRoles.map((role, i) => (
                <div key={i} className="text-xs">
                  <span className="font-medium text-foreground">{role.title}</span>
                  <span className="text-muted-foreground ml-2">
                    {role.startDate} - {role.endDate}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Description - Collapsible on mobile */}
          <div className="space-y-2">
            {(isExpanded ? experience.description : experience.description.slice(0, 2)).map(
              (desc, i) => (
                <p
                  key={i}
                  className="font-body text-sm text-foreground/70 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-paint-teal mt-2 shrink-0" />
                  {desc}
                </p>
              )
            )}
          </div>

          {experience.description.length > 2 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs text-accent hover:text-paint-sienna flex items-center gap-1"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  {`Show ${experience.description.length - 2} more`}
                </>
              )}
            </button>
          )}

          {/* Team context, kept separate from individual contribution */}
          {experience.teamNote && (
            <p className="font-body text-xs text-muted-foreground mt-3 pt-3 border-t border-border/60">
              {experience.teamNote}
            </p>
          )}

          {/* Skills */}
          {experience.skills && experience.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border">
              {experience.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Spacer for opposite side */}
      <div className="hidden md:block w-[calc(50%-2rem)]" />
    </motion.div>
  );
}
