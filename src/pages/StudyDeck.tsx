import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FlashCard } from '@/components/FlashCard';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Deck {
  id: string;
  title: string;
  description: string | null;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  competencies?: string[];
}

const reviewOptions = [
  { label: 'Hard', difficulty: 5, daysUntilReview: 1 },
  { label: 'Good', difficulty: 3, daysUntilReview: 3 },
  { label: 'Easy', difficulty: 1, daysUntilReview: 7 },
];

const StudyDeck = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (deckId) {
      fetchStudyDeck();
    }
  }, [user, deckId, navigate]);

  const fetchStudyDeck = async () => {
    try {
      const { data: deckData, error: deckError } = await supabase
        .from('flashcard_decks')
        .select('id, title, description')
        .eq('id', deckId)
        .single();

      if (deckError) throw deckError;

      const { data: cardData, error: cardError } = await supabase
        .from('flashcards')
        .select('id, front, back, competencies')
        .eq('deck_id', deckId)
        .order('created_at', { ascending: true });

      if (cardError) throw cardError;

      setDeck(deckData);
      setCards(cardData || []);
    } catch (error) {
      console.error('Error loading study deck:', error);
      toast({
        title: 'Error',
        description: 'Failed to load this study deck',
        variant: 'destructive',
      });
      navigate(`/deck/${deckId}`);
    } finally {
      setLoading(false);
    }
  };

  const currentCard = cards[currentIndex];
  const progress = useMemo(() => {
    if (cards.length === 0) return 0;
    return Math.round((reviewedCount / cards.length) * 100);
  }, [cards.length, reviewedCount]);

  const recordReview = async (difficulty: number, daysUntilReview: number) => {
    if (!user || !currentCard) return;

    setSaving(true);

    try {
      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + daysUntilReview);

      const { error } = await supabase.from('study_sessions').insert({
        user_id: user.id,
        flashcard_id: currentCard.id,
        difficulty,
        review_count: 1,
        next_review_date: nextReviewDate.toISOString(),
      });

      if (error) throw error;

      setReviewedCount((count) => count + 1);
      setCurrentIndex((index) => index + 1);
    } catch (error) {
      console.error('Error recording review:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your review',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const restartSession = () => {
    setCurrentIndex(0);
    setReviewedCount(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="h-80 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!deck || cards.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="card-gradient mx-auto max-w-xl text-center">
            <CardContent className="space-y-4 py-10">
              <h1 className="text-2xl font-bold">Nothing to study yet</h1>
              <p className="text-muted-foreground">Add flashcards to this deck before starting a study session.</p>
              <Button onClick={() => navigate(`/deck/${deckId}`)}>Back to Deck</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="card-gradient mx-auto max-w-2xl text-center">
            <CardContent className="space-y-6 py-12">
              <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Study session complete</h1>
                <p className="text-muted-foreground">
                  You reviewed {reviewedCount} {reviewedCount === 1 ? 'card' : 'cards'} from {deck.title}.
                </p>
              </div>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => navigate(`/deck/${deckId}`)}>
                  Back to Deck
                </Button>
                <Button onClick={restartSession} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Study Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/deck/${deckId}`)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-3xl font-bold">{deck.title}</h1>
              <p className="text-muted-foreground">
                Card {currentIndex + 1} of {cards.length}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Progress value={progress} />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{progress}% complete</span>
              <span>{reviewedCount} reviewed</span>
            </div>
          </div>

          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Review This Card</CardTitle>
              <CardDescription>Flip the card, then choose how difficult it felt.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FlashCard key={currentCard.id} front={currentCard.front} back={currentCard.back} />

              {currentCard.competencies && currentCard.competencies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {currentCard.competencies.map((competency) => (
                    <Badge key={competency} variant="secondary">
                      {competency}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-3">
                {reviewOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant={option.label === 'Good' ? 'default' : 'outline'}
                    disabled={saving}
                    onClick={() => recordReview(option.difficulty, option.daysUntilReview)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudyDeck;
