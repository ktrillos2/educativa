CREATE TABLE IF NOT EXISTS public.study_acts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL,
  type TEXT NOT NULL, -- 'CERTIFICATE' or 'ACTA'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.study_acts ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to insert their own records
CREATE POLICY "Users can insert their own study_acts" ON public.study_acts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to view their own records
CREATE POLICY "Users can view their own study_acts" ON public.study_acts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can do anything
CREATE POLICY "Admins can do anything on study_acts" ON public.study_acts
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );
