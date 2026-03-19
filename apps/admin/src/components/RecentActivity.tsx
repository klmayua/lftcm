'use client';

import { Users, DollarSign, Calendar, Heart } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'member',
    title: 'New Member Registered',
    description: 'Jane Smith joined the church',
    time: '1 hour ago',
    icon: Users,
    color: 'gold',
    href: '/people/123',
  },
  {
    id: 2,
    type: 'donation',
    title: 'New Donation Received',
    description: 'XAF 50,000 tithe from John Doe',
    time: '2 hours ago',
    icon: DollarSign,
    color: 'green',
    href: '/giving/456',
  },
  {
    id: 3,
    type: 'event',
    title: 'Event Registration',
    description: '5 new registrations for Youth Conference',
    time: '3 hours ago',
    icon: Calendar,
    color: 'blue',
    href: '/events/789',
  },
  {
    id: 4,
    type: 'prayer',
    title: 'Prayer Request',
    description: 'New urgent prayer request submitted',
    time: '5 hours ago',
    icon: Heart,
    color: 'purple',
    href: '/prayer/101',
  },
  {
    id: 5,
    type: 'member',
    title: 'Member Updated',
    description: 'Sarah Johnson updated contact information',
    time: 'Yesterday',
    icon: Users,
    color: 'gold',
    href: '/people/112',
  },
];

export function RecentActivity() {
  return (
    <div className="admin-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
        <button className="text-sm text-gold-600 hover:text-gold-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <a
              key={activity.id}
              href={activity.href}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                activity.color === 'blue'
                  ? 'bg-blue-100'
                  : activity.color === 'green'
                  ? 'bg-green-100'
                  : activity.color === 'gold'
                  ? 'bg-yellow-100'
                  : 'bg-purple-100'
              }`}
              >
                <Icon className={`w-5 h-5 ${
                  activity.color === 'blue'
                    ? 'text-blue-600'
                    : activity.color === 'green'
                    ? 'text-green-600'
                    : activity.color === 'gold'
                    ? 'text-yellow-600'
                    : 'text-purple-600'
                }`} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.description}</p>
              </div>

              <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
