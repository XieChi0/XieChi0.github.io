<script lang="ts">
import { onMount } from "svelte";
import { createStudyProgressApi } from "@/lib/studyProgress/study-progress-api";
import type { StudyArticle, StudySession } from "@/lib/studyProgress/types";

export let article: StudyArticle;
export let targetId = "";

const api = createStudyProgressApi();

let session: StudySession | null = null;
let progressPercent = 0;
let password = "";
let panelOpen = false;
let loading = true;
let saving = false;
let message = "";
let error = "";
let cleanup: (() => void) | undefined;

function getErrorMessage(value: unknown) {
	return value instanceof Error ? value.message : String(value);
}

function clampPercent(value: number) {
	return Math.min(100, Math.max(0, Math.round(value)));
}

function calculateProgress() {
	const target = document.getElementById(targetId);
	if (!target) {
		progressPercent = 0;
		return;
	}

	const rect = target.getBoundingClientRect();
	const pageTop = window.scrollY + rect.top;
	const contentHeight = target.scrollHeight;
	const readableDistance = Math.max(1, contentHeight - window.innerHeight);
	const current = window.scrollY - pageTop;

	progressPercent = clampPercent((current / readableDistance) * 100);
}

async function loadSession() {
	loading = true;
	try {
		session = await api.getSession();
	} catch (err) {
		error = getErrorMessage(err);
	} finally {
		loading = false;
	}
}

async function saveCurrentProgress() {
	saving = true;
	error = "";
	message = "";
	try {
		const saved = await api.saveProgress({
			article,
			progressPercent,
		});
		message = `已保存 ${saved.progressPercent}%`;
		panelOpen = true;
	} catch (err) {
		error = getErrorMessage(err);
		panelOpen = true;
	} finally {
		saving = false;
	}
}

async function handleClick() {
	calculateProgress();
	if (!session) {
		panelOpen = true;
		return;
	}
	await saveCurrentProgress();
}

async function submitPassword() {
	if (!password.trim() || saving || loading) return;

	saving = true;
	error = "";
	message = "";
	try {
		await api.signIn(password);
		session = await api.getSession();
		password = "";
		await saveCurrentProgress();
	} catch (err) {
		error = getErrorMessage(err);
	} finally {
		saving = false;
	}
}

onMount(() => {
	let ticking = false;

	const update = () => {
		ticking = false;
		calculateProgress();
	};

	const requestUpdate = () => {
		if (ticking) return;
		ticking = true;
		window.requestAnimationFrame(update);
	};

	calculateProgress();
	void loadSession();
	window.addEventListener("scroll", requestUpdate, { passive: true });
	window.addEventListener("resize", requestUpdate);

	cleanup = () => {
		window.removeEventListener("scroll", requestUpdate);
		window.removeEventListener("resize", requestUpdate);
	};

	return cleanup;
});
</script>

<div class="article-progress-saver">
	{#if panelOpen}
		<section class="article-progress-saver__panel" aria-live="polite">
			<div class="article-progress-saver__header">
				<div>
					<p>阅读进度</p>
					<strong>{progressPercent}%</strong>
				</div>
				<button
					class="article-progress-saver__close"
					type="button"
					aria-label="关闭"
					on:click={() => (panelOpen = false)}
				>
					x
				</button>
			</div>

			{#if session}
				<button
					class="article-progress-saver__primary"
					type="button"
					disabled={saving}
					on:click={saveCurrentProgress}
				>
					{saving ? "保存中..." : "保存当前进度"}
				</button>
			{:else}
				<form class="article-progress-saver__form" on:submit|preventDefault={submitPassword}>
					<input
						type="password"
						bind:value={password}
						placeholder="学习中心密码"
						autocomplete="current-password"
						disabled={saving || loading}
					/>
					<button type="submit" disabled={saving || loading || !password.trim()}>
						{saving ? "验证中..." : "登录并保存"}
					</button>
				</form>
			{/if}

			{#if message}
				<p class="article-progress-saver__message">{message}</p>
			{/if}
			{#if error}
				<p class="article-progress-saver__error">{error}</p>
			{/if}
		</section>
	{/if}

	<button
		class="article-progress-saver__trigger"
		type="button"
		aria-label={`保存阅读进度 ${progressPercent}%`}
		disabled={saving}
		on:click={handleClick}
	>
		<span>{progressPercent}%</span>
		<small>{saving ? "..." : "保存"}</small>
	</button>
</div>

<style>
.article-progress-saver {
	position: fixed;
	right: max(1rem, env(safe-area-inset-right));
	bottom: max(5.5rem, env(safe-area-inset-bottom));
	z-index: 60;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 0.75rem;
}

.article-progress-saver__trigger {
	display: flex;
	width: 4.25rem;
	height: 4.25rem;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 1px solid rgba(0, 0, 0, 0.08);
	border-radius: 999px;
	background: var(--primary);
	box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
	color: white;
	font-weight: 800;
	transition:
		transform 0.2s ease,
		opacity 0.2s ease;
}

.article-progress-saver__trigger:hover {
	transform: translateY(-2px);
}

.article-progress-saver__trigger:disabled {
	cursor: wait;
	opacity: 0.72;
}

.article-progress-saver__trigger span {
	font-size: 1rem;
	line-height: 1;
}

.article-progress-saver__trigger small {
	margin-top: 0.25rem;
	font-size: 0.7rem;
	line-height: 1;
}

.article-progress-saver__panel {
	width: min(calc(100vw - 2rem), 20rem);
	border: 1px solid rgba(0, 0, 0, 0.1);
	border-radius: 1rem;
	background: rgba(255, 255, 255, 0.96);
	padding: 1rem;
	box-shadow: 0 18px 50px rgba(0, 0, 0, 0.16);
	color: rgba(0, 0, 0, 0.84);
	backdrop-filter: blur(12px);
}

:global(.dark) .article-progress-saver__panel {
	border-color: rgba(255, 255, 255, 0.12);
	background: rgba(30, 30, 34, 0.94);
	color: rgba(255, 255, 255, 0.88);
}

.article-progress-saver__header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 1rem;
	margin-bottom: 0.9rem;
}

.article-progress-saver__header p {
	margin: 0 0 0.2rem;
	color: rgba(0, 0, 0, 0.52);
	font-size: 0.78rem;
}

:global(.dark) .article-progress-saver__header p {
	color: rgba(255, 255, 255, 0.56);
}

.article-progress-saver__header strong {
	font-size: 1.45rem;
	line-height: 1;
}

.article-progress-saver__close {
	display: flex;
	width: 1.75rem;
	height: 1.75rem;
	align-items: center;
	justify-content: center;
	border: 0;
	border-radius: 999px;
	background: rgba(0, 0, 0, 0.06);
	color: currentColor;
	font-size: 0.9rem;
}

:global(.dark) .article-progress-saver__close {
	background: rgba(255, 255, 255, 0.1);
}

.article-progress-saver__primary,
.article-progress-saver__form button {
	width: 100%;
	height: 2.65rem;
	border: 0;
	border-radius: 0.75rem;
	background: var(--primary);
	color: white;
	font-size: 0.9rem;
	font-weight: 800;
}

.article-progress-saver__form {
	display: flex;
	flex-direction: column;
	gap: 0.65rem;
}

.article-progress-saver__form input {
	height: 2.65rem;
	border: 1px solid rgba(0, 0, 0, 0.12);
	border-radius: 0.75rem;
	background: rgba(255, 255, 255, 0.86);
	padding: 0 0.85rem;
	outline: none;
}

:global(.dark) .article-progress-saver__form input {
	border-color: rgba(255, 255, 255, 0.12);
	background: rgba(255, 255, 255, 0.06);
	color: rgba(255, 255, 255, 0.9);
}

.article-progress-saver__form input:focus {
	border-color: var(--primary);
}

.article-progress-saver__primary:disabled,
.article-progress-saver__form button:disabled,
.article-progress-saver__form input:disabled {
	cursor: not-allowed;
	opacity: 0.55;
}

.article-progress-saver__message,
.article-progress-saver__error {
	margin: 0.75rem 0 0;
	font-size: 0.82rem;
	line-height: 1.5;
}

.article-progress-saver__message {
	color: rgb(34, 150, 84);
}

.article-progress-saver__error {
	color: rgb(239, 68, 68);
}

@media (max-width: 640px) {
	.article-progress-saver {
		right: max(0.75rem, env(safe-area-inset-right));
		bottom: max(4.75rem, env(safe-area-inset-bottom));
	}

	.article-progress-saver__trigger {
		width: 3.75rem;
		height: 3.75rem;
	}
}
</style>
