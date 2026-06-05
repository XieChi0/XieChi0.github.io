<script lang="ts">
import { onMount } from "svelte";
import { createStudyProgressApi } from "@/lib/studyProgress/study-progress-api";

export let targetId = "";
export let title = "私密文章";

const api = createStudyProgressApi();

let password = "";
let loading = true;
let unlocked = false;
let error = "";

function getErrorMessage(value: unknown) {
	return value instanceof Error ? value.message : String(value);
}

function unlockContent() {
	unlocked = true;
	const target = document.getElementById(targetId);
	target?.classList.add("is-unlocked");
}

async function loadSession() {
	loading = true;
	error = "";
	try {
		const session = await api.getSession();
		if (session) unlockContent();
	} catch (err) {
		error = getErrorMessage(err);
	} finally {
		loading = false;
	}
}

async function submit() {
	if (!password.trim() || loading) return;

	loading = true;
	error = "";
	try {
		await api.signIn(password);
		unlockContent();
		password = "";
	} catch (err) {
		error = getErrorMessage(err);
	} finally {
		loading = false;
	}
}

onMount(loadSession);
</script>

{#if !unlocked}
	<section class="private-post-gate" aria-label="私密文章解锁">
		<div class="private-post-gate__panel">
			<p class="private-post-gate__eyebrow">私密文章</p>
			<h2>{title}</h2>
			<p>输入学习中心密码后，可以在浏览器中阅读这篇文章。</p>

			<form class="private-post-gate__form" on:submit|preventDefault={submit}>
				<input
					type="password"
					bind:value={password}
					placeholder="密码"
					autocomplete="current-password"
					disabled={loading}
				/>
				<button type="submit" disabled={loading || !password.trim()}>
					{loading ? "验证中..." : "解锁"}
				</button>
			</form>

			{#if error}
				<p class="private-post-gate__error">{error}</p>
			{/if}
		</div>
	</section>
{/if}

<style>
.private-post-gate {
	position: absolute;
	inset: 0;
	z-index: 20;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	min-height: 360px;
	padding: 2rem 1rem;
	background: linear-gradient(
		to bottom,
		rgba(255, 255, 255, 0.88),
		rgba(255, 255, 255, 0.98)
	);
	backdrop-filter: blur(10px);
}

:global(.dark) .private-post-gate {
	background: linear-gradient(
		to bottom,
		rgba(24, 24, 27, 0.82),
		rgba(24, 24, 27, 0.96)
	);
}

.private-post-gate__panel {
	width: min(100%, 28rem);
	border: 1px solid rgba(0, 0, 0, 0.1);
	border-radius: 1rem;
	background: rgba(255, 255, 255, 0.92);
	padding: 1.5rem;
	color: rgba(0, 0, 0, 0.86);
}

:global(.dark) .private-post-gate__panel {
	border-color: rgba(255, 255, 255, 0.12);
	background: rgba(30, 30, 34, 0.94);
	color: rgba(255, 255, 255, 0.88);
}

.private-post-gate__eyebrow {
	margin: 0 0 0.5rem;
	color: var(--primary);
	font-size: 0.8rem;
	font-weight: 700;
}

.private-post-gate h2 {
	margin: 0;
	font-size: 1.35rem;
	font-weight: 800;
}

.private-post-gate p {
	margin: 0.75rem 0 0;
	color: rgba(0, 0, 0, 0.58);
	font-size: 0.9rem;
	line-height: 1.6;
}

:global(.dark) .private-post-gate p {
	color: rgba(255, 255, 255, 0.58);
}

.private-post-gate__form {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	align-items: stretch;
	gap: 0.75rem;
	margin-top: 1.25rem;
}

.private-post-gate input {
	min-width: 0;
	width: 100%;
	min-height: 2.75rem;
	border: 1px solid rgba(0, 0, 0, 0.12);
	border-radius: 0.75rem;
	background: rgba(255, 255, 255, 0.86);
	padding: 0 0.9rem;
	outline: none;
}

:global(.dark) .private-post-gate input {
	border-color: rgba(255, 255, 255, 0.12);
	background: rgba(255, 255, 255, 0.06);
	color: rgba(255, 255, 255, 0.9);
}

.private-post-gate input:focus {
	border-color: var(--primary);
}

.private-post-gate button {
	min-height: 2.75rem;
	border: 0;
	border-radius: 0.75rem;
	background: var(--primary);
	color: white;
	padding: 0 1rem;
	font-size: 0.9rem;
	font-weight: 800;
	white-space: nowrap;
}

.private-post-gate button:disabled,
.private-post-gate input:disabled {
	cursor: not-allowed;
	opacity: 0.55;
}

.private-post-gate__error {
	color: rgb(239, 68, 68) !important;
}

@media (max-width: 640px) {
	.private-post-gate {
		padding: 1rem 0.75rem;
	}

	.private-post-gate__form {
		grid-template-columns: minmax(0, 1fr);
		gap: 0.65rem;
	}

	.private-post-gate button {
		width: 100%;
	}

	.private-post-gate input,
	.private-post-gate button {
		min-height: 2.625rem;
	}
}
</style>
