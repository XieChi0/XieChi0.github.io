<script lang="ts">
export let loading = false;
export let error = "";
export let configMissing = false;
export let onLogin: (password: string) => void | Promise<void> = () => {};
export let onSaveConfig: (text: string) => void | Promise<void> = () => {};
export let onClearConfig: () => void | Promise<void> = () => {};

let password = "";
let configText = "";

function submit() {
	if (!password.trim() || loading) return;
	onLogin(password);
}

function saveConfig() {
	if (!configText.trim() || loading) return;
	onSaveConfig(configText);
}
</script>

<section class="card-base px-6 py-6 md:px-9">
	<div class="max-w-md">
		<p class="text-sm font-semibold text-[var(--primary)]">Study Progress</p>
		<h1 class="mt-2 text-2xl font-bold text-90">Personal study progress</h1>
		<p class="mt-3 text-sm leading-6 text-50">
			Enter your study password to sync progress with Supabase.
		</p>

		{#if configMissing}
			<div class="mt-6 rounded-xl border border-dashed border-black/15 bg-black/[0.02] p-4 dark:border-white/15 dark:bg-white/[0.03]">
				<p class="text-sm font-semibold text-90">Local Supabase config</p>
				<textarea
					class="mt-3 min-h-32 w-full resize-y rounded-xl border border-black/10 bg-white/80 px-4 py-3 font-mono text-xs outline-none transition focus:border-[var(--primary)] dark:border-white/10 dark:bg-white/5"
					bind:value={configText}
					placeholder="PUBLIC_SUPABASE_URL=...
PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
PUBLIC_STUDY_OWNER_EMAIL=..."
					spellcheck="false"
				/>
				<div class="mt-3 flex flex-wrap gap-2">
					<button
						class="btn-regular h-10 rounded-xl px-4 text-sm font-bold disabled:opacity-50"
						type="button"
						disabled={loading}
						on:click={saveConfig}
					>
						Save config locally
					</button>
					<button
						class="h-10 rounded-xl border border-black/10 px-4 text-sm font-semibold text-75 disabled:opacity-50 dark:border-white/10"
						type="button"
						disabled={loading}
						on:click={onClearConfig}
					>
						Clear saved config
					</button>
				</div>
			</div>
		{/if}

		<form class="mt-6 flex flex-col gap-3" on:submit|preventDefault={submit}>
			<input
				class="h-11 rounded-xl border border-black/10 bg-white/80 px-4 text-sm outline-none transition focus:border-[var(--primary)] dark:border-white/10 dark:bg-white/5"
				type="password"
				bind:value={password}
				placeholder="Password"
				autocomplete="current-password"
			/>
			<button
				class="btn-regular h-11 rounded-xl px-4 text-sm font-bold disabled:opacity-50"
				type="submit"
				disabled={loading}
			>
				{loading ? "Signing in..." : "Enter study center"}
			</button>
		</form>

		{#if error}
			<p class="mt-4 text-sm text-red-500">{error}</p>
		{/if}
	</div>
</section>
