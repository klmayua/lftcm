'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Play, Calendar, Heart, Menu, X, BookOpen, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Play, label: 'Sermons', href: '/sermons' },
  { icon: Calendar, label: 'Events', href: '/events' },
  { icon: Heart, label: 'Give', href: '/give', highlight: true },
  { icon: Menu, label: 'More', href: '#', isMenu: true },
];

const menuItems = [
  { icon: BookOpen, label: 'About Us', href: '/about' },
  { icon: Users, label: 'Leadership', href: '/leadership' },
  { icon: Calendar, label: 'Services', href: '/services' },
  { icon: Heart, label: 'Prayer Request', href: '/prayer' },
  { icon: Users, label: 'Branches', href: '/branches' },
  { icon: BookOpen, label: 'Contact', href: '/contact' },
];

export function MobileNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="bg-authority-black border-t border-gold-500/30">
          <div className="flex items-center justify-around px-2 pb-safe">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              const isMenu = item.isMenu;

              if (isMenu) {
                return (
                  <button
                    key={item.label}
                    onClick={() => setIsMenuOpen(true)}
                    className="flex flex-col items-center justify-center py-3 px-4 min-w-[64px] touch-target"
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
                  className={`flex flex-col items-center justify-center py-3 px-4 min-w-[64px] touch-target transition-colors ${
                    isActive ? 'text-gold-400' : 'text-gray-400'
                  } ${item.highlight ? 'relative' : ''}`}
                >
                  {item.highlight && (
                    <div className="absolute -top-1 w-12 h-12 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-gold">
                      <Icon className="w-5 h-5 text-authority-black" />
                    </div>
                  )}
                  {!item.highlight && <Icon className={`w-6 h-6 ${isActive ? 'text-gold-400' : ''}`} />}
                  <span className={`text-xs mt-1 ${item.highlight ? 'mt-3' : ''}`}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Full Screen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 lg:hidden max-h-[80vh] overflow-y-auto"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Close Button */}
              <div className="flex justify-end px-4">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Menu Items */}
              <div className="px-4 pb-8">
                <div className="space-y-1">
                  {menuItems.map((item, index) => {
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
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-gold-600" />
                          </div>
                          <span className="text-lg font-medium text-gray-900">{item.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* VNFTF Link */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    href="https://vnftf.org"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-xl bg-authority-black"
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
