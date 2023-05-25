import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  'https://ltlwfcdwjczwsvohawml.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0bHdmY2R3amN6d3N2b2hhd21sIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjkwNDM0MTcsImV4cCI6MTk4NDYxOTQxN30.yWIYg6sihZXKgRzMQSPMMV-Vi-PPOpZ4-u-Pf_Dhr_E'
);
