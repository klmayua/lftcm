'use client';

import { motion } from 'framer-motion';
import { Users, Calendar, DollarSign, Heart } from 'lucide-react';

const stats = [
  {
    name: 'Total Members',
    value: '1,248',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
    color: 'blue',
  },
  {
    name: 'This Sunday',
    value: '342',
    change: '+5%',
    changeType: 'positive',
    icon: Calendar,
    color: 'green',
  },
  {
    name: 'Monthly Giving',
    value: 'XAF 2.4M',
    change: '+8%',
    changeType: 'positive',
    icon: DollarSign,
    color: 'gold',
  },
  {
    name: 'Prayer Requests',
    value: '23',
    change: '3 new',
    changeType: 'neutral',
    icon: Heart,
    color: 'purple',
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="admin-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>

              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                stat.color === 'blue'
                  ? 'bg-blue-100'
                  : stat.color === 'green'
                  ? 'bg-green-100'
                  : stat.color === 'gold'
                  ? 'bg-yellow-100'
                  : 'bg-purple-100'
              }`}
              >
                <Icon className={`w-6 h-6 ${
                  stat.color === 'blue'
                    ? 'text-blue-600'
                    : stat.color === 'green'
                    ? 'text-green-600'
                    : stat.color === 'gold'
                    ? 'text-yellow-600'
                    : 'text-purple-600'
                }`} />
              </div>
            </div>

            <div className="mt-4">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive'
                  ? 'text-green-600'
                  : stat.changeType === 'negative'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
