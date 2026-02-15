import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://alshbbezyksrkoxvjjvk.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsc2hiYmV6eWtzcmtveHZqanZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NTgwNDUsImV4cCI6MjA4NjUzNDA0NX0.Kt_gBe_iOL0abu2efUcs7gRdyQn6RIbILmDfaEmWwHo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
