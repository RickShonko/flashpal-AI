import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Smartphone, Users, Target, Shield } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Competency-Based Learning",
    description: "Each deck and flashcard is mapped to real TVET learning outcomes so students can learn the exact skills needed in their course and trade."
  },
  {
    icon: Zap,
    title: "AI Study Support",
    description: "Turn notes, class material, and practical examples into revision flashcards that help students study faster and remember more."
  },
  {
    icon: Smartphone,
    title: "Tutorial & Resource Access",
    description: "Students can revisit key ideas, practical tutorials, and structured learning materials as they prepare for tasks and assessments."
  },
  {
    icon: Users,
    title: "Teacher & Student Collaboration",
    description: "Lecturers and trainers can assign learning decks, guide students, and monitor progress in a way that supports TVET delivery."
  },
  {
    icon: Target,
    title: "Career Path Awareness",
    description: "Learners can connect what they study to job roles, industry skills, and career pathways in their chosen field."
  },
  {
    icon: Shield,
    title: "Progress Tracking",
    description: "Follow competency growth, identify weak areas, and build confidence before practical assessments, cert exams, and workplace tasks."
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Built for TVET students, trainers, and industry-ready learning{" "}
            <span className="hero-gradient bg-clip-text text-transparent">
              in one place
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            FlashPal supports practical, outcome-based learning by making every topic easier to understand, revise, and connect to real-world careers.
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