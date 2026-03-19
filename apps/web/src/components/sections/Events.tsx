'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

const upcomingEvents = [
  {
    id: 1,
    title: 'Youth Conference 2026',
    date: '2026-04-15',
    time: '9:00 AM',
    location: 'Main Sanctuary',
    description: 'A powerful gathering for young people to encounter God.',
  },
  {
    id: 2,
    title: 'Marriage Seminar',
    date: '2026-04-22',
    time: '2:00 PM',
    location: 'Fellowship Hall',
    description: 'Building strong marriages through biblical principles.',
  },
  {
    id: 3,
    title: 'Community Outreach',
    date: '2026-05-01',
    time: '8:00 AM',
    location: 'City Center',
    description: 'Join us as we serve our community with love.',
  },
];

export function Events() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="banner-text"
            >
              Calendar
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4"
            >
              Upcoming Events
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/events"
              className="btn-secondary"
            >
              View Calendar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>

        {/* Event Cards */}
        <div className="space-y-4">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/events/${event.id}`} className="group block">
                <div className="card p-6 flex flex-col md:flex-row md:items-center gap-6 hover:border-gold-500/30 transition-colors"
                >
                  {/* Date */}
                  <div className="flex-shrink-0 w-20 h-20 bg-gold-100 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gold-600">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="text-xs font-semibold text-gold-600 uppercase">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                      })}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className="text-xl font-heading font-bold text-authority-black mb-2 group-hover:text-gold-600 transition-colors">
                      {event.title}
                    </h3>

                    <p className="text-text-secondary mb-3">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {event.time}
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 hidden md:block">
                    <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-gold-500 transition-colors" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
