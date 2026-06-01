<script lang="ts">
import type { ArticleProgress, StudyArticle } from "@/lib/studyProgress/types";

export let articles: StudyArticle[] = [];
export let progressItems: ArticleProgress[] = [];
export let savingArticleKey = "";
export let debug = false;
export let onSaveProgress:
	| ((article: StudyArticle, progressPercent: number) => void | Promise<void>)
	| undefined;

const quickValues = [0, 25, 50, 75, 100];

$: progressByArticle = new Map(
	progressItems.map((item) => [
		`${item.articleSource}:${item.articleId}`,
		item,
	]),
);

$: progressByUrl = new Map(
	progressItems
		.filter((item) => item.articleUrl)
		.map((item) => [`${item.articleSource}:${item.articleUrl}`, item]),
);

$: progressByTitle = new Map(
	progressItems
		.filter((item) => item.articleTitle)
		.map((item) => [`${item.articleSource}:${item.articleTitle}`, item]),
);

function getArticleKey(article: StudyArticle) {
	return `${article.source}:${article.id}`;
}

function save(article: StudyArticle, progressPercent: number) {
	onSaveProgress?.(article, progressPercent);
}

$: visibleRows = articles.slice(0, 12).map((article) => {
	const articleKey = getArticleKey(article);
	const progress =
		progressByArticle.get(articleKey) ??
		progressByUrl.get(`${article.source}:${article.url}`) ??
		progressByTitle.get(`${article.source}:${article.title}`);

	return { article, articleKey, progress };
});

$: debugRows = visibleRows.map(({ article, articleKey, progress }) => ({
	articleKey,
	articleUrl: article.url,
	articleTitle: article.title,
	matchedProgressKey: progress
		? `${progress.articleSource}:${progress.articleId}`
		: null,
	matchedProgressUrl: progress?.articleUrl ?? null,
	progressPercent: progress?.progressPercent ?? null,
}));

$: if (debug) {
	console.debug("[studyProgress] visible article progress matches", debugRows);
}
</script>

<section class="card-base px-4 py-4 md:px-6">
	<div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
		<div>
			<h2 class="text-lg font-bold text-90">Article progress</h2>
			<p class="mt-1 text-sm text-50">Save a manual value first to verify cross-device sync.</p>
		</div>
		<div class="text-sm text-50">{articles.length} articles</div>
	</div>

	{#if debug}
		<details class="mt-4 rounded-xl border border-dashed border-black/10 p-3 text-xs text-50 dark:border-white/10">
			<summary class="cursor-pointer font-semibold text-75">Debug matches</summary>
			<pre class="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-all">{JSON.stringify(debugRows, null, 2)}</pre>
		</details>
	{/if}

	<div class="mt-4 flex flex-col gap-3">
		{#each visibleRows as { article, articleKey, progress } (articleKey)}
			<article class="rounded-xl border border-black/5 bg-black/[0.02] p-4 transition dark:border-white/10 dark:bg-white/[0.03]">
				<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
					<div class="min-w-0">
						<a class="block truncate font-semibold text-75 hover:text-[var(--primary)]" href={article.url}>
							{article.title}
						</a>
						<div class="mt-1 flex flex-wrap gap-2 text-xs text-30">
							<span>{article.source}</span>
							{#if article.category}
								<span>{article.category}</span>
							{/if}
							<span>{progress?.progressPercent ?? 0}%</span>
						</div>
					</div>

					<div class="grid grid-cols-5 gap-1">
						{#each quickValues as value}
							<button
								class="btn-plain h-8 min-w-10 rounded-lg px-2 text-xs font-bold disabled:opacity-40"
								type="button"
								disabled={savingArticleKey === articleKey}
								on:click={() => save(article, value)}
							>
								{value}
							</button>
						{/each}
					</div>
				</div>
			</article>
		{/each}
	</div>
</section>
