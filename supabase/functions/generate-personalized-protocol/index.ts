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
Sua tarefa é gerar um protocolo personalizado de 30 dias no formato JSON.

REGRAS IMPORTANTES:
- A saída deve ser SOMENTE JSON válido.
- Não escreva explicações ou texto fora do JSON.
- Gere o JSON seguindo exatamente esta estrutura:

{
  "overall_completion": 0,
  "day_streak": 0,
  "todays_journey": [
    {
      "id": "hydration",
      "type": "hydration",
      "title": "string",
      "description": "string",
      "completed": false
    },
    {
      "id": "exercise",
      "type": "exercise",
      "title": "string",
      "description": "string",
      "completed": false
    },
    {
      "id": "nutrition",
      "type": "nutrition",
      "title": "string",
      "description": "string",
      "completed": false
    },
    {
      "id": "sleep",
      "type": "sleep",
      "title": "string",
      "description": "string",
      "completed": false
    },
    {
      "id": "mindfulness",
      "type": "mindfulness",
      "title": "string",
      "description": "string",
      "completed": false
    }
  ],
  "protocol_30_days": [
    {
      "day": 1,
      "objectives": [
        {
          "type": "hydration",
          "title": "string",
          "description": "string",
          "completed": false
        }
      ]
    }
  ]
}

Gere um protocolo personalizado baseado nas respostas do usuário.
Cada dia deve ter 5 objetivos: hydration, exercise, nutrition, sleep, mindfulness.
Os objetivos devem progredir gradualmente ao longo dos 30 dias.
Seja específico e prático nas descrições.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Aqui estão as respostas do usuário:\n\n${JSON.stringify(userData, null, 2)}\n\nGere o protocolo personalizado agora.`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (e) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse OpenAI response as JSON");
      }
    }

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