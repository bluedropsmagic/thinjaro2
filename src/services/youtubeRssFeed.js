import { XMLParser } from 'fast-xml-parser';
import { supabase } from '@/lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const CACHE_DURATION = 60 * 60 * 1000;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
});

async function fetchChannelAvatar(channelId, channelAuthor) {
  const AVATAR_CACHE_KEY = `youtube_channel_avatar_${channelId}`;
  const AVATAR_PROXY_URL = `${SUPABASE_URL}/functions/v1/youtube-avatar-proxy?channel_id=${channelId}`;

  try {
    const cached = localStorage.getItem(AVATAR_CACHE_KEY);

    if (cached) {
      const { avatar, timestamp } = JSON.parse(cached);
      const now = Date.now();

      if ((now - timestamp) < CACHE_DURATION) {
        return avatar;
      }
    }

    const response = await fetch(AVATAR_PROXY_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch avatar: ${response.status}`);
    }

    const data = await response.json();

    if (data.avatar) {
      localStorage.setItem(AVATAR_CACHE_KEY, JSON.stringify({
        avatar: data.avatar,
        timestamp: Date.now()
      }));

      return data.avatar;
    }

    throw new Error('No avatar found in response');
  } catch (error) {
    console.error('Error fetching channel avatar:', error);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(channelAuthor)}&size=200&background=E8A6C1&color=fff&bold=true`;
  }
}

async function fetchChannelFeed(channelId, channelAuthor) {
  const RSS_PROXY_URL = `${SUPABASE_URL}/functions/v1/youtube-rss-proxy?channel_id=${channelId}`;

  try {
    const [rssResponse, channelAvatar] = await Promise.all([
      fetch(RSS_PROXY_URL),
      fetchChannelAvatar(channelId, channelAuthor)
    ]);

    if (!rssResponse.ok) {
      throw new Error(`Failed to fetch RSS feed: ${rssResponse.status}`);
    }

    const xmlText = await rssResponse.text();
    const result = parser.parse(xmlText);

    const channelTitle = result.feed?.title || '';
    const channelLink = result.feed?.author?.uri || '';

    const entries = result.feed?.entry || [];
    const videos = Array.isArray(entries) ? entries : [entries];

    return {
      channelId,
      channelTitle,
      channelAuthor,
      channelLink,
      channelAvatar,
      videos: videos.slice(0, 3).map(video => ({
        id: video['yt:videoId'],
        title: video.title,
        thumbnail: video['media:group']?.['media:thumbnail']?.['@_url'] || '',
        published: video.published,
        link: video.link?.['@_href'] || `https://www.youtube.com/watch?v=${video['yt:videoId']}`,
        author: channelAuthor,
        channelId,
        channelAvatar,
        description: video['media:group']?.['media:description'] || ''
      }))
    };
  } catch (error) {
    console.error(`Error fetching feed for channel ${channelId}:`, error);
    return null;
  }
}

export async function fetchYouTubeFeed() {
  try {
    const { data: channels, error } = await supabase
      .from('youtube_channels')
      .select('*')
      .order('order_position', { ascending: true });

    if (error) {
      throw error;
    }

    if (!channels || channels.length === 0) {
      throw new Error('No channels found');
    }

    const channelFeeds = await Promise.all(
      channels.map(channel => fetchChannelFeed(channel.channel_id, channel.channel_author))
    );

    const validFeeds = channelFeeds.filter(feed => feed !== null);

    const allVideos = validFeeds.flatMap(feed => feed.videos);

    allVideos.sort((a, b) => new Date(b.published) - new Date(a.published));

    return {
      videos: allVideos
    };
  } catch (error) {
    console.error('Error fetching YouTube RSS feed:', error);
    throw error;
  }
}
