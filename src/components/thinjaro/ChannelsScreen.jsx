import React, { useState, useEffect } from 'react';
import { Play, Calendar, Loader2, Youtube, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchYouTubeFeed } from '@/services/youtubeRssFeed';

export default function ChannelsScreen() {
  const [channelData, setChannelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

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
        <div className="space-y-5">
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
              <div className="p-4 pb-3">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={channelData.channelAvatar}
                    alt={channelData.channelAuthor}
                    className="w-12 h-12 rounded-full"
                    style={{
                      boxShadow: '3px 3px 10px rgba(232, 166, 193, 0.3)',
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {channelData.channelAuthor}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Youtube size={12} className="text-red-500" />
                      <span>{formatDate(video.published)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedVideo(video)}
                className="block w-full"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{
                      background: 'linear-gradient(135deg, #E8A6C1 0%, #C9A6E8 100%)',
                      boxShadow: '0 8px 24px rgba(232, 166, 193, 0.6)',
                    }}>
                      <Play size={24} fill="white" className="text-white ml-1" />
                    </div>
                  </div>
                </div>
              </button>

              <div className="p-4 pt-3">
                <h2 className="font-bold text-gray-800 line-clamp-2 text-base leading-snug">
                  {video.title}
                </h2>
              </div>
            </motion.div>
          ))}
        </div>
      ) : null}

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              style={{
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              }}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/70 backdrop-blur-sm text-white hover:bg-black/90 transition-all"
              >
                <X size={20} />
              </button>

              <div className="aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              <div className="p-5 bg-white">
                <h3 className="font-bold text-gray-800 text-lg mb-3">
                  {selectedVideo.title}
                </h3>
                <div className="flex items-center gap-3">
                  <img
                    src={channelData.channelAvatar}
                    alt={channelData.channelAuthor}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {channelData.channelAuthor}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Youtube size={12} className="text-red-500" />
                      <span>{formatDate(selectedVideo.published)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}