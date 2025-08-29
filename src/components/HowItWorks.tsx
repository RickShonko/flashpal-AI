import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Sparkles, Play, BookOpen } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Notes",
    description: "Simply paste your study materials, lecture notes, or textbook content into FlashPal's smart editor."
  },
  {
    icon: Sparkles,
    step: "02", 
    title: "AI Generates Cards",
    description: "Our advanced AI analyzes your content and creates 5 targeted flashcards with questions and detailed answers."
  },
  {
    icon: Play,
    step: "03",
    title: "Start Studying",
    description: "Review your flashcards with interactive flip animations. Track your progress as you learn."
  },
  {
    icon: BookOpen,
    step: "04",
    title: "Master the Material",
    description: "Save your sets, share with friends, and revisit challenging topics. Perfect your knowledge retention."
  }
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            How FlashPal Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your study routine in four simple steps. From notes to mastery in minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              <Card className="card-gradient border-0 shadow-lg h-full animate-fade-in-up"
                    style={{ animationDelay: `${index * 150}ms` }}>
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full hero-gradient mb-4">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-sm font-bold text-primary/60 tracking-wide">
                    STEP {step.step}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
              
              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-accent"></div>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-accent border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};