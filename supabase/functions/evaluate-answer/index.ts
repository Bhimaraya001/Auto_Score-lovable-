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
    const { referenceAnswer, studentAnswer, maxMarks } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    if (!referenceAnswer || !studentAnswer) {
      throw new Error("Both reference and student answers are required");
    }

    // Use Gemini 2.5 Flash for fast evaluation
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert examiner. Evaluate student answers by comparing them to reference answers. Provide:
1. A similarity score (0.0 to 1.0) - 0 means completely wrong/off-topic, 1 means perfect match
2. Detailed feedback on what was correct, what was missing, and suggestions for improvement
3. Allocated marks out of the maximum marks provided

Be fair but strict. Award marks based on correctness, completeness, and understanding of key concepts.`
          },
          {
            role: "user",
            content: `Maximum Marks: ${maxMarks || 10}

Reference Answer:
${referenceAnswer}

Student Answer:
${studentAnswer}

Provide your evaluation in this exact JSON format:
{
  "score": <number between 0 and 1>,
  "marks": <number between 0 and maxMarks>,
  "feedback": "<detailed feedback string>",
  "strengths": "<what the student did well>",
  "improvements": "<what could be improved>"
}`
          }
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to evaluate answer" }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Try to parse the JSON response
    let evaluation;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || content.match(/(\{[\s\S]*\})/);
      const jsonStr = jsonMatch ? jsonMatch[1] : content;
      evaluation = JSON.parse(jsonStr);
    } catch (e) {
      // Fallback if JSON parsing fails
      evaluation = {
        score: 0.5,
        marks: (maxMarks || 10) * 0.5,
        feedback: content,
        strengths: "Unable to parse structured feedback",
        improvements: "Please review the answer manually"
      };
    }

    return new Response(
      JSON.stringify(evaluation),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in evaluate-answer:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
