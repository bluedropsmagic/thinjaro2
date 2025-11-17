const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const cache = new Map<string, { avatar: string; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const channelId = url.searchParams.get("channel_id");

    if (!channelId) {
      return new Response(
        JSON.stringify({ error: "channel_id parameter is required" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const now = Date.now();
    const cached = cache.get(channelId);

    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      return new Response(
        JSON.stringify({ avatar: cached.avatar, cached: true }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const channelUrl = `https://www.youtube.com/channel/${channelId}`;

    const response = await fetch(channelUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      throw new Error(`YouTube channel page returned status ${response.status}`);
    }

    const htmlText = await response.text();

    const imageSrcMatch = htmlText.match(/<link rel="image_src" href="([^"]+)"/);
    
    if (!imageSrcMatch || !imageSrcMatch[1]) {
      throw new Error("Could not find channel avatar in HTML");
    }

    const avatarUrl = imageSrcMatch[1];

    cache.set(channelId, {
      avatar: avatarUrl,
      timestamp: now,
    });

    return new Response(
      JSON.stringify({ avatar: avatarUrl, cached: false }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching YouTube avatar:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch YouTube avatar",
        message: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});