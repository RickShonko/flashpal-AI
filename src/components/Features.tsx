import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Smartphone, Users, Target, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Generation",
    description: "Transform any study material into interactive flashcards using advanced AI that understands context and creates meaningful questions."
  },
  {
    icon: Zap,
    title: "Instant Creation",
    description: "Paste your notes and get 5 customized flashcards in seconds. No manual work required - just intelligent automation."
  },
  {
    icon: Smartphone,
    title: "Cross-Platform",
    description: "Study anywhere with our responsive web app and mobile version. Seamless sync across all your devices."
  },
  {
    icon: Users,
    title: "Collaborative Learning",
    description: "Share flashcard sets with classmates and study groups. Learn together and boost retention through social learning."
  },
  {
    icon: Target,
    title: "Smart Analytics",
    description: "Track your progress, identify weak areas, and optimize your study sessions with detailed performance insights."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your study materials are encrypted and secure. We respect your privacy and never share your content."
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Everything You Need to{" "}
            <span className="hero-gradient bg-clip-text text-transparent">
              Ace Your Studies
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            FlashPal combines the power of AI with proven learning techniques to help you study more effectively.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="card-gradient border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg hero-gradient">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};