'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, Headphones, ArrowRight, Radio } from 'lucide-react';

export function VNFTFPreview() {
  return (
    <section className="section-padding bg-authority-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] altar-glow opacity-40" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-fire-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <Radio className="w-6 h-6 text-authority-black" />
              </div>
              <span className="text-gold-400 font-semibold tracking-wider uppercase">
                VNFTF Ministry
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white mb-6"
            >
              Voice Notes From
              <br />
              <span className="text-gold-gradient">The Father</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-300 text-lg mb-8 leading-relaxed"
            >
              Receive daily Spirit-led devotionals inspired by the words of Jesus,
              delivered straight to your phone. Join thousands of believers worldwide
              growing in faith through the Voice Notes ministry.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-6 mb-8"
            >
              <div>
                <span className="block text-3xl font-bold text-gold-400">3,000+</span>
                <span className="text-sm text-gray-400">Subscribers</span>
              </div>
              <div>
                <span className="block text-3xl font-bold text-gold-400">365+</span>
                <span className="text-sm text-gray-400">Voice Notes</span>
              </div>
              <div>
                <span className="block text-3xl font-bold text-gold-400">25+</span>
                <span className="text-sm text-gray-400">Chapters</span>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="https://vnftf.org"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark text-base"
              >
                Visit VNFTF
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>

              <Link
                href="/vnftf"
                className="inline-flex items-center justify-center px-6 py-3 text-white border border-gray-600 rounded-xl hover:border-gold-500 hover:text-gold-400 transition-colors"
              >
                <Headphones className="w-5 h-5 mr-2" />
                Learn More
              </Link>
            </motion.div>
          </div>

          {/* Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="card-dark p-6 border-gold-500/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center">
                  <span className="text-authority-black font-bold">VN</span>
                </div>
                <div>
                  <span className="block text-white font-semibold">Voice Notes From The Father</span>
                  <span className="text-sm text-gray-400">Today\'s Devotional</span>
                </div>
              </div>

              {/* Audio Player Mock */}
              <div className="bg-gray-900 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-4">
                  <button className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <Play className="w-5 h-5 text-authority-black ml-0.5" />
                  </button>

                  <div className="flex-grow">
                    <span className="block text-white font-medium mb-1">Walking by Faith</span>
                    <span className="text-sm text-gray-400">Hebrews 11:1</span>
                  </div>

                  <span className="text-sm text-gray-400">4:20</span>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-gold-500 rounded-full" />
                </div>
              </div>

              {/* Transcript Preview */}
              <div className="text-gray-300 text-sm leading-relaxed">
                <p className="line-clamp-3">
                  "Now faith is the substance of things hoped for, the evidence of
                  things not seen. For by it the elders obtained a good testimony..."
                </p>
              </div>

              {/* Subscribe CTA */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <Link
                  href="https://vnftf.org/subscribe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 text-center bg-gold-500 text-authority-black font-semibold rounded-xl hover:bg-gold-400 transition-colors"
                >
                  Subscribe for Daily Notes
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
