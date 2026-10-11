/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./frontend/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#4cd7f6",
        "primary-container": "#06b6d4",
        "on-primary": "#003640",
        "on-primary-container": "#00424f",
        "secondary": "#7bd0ff",
        "secondary-container": "#00a6e0",
        "on-secondary": "#00354a",
        "on-secondary-container": "#00374d",
        "tertiary": "#4edea3",
        "tertiary-container": "#1bbd85",
        "safe-emerald": "#10B981",
        "safe-emerald-glow": "rgba(16, 185, 129, 0.2)",
        "warning-amber": "#F59E0B",
        "warning-amber-glow": "rgba(245, 158, 11, 0.2)",
        "alert-crimson": "#EF4444",
        "alert-crimson-glow": "rgba(239, 68, 68, 0.2)",
        "error": "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
        "surface": "#0d1320",
        "surface-base": "#0B111E",
        "surface-panel": "#111A2E",
        "surface-card": "#17233D",
        "surface-container": "#1a1f2d",
        "surface-container-low": "#161b29",
        "surface-container-high": "#242a38",
        "surface-container-highest": "#2f3543",
        "surface-container-lowest": "#080e1b",
        "surface-bright": "#333948",
        "on-surface": "#dde2f5",
        "on-surface-variant": "#bcc9cd",
        "text-muted": "#94A3B8",
        "muted-foreground": "#94A3B8",
        "outline": "#869397",
        "outline-variant": "#3d494c",
        "border-subtle": "rgba(56, 189, 248, 0.14)",
        "border-active": "rgba(6, 182, 212, 0.45)",
        "telemetry-cyan-glow": "rgba(6, 182, 212, 0.2)"
      },
      fontFamily: {
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "headline-lg": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "headline-md": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "headline-sm": ["Plus Jakarta Sans", "Inter", "sans-serif"],
        "telemetry-code": ["JetBrains Mono", "monospace"],
        "telemetry-metric": ["JetBrains Mono", "monospace"],
        "label-tactical": ["JetBrains Mono", "monospace"]
      }
    }
  },
  plugins: []
};
