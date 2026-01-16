import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, MessageCircle, Bell, BarChart3, User, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const quickActions = [
    {
      icon: Brain,
      title: "Mental Health Assessment",
      description: "Take a quick assessment to understand your current mental state",
      href: "/assessment",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      icon: MessageCircle,
      title: "Chat with MediBot",
      description: "Get AI-powered health guidance and support",
      href: "/chatbot",
      color: "bg-green-500/10 text-green-600",
    },
    {
      icon: Bell,
      title: "Set Reminders",
      description: "Create medication and appointment reminders",
      href: "/reminders",
      color: "bg-orange-500/10 text-orange-600",
    },
    {
      icon: BarChart3,
      title: "View Analytics",
      description: "Track your mental health journey with data insights",
      href: "/analytics",
      color: "bg-purple-500/10 text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.user_metadata?.full_name || "User"}!
            </h1>
            <p className="text-muted-foreground">
              How are you feeling today? Let's continue your wellness journey.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardHeader>
                    <div className={`p-3 rounded-lg w-fit mb-2 ${action.color}`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent health interactions and assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity yet.</p>
                <p className="text-sm">Start by taking a mental health assessment!</p>
                <Link to="/assessment">
                  <Button className="mt-4">Take Assessment</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
