'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, Clock, Calendar, ArrowRight } from 'lucide-react';

const latestSermons = [
  {
    id: 1,
    title: 'Walking by Faith',
    speaker: 'Pastor Kaben Vincent',
    date: '2026-03-16',
    duration: '45:30',
    scripture: 'Hebrews 11:1-6',
    thumbnail: '/sermons/placeholder-1.jpg',
  },
  {
    id: 2,
    title: 'The Power of Prayer',
    speaker: 'Pastor Kaben Vincent',
    date: '2026-03-09',
    duration: '42:15',
    scripture: 'James 5:13-18',
    thumbnail: '/sermons/placeholder-2.jpg',
  },
  {
    id: 3,
    title: 'Living in Victory',
    speaker: 'Pastor Kaben Vincent',
    date: '2026-03-02',
    duration: '48:00',
    scripture: '1 Corinthians 15:57',
    thumbnail: '/sermons/placeholder-3.jpg',
  },
];

export function Sermons() {
  return (
    <section className="section-padding bg-temple">
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
              Media
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-2 md:mt-4"
            >
              Latest Sermons
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/sermons"
              className="inline-flex items-center text-sm md:text-base font-medium text-gold-600 hover:text-gold-700 transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>
        </div>

        {/* Sermon Cards - Mobile: Horizontal Scroll, Desktop: Grid */}
        <div className="scroll-x md:grid md:grid-cols-3 gap-4 pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {latestSermons.map((sermon, index) => (
            <motion.div
              key={sermon.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="w-[260px] md:w-auto shrink-0 snap-start"
            >
              <Link href={`/sermons/${sermon.id}`} className="group block">
                <div className="card overflow-hidden">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-gold-100 to-gold-200 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gold-500/90 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <Play className="w-5 h-5 md:w-7 md:h-7 text-authority-black ml-0.5" fill="currentColor" />
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 px-2 py-1 bg-black/70 rounded text-white text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {sermon.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 md:p-5">
                    <h3 className="text-sm md:text-lg font-heading font-bold text-authority-black mb-1 md:mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">
                      {sermon.title}
                    </h3>

                    <p className="text-xs md:text-sm text-gold-600 mb-1 md:mb-2">
                      {sermon.speaker}
                    </p>

                    <div className="flex items-center gap-3 text-xs md:text-sm text-text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                        {new Date(sermon.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="text-gold-500">•</span>
                      <span className="truncate">{sermon.scripture}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 md:hidden text-center"
        >
          <Link
            href="/sermons"
            className="btn-secondary w-full justify-center"
          >
            <Play className="w-4 h-4 mr-2" />
            Browse All Sermons
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
