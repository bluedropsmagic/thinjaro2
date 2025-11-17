import React, { useState, useEffect } from 'react';
import { Play, Calendar, Loader2, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchYouTubeFeed } from '@/services/youtubeRssFeed';

export default function ChannelsScreen() {
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchYouTubeFeed();
      setChannelData(data);
    } catch (err) {
      setError('Failed to load videos. Please try again later.');
      console.error('Error loading videos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();

    const interval = setInterval(() => {
      loadVideos();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#FFF9FC] p-6 pb-24">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#E8A6C1] animate-spin mb-4" />
          <p className="text-gray-600">Loading videos...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={loadVideos}
            className="px-6 py-3 rounded-full bg-[#E8A6C1] text-white font-semibold hover:bg-[#d995b0] transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : channelData ? (
        <div>
          <div className="flex items-center gap-4 mb-6 p-5 rounded-3xl bg-white" style={{
            boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.2), -8px -8px 24px rgba(255, 255, 255, 0.9)',
          }}>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(channelData.channelAuthor)}&size=80&background=E8A6C1&color=fff&bold=true`}
              alt={channelData.channelAuthor}
              className="w-20 h-20 rounded-full"
              style={{
                boxShadow: '4px 4px 12px rgba(232, 166, 193, 0.3)',
              }}
            />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {channelData.channelAuthor}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Youtube size={16} className="text-red-500" />
                <span>YouTube Channel</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {channelData.videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 * index }}
                className="rounded-3xl overflow-hidden"
                style={{
                  background: 'white',
                  boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.2), -8px -8px 24px rgba(255, 255, 255, 0.9)',
                }}
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Youtube size={16} className="text-red-500 inline mr-1" />
                    <span className="text-white text-xs font-semibold">YouTube</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 text-lg">
                    {video.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar size={14} />
                    <span>{formatDate(video.published)}</span>
                  </div>

                  <a
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-bold text-white transition-all duration-300 active:scale-95"
                    style={{
                      background: 'linear-gradient(135deg, #E8A6C1 0%, #C9A6E8 100%)',
                      boxShadow: '4px 4px 16px rgba(232, 166, 193, 0.4), -4px -4px 16px rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <Play size={18} fill="white" />
                    Watch Now
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}