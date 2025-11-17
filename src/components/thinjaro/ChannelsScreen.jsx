import React, { useState, useEffect } from 'react';
import { Play, Calendar, Loader2, Youtube, X, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChannels, fetchChannelVideos, addChannel, deleteChannel } from '@/services/channelsService';

export default function ChannelsScreen() {
  const [channels, setChannels] = useState([]);
  const [expandedChannelId, setExpandedChannelId] = useState(null);
  const [channelVideos, setChannelVideos] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState({});
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [newChannelId, setNewChannelId] = useState('');
  const [addingChannel, setAddingChannel] = useState(false);

  const loadChannels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getChannels();
      setChannels(data);
    } catch (err) {
      setError('Failed to load channels. Please try again later.');
      console.error('Error loading channels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChannels();
  }, []);

  const handleExpandChannel = async (channel) => {
    const isExpanding = expandedChannelId !== channel.id;
    setExpandedChannelId(isExpanding ? channel.id : null);

    if (isExpanding && !channelVideos[channel.id]) {
      setLoadingVideos(prev => ({ ...prev, [channel.id]: true }));
      try {
        const videos = await fetchChannelVideos(channel.channel_id);
        setChannelVideos(prev => ({ ...prev, [channel.id]: videos }));
      } catch (err) {
        console.error('Error loading videos:', err);
      } finally {
        setLoadingVideos(prev => ({ ...prev, [channel.id]: false }));
      }
    }
  };

  const handleAddChannel = async (e) => {
    e.preventDefault();
    if (!newChannelId.trim()) return;

    setAddingChannel(true);
    try {
      await addChannel(newChannelId.trim());
      setNewChannelId('');
      setShowAddChannel(false);
      await loadChannels();
    } catch (err) {
      alert('Failed to add channel. Please check the channel ID and try again.');
      console.error('Error adding channel:', err);
    } finally {
      setAddingChannel(false);
    }
  };

  const handleDeleteChannel = async (channelId) => {
    if (!confirm('Are you sure you want to remove this channel?')) return;

    try {
      await deleteChannel(channelId);
      await loadChannels();
      if (expandedChannelId === channelId) {
        setExpandedChannelId(null);
      }
    } catch (err) {
      alert('Failed to delete channel.');
      console.error('Error deleting channel:', err);
    }
  };

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
      <div className="mb-6">
        <button
          onClick={() => setShowAddChannel(!showAddChannel)}
          className="w-full px-6 py-4 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2"
          style={{
            background: showAddChannel ? '#E8A6C1' : 'white',
            color: showAddChannel ? 'white' : '#E8A6C1',
            boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.2), -8px -8px 24px rgba(255, 255, 255, 0.9)',
          }}
        >
          <Plus size={20} />
          {showAddChannel ? 'Cancel' : 'Add Channel'}
        </button>

        <AnimatePresence>
          {showAddChannel && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAddChannel}
              className="mt-4 overflow-hidden"
            >
              <div className="p-5 rounded-2xl bg-white"
                style={{
                  boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.2), -8px -8px 24px rgba(255, 255, 255, 0.9)',
                }}
              >
                <input
                  type="text"
                  value={newChannelId}
                  onChange={(e) => setNewChannelId(e.target.value)}
                  placeholder="Enter YouTube Channel ID"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#E8A6C1] outline-none mb-3"
                  disabled={addingChannel}
                />
                <button
                  type="submit"
                  disabled={addingChannel || !newChannelId.trim()}
                  className="w-full px-6 py-3 rounded-xl bg-[#E8A6C1] text-white font-semibold hover:bg-[#d995b0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingChannel ? 'Adding...' : 'Add Channel'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-[#E8A6C1] animate-spin mb-4" />
          <p className="text-gray-600">Loading channels...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={loadChannels}
            className="px-6 py-3 rounded-full bg-[#E8A6C1] text-white font-semibold hover:bg-[#d995b0] transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {channels.map((channel, index) => (
            <motion.div
              key={channel.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 * index }}
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'white',
                boxShadow: '8px 8px 24px rgba(232, 166, 193, 0.2), -8px -8px 24px rgba(255, 255, 255, 0.9)',
              }}
            >
              <button
                onClick={() => handleExpandChannel(channel)}
                className="w-full p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <img
                  src={channel.channel_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.channel_author)}&size=200&background=E8A6C1&color=fff&bold=true`}
                  alt={channel.channel_author}
                  className="w-16 h-16 rounded-full flex-shrink-0"
                  style={{
                    boxShadow: '3px 3px 10px rgba(232, 166, 193, 0.3)',
                  }}
                />
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-gray-800 text-lg mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {channel.channel_author}
                  </h3>
                  <p className="text-sm text-gray-500">{channel.channel_title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChannel(channel.id);
                    }}
                    className="p-2 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                  {expandedChannelId === channel.id ? (
                    <ChevronUp size={24} className="text-[#E8A6C1]" />
                  ) : (
                    <ChevronDown size={24} className="text-gray-400" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {expandedChannelId === channel.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-gray-100 p-5 pt-4">
                      {loadingVideos[channel.id] ? (
                        <div className="flex flex-col items-center justify-center py-10">
                          <Loader2 className="w-8 h-8 text-[#E8A6C1] animate-spin mb-3" />
                          <p className="text-gray-600 text-sm">Loading videos...</p>
                        </div>
                      ) : channelVideos[channel.id] ? (
                        <div className="space-y-4">
                          {channelVideos[channel.id].map((video) => (
                            <div
                              key={video.id}
                              className="rounded-2xl overflow-hidden bg-gray-50"
                            >
                              <button
                                onClick={() => setSelectedVideo({ video, channel })}
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

                              <div className="p-4">
                                <h4 className="font-bold text-gray-800 line-clamp-2 text-sm leading-snug mb-2">
                                  {video.title}
                                </h4>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                  <Youtube size={12} className="text-red-500" />
                                  <span>{formatDate(video.published)}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

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
                  src={`https://www.youtube.com/embed/${selectedVideo.video.id}?autoplay=1`}
                  title={selectedVideo.video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              <div className="p-5 bg-white">
                <h3 className="font-bold text-gray-800 text-lg mb-3">
                  {selectedVideo.video.title}
                </h3>
                <div className="flex items-center gap-3">
                  <img
                    src={selectedVideo.channel.channel_avatar}
                    alt={selectedVideo.channel.channel_author}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {selectedVideo.channel.channel_author}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Youtube size={12} className="text-red-500" />
                      <span>{formatDate(selectedVideo.video.published)}</span>
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
