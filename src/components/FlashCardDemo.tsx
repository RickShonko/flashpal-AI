import { FlashCard } from "@/components/FlashCard";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth.ts";

const sampleCards = [
  {
    front: "What is the process by which plants convert sunlight into energy?",
    back: "Photosynthesis - the process where plants use chlorophyll to convert sunlight, carbon dioxide, and water into glucose and oxygen."
  },
  {
    front: "What is the capital of France?",
    back: "Paris is the capital and largest city of France, located in the north-central part of the country on the Seine River."
  },
  {
    front: "What is the formula for calculating the area of a circle?",
    back: "A = πr² where A is the area, π (pi) is approximately 3.14159, and r is the radius of the circle."
  }
];

export const FlashCardDemo = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % sampleCards.length);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + sampleCards.length) % sampleCards.length);
  };

  const handleCreateCards = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleGenerateFromNotes = () => {
    if (user) {
      navigate('/create-deck');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section id="demo" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Try Our Interactive Flashcards
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience how FlashPal transforms your study materials into engaging, interactive learning tools.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-8">
          {/* Flashcard Container */}
          <div className="relative">
            <FlashCard
              front={sampleCards[currentCardIndex].front}
              back={sampleCards[currentCardIndex].back}
              className="pulse-glow"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button variant="outline" onClick={prevCard}>
              Previous
            </Button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {currentCardIndex + 1} of {sampleCards.length}
              </span>
            </div>
            
            <Button variant="outline" onClick={nextCard}>
              Next
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" className="group" onClick={handleCreateCards}>
              <Plus className="h-5 w-5 mr-2" />
              Create Your Own Cards
            </Button>
            <Button variant="outline" size="lg" onClick={handleGenerateFromNotes}>
              <RefreshCw className="h-5 w-5 mr-2" />
              Generate from Notes
            </Button>
          </div>

          {/* Info */}
          <div className="text-center text-sm text-muted-foreground">
            Click any flashcard to flip it and reveal the answer
          </div>
        </div>
      </div>
    </section>
  );
};