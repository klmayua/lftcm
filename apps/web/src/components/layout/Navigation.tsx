'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

// Desktop navigation items
const desktopNavItems = [
  { label: 'Home', href: '/' },
  { label: 'Sermons', href: '/sermons' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// Mobile bottom nav items
const mobileNavItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Play, label: 'Sermons', href: '/sermons' },
  { icon: Calendar, label: 'Events', href: '/events' },
  { icon: Heart, label: 'Give', href: '/giving', highlight: true },
  { icon: Menu, label: 'More', href: '#', isMenu: true },
];

// Mobile menu items
const mobileMenuItems = [
  { icon: BookOpen, label: 'About Us', href: '/about' },
  { icon: Users, label: 'Leadership', href: '/leadership' },
  { icon: Calendar, label: 'Services', href: '/services' },
  { icon: Heart, label: 'Prayer Request', href: '/prayer' },
  { icon: MapPin, label: 'Branches', href: '/branches' },
  { icon: Phone, label: 'Contact', href: '/contact' },
];

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle scroll for desktop header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle resize for responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
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
                  <Button variant="gold" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Give
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button (Tablet) */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                aria-label="Open menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-authority-black border-t border-gold-500/30">
          <div className="flex items-center justify-around px-2 pb-safe">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              if (item.isMenu) {
                return (
                  <button
                    key={item.label}
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="flex flex-col items-center justify-center py-3 px-4 min-w-[64px] touch-target"
                    aria-label="Open menu"
                  >
                    <Icon className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-400 mt-1">{item.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center py-3 px-4 min-w-[64px] touch-target transition-colors',
                    isActive ? 'text-gold-400' : 'text-gray-400',
                    item.highlight && 'relative'
                  )}
                >
                  {item.highlight ? (
                    <>
                      <div className="absolute -top-1 w-12 h-12 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-gold">
                        <Icon className="w-5 h-5 text-authority-black" />
                      </div>
                      <span className="text-xs mt-3">{item.label}</span>
                    </>
                  ) : (
                    <>
                      <Icon className={cn('w-6 h-6', isActive && 'text-gold-400')} />
                      <span className="text-xs mt-1">{item.label}</span>
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      )}

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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                    <span className="text-white font-bold">L</span>
                  </div>
                  <div>
                    <span className="font-heading font-bold text-gray-900">Menu</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="px-4 py-4">
                <div className="space-y-1">
                  {mobileMenuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center group-hover:bg-gold-200 transition-colors">
                            <Icon className="w-5 h-5 text-gold-600" />
                          </div>
                          <span className="flex-1 text-lg font-medium text-gray-900">{item.label}</span>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* VNFTF Link */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    href="https://vnftf.org"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-xl bg-authority-black hover:bg-gray-900 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center">
                      <span className="text-authority-black font-bold text-sm">VN</span>
                    </div>
                    <div>
                      <span className="block text-white font-medium">Voice Notes From The Father</span>
                      <span className="block text-sm text-gray-400">Daily devotionals</span>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
