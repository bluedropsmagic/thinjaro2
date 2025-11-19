import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const mockObjectives = {
  hydration: { title: "Hydration", description: "Drink 2 liters of water today" },
  exercise: { title: "Exercise", description: "15 minutes of physical activity" },
  nutrition: { title: "Nutrition", description: "3 balanced meals" },
  sleep: { title: "Sleep", description: "Get 7-8 hours of sleep" },
  mindfulness: { title: "Mindfulness", description: "5 minutes of meditation" }
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const userData = await req.json();

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    const systemPrompt = `Generate personalized objectives ONLY for the first 3 days.
Return ONLY valid JSON:
{
  "days": [
    {"day": 1, "objectives": {"hydration": {"title": "...", "description": "..."}, "exercise": {...}, "nutrition": {...}, "sleep": {...}, "mindfulness": {...}}},
    {"day": 2, "objectives": {...}},
    {"day": 3, "objectives": {...}}
  ]
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Profile: ${JSON.stringify(userData)}` }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let aiDays;
    try {
      const parsed = JSON.parse(content);
      aiDays = parsed.days;
    } catch (e) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        aiDays = parsed.days;
      } else {
        throw new Error("Failed to parse AI response");
      }
    }

    const protocol_30_days = [];

    for (let day = 1; day <= 30; day++) {
      const dayObjectives = [];

      if (day <= 3 && aiDays && aiDays[day - 1]) {
        const aiDay = aiDays[day - 1];
        for (const [type, obj] of Object.entries(aiDay.objectives)) {
          dayObjectives.push({
            type,
            title: obj.title,
            description: obj.description,
            completed: false
          });
        }
      } else {
        for (const [type, obj] of Object.entries(mockObjectives)) {
          dayObjectives.push({
            type,
            title: obj.title,
            description: obj.description,
            completed: false
          });
        }
      }

      protocol_30_days.push({
        day,
        objectives: dayObjectives
      });
    }

    const fullProtocol = {
      overall_completion: 0,
      day_streak: 0,
      todays_journey: protocol_30_days[0].objectives,
      protocol_30_days
    };

    return new Response(JSON.stringify(fullProtocol), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate protocol" }),
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