import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { textbookContent, questionPaper } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    if (!textbookContent || !questionPaper) {
      throw new Error("Both textbook content and question paper are required");
    }

    // Use Gemini 2.5 Pro for complex reasoning
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: `You are an expert teacher creating detailed answer schemes. Based on the provided textbook content and question paper, generate comprehensive reference answers with:
- Clear, accurate answers based on the textbook material
- Marking schemes with point allocation
- Key concepts that must be mentioned
- Common mistakes to watch for
Format the output as a structured marking scheme.`
          },
          {
            role: "user",
            content: `Textbook Content:
${textbookContent}

---

Question Paper:
${questionPaper}

---

Generate a detailed answer scheme with reference answers and marking criteria for each question.`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate scheme" }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const scheme = data.choices?.[0]?.message?.content || "";

    return new Response(
      JSON.stringify({ scheme }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in generate-scheme:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
