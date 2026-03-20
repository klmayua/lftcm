'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, ChevronRight, Calendar, MapPin, Clock } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-gold-50/30 to-white">
      {/* Altar Glow Background - Adjusted for mobile */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] altar-glow opacity-60" />
        <div className="absolute top-10 right-0 w-48 h-48 md:w-96 md:h-96 bg-gold-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-0 w-32 h-32 md:w-64 md:h-64 bg-gold-300/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 lg:pt-32 pb-8 md:pb-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 md:mb-6"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold-100/50 rounded-full text-xs md:text-sm font-medium text-gold-700">
              <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" />
              Welcome to Living Faith Tabernacle
            </span>
          </motion.div>

          {/* Main Headline - Mobile Optimized */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading font-bold text-authority-black mb-4 md:mb-6 leading-[1.1] tracking-tight"
          >
            <span className="block text-[1.625rem] sm:text-3xl md:text-5xl lg:text-6xl">
              Winning the World
            </span>
            <span className="block text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-gold-gradient mt-1 md:mt-2">
              with the Word of Faith
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-text-secondary max-w-xl mx-auto mb-6 md:mb-8 leading-relaxed px-2 sm:px-0"
          >
            Join us at Living Faith Tabernacle Cameroon for powerful worship,
            transformative teaching, and a community walking in faith.
          </motion.p>

          {/* CTA Buttons - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link
              href="/services"
              className="btn-gold w-full sm:w-auto justify-center"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Service Times
            </Link>

            <Link
              href="/sermons"
              className="btn-secondary w-full sm:w-auto justify-center"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Watch Sermons
            </Link>
          </motion.div>

          {/* Quick Info Pills - Mobile Alternative */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-2 md:gap-4 md:hidden"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-100">
              <Clock className="w-3.5 h-3.5 text-gold-500" />
              <span className="text-xs font-medium text-gray-700">Sun 9:00 AM</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full shadow-sm border border-gray-100">
              <MapPin className="w-3.5 h-3.5 text-gold-500" />
              <span className="text-xs font-medium text-gray-700">Yaoundé</span>
            </div>
          </motion.div>

          {/* Service Info Card - Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="hidden md:block mt-12 lg:mt-16"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-card border border-gray-100"
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
                className="flex items-center text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors"
              >
                View All Branches
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </motion.div>

          {/* Live Service Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 md:mt-12"
          >
            <Link
              href="/live"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full hover:bg-red-100 transition-colors active:scale-95"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-xs sm:text-sm font-medium text-red-700">Join Live Service</span>
              <ChevronRight className="w-3.5 h-3.5 text-red-500" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-400">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-gold-400 to-transparent" />
      </motion.div>
    </section>
  );
}
