import { createSupabaseStudyProgressApi } from "./adapters/supabase-study-progress-adapter";
import type { StudyApi } from "./types";

export function createStudyProgressApi(): StudyApi {
	return createSupabaseStudyProgressApi();
}
