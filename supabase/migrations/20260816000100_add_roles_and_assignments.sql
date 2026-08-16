-- Add role column to profiles and create assignments table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';

CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id UUID NOT NULL REFERENCES public.flashcard_decks(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on assignments
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can create assignments" ON public.assignments
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
