<script lang="ts">
import type {
	AddGoalItemInput,
	ArticleProgress,
	CreateStudyGoalInput,
	StudyArticle,
	StudyGoal,
} from "@/lib/studyProgress/types";

export let goals: StudyGoal[] = [];
export let articles: StudyArticle[] = [];
export let progressItems: ArticleProgress[] = [];
export let onCreateGoal:
	| ((input: CreateStudyGoalInput) => void | Promise<void>)
	| undefined;
export let onAddGoalItem:
	| ((input: AddGoalItemInput) => void | Promise<void>)
	| undefined;
export let onDeleteGoal: ((goalId: string) => void | Promise<void>) | undefined;

let title = "";
let topic = "";
let targetDate = "";
let notes = "";
let selectedGoalId = "";
let selectedArticleKey = "";
let targetPercent = 100;
let goalMenuOpen = false;
let articleMenuOpen = false;

$: progressByArticle = new Map(
	progressItems.map((item) => [
		`${item.articleSource}:${item.articleId}`,
		item.progressPercent,
	]),
);

$: articleOptions = articles.map((article) => ({
	key: `${article.source}:${article.id}`,
	article,
}));

$: if (!selectedGoalId && goals.length > 0) selectedGoalId = goals[0].id;
$: if (!selectedArticleKey && articleOptions.length > 0) {
	selectedArticleKey = articleOptions[0].key;
}
$: selectedGoalTitle =
	goals.find((goal) => goal.id === selectedGoalId)?.title ?? "";
$: selectedArticleTitle =
	articleOptions.find((option) => option.key === selectedArticleKey)?.article
		.title ?? "";

function getGoalCompletion(goal: StudyGoal) {
	if (goal.items.length === 0) return 0;

	const total = goal.items.reduce((sum, item) => {
		const progress =
			progressByArticle.get(`${item.articleSource}:${item.articleId}`) ?? 0;
		return sum + Math.min(100, (progress / item.targetPercent) * 100);
	}, 0);

	return Math.round(total / goal.items.length);
}

function formatDate(value: string | null) {
	if (!value) return "No deadline";
	return value.slice(0, 10);
}

function selectGoal(goalId: string) {
	selectedGoalId = goalId;
	goalMenuOpen = false;
}

function selectArticle(articleKey: string) {
	selectedArticleKey = articleKey;
	articleMenuOpen = false;
}

function createGoal() {
	onCreateGoal?.({
		title,
		topic,
		targetDate,
		notes,
	});
	title = "";
	topic = "";
	targetDate = "";
	notes = "";
}

function addGoalItem() {
	const article = articleOptions.find(
		(option) => option.key === selectedArticleKey,
	)?.article;

	if (!selectedGoalId || !article) return;
	onAddGoalItem?.({
		goalId: selectedGoalId,
		article,
		targetPercent,
	});
}

function deleteGoal(goal: StudyGoal) {
	const confirmed = window.confirm(
		`Delete goal "${goal.title}"? This will remove its linked articles from this goal.`,
	);
	if (!confirmed) return;
	onDeleteGoal?.(goal.id);
}
</script>

<section class="card-base px-4 py-4 md:px-6">
	<div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
		<div>
			<h2 class="text-lg font-bold text-90">Goal mode</h2>
			<p class="mt-1 text-sm text-50">Plan a topic, deadline, and the articles that count toward it.</p>
		</div>
		<div class="text-sm text-50">{goals.length} goals</div>
	</div>

	<div class="mt-4 grid gap-3 md:grid-cols-2">
		<form
			class="rounded-xl border border-black/5 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]"
			on:submit|preventDefault={createGoal}
		>
			<h3 class="text-sm font-bold text-75">Create goal</h3>
			<div class="mt-3 grid gap-2">
				<input
					class="h-10 rounded-lg border border-black/10 bg-[var(--card-bg)] px-3 text-sm outline-none focus:border-[var(--primary)] dark:border-white/10"
					placeholder="Goal title"
					bind:value={title}
					required
				/>
				<input
					class="h-10 rounded-lg border border-black/10 bg-[var(--card-bg)] px-3 text-sm outline-none focus:border-[var(--primary)] dark:border-white/10"
					placeholder="Topic"
					bind:value={topic}
				/>
				<input
					class="h-10 rounded-lg border border-black/10 bg-[var(--card-bg)] px-3 text-sm outline-none focus:border-[var(--primary)] dark:border-white/10"
					type="date"
					bind:value={targetDate}
				/>
				<textarea
					class="min-h-20 rounded-lg border border-black/10 bg-[var(--card-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--primary)] dark:border-white/10"
					placeholder="Notes"
					bind:value={notes}
				></textarea>
				<button class="btn-plain h-10 rounded-lg px-4 text-sm font-bold" type="submit">
					Create
				</button>
			</div>
		</form>

		<form
			class="rounded-xl border border-black/5 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]"
			on:submit|preventDefault={addGoalItem}
		>
			<h3 class="text-sm font-bold text-75">Add article to goal</h3>
			<div class="mt-3 grid gap-2">
				<label class="text-xs font-semibold text-50">Goal</label>
				<div class="relative">
					<button
						class="flex h-10 w-full items-center justify-between gap-4 rounded-lg border border-black/10 bg-[var(--card-bg)] px-3 py-0 pl-3 pr-5 text-left text-sm outline-none transition focus:border-[var(--primary)] disabled:opacity-40 dark:border-white/10"
						type="button"
						disabled={goals.length === 0}
						aria-expanded={goalMenuOpen}
						on:click={() => {
							goalMenuOpen = !goalMenuOpen;
							articleMenuOpen = false;
						}}
					>
						<span class="truncate">{selectedGoalTitle || "Create a goal first"}</span>
						<span class="shrink-0 text-[0.55rem] text-30">v</span>
					</button>
					{#if goalMenuOpen}
						<div class="absolute left-0 top-11 z-30 max-h-40 w-full overflow-y-auto rounded-lg border border-black/10 bg-[var(--card-bg)] p-1 shadow-lg dark:border-white/10">
							{#each goals as goal}
								<button
									class="block w-full rounded-md px-3 py-2 text-left text-sm text-75 hover:bg-black/5 dark:hover:bg-white/10"
									type="button"
									on:click={() => selectGoal(goal.id)}
								>
									{goal.title}
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<label class="text-xs font-semibold text-50">Article</label>
				<div class="relative">
					<button
						class="flex h-10 w-full items-center justify-between gap-4 rounded-lg border border-black/10 bg-[var(--card-bg)] px-3 py-0 pl-3 pr-5 text-left text-sm outline-none transition focus:border-[var(--primary)] disabled:opacity-40 dark:border-white/10"
						type="button"
						disabled={articleOptions.length === 0}
						aria-expanded={articleMenuOpen}
						on:click={() => {
							articleMenuOpen = !articleMenuOpen;
							goalMenuOpen = false;
						}}
					>
						<span class="truncate">{selectedArticleTitle || "Select article"}</span>
						<span class="shrink-0 text-[0.55rem] text-30">v</span>
					</button>
					{#if articleMenuOpen}
						<div class="absolute left-0 top-11 z-30 max-h-40 w-full overflow-y-auto rounded-lg border border-black/10 bg-[var(--card-bg)] p-1 shadow-lg dark:border-white/10">
							{#each articleOptions as option}
								<button
									class="block w-full rounded-md px-3 py-2 text-left text-sm text-75 hover:bg-black/5 dark:hover:bg-white/10"
									type="button"
									on:click={() => selectArticle(option.key)}
								>
									{option.article.title}
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<label class="text-xs font-semibold text-50" for="goal-target-percent">
					Target percent
				</label>
				<input
					id="goal-target-percent"
					class="h-10 rounded-lg border border-black/10 bg-[var(--card-bg)] px-3 text-sm outline-none focus:border-[var(--primary)] dark:border-white/10"
					type="number"
					min="1"
					max="100"
					bind:value={targetPercent}
				/>
				<button
					class="btn-plain h-10 rounded-lg px-4 text-sm font-bold disabled:opacity-40"
					type="submit"
					disabled={goals.length === 0 || articleOptions.length === 0}
				>
					{goals.length === 0 ? "Create goal first" : "Add to goal"}
				</button>
			</div>
		</form>
	</div>

	<div class="mt-4 flex flex-col gap-3">
		{#if goals.length === 0}
			<div class="rounded-xl border border-dashed border-black/10 px-4 py-5 text-sm text-50 dark:border-white/10">
				No goals yet.
			</div>
		{:else}
			{#each goals as goal}
				{@const completion = getGoalCompletion(goal)}
				<div class="rounded-xl border border-black/5 px-4 py-3 dark:border-white/10">
					<div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
						<div>
							<div class="font-semibold text-75">{goal.title}</div>
							<div class="mt-1 text-sm text-50">
								{goal.topic || "No topic"} / {formatDate(goal.targetDate)}
							</div>
						</div>
						<div class="flex items-center gap-3">
							<div class="text-sm font-bold text-[var(--primary)]">{completion}%</div>
							<button
								class="btn-plain h-8 rounded-lg px-3 text-xs font-bold text-red-500"
								type="button"
								on:click={() => deleteGoal(goal)}
							>
								Delete
							</button>
						</div>
					</div>
					<div class="mt-3 h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
						<div class="h-full rounded-full bg-[var(--primary)]" style={`width: ${completion}%`}></div>
					</div>
					{#if goal.items.length > 0}
						<div class="mt-3 flex flex-col gap-2">
							{#each goal.items as item}
								{@const progress = progressByArticle.get(`${item.articleSource}:${item.articleId}`) ?? 0}
								<a class="text-sm text-50 hover:text-[var(--primary)]" href={item.articleUrl}>
									{item.articleTitle} / {progress}% / {item.targetPercent}%
								</a>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
</section>
