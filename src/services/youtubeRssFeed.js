import { XMLParser } from 'fast-xml-parser';

const YOUTUBE_CHANNEL_ID = 'UCZUUZFex6AaIU4QTopFudYA';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const RSS_PROXY_URL = `${SUPABASE_URL}/functions/v1/youtube-rss-proxy?channel_id=${YOUTUBE_CHANNEL_ID}`;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
});

export async function fetchYouTubeFeed() {
  try {
    const response = await fetch(RSS_PROXY_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }

    const xmlText = await response.text();
    const result = parser.parse(xmlText);

    const channelTitle = result.feed?.title || '';
    const channelAuthor = result.feed?.author?.name || '';
    const channelLink = result.feed?.author?.uri || '';
    const channelAvatar = `https://yt3.ggpht.com/ytc/AIdro_k${YOUTUBE_CHANNEL_ID.substring(2, 20)}`;

    const entries = result.feed?.entry || [];
    const videos = Array.isArray(entries) ? entries : [entries];

    return {
      channelTitle,
      channelAuthor,
      channelLink,
      channelId: YOUTUBE_CHANNEL_ID,
      channelAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(channelAuthor)}&size=200&background=E8A6C1&color=fff&bold=true`,
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
