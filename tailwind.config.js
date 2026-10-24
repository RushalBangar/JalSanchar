/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./frontend/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#1A5276",
        "primary-light": "#2E86C1",
        "primary-dark": "#154360",
        "primary-container": "#EBF5FB",
        "on-primary": "#FFFFFF",
        "on-primary-container": "#154360",
        "secondary": "#148F77",
        "secondary-light": "#1ABC9C",
        "secondary-dark": "#117A65",
        "secondary-container": "#E8F8F5",
        "on-secondary": "#FFFFFF",
        "on-secondary-container": "#0E6251",
        "tertiary": "#D4AC0D",
        "tertiary-container": "#FEF9E7",
        "safe-emerald": "#27AE60",
        "safe-emerald-glow": "rgba(39, 174, 96, 0.12)",
        "warning-amber": "#E67E22",
        "warning-amber-glow": "rgba(230, 126, 34, 0.12)",
        "alert-crimson": "#E74C3C",
        "alert-crimson-glow": "rgba(231, 76, 60, 0.12)",
        "error": "#E74C3C",
        "error-container": "#FDEDEC",
        "on-error": "#FFFFFF",
        "on-error-container": "#78281F",
        "surface": "#FFFFFF",
        "surface-base": "#FAFBFC",
        "surface-panel": "#FFFFFF",
        "surface-card": "#FFFFFF",
        "surface-container": "#F4F6F8",
        "surface-container-low": "#FAFBFC",
        "surface-container-high": "#EAEDED",
        "surface-container-highest": "#D5D8DC",
        "surface-container-lowest": "#FFFFFF",
        "surface-bright": "#FFFFFF",
        "on-surface": "#1C2833",
        "on-surface-variant": "#566573",
        "text-muted": "#7F8C8D",
        "muted-foreground": "#566573",
        "outline": "#D5D8DC",
        "outline-variant": "#BDC3C7",
        "border-subtle": "#E5E8E8",
        "border-active": "#1A5276",
        "telemetry-cyan-glow": "rgba(26, 82, 118, 0.12)"
      },
      fontFamily: {
        "body-lg": ["Source Sans 3", "sans-serif"],
        "body-md": ["Source Sans 3", "sans-serif"],
        "body-sm": ["Source Sans 3", "sans-serif"],
        "headline-lg": ["Outfit", "sans-serif"],
        "headline-md": ["Outfit", "sans-serif"],
        "headline-sm": ["Outfit", "sans-serif"],
        "telemetry-code": ["IBM Plex Mono", "monospace"],
        "telemetry-metric": ["IBM Plex Mono", "monospace"],
        "label-tactical": ["IBM Plex Mono", "monospace"]
      }
    }
  },
  plugins: []
};
