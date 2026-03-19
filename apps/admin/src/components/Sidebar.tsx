'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  BookOpen,
  Heart,
  Settings,
  X,
  ChevronRight,
  Building2,
  GraduationCap,
  Briefcase,
  Package,
  Home,
  Mic,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'People', href: '/people', icon: Users },
  { name: 'Services', href: '/services', icon: Calendar },
  { name: 'Sermons', href: '/sermons', icon: BookOpen },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Giving', href: '/giving', icon: DollarSign },
  { name: 'Prayer', href: '/prayer', icon: Heart },
];

const management = [
  { name: 'HR & Payroll', href: '/hr', icon: Briefcase },
  { name: 'Accounting', href: '/accounting', icon: DollarSign },
  { name: 'School', href: '/school', icon: GraduationCap },
  { name: 'Facilities', href: '/facilities', icon: Building2 },
  { name: 'Inventory', href: '/inventory', icon: Package },
];

const other = [
  { name: 'VNFTF', href: '/vnftf', icon: Mic },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const NavSection = ({ title, items }: { title: string; items: typeof navigation }) => (
    <div className="mb-6">
      <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </h3>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -100 + '%',
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto lg:translate-x-0 lg:opacity-100 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">LFT</span>
            </div>
            <div>
              <span className="font-bold text-gray-900">LFTCM</span>
              <span className="block text-xs text-gray-500">Admin</span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <NavSection title="Main" items={navigation} />
          <NavSection title="Management" items={management} />
          <NavSection title="Other" items={other} />
        </div>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-600 font-semibold">PV</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Pastor Kaben
              </p>
              <p className="text-xs text-gray-500 truncate">Super Admin</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
