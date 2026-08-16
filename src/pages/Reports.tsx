import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface FlashcardDeck {
  id: string;
  title: string;
}

interface Flashcard {
  id: string;
  competencies?: string[];
}

interface StudySession {
  id: string;
  flashcard_id: string;
  difficulty: number;
  review_count: number;
}

const Reports = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!user) return navigate('/auth');
    fetchDecks();
  }, [user, navigate]);

  const fetchDecks = async () => {
    try {
      const { data, error } = await supabase
        .from('flashcard_decks')
        .select('id, title')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDecks(data || []);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to load decks', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    if (!selectedDeck) return toast({ title: 'Select deck', description: 'Please choose a deck', variant: 'destructive' });

    try {
      // Fetch flashcards for deck with competencies
      const { data: flashcards } = await supabase
        .from('flashcards')
        .select('id, competencies')
        .eq('deck_id', selectedDeck);

      const cardIds = (flashcards || []).map((f: Flashcard) => f.id);

      if (cardIds.length === 0) {
        setReport({});
        return toast({ title: 'No cards', description: 'This deck has no flashcards', variant: 'destructive' });
      }

      // Fetch study sessions for these cards
      const { data: sessions } = await supabase
        .from('study_sessions')
        .select('id, flashcard_id, difficulty, review_count')
        .in('flashcard_id', cardIds);

      // Build competency map
      const compMap: Record<string, { sessions: number; totalDifficulty: number; totalReviews: number; cards: Set<string> }> = {};

      (sessions || []).forEach((s: StudySession) => {
        const card = (flashcards || []).find((f: Flashcard) => f.id === s.flashcard_id);
        const comps = (card && card.competencies) || ['(unmapped)'];
        comps.forEach((c: string) => {
          if (!compMap[c]) compMap[c] = { sessions: 0, totalDifficulty: 0, totalReviews: 0, cards: new Set() };
          compMap[c].sessions += 1;
          compMap[c].totalDifficulty += s.difficulty;
          compMap[c].totalReviews += s.review_count || 0;
          compMap[c].cards.add(s.flashcard_id);
        });
      });

      // Convert to summary
      const summary = Object.entries(compMap).map(([comp, v]) => ({
        competency: comp,
        sessions: v.sessions,
        avgDifficulty: v.sessions ? +(v.totalDifficulty / v.sessions).toFixed(2) : 0,
        totalReviews: v.totalReviews,
        assessedCards: v.cards.size,
      }));

      setReport({ summary, generatedAt: new Date().toISOString() });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to generate report', variant: 'destructive' });
    }
  };

  const exportCSV = () => {
    if (!report.summary) return toast({ title: 'No data', description: 'Generate a report first', variant: 'destructive' });
    const rows = report.summary;
    const header = ['Competency','Sessions','Avg Difficulty','Total Reviews','Assessed Cards'];
    const csv = [header.join(',')].concat(rows.map((r: any) => [r.competency, r.sessions, r.avgDifficulty, r.totalReviews, r.assessedCards].join(','))).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `competency_report_${selectedDeck || 'deck'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Competency Report</h1>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>Back</Button>
          </div>

          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Generate competency-level performance</CardTitle>
              <CardDescription>Select a deck to aggregate study session performance by competency.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <select
                  className="flex-1 rounded border p-2"
                  value={selectedDeck}
                  onChange={(e) => setSelectedDeck(e.target.value)}
                >
                  <option value="">Select deck...</option>
                  {decks.map((d) => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
                </select>

                <Button onClick={generateReport}>Generate</Button>
                <Button variant="outline" onClick={exportCSV}>Export CSV</Button>
              </div>

              {report.summary && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <div className="grid gap-2">
                    {report.summary.map((r: any) => (
                      <div key={r.competency} className="p-3 bg-muted rounded">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">{r.competency}</div>
                            <div className="text-sm text-muted-foreground">Assessed Cards: {r.assessedCards}</div>
                          </div>
                          <div className="text-right">
                            <div>Sessions: {r.sessions}</div>
                            <div>Avg difficulty: {r.avgDifficulty}</div>
                            <div>Total reviews: {r.totalReviews}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
