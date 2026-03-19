'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, ChevronRight, Calendar } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Altar Glow Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] altar-glow opacity-60" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-gold-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-0 w-64 h-64 bg-gold-300/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="banner-text">
              Welcome to Living Faith Tabernacle
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-authority-black mb-6 leading-tight"
          >
            Winning the World
            <br />
            <span className="text-gold-gradient">with the Word of Faith</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Join us at Living Faith Tabernacle Cameroon for powerful worship,
            transformative teaching, and a community walking in faith.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/services"
              className="btn-gold text-base w-full sm:w-auto"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Service Times
            </Link>

            <Link
              href="/sermons"
              className="btn-secondary text-base w-full sm:w-auto"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Sermons
            </Link>
          </motion.div>

          {/* Service Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-6 sm:gap-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-gray-100"
            >
              <div className="text-center sm:text-left">
                <span className="block text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1">
                  Sunday Celebration
                </span>
                <span className="block text-lg font-semibold text-authority-black">
                  9:00 AM WAT
                </span>
              </div>

              <div className="hidden sm:block w-px h-12 bg-gray-200" />

              <div className="text-center sm:text-left">
                <span className="block text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1">
                  Wednesday Prayer
                </span>
                <span className="block text-lg font-semibold text-authority-black">
                  6:00 PM WAT
                </span>
              </div>

              <div className="hidden sm:block w-px h-12 bg-gray-200" />

              <Link
                href="/branches"
                className="flex items-center text-sm font-medium text-gold-600 hover:text-gold-700"
              >
                View All Branches
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-gray-400">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gold-400 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
