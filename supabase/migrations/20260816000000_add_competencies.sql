-- Add competencies (learning outcomes) to decks and flashcards
ALTER TABLE public.flashcard_decks
  ADD COLUMN IF NOT EXISTS competencies TEXT[] DEFAULT ARRAY[]::TEXT[];

ALTER TABLE public.flashcards
  ADD COLUMN IF NOT EXISTS competencies TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Update timestamp triggers are already present; no new triggers needed
