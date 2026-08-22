import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BriefcaseBusiness, Building2, GraduationCap, Search, Sparkles, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CareerPath {
  id: string;
  course_name: string;
  career_title: string;
  description: string;
  skills: string[];
  workplaces: string[];
  certifications: string[];
  related_competencies: string[];
}

const CareerPaths = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareerPaths();
  }, []);

  const fetchCareerPaths = async () => {
    try {
      const { data, error } = await supabase
        .from('career_paths')
        .select('*')
        .order('course_name', { ascending: true })
        .order('career_title', { ascending: true });

      if (error) throw error;

      const rows = (data || []) as CareerPath[];
      setCareerPaths(rows);
      setSelectedCourse(rows[0]?.course_name || '');
    } catch (error) {
      console.error('Error fetching career paths:', error);
      toast({
        title: 'Error',
        description: 'Failed to load career paths',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const courses = useMemo(() => {
    return Array.from(new Set(careerPaths.map((path) => path.course_name))).sort();
  }, [careerPaths]);

  const filteredCareers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return careerPaths.filter((path) => {
      const matchesCourse = !selectedCourse || path.course_name === selectedCourse;
      const searchableText = [
        path.course_name,
        path.career_title,
        path.description,
        ...path.skills,
        ...path.workplaces,
        ...path.certifications,
        ...path.related_competencies,
      ]
        .join(' ')
        .toLowerCase();

      return matchesCourse && (!normalizedSearch || searchableText.includes(normalizedSearch));
    });
  }, [careerPaths, searchTerm, selectedCourse]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Career Paths</h1>
              <p className="text-muted-foreground">Choose your TVET course and explore practical career options.</p>
            </div>
          </div>

          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BriefcaseBusiness className="h-5 w-5" />
                Match Course to Career
              </CardTitle>
              <CardDescription>
                Career suggestions include skills to build, workplaces to target, and next certifications to consider.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-[260px_1fr]">
                <div className="space-y-2">
                  <label htmlFor="course" className="text-sm font-medium">
                    Course
                  </label>
                  <select
                    id="course"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={selectedCourse}
                    onChange={(event) => setSelectedCourse(event.target.value)}
                  >
                    {courses.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="career-search" className="text-sm font-medium">
                    Search skills or careers
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="career-search"
                      className="pl-9"
                      placeholder="e.g., networking, customer care, welding"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-80 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : filteredCareers.length === 0 ? (
            <Card className="card-gradient text-center">
              <CardContent className="space-y-3 py-12">
                <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="text-xl font-semibold">No matching careers found</h2>
                <p className="text-muted-foreground">Try another course or search term.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredCareers.map((career) => (
                <Card key={career.id} className="card-gradient flex flex-col">
                  <CardHeader>
                    <Badge variant="outline" className="w-fit">
                      {career.course_name}
                    </Badge>
                    <CardTitle>{career.career_title}</CardTitle>
                    <CardDescription>{career.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-5">
                    <CareerSection icon={Wrench} title="Skills" items={career.skills} />
                    <CareerSection icon={Building2} title="Workplaces" items={career.workplaces} />
                    <CareerSection icon={GraduationCap} title="Next Steps" items={career.certifications} />
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Related Competencies</div>
                      <div className="flex flex-wrap gap-2">
                        {career.related_competencies.map((competency) => (
                          <Badge key={competency} variant="secondary">
                            {competency}
                          </Badge>
                        ))}
                      </div>
                    </div>
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

interface CareerSectionProps {
  icon: typeof Wrench;
  title: string;
  items: string[];
}

const CareerSection = ({ icon: Icon, title, items }: CareerSectionProps) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-sm font-medium">
      <Icon className="h-4 w-4 text-primary" />
      {title}
    </div>
    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

export default CareerPaths;
