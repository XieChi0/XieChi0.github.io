import { createSupabaseStudyProgressApi } from "./adapters/supabase-study-progress-adapter";
import { createUnavailableStudyProgressApi } from "./adapters/unavailable-study-progress-adapter";
import type { StudyApi } from "./types";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function hasStudyProgressSupabaseEnv() {
	return Boolean(supabaseUrl && supabaseKey);
}

export function createStudyProgressApi(): StudyApi {
	if (!hasStudyProgressSupabaseEnv()) {
		return createUnavailableStudyProgressApi();
	}

	return createSupabaseStudyProgressApi();
}
