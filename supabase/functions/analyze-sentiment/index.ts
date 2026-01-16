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
    const { content } = await req.json();
    
    if (!content || typeof content !== "string") {
      return new Response(
        JSON.stringify({ error: "Content is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a mental health assessment AI. Analyze the user's text for emotional sentiment and mental health indicators.

Your task is to return a JSON analysis with these fields:
- sentiment_label: "positive", "neutral", or "negative"
- sentiment_score: a number from 0 to 1 (0 = very negative, 0.5 = neutral, 1 = very positive)
- severity_level: "low", "moderate", or "high" (indicating level of concern)
- summary: a brief, compassionate 1-2 sentence summary of the emotional state
- recommendations: an array of 2-3 supportive suggestions

Be compassionate and supportive in your analysis. Focus on understanding the person's emotional state and providing helpful guidance.`
          },
          {
            role: "user",
            content: `Please analyze this text for mental health sentiment:\n\n"${content}"`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_sentiment",
              description: "Analyze mental health sentiment from user text",
              parameters: {
                type: "object",
                properties: {
                  sentiment_label: {
                    type: "string",
                    enum: ["positive", "neutral", "negative"],
                    description: "The overall emotional sentiment"
                  },
                  sentiment_score: {
                    type: "number",
                    description: "Score from 0 (very negative) to 1 (very positive)"
                  },
                  severity_level: {
                    type: "string",
                    enum: ["low", "moderate", "high"],
                    description: "Level of mental health concern"
                  },
                  summary: {
                    type: "string",
                    description: "Brief compassionate summary of emotional state"
                  },
                  recommendations: {
                    type: "array",
                    items: { type: "string" },
                    description: "2-3 supportive suggestions"
                  }
                },
                required: ["sentiment_label", "sentiment_score", "severity_level", "summary", "recommendations"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_sentiment" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall?.function?.arguments) {
      throw new Error("Invalid AI response format");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Analysis failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
