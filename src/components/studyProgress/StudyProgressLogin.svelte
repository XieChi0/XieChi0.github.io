<script lang="ts">
export let loading = false;
export let error = "";
export let onLogin: (password: string) => void | Promise<void> = () => {};

let password = "";

function submit() {
	if (!password.trim() || loading) return;
	onLogin(password);
}
</script>

<section class="card-base px-6 py-6 md:px-9">
	<div class="max-w-md">
		<p class="text-sm font-semibold text-[var(--primary)]">Study Progress</p>
		<h1 class="mt-2 text-2xl font-bold text-90">Personal study progress</h1>
		<p class="mt-3 text-sm leading-6 text-50">
			Enter your study password to sync progress with Supabase.
		</p>

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
