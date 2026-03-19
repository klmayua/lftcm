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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
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
              className="mt-4"
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
              className="btn-secondary"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>

        {/* Sermon Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {latestSermons.map((sermon, index) => (
            <motion.div
              key={sermon.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/sermons/${sermon.id}`} className="group block">
                <div className="card overflow-hidden">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gray-200 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gold-500/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 text-authority-black ml-1" />
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded text-white text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {sermon.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-heading font-bold text-authority-black mb-2 group-hover:text-gold-600 transition-colors">
                      {sermon.title}
                    </h3>

                    <p className="text-sm text-gold-600 mb-2">
                      {sermon.speaker}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(sermon.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-text-muted">
                      {sermon.scripture}
                    </p>
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
