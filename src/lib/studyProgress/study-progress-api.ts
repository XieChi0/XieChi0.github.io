import { createSupabaseStudyProgressApi } from "./adapters/supabase-study-progress-adapter";
import { createUnavailableStudyProgressApi } from "./adapters/unavailable-study-progress-adapter";
import { hasSupabaseClientEnv } from "./supabase-client";
import type { StudyApi } from "./types";

export function hasStudyProgressSupabaseEnv() {
	return hasSupabaseClientEnv();
}

export function createStudyProgressApi(): StudyApi {
	if (!hasStudyProgressSupabaseEnv()) {
		return createUnavailableStudyProgressApi();
	}

	return createSupabaseStudyProgressApi();
}
