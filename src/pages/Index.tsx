import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Brain, MessageCircle, Bell, BarChart3, Shield, Users, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Brain,
      title: "Mental Health Assessment",
      description: "AI-powered sentiment analysis to understand your emotional well-being and provide personalized insights.",
    },
    {
      icon: MessageCircle,
      title: "AI Health Chatbot",
      description: "Get instant health guidance and support through our intelligent conversational assistant.",
    },
    {
      icon: Bell,
      title: "Medication Reminders",
      description: "Never miss a dose with personalized medication and appointment reminders via WhatsApp or in-app.",
    },
    {
      icon: BarChart3,
      title: "Health Analytics",
      description: "Track your mental health journey with comprehensive data visualization and trend analysis.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your health data is encrypted and protected with industry-standard security measures.",
    },
    {
      icon: Users,
      title: "Community Focus",
      description: "Designed specifically for underserved communities to improve health awareness and access.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <Heart className="h-16 w-16 text-primary animate-pulse-gentle" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            CommunityHealth
            <span className="block text-primary">MediBot</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
            AI-Driven Health Assistant for Communities. Providing mental health support, 
            assessments, and wellness guidance for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="lg" className="gap-2">
                    <Sparkles className="h-5 w-5" />
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Comprehensive Health Support</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform provides holistic mental health support designed for communities.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SDG Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Supporting SDG 3: Good Health and Well-Being
            </h2>
            <p className="text-muted-foreground mb-8">
              CommunityHealth aligns with the United Nations Sustainable Development Goal 3, 
              working to ensure healthy lives and promote well-being for all at all ages. 
              We focus on making mental health support accessible to underserved communities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-4 py-2 rounded-full bg-health-success/10 text-health-success font-medium">
                Accessible Healthcare
              </div>
              <div className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
                Mental Health Awareness
              </div>
              <div className="px-4 py-2 rounded-full bg-health-accent/10 text-health-accent font-medium">
                Preventive Care
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
