'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Plus, Filter, Download, MoreHorizontal, Mail, Phone } from 'lucide-react';

const members = [
  {
    id: 1,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+237 6XX XXX XXX',
    status: 'Active',
    joined: '2025-01-15',
    department: 'Worship',
    image: null,
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+237 6XX XXX XXX',
    status: 'Active',
    joined: '2024-06-20',
    department: 'Ushering',
    image: null,
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+237 6XX XXX XXX',
    status: 'Inactive',
    joined: '2023-03-10',
    department: 'Media',
    image: null,
  },
  {
    id: 4,
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '+237 6XX XXX XXX',
    status: 'Active',
    joined: '2025-02-01',
    department: 'Protocol',
    image: null,
  },
  {
    id: 5,
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '+237 6XX XXX XXX',
    status: 'Active',
    joined: '2024-11-15',
    department: 'Children',
    image: null,
  },
];

export default function PeoplePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || member.status.toLowerCase() === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">People</h1>
          <p className="text-gray-500">Manage church members and visitors</p>
        </div>

        <div className="flex gap-3">
          <button className="admin-btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>

          <Link href="/people/new" className="admin-btn"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input pl-10"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="admin-input"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="visitor">Visitor</option>
            </select>

            <button className="admin-btn-secondary"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-x-auto"
003e
        <table className="admin-table w-full">
          <thead>
            <tr>
              <th>Member</th>
              <th>Contact</th>
              <th>Department</th>
              <th>Status</th>
              <th>Joined</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {member.phone}
                    </div>
                  </div>
                </td>

                <td>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {member.department}
                  </span>
                </td>

                <td>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    member.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {member.status}
                  </span>
                </td>

                <td className="text-gray-600">
                  {new Date(member.joined).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>

                <td className="text-right">
                  <button className="p-2 rounded-lg hover:bg-gray-100">
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing {filteredMembers.length} of {members.length} members
          </p>

          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              disabled
            >
              Previous
            </button>

            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
