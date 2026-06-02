export type StudyArticleSource = "posts" | "external";

export type StudyArticle = {
	id: string;
	source: StudyArticleSource;
	title: string;
	url: string;
	category: string;
	tags: string[];
	published: string;
};

export type StudySession = {
	userId: string;
	email: string | null;
};

export type ArticleProgressStatus = "not_started" | "reading" | "completed";

export type ArticleProgress = {
	id: string;
	userId: string;
	articleId: string;
	articleSource: StudyArticleSource;
	articleTitle: string;
	articleUrl: string;
	progressPercent: number;
	status: ArticleProgressStatus;
	lastReadAt: string | null;
	createdAt: string;
	updatedAt: string;
};

export type SaveProgressInput = {
	article: StudyArticle;
	progressPercent: number;
};

export type StudyGoalStatus = "active" | "paused" | "completed" | "archived";

export type StudyGoal = {
	id: string;
	userId: string;
	title: string;
	topic: string;
	targetDate: string | null;
	status: StudyGoalStatus;
	notes: string;
	createdAt: string;
	updatedAt: string;
	items: StudyGoalItem[];
};

export type StudyGoalItem = {
	id: string;
	userId: string;
	goalId: string;
	articleId: string;
	articleSource: StudyArticleSource;
	articleTitle: string;
	articleUrl: string;
	targetPercent: number;
	sortOrder: number;
	createdAt: string;
};

export type CreateStudyGoalInput = {
	title: string;
	topic: string;
	targetDate: string;
	notes: string;
};

export type AddGoalItemInput = {
	goalId: string;
	article: StudyArticle;
	targetPercent: number;
};

export type StudyApi = {
	signIn(password: string): Promise<void>;
	signOut(): Promise<void>;
	getSession(): Promise<StudySession | null>;
	listProgress(): Promise<ArticleProgress[]>;
	saveProgress(input: SaveProgressInput): Promise<ArticleProgress>;
	listGoals(): Promise<StudyGoal[]>;
	createGoal(input: CreateStudyGoalInput): Promise<StudyGoal>;
	addGoalItem(input: AddGoalItemInput): Promise<StudyGoalItem>;
	deleteGoal(goalId: string): Promise<void>;
};
