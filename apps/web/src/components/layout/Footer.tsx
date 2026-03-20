'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, ChevronDown, Heart } from 'lucide-react';

const footerLinks = {
  about: [
    { label: 'Our Story', href: '/about' },
    { label: 'Leadership', href: '/leadership' },
    { label: 'Vision & Mission', href: '/about#vision' },
    { label: 'Statement of Faith', href: '/about#faith' },
  ],
  ministries: [
    { label: 'Voice Notes (VNFTF)', href: 'https://vnftf.org' },
    { label: 'Small Groups', href: '/groups' },
    { label: 'Prayer Team', href: '/prayer' },
    { label: 'Volunteer', href: '/volunteer' },
  ],
  resources: [
    { label: 'Sermons', href: '/sermons' },
    { label: 'Events', href: '/events' },
    { label: 'Branches', href: '/branches' },
    { label: 'Contact', href: '/contact' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

// Accordion for mobile footer sections
function FooterAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-800 md:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 md:py-0 md:mb-4 text-left"
      >
        <h4 className="font-semibold text-white text-sm md:text-base">{title}</h4>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 md:hidden transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div className={`${isOpen ? 'block' : 'hidden'} md:block pb-3 md:pb-0`>{children}</div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-authority-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Brand - Always visible */}
          <div className="md:col-span-4 lg:col-span-1 mb-4 md:mb-8 lg:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-300 via-gold-500 to-gold-700 flex items-center justify-center">
                <span className="text-authority-black font-bold text-lg">LFT</span>
              </div>
              <div>
                <span className="font-heading font-bold text-sm md:text-base">Living Faith</span>
                <span className="block text-xs text-gray-400">Tabernacle Cameroon</span>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-4 md:mb-6 max-w-xs">
              Winning the world with the Word of faith. Join us in transforming
              lives through the power of God&apos;s Word.
            </p>

            {/* Social Links */}
            <div className="flex gap-2 md:gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gold-500 hover:text-authority-black transition-colors active:scale-95"
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links - Collapsible on Mobile */}
          <div className="md:col-span-1">
            <FooterAccordion title="About">
              <ul className="space-y-2 md:space-y-3">
                {footerLinks.about.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-gold-400 text-sm transition-colors inline-block py-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterAccordion>
          </div>

          <div className="md:col-span-1">
            <FooterAccordion title="Ministries">
              <ul className="space-y-2 md:space-y-3">
                {footerLinks.ministries.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-gold-400 text-sm transition-colors inline-block py-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterAccordion>
          </div>

          <div className="md:col-span-1">
            <FooterAccordion title="Resources">
              <ul className="space-y-2 md:space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-gold-400 text-sm transition-colors inline-block py-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterAccordion>
          </div>

          {/* Contact - Always visible */}
          <div className="md:col-span-1 pt-4 md:pt-0 border-t border-gray-800 md:border-none">
            <h4 className="font-semibold text-white mb-3 md:mb-4 text-sm md:text-base">Contact</h4>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a
                  href="mailto:info@lftcm.org"
                  className="flex items-center gap-2 text-gray-400 hover:text-gold-400 text-sm transition-colors"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">info@lftcm.org</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+237XXXXXXXXX"
                  className="flex items-center gap-2 text-gray-400 hover:text-gold-400 text-sm transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+237 XXX XXX XXX</span>
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Yaoundé, Cameroon</span>
                </span>
              </li>
            </ul>

            {/* Quick CTA */}
            <div className="mt-4 md:mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center text-sm text-gold-400 hover:text-gold-300 transition-colors"
              >
                Get in touch
                <ChevronDown className="w-4 h-4 ml-1 -rotate-90" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile App Download - Optional */}
        <div className="mt-8 pt-6 border-t border-gray-800 md:hidden">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Stay connected with our app</p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 text-gold-400 text-sm font-medium"
            >
              Download Mobile App
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
              © {new Date().getFullYear()} Living Faith Tabernacle Cameroon. All rights reserved.
            </p>

            <div className="flex items-center gap-4 md:gap-6">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-gold-400 text-xs md:text-sm transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-gold-400 text-xs md:text-sm transition-colors"
              >
                Terms
              </Link>
              <span className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
                Made with <Heart className="w-3 h-3 text-red-400" fill="currentColor" /> in Cameroon
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
