import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Sparkles, Play, BookOpen } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Course Content",
    description: "Students and trainers upload notes, practical tasks, and lessons linked to real TVET modules and industry skills."
  },
  {
    icon: Sparkles,
    step: "02", 
    title: "Map to Competencies",
    description: "FlashPal turns your material into targeted revision cards aligned with competency outcomes, practical tasks, and learning goals."
  },
  {
    icon: Play,
    step: "03",
    title: "Study and Practice",
    description: "Learners review flashcards, reinforce concepts, and build confidence through repetition and guided study."
  },
  {
    icon: BookOpen,
    step: "04",
    title: "Prepare for Work",
    description: "Students connect learning to career roles, tutorials, and industry expectations so they are ready for assessments and employment."
  }
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            How FlashPal Supports TVET Learning
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            In four steps, students move from course content to competency mastery, stronger confidence, and clearer career direction.
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