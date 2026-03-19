'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Play, Headphones, Radio, Users, BookOpen, ArrowRight, ExternalLink } from 'lucide-react';
import { useVNFTFStats, useVNFTFVoiceNotes } from '@/hooks/useVNFTF';
import { Skeleton } from '@/components/ui/Skeleton';

export default function VNFTFPage() {
  const { data: stats, isLoading: statsLoading } = useVNFTFStats();
  const { data: voiceNotes, isLoading: notesLoading } = useVNFTFVoiceNotes();

  return (
    <div className="min-h-screen bg-authority-black">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] altar-glow opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 } }
              animate={{ opacity: 1, y: 0 } }
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <Radio className="w-6 h-6 text-authority-black" />
              </div>
              <span className="text-gold-400 font-semibold tracking-wider uppercase">
                Partner Ministry
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 } }
              animate={{ opacity: 1, y: 0 } }
              transition={{ delay: 0.1 } }
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white mb-6"
            >
              Voice Notes From
              <br />
              <span className="text-gold-gradient">The Father</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 } }
              animate={{ opacity: 1, y: 0 } }
              transition={{ delay: 0.2 } }
              className="text-gray-300 text-lg mb-8 leading-relaxed"
            >
              Receive daily Spirit-led devotionals inspired by the words of Jesus.
              Join thousands of believers worldwide growing in faith through daily
              voice notes delivered straight to your phone.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 } }
              animate={{ opacity: 1, y: 0 } }
              transition={{ delay: 0.3 } }
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="https://vnftf.org/subscribe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-gold-500 text-authority-black font-semibold rounded-xl hover:bg-gold-400 transition-colors"
              >
                Subscribe Now
                <ExternalLink className="w-5 h-5 ml-2" />
              </Link>

              <Link
                href="#voice-notes"
                className="inline-flex items-center justify-center px-8 py-4 text-white border border-gray-600 rounded-xl hover:border-gold-500 hover:text-gold-400 transition-colors"
              >
                <Headphones className="w-5 h-5 mr-2" />
                Browse Voice Notes
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCard
                icon={Users}
                value={stats.totalSubscribers.toLocaleString()}
                label="Total Subscribers"
              />
              <StatCard
                icon={Users}
                value={stats.activeSubscribers.toLocaleString()}
                label="Active Subscribers"
              />
              <StatCard
                icon={BookOpen}
                value={stats.syncedVoiceNotes.toLocaleString()}
                label="Voice Notes"
              />
              <StatCard
                icon={Radio}
                value="Daily"
                label="Delivery"
              />
            </div>
          ) : null}
        </div>
      </section>

      {/* Voice Notes Section */}
      <section id="voice-notes" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-heading font-bold text-white mb-2">
                Recent Voice Notes
              </h2>
              <p className="text-gray-400">
                Listen to recent devotionals from VNFTF
              </p>
            </div>

            <Link
              href="/sermons?source=VNFTF"
              className="hidden sm:inline-flex items-center text-gold-400 hover:text-gold-300"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {notesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : voiceNotes && voiceNotes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {voiceNotes.slice(0, 6).map((note) => (
                <VoiceNoteCard key={note.id} note={note} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Headphones className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Voice Notes Yet
              </h3>
              <p className="text-gray-400">
                Voice notes will appear here once synced from VNFTF
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-authority-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">
            Start Your Daily Devotional Journey
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of believers receiving daily Spirit-led voice notes.
            Available via WhatsApp, Telegram, or direct phone delivery.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://vnftf.org/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-gold-500 text-authority-black font-semibold rounded-xl hover:bg-gold-400 transition-colors"
            >
              Subscribe for Daily Notes
              <ExternalLink className="w-5 h-5 ml-2" />
            </Link>

            <Link
              href="https://vnftf.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 text-white border border-gray-600 rounded-xl hover:border-gold-500 hover:text-gold-400 transition-colors"
            >
              Visit VNFTF Website
              <ExternalLink className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Stat Card Component
function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Users;
  value: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-500/10 text-gold-400 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

// Voice Note Card Component
function VoiceNoteCard({ note }: { note: { id: string; title: string; description?: string; audioUrl: string; duration: number; scripture?: string[]; publishedAt: string; thumbnailUrl?: string } }) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Link href={`/sermons/${note.id}`}>
      <div className="card-dark p-6 border-gold-500/20 hover:border-gold-500/50 transition-colors group">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Play className="w-5 h-5 text-authority-black ml-0.5" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold mb-1 line-clamp-2 group-hover:text-gold-400 transition-colors">
              {note.title}
            </h3>
            {note.scripture && note.scripture.length > 0 && (
              <p className="text-sm text-gold-400">{note.scripture[0]}</p>
            )}
          </div>
        </div>

        {note.description && (
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">
            {note.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{formatDuration(note.duration)}</span>
          <span>{new Date(note.publishedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}
