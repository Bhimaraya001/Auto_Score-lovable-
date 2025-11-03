-- Add student_email column to evaluations table
ALTER TABLE public.evaluations 
ADD COLUMN IF NOT EXISTS student_email text;

-- Drop the old student RLS policy
DROP POLICY IF EXISTS "Students can view their own evaluations" ON public.evaluations;

-- Create new RLS policy that checks both student_id and student_email
CREATE POLICY "Students can view evaluations by email or id" 
ON public.evaluations 
FOR SELECT 
USING (
  auth.uid() = student_id 
  OR 
  student_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Migrate existing data: copy student_name to student_email where student_email is null
UPDATE public.evaluations 
SET student_email = student_name 
WHERE student_email IS NULL;