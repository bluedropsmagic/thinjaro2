import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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
    const userData = await req.json();

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    const systemPrompt = `
Você é um assistente especializado em saúde, nutrição, produtividade e mudança de hábitos.
Sua tarefa é gerar um protocolo personalizado de EXATAMENTE 30 dias no formato JSON.

REGRAS CRÍTICAS:
- A saída deve ser SOMENTE JSON válido.
- Não escreva explicações ou texto fora do JSON.
- OBRIGATÓRIO: Gere EXATAMENTE 30 dias no array "protocol_30_days".
- Cada dia DEVE ter EXATAMENTE 5 objetivos (hydration, exercise, nutrition, sleep, mindfulness).
- Os objetivos devem progredir gradualmente ao longo dos 30 dias.
- Seja específico e prático nas descrições.

ESTRUTURA EXATA DO JSON:

{
  "overall_completion": 0,
  "day_streak": 0,
  "todays_journey": [
    {
      "id": "hydration",
      "type": "hydration",
      "title": "Hidratação Matinal",
      "description": "2 copos de água ao acordar",
      "completed": false
    },
    {
      "id": "exercise",
      "type": "exercise",
      "title": "Exercício Diário",
      "description": "15-20 minutos de treino",
      "completed": false
    },
    {
      "id": "nutrition",
      "type": "nutrition",
      "title": "Alimentação Saudável",
      "description": "3 refeições balançeadas",
      "completed": false
    },
    {
      "id": "sleep",
      "type": "sleep",
      "title": "Sono de Qualidade",
      "description": "7-8 horas de sono",
      "completed": false
    },
    {
      "id": "mindfulness",
      "type": "mindfulness",
      "title": "Mindfulness",
      "description": "5 minutos de meditação",
      "completed": false
    }
  ],
  "protocol_30_days": [
    {
      "day": 1,
      "objectives": [
        {"type": "hydration", "title": "...", "description": "...", "completed": false},
        {"type": "exercise", "title": "...", "description": "...", "completed": false},
        {"type": "nutrition", "title": "...", "description": "...", "completed": false},
        {"type": "sleep", "title": "...", "description": "...", "completed": false},
        {"type": "mindfulness", "title": "...", "description": "...", "completed": false}
      ]
    },
    ... (repita até o dia 30)
  ]
}

IMPORTANTE: O array "protocol_30_days" DEVE conter TODOS os 30 dias, do dia 1 ao dia 30.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Aqui estão as respostas do usuário:\n\n${JSON.stringify(userData, null, 2)}\n\nGere o protocolo personalizado completo com todos os 30 dias agora.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log("OpenAI Response length:", content.length);

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (e) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        console.error("Failed to parse response:", content);
        throw new Error("Failed to parse OpenAI response as JSON");
      }
    }

    if (!parsedContent.protocol_30_days || parsedContent.protocol_30_days.length !== 30) {
      console.error("Invalid protocol length:", parsedContent.protocol_30_days?.length);
      throw new Error(`Protocol must have exactly 30 days, but got ${parsedContent.protocol_30_days?.length || 0}`);
    }

    console.log("Protocol generated successfully with", parsedContent.protocol_30_days.length, "days");

    return new Response(JSON.stringify(parsedContent), {
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