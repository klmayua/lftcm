'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Heart } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Sermons', href: '/sermons' },
  { label: 'Events', href: '/events' },
  { label: 'Branches', href: '/branches' },
  { label: 'Contact', href: '/contact' },
];

const ministryLinks = [
  { label: 'Voice Notes (VNFTF)', href: 'https://vnftf.org', external: true },
  { label: 'Prayer Request', href: '/prayer' },
  { label: 'Small Groups', href: '/groups' },
  { label: 'Volunteer', href: '/volunteer' },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMinistryOpen, setIsMinistryOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-300 via-gold-500 to-gold-700 flex items-center justify-center">
              <span className="text-authority-black font-bold text-lg">LFT</span>
            </div>
            <div className="hidden sm:block">
              <span className={`font-heading font-bold text-lg leading-tight ${
                isScrolled ? 'text-authority-black' : 'text-authority-black'
              }`}>
                Living Faith
              </span>
              <span className={`block text-xs ${
                isScrolled ? 'text-gray-600' : 'text-gray-600'
              }`}>
                Tabernacle Cameroon
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-gold-600 ${
                  pathname === link.href
                    ? 'text-gold-600'
                    : isScrolled
                    ? 'text-gray-700'
                    : 'text-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Ministries Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMinistryOpen(!isMinistryOpen)}
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-gold-600 ${
                  isScrolled ? 'text-gray-700' : 'text-gray-800'
                }`}
              >
                Ministries
                <ChevronDown className={`w-4 h-4 transition-transform ${isMinistryOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isMinistryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-gray-100 py-2"
                  >
                    {ministryLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gold-50 hover:text-gold-700"
                        onClick={() => setIsMinistryOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/give"
              className="btn-gold text-sm"
            >
              <Heart className="w-4 h-4 mr-2" />
              Give
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-lg text-base font-medium ${
                    pathname === link.href
                      ? 'bg-gold-50 text-gold-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-100">
                <span className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Ministries
                </span>
                {ministryLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 px-4 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/give"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-gold w-full justify-center"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Give Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
