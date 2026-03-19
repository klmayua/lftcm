'use client';

import Link from 'next/link';
import { Plus, Users, Calendar, DollarSign, Mic } from 'lucide-react';

const actions = [
  {
    name: 'Add Member',
    description: 'Register a new church member',
    href: '/people/new',
    icon: Users,
    color: 'blue',
  },
  {
    name: 'Create Event',
    description: 'Schedule a new church event',
    href: '/events/new',
    icon: Calendar,
    color: 'green',
  },
  {
    name: 'Record Donation',
    description: 'Log a new donation or tithe',
    href: '/giving/new',
    icon: DollarSign,
    color: 'gold',
  },
  {
    name: 'Publish VNFTF',
    description: 'Create new voice note',
    href: '/vnftf/new',
    icon: Mic,
    color: 'purple',
  },
];

export function QuickActions() {
  return (
    <div className="admin-card">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>

      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.name}
              href={action.href}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gold-300 hover:bg-gold-50/50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                action.color === 'blue'
                  ? 'bg-blue-100'
                  : action.color === 'green'
                  ? 'bg-green-100'
                  : action.color === 'gold'
                  ? 'bg-yellow-100'
                  : 'bg-purple-100'
              }`}
              >
                <Icon className={`w-5 h-5 ${
                  action.color === 'blue'
                    ? 'text-blue-600'
                    : action.color === 'green'
                    ? 'text-green-600'
                    : action.color === 'gold'
                    ? 'text-yellow-600'
                    : 'text-purple-600'
                }`} />
              </div>

              <div className="flex-1">
                <p className="font-medium text-gray-900">{action.name}</p>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>

              <Plus className="w-5 h-5 text-gray-400" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
