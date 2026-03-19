'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, Phone } from 'lucide-react';

const services = [
  {
    day: 'Sunday',
    name: 'Celebration Service',
    time: '9:00 AM',
    duration: '2 hours',
    description: 'Main worship service with praise, prayer, and powerful teaching.',
    icon: Clock,
  },
  {
    day: 'Wednesday',
    name: 'Prayer & Communion',
    time: '6:00 PM',
    duration: '1.5 hours',
    description: 'Midweek prayer meeting with Holy Communion.',
    icon: Clock,
  },
  {
    day: 'Friday',
    name: 'First Friday Prayer',
    time: '10:00 PM',
    duration: 'All night',
    description: 'Monthly all-night prayer meeting (First Friday of each month).',
    icon: Clock,
  },
];

export function Services() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
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
            className="mt-4 mb-4"
          >
            Service Times
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-text-secondary max-w-2xl mx-auto"
          >
            We gather throughout the week to worship, pray, and grow together.
            All are welcome to join us.
          </motion.p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.day}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`card p-8 ${
                  index === 0 ? 'border-gold-500 border-2' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    index === 0
                      ? 'bg-gradient-to-r from-gold-400 to-gold-600'
                      : 'bg-gold-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      index === 0 ? 'text-white' : 'text-gold-600'
                    }`} />
                  </div>
                  <span className="text-sm font-semibold text-gold-600 uppercase tracking-wider">
                    {service.day}
                  </span>
                </div>

                <h3 className="text-2xl font-heading font-bold text-authority-black mb-2">
                  {service.name}
                </h3>

                <div className="flex items-center gap-2 text-gold-600 font-semibold text-lg mb-3">
                  <Clock className="w-5 h-5" />
                  {service.time}
                </div>

                <p className="text-text-secondary mb-4">
                  {service.description}
                </p>

                <div className="text-sm text-text-muted">
                  Duration: {service.duration}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Location Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 card p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-gold-600" />
              </div>
              <div>
                <span className="block text-sm text-text-muted">Main Location</span>
                <span className="block font-semibold text-authority-black">
                  Yaoundé, Cameroon
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center">
                <Phone className="w-6 h-6 text-gold-600" />
              </div>
              <div>
                <span className="block text-sm text-text-muted">Contact</span>
                <span className="block font-semibold text-authority-black">
                  +237 XXX XXX XXX
                </span>
              </div>
            </div>

            <a
              href="/branches"
              className="btn-secondary"
            >
              View All Branches
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
