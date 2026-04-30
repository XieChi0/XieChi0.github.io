import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "XChi的云端",
	subtitle: "Demo Site",
	lang: "en", // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'es', 'th'
	themeColor: {
		hue: 270, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "assets/images/demo-banner.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		// Avatar favicon
		{
			src: "/favicon/favicon-light-32.png",
			theme: "light",
			sizes: "32x32",
		},
		{
			src: "/favicon/favicon-light-128.png",
			theme: "light",
			sizes: "128x128",
		},
		{
			src: "/favicon/favicon-light-180.png",
			theme: "light",
			sizes: "180x180",
		},
		{
			src: "/favicon/favicon-light-192.png",
			theme: "light",
			sizes: "192x192",
		},
		{
			src: "/favicon/favicon-dark-32.png",
			theme: "dark",
			sizes: "32x32",
		},
		{
			src: "/favicon/favicon-dark-128.png",
			theme: "dark",
			sizes: "128x128",
		},
		{
			src: "/favicon/favicon-dark-180.png",
			theme: "dark",
			sizes: "180x180",
		},
		{
			src: "/favicon/favicon-dark-192.png",
			theme: "dark",
			sizes: "192x192",
		},
	],
};
// 导航栏配置
export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		// {
		// 	name: "GitHub",
		// 	url: "https://github.com/saicaca/fuwari", // Internal links should not include the base path, as it is automatically added
		// 	external: true, // Show an external link icon and will open in a new tab
		// },
		LinkPreset.Category,
		LinkPreset.Tags,
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/demo-avatar.png", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "XChi",
	bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	links: [
		// 		{
		// name: "Twitter",
		// 		icon: "fa6-brands:twitter", // Visit https://icones.js.org/ for icon codes
		// 		// You will need to install the corresponding icon set if it's not already included
		// 		// `pnpm add @iconify-json/<icon-set-name>`
		// 		url: "https://twitter.com",
		// 		},
		// 		{
		// name: "Steam",
		// 		icon: "fa6-brands:steam",
		// 		url: "https://store.steampowered.com",
		// 		},
		// 		{
		// name: "GitHub",
		// 		icon: "fa6-brands:github",
		// 		url: "https://github.com/saicaca/fuwari",
		// 		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	// Please select a dark theme, as this blog theme currently only supports dark background color
	theme: "github-dark",
};
