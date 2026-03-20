'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Play,
  Calendar,
  Heart,
  Menu,
  X,
  BookOpen,
  Users,
  Phone,
  MapPin,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Desktop navigation items
const desktopNavItems = [
  { label: 'Home', href: '/' },
  { label: 'Sermons', href: '/sermons' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// Mobile bottom nav items - 4 major items + More button
const mobileNavItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Play, label: 'Sermons', href: '/sermons' },
  { icon: Calendar, label: 'Events', href: '/events' },
  { icon: Menu, label: 'More', href: '#', isMenu: true },
];

// Floating Give Button - appears on scroll
const FloatingGiveButton = ({ isVisible }: { isVisible: boolean }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="fixed bottom-20 right-4 z-40 md:hidden"
      >
        <Link
          href="/giving"
          className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full shadow-gold-lg shadow-gold/50 active:scale-95 transition-transform"
          aria-label="Give"
        >
          <Heart className="w-6 h-6 text-authority-black" fill="currentColor" />
        </Link>
      </motion.div>
    )}
  </AnimatePresence>
);

// Mobile menu items - all other pages
const mobileMenuItems = [
  { icon: Heart, label: 'Give', href: '/giving', highlight: true },
  { icon: BookOpen, label: 'About Us', href: '/about' },
  { icon: Compass, label: 'Services', href: '/services' },
  { icon: Heart, label: 'Prayer Request', href: '/prayer' },
  { icon: MapPin, label: 'Branches', href: '/branches' },
  { icon: Users, label: 'Leadership', href: '/leadership' },
  { icon: Phone, label: 'Contact', href: '/contact' },
];

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFloatingGive, setShowFloatingGive] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  // Handle scroll for header and floating give button
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
      setShowFloatingGive(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle resize for responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Swipe gesture handlers for mobile menu drawer
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isDownSwipe = distance < -minSwipeDistance;
    if (isDownSwipe && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [touchStart, touchEnd, isMobileMenuOpen]);

  return (
    <>
      {/* Desktop Navigation */}
      {!isMobile && (
        <header
          className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
            isScrolled
              ? 'bg-white/95 backdrop-blur-md shadow-sm'
              : 'bg-transparent'
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <div className="hidden sm:block">
                  <span className="font-heading font-bold text-lg text-authority-black">
                    Living Faith
                  </span>
                  <span className="block text-xs text-gold-600 -mt-1">Tabernacle</span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-8">
                {desktopNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        'text-sm font-medium transition-colors relative py-2',
                        isActive
                          ? 'text-gold-600'
                          : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="desktopNav"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500"
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Desktop CTA */}
              <div className="hidden lg:flex items-center gap-4">
                <Link href="/giving">
                  <button className="btn-gold text-sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Give
                  </button>
                </Link>
              </div>

              {/* Tablet Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-3 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
                aria-label="Open menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Mobile Header - Simplified */}
      {isMobile && (
        <header
          className={cn(
            'fixed top-0 left-0 right-0 z-40 transition-all duration-300 md:hidden',
            isScrolled
              ? 'bg-white/95 backdrop-blur-md shadow-sm py-2'
              : 'bg-transparent py-4'
          )}
        >
          <div className="px-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <div className={cn('transition-opacity', isScrolled ? 'opacity-100' : 'opacity-0')}>
                <span className="font-heading font-bold text-sm text-authority-black">LFTCM</span>
              </div>
            </Link>
          </div>
        </header>
      )}

      {/* Mobile Bottom Navigation - Floating Style */}
      {isMobile && (
        <nav className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
          <div className="bg-authority-black/95 backdrop-blur-lg rounded-2xl shadow-2xl shadow-black/30 border border-gold-500/20">
            <div className="flex items-center justify-around px-2 py-2">
              {mobileNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                if (item.isMenu) {
                  return (
                    <button
                      key={item.label}
                      onClick={() => setIsMobileMenuOpen(true)}
                      className="flex flex-col items-center justify-center py-2 px-3 min-w-[56px] min-h-[48px] touch-target rounded-xl active:bg-white/10 transition-colors"
                      aria-label="Open menu"
                    >
                      <Icon className="w-5 h-5 text-gray-400" />
                      <span className="text-[10px] text-gray-400 mt-1 font-medium">{item.label}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      'flex flex-col items-center justify-center py-2 px-3 min-w-[56px] min-h-[48px] touch-target rounded-xl transition-all active:scale-95',
                      isActive
                        ? 'text-gold-400 bg-gold-500/10'
                        : 'text-gray-400 hover:text-gray-300'
                    )}
                  >
                    <Icon className={cn('w-5 h-5', isActive && 'text-gold-400')} />
                    <span className={cn('text-[10px] mt-1 font-medium', isActive && 'text-gold-400')}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Floating Give Button for Mobile */}
      <FloatingGiveButton isVisible={showFloatingGive && isMobile} />

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto overscroll-contain"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Handle & Close */}
              <div className="sticky top-0 bg-white z-10 px-4 pt-3 pb-2 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="w-8" /> {/* Spacer for centering */}
                  <div className="w-12 h-1 bg-gray-300 rounded-full" />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Menu Items */}
              <div className="px-4 py-4">
                {/* Quick Actions */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/giving"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-600 text-authority-black active:scale-95 transition-transform"
                    >
                      <Heart className="w-5 h-5" fill="currentColor" />
                      <span className="font-semibold text-sm">Give Now</span>
                    </Link>
                    <Link
                      href="/prayer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-xl bg-authority-black text-white active:scale-95 transition-transform"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="font-semibold text-sm">Prayer</span>
                    </Link>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                    Menu
                  </h3>
                  <div className="space-y-1">
                    {mobileMenuItems.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              'flex items-center gap-4 p-3 rounded-xl transition-colors active:scale-[0.98]',
                              isActive
                                ? 'bg-gold-50 text-gold-700'
                                : 'hover:bg-gray-50 text-gray-900'
                            )}
                          >
                            <div className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                              item.highlight
                                ? 'bg-gold-100 text-gold-600'
                                : 'bg-gray-100 text-gray-600'
                            )}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="flex-1 text-base font-medium">{item.label}</span>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* VNFTF Link */}
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    href="https://vnftf.org"
                    onClick={() => setIsMobileMenuOpen(false)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-authority-black hover:bg-gray-900 active:scale-95 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center shrink-0">
                      <span className="text-authority-black font-bold text-sm">VN</span>
                    </div>
                    <div>
                      <span className="block text-white font-medium text-sm">Voice Notes From The Father</span>
                      <span className="block text-xs text-gray-400">Daily devotionals</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </Link>
                </div>

                {/* Safe Area Spacer */}
                <div className="h-4" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
