-- Allow trainer-assigned decks to behave like real student learning material.
-- This migration is intentionally additive so it can be run after the earlier
-- roles/assignments migration in an existing Supabase project.

ALTER TABLE public.assignments
  ALTER COLUMN assigned_by DROP NOT NULL;

DROP POLICY IF EXISTS "Teachers can create assignments" ON public.assignments;

CREATE POLICY "Teachers and admins can create assignments"
ON public.assignments
FOR INSERT
WITH CHECK (
  assigned_by = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('teacher', 'admin')
  )
);

CREATE POLICY "Teachers admins and assigned students can view assignments"
ON public.assignments
FOR SELECT
USING (
  assigned_by = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = assignments.student_id
      AND profiles.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('teacher', 'admin')
  )
);

CREATE POLICY "Teachers and admins can update assignments"
ON public.assignments
FOR UPDATE
USING (
  assigned_by = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('teacher', 'admin')
  )
)
WITH CHECK (
  assigned_by = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('teacher', 'admin')
  )
);

CREATE POLICY "Teachers and admins can delete assignments"
ON public.assignments
FOR DELETE
USING (
  assigned_by = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = auth.uid()
      AND profiles.role IN ('teacher', 'admin')
  )
);

CREATE POLICY "Students can view assigned decks"
ON public.flashcard_decks
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.assignments
    JOIN public.profiles ON profiles.id = assignments.student_id
    WHERE assignments.deck_id = flashcard_decks.id
      AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Students can view cards from assigned decks"
ON public.flashcards
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.assignments
    JOIN public.profiles ON profiles.id = assignments.student_id
    WHERE assignments.deck_id = flashcards.deck_id
      AND profiles.user_id = auth.uid()
  )
);
