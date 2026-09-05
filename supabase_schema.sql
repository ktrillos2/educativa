-- Users table extension (Supabase Auth already handles users in auth.users, 
-- but we create a public.users table to store extra information)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  document TEXT UNIQUE NOT NULL,
  phone TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  id_document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Course Groups (Cohortes)
CREATE TABLE IF NOT EXISTS public.course_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT NOT NULL,
  name TEXT NOT NULL,
  registration_start TIMESTAMP WITH TIME ZONE NOT NULL,
  registration_end TIMESTAMP WITH TIME ZONE NOT NULL,
  whatsapp_link TEXT,
  first_certificate_download_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL,
  group_id UUID REFERENCES public.course_groups(id) ON DELETE SET NULL,
  payment_verified BOOLEAN DEFAULT FALSE,
  is_expired BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Progress Table
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read and update their own data
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can view their own enrollments
CREATE POLICY "Users can view their own enrollments" ON public.enrollments
  FOR SELECT USING (auth.uid() = user_id);

-- Users can view their own progress
CREATE POLICY "Users can view their own progress" ON public.progress
  FOR SELECT USING (auth.uid() = user_id);

-- Depending on your app, you might need policies for inserts/updates
CREATE POLICY "Users can insert their own progress" ON public.progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own enrollments" ON public.enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Live Classes Table
CREATE TABLE IF NOT EXISTS public.live_classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.course_groups(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'scheduled', -- scheduled, in_progress, finished
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Class Attendance Table
CREATE TABLE IF NOT EXISTS public.class_attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID REFERENCES public.live_classes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER DEFAULT 0
);

-- Class Recordings Table
CREATE TABLE IF NOT EXISTS public.class_recordings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID REFERENCES public.live_classes(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS for new tables
ALTER TABLE public.course_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_recordings ENABLE ROW LEVEL SECURITY;

-- Everyone can view course groups
CREATE POLICY "Anyone can view course groups" ON public.course_groups
  FOR SELECT USING (true);

-- Admins can manage course groups (assuming role = 'admin' check is done via app or triggers, simplifying for now)
CREATE POLICY "Admins can insert course groups" ON public.course_groups
  FOR ALL USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );

-- Users can view live classes of their group
CREATE POLICY "Users can view live classes" ON public.live_classes
  FOR SELECT USING (
    group_id IN (SELECT group_id FROM public.enrollments WHERE user_id = auth.uid())
    OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Admins can manage live classes
CREATE POLICY "Admins can manage live classes" ON public.live_classes
  FOR ALL USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );

-- Users can view their own attendance, admins can view all
CREATE POLICY "Users can view their attendance" ON public.class_attendance
  FOR SELECT USING (
    auth.uid() = user_id
    OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Service role (webhooks) handles inserts/updates to attendance
CREATE POLICY "Service role manages attendance" ON public.class_attendance
  FOR ALL USING (true); -- Usually restricted by Supabase Service Key, not RLS

-- Users can view recordings of their group
CREATE POLICY "Users can view recordings" ON public.class_recordings
  FOR SELECT USING (
    class_id IN (
      SELECT id FROM public.live_classes WHERE group_id IN (
        SELECT group_id FROM public.enrollments WHERE user_id = auth.uid()
      )
    )
    OR (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Service role handles recording inserts
CREATE POLICY "Service role manages recordings" ON public.class_recordings
  FOR ALL USING (true);

-- NOTE: The courses table (created elsewhere) requires the following column 
-- to differentiate between Diplomados and ETDH Formación Académica:
-- ALTER TABLE public.courses ADD COLUMN type TEXT DEFAULT 'diplomado';

-- ==========================================
-- FORUMS (Social & Academic)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.forum_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT, -- NULL para foro social global, o ID del curso para foro académico
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  is_pinned BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.forum_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES public.forum_topics(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS for Forums
ALTER TABLE public.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

-- Select policies
CREATE POLICY "Anyone can read topics" ON public.forum_topics FOR SELECT USING (true);
CREATE POLICY "Anyone can read replies" ON public.forum_replies FOR SELECT USING (true);

-- Insert policies
CREATE POLICY "Users can create topics" ON public.forum_topics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can create replies" ON public.forum_replies FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update policies (only for own topics/replies, or admin via service role which bypasses RLS)
CREATE POLICY "Users can update own topics" ON public.forum_topics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can update own replies" ON public.forum_replies FOR UPDATE USING (auth.uid() = user_id);

-- Delete policies
CREATE POLICY "Users can delete own topics" ON public.forum_topics FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own replies" ON public.forum_replies FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- STORAGE FOR USER DOCUMENTS
-- ==========================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('user_documents', 'user_documents', true);
-- (Configura este bucket como público o usa RLS si prefieres mayor privacidad)
