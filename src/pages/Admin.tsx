import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const Admin = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [students, setStudents] = useState<any[]>([]);
  const [decks, setDecks] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedDeck, setSelectedDeck] = useState('');
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return navigate('/auth');
    if (profile?.role !== 'teacher' && profile?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user, profile, navigate]);

  const fetchData = async () => {
    try {
      const { data: studentsData } = await supabase.from('profiles').select('id, display_name, username').eq('role', 'student');
      const { data: decksData } = await supabase.from('flashcard_decks').select('id, title');
      const { data: assignmentsData } = await supabase.from('assignments').select('id, deck_id, student_id, created_at');
      setStudents(studentsData || []);
      setDecks(decksData || []);
      setAssignments(assignmentsData || []);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to load admin data', variant: 'destructive' });
    }
  };

  const handleAssign = async () => {
    if (!selectedStudent || !selectedDeck) return toast({ title: 'Select', description: 'Choose student and deck', variant: 'destructive' });
    try {
      const { error } = await supabase.from('assignments').insert([{ deck_id: selectedDeck, student_id: selectedStudent, assigned_by: user?.id }]);
      if (error) throw error;
      toast({ title: 'Assigned', description: 'Deck assigned to student' });
      fetchData();
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to assign deck', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Teacher Admin</h1>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>Back</Button>
          </div>

          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Assign Decks</CardTitle>
              <CardDescription>Assign a deck to a student</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <select className="flex-1 p-2 rounded" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                  <option value="">Select student</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.display_name || s.username || s.id}</option>)}
                </select>
                <select className="flex-1 p-2 rounded" value={selectedDeck} onChange={(e) => setSelectedDeck(e.target.value)}>
                  <option value="">Select deck</option>
                  {decks.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                </select>
                <Button onClick={handleAssign}>Assign</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Current Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {assignments.map(a => (
                  <div key={a.id} className="p-3 bg-muted rounded flex justify-between">
                    <div>{a.id}</div>
                    <div className="text-sm text-muted-foreground">{new Date(a.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
