import { getSortedPosts } from "@utils/content-utils";
import { getPostUrlBySlug, url } from "@utils/url-utils";
import type { StudyArticle, StudyArticleSource } from "./types";

function toDateString(value: Date | string | undefined): string {
	if (!value) return "";
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	return date.toISOString();
}

function normalizeSource(source: unknown): StudyArticleSource {
	return source === "external" ? "external" : "posts";
}

export async function getStudyProgressArticles(): Promise<StudyArticle[]> {
	const entries = await getSortedPosts(true);

	return entries.map((entry) => {
		const source = normalizeSource("source" in entry ? entry.source : "posts");
		const articleUrl =
			source === "external"
				? url(`/posts/${entry.slug}/`)
				: getPostUrlBySlug(entry.slug);

		return {
			id: entry.slug,
			source,
			title: entry.data.title,
			url: articleUrl,
			category: entry.data.category ?? "",
			tags: entry.data.tags ?? [],
			published: toDateString(entry.data.published),
		};
	});
}
