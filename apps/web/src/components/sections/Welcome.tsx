'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Church, Users, Heart } from 'lucide-react';

const features = [
  {
    icon: Church,
    title: 'Our Vision',
    description: 'To be a beacon of faith that transforms lives and nations through the power of God\'s Word.',
  },
  {
    icon: Users,
    title: 'Our Community',
    description: 'A family of believers walking together in faith, supporting one another through every season.',
  },
  {
    icon: Heart,
    title: 'Our Mission',
    description: 'Winning the world by demonstrating that faith in Christ is the foundation for transformation.',
  },
];

export function Welcome() {
  return (
    <section className="section-padding bg-temple">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="banner-text"
            >
              About Us
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-3 mb-4 md:mb-6"
            >
              Welcome to{` `}
              <span className="text-gold-gradient">Living Faith Tabernacle</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-text-secondary mb-4 md:mb-6 leading-relaxed"
            >
              Founded on January 15, 2012, Living Faith Tabernacle has grown from
              a small tent in Bilone Ebolowa to a thriving community with branches
              across Cameroon. Under the leadership of Pastor Kaben Vincent, we are
              committed to proclaiming the Gospel with power and conviction.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-sm sm:text-base text-text-secondary mb-6 md:mb-8 leading-relaxed hidden sm:block"
            >
              We believe in the transformative power of God\'s Word and the
              importance of walking by faith, not by sight. Our doors are open to
              all who seek to know Christ and grow in their faith journey.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3"
            >
              <Link
                href="/about"
                className="btn-gold w-full sm:w-auto justify-center"
              >
                Learn More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>
          </div>

          {/* Features Grid - Mobile Optimized */}
          <div className="space-y-3 md:space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-4 md:p-6 hover:shadow-elevated transition-shadow"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gold-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-gold-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base md:text-xl font-heading font-bold text-authority-black mb-1 md:mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
