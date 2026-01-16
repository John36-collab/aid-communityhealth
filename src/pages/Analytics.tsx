import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Loader2, TrendingUp, Globe, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const COLORS = ["hsl(199, 89%, 48%)", "hsl(142, 76%, 36%)", "hsl(262, 83%, 58%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)"];

const Analytics = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [globalData, setGlobalData] = useState<any[]>([]);
  const [nigeriaData, setNigeriaData] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<"personal" | "global" | "nigeria">("personal");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [assessmentsRes, globalRes, nigeriaRes] = await Promise.all([
        supabase.from("mental_health_assessments").select("*").order("created_at", { ascending: false }).limit(10),
        supabase.from("global_mental_health_data").select("*").limit(50),
        supabase.from("nigeria_states_data").select("*"),
      ]);

      setAssessments(assessmentsRes.data || []);
      setGlobalData(globalRes.data || []);
      setNigeriaData(nigeriaRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const getSentimentData = () => {
    const counts = { positive: 0, neutral: 0, negative: 0 };
    assessments.forEach((a) => {
      if (a.sentiment_label in counts) {
        counts[a.sentiment_label as keyof typeof counts]++;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getSeverityData = () => {
    const counts = { low: 0, moderate: 0, high: 0 };
    assessments.forEach((a) => {
      if (a.severity_level in counts) {
        counts[a.severity_level as keyof typeof counts]++;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
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
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
              <BarChart3 className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Health Analytics</h1>
            <p className="text-muted-foreground">
              Track your mental health journey and explore global mental health data
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center gap-2 mb-8">
            <Button
              variant={activeTab === "personal" ? "default" : "outline"}
              onClick={() => setActiveTab("personal")}
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Personal
            </Button>
            <Button
              variant={activeTab === "global" ? "default" : "outline"}
              onClick={() => setActiveTab("global")}
              className="gap-2"
            >
              <Globe className="h-4 w-4" />
              Global
            </Button>
            <Button
              variant={activeTab === "nigeria" ? "default" : "outline"}
              onClick={() => setActiveTab("nigeria")}
              className="gap-2"
            >
              <MapPin className="h-4 w-4" />
              Nigeria
            </Button>
          </div>

          {loadingData ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            </div>
          ) : (
            <>
              {activeTab === "personal" && (
                <div className="space-y-6">
                  {assessments.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">No assessment data yet.</p>
                        <p className="text-sm text-muted-foreground">Take an assessment to see your analytics!</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Sentiment Distribution</CardTitle>
                          <CardDescription>Based on your assessments</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                              <Pie
                                data={getSentimentData()}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {getSentimentData().map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Severity Levels</CardTitle>
                          <CardDescription>Assessment severity distribution</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={getSeverityData()}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" fill="hsl(199, 89%, 48%)" />
                            </BarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "global" && (
                <div className="space-y-6">
                  {globalData.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">No global data available.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>Global Mental Health Rates</CardTitle>
                        <CardDescription>Depression, anxiety, and suicide rates by country</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={globalData.slice(0, 10)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="country" angle={-45} textAnchor="end" height={100} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="depression_rate" name="Depression %" fill={COLORS[0]} />
                            <Bar dataKey="anxiety_rate" name="Anxiety %" fill={COLORS[1]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {activeTab === "nigeria" && (
                <div className="space-y-6">
                  {nigeriaData.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-muted-foreground">No Nigeria state data available.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>Nigeria States Mental Health Data</CardTitle>
                        <CardDescription>Depression, anxiety, and stress rates by state</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                          <BarChart data={nigeriaData.slice(0, 15)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="state_name" angle={-45} textAnchor="end" height={100} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="depression_rate" name="Depression %" fill={COLORS[0]} />
                            <Bar dataKey="anxiety_rate" name="Anxiety %" fill={COLORS[1]} />
                            <Bar dataKey="stress_rate" name="Stress %" fill={COLORS[2]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;
