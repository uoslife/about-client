import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
			},
			fontFamily: {
				bold: ["Pretendard-Bold", "sans-serif"],
				semibold: ["Pretendard-SemiBold", "sans-serif"],
				medium: ["Pretendard-Medium", "sans-serif"],
			},
		},
	},
	plugins: [],
};
export default config;
