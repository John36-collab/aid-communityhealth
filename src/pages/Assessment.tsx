import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Brain, Loader2, AlertCircle, CheckCircle, Info } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

const Assessment = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    sentiment_label: string;
    sentiment_score: number;
    severity_level: string;
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const analyzeSentiment = (text: string) => {
    // Simple rule-based sentiment analysis
    const positiveWords = ['happy', 'great', 'good', 'wonderful', 'excellent', 'amazing', 'love', 'joy', 'peaceful', 'calm', 'relaxed', 'grateful', 'hopeful', 'excited', 'content'];
    const negativeWords = ['sad', 'depressed', 'anxious', 'worried', 'stressed', 'angry', 'frustrated', 'hopeless', 'lonely', 'tired', 'exhausted', 'overwhelmed', 'scared', 'panic', 'fear'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
      if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
    });
    
    const total = positiveCount + negativeCount || 1;
    const score = (positiveCount - negativeCount) / total;
    const normalizedScore = (score + 1) / 2;
    
    let label: string;
    let severity: string;
    
    if (normalizedScore >= 0.6) {
      label = 'positive';
      severity = 'low';
    } else if (normalizedScore >= 0.4) {
      label = 'neutral';
      severity = 'moderate';
    } else {
      label = 'negative';
      severity = normalizedScore < 0.2 ? 'high' : 'moderate';
    }
    
    return { sentiment_score: normalizedScore, sentiment_label: label, severity_level: severity };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setAnalyzing(true);
    try {
      const analysis = analyzeSentiment(content);
      
      const { error } = await supabase.from("mental_health_assessments").insert({
        user_id: user.id,
        content: content,
        assessment_type: "text_analysis",
        sentiment_score: analysis.sentiment_score,
        sentiment_label: analysis.sentiment_label,
        severity_level: analysis.severity_level,
      });

      if (error) throw error;

      setResult(analysis);
      toast.success("Assessment completed successfully!");
    } catch (error) {
      console.error("Error saving assessment:", error);
      toast.error("Failed to save assessment");
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
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
              <CardDescription>
                Describe your thoughts, emotions, and current state of mind. Be as detailed as you like.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Your thoughts</Label>
                  <Textarea
                    id="content"
                    placeholder="I've been feeling..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[150px]"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={analyzing || !content.trim()}>
                  {analyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {analyzing ? "Analyzing..." : "Analyze My Response"}
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
                    <CardTitle>Assessment Result</CardTitle>
                    <CardDescription className="text-inherit opacity-80">
                      Based on your response
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium opacity-70">Sentiment</p>
                    <p className="text-lg font-semibold capitalize">{result.sentiment_label}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-70">Confidence</p>
                    <p className="text-lg font-semibold">{Math.round(result.sentiment_score * 100)}%</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium opacity-70">Severity Level</p>
                  <p className="text-lg font-semibold capitalize">{result.severity_level}</p>
                </div>
                {result.severity_level === "high" && (
                  <div className="p-4 bg-white/50 rounded-lg">
                    <p className="font-medium">We're here for you 💙</p>
                    <p className="text-sm mt-2">
                      If you're struggling, please consider reaching out to a mental health professional 
                      or calling a helpline. You're not alone.
                    </p>
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
