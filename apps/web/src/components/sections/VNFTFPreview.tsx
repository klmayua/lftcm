'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, Headphones, ArrowRight, Radio } from 'lucide-react';

export function VNFTFPreview() {
  return (
    <section className="section-padding bg-authority-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[600px] md:h-[600px] altar-glow opacity-40" />
        <div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-fire-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content - Mobile Optimized */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center lg:justify-start gap-2 md:gap-3 mb-4 md:mb-6"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <Radio className="w-5 h-5 md:w-6 md:h-6 text-authority-black" />
              </div>
              <span className="text-gold-400 text-sm md:text-base font-semibold tracking-wider uppercase">
                VNFTF Ministry
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-heading font-bold text-white mb-4 md:mb-6"
            >
              Voice Notes From
              <br className="hidden sm:block" />
              <span className="text-gold-gradient">The Father</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-base lg:text-lg text-gray-300 mb-6 md:mb-8 leading-relaxed"
            >
              Receive daily Spirit-led devotionals inspired by the words of Jesus,
              delivered straight to your phone. Join thousands of believers worldwide
              growing in faith through the Voice Notes ministry.
            </motion.p>

            {/* Stats - Mobile: Horizontal, Desktop: Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex justify-center lg:justify-start gap-6 md:gap-8 mb-6 md:mb-8"
            >
              <div className="text-center">
                <span className="block text-xl md:text-2xl lg:text-3xl font-bold text-gold-400">3,000+</span>
                <span className="text-xs md:text-sm text-gray-400">Subscribers</span>
              </div>
              <div className="text-center">
                <span className="block text-xl md:text-2xl lg:text-3xl font-bold text-gold-400">365+</span>
                <span className="text-xs md:text-sm text-gray-400">Voice Notes</span>
              </div>
              <div className="text-center">
                <span className="block text-xl md:text-2xl lg:text-3xl font-bold text-gold-400">25+</span>
                <span className="text-xs md:text-sm text-gray-400">Chapters</span>
              </div>
            </motion.div>

            {/* CTA - Mobile: Stacked, Desktop: Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 md:gap-4"
            >
              <Link
                href="https://vnftf.org"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-sm md:text-base justify-center"
              >
                Visit VNFTF
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </Link>

              <Link
                href="/vnftf"
                className="inline-flex items-center justify-center px-5 py-3 md:px-6 text-sm md:text-base text-white border border-gray-600 rounded-xl hover:border-gold-500 hover:text-gold-400 transition-colors active:scale-95"
              >
                <Headphones className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Learn More
              </Link>
            </motion.div>
          </div>

          {/* Preview Card - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="card-dark p-4 md:p-6 border-gold-500/30">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gold-500 flex items-center justify-center">
                  <span className="text-authority-black font-bold text-sm">VN</span>
                </div>
                <div>
                  <span className="block text-white font-semibold text-sm md:text-base">Voice Notes From The Father</span>
                  <span className="text-xs text-gray-400">Today's Devotional</span>
                </div>
              </div>

              {/* Audio Player Mock */}
              <div className="bg-gray-900 rounded-xl p-3 md:p-4 mb-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold-500 flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                  >
                    <Play className="w-4 h-4 md:w-5 md:h-5 text-authority-black ml-0.5" fill="currentColor" />
                  </button>

                  <div className="flex-grow min-w-0">
                    <span className="block text-white text-sm md:text-base font-medium mb-0.5 truncate">Walking by Faith</span>
                    <span className="text-xs md:text-sm text-gray-400">Hebrews 11:1</span>
                  </div>

                  <span className="text-xs md:text-sm text-gray-400">4:20</span>
                </div>

                {/* Progress Bar */}
                <div className="mt-2 md:mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-gold-500 rounded-full" />
                </div>
              </div>

              {/* Transcript Preview */}
              <div className="text-gray-300 text-xs md:text-sm leading-relaxed">
                <p className="line-clamp-3">
                  "Now faith is the substance of things hoped for, the evidence of
                  things not seen. For by it the elders obtained a good testimony..."
                </p>
              </div>

              {/* Subscribe CTA */}
              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-800">
                <Link
                  href="https://vnftf.org/subscribe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 md:py-3 text-center text-sm md:text-base bg-gold-500 text-authority-black font-semibold rounded-xl hover:bg-gold-400 transition-colors active:scale-95"
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
