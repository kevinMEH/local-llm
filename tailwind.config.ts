import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        colors: {
            "transparent": "transparent",
            "current": "currentColor",

            // Backgrounds
            "bg-light": "#132325",
            "bg-dark": "#0D1719",

            // Border
            "highlight": "#15383E",

            // Text
            "main": "#E9F6EC",
            "sub": "#97B699"
        },
        fontFamily: {
            "inter": ["var(--font-inter)"]
        }
    },
    plugins: [],
}

export default config;