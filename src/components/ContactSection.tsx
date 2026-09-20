import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "@/data/portfolio";

const contactLinks = [
  {
    label: "Email me",
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: Mail,
    iconClass: "text-accent",
    iconBackground: "bg-accent/10 group-hover:bg-accent/20",
    external: false,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/sahilrr",
    href: profile.linkedin,
    icon: Linkedin,
    iconClass: "text-paint-navy",
    iconBackground: "bg-paint-navy/10 group-hover:bg-paint-navy/20",
    external: true,
  },
  {
    label: "GitHub",
    value: "github.com/Shmy1234",
    href: profile.github,
    icon: Github,
    iconClass: "text-foreground",
    iconBackground: "bg-foreground/10 group-hover:bg-foreground/20",
    external: true,
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="py-12 scroll-mt-nav relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-paint-gold/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary section-heading">
            Contact
          </h2>
          <p className="font-body text-muted-foreground mt-4 max-w-2xl mx-auto">
            Interested in working together? The best way to reach me is by email
            or LinkedIn.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="painted-card oil-frame p-5 md:p-6 max-w-3xl mx-auto"
        >
          <div className="grid gap-3 md:grid-cols-3">
            {contactLinks.map((link) => {
              const Icon = link.icon;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="group flex min-w-0 items-center gap-3 rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted"
                >
                  <span
                    className={`shrink-0 rounded-full p-2 transition-colors ${link.iconBackground}`}
                  >
                    <Icon className={`h-4 w-4 ${link.iconClass}`} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-muted-foreground">
                      {link.label}
                    </span>
                    <span className="block truncate text-sm font-medium text-foreground">
                      {link.value}
                    </span>
                  </span>
                </a>
              );
            })}
          </div>

          <p className="mt-5 border-t border-border pt-4 text-center font-body text-sm font-medium text-primary">
            {profile.availability}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
