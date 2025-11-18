import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { userId, userData } = await req.json();

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    const systemPrompt = `Gere objetivos personalizados para dias 4-30 (27 dias).
Divida em 3 fases progressivas:
- Dias 4-13: Nível Iniciante
- Dias 14-23: Nível Intermediário
- Dias 24-30: Nível Avançado

Retorne SOMENTE JSON:
{
  "phases": [
    {"days": "4-13", "objectives": {"hydration": {"title": "...", "description": "..."}, ...}},
    {"days": "14-23", "objectives": {...}},
    {"days": "24-30", "objectives": {...}}
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
          { role: "user", content: `Perfil: ${JSON.stringify(userData)}` }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error("OpenAI API error");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let phases;
    try {
      const parsed = JSON.parse(content);
      phases = parsed.phases;
    } catch (e) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        phases = parsed.phases;
      } else {
        throw new Error("Failed to parse AI response");
      }
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: protocol } = await supabase
      .from("user_protocols")
      .select("protocol_data")
      .eq("user_id", userId)
      .single();

    if (!protocol) {
      throw new Error("Protocol not found");
    }

    const protocolData = protocol.protocol_data;

    for (let day = 4; day <= 30; day++) {
      let phaseIndex;
      if (day <= 13) phaseIndex = 0;
      else if (day <= 23) phaseIndex = 1;
      else phaseIndex = 2;

      const phase = phases[phaseIndex];
      const dayObjectives = [];

      for (const [type, obj] of Object.entries(phase.objectives)) {
        dayObjectives.push({
          type,
          title: obj.title,
          description: obj.description,
          completed: false
        });
      }

      protocolData.protocol_30_days[day - 1] = {
        day,
        objectives: dayObjectives
      };
    }

    await supabase
      .from("user_protocols")
      .update({ protocol_data: protocolData })
      .eq("user_id", userId);

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating remaining days:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
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