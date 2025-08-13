import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 12,
      sourceType: "module",
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        location: "readonly",
        alert: "readonly",
        console: "readonly",
        confirm: "readonly",
        MutationObserver: "readonly",
        URLSearchParams: "readonly",
        fetch: "readonly",
        localStorage: "readonly",
        Event: "readonly", // ✅ Add this

        // Node globals (for vite.config.js and config files)
        __dirname: "readonly",
        process: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
