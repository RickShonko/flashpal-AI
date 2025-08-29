import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FlashCardProps {
  question: string;
  answer: string;
  className?: string;
}

export const FlashCard = ({ question, answer, className }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={cn("flashcard", isFlipped && "flipped", className)}
      onClick={handleFlip}
    >
      <div className="flashcard-inner">
        {/* Front of card - Question */}
        <Card className="flashcard-front hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Question
            </div>
            <div className="text-lg font-semibold text-center leading-relaxed">
              {question}
            </div>
            <div className="text-xs text-muted-foreground">
              Click to reveal answer
            </div>
          </div>
        </Card>

        {/* Back of card - Answer */}
        <Card className="flashcard-back hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Answer
            </div>
            <div className="text-lg font-semibold text-center leading-relaxed">
              {answer}
            </div>
            <div className="text-xs text-muted-foreground">
              Click to see question
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};