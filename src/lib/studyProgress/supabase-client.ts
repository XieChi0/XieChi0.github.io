import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function hasSupabaseClientEnv() {
	return Boolean(supabaseUrl && supabaseKey);
}

export function createStudyProgressSupabaseClient(): SupabaseClient {
	if (!supabaseUrl || !supabaseKey) {
		throw new Error(
			"Missing Supabase environment variables for studyProgress.",
		);
	}

	return createClient(supabaseUrl, supabaseKey, {
		auth: {
			persistSession: true,
			autoRefreshToken: true,
			detectSessionInUrl: false,
		},
	});
}
