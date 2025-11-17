import { supabase } from '@/lib/supabase';
import { XMLParser } from 'fast-xml-parser';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const RSS_PROXY_URL = `${SUPABASE_URL}/functions/v1/youtube-rss-proxy`;
const AVATAR_PROXY_URL = `${SUPABASE_URL}/functions/v1/youtube-avatar-proxy`;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
});

export async function getChannels() {
  const { data, error } = await supabase
    .from('youtube_channels')
    .select('*')
    .order('order_position', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function addChannel(channelId) {
  const avatar = await fetchChannelAvatar(channelId);
  const feedData = await fetchChannelFeed(channelId);

  const { data, error } = await supabase
    .from('youtube_channels')
    .insert({
      channel_id: channelId,
      channel_title: feedData.channelTitle,
      channel_author: feedData.channelAuthor,
      channel_avatar: avatar,
      order_position: Date.now()
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function deleteChannel(id) {
  const { error } = await supabase
    .from('youtube_channels')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function updateChannelAvatar(channelId) {
  try {
    const avatar = await fetchChannelAvatar(channelId);

    const { error } = await supabase
      .from('youtube_channels')
      .update({
        channel_avatar: avatar,
        updated_at: new Date().toISOString()
      })
      .eq('channel_id', channelId);

    if (error) throw error;
    return avatar;
  } catch (error) {
    console.error('Error updating channel avatar:', error);
    throw error;
  }
}

async function fetchChannelAvatar(channelId) {
  try {
    const response = await fetch(`${AVATAR_PROXY_URL}?channel_id=${channelId}`, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch avatar: ${response.status}`);
    }

    const data = await response.json();
    return data.avatar || `https://ui-avatars.com/api/?name=Channel&size=200&background=E8A6C1&color=fff&bold=true`;
  } catch (error) {
    console.error('Error fetching channel avatar:', error);
    return `https://ui-avatars.com/api/?name=Channel&size=200&background=E8A6C1&color=fff&bold=true`;
  }
}

async function fetchChannelFeed(channelId) {
  const response = await fetch(`${RSS_PROXY_URL}?channel_id=${channelId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch RSS feed: ${response.status}`);
  }

  const xmlText = await response.text();
  const result = parser.parse(xmlText);

  return {
    channelTitle: result.feed?.title || '',
    channelAuthor: result.feed?.author?.name || ''
  };
}

export async function fetchChannelVideos(channelId) {
  try {
    const response = await fetch(`${RSS_PROXY_URL}?channel_id=${channelId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }

    const xmlText = await response.text();
    const result = parser.parse(xmlText);

    const entries = result.feed?.entry || [];
    const videos = Array.isArray(entries) ? entries : [entries];

    return videos.slice(0, 3).map(video => ({
      id: video['yt:videoId'],
      title: video.title,
      thumbnail: video['media:group']?.['media:thumbnail']?.['@_url'] || '',
      published: video.published,
      link: video.link?.['@_href'] || `https://www.youtube.com/watch?v=${video['yt:videoId']}`,
      author: video.author?.name || '',
      description: video['media:group']?.['media:description'] || ''
    }));
  } catch (error) {
    console.error('Error fetching channel videos:', error);
    throw error;
  }
}
