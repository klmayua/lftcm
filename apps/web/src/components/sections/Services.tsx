'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, MapPin, Phone, ChevronRight, Users } from 'lucide-react';

const services = [
  {
    day: 'Sunday',
    name: 'Celebration Service',
    time: '9:00 AM',
    duration: '2 hours',
    description: 'Main worship service with praise, prayer, and powerful teaching.',
    icon: Clock,
    highlight: true,
  },
  {
    day: 'Wednesday',
    name: 'Prayer & Communion',
    time: '6:00 PM',
    duration: '1.5 hours',
    description: 'Midweek prayer meeting with Holy Communion.',
    icon: Clock,
    highlight: false,
  },
  {
    day: 'Friday',
    name: 'First Friday Prayer',
    time: '10:00 PM',
    duration: 'All night',
    description: 'Monthly all-night prayer meeting (First Friday of each month).',
    icon: Clock,
    highlight: false,
  },
];

export function Services() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="banner-text"
          >
            Join Us
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 mb-3 md:mb-4"
          >
            Service Times
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-text-secondary max-w-2xl mx-auto"
          >
            We gather throughout the week to worship, pray, and grow together.
            All are welcome to join us.
          </motion.p>
        </div>

        {/* Service Cards - Mobile: Horizontal Scroll, Desktop: Grid */}
        <div className="scroll-x md:grid md:grid-cols-3 gap-4 pb-2">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.day}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`w-[280px] md:w-auto shrink-0 card p-5 md:p-6 lg:p-8 ${
                  service.highlight ? 'border-gold-500 border-2 ring-2 ring-gold-100' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-3 md:mb-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
                    service.highlight
                      ? 'bg-gradient-to-r from-gold-400 to-gold-600'
                      : 'bg-gold-100'
                  }`}>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${
                      service.highlight ? 'text-white' : 'text-gold-600'
                    }`} />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-gold-600 uppercase tracking-wider">
                    {service.day}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl lg:text-2xl font-heading font-bold text-authority-black mb-2">
                  {service.name}
                </h3>

                <div className="flex items-center gap-2 text-gold-600 font-semibold text-base md:text-lg mb-2">
                  <Clock className="w-4 h-4 md:w-5 md:h-5" />
                  {service.time}
                </div>

                <p className="text-sm md:text-base text-text-secondary mb-3">
                  {service.description}
                </p>

                {service.highlight && (
                  <div className="flex items-center gap-2 mt-3">
                    <Users className="w-4 h-4 text-gold-500" />
                    <span className="text-xs md:text-sm text-gold-600 font-medium">Main Service</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Location Info - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 md:mt-12 card p-4 md:p-6 lg:p-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-gold-600" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs md:text-sm text-text-muted">Main Location</span>
                <span className="block text-sm md:text-base font-semibold text-authority-black truncate">
                  Yaoundé, Cameroon
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 md:w-6 md:h-6 text-gold-600" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs md:text-sm text-text-muted">Contact</span>
                <a
                  href="tel:+237XXXXXXXXX"
                  className="block text-sm md:text-base font-semibold text-authority-black hover:text-gold-600 transition-colors"
                >
                  +237 XXX XXX XXX
                </a>
              </div>
            </div>

            <Link
              href="/branches"
              className="btn-secondary w-full md:w-auto justify-center text-sm md:text-base"
            >
              View All Branches
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
