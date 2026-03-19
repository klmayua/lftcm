'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Building2, Users, Globe } from 'lucide-react';

const givingOptions = [
  {
    icon: Heart,
    title: 'Tithes & Offerings',
    description: 'Support the ongoing ministry and operations of the church.',
    color: 'gold',
  },
  {
    icon: Building2,
    title: 'Building Fund',
    description: 'Contribute to our sanctuary expansion and facility improvements.',
    color: 'fire',
  },
  {
    icon: Users,
    title: 'Missions',
    description: 'Support outreach programs and missionary work.',
    color: 'green',
  },
  {
    icon: Globe,
    title: 'VNFTF Ministry',
    description: 'Support the Voice Notes From The Father global ministry.',
    color: 'gold',
  },
];

export function Give() {
  return (
    <section className="section-padding bg-authority-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold-400 text-sm font-semibold uppercase tracking-wider"
          >
            Stewardship
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 mb-4 text-white"
          >
            Give with{' '}
            <span className="text-gold-gradient">Joy</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            "Each of you should give what you have decided in your heart to give,
            not reluctantly or under compulsion, for God loves a cheerful giver."
            <span className="block mt-2 text-gold-400">— 2 Corinthians 9:7</span>
          </motion.p>
        </div>

        {/* Giving Options */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {givingOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-dark p-6 hover:border-gold-500/50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  option.color === 'gold'
                    ? 'bg-gold-500/20'
                    : option.color === 'fire'
                    ? 'bg-fire-orange/20'
                    : 'bg-holy-green/20'
                }`}
                >
                  <Icon className={`w-6 h-6 ${
                    option.color === 'gold'
                      ? 'text-gold-400'
                      : option.color === 'fire'
                      ? 'text-fire-orange'
                      : 'text-holy-green'
                  }`} />
                </div>

                <h3 className="text-lg font-heading font-bold text-white mb-2">
                  {option.title}
                </h3>

                <p className="text-gray-400 text-sm">
                  {option.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/give"
            className="btn-dark text-lg px-8 py-4"
          >
            <Heart className="w-5 h-5 mr-2" />
            Give Now
          </Link>

          <p className="mt-6 text-sm text-gray-400">
            Secure payment via MTN Mobile Money, Orange Money & Paystack (International Cards)
          </p>
        </motion.div>
      </div>
    </section>
  );
}
