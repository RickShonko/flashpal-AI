import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Play, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FlashCard } from '@/components/FlashCard';
import { useAuth } from '@/hooks/useAuth.ts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

interface Deck {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  created_at: string;
}

const DeckView = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (deckId) {
      fetchDeckAndCards();
    }
  }, [user, deckId, navigate]);

  const fetchDeckAndCards = async () => {
    try {
      // Fetch deck details
      const { data: deckData, error: deckError } = await supabase
        .from('flashcard_decks')
        .select('*')
        .eq('id', deckId)
        .single();

      if (deckError) throw deckError;
      setDeck(deckData);

      // Fetch flashcards
      const { data: cardsData, error: cardsError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('deck_id', deckId)
        .order('created_at', { ascending: true });

      if (cardsError) throw cardsError;
      setFlashcards(cardsData || []);
    } catch (error) {
      console.error('Error fetching deck:', error);
      toast({
        title: "Error",
        description: "Failed to fetch deck details",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = () => {
    navigate(`/deck/${deckId}/add-card`);
  };

  const handleStudy = () => {
    if (flashcards.length === 0) {
      toast({
        title: "No cards to study",
        description: "Add some flashcards to start studying",
        variant: "destructive",
      });
      return;
    }
    navigate(`/deck/${deckId}/study`);
  };

  const handleEditCard = (cardId: string) => {
    navigate(`/deck/${deckId}/edit-card/${cardId}`);
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', cardId);

      if (error) throw error;

      setFlashcards(prev => prev.filter(card => card.id !== cardId));
      toast({
        title: "Card deleted",
        description: "Flashcard has been removed from the deck",
      });
    } catch (error) {
      console.error('Error deleting card:', error);
      toast({
        title: "Error",
        description: "Failed to delete flashcard",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="card-gradient text-center">
          <CardContent className="py-8">
            <h2 className="text-xl font-semibold mb-2">Deck not found</h2>
            <p className="text-muted-foreground mb-4">The requested deck could not be found.</p>
            <Button onClick={handleBack}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{deck.title}</h1>
              <p className="text-muted-foreground">{deck.description || 'No description'}</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {flashcards.length} cards
            </Badge>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleStudy} className="gap-2">
              <Play className="w-4 h-4" />
              Start Studying
            </Button>
            <Button onClick={handleAddCard} variant="outline" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Card
            </Button>
          </div>

          {flashcards.length === 0 ? (
            <Card className="card-gradient text-center py-12">
              <CardContent className="space-y-4">
                <div className="text-6xl">📚</div>
                <h3 className="text-xl font-semibold">No flashcards yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Add your first flashcard to start building this deck.
                </p>
                <Button onClick={handleAddCard} className="gap-2 mt-4">
                  <Plus className="w-4 h-4" />
                  Add Your First Card
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {flashcards.map((card) => (
                <Card key={card.id} className="card-gradient relative group">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Flashcard
                      </CardTitle>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => handleEditCard(card.id)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteCard(card.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <FlashCard front={card.front} back={card.back} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeckView;