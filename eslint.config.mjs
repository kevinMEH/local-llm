import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });
const config = [
    ...compat.config({
        extends: ["next/core-web-vitals", "next/typescript"],
        rules: {
            "react/no-unescaped-entities": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    caughtErrorsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                },
            ],
        },
    }),
];
export default config;
