/*
  # Add SELECT policy for newsletter subscribers table
  
  1. Changes to RLS Policies
    - Add SELECT policy for anon users to allow schema introspection
    - This is needed for the Supabase client to properly construct INSERT queries
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'newsletter_subscribers' AND policyname = 'Allow schema inspection'
  ) THEN
    CREATE POLICY "Allow schema inspection"
      ON newsletter_subscribers
      FOR SELECT
      TO anon
      USING (false);
  END IF;
END $$;