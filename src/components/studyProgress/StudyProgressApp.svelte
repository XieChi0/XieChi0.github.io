<script lang="ts">
import { onMount } from "svelte";
import {
	createStudyProgressApi,
	hasStudyProgressSupabaseEnv,
} from "@/lib/studyProgress/study-progress-api";
import {
	clearStudyProgressSupabaseConfig,
	saveStudyProgressSupabaseConfig,
} from "@/lib/studyProgress/supabase-client";
import type {
	AddGoalItemInput,
	ArticleProgress,
	CreateStudyGoalInput,
	SaveProgressInput,
	StudyArticle,
	StudyGoal,
	StudyGoalItem,
	StudySession,
} from "@/lib/studyProgress/types";
import StudyProgressDashboard from "./StudyProgressDashboard.svelte";
import StudyProgressLogin from "./StudyProgressLogin.svelte";

export let articles: StudyArticle[] = [];

let api = createStudyProgressApi();
const debug = import.meta.env.DEV;

let session: StudySession | null = null;
let progressItems: ArticleProgress[] = [];
let goals: StudyGoal[] = [];
let configMissing = !hasStudyProgressSupabaseEnv();
let loading = true;
let savingArticleKey = "";
let message = "";
let error = "";

function getArticleKey(article: StudyArticle) {
	return `${article.source}:${article.id}`;
}

function getErrorMessage(value: unknown) {
	return value instanceof Error ? value.message : String(value);
}

function mergeProgress(saved: ArticleProgress) {
	if (debug) {
		console.debug("[studyProgress] merge progress", saved);
	}

	progressItems = [
		saved,
		...progressItems.filter(
			(item) =>
				`${item.articleSource}:${item.articleId}` !==
					`${saved.articleSource}:${saved.articleId}` &&
				`${item.articleSource}:${item.articleUrl}` !==
					`${saved.articleSource}:${saved.articleUrl}` &&
				`${item.articleSource}:${item.articleTitle}` !==
					`${saved.articleSource}:${saved.articleTitle}`,
		),
	];
}

function createOptimisticProgress(
	article: StudyArticle,
	progressPercent: number,
): ArticleProgress {
	const now = new Date().toISOString();
	return {
		id: `optimistic:${article.source}:${article.id}`,
		userId: session?.userId ?? "",
		articleId: article.id,
		articleSource: article.source,
		articleTitle: article.title,
		articleUrl: article.url,
		progressPercent,
		status:
			progressPercent >= 100
				? "completed"
				: progressPercent > 0
					? "reading"
					: "not_started",
		lastReadAt: now,
		createdAt: now,
		updatedAt: now,
	};
}

function mergeGoal(saved: StudyGoal) {
	goals = [saved, ...goals.filter((goal) => goal.id !== saved.id)];
}

function mergeGoalItem(saved: StudyGoalItem) {
	goals = goals.map((goal) => {
		if (goal.id !== saved.goalId) return goal;

		return {
			...goal,
			items: [
				saved,
				...goal.items.filter(
					(item) =>
						`${item.articleSource}:${item.articleId}` !==
						`${saved.articleSource}:${saved.articleId}`,
				),
			],
		};
	});
}

async function loadData() {
	loading = true;
	error = "";
	try {
		session = await api.getSession();
		if (debug) {
			console.debug("[studyProgress] session", session);
		}
		if (session) {
			const [progress, goalItems] = await Promise.all([
				api.listProgress(),
				api.listGoals(),
			]);
			progressItems = progress;
			goals = goalItems;
			if (debug) {
				console.debug("[studyProgress] load data", {
					articlesCount: articles.length,
					progressCount: progress.length,
					goalsCount: goalItems.length,
					articlesPreview: articles.slice(0, 12).map((article) => ({
						key: getArticleKey(article),
						url: article.url,
						title: article.title,
					})),
					progressPreview: progress.slice(0, 20).map((item) => ({
						key: `${item.articleSource}:${item.articleId}`,
						url: item.articleUrl,
						title: item.articleTitle,
						progressPercent: item.progressPercent,
					})),
				});
			}
		}
	} catch (err) {
		error = getErrorMessage(err);
	} finally {
		loading = false;
	}
}

async function handleLogin(password: string) {
	if (configMissing) {
		error = "Save your local Supabase config before signing in.";
		return;
	}

	loading = true;
	error = "";
	message = "";
	try {
		await api.signIn(password);
		await loadData();
		message = "Signed in and connected to Supabase.";
	} catch (err) {
		error = getErrorMessage(err);
	} finally {
		loading = false;
	}
}

async function handleSaveConfig(text: string) {
	loading = true;
	error = "";
	message = "";
	try {
		saveStudyProgressSupabaseConfig(text);
		api = createStudyProgressApi();
		configMissing = !hasStudyProgressSupabaseEnv();
		message = "Supabase config saved locally.";
		await loadData();
	} catch (err) {
		error = getErrorMessage(err);
		loading = false;
	}
}

async function handleClearConfig() {
	clearStudyProgressSupabaseConfig();
	api = createStudyProgressApi();
	configMissing = !hasStudyProgressSupabaseEnv();
	session = null;
	progressItems = [];
	goals = [];
	message = "Local Supabase config cleared.";
	error = "";
	loading = false;
}

async function handleLogout() {
	await api.signOut();
	session = null;
	progressItems = [];
	goals = [];
	message = "";
	error = "";
}

async function handleSaveProgress(
	article: StudyArticle,
	progressPercent: number,
) {
	savingArticleKey = getArticleKey(article);
	error = "";
	message = "";
	try {
		const input: SaveProgressInput = { article, progressPercent };
		if (debug) {
			console.debug("[studyProgress] save requested", input);
		}
		mergeProgress(createOptimisticProgress(article, progressPercent));
		const saved = await api.saveProgress(input);
		mergeProgress(saved);
		message = `Saved: ${saved.articleTitle} ${saved.progressPercent}%`;
	} catch (err) {
		error = getErrorMessage(err);
	} finally {
		savingArticleKey = "";
	}
}

async function handleCreateGoal(input: CreateStudyGoalInput) {
	loading = true;
	error = "";
	message = "";
	try {
		const saved = await api.createGoal(input);
		mergeGoal(saved);
		message = `Goal created: ${saved.title}`;
	} catch (err) {
		error = getErrorMessage(err);
	} finally {
		loading = false;
	}
}

async function handleAddGoalItem(input: AddGoalItemInput) {
	loading = true;
	error = "";
	message = "";
	try {
		const saved = await api.addGoalItem(input);
		mergeGoalItem(saved);
		message = `Added to goal: ${saved.articleTitle}`;
	} catch (err) {
		error = getErrorMessage(err);
	} finally {
		loading = false;
	}
}

async function handleDeleteGoal(goalId: string) {
	loading = true;
	error = "";
	message = "";
	try {
		await api.deleteGoal(goalId);
		goals = goals.filter((goal) => goal.id !== goalId);
		message = "Goal deleted.";
	} catch (err) {
		error = getErrorMessage(err);
	} finally {
		loading = false;
	}
}

onMount(loadData);
</script>

{#if session}
	<StudyProgressDashboard
		{session}
		{articles}
		{progressItems}
		{goals}
		{loading}
		{savingArticleKey}
		{message}
		{error}
		onLogout={handleLogout}
		onSaveProgress={handleSaveProgress}
		onCreateGoal={handleCreateGoal}
		onAddGoalItem={handleAddGoalItem}
		onDeleteGoal={handleDeleteGoal}
	/>
{:else}
	<StudyProgressLogin
		{loading}
		{error}
		{configMissing}
		onLogin={handleLogin}
		onSaveConfig={handleSaveConfig}
		onClearConfig={handleClearConfig}
	/>
{/if}
