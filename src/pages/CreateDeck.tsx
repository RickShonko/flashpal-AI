import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const CreateDeck = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your deck",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('flashcard_decks')
        .insert([
          {
            user_id: user.id,
            title: title.trim(),
            description: description.trim() || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your flashcard deck has been created",
      });

      navigate(`/deck/${data.id}`);
    } catch (error) {
      console.error('Error creating deck:', error);
      toast({
        title: "Error",
        description: "Failed to create flashcard deck. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create New Deck</h1>
              <p className="text-muted-foreground">Set up a new flashcard deck to start learning</p>
            </div>
          </div>

          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Deck Information</CardTitle>
              <CardDescription>
                Give your flashcard deck a name and description
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Deck Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Spanish Vocabulary, Biology Chapter 3"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this deck covers..."
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    {isLoading ? 'Creating...' : 'Create Deck'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateDeck;