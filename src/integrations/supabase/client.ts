// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gjjpgnacjzsehqyjbnmk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqanBnbmFjanpzZWhxeWpibm1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNTgyNzAsImV4cCI6MjA2MzgzNDI3MH0.a5xVmQSd-hW8OoLedD1P51K2Lol8VVMLcTtYjmyDH40";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);