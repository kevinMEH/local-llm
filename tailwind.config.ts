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
            "bg-mid": "#101C1E",
            "bg-dark": "#0D1719",

            // Border
            "highlight": "#15383E",

            // Text
            "main": "#E9F6EC",
            "sub": "#B2D1B7",
            "quiet": "#7A9984",
            
            "link": "#06B6D4",
            "error": "#F43F5E"
        },
        fontFamily: {
            "inter": ["var(--font-inter)"],
            "mono": ["var(--font-mono)"]
        }
    },
    plugins: [],
}

export default config;