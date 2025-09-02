
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const CreateDeck = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatingCards, setGeneratingCards] = useState(false);
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

  const handleGenerateFromNotes = async (e: React.FormEvent) => {
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

    if (!notes.trim()) {
      toast({
        title: "Error",
        description: "Please enter your notes to generate flashcards",
        variant: "destructive",
      });
      return;
    }

    setGeneratingCards(true);

    try {
      // First create the deck
      const { data: deckData, error: deckError } = await supabase
        .from('flashcard_decks')
        .insert([
          {
            user_id: user.id,
            title: title.trim(),
            description: description.trim() || "Generated from notes",
          },
        ])
        .select()
        .single();

      if (deckError) throw deckError;

      // Then generate flashcards using AI
      const { data: aiData, error: aiError } = await supabase.functions.invoke('generate-flashcards', {
        body: { 
          notes: notes.trim(),
          deckId: deckData.id 
        }
      });

      if (aiError) throw aiError;

      toast({
        title: "Success!",
        description: `Generated ${aiData.count} flashcards from your notes!`,
      });

      navigate(`/deck/${deckData.id}`);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast({
        title: "Error",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingCards(false);
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

          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual" className="gap-2">
                <FileText className="w-4 h-4" />
                Manual Creation
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2">
                <Sparkles className="w-4 h-4" />
                AI Generation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Create Empty Deck</CardTitle>
                  <CardDescription>
                    Create a deck and add flashcards manually
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
            </TabsContent>

            <TabsContent value="ai">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    AI-Powered Generation
                  </CardTitle>
                  <CardDescription>
                    Paste your notes and let AI create flashcards for you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGenerateFromNotes} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="ai-title">Deck Title *</Label>
                      <Input
                        id="ai-title"
                        placeholder="e.g., History Notes Chapter 5"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ai-description">Description (optional)</Label>
                      <Textarea
                        id="ai-description"
                        placeholder="Brief description of the content..."
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Your Notes *</Label>
                      <Textarea
                        id="notes"
                        placeholder="Paste your notes here... The AI will analyze them and create flashcards with questions and answers."
                        rows={8}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        AI will generate approximately 10 flashcards from your notes
                      </p>
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
                        disabled={generatingCards}
                        className="flex-1 gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        {generatingCards ? 'Generating...' : 'Generate Flashcards'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CreateDeck;
