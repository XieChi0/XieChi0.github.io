<script lang="ts">
import type { StudyGoal } from "@/lib/studyProgress/types";

export let goals: StudyGoal[] = [];
</script>

<section class="card-base px-4 py-4 md:px-6">
	<h2 class="text-lg font-bold text-90">目标模式</h2>
	<p class="mt-1 text-sm leading-6 text-50">
		第一版先读取目标表，创建和关联文章放到下一步。现在这里用来确认数据库结构没有堵死后续规划功能。
	</p>

	<div class="mt-4 flex flex-col gap-2">
		{#if goals.length === 0}
			<div class="rounded-xl border border-dashed border-black/10 px-4 py-5 text-sm text-50 dark:border-white/10">
				还没有学习目标。
			</div>
		{:else}
			{#each goals as goal}
				<div class="rounded-xl border border-black/5 px-4 py-3 dark:border-white/10">
					<div class="font-semibold text-75">{goal.title}</div>
					<div class="mt-1 text-sm text-50">{goal.topic || "未设置主题"}</div>
				</div>
			{/each}
		{/if}
	</div>
</section>
