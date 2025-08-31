import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, BookOpen, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  created_at: string;
  flashcard_count?: number;
}

const Dashboard = () => {
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchDecks();
  }, [user, navigate]);

  const fetchDecks = async () => {
    try {
      const { data, error } = await supabase
        .from('flashcard_decks')
        .select(`
          *,
          flashcards(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to include flashcard count
      const decksWithCount = data?.map(deck => ({
        ...deck,
        flashcard_count: deck.flashcards?.[0]?.count || 0
      })) || [];

      setDecks(decksWithCount);
    } catch (error) {
      console.error('Error fetching decks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your flashcard decks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = () => {
    navigate('/create-deck');
  };

  const handleDeckClick = (deckId: string) => {
    navigate(`/deck/${deckId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Flashcard Decks</h1>
            <p className="text-muted-foreground">Manage and study your flashcard collections</p>
          </div>
          <Button onClick={handleCreateDeck} className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Deck
          </Button>
        </div>

        {decks.length === 0 ? (
          <Card className="card-gradient text-center py-12">
            <CardContent className="space-y-4">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-semibold">No flashcard decks yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Create your first flashcard deck to start learning and studying effectively.
              </p>
              <Button onClick={handleCreateDeck} className="gap-2 mt-4">
                <Plus className="w-4 h-4" />
                Create Your First Deck
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {decks.map((deck) => (
              <Card 
                key={deck.id} 
                className="card-gradient cursor-pointer transition-all hover:shadow-card transform hover:-translate-y-1"
                onClick={() => handleDeckClick(deck.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{deck.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {deck.description || 'No description'}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <BookOpen className="w-3 h-3" />
                      {deck.flashcard_count}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Created {new Date(deck.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      Study Now
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;