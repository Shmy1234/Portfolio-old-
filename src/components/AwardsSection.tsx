import { motion } from "framer-motion";
import { Award, FileCheck } from "lucide-react";
import { awards } from "@/data/portfolio";

export function AwardsSection() {
  return (
    <section id="awards" className="py-12 scroll-mt-nav relative">
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
            Awards & Certificates
          </h2>
          <p className="font-body text-muted-foreground mt-4 max-w-2xl mx-auto">
            Recognitions and credentials that mark my journey
          </p>
        </motion.div>

        {/* Awards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {awards.map((award, index) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 30, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, rotate: 1 }}
            >
              <div className="painted-card oil-frame p-5 h-full flex flex-col items-center text-center relative overflow-hidden">
                {/* Museum Plaque Effect */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-paint-gold to-transparent opacity-60" />
                
                {/* Icon */}
                <div className={`p-3 rounded-full mb-4 ${
                  award.type === 'award' 
                    ? 'bg-paint-gold/20' 
                    : 'bg-paint-teal/20'
                }`}>
                  {award.type === 'award' ? (
                    <Award className="w-8 h-8 text-paint-gold" />
                  ) : (
                    <FileCheck className="w-8 h-8 text-paint-teal" />
                  )}
                </div>

                {/* Title */}
                <h3 className="font-heading text-lg font-semibold text-primary mb-1">
                  {award.title}
                </h3>

                {/* Issuer */}
                {award.issuer && (
                  <p className="font-body text-sm text-accent mb-2">
                    {award.issuer}
                  </p>
                )}

                {/* Description */}
                {award.description && (
                  <p className="font-body text-xs text-muted-foreground mt-auto">
                    {award.description}
                  </p>
                )}

                {/* Type Badge */}
                <span className={`mt-3 text-xs px-3 py-1 rounded-full font-medium ${
                  award.type === 'award'
                    ? 'bg-paint-sienna/20 text-paint-sienna'
                    : 'bg-paint-navy/10 text-paint-navy'
                }`}>
                  {award.type === 'award' ? 'Award' : 'Certificate'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
