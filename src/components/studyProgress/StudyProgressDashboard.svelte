<script lang="ts">
import type {
	AddGoalItemInput,
	ArticleProgress,
	CreateStudyGoalInput,
	StudyArticle,
	StudyGoal,
	StudySession,
} from "@/lib/studyProgress/types";
import ArticleProgressList from "./ArticleProgressList.svelte";
import GoalPanel from "./GoalPanel.svelte";

export let session: StudySession;
export let articles: StudyArticle[] = [];
export let progressItems: ArticleProgress[] = [];
export let goals: StudyGoal[] = [];
export let loading = false;
export let savingArticleKey = "";
export let message = "";
export let error = "";
export let onLogout: () => void | Promise<void> = () => {};
export let onSaveProgress:
	| ((article: StudyArticle, progressPercent: number) => void | Promise<void>)
	| undefined;
export let onCreateGoal:
	| ((input: CreateStudyGoalInput) => void | Promise<void>)
	| undefined;
export let onAddGoalItem:
	| ((input: AddGoalItemInput) => void | Promise<void>)
	| undefined;
export let onDeleteGoal: ((goalId: string) => void | Promise<void>) | undefined;

$: completedCount = progressItems.filter(
	(item) => item.progressPercent >= 100,
).length;
$: readingCount = progressItems.filter(
	(item) => item.progressPercent > 0 && item.progressPercent < 100,
).length;
</script>

<div class="flex flex-col gap-4">
	<section class="card-base px-6 py-5 md:px-9">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<p class="text-sm font-semibold text-[var(--primary)]">Study Progress</p>
				<h1 class="mt-1 text-2xl font-bold text-90">Study center prototype</h1>
				<p class="mt-2 text-sm text-50">{session.email} signed in</p>
			</div>
			<button
				class="btn-plain h-10 rounded-xl px-4 text-sm font-bold"
				type="button"
				on:click={() => onLogout()}
			>
				Sign out
			</button>
		</div>

		<div class="mt-5 grid gap-3 md:grid-cols-3">
			<div class="rounded-xl bg-black/[0.03] px-4 py-3 dark:bg-white/[0.04]">
				<div class="text-sm text-50">Article index</div>
				<div class="mt-1 text-2xl font-bold text-90">{articles.length}</div>
			</div>
			<div class="rounded-xl bg-black/[0.03] px-4 py-3 dark:bg-white/[0.04]">
				<div class="text-sm text-50">Reading</div>
				<div class="mt-1 text-2xl font-bold text-90">{readingCount}</div>
			</div>
			<div class="rounded-xl bg-black/[0.03] px-4 py-3 dark:bg-white/[0.04]">
				<div class="text-sm text-50">Completed</div>
				<div class="mt-1 text-2xl font-bold text-90">{completedCount}</div>
			</div>
		</div>

		{#if loading}
			<p class="mt-4 text-sm text-50">Syncing...</p>
		{/if}
		{#if message}
			<p class="mt-4 text-sm text-[var(--primary)]">{message}</p>
		{/if}
		{#if error}
			<p class="mt-4 text-sm text-red-500">{error}</p>
		{/if}

	</section>

	<ArticleProgressList
		{articles}
		{progressItems}
		{savingArticleKey}
		{onSaveProgress}
	/>
	<GoalPanel
		{goals}
		{articles}
		{progressItems}
		{onCreateGoal}
		{onAddGoalItem}
		{onDeleteGoal}
	/>
</div>
