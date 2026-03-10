/*
  # Add branch field to newsletter subscribers

  1. Changes to newsletter_subscribers table
    - Add `branch` column to store subscriber's selected branch
    - Values: Dwarsloop, Dayizenza, Kwamhlanga, Elukwatini, Numbi
    - Helps segment newsletter by branch for targeted tips and specials

  2. Security
    - RLS already enabled on table
    - No new policies needed
*/

ALTER TABLE newsletter_subscribers 
ADD COLUMN IF NOT EXISTS branch text DEFAULT 'Dwarsloop';
