import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
	throw new Error("Missing Supabase environment variables for studyProgress.");
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: false,
	},
});
