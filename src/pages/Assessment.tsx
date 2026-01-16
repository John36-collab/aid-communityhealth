import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Brain, Loader2, AlertCircle, CheckCircle, Info, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

interface AnalysisResult {
  sentiment_label: string;
  sentiment_score: number;
  severity_level: string;
  summary?: string;
  recommendations?: string[];
}

const Assessment = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setAnalyzing(true);
    setResult(null);

    try {
      // Call the AI-powered sentiment analysis edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-sentiment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          toast.error("Rate limit exceeded. Please wait a moment and try again.");
          return;
        }
        if (response.status === 402) {
          toast.error("AI credits exhausted. Please add credits to continue.");
          return;
        }
        throw new Error(errorData.error || "Analysis failed");
      }

      const analysis = await response.json();

      // Save to database
      const { error: dbError } = await supabase.from("mental_health_assessments").insert({
        user_id: user.id,
        content: content,
        assessment_type: "ai_analysis",
        sentiment_score: analysis.sentiment_score,
        sentiment_label: analysis.sentiment_label,
        severity_level: analysis.severity_level,
      });

      if (dbError) {
        console.error("Database error:", dbError);
        // Still show results even if save fails
      }

      setResult(analysis);
      toast.success("Assessment completed with AI analysis!");
    } catch (error) {
      console.error("Error analyzing:", error);
      toast.error(error instanceof Error ? error.message : "Failed to analyze. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "low":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "moderate":
        return <Info className="h-6 w-6 text-yellow-500" />;
      case "high":
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-green-100 border-green-200 text-green-800";
      case "moderate":
        return "bg-yellow-100 border-yellow-200 text-yellow-800";
      case "high":
        return "bg-red-100 border-red-200 text-red-800";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
              <Brain className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Mental Health Assessment</h1>
            <p className="text-muted-foreground">
              Share how you're feeling, and our AI will analyze your emotional well-being.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              <span>Powered by Lovable AI</span>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
              <CardDescription>
                Describe your thoughts, emotions, and current state of mind. Our AI will provide 
                personalized insights and supportive recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Your thoughts</Label>
                  <Textarea
                    id="content"
                    placeholder="I've been feeling... (Share as much or as little as you're comfortable with)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[150px]"
                    required
                  />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={analyzing || !content.trim()}>
                  {analyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Analyze My Response
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {result && (
            <Card className={`border-2 ${getSeverityColor(result.severity_level)}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {getSeverityIcon(result.severity_level)}
                  <div>
                    <CardTitle>AI Assessment Result</CardTitle>
                    <CardDescription className="text-inherit opacity-80">
                      Personalized analysis of your emotional state
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Summary */}
                {result.summary && (
                  <div className="p-4 bg-white/50 rounded-lg">
                    <p className="font-medium mb-1">Summary</p>
                    <p className="text-sm">{result.summary}</p>
                  </div>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white/30 rounded-lg">
                    <p className="text-xs font-medium opacity-70 mb-1">Sentiment</p>
                    <p className="text-lg font-semibold capitalize">{result.sentiment_label}</p>
                  </div>
                  <div className="text-center p-3 bg-white/30 rounded-lg">
                    <p className="text-xs font-medium opacity-70 mb-1">Score</p>
                    <p className="text-lg font-semibold">{Math.round(result.sentiment_score * 100)}%</p>
                  </div>
                  <div className="text-center p-3 bg-white/30 rounded-lg">
                    <p className="text-xs font-medium opacity-70 mb-1">Concern Level</p>
                    <p className="text-lg font-semibold capitalize">{result.severity_level}</p>
                  </div>
                </div>

                {/* Recommendations */}
                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="p-4 bg-white/50 rounded-lg">
                    <p className="font-medium mb-2">💡 Recommendations</p>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* High severity warning */}
                {result.severity_level === "high" && (
                  <div className="p-4 bg-white/70 rounded-lg border border-red-300">
                    <p className="font-medium">We're here for you 💙</p>
                    <p className="text-sm mt-2">
                      If you're struggling, please consider reaching out to a mental health professional 
                      or calling a helpline. You're not alone, and support is available.
                    </p>
                    <div className="mt-3 text-xs opacity-75">
                      <p>🇳🇬 Nigeria Mental Health Helpline: 0800-000-0000</p>
                      <p>🌍 International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Assessment;
