-- Create evaluations table
CREATE TABLE public.evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  course_id TEXT,
  marks INTEGER NOT NULL,
  max_marks INTEGER NOT NULL,
  student_answer TEXT,
  reference_answer TEXT,
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

-- Teachers can view their own evaluations
CREATE POLICY "Teachers can view their own evaluations"
ON public.evaluations
FOR SELECT
USING (auth.uid() = teacher_id);

-- Teachers can insert evaluations
CREATE POLICY "Teachers can create evaluations"
ON public.evaluations
FOR INSERT
WITH CHECK (auth.uid() = teacher_id);

-- Teachers can update their own evaluations
CREATE POLICY "Teachers can update their own evaluations"
ON public.evaluations
FOR UPDATE
USING (auth.uid() = teacher_id);

-- Teachers can delete their own evaluations
CREATE POLICY "Teachers can delete their own evaluations"
ON public.evaluations
FOR DELETE
USING (auth.uid() = teacher_id);

-- Students can view their own evaluations
CREATE POLICY "Students can view their own evaluations"
ON public.evaluations
FOR SELECT
USING (auth.uid() = student_id);

-- Trigger for updated_at
CREATE TRIGGER update_evaluations_updated_at
BEFORE UPDATE ON public.evaluations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();