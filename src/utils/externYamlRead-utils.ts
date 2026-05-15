import fs from "fs";
import path from "path";
import { getCollection } from "astro:content";

export interface ExternalEntry {
	slug: string;
	meta: {
		title: string;
		published: Date;
		updated?: Date;
		draft?: boolean;
		description?: string;
		tags?: string[];
		lang?: string;
	};
	filePath: string;
	extension: string;
}

const EXTERNAL_DIR = "./src/content/external";

export async function getExternalEntriesWithExternal(): Promise<ExternalEntry[]> {
	if (!fs.existsSync(EXTERNAL_DIR)) return [];

	const files = fs.readdirSync(EXTERNAL_DIR);
	const entries: ExternalEntry[] = [];

	// 获取 content collections 中的外部元数据
	const metaEntries = await getCollection("externalMeta");
	// data collection 的 id 可能是 "nodejs-learning-plan" 或 "nodejs-learning-plan.yaml"
	const metaMap = new Map(
		metaEntries.map((m) => [m.id.replace(/\.(yaml|yml|json|toml)$/, ""), m.data])
	);

	for (const file of files) {
		// 跳过 yaml 目录本身和子目录
		if (file === "yaml" || !fs.statSync(path.join(EXTERNAL_DIR, file)).isFile()) continue;

		const baseName = path.basename(file, path.extname(file));

		// 没有 YAML 配置则跳过
		const meta = metaMap.get(baseName);
		if (!meta) continue;

		// 生产环境过滤 draft
		if (import.meta.env.PROD && meta.draft === true) continue;

		entries.push({
			slug: baseName,
			meta,
			filePath: path.join(EXTERNAL_DIR, file),
			extension: path.extname(file),
		});
	}

	return entries;
}
