import type {
	AddGoalItemInput,
	ArticleProgress,
	CreateStudyGoalInput,
	SaveProgressInput,
	StudyApi,
	StudyGoal,
	StudyGoalItem,
	StudySession,
} from "../types";

const unavailableMessage =
	"Study progress is unavailable because Supabase environment variables are not configured.";

function createUnavailableError(): Error {
	return new Error(unavailableMessage);
}

export function createUnavailableStudyProgressApi(): StudyApi {
	return {
		async signIn(_password: string): Promise<void> {
			throw createUnavailableError();
		},
		async signOut(): Promise<void> {
			return;
		},
		async getSession(): Promise<StudySession | null> {
			return null;
		},
		async listProgress(): Promise<ArticleProgress[]> {
			return [];
		},
		async saveProgress(_input: SaveProgressInput): Promise<ArticleProgress> {
			throw createUnavailableError();
		},
		async listGoals(): Promise<StudyGoal[]> {
			return [];
		},
		async createGoal(_input: CreateStudyGoalInput): Promise<StudyGoal> {
			throw createUnavailableError();
		},
		async addGoalItem(_input: AddGoalItemInput): Promise<StudyGoalItem> {
			throw createUnavailableError();
		},
		async deleteGoal(_goalId: string): Promise<void> {
			throw createUnavailableError();
		},
	};
}
