import { XMLParser } from 'fast-xml-parser';

const YOUTUBE_CHANNEL_ID = 'UCLZ9JXR0xk_cbJrHQcfY7ng';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
});

export async function fetchYouTubeFeed() {
  try {
    const response = await fetch(RSS_URL);

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }

    const xmlText = await response.text();
    const result = parser.parse(xmlText);

    const entries = result.feed?.entry || [];
    const videos = Array.isArray(entries) ? entries : [entries];

    return videos.map(video => ({
      id: video['yt:videoId'],
      title: video.title,
      thumbnail: video['media:group']?.['media:thumbnail']?.['@_url'] || '',
      published: video.published,
      link: video.link?.['@_href'] || `https://www.youtube.com/watch?v=${video['yt:videoId']}`,
      author: video.author?.name || '',
      description: video['media:group']?.['media:description'] || ''
    }));
  } catch (error) {
    console.error('Error fetching YouTube RSS feed:', error);
    throw error;
  }
}
