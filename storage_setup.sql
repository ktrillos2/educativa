-- Create the user_documents bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user_documents', 'user_documents', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to read files
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'user_documents');

-- Allow authenticated users to upload files
CREATE POLICY "Auth Users Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'user_documents' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update/overwrite their own files
CREATE POLICY "Auth Users Update" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'user_documents' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their files
CREATE POLICY "Auth Users Delete" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'user_documents' 
    AND auth.role() = 'authenticated'
);
