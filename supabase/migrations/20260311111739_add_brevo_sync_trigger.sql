/*
  # Add Brevo sync trigger

  1. Changes
    - Create function to call Brevo sync Edge Function when new subscribers are added
    - Add trigger on newsletter_subscribers table to automatically sync new contacts

  2. Purpose
    - When a new subscriber signs up with their email and branch selection
    - The trigger automatically calls the sync-to-brevo Edge Function
    - This adds the contact to Brevo's corresponding branch list
*/

CREATE OR REPLACE FUNCTION sync_subscriber_to_brevo()
RETURNS TRIGGER AS $$
DECLARE
  response_body jsonb;
BEGIN
  SELECT
    headers -> 'body',
    status
  INTO response_body FROM
    http_post(
      'https://zpqsytltvkmaxpigbtcx.supabase.co/functions/v1/sync-to-brevo',
      jsonb_build_object(
        'email', NEW.email,
        'branch', COALESCE(NEW.branch, 'Dwarsloop')
      ),
      'application/json',
      ARRAY[http_header('Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key'))],
      1000
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS newsletter_sync_to_brevo ON newsletter_subscribers;

CREATE TRIGGER newsletter_sync_to_brevo
AFTER INSERT ON newsletter_subscribers
FOR EACH ROW
EXECUTE FUNCTION sync_subscriber_to_brevo();
