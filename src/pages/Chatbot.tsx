import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Loader2, Bot, User } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const healthResponses: Record<string, string> = {
  stress: "I understand you're feeling stressed. Here are some tips:\n\n1. Take deep breaths - try 4-7-8 breathing\n2. Go for a short walk\n3. Practice mindfulness meditation\n4. Talk to someone you trust\n5. Limit caffeine and get enough sleep\n\nWould you like to discuss specific stress management techniques?",
  anxiety: "Anxiety can be challenging. Here's what might help:\n\n1. Grounding techniques - 5-4-3-2-1 method\n2. Regular exercise\n3. Limit news/social media consumption\n4. Maintain a routine\n5. Consider speaking with a professional\n\nRemember, it's okay to ask for help.",
  depression: "I'm sorry you're feeling this way. Depression is serious, and you deserve support.\n\n1. Reach out to a mental health professional\n2. Stay connected with loved ones\n3. Maintain basic self-care\n4. Small daily activities can help\n5. Crisis helplines are available 24/7\n\nYou're not alone in this.",
  sleep: "Good sleep is crucial for mental health. Try:\n\n1. Consistent sleep schedule\n2. No screens 1 hour before bed\n3. Keep your room cool and dark\n4. Avoid caffeine after 2 PM\n5. Relaxation techniques before bed\n\nWould you like more specific advice?",
  default: "Thank you for sharing. I'm here to help you with mental health guidance and support. I can help with:\n\n• Stress management\n• Anxiety coping strategies\n• Sleep improvement\n• General wellness tips\n• Medication reminders setup\n\nWhat would you like to know more about?",
};

const Chatbot = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Initial greeting
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Hello${user?.user_metadata?.full_name ? ` ${user.user_metadata.full_name}` : ""}! 👋\n\nI'm MediBot, your AI health assistant. I'm here to provide mental health guidance, wellness tips, and support.\n\nHow can I help you today?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    if (lower.includes("stress") || lower.includes("overwhelmed") || lower.includes("pressure")) {
      return healthResponses.stress;
    }
    if (lower.includes("anxious") || lower.includes("anxiety") || lower.includes("worried") || lower.includes("panic")) {
      return healthResponses.anxiety;
    }
    if (lower.includes("depress") || lower.includes("sad") || lower.includes("hopeless") || lower.includes("lonely")) {
      return healthResponses.depression;
    }
    if (lower.includes("sleep") || lower.includes("insomnia") || lower.includes("tired") || lower.includes("rest")) {
      return healthResponses.sleep;
    }
    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      return "Hello! How are you feeling today? I'm here to support you with any mental health concerns or questions.";
    }
    if (lower.includes("thank")) {
      return "You're welcome! Remember, taking care of your mental health is important. Is there anything else I can help you with?";
    }
    return healthResponses.default;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const response = getResponse(input);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
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
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-6">
            <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
              <MessageCircle className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">MediBot Chat</h1>
            <p className="text-muted-foreground">
              Your AI health assistant for mental wellness support
            </p>
          </div>

          <Card className="h-[500px] flex flex-col">
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      message.role === "user" ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="h-5 w-5 text-primary-foreground" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] p-4 rounded-2xl ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted rounded-bl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="p-2 rounded-full bg-muted">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="bg-muted p-4 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce delay-100" />
                      <span className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            <div className="p-4 border-t">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!input.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Chatbot;
