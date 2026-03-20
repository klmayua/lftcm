'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Building2, Users, Globe, Smartphone, CreditCard } from 'lucide-react';

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

const paymentMethods = [
  { name: 'MTN Mobile Money', icon: Smartphone },
  { name: 'Orange Money', icon: Smartphone },
  { name: 'International Cards', icon: CreditCard },
];

export function Give() {
  return (
    <section className="section-padding bg-authority-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 md:w-64 md:h-64 bg-gold-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-8 md:mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-gold-400 text-xs md:text-sm font-semibold uppercase tracking-wider mb-2 md:mb-3"
          >
            Stewardship
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-3 md:mb-4"
          >
            Give with{' '}
            <span className="text-gold-gradient">Joy</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto px-2 sm:px-0"
          >
            "Each of you should give what you have decided in your heart to give,
            not reluctantly or under compulsion, for God loves a cheerful giver."
          </motion.p>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="block mt-2 text-xs md:text-sm text-gold-400 font-medium"
          >
            — 2 Corinthians 9:7
          </motion.span>
        </div>

        {/* Giving Options - Mobile: 2x2 Grid, Desktop: 4 Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-8 md:mb-12">
          {givingOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-dark p-4 md:p-6 hover:border-gold-500/50 transition-all active:scale-95"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4 ${
                  option.color === 'gold'
                    ? 'bg-gold-500/20'
                    : option.color === 'fire'
                    ? 'bg-fire-orange/20'
                    : 'bg-holy-green/20'
                }`}
                >
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 ${
                    option.color === 'gold'
                      ? 'text-gold-400'
                      : option.color === 'fire'
                      ? 'text-fire-orange'
                      : 'text-holy-green'
                  }`} />
                </div>

                <h3 className="text-sm md:text-lg font-heading font-bold text-white mb-1 md:mb-2">
                  {option.title}
                </h3>

                <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                  {option.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Link
            href="/giving"
            className="btn-gold text-base md:text-lg px-6 py-3 md:px-8 md:py-4 w-full sm:w-auto justify-center"
          >
            <Heart className="w-5 h-5 mr-2" fill="currentColor" />
            Give Now
          </Link>

          {/* Payment Methods */}
          <div className="mt-6 md:mt-8">
            <p className="text-xs md:text-sm text-gray-400 mb-3">
              Secure payment via:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.name}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-800 rounded-lg"
                  >
                    <Icon className="w-3.5 h-3.5 text-gold-400" />
                    <span className="text-xs text-gray-300">{method.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
