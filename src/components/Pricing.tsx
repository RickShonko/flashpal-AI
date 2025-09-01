import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Up to 3 flashcard decks",
      "Up to 50 cards per deck",
      "Basic study modes",
      "Progress tracking"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "per month",
    description: "For serious learners",
    features: [
      "Unlimited flashcard decks",
      "Unlimited cards",
      "Advanced study modes",
      "Spaced repetition algorithm",
      "Progress analytics",
      "Import/Export features",
      "Priority support"
    ],
    cta: "Upgrade to Pro",
    popular: true
  },
  {
    name: "Team",
    price: "$19.99",
    period: "per month",
    description: "For educators and teams",
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Shared deck libraries",
      "Student progress tracking",
      "Bulk import tools",
      "Admin dashboard",
      "Priority support"
    ],
    cta: "Start Team Plan",
    popular: false
  }
];

export const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlanSelect = (planName: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (planName === "Free") {
      navigate("/dashboard");
    } else {
      // For now, redirect to dashboard - later this could integrate with Stripe
      navigate("/dashboard");
    }
  };

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Choose Your Learning Plan
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free and upgrade as you grow. All plans include our core flashcard features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative ${plan.popular ? 'border-primary shadow-xl scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handlePlanSelect(plan.name)}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            All plans include a 14-day free trial. No credit card required for the free plan.
          </p>
        </div>
      </div>
    </section>
  );
};