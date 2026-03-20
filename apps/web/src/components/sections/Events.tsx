'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';

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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
    };
  };

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 md:gap-4 mb-6 md:mb-10">
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
              className="mt-2 md:mt-4"
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
              className="inline-flex items-center text-sm md:text-base font-medium text-gold-600 hover:text-gold-700 transition-colors"
            >
              View Calendar
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>
        </div>

        {/* Event Cards - Mobile: Horizontal Scroll Cards, Desktop: List */}
        <div className="scroll-x md:block gap-4 pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:space-y-4">
          {upcomingEvents.map((event, index) => {
            const dateInfo = formatDate(event.date);
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="w-[300px] md:w-auto shrink-0 snap-start md:snap-none"
              >
                <Link href={`/events/${event.id}`} className="group block">
                  {/* Mobile Card Style */}
                  <div className="md:hidden card p-4 h-full">
                    <div className="flex items-start gap-3">
                      {/* Date Badge */}
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex flex-col items-center justify-center text-white">
                        <span className="text-lg font-bold">{dateInfo.day}</span>
                        <span className="text-xs font-medium uppercase">{dateInfo.month}</span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-heading font-bold text-authority-black mb-1 group-hover:text-gold-600 transition-colors line-clamp-1">
                          {event.title}
                        </h3>
                        <p className="text-xs text-text-secondary mb-2 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop List Style */}
                  <div className="hidden md:block card p-5 lg:p-6 hover:border-gold-500/30 transition-colors">
                    <div className="flex flex-row items-center gap-6">
                      {/* Date */}
                      <div className="flex-shrink-0 w-20 h-20 bg-gold-100 rounded-xl flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-gold-600">
                          {dateInfo.day}
                        </span>
                        <span className="text-xs font-semibold text-gold-600 uppercase">
                          {dateInfo.month}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-grow min-w-0">
                        <h3 className="text-lg lg:text-xl font-heading font-bold text-authority-black mb-2 group-hover:text-gold-600 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-sm text-text-secondary mb-3">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0">
                        <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-gold-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 md:hidden text-center"
        >
          <Link
            href="/events"
            className="btn-secondary w-full justify-center"
          >
            <Calendar className="w-4 h-4 mr-2" />
            View Full Calendar
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
