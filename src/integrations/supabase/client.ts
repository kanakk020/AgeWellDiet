// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cotyiyaglnixfarzbftt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvdHlpeWFnbG5peGZhcnpiZnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1Mzg2OTksImV4cCI6MjA2NDExNDY5OX0.L-k0l4ZzWRqZfKSMdtc4pBVTX2WEU8Swg3gkQtqH6I0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);