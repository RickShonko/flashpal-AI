import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { FlashCard } from '@/components/FlashCard';

const AddCard = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!front.trim() || !back.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both front and back of the card",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('flashcards')
        .insert([
          {
            deck_id: deckId,
            front: front.trim(),
            back: back.trim(),
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Flashcard has been added to your deck",
      });

      navigate(`/deck/${deckId}`);
    } catch (error) {
      console.error('Error creating flashcard:', error);
      toast({
        title: "Error",
        description: "Failed to create flashcard. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/deck/${deckId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Add New Flashcard</h1>
              <p className="text-muted-foreground">Create a new card for your deck</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle>Card Content</CardTitle>
                <CardDescription>
                  Enter the question/prompt and answer for your flashcard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="front">Front (Question/Prompt) *</Label>
                    <Textarea
                      id="front"
                      placeholder="What goes on the front of the card?"
                      rows={4}
                      value={front}
                      onChange={(e) => setFront(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="back">Back (Answer) *</Label>
                    <Textarea
                      id="back"
                      placeholder="What goes on the back of the card?"
                      rows={4}
                      value={back}
                      onChange={(e) => setBack(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {isLoading ? 'Adding...' : 'Add Card'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="card-gradient">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  See how your flashcard will look
                </CardDescription>
              </CardHeader>
              <CardContent>
                {front && back ? (
                  <FlashCard front={front} back={back} />
                ) : (
                  <div className="flex items-center justify-center h-48 border-2 border-dashed border-muted rounded-lg">
                    <p className="text-muted-foreground text-center">
                      Fill in both sides to see preview
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCard;