<script lang="ts">
import type { ArticleProgress, StudyArticle } from "@/lib/studyProgress/types";

export let articles: StudyArticle[] = [];
export let progressItems: ArticleProgress[] = [];
export let savingArticleKey = "";
export let onSaveProgress:
	| ((article: StudyArticle, progressPercent: number) => void | Promise<void>)
	| undefined;

const quickValues = [0, 25, 50, 75, 100];
const pageSize = 10;
const uncategorizedValue = "__uncategorized__";

let currentPage = 1;
let selectedCategory = "";
let categoryMenuOpen = false;

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

function getCategoryPaths(category: string) {
	const parts = category
		.split("/")
		.map((part) => part.trim())
		.filter(Boolean);

	return parts.map((_, index) => parts.slice(0, index + 1).join("/"));
}

function matchesCategory(article: StudyArticle) {
	if (!selectedCategory) return true;
	if (selectedCategory === uncategorizedValue) return !article.category;
	return (
		article.category === selectedCategory ||
		article.category.startsWith(`${selectedCategory}/`)
	);
}

function getCategoryLabel(category: string) {
	if (!category) return "All categories";
	if (category === uncategorizedValue) return "Uncategorized";
	return category;
}

function selectCategory(category: string) {
	selectedCategory = category;
	currentPage = 1;
	categoryMenuOpen = false;
}

$: articleRows = articles.map((article) => {
	const articleKey = getArticleKey(article);
	const progress =
		progressByArticle.get(articleKey) ??
		progressByUrl.get(`${article.source}:${article.url}`) ??
		progressByTitle.get(`${article.source}:${article.title}`);

	return { article, articleKey, progress };
});

$: categoryOptions = Array.from(
	articles.reduce((options, article) => {
		if (!article.category) {
			options.set(
				uncategorizedValue,
				(options.get(uncategorizedValue) ?? 0) + 1,
			);
			return options;
		}

		for (const categoryPath of getCategoryPaths(article.category)) {
			options.set(categoryPath, (options.get(categoryPath) ?? 0) + 1);
		}

		return options;
	}, new Map<string, number>()),
).sort(([left], [right]) => {
	if (left === uncategorizedValue) return 1;
	if (right === uncategorizedValue) return -1;
	return left.localeCompare(right);
});

$: filteredRows = articleRows.filter(({ article }) => matchesCategory(article));
$: totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
$: if (currentPage > totalPages) currentPage = totalPages;
$: pageStart = (currentPage - 1) * pageSize;
$: pageEnd = Math.min(pageStart + pageSize, filteredRows.length);
$: visibleRows = filteredRows.slice(pageStart, pageEnd);
$: displayStart = filteredRows.length === 0 ? 0 : pageStart + 1;

function goToPage(page: number) {
	currentPage = Math.min(Math.max(page, 1), totalPages);
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

	<div class="mt-4 flex flex-col gap-3 border-t border-black/5 pt-4 text-sm text-50 dark:border-white/10 md:flex-row md:items-center md:justify-between">
		<div class="flex flex-col gap-2 md:flex-row md:items-center">
			<span class="font-semibold text-75">Category</span>
			<div class="relative">
				<button
					class="btn-plain flex h-9 min-w-44 items-center justify-between gap-3 rounded-lg px-3 text-sm font-semibold"
					type="button"
					aria-expanded={categoryMenuOpen}
					on:click={() => (categoryMenuOpen = !categoryMenuOpen)}
				>
					<span class="max-w-44 truncate">{getCategoryLabel(selectedCategory)}</span>
					<span class="text-[0.5rem] text-30">v</span>
				</button>
				{#if categoryMenuOpen}
					<div class="absolute left-0 top-10 z-30 max-h-56 w-64 overflow-y-auto rounded-lg border border-black/10 bg-[var(--card-bg)] p-1 shadow-lg dark:border-white/10">
						<button
							class="block w-full rounded-md px-3 py-2 text-left text-sm text-75 hover:bg-black/5 dark:hover:bg-white/10"
							type="button"
							on:click={() => selectCategory("")}
						>
							All categories ({articles.length})
						</button>
						{#each categoryOptions as [category, count]}
							<button
								class="block w-full rounded-md px-3 py-2 text-left text-sm text-75 hover:bg-black/5 dark:hover:bg-white/10"
								type="button"
								on:click={() => selectCategory(category)}
							>
								{getCategoryLabel(category)} ({count})
							</button>
						{/each}
					</div>
				{/if}
			</div>
			<span>
				Showing {displayStart}-{pageEnd} of {filteredRows.length}
			</span>
		</div>
		<div class="flex items-center gap-2">
			<button
				class="btn-plain h-9 rounded-lg px-3 text-sm font-bold disabled:opacity-40"
				type="button"
				disabled={currentPage <= 1}
				on:click={() => goToPage(currentPage - 1)}
			>
				Previous
			</button>
			<span class="min-w-20 text-center text-sm text-50">
				{currentPage} / {totalPages}
			</span>
			<button
				class="btn-plain h-9 rounded-lg px-3 text-sm font-bold disabled:opacity-40"
				type="button"
				disabled={currentPage >= totalPages}
				on:click={() => goToPage(currentPage + 1)}
			>
				Next
			</button>
		</div>
	</div>

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

	{#if totalPages > 1}
		<div class="mt-4 flex items-center justify-end gap-2 border-t border-black/5 pt-4 dark:border-white/10">
			<button
				class="btn-plain h-9 rounded-lg px-3 text-sm font-bold disabled:opacity-40"
				type="button"
				disabled={currentPage <= 1}
				on:click={() => goToPage(currentPage - 1)}
			>
				Previous
			</button>
			<span class="min-w-20 text-center text-sm text-50">
				{currentPage} / {totalPages}
			</span>
			<button
				class="btn-plain h-9 rounded-lg px-3 text-sm font-bold disabled:opacity-40"
				type="button"
				disabled={currentPage >= totalPages}
				on:click={() => goToPage(currentPage + 1)}
			>
				Next
			</button>
		</div>
	{/if}
</section>
