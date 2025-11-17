import { XMLParser } from 'fast-xml-parser';

const YOUTUBE_CHANNEL_ID = 'UCZUUZFex6AaIU4QTopFudYA';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const RSS_PROXY_URL = `${SUPABASE_URL}/functions/v1/youtube-rss-proxy?channel_id=${YOUTUBE_CHANNEL_ID}`;
const AVATAR_PROXY_URL = `${SUPABASE_URL}/functions/v1/youtube-avatar-proxy?channel_id=${YOUTUBE_CHANNEL_ID}`;
const AVATAR_CACHE_KEY = 'youtube_channel_avatar';
const CACHE_DURATION = 60 * 60 * 1000;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
});

async function fetchChannelAvatar() {
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
    return `https://ui-avatars.com/api/?name=Channel&size=200&background=E8A6C1&color=fff&bold=true`;
  }
}

export async function fetchYouTubeFeed() {
  try {
    const [rssResponse, channelAvatar] = await Promise.all([
      fetch(RSS_PROXY_URL),
      fetchChannelAvatar()
    ]);

    if (!rssResponse.ok) {
      throw new Error(`Failed to fetch RSS feed: ${rssResponse.status}`);
    }

    const xmlText = await rssResponse.text();
    const result = parser.parse(xmlText);

    const channelTitle = result.feed?.title || '';
    const channelAuthor = result.feed?.author?.name || '';
    const channelLink = result.feed?.author?.uri || '';

    const entries = result.feed?.entry || [];
    const videos = Array.isArray(entries) ? entries : [entries];

    return {
      channelTitle,
      channelAuthor,
      channelLink,
      channelId: YOUTUBE_CHANNEL_ID,
      channelAvatar,
      videos: videos.slice(0, 3).map(video => ({
        id: video['yt:videoId'],
        title: video.title,
        thumbnail: video['media:group']?.['media:thumbnail']?.['@_url'] || '',
        published: video.published,
        link: video.link?.['@_href'] || `https://www.youtube.com/watch?v=${video['yt:videoId']}`,
        author: video.author?.name || '',
        description: video['media:group']?.['media:description'] || ''
      }))
    };
  } catch (error) {
    console.error('Error fetching YouTube RSS feed:', error);
    throw error;
  }
}
