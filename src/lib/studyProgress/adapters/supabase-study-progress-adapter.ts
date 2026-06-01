import { supabase } from "../supabase-client";
import type {
	ArticleProgress,
	ArticleProgressStatus,
	SaveProgressInput,
	StudyApi,
	StudyArticleSource,
	StudyGoal,
	StudyGoalStatus,
	StudySession,
} from "../types";

type StudyProgressRow = {
	id: string;
	user_id: string;
	article_id: string;
	article_source: StudyArticleSource;
	article_title: string;
	article_url: string;
	progress_percent: number;
	status: ArticleProgressStatus;
	last_read_at: string | null;
	created_at: string;
	updated_at: string;
};

type StudyGoalRow = {
	id: string;
	user_id: string;
	title: string;
	topic: string;
	target_date: string | null;
	status: StudyGoalStatus;
	notes: string;
	created_at: string;
	updated_at: string;
};

type ProgressErrorStep =
	| "load existing progress"
	| "update progress"
	| "create progress"
	| "record study event";

function getProgressErrorMessage(
	step: ProgressErrorStep,
	error: unknown,
): string {
	const message = error instanceof Error ? error.message : String(error);
	return `${step} failed: ${message}`;
}

function getAuthErrorMessage(error: unknown): string {
	const message = error instanceof Error ? error.message : String(error);
	const normalized = message.toLowerCase();

	if (normalized.includes("invalid login credentials")) {
		return "Sign in failed: the owner email or password is incorrect.";
	}

	if (normalized.includes("email not confirmed")) {
		return "Sign in failed: this Supabase user email is not confirmed.";
	}

	return message;
}

function mapProgress(row: StudyProgressRow): ArticleProgress {
	return {
		id: row.id,
		userId: row.user_id,
		articleId: row.article_id,
		articleSource: row.article_source,
		articleTitle: row.article_title,
		articleUrl: row.article_url,
		progressPercent: row.progress_percent,
		status: row.status,
		lastReadAt: row.last_read_at,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	};
}

function mapGoal(row: StudyGoalRow): StudyGoal {
	return {
		id: row.id,
		userId: row.user_id,
		title: row.title,
		topic: row.topic,
		targetDate: row.target_date,
		status: row.status,
		notes: row.notes,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	};
}

function getStatus(progressPercent: number): ArticleProgressStatus {
	if (progressPercent >= 100) return "completed";
	if (progressPercent > 0) return "reading";
	return "not_started";
}

async function requireUser() {
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error) throw error;
	if (!user) throw new Error("Not signed in.");
	return user;
}

export function createSupabaseStudyProgressApi(): StudyApi {
	return {
		async signIn(password: string) {
			const email = import.meta.env.PUBLIC_STUDY_OWNER_EMAIL;
			if (!email) {
				throw new Error("Missing PUBLIC_STUDY_OWNER_EMAIL.");
			}

			const { error } = await supabase.auth.signInWithPassword({
				email: email.trim(),
				password,
			});

			if (error) throw new Error(getAuthErrorMessage(error));
		},

		async signOut() {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
		},

		async getSession(): Promise<StudySession | null> {
			const {
				data: { session },
				error,
			} = await supabase.auth.getSession();

			if (error) throw error;
			if (!session?.user) return null;

			return {
				userId: session.user.id,
				email: session.user.email ?? null,
			};
		},

		async listProgress() {
			const { data, error } = await supabase
				.from("study_progress")
				.select("*")
				.order("updated_at", { ascending: false });

			if (error) throw error;
			if (import.meta.env.DEV) {
				console.debug("[studyProgress] listProgress rows", data);
			}
			return (data ?? []).map((row) => mapProgress(row as StudyProgressRow));
		},

		async saveProgress(input: SaveProgressInput) {
			const user = await requireUser();
			const progressPercent = Math.min(
				100,
				Math.max(0, Math.round(input.progressPercent)),
			);

			const { data: existing, error: existingError } = await supabase
				.from("study_progress")
				.select("*")
				.eq("user_id", user.id)
				.eq("article_source", input.article.source)
				.eq("article_id", input.article.id)
				.maybeSingle();

			if (existingError) {
				throw new Error(
					getProgressErrorMessage("load existing progress", existingError),
				);
			}

			const progressPayload = {
				user_id: user.id,
				article_id: input.article.id,
				article_source: input.article.source,
				article_title: input.article.title,
				article_url: input.article.url,
				progress_percent: progressPercent,
				status: getStatus(progressPercent),
				last_read_at: new Date().toISOString(),
			};

			const progressResult = existing
				? await supabase
						.from("study_progress")
						.update(progressPayload)
						.eq("id", (existing as StudyProgressRow).id)
						.select()
						.single()
				: await supabase
						.from("study_progress")
						.insert(progressPayload)
						.select()
						.single();

			if (progressResult.error) {
				throw new Error(
					getProgressErrorMessage(
						existing ? "update progress" : "create progress",
						progressResult.error,
					),
				);
			}

			const savedProgress = mapProgress(
				progressResult.data as StudyProgressRow,
			);
			if (import.meta.env.DEV) {
				console.debug("[studyProgress] saved progress row", savedProgress);
			}

			const { error: eventError } = await supabase.from("study_events").insert({
				user_id: user.id,
				article_id: input.article.id,
				article_source: input.article.source,
				article_title: input.article.title,
				previous_percent:
					(existing as StudyProgressRow | null)?.progress_percent ?? 0,
				current_percent: progressPercent,
			});

			if (eventError) {
				console.warn(getProgressErrorMessage("record study event", eventError));
			}

			return savedProgress;
		},

		async listGoals() {
			const { data, error } = await supabase
				.from("study_goals")
				.select("*")
				.order("created_at", { ascending: false });

			if (error) throw error;
			return (data ?? []).map((row) => mapGoal(row as StudyGoalRow));
		},
	};
}
