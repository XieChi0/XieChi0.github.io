import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type StudyProgressSupabaseConfig = {
	url: string;
	publishableKey: string;
	ownerEmail: string;
	source: "env" | "local";
};

const storageKey = "studyProgress.supabaseConfig";
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const ownerEmail = import.meta.env.PUBLIC_STUDY_OWNER_EMAIL;

function getEnvConfig(): StudyProgressSupabaseConfig | null {
	if (!supabaseUrl || !supabaseKey) return null;

	return {
		url: supabaseUrl,
		publishableKey: supabaseKey,
		ownerEmail: ownerEmail ?? "",
		source: "env",
	};
}

function canUseLocalStorage() {
	return typeof window !== "undefined" && Boolean(window.localStorage);
}

function normalizeConfigValue(value: string | undefined) {
	return (value ?? "").trim().replace(/^["']|["']$/g, "");
}

function getLocalConfig(): StudyProgressSupabaseConfig | null {
	if (!canUseLocalStorage()) return null;

	try {
		const raw = window.localStorage.getItem(storageKey);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as Partial<StudyProgressSupabaseConfig>;
		const url = normalizeConfigValue(parsed.url);
		const publishableKey = normalizeConfigValue(parsed.publishableKey);
		const localOwnerEmail = normalizeConfigValue(parsed.ownerEmail);
		if (!url || !publishableKey) return null;

		return {
			url,
			publishableKey,
			ownerEmail: localOwnerEmail,
			source: "local",
		};
	} catch {
		return null;
	}
}

export function parseStudyProgressSupabaseConfig(
	text: string,
): StudyProgressSupabaseConfig {
	const values = new Map<string, string>();
	for (const line of text.split(/\r?\n/)) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const separatorIndex = trimmed.indexOf("=");
		if (separatorIndex === -1) continue;
		const key = trimmed.slice(0, separatorIndex).trim();
		const value = normalizeConfigValue(trimmed.slice(separatorIndex + 1));
		values.set(key, value);
	}

	const url = normalizeConfigValue(values.get("PUBLIC_SUPABASE_URL"));
	const publishableKey = normalizeConfigValue(
		values.get("PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
	);
	const localOwnerEmail = normalizeConfigValue(
		values.get("PUBLIC_STUDY_OWNER_EMAIL"),
	);

	if (!url || !publishableKey || !localOwnerEmail) {
		throw new Error(
			"Please paste PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, and PUBLIC_STUDY_OWNER_EMAIL.",
		);
	}
	if (!/^https?:\/\//.test(url)) {
		throw new Error("PUBLIC_SUPABASE_URL must start with http:// or https://.");
	}
	if (!localOwnerEmail.includes("@")) {
		throw new Error("PUBLIC_STUDY_OWNER_EMAIL must be an email address.");
	}

	return {
		url,
		publishableKey,
		ownerEmail: localOwnerEmail,
		source: "local",
	};
}

export function saveStudyProgressSupabaseConfig(text: string) {
	if (!canUseLocalStorage()) {
		throw new Error("Local storage is unavailable in this browser.");
	}

	const config = parseStudyProgressSupabaseConfig(text);
	window.localStorage.setItem(storageKey, JSON.stringify(config));
	return config;
}

export function clearStudyProgressSupabaseConfig() {
	if (canUseLocalStorage()) {
		window.localStorage.removeItem(storageKey);
	}
}

export function getStudyProgressSupabaseConfig() {
	return getEnvConfig() ?? getLocalConfig();
}

export function hasSupabaseClientEnv() {
	return Boolean(getStudyProgressSupabaseConfig());
}

export function getStudyOwnerEmail() {
	return getStudyProgressSupabaseConfig()?.ownerEmail ?? "";
}

export function createStudyProgressSupabaseClient(): SupabaseClient {
	const config = getStudyProgressSupabaseConfig();
	if (!config) {
		throw new Error(
			"Missing Supabase environment variables for studyProgress.",
		);
	}

	return createClient(config.url, config.publishableKey, {
		auth: {
			persistSession: true,
			autoRefreshToken: true,
			detectSessionInUrl: false,
		},
	});
}
