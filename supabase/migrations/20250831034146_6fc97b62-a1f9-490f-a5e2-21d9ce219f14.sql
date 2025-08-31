-- Create flashcard decks table
CREATE TABLE public.flashcard_decks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create flashcards table
CREATE TABLE public.flashcards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deck_id UUID NOT NULL REFERENCES public.flashcard_decks(id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create study sessions table for tracking progress
CREATE TABLE public.study_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flashcard_id UUID NOT NULL REFERENCES public.flashcards(id) ON DELETE CASCADE,
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
  next_review_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  review_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for flashcard_decks
CREATE POLICY "Users can view their own decks" 
ON public.flashcard_decks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own decks" 
ON public.flashcard_decks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own decks" 
ON public.flashcard_decks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own decks" 
ON public.flashcard_decks 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for flashcards
CREATE POLICY "Users can view flashcards from their own decks" 
ON public.flashcards 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.flashcard_decks 
    WHERE flashcard_decks.id = flashcards.deck_id 
    AND flashcard_decks.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create flashcards in their own decks" 
ON public.flashcards 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.flashcard_decks 
    WHERE flashcard_decks.id = flashcards.deck_id 
    AND flashcard_decks.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update flashcards in their own decks" 
ON public.flashcards 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.flashcard_decks 
    WHERE flashcard_decks.id = flashcards.deck_id 
    AND flashcard_decks.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete flashcards from their own decks" 
ON public.flashcards 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.flashcard_decks 
    WHERE flashcard_decks.id = flashcards.deck_id 
    AND flashcard_decks.user_id = auth.uid()
  )
);

-- RLS policies for study_sessions
CREATE POLICY "Users can view their own study sessions" 
ON public.study_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study sessions" 
ON public.study_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study sessions" 
ON public.study_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study sessions" 
ON public.study_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_flashcard_decks_updated_at
  BEFORE UPDATE ON public.flashcard_decks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_flashcards_updated_at
  BEFORE UPDATE ON public.flashcards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_study_sessions_updated_at
  BEFORE UPDATE ON public.study_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();